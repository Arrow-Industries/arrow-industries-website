/**
 * Outgoing mail for the website — the façade the rest of the app talks to.
 *
 * Arrow moved arrowindustries.com.au to Google Workspace, so mail now goes out
 * through Gmail. SPF for the domain authorises Google only; sending through
 * Microsoft would fail SPF and survive, if at all, on the leftover Microsoft
 * DKIM signature. Graph is therefore still implemented and one env var away,
 * but it is no longer where mail should sit.
 *
 * Nothing below this file changed shape. `sendMail`, `isMailerConfigured`,
 * `verifyMailer`, `bufferAttachments`, `MailAttachment` and `SendMailOptions`
 * mean exactly what they did when Graph was the only sender, so the five call
 * sites — app/api/health/mailer, lib/email, lib/finance, lib/careers,
 * lib/roadworthy-action — are untouched.
 *
 * The senders themselves live in lib/integrations:
 *   mail-types.ts  the shape of a message, shared by both
 *   gmail.ts       service account + domain-wide delegation
 *   graph.ts       Microsoft app-only, kept as the fallback
 *   mail.ts        which of the two carries it
 *
 * Requires (server-only) env:
 *   Gmail  GOOGLE_SA_JSON, or GOOGLE_SA_CLIENT_EMAIL + GOOGLE_SA_PRIVATE_KEY
 *   Graph  AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET
 *   both   MAIL_FROM
 *   opt.   MAIL_PROVIDER=gmail|graph to force one
 *
 * `sendMail()` throws when nothing is configured or the send fails — callers
 * guard with `isMailerConfigured()` so local dev without credentials degrades
 * gracefully rather than breaking form submission.
 */

import {
  activeProvider,
  sendMail as dispatch,
  verifyActive,
} from "@/lib/integrations/mail";
import type { MailAttachment, SendMailOptions } from "@/lib/integrations/mail-types";

export type { MailAttachment, SendMailOptions } from "@/lib/integrations/mail-types";
export type { MailProvider } from "@/lib/integrations/mail-types";

/** True when some provider could carry a message right now. */
export function isMailerConfigured(): boolean {
  return activeProvider() !== null;
}

/** Which provider would carry it — null when none is configured. */
export { activeProvider };

/**
 * Diagnostic: confirm the active provider's credentials actually work. Sends
 * nothing.
 *
 * The `{ ok }` / `{ ok, error }` shape is unchanged for anything polling
 * /api/health/mailer; `provider` is additive so the check says which carrier it
 * just proved.
 */
export async function verifyMailer(): Promise<
  { ok: true; provider: "gmail" | "graph" } | { ok: false; error: string }
> {
  const res = await verifyActive();
  if (res.ok) return { ok: true, provider: res.provider };
  return { ok: false, error: res.error };
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Attach a content-type guess to the form's read file buffers. */
export function bufferAttachments(
  items: { filename: string; content: Buffer }[],
): MailAttachment[] {
  return items.map((a) => {
    const ext = a.filename.split(".").pop()?.toLowerCase() ?? "";
    return {
      filename: a.filename,
      content: a.content,
      contentType: MIME_BY_EXT[ext] ?? "application/octet-stream",
    };
  });
}

export async function sendMail(opts: SendMailOptions): Promise<void> {
  return dispatch(opts, opts.html);
}
