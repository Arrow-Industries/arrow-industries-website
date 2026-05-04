import { Redis } from "@upstash/redis";

/**
 * Instagram Graph API — fetches the latest media from the connected
 * Business/Creator account.
 *
 * Token storage is layered:
 *   1. Upstash/Vercel KV at key `instagram:access_token` (canonical, refreshed
 *      weekly by the /api/cron/refresh-instagram-token cron job).
 *   2. process.env.INSTAGRAM_ACCESS_TOKEN as a fallback. This is the only
 *      thing populated on first deploy; once the cron runs, KV takes over.
 *
 * Lifecycle: long-lived tokens last ~60 days. The cron refreshes the KV
 * token weekly so it never expires under normal operation. If both KV
 * and the env token are missing/invalid, the strip silently renders
 * nothing — the gallery page never breaks.
 */

export type IgMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export interface IgMedia {
  id: string;
  caption?: string;
  media_type: IgMediaType;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  username?: string;
}

const API_BASE = "https://graph.instagram.com";
export const KV_TOKEN_KEY = "instagram:access_token";
const FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "username",
].join(",");

let cachedRedis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  cachedRedis = url && token ? new Redis({ url, token }) : null;
  return cachedRedis;
}

export async function getInstagramToken(): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    try {
      const fromKv = await redis.get<string>(KV_TOKEN_KEY);
      if (fromKv) return fromKv;
    } catch (err) {
      console.error("[instagram] KV read failed", err);
    }
  }
  return process.env.INSTAGRAM_ACCESS_TOKEN ?? null;
}

export async function setInstagramToken(token: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Cannot persist Instagram token: Upstash/KV env vars not configured.",
    );
  }
  await redis.set(KV_TOKEN_KEY, token);
}

export async function fetchInstagramMedia(limit = 12): Promise<IgMedia[]> {
  const token = await getInstagramToken();
  if (!token) return [];

  const url = new URL(`${API_BASE}/me/media`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600, tags: ["instagram"] },
    });

    if (!res.ok) {
      console.error(
        "[instagram] fetch failed",
        res.status,
        await res.text().catch(() => ""),
      );
      return [];
    }

    const json = (await res.json()) as { data?: IgMedia[] };
    return json.data ?? [];
  } catch (err) {
    console.error("[instagram] fetch threw", err);
    return [];
  }
}

/**
 * Pick the right URL for a thumbnail. Videos return media_url pointing at the
 * mp4; thumbnail_url is the still frame. Images and carousels use media_url.
 */
export function thumbFor(m: IgMedia): string {
  return m.media_type === "VIDEO" && m.thumbnail_url
    ? m.thumbnail_url
    : m.media_url;
}
