import { NextResponse } from "next/server";
import { getInstagramToken, setInstagramToken } from "@/lib/instagram";

/**
 * Vercel Cron — runs weekly to refresh the Instagram long-lived token before
 * its 60-day expiry, persisting the new token to KV. Schedule lives in
 * vercel.json.
 *
 * Auth: Vercel adds `Authorization: Bearer ${CRON_SECRET}` to scheduled
 * requests. Anything without that header is rejected so this can't be
 * triggered externally.
 *
 * The same endpoint is safe to invoke manually for an out-of-band refresh
 * (e.g. after rotating the Meta app), as long as the caller passes the
 * cron secret:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     https://arrowindustries.com.au/api/cron/refresh-instagram-token
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REFRESH_URL = "https://graph.instagram.com/refresh_access_token";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const current = await getInstagramToken();
  if (!current) {
    return NextResponse.json(
      { ok: false, error: "no token found in KV or env" },
      { status: 500 },
    );
  }

  const url = new URL(REFRESH_URL);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", current);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[ig refresh] failed", res.status, body);
    return NextResponse.json(
      { ok: false, status: res.status, body },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  if (!data.access_token) {
    return NextResponse.json(
      { ok: false, error: "no access_token in response" },
      { status: 502 },
    );
  }

  await setInstagramToken(data.access_token);

  return NextResponse.json({
    ok: true,
    expires_in: data.expires_in,
    refreshed_at: new Date().toISOString(),
  });
}
