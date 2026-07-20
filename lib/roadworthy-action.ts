"use server";

/**
 * Roadworthy booking request — the website half of the dashboard's booking
 * system. Saves the request as a `pending` rwc_booking (staff approve or
 * reject it from the dashboard's Roadworthy tab), push-notifies staff, and
 * emails both the workshop and the customer. Emails are best-effort: the
 * Supabase record is the source of truth.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { getEmailSetting } from "@/lib/email-config";
import { isEmail, isPhone, escapeHtml, dash, createRateLimiter } from "@/lib/form-utils";
import { notifyDashboardNewRwcBooking } from "@/lib/notify-dashboard";
import { getRwcBookingOptions } from "@/lib/roadworthy";
import { site } from "@/data/site";

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const rateLimit = createRateLimiter("roadworthy");

export async function submitRoadworthyBooking(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept so bots think it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const name = String(formData.get("fullName") ?? "").trim();
  const business = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const rego = String(formData.get("rego") ?? "").trim();
  const vehicle = String(formData.get("vehicle") ?? "").trim();
  const inspectionKey = String(formData.get("inspectionType") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const preferredTime = String(formData.get("preferredTime") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { ok: false, error: "Please provide your name.", field: "fullName" };
  if (!email && !phone)
    return { ok: false, error: "Please provide either an email address or a phone number.", field: "email" };
  if (email && !isEmail(email))
    return { ok: false, error: "Please provide a valid email address.", field: "email" };
  if (phone && !isPhone(phone))
    return { ok: false, error: "Please provide a valid phone number.", field: "phone" };
  if (!rego) return { ok: false, error: "Please provide the vehicle registration.", field: "rego" };

  const { options, leadDays, days } = await getRwcBookingOptions();
  const item = options.find((o) => o.key === inspectionKey);
  if (!item) return { ok: false, error: "Please select an inspection type.", field: "inspectionType" };

  if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate))
    return { ok: false, error: "Please pick a preferred date.", field: "preferredDate" };
  const chosen = new Date(preferredDate + "T12:00:00");
  if (Number.isNaN(chosen.getTime()))
    return { ok: false, error: "Please pick a valid date.", field: "preferredDate" };
  const min = new Date();
  min.setHours(0, 0, 0, 0);
  min.setDate(min.getDate() + leadDays);
  if (chosen < min)
    return {
      ok: false,
      error: leadDays > 0 ? `Bookings need at least ${leadDays} day${leadDays === 1 ? "" : "s"} notice — please pick a later date.` : "Please pick a date from today onwards.",
      field: "preferredDate",
    };
  const isoDay = ((chosen.getDay() + 6) % 7) + 1;
  if (!days.includes(isoDay)) {
    const open = days.map((d) => DAY_NAMES[d]).filter(Boolean).join(", ");
    return { ok: false, error: `Inspections run ${open} — please pick one of those days.`, field: "preferredDate" };
  }

  const limited = await rateLimit();
  if (!limited.ok)
    return { ok: false, error: "Too many requests — please wait a moment and try again, or call us." };

  // 1) Durable record → dashboard approval queue.
  let saved = false;
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("rwc_bookings").insert({
      status: "pending",
      source: "website",
      name,
      business_name: business || null,
      email: email || null,
      phone: phone || null,
      rego: rego || null,
      vehicle: vehicle || null,
      vehicle_type: item.label.replace(/\s*RWC$/i, ""),
      inspection_key: item.key,
      inspection_label: item.label,
      price: item.price,
      duration_mins: item.durationMins,
      preferred_date: preferredDate,
      preferred_time: preferredTime || null,
      notes: message || null,
    });
    if (error) console.error("[roadworthy] Insert error:", error.message);
    else {
      saved = true;
      await notifyDashboardNewRwcBooking({ name, inspection: item.label, preferredDate });
    }
  }

  // 2) Staff alert email.
  let emailed = false;
  if (isMailerConfigured()) {
    const to = await getEmailSetting("roadworthy_email_to", "sales@arrowindustries.com.au");
    const rows = [
      ["Name", name],
      ["Business", dash(business)],
      ["Email", dash(email)],
      ["Phone", dash(phone)],
      ["Rego", dash(rego.toUpperCase())],
      ["Vehicle", dash(vehicle)],
      ["Inspection", item.label],
      ["Preferred date", preferredDate],
      ["Preferred time", dash(preferredTime)],
      ["Notes", dash(message)],
    ]
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`,
      )
      .join("");
    try {
      await sendMail({
        to,
        subject: `Roadworthy booking request — ${name}${rego ? ` (${rego.toUpperCase()})` : ""}`,
        html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
          <p><strong>New roadworthy booking request</strong> from the website — approve or reject it in the dashboard's Roadworthy tab.</p>
          <table style="border-collapse:collapse">${rows}</table>
        </div>`,
        replyTo: email || undefined,
      });
      emailed = true;
    } catch (err) {
      console.error("[roadworthy] staff email error (non-fatal):", err);
    }

    // 3) Customer acknowledgement.
    if (email) {
      try {
        await sendMail({
          to: email,
          subject: "Roadworthy booking request received — Arrow Industries",
          html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;max-width:560px">
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thanks — we've received your roadworthy inspection request for <strong>${escapeHtml(preferredDate)}</strong>${preferredTime ? ` (${escapeHtml(preferredTime)})` : ""}.</p>
            <p>This isn't confirmed yet: our team will check the schedule and email you a confirmed time, usually within the same business day.</p>
            <p>Need it urgently? Call us on <a href="${site.phoneHref}">${site.phone}</a>.</p>
            <p style="color:#666;font-size:12px;margin-top:24px;border-top:1px solid #ddd;padding-top:12px">Arrow Industries · ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.suburb)} ${escapeHtml(site.address.state)} ${escapeHtml(site.address.postcode)}</p>
          </div>`,
        });
      } catch (err) {
        console.error("[roadworthy] customer ack error (non-fatal):", err);
      }
    }
  }

  if (!saved && !emailed) {
    return { ok: false, error: "Something went wrong sending your request. Please call us and we'll book you in." };
  }
  return { ok: true };
}
