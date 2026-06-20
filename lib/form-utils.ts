import { headers } from "next/headers";

/**
 * Shared helpers for the website's server-action form handlers
 * (quote / finance / careers). These were previously copy-pasted across all
 * three; centralising them keeps validation and email escaping in sync.
 */

/* ---------- Validation ---------- */

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function isPhone(v: string) {
  // Accepts AU mobile/landline formats: 7–15 digits after stripping spaces,
  // dashes, parentheses and a leading +.
  const digits = v.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/* ---------- Email rendering ---------- */

/** Em-dash placeholder for empty values in emails. */
export function dash(v: string) {
  return v.length > 0 ? v : "—";
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- Naive in-memory rate limit ----------
   Per-IP, per server instance. Resets on cold-start and isn't shared across
   instances — the honeypot + validation are the real defence; this just blunts
   trivial spam. Each form gets its own independent bucket via the factory. */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_RATE_MAX = 5;

export function createRateLimiter(max: number = DEFAULT_RATE_MAX) {
  const hits = new Map<string, number[]>();
  return async function check(): Promise<
    { ok: true } | { ok: false; retryIn: number }
  > {
    let ip = "anon";
    try {
      const h = await headers();
      ip =
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        h.get("x-real-ip") ||
        "anon";
    } catch {
      // headers() can fail outside a request context — fall through
    }

    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
    if (recent.length >= max) {
      return { ok: false, retryIn: RATE_WINDOW_MS - (now - recent[0]) };
    }
    recent.push(now);
    hits.set(ip, recent);
    return { ok: true };
  };
}

/* ---------- Attachments ---------- */

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB combined (under Resend's per-email cap)

export interface Attachment {
  filename: string;
  content: Buffer;
}

interface AttachmentOptions {
  allowedMime: RegExp;
  allowedExt: RegExp;
  /** Message when a file's type isn't allowed. */
  typeError: (name: string) => string;
  /** Message when combined size exceeds the email cap. */
  tooLargeError: string;
  /** Message when reading a file into a Buffer throws. */
  uploadError: string;
  /** Prefix for server-side error logs, e.g. "quote". */
  logTag: string;
}

/**
 * Validate (size + type) and read uploaded files into Resend attachment
 * buffers. Returns a discriminated result so callers can `return` the error
 * string directly. Files are optional — an empty list yields `attachments: []`.
 */
export async function readAttachments(
  files: FormDataEntryValue[],
  opts: AttachmentOptions,
): Promise<
  { ok: true; attachments: Attachment[] } | { ok: false; error: string }
> {
  const incoming = files.filter(
    (f): f is File => f instanceof File && f.size > 0,
  );

  let totalBytes = 0;
  for (const file of incoming) {
    if (file.size > MAX_FILE_BYTES) {
      return {
        ok: false,
        error: `${file.name} is over 10MB. Please attach a smaller file.`,
      };
    }
    if (!opts.allowedMime.test(file.type) && !opts.allowedExt.test(file.name)) {
      return { ok: false, error: opts.typeError(file.name) };
    }
    totalBytes += file.size;
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    return { ok: false, error: opts.tooLargeError };
  }

  try {
    const attachments = await Promise.all(
      incoming.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );
    return { ok: true, attachments };
  } catch (err) {
    console.error(`[${opts.logTag}] Attachment read error:`, err);
    return { ok: false, error: opts.uploadError };
  }
}
