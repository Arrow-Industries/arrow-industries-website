/**
 * Microsoft 365 (Microsoft Graph) mailer — app-only / client-credentials flow.
 *
 * Sends enquiry emails AS the `MAIL_FROM` mailbox (sales@arrowindustries.com.au)
 * via Graph `sendMail`. No DNS changes needed — M365 already hosts the domain.
 * Replaces the previous Resend integration.
 *
 * Requires (server-only) env:
 *   AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, MAIL_FROM
 *
 * `sendMail()` throws on missing env or any Graph/token failure — callers guard
 * with `isMailerConfigured()` so local dev (no creds) degrades gracefully
 * instead of blocking the form.
 */

const T = process.env.AZURE_TENANT_ID;
const ID = process.env.AZURE_CLIENT_ID;
const SEC = process.env.AZURE_CLIENT_SECRET;
const FROM = process.env.MAIL_FROM; // sales@arrowindustries.com.au

/** True when all Graph mailer env vars are present. */
export function isMailerConfigured(): boolean {
  return Boolean(T && ID && SEC && FROM);
}

let cached: { token: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.exp) return cached.token;
  const res = await fetch(`https://login.microsoftonline.com/${T}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: ID!,
      client_secret: SEC!,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) {
    throw new Error(`MS token ${res.status}: ${await res.text()}`);
  }
  const j = (await res.json()) as { access_token: string; expires_in: number };
  // Reuse until ~60s before expiry.
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 };
  return cached.token;
}

export interface MailAttachment {
  filename: string;
  contentBase64: string;
  contentType?: string;
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

/** Map in-memory file buffers (the form's read attachments) to Graph attachments. */
export function bufferAttachments(
  items: { filename: string; content: Buffer }[],
): MailAttachment[] {
  return items.map((a) => {
    const ext = a.filename.split(".").pop()?.toLowerCase() ?? "";
    return {
      filename: a.filename,
      contentBase64: a.content.toString("base64"),
      contentType: MIME_BY_EXT[ext] ?? "application/octet-stream",
    };
  });
}

export interface SendMailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export async function sendMail(opts: SendMailOptions): Promise<void> {
  if (!isMailerConfigured()) {
    throw new Error(
      "Mailer env vars missing (AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET / MAIL_FROM)",
    );
  }
  const token = await getToken();

  const toAddrs = (Array.isArray(opts.to) ? opts.to : [opts.to]).filter(Boolean);
  const ccAddrs = (opts.cc ? (Array.isArray(opts.cc) ? opts.cc : [opts.cc]) : []).filter(Boolean);

  const message: Record<string, unknown> = {
    subject: opts.subject,
    body: { contentType: "HTML", content: opts.html },
    toRecipients: toAddrs.map((address) => ({ emailAddress: { address } })),
  };
  if (ccAddrs.length) {
    message.ccRecipients = ccAddrs.map((address) => ({ emailAddress: { address } }));
  }
  if (opts.replyTo) {
    message.replyTo = [{ emailAddress: { address: opts.replyTo } }];
  }
  if (opts.attachments?.length) {
    message.attachments = opts.attachments.map((a) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: a.filename,
      contentType: a.contentType ?? "application/octet-stream",
      contentBytes: a.contentBase64,
    }));
  }

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(FROM!)}/sendMail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message, saveToSentItems: true }),
    },
  );
  if (!res.ok) {
    throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`);
  }
}
