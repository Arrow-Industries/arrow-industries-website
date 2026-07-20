import { NextResponse } from "next/server";
import { sendMail, isMailerConfigured, verifyMailer } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Microsoft 365 / Graph mailer health check.
 *
 * Enquiry emails are a best-effort alert (the durable record is Supabase), so a
 * broken mailer fails silently. This endpoint surfaces the real Graph error.
 *
 * By default it only verifies that app-only credentials can obtain a token —
 * it sends nothing. Add `?send=1` (optionally `&to=someone@example.com`) to
 * also fire a single test email.
 *
 * Auth: open in development. In production it requires the same shared secret
 * used for cron, and 404s otherwise so its existence isn't advertised:
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     https://arrowindustries.com.au/api/health/mailer
 */
function authorised(req: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const auth = await verifyMailer();

  const body: Record<string, unknown> = {
    configured: isMailerConfigured(),
    mailFrom: process.env.MAIL_FROM ?? null,
    tokenOk: auth.ok,
  };
  if (!auth.ok) body.error = auth.error;

  // Optional: actually send one email to prove delivery end-to-end.
  if (auth.ok && url.searchParams.get("send") === "1") {
    const to = url.searchParams.get("to") || process.env.MAIL_FROM!;
    try {
      await sendMail({
        to,
        subject: "Arrow website mailer health check",
        html: "<p>Mailer health check from the Arrow Industries website (Microsoft Graph, app-only). If you received this, enquiry email delivery is working.</p>",
      });
      body.sent = { to };
    } catch (err) {
      body.sent = false;
      body.sendError = String(err);
    }
  }

  return NextResponse.json(body, { status: auth.ok ? 200 : 503 });
}
