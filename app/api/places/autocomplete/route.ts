import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Proxy to Google Places Autocomplete (New) so the API key stays server-side.
 *  Used by the roadworthy booking form to confirm the residential address.
 *  Returns configured:false (200) when no GOOGLE_MAPS_API_KEY is set so the
 *  input degrades to plain text. */
export async function GET(req: Request) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ ok: true, configured: false, suggestions: [] });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 3 || q.length > 120) return NextResponse.json({ ok: true, configured: true, suggestions: [] });

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "content-type": "application/json", "X-Goog-Api-Key": key },
      body: JSON.stringify({ input: q, includedRegionCodes: ["au"] }),
    });
    if (!res.ok) {
      console.error("[api/places/autocomplete]", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: true, configured: true, suggestions: [] });
    }
    const data = (await res.json()) as { suggestions?: { placePrediction?: { placeId?: string; text?: { text?: string } } }[] };
    const suggestions = (data.suggestions ?? [])
      .map((x) => ({ text: x.placePrediction?.text?.text ?? "" }))
      .filter((s) => s.text)
      .slice(0, 6);
    return NextResponse.json({ ok: true, configured: true, suggestions });
  } catch (e) {
    console.error("[api/places/autocomplete]", e);
    return NextResponse.json({ ok: true, configured: true, suggestions: [] });
  }
}
