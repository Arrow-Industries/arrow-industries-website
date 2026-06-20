"use server";

import { sendMail, bufferAttachments, isMailerConfigured } from "@/lib/mailer";
import { saveLead } from "@/lib/leads";
import { uploadLeadAttachments } from "@/lib/lead-attachments";
import { getEmailSetting } from "@/lib/email-config";
import {
  isEmail,
  isPhone,
  dash,
  escapeHtml,
  createRateLimiter,
  readAttachments,
} from "@/lib/form-utils";

// Internal-only consts/types. A `"use server"` module is restricted to
// exporting async functions, so these stay private to this file.
const enquiryTypes = [
  "Tipper Truck Body",
  "Dog Trailer",
  "Semi Trailer",
  "Repairs & Servicing",
  "Roadworthy / LVT",
  "Parts & Components",
  "General Enquiry",
] as const;

type EnquiryType = (typeof enquiryTypes)[number];

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const TO = process.env.QUOTE_EMAIL_TO ?? "sales@arrowindustries.com.au";

const GENERIC_ERROR =
  "Something went wrong. Please call us on 0468 067 280 or email sales@arrowindustries.com.au.";
const UPLOAD_ERROR =
  "File upload failed. Please try again or email your files to sales@arrowindustries.com.au.";

/* ---------- Attachment whitelist (images + PDF) ---------- */

const ALLOWED_MIME = /^(image\/|application\/pdf$)/i;
const ALLOWED_EXT = /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?|pdf)$/i;

// 5 submissions per 10 minutes per IP (per server instance).
const checkRateLimit = createRateLimiter();

/* ---------- Server action ---------- */

export async function submitQuoteForm(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept (so bots think it worked) without sending.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  const name = String(formData.get("fullName") ?? "").trim();
  const business = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const enquiryTypeRaw = String(formData.get("enquiryType") ?? "").trim();
  const vehicleMake = String(formData.get("vehicleMake") ?? "").trim();
  const vehicleModel = String(formData.get("vehicleModel") ?? "").trim();
  const vehicle = [vehicleMake, vehicleModel].filter(Boolean).join(" ");
  const vehicleYear = String(formData.get("vehicleYear") ?? "").trim();
  const vin = String(formData.get("vinNumber") ?? "").trim();
  const payload = String(formData.get("payloadDetails") ?? "").trim();
  const timeframe = String(formData.get("timeframe") ?? "").trim();
  const message = String(formData.get("description") ?? "").trim();

  // Validation
  if (!name) {
    return { ok: false, error: "Please provide your name.", field: "fullName" };
  }
  if (!email && !phone) {
    return {
      ok: false,
      error: "Please provide either an email address or a phone number.",
      field: "email",
    };
  }
  if (email && !isEmail(email)) {
    return {
      ok: false,
      error: "Please provide a valid email address.",
      field: "email",
    };
  }
  if (phone && !isPhone(phone)) {
    return {
      ok: false,
      error: "Please provide a valid phone number.",
      field: "phone",
    };
  }
  if (!enquiryTypes.includes(enquiryTypeRaw as EnquiryType)) {
    return {
      ok: false,
      error: "Please select an enquiry type.",
      field: "enquiryType",
    };
  }
  if (!message && !vehicle) {
    return {
      ok: false,
      error:
        "Please describe what you need or provide vehicle / chassis details.",
      field: "description",
    };
  }

  // Rate limit (after validation so attackers can't spam to identify limits)
  const rl = await checkRateLimit();
  if (!rl.ok) {
    return {
      ok: false,
      error:
        "You've sent a few enquiries already. Please try again shortly, or call us direct.",
    };
  }

  // Attachments — validate, read into Buffers, build Resend attachments array
  const att = await readAttachments(formData.getAll("attachments"), {
    allowedMime: ALLOWED_MIME,
    allowedExt: ALLOWED_EXT,
    typeError: (name) =>
      `${name} isn't a supported type. Images and PDFs only.`,
    tooLargeError:
      "Attachments are too large to email. Please email them directly to sales@arrowindustries.com.au.",
    uploadError: UPLOAD_ERROR,
    logTag: "quote",
  });
  if (!att.ok) return { ok: false, error: att.error };
  const attachments = att.attachments;

  // Build the email
  const enquiryType = enquiryTypeRaw as EnquiryType;
  const subject = `New Arrow Quote Request — ${enquiryType}`;
  const attachmentNames = attachments.map((a) => a.filename);
  const fields: EmailFields = {
    name,
    business,
    email,
    phone,
    location,
    enquiryType,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vin,
    payload,
    timeframe,
    message,
    attachmentNames,
  };
  const text = renderText(fields);
  const html = renderHtml(fields);

  // Upload attachments to Storage so they're viewable in the dashboard
  // (best-effort; falls back to filenames if Storage isn't configured).
  const storedAttachments = await uploadLeadAttachments(attachments, "quote");

  // Persist to Supabase (source of truth for the dashboard) — best effort,
  // never blocks the submission.
  await saveLead({
    source: "quote",
    name,
    businessName: business,
    email,
    phone,
    location,
    enquiryType,
    timeframe,
    message,
    attachments: storedAttachments.length ? storedAttachments : attachmentNames,
    details: {
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vin,
      payload,
    },
  });

  // If the M365 mailer isn't configured (e.g. local dev), log + return success
  // so the form flow can still be tested. Production must have the Azure vars.
  if (!isMailerConfigured()) {
    console.warn(
      "[quote] M365 mailer not configured — email not sent. Payload:\n",
      text,
    );
    return { ok: true };
  }

  try {
    await sendMail({
      to: await getEmailSetting("quote_email_to", TO),
      replyTo: email || undefined,
      subject,
      html,
      attachments: attachments.length > 0 ? bufferAttachments(attachments) : undefined,
    });
    return { ok: true };
  } catch (err) {
    console.error("[quote] sendMail error:", err);
    // Distinguish attachment-related failures from generic delivery errors.
    if (attachments.length > 0) {
      return { ok: false, error: UPLOAD_ERROR };
    }
    return { ok: false, error: GENERIC_ERROR };
  }
}

/* ---------- Renderers ---------- */

interface EmailFields {
  name: string;
  business: string;
  email: string;
  phone: string;
  location: string;
  enquiryType: EnquiryType;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vin: string;
  payload: string;
  timeframe: string;
  message: string;
  attachmentNames: string[];
}

function renderText(f: EmailFields) {
  return [
    "New Arrow Industries quote request",
    "",
    `Name: ${dash(f.name)}`,
    `Business: ${dash(f.business)}`,
    `Email: ${dash(f.email)}`,
    `Phone: ${dash(f.phone)}`,
    `Location: ${dash(f.location)}`,
    `Enquiry Type: ${f.enquiryType}`,
    `Vehicle (Make): ${dash(f.vehicleMake)}`,
    `Model: ${dash(f.vehicleModel)}`,
    `Vehicle Year: ${dash(f.vehicleYear)}`,
    `VIN Number: ${dash(f.vin)}`,
    `Payload / Application: ${dash(f.payload)}`,
    `Preferred Timeframe: ${dash(f.timeframe)}`,
    "",
    "Message:",
    dash(f.message),
    "",
    `Attachments: ${
      f.attachmentNames.length > 0
        ? f.attachmentNames.join(", ")
        : "—"
    }`,
    "",
    "—",
    "Submitted from: Arrow Industries website",
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");
}

function renderHtml(f: EmailFields) {
  const row = (label: string, value: string, multiline = false) => {
    const v = escapeHtml(dash(value));
    return `<tr>
      <td style="padding:10px 16px 10px 0;color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;width:170px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#111;font-size:15px;line-height:1.55;${multiline ? "white-space:pre-wrap;" : ""}">${v}</td>
    </tr>`;
  };

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border:1px solid #e5e5e5;">
        <tr><td style="padding:28px 32px;background:#0a0a0a;color:#fff;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#e10600;">Arrow Industries</div>
          <div style="margin-top:6px;font-size:20px;font-weight:700;">New quote request — ${escapeHtml(f.enquiryType)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", f.name)}
            ${row("Business", f.business)}
            ${row("Email", f.email)}
            ${row("Phone", f.phone)}
            ${row("Location", f.location)}
            ${row("Enquiry Type", f.enquiryType)}
            ${row("Vehicle (Make)", f.vehicleMake)}
            ${row("Model", f.vehicleModel)}
            ${row("Vehicle Year", f.vehicleYear)}
            ${row("VIN Number", f.vin)}
            ${row("Payload / Application", f.payload, true)}
            ${row("Preferred Timeframe", f.timeframe)}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Message</div>
            <div style="color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dash(f.message))}</div>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Attachments</div>
            <div style="color:#111;font-size:15px;line-height:1.6;">${
              f.attachmentNames.length > 0
                ? f.attachmentNames
                    .map((n) => `• ${escapeHtml(n)}`)
                    .join("<br/>")
                : "—"
            }</div>
          </div>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#fafafa;border-top:1px solid #e5e5e5;color:#888;font-size:12px;">
          Submitted from the Arrow Industries website. Reply directly to respond to the customer.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
