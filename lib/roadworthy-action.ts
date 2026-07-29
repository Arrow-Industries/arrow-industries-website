"use server";

/**
 * Roadworthy booking request — the website half of the dashboard's booking
 * system. Saves the request as a `pending` rwc_booking (staff approve or
 * reject it from the dashboard's Roadworthy tab), push-notifies staff, and
 * emails both the workshop and the customer. Emails are best-effort: the
 * Supabase record is the source of truth.
 *
 * Captures the full customer + vehicle details needed for the certificate
 * and invoicing (name split, ABN, licence, make/model/year, VIN) plus
 * optional photos, which are stored for the dashboard and attached to the
 * staff alert.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendMail, bufferAttachments, isMailerConfigured } from "@/lib/mailer";
import { getEmailSetting } from "@/lib/email-config";
import { isEmail, isPhone, toAuPhone, escapeHtml, dash, createRateLimiter, readAttachments } from "@/lib/form-utils";
import { uploadLeadAttachments } from "@/lib/lead-attachments";
import { notifyDashboardNewRwcBooking } from "@/lib/notify-dashboard";
import { getRwcBookingOptions } from "@/lib/roadworthy";
import { getRwcSlots } from "@/lib/roadworthy-slots";
import { site } from "@/data/site";

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const LOGO_URL = "https://arrowindustries.com.au/images/logo-black.png";

const rateLimit = createRateLimiter("roadworthy");

/** ABN checksum (ATO modulus-89 weighting) on the 11 digits. */
function isValidAbn(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const sum = weights.reduce((acc, w, i) => acc + w * (Number(digits[i]) - (i === 0 ? 1 : 0)), 0);
  return sum % 89 === 0;
}

const fullAddress = `${site.address.line1}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}`;

/** Branded wrapper matching the dashboard's purchase-order emails. */
function shell(title: string, inner: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:640px">
    <img src="${LOGO_URL}" alt="${escapeHtml(site.name)}" style="height:44px;margin-bottom:10px">
    <h2 style="margin:0 0 2px">${escapeHtml(site.name)} — ${escapeHtml(title)}</h2>
    <div style="color:#666;font-size:13px;margin-bottom:16px;line-height:1.5">${escapeHtml(site.legalName)} t/a ${escapeHtml(site.name)} · ABN ${escapeHtml(site.abn)}<br>${escapeHtml(fullAddress)}</div>
    <div style="font-size:14px;line-height:1.6">${inner}</div>
    <p style="color:#888;font-size:12px;margin-top:20px;border-top:1px solid #eee;padding-top:12px">
      Questions? Reply to this email or call us on <a href="${site.phoneHref}" style="color:#888">${site.phone}</a>.<br>
      ${escapeHtml(site.name)} · ${escapeHtml(fullAddress)}
    </p>
  </div>`;
}

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0">${value}</td></tr>`;

export async function submitRoadworthyBooking(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept so bots think it worked.
  if (String(formData.get("website") ?? "").trim()) return { ok: true };

  const service = String(formData.get("service") ?? "") === "defect" ? "defect" : "rwc";
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const company = String(formData.get("companyName") ?? "").trim();
  const abn = String(formData.get("abn") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const licence = String(formData.get("licenceNumber") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const make = String(formData.get("vehicleMake") ?? "").trim();
  const model = String(formData.get("vehicleModel") ?? "").trim();
  const yearRaw = String(formData.get("vehicleYear") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim().toUpperCase();
  const rego = String(formData.get("rego") ?? "").trim();
  const vehicleTypeRaw = String(formData.get("vehicleType") ?? "").trim();
  const vehicleTypeOther = String(formData.get("vehicleTypeOther") ?? "").trim();
  // "Other…" options carry a __other_* value; the real type is typed in.
  const vehicleType = vehicleTypeRaw.startsWith("__other") ? vehicleTypeOther : vehicleTypeRaw;
  const axlesRaw = String(formData.get("axles") ?? "").trim();
  // 1st inspection or a re-inspection after a fail (staff confirm free at approval).
  const inspectionRound = String(formData.get("inspectionRound") ?? "") === "second" ? "second" : "first";
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
  if (address.length < 8)
    return { ok: false, error: "Please provide your residential address as shown on your licence.", field: "address" };
  if (!vehicleTypeRaw)
    return { ok: false, error: "Please select the vehicle type.", field: "vehicleType" };
  if (!vehicleType)
    return { ok: false, error: "Please type the vehicle type.", field: "vehicleTypeOther" };
  const axles = Number(axlesRaw);
  if (!axlesRaw || !Number.isInteger(axles) || axles < 2 || axles > 6)
    return { ok: false, error: "Please select the number of axles (2–6).", field: "axles" };
  if (!make) return { ok: false, error: "Please provide the vehicle make.", field: "vehicleMake" };
  if (!model) return { ok: false, error: "Please provide the vehicle model.", field: "vehicleModel" };
  const year = Number(yearRaw);
  const maxYear = new Date().getFullYear() + 1;
  if (!/^\d{4}$/.test(yearRaw) || year < 1950 || year > maxYear)
    return { ok: false, error: `Please provide the build year (1950–${maxYear}).`, field: "vehicleYear" };
  if (vin.replace(/\s/g, "").length < 5)
    return { ok: false, error: "Please provide the VIN (it's on the compliance plate).", field: "vin" };

  const { leadDays, days, closures, axlePrices, defectPrice, durationMins, showPrices } = await getRwcBookingOptions();

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
  const closure = closures.find((c) => c.from <= preferredDate && preferredDate <= c.to);
  if (closure)
    return {
      ok: false,
      error: `We're closed that day${closure.reason ? ` (${closure.reason})` : ""} — please pick another date.`,
      field: "preferredDate",
    };

  // Optional photos — images only. Sizes are enforced by lib/upload-limits.ts
  // (Vercel rejects request bodies past 4.5MB), and the browser shrinks them
  // before they get here.
  const photoResult = await readAttachments(formData.getAll("photos"), {
    allowedMime: /^image\//,
    allowedExt: /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?)$/i,
    typeError: (name) => `${name} isn't an image — please upload photos only.`,
    tooLargeError: "Photos are too large combined — please upload fewer or smaller images.",
    uploadError: "We couldn't read one of your photos — please try again.",
    logTag: "roadworthy",
  });
  if (!photoResult.ok) return { ok: false, error: photoResult.error, field: "photos" };
  const photos = photoResult.attachments;
  // Vercel rejects bodies over ~4.5MB before we ever run; anything that got
  // this far but is still suspiciously large gets a friendly error instead.
  if (photos.reduce((n, p) => n + p.content.length, 0) > 4_000_000)
    return { ok: false, error: "Those photos are too large combined — please try fewer or smaller photos.", field: "photos" };

  // Same-day requests can't ask for a time already passed (Melbourne time).
  if (/^\d{2}:\d{2}$/.test(preferredTime)) {
    const nowMel = new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Melbourne", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (nowMel === preferredDate) {
      const nowTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Australia/Melbourne", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
      if (preferredTime <= nowTime)
        return { ok: false, error: "That time has already passed today — pick a later slot or another day.", field: "preferredTime" };
    }
  }

  // The picker only offers free slots, but re-check at submit time — someone
  // else may have been confirmed into the slot since the page loaded.
  if (/^\d{2}:\d{2}$/.test(preferredTime)) {
    try {
      const live = await getRwcSlots(preferredDate);
      if (!live.closed && live.slots.length && !live.slots.some((s) => s.value === preferredTime))
        return {
          ok: false,
          error: "That time was just taken — please pick another slot.",
          field: "preferredTime",
        };
    } catch {
      /* best-effort — staff resolve clashes at approval */
    }
  }

  const limited = await rateLimit();
  if (!limited.ok)
    return { ok: false, error: "Too many requests — please wait a moment and try again, or call us." };

  const serviceLabel = service === "defect" ? "defect clearance certificate" : "roadworthy inspection";
  const name = `${firstName} ${lastName}`;
  const vehicleText = [year, make, model].filter(Boolean).join(" ");
  // "any" or an "HH:MM" slot from the live schedule picker.
  const timeStored = !preferredTime || preferredTime === "any" ? "Any time" : preferredTime;
  const timeLabel = /^\d{2}:\d{2}$/.test(timeStored)
    ? (() => {
        const [h, m] = timeStored.split(":").map(Number);
        return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
      })()
    : timeStored;

  // Store photos so the dashboard can show them (best-effort).
  const storedPaths = await uploadLeadAttachments(photos, "roadworthy");

  // 1) Durable record → dashboard approval queue. Newer columns degrade
  //    gracefully: attachments (036) and detail fields (035) are dropped in
  //    turn if those migrations haven't been run yet.
  let saved = false;
  const sb = getSupabaseAdmin();
  if (sb) {
    const baseRow = {
      status: "pending",
      source: "website",
      name,
      business_name: company || null,
      email,
      phone: toAuPhone(phone),
      rego: rego || null,
      vehicle: vehicleText,
      vehicle_type: vehicleType,
      price: service === "defect" ? defectPrice : axlePrices[String(axles)] ?? null,
      duration_mins: durationMins,
      preferred_date: preferredDate,
      preferred_time: timeStored,
      notes: message || null,
    };
    const detailRowDb = {
      first_name: firstName,
      last_name: lastName,
      abn: abn || null,
      licence_number: licence,
      vehicle_make: make,
      vehicle_model: model,
      vehicle_year: year,
      vin,
    };
    const withPhotos = storedPaths.length ? { attachments: storedPaths } : {};
    const roundDb = inspectionRound === "second" ? { inspection_round: "second" } : {};
    const attempts: Record<string, unknown>[] = [
      { ...baseRow, ...detailRowDb, axles, address, ...withPhotos, ...roundDb, ...(service === "defect" ? { service } : {}) },
      { ...baseRow, ...detailRowDb, axles, address, ...withPhotos, ...(service === "defect" ? { service } : {}) },
      { ...baseRow, ...detailRowDb, axles, address, ...withPhotos },
      { ...baseRow, ...detailRowDb, axles, ...withPhotos },
      ...(storedPaths.length ? [{ ...baseRow, ...detailRowDb, ...withPhotos }] : []),
      { ...baseRow, ...detailRowDb },
      baseRow,
    ];
    for (const row of attempts) {
      const { error } = await sb.from("rwc_bookings").insert(row);
      if (!error) {
        saved = true;
        break;
      }
      if (!/column|schema cache/i.test(error.message)) {
        console.error("[roadworthy] Insert error:", error.message);
        break;
      }
    }
    if (saved) await notifyDashboardNewRwcBooking({ name, inspection: vehicleType, preferredDate });
  }

  // 2) Staff alert email (photos attached).
  let emailed = false;
  if (isMailerConfigured()) {
    const to = await getEmailSetting("roadworthy_email_to", "LVT@arrowindustries.com.au");
    const fromMailbox = await getEmailSetting("roadworthy_email_from", "LVT@arrowindustries.com.au");
    // Send as the roadworthy mailbox; retry as the default if it can't send.
    const sendAs = async (opts: Parameters<typeof sendMail>[0]) => {
      try {
        await sendMail({ ...opts, from: fromMailbox });
      } catch (err) {
        console.error(`[roadworthy] send as ${fromMailbox} failed — retrying as default:`, err);
        await sendMail(opts);
      }
    };
    const rows = [
      ["Service", service === "defect" ? "Defect clearance certificate" : "Roadworthy inspection (RWC)"],
      ["Name", name],
      ["Company", dash(company)],
      ["ABN", dash(abn)],
      ["Email", email],
      ["Phone", phone],
      ["Licence no.", licence],
      ["Address", address],
      ["Vehicle type", vehicleType],
      ["Axles", String(axles)],
      ["Vehicle", vehicleText],
      ["VIN", vin],
      ["Rego", dash(rego.toUpperCase())],
      ["Preferred date", preferredDate],
      ["Preferred time", timeLabel],
      ["Photos", photos.length ? `${photos.length} attached` : "—"],
      ["Notes", dash(message)],
    ]
      .map(([k, v]) => detailRow(k, escapeHtml(v)))
      .join("");
    try {
      await sendAs({
        to,
        subject: `${service === "defect" ? "Defect clearance" : "Roadworthy"} booking request — ${name}${rego ? ` (${rego.toUpperCase()})` : ""}`,
        html: shell(`${service === "defect" ? "Defect clearance" : "Roadworthy"} booking request`, `
          <p><strong>New ${serviceLabel} request</strong> from the website — approve or reject it in the dashboard's Roadworthy tab.</p>
          <table style="border-collapse:collapse;font-size:14px;border-top:2px solid #ddd;border-bottom:2px solid #ddd">${rows}</table>
        `),
        replyTo: email || undefined,
        attachments: bufferAttachments(photos),
      });
      emailed = true;
    } catch (err) {
      console.error("[roadworthy] staff email error (non-fatal):", err);
    }

    // 3) Customer acknowledgement.
    if (email) {
      try {
        await sendAs({
          to: email,
          subject: `${service === "defect" ? "Defect clearance" : "Roadworthy"} booking request received — Arrow Industries`,
          html: shell("Booking request received", `
            <p>Hi ${escapeHtml(firstName)},</p>
            <p>Thanks — we've received your ${serviceLabel} request:</p>
            <table style="border-collapse:collapse;font-size:14px;border-top:2px solid #ddd;border-bottom:2px solid #ddd;margin:8px 0">
              ${detailRow("Vehicle", `<strong>${escapeHtml(vehicleText)}</strong>${rego ? ` (${escapeHtml(rego.toUpperCase())})` : ""}`)}
              ${service === "defect" ? detailRow("Service", "<strong>Heavy Vehicle Defect Clearance Certificate</strong>") : ""}
              ${detailRow("Vehicle type", `${escapeHtml(vehicleType)} · ${axles} axle${axles === 1 ? "" : "s"}`)}
              ${detailRow("Requested", `<strong>${escapeHtml(preferredDate)}</strong> · ${escapeHtml(timeLabel)}`)}
              ${showPrices && (service === "defect" ? defectPrice != null : axlePrices[String(axles)] != null) ? detailRow("Indicative price", `<strong>$${(service === "defect" ? defectPrice : axlePrices[String(axles)]).toFixed(2)} + GST</strong>`) : ""}
            </table>
            ${showPrices && (service === "defect" ? defectPrice != null : axlePrices[String(axles)] != null) ? `<p style="color:#666;font-size:13px;margin-top:2px">The indicative price is based on the vehicle details provided — the final price may change once your booking and vehicle details are confirmed.</p>` : ""}
            <p>This isn't confirmed yet: our team will check the schedule and email you a confirmed time, usually within the same business day. Once confirmed, please plan to <strong>drop the vehicle off 15 minutes before your booking time</strong>.</p>
            <p>Need it urgently? Call us on <a href="${site.phoneHref}">${site.phone}</a>.</p>
          `),
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
