import { headers } from "next/headers";
import { Redis } from "@upstash/redis";

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

/** Normalise an Australian number to +61 E.164 (e.g. 0412 345 678 →
 *  +61412345678). Leaves anything that isn't a 9-digit AU national number as
 *  typed. Used so bookings + Square/SMS always carry a valid +61 number. */
export function toAuPhone(v: string): string {
  const raw = v.trim();
  let d = raw.replace(/[^\d]/g, "");
  if (d.startsWith("0061")) d = d.slice(4);
  else if (d.length === 11 && d.startsWith("61")) d = d.slice(2);
  d = d.replace(/^0/, ""); // drop the trunk 0
  return d.length === 9 ? `+61${d}` : raw;
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

/* ---------- Per-IP rate limit ----------
   Backed by Vercel KV / Upstash Redis so the limit is shared across every
   serverless instance and survives cold starts. Falls back to a per-instance
   in-memory window when KV isn't configured (local dev), which is weak but
   better than nothing — the honeypot + server validation remain the real
   defence. Each form passes its own bucket so limits don't interfere. */

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_WINDOW_SECONDS = RATE_WINDOW_MS / 1000;
const DEFAULT_RATE_MAX = 5;

/** Memoised KV client, or null when the env isn't configured. */
let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  if (!redisClient) {
    console.warn(
      "[rate-limit] KV not configured — using per-instance in-memory limiting.",
    );
  }
  return redisClient;
}

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    return (
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "anon"
    );
  } catch {
    // headers() can fail outside a request context.
    return "anon";
  }
}

export function createRateLimiter(
  bucket: string,
  max: number = DEFAULT_RATE_MAX,
) {
  // Only used when KV isn't configured.
  const hits = new Map<string, number[]>();

  return async function check(): Promise<
    { ok: true } | { ok: false; retryIn: number }
  > {
    const ip = await clientIp();
    const redis = getRedis();

    if (redis) {
      // Fixed window: INCR the counter, set the TTL on first hit.
      const key = `ratelimit:${bucket}:${ip}`;
      try {
        const count = await redis.incr(key);
        if (count === 1) await redis.expire(key, RATE_WINDOW_SECONDS);
        if (count > max) {
          const ttl = await redis.ttl(key);
          return {
            ok: false,
            retryIn: (ttl > 0 ? ttl : RATE_WINDOW_SECONDS) * 1000,
          };
        }
        return { ok: true };
      } catch (err) {
        // Fail OPEN — a KV outage must never block a legitimate enquiry.
        console.error("[rate-limit] KV error (allowing request):", err);
        return { ok: true };
      }
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

// The limits live in lib/upload-limits.ts so the browser and the server can't
// drift apart — they had, and the mismatch was invisible until a submission
// died at Vercel's 4.5 MB request cap with a bare 413. See that file for why
// these numbers are what they are.
import { MAX_FILE_BYTES, MAX_TOTAL_BYTES, formatBytes } from "@/lib/upload-limits";

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
        error: `${file.name} is over ${formatBytes(MAX_FILE_BYTES)}. Please attach a smaller file.`,
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
