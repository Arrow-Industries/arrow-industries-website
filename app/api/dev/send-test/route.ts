/**
 * DEV-ONLY: trigger a single Microsoft Graph test send to confirm the mailer
 * env + Azure app permissions are wired correctly.
 *
 *   curl "http://localhost:3000/api/dev/send-test?to=you@example.com"
 *
 * Returns 404 in production so it's never reachable on the live site. Only runs
 * on an explicit request — never during build/CI.
 */

import { NextResponse } from "next/server";
import { sendMail, isMailerConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!isMailerConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Mailer not configured — set AZURE_TENANT_ID/CLIENT_ID/CLIENT_SECRET + MAIL_FROM" },
      { status: 503 },
    );
  }
  const to = new URL(req.url).searchParams.get("to") || process.env.MAIL_FROM!;
  try {
    await sendMail({
      to,
      subject: "Arrow website mailer test (Microsoft 365 / Graph)",
      html: "<p>This is a test email from the Arrow Industries website mailer, sent via Microsoft Graph (app-only).</p>",
    });
    return NextResponse.json({ ok: true, sentFrom: process.env.MAIL_FROM, sentTo: to });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
