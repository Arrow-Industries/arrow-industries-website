"use server";

/**
 * Roadworthy booking request — the website half of the dashboard's booking
 * system. Saves the request as a `pending` rwc_booking (staff approve or
 * reject it from the dashboard's Roadworthy tab), push-notifies staff, and
 * emails both the workshop and the customer. Emails are best-effort: the
 * Supabase record is the source of truth.
 *
 * Captures the full customer + vehicle details needed for the certificate
 * and invoicing: name split, ABN when booking as a company, licence number,
 * make/model/build year and VIN.
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

/** ABN checksum (ATO modulus-89 weighting) on the 11 digits. */
function isValidAbn(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const sum = weights.reduce((acc, w, i) => acc + w * (Number(digits[i]) - (i === 0 ? 1 : 0)), 0);
  return sum % 89 === 0;
}

export async function submitRoadworthyBooking(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept so bots think it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("companyName") ?? "").trim();
  const abn = String(formData.get("abn") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const licence = String(formData.get("licenceNumber") ?? "").trim();
  const make = String(formData.get("vehicleMake") ?? "").trim();
  const model = String(formData.get("vehicleModel") ?? "").trim();
  const yearRaw = String(formData.get("vehicleYear") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim().toUpperCase();
  const rego = String(formData.get("rego") ?? "").trim();
  const vehicleType = String(formData.get("vehicleType") ?? "").trim();
  const inspectionKey = String(formData.get("inspectionType") ?? "").trim();
  const preferredDate = String(formData.get("preferredDate") ?? "").trim();
  const preferredTime = String(formData.get("preferredTime") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName) return { ok: false, error: "Please provide your first name.", field: "firstName" };
  if (!lastName) return { ok: false, error: "Please provide your last name.", field: "lastName" };
  if (company && !abn)
    return { ok: false, error: "Please provide the company's ABN.", field: "abn" };
  if (abn && !isValidAbn(abn))
    return { ok: false, error: "That ABN doesn't look right — it should be 11 digits.", field: "abn" };
  if (!phone) return { ok: false, error: "Please provide a phone number.", field: "phone" };
  if (!isPhone(phone))
    return { ok: false, error: "Please provide a valid phone number.", field: "phone" };
  if (!email) return { ok: false, error: "Please provide an email address.", field: "email" };
  if (!isEmail(email))
    return { ok: false, error: "Please provide a valid email address.", field: "email" };
  if (!licence)
    return { ok: false, error: "Please provide your driver licence number.", field: "licenceNumber" };
  if (!vehicleType)
    return { ok: false, error: "Please select the vehicle type.", field: "vehicleType" };
  if (!make) return { ok: false, error: "Please provide the vehicle make.", field: "vehicleMake" };
  if (!model) return { ok: false, error: "Please provide the vehicle model.", field: "vehicleModel" };
  const year = Number(yearRaw);
  const maxYear = new Date().getFullYear() + 1;
  if (!/^\d{4}$/.test(yearRaw) || year < 1950 || year > maxYear)
    return { ok: false, error: `Please provide the build year (1950–${maxYear}).`, field: "vehicleYear" };
  if (vin.replace(/\s/g, "").length < 5)
    return { ok: false, error: "Please provide the VIN (it's on the compliance plate).", field: "vin" };

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

  const name = `${firstName} ${lastName}`;
  const vehicleText = [year, make, model].filter(Boolean).join(" ");

  // 1) Durable record → dashboard approval queue. Detail columns are from
  //    migration 035; retried without them if that migration isn't run yet.
  let saved = false;
  const sb = getSupabaseAdmin();
  if (sb) {
    const baseRow = {
      status: "pending",
      source: "website",
      name,
      business_name: company || null,
      email,
      phone,
      rego: rego || null,
      vehicle: vehicleText,
      vehicle_type: vehicleType || item.label.replace(/\s*RWC$/i, ""),
      inspection_key: item.key,
      inspection_label: item.label,
      price: item.price,
      duration_mins: item.durationMins,
      preferred_date: preferredDate,
      preferred_time: preferredTime || null,
      notes: message || null,
    };
    const detailRow = {
      first_name: firstName,
      last_name: lastName,
      abn: abn || null,
      licence_number: licence,
      vehicle_make: make,
      vehicle_model: model,
      vehicle_year: year,
      vin,
    };
    let { error } = await sb.from("rwc_bookings").insert({ ...baseRow, ...detailRow });
    if (error && /column|schema cache/i.test(error.message)) {
      ({ error } = await sb.from("rwc_bookings").insert(baseRow));
    }
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
      ["Company", dash(company)],
      ["ABN", dash(abn)],
      ["Email", email],
      ["Phone", phone],
      ["Licence no.", licence],
      ["Vehicle type", vehicleType],
      ["Vehicle", vehicleText],
      ["VIN", vin],
      ["Rego", dash(rego.toUpperCase())],
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
            <p>Hi ${escapeHtml(firstName)},</p>
            <p>Thanks — we've received your roadworthy inspection request for the <strong>${escapeHtml(vehicleText)}</strong>${rego ? ` (${escapeHtml(rego.toUpperCase())})` : ""} on <strong>${escapeHtml(preferredDate)}</strong>${preferredTime ? ` (${escapeHtml(preferredTime)})` : ""}.</p>
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
