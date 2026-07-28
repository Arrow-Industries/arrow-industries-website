/**
 * Gmail sender — service account with domain-wide delegation.
 *
 * The Google equivalent of Graph's app-only flow. There is no user sitting
 * there clicking consent: the service account holds a private key, signs a JWT
 * asserting "I am allowed to act as sales@arrowindustries.com.au", and trades
 * it for an access token scoped to gmail.send. A Workspace super-admin grants
 * that once in the Admin console; we never do it at runtime.
 *
 * Server-only env:
 *   GOOGLE_SA_JSON           the whole downloaded key file, pasted in; or
 *   GOOGLE_SA_CLIENT_EMAIL   + GOOGLE_SA_PRIVATE_KEY as two separate values
 *   MAIL_FROM                the mailbox to send as
 *
 * Web Crypto rather than node:crypto on purpose — a `node:` import in anything
 * that can be pulled toward the client bundle fails the build, and this has
 * bitten this codebase before. crypto.subtle is the same RSA in both runtimes.
 *
 * Two things differ from the dashboard's copy, both because the website carries
 * real customer attachments rather than small generated PDFs:
 *
 *  1. Attachments arrive as Node Buffers, so base64 is `Buffer.toString`
 *     — native, and far quicker than chunked btoa over 20 MB.
 *  2. Sending is hybrid. A JSON `raw` body base64-encodes the whole message a
 *     SECOND time (+33% on top of the attachments' own base64), which is both
 *     wasteful and fatal near the ceiling. Messages over UPLOAD_THRESHOLD go to
 *     the upload endpoint as raw message/rfc822 bytes, skipping that layer.
 *
 * Gmail's hard ceiling is 35 MB for the assembled message. The form caps
 * uploads at 20 MB combined, which encodes to roughly 28.7 MB on the wire.
 */

import type { SendMailOptions } from "@/lib/integrations/mail-types";
import { toList } from "@/lib/integrations/mail-types";

const SCOPE = "https://www.googleapis.com/auth/gmail.send";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL = "https://gmail.googleapis.com/gmail/v1";
const GMAIL_UPLOAD = "https://gmail.googleapis.com/upload/gmail/v1";

/**
 * Above this assembled-MIME size we stop using the JSON `raw` body and post the
 * bytes to the upload endpoint instead. 4 MB keeps every ordinary enquiry on
 * the simple path while staying well inside the JSON request limit even after
 * `raw`'s extra base64 layer (4 MB -> ~5.4 MB of JSON).
 */
const UPLOAD_THRESHOLD = 4 * 1024 * 1024;

/** Gmail's documented per-message ceiling — checked before we bother sending. */
const GMAIL_MAX_MESSAGE = 35 * 1024 * 1024;

/**
 * Thrown when Google refuses to let the service account act as a mailbox.
 * Distinct from a send failure on purpose: it happens at token acquisition, so
 * no message exists yet and a caller may safely retry as a different sender
 * without any risk of delivering twice.
 */
export class ImpersonationError extends Error {
  readonly mailbox: string;
  constructor(mailbox: string, message: string) {
    super(message);
    this.name = "ImpersonationError";
    this.mailbox = mailbox;
  }
}

interface ServiceAccount {
  clientEmail: string;
  privateKey: string;
}

/**
 * Credentials come either as the whole key file or as two separate vars. The
 * whole file is easier to paste into Vercel without mangling the key's
 * newlines, so it wins when both are present.
 */
function serviceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SA_JSON?.trim();
  if (raw) {
    try {
      const j = JSON.parse(raw) as { client_email?: string; private_key?: string };
      if (j.client_email && j.private_key)
        return { clientEmail: j.client_email, privateKey: j.private_key };
    } catch {
      // A malformed paste shouldn't read as "no Gmail configured" — fall
      // through to the split vars and report it at send time instead.
    }
  }
  const clientEmail = process.env.GOOGLE_SA_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SA_PRIVATE_KEY;
  if (clientEmail && privateKey) return { clientEmail, privateKey };
  return null;
}

export function gmailConfigured(): boolean {
  return Boolean(serviceAccount() && process.env.MAIL_FROM?.trim());
}

/* ------------------------------------------------------------------ */
/* Encoding helpers                                                    */
/* ------------------------------------------------------------------ */

const b64url = (s: string): string =>
  s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/**
 * Copied onto a plain ArrayBuffer rather than returned straight from
 * TextEncoder: its result is typed over ArrayBufferLike, which crypto.subtle
 * won't accept as a BufferSource. Same bytes, a type Web Crypto agrees to.
 */
const utf8 = (s: string) => {
  const src = new TextEncoder().encode(s);
  // Deliberately not annotated: the inferred Uint8Array<ArrayBuffer> is what
  // crypto.subtle accepts as a BufferSource. Widening it to plain Uint8Array
  // (i.e. Uint8Array<ArrayBufferLike>) makes the sign() call stop compiling.
  const out = new Uint8Array(new ArrayBuffer(src.byteLength));
  out.set(src);
  return out;
};

/**
 * Base64 bodies must be wrapped or some servers reject the message (RFC 2045
 * caps a line at 998 octets). Sliced in a loop rather than by regex — a global
 * regex over ~28 MB builds an enormous intermediate array.
 */
function wrap(s: string, at = 76): string {
  const out: string[] = [];
  for (let i = 0; i < s.length; i += at) out.push(s.slice(i, i + at));
  return out.join("\r\n");
}

/**
 * Strip CR and LF from anything interpolated into a header.
 *
 * This matters more here than it did on Graph. Graph took a JSON object and
 * did its own assembly; MIME is a text format, so a newline inside a subject,
 * a reply-to or an uploaded filename would let a submitter inject arbitrary
 * headers. Every one of those values originates in a public form.
 */
const oneLine = (v: string): string => v.replace(/[\r\n]+/g, " ").trim();

/** RFC 2047 — anything non-ASCII in a header has to be encoded. */
// eslint-disable-next-line no-control-regex
const isAscii = (v: string): boolean => /^[\x00-\x7F]*$/.test(v);

const header = (value: string): string => {
  const v = oneLine(value);
  return isAscii(v) ? v : `=?UTF-8?B?${Buffer.from(v, "utf8").toString("base64")}?=`;
};

/**
 * Filenames are attacker-supplied. Quotes and backslashes would break out of
 * the quoted-string, so they go; non-ASCII names additionally get an RFC 2231
 * `filename*` so clients that honour it show the real name.
 */
function fileNameParams(name: string): { ascii: string; ext: string } {
  const clean = oneLine(name).replace(/["\\]/g, "").slice(0, 200) || "attachment";
  if (isAscii(clean)) return { ascii: clean, ext: "" };
  const ascii = clean.replace(/[^\x20-\x7E]/g, "_");
  const ext = `; filename*=UTF-8''${encodeURIComponent(clean)}`;
  return { ascii, ext };
}

/* ------------------------------------------------------------------ */
/* Token                                                               */
/* ------------------------------------------------------------------ */

/**
 * Cached per impersonated mailbox — the token IS the impersonation, so one
 * cache for all senders would quietly send as the wrong person.
 */
const tokens = new Map<string, { token: string; exp: number }>();

/** Exported so key handling can be exercised in tests without credentials. */
export async function signingKey(pem: string): Promise<CryptoKey> {
  const body = pem
    .replace(/\\n/g, "\n") // survives being pasted into an env var
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return globalThis.crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function accessToken(subject: string): Promise<string> {
  const hit = tokens.get(subject);
  if (hit && Date.now() < hit.exp) return hit.token;

  const sa = serviceAccount();
  if (!sa)
    throw new Error(
      "Gmail not configured (GOOGLE_SA_JSON, or GOOGLE_SA_CLIENT_EMAIL + GOOGLE_SA_PRIVATE_KEY)",
    );

  const iat = Math.floor(Date.now() / 1000);
  const enc = (o: unknown) => b64url(Buffer.from(JSON.stringify(o), "utf8").toString("base64"));
  const signed = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({
    iss: sa.clientEmail,
    sub: subject, // the mailbox we're acting as — this is the delegation
    scope: SCOPE,
    aud: TOKEN_URL,
    iat,
    exp: iat + 3600,
  })}`;

  let key: CryptoKey;
  try {
    key = await signingKey(sa.privateKey);
  } catch {
    throw new Error(
      "Gmail service account private key couldn't be read — check it was pasted whole, including the BEGIN/END lines.",
    );
  }
  const sig = Buffer.from(
    await globalThis.crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, utf8(signed)),
  ).toString("base64");
  const assertion = `${signed}.${b64url(sig)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    // Worth naming outright rather than making someone decode
    // "unauthorized_client". Typed so callers can fall back to another sender:
    // nothing has been sent at this point.
    if (/unauthorized_client|invalid_grant/.test(text))
      throw new ImpersonationError(
        subject,
        `Gmail refused the service account for ${subject}. The service account's client ID must be authorised against ${SCOPE} in the Workspace Admin console, and ${subject} must be a real user — a group or a bare alias cannot be impersonated.`,
      );
    throw new Error(`Google token ${res.status}: ${text}`);
  }
  const j = JSON.parse(text) as { access_token: string; expires_in: number };
  tokens.set(subject, { token: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 });
  return j.access_token;
}

/** Diagnostic: prove the key signs and Google will let us act as `subject`. */
export async function verifyGmail(subject: string): Promise<void> {
  await accessToken(subject);
}

/* ------------------------------------------------------------------ */
/* MIME                                                                */
/* ------------------------------------------------------------------ */

/**
 * Gmail takes a whole RFC 2822 message, not a JSON object like Graph does.
 * The HTML body goes out base64 so long lines, UTF-8 and stray leading dots
 * can't corrupt the message.
 *
 * Exported so the assembly can be proven byte-for-byte without credentials.
 */
export function buildMime(opts: SendMailOptions, html: string, from: string): string {
  const to = toList(opts.to);
  const cc = toList(opts.cc);

  const lines: string[] = [
    `From: ${oneLine(from)}`,
    `To: ${to.map(oneLine).join(", ")}`,
    ...(cc.length ? [`Cc: ${cc.map(oneLine).join(", ")}`] : []),
    ...(opts.replyTo ? [`Reply-To: ${oneLine(opts.replyTo)}`] : []),
    `Subject: ${header(opts.subject)}`,
    "MIME-Version: 1.0",
  ];

  const bodyPart = [
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrap(Buffer.from(html, "utf8").toString("base64")),
  ];

  if (!opts.attachments?.length) return [...lines, ...bodyPart].join("\r\n");

  const boundary = `arrow_${b64url(
    Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(12))).toString("base64"),
  )}`;
  const parts: string[] = [
    ...lines,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    ...bodyPart,
  ];
  for (const a of opts.attachments) {
    const { ascii, ext } = fileNameParams(a.filename);
    parts.push(
      `--${boundary}`,
      `Content-Type: ${oneLine(a.contentType || "application/octet-stream")}; name="${ascii}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${ascii}"${ext}`,
      "",
      wrap(a.content.toString("base64")),
    );
  }
  parts.push(`--${boundary}--`);
  return parts.join("\r\n");
}

/* ------------------------------------------------------------------ */
/* Send                                                                */
/* ------------------------------------------------------------------ */

export async function sendViaGmail(opts: SendMailOptions, html: string): Promise<void> {
  const from = (opts.from || process.env.MAIL_FROM || "").trim();
  if (!from) throw new Error("Gmail: no MAIL_FROM set");

  const token = await accessToken(from);
  const mime = buildMime(opts, html, from);
  const bytes = Buffer.from(mime, "utf8");

  if (bytes.length > GMAIL_MAX_MESSAGE) {
    // Caught here rather than as an opaque 4xx from Google, and phrased so the
    // number that needs changing is obvious.
    throw new Error(
      `Message is ${(bytes.length / 1024 / 1024).toFixed(1)} MB assembled, over Gmail's 35 MB limit. Attachments encode about 37% larger than their raw size; lower MAX_TOTAL_BYTES in lib/form-utils.ts.`,
    );
  }

  // users/me resolves to the impersonated mailbox, because the token is the
  // impersonation.
  const res =
    bytes.length <= UPLOAD_THRESHOLD
      ? await fetch(`${GMAIL}/users/me/messages/send`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ raw: b64url(bytes.toString("base64")) }),
        })
      : await fetch(`${GMAIL_UPLOAD}/users/me/messages/send?uploadType=media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "message/rfc822" },
          // Blob so fetch sets Content-Length itself; its BodyInit type is
          // unhappy with a raw Buffer.
          body: new Blob([new Uint8Array(bytes)], { type: "message/rfc822" }),
        });

  if (!res.ok) throw new Error(`Gmail send ${res.status}: ${await res.text()}`);
}
