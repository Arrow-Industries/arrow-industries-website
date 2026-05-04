/**
 * Instagram Graph API — fetches the latest media from the connected
 * Business/Creator account.
 *
 * Token lifecycle: long-lived tokens last ~60 days. The site degrades
 * gracefully when the token is missing or invalid — the strip simply
 * renders nothing — so an expired token will never break the gallery
 * page, only stop refreshing posts.
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

export async function fetchInstagramMedia(limit = 12): Promise<IgMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
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
