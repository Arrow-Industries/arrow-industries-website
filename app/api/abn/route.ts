import { NextResponse } from "next/server";
import { getAbnDetails, isValidAbn, abrConfigured } from "@/lib/abn";
import { createRateLimiter } from "@/lib/form-utils";

export const runtime = "nodejs";

// Public endpoint (the booking form is public) — rate-limited per IP so it
// can't be scraped as a free ABN-lookup service.
const rateLimit = createRateLimiter("abn", 40);

/** GET /api/abn?abn=... — validate an ABN against the ABR and return the
 *  registered entity name + GST status. configured:false (200) when no
 *  ABR_GUID is set so the form degrades to plain validation. */
export async function GET(req: Request) {
  if (!abrConfigured()) return NextResponse.json({ ok: true, configured: false });
  const abn = new URL(req.url).searchParams.get("abn")?.trim() ?? "";
  if (!isValidAbn(abn)) return NextResponse.json({ ok: true, configured: true, valid: false });

  const limited = await rateLimit();
  if (!limited.ok) return NextResponse.json({ ok: true, configured: true, details: null, throttled: true });

  const details = await getAbnDetails(abn);
  return NextResponse.json({ ok: true, configured: true, valid: true, details });
}
