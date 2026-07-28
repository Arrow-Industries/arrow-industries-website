/**
 * Microsoft 365 (Microsoft Graph) sender — app-only / client-credentials flow.
 *
 * This was the only sender until the move to Google Workspace. It is kept, not
 * deleted: a cutover you can't reverse without a code change isn't a cutover,
 * it's a leap. Flipping MAIL_PROVIDER=graph puts it back in front.
 *
 * It is no longer the default, and it is no longer strictly correct: since the
 * MX cutover, SPF for arrowindustries.com.au authorises Google only, so mail
 * sent this way FAILS SPF. It may still pass DMARC on the surviving Microsoft
 * DKIM signature (selector1/selector2 still resolve), but that is survival, not
 * correctness, and it ends the moment DMARC is tightened past p=none.
 *
 * Attachments, unchanged from the original implementation:
 *   - Total <= INLINE_LIMIT (3 MB): inlined as base64 in one `sendMail` call.
 *   - Larger: create a draft, stream each attachment through a chunked upload
 *     session, then send the draft. Lifts the ~3-4 MB inline ceiling to Graph's
 *     150 MB message limit.
 *
 * Server-only env: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET,
 * MAIL_FROM.
 */

import type { MailAttachment, SendMailOptions } from "@/lib/integrations/mail-types";
import { toList } from "@/lib/integrations/mail-types";

const GRAPH = "https://graph.microsoft.com/v1.0";

// Total attachment bytes at/under which we inline (base64 inflates ~33%, so
// this stays comfortably under Graph's single-request message limit).
const INLINE_LIMIT = 3 * 1024 * 1024;
// Upload-session chunk size — must be a multiple of 320 KB and < 4 MB.
const CHUNK = 320 * 1024 * 10; // 3,276,800 bytes

// Read lazily rather than at module load: a value captured at import time is
// baked in wherever the module first evaluates, which has surprised us before.
const T = () => process.env.AZURE_TENANT_ID;
const ID = () => process.env.AZURE_CLIENT_ID;
const SEC = () => process.env.AZURE_CLIENT_SECRET;
const FROM = () => process.env.MAIL_FROM;

export function graphConfigured(): boolean {
  return Boolean(T() && ID() && SEC() && FROM());
}

let cached: { token: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.exp) return cached.token;
  const res = await fetch(`https://login.microsoftonline.com/${T()}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: ID()!,
      client_secret: SEC()!,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`MS token ${res.status}: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return cached.token;
}

/**
 * Diagnostic: confirm the app-only credentials can obtain a token. Sends
 * nothing. This is the step that fails when the client secret has expired, the
 * tenant/client ids are wrong, or admin consent is missing.
 */
export async function verifyGraph(): Promise<void> {
  await getToken();
}

const recipients = (list?: string | string[]) =>
  toList(list).map((address) => ({ emailAddress: { address } }));

/** Base message (no attachments) shared by the inline + draft paths. */
function baseMessage(opts: SendMailOptions, html: string): Record<string, unknown> {
  const message: Record<string, unknown> = {
    subject: opts.subject,
    body: { contentType: "HTML", content: html },
    toRecipients: recipients(opts.to),
  };
  const cc = recipients(opts.cc);
  if (cc.length) message.ccRecipients = cc;
  if (opts.replyTo) message.replyTo = [{ emailAddress: { address: opts.replyTo } }];
  return message;
}

export async function sendViaGraph(opts: SendMailOptions, html: string): Promise<void> {
  const token = await getToken();
  const attachments = opts.attachments ?? [];
  const totalBytes = attachments.reduce((n, a) => n + a.content.length, 0);

  if (attachments.length === 0 || totalBytes <= INLINE_LIMIT) {
    await sendInline(token, opts, html, attachments);
  } else {
    await sendViaDraft(token, opts, html, attachments);
  }
}

/** Single-request send with inline (base64) attachments. */
async function sendInline(
  token: string,
  opts: SendMailOptions,
  html: string,
  attachments: MailAttachment[],
): Promise<void> {
  const message = baseMessage(opts, html);
  if (attachments.length) {
    message.attachments = attachments.map((a) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: a.filename,
      contentType: a.contentType ?? "application/octet-stream",
      contentBytes: a.content.toString("base64"),
    }));
  }
  const res = await fetch(
    `${GRAPH}/users/${encodeURIComponent(opts.from || FROM()!)}/sendMail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );
  if (!res.ok) throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`);
}

/** Draft + chunked upload session(s) + send — for attachments over the inline
 *  limit (up to Graph's 150 MB message ceiling). */
async function sendViaDraft(
  token: string,
  opts: SendMailOptions,
  html: string,
  attachments: MailAttachment[],
): Promise<void> {
  const auth = { Authorization: `Bearer ${token}` };
  const userBase = `${GRAPH}/users/${encodeURIComponent(opts.from || FROM()!)}`;

  // 1. Create the draft (no attachments yet).
  const draftRes = await fetch(`${userBase}/messages`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(baseMessage(opts, html)),
  });
  if (!draftRes.ok)
    throw new Error(`Graph create draft ${draftRes.status}: ${await draftRes.text()}`);
  const draft = (await draftRes.json()) as { id: string };

  // 2. Upload each attachment via its own session.
  for (const a of attachments) {
    const size = a.content.length;
    const sessRes = await fetch(
      `${userBase}/messages/${draft.id}/attachments/createUploadSession`,
      {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          AttachmentItem: {
            attachmentType: "file",
            name: a.filename,
            size,
            contentType: a.contentType ?? "application/octet-stream",
          },
        }),
      },
    );
    if (!sessRes.ok)
      throw new Error(`Graph upload session ${sessRes.status}: ${await sessRes.text()}`);
    const { uploadUrl } = (await sessRes.json()) as { uploadUrl: string };

    for (let start = 0; start < size; start += CHUNK) {
      const end = Math.min(start + CHUNK, size);
      const chunk = a.content.subarray(start, end);
      // Wrap in a Blob so fetch sets Content-Length itself (its BodyInit type
      // rejects raw Buffers/typed arrays). The URL is pre-authenticated — no
      // Authorization header.
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Range": `bytes ${start}-${end - 1}/${size}` },
        body: new Blob([new Uint8Array(chunk)]),
      });
      if (!putRes.ok && putRes.status !== 201 && putRes.status !== 200) {
        throw new Error(`Graph chunk upload ${putRes.status}: ${await putRes.text()}`);
      }
    }
  }

  // 3. Send the draft.
  const sendRes = await fetch(`${userBase}/messages/${draft.id}/send`, {
    method: "POST",
    headers: auth,
  });
  if (!sendRes.ok)
    throw new Error(`Graph send draft ${sendRes.status}: ${await sendRes.text()}`);
}
