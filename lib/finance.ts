"use server";

import { Resend } from "resend";
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

/* ---------- Option whitelists (must match the form exactly) ---------- */

const equipmentTypeOptions = [
  "Tipper Truck Body",
  "Dog Trailer",
  "Semi Trailer",
  "Truck & Body Package",
  "Repairs / Upgrade",
  "Other Equipment",
] as const;

const financeTypeOptions = [
  "Chattel Mortgage",
  "Finance Lease",
  "Hire Purchase",
  "Rental / Operating Lease",
  "Not Sure — Recommend an Option",
] as const;

const amountOptions = [
  "Under $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000+",
] as const;

const timeframeOptions = [
  "ASAP",
  "2–4 weeks",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

const contactPreferenceOptions = ["Phone", "Email", "Either"] as const;

const businessStructureOptions = [
  "Sole Trader",
  "Partnership",
  "Company",
  "Trust",
  "Not Sure",
] as const;

const yearsTradingOptions = [
  "Less than 1 year",
  "1–2 years",
  "2–5 years",
  "5+ years",
] as const;

const tradeInOptions = ["Yes", "No"] as const;

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const TO =
  process.env.FINANCE_EMAIL_TO ??
  process.env.QUOTE_EMAIL_TO ??
  "sales@arrowindustries.com.au";
// CC the Linx finance partner on every enquiry. Override via env if needed.
const CC = process.env.FINANCE_EMAIL_CC ?? "angelo@linxfinance.com.au";
const FROM_NAME = "Arrow Industries Finance";
const FROM_ADDRESS =
  process.env.QUOTE_EMAIL_FROM ?? "website@arrowindustries.com.au";
const FROM = `${FROM_NAME} <${FROM_ADDRESS}>`;

const GENERIC_ERROR =
  "Something went wrong. Please call us on 0468 067 280 or email sales@arrowindustries.com.au.";
const UPLOAD_ERROR =
  "File upload failed. Please try again or email your files to sales@arrowindustries.com.au.";

/* ---------- Attachment whitelist (images + PDF + Word) ---------- */

const ALLOWED_MIME =
  /^(image\/(jpeg|png|jpg)$|application\/pdf$|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$)/i;
const ALLOWED_EXT = /\.(jpe?g|png|pdf|docx?)$/i;

// 5 submissions per 10 minutes per IP (per server instance).
const checkRateLimit = createRateLimiter();

/* ---------- Server action ---------- */

export async function submitFinanceForm(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept (so bots think it worked) without sending.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  // Contact details
  const fullName = String(formData.get("fullName") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const abn = String(formData.get("abn") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const contactPreference = String(
    formData.get("contactPreference") ?? "",
  ).trim();

  // Finance details
  const equipmentType = String(formData.get("equipmentType") ?? "").trim();
  const financeType = String(formData.get("financeType") ?? "").trim();
  const estimatedAmount = String(formData.get("estimatedAmount") ?? "").trim();
  const deposit = String(formData.get("deposit") ?? "").trim();
  const timeframe = String(formData.get("timeframe") ?? "").trim();

  // Business profile (optional, helps the broker)
  const businessStructure = String(
    formData.get("businessStructure") ?? "",
  ).trim();
  const yearsTrading = String(formData.get("yearsTrading") ?? "").trim();
  const tradeIn = String(formData.get("tradeIn") ?? "").trim();
  const tradeInDetails = String(formData.get("tradeInDetails") ?? "").trim();

  // Notes + consent
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent");

  /* ---------- Validation (return on first failure) ---------- */

  if (!fullName) {
    return { ok: false, error: "Please provide your name.", field: "fullName" };
  }
  if (!email) {
    return {
      ok: false,
      error: "Please provide an email address.",
      field: "email",
    };
  }
  if (!isEmail(email)) {
    return {
      ok: false,
      error: "Please provide a valid email address.",
      field: "email",
    };
  }
  if (!phone) {
    return { ok: false, error: "Please provide a phone number.", field: "phone" };
  }
  if (!isPhone(phone)) {
    return {
      ok: false,
      error: "Please provide a valid phone number.",
      field: "phone",
    };
  }
  if (!location) {
    return {
      ok: false,
      error: "Please provide your suburb or town.",
      field: "location",
    };
  }
  if (!equipmentTypeOptions.includes(equipmentType as never)) {
    return {
      ok: false,
      error: "Please select what you'd like to finance.",
      field: "equipmentType",
    };
  }
  if (!financeTypeOptions.includes(financeType as never)) {
    return {
      ok: false,
      error: "Please select a finance type.",
      field: "financeType",
    };
  }
  if (!amountOptions.includes(estimatedAmount as never)) {
    return {
      ok: false,
      error: "Please select an estimated amount.",
      field: "estimatedAmount",
    };
  }
  if (!timeframeOptions.includes(timeframe as never)) {
    return {
      ok: false,
      error: "Please select a timeframe.",
      field: "timeframe",
    };
  }
  if (!consent) {
    return {
      ok: false,
      error:
        "Please agree to be contacted and to your details being shared with Linx Australia Group to arrange finance.",
      field: "consent",
    };
  }
  // Optional selects: validate only when provided.
  if (contactPreference && !contactPreferenceOptions.includes(contactPreference as never)) {
    return {
      ok: false,
      error: "Please select a valid contact preference.",
      field: "contactPreference",
    };
  }
  if (businessStructure && !businessStructureOptions.includes(businessStructure as never)) {
    return {
      ok: false,
      error: "Please select a valid business structure.",
      field: "businessStructure",
    };
  }
  if (yearsTrading && !yearsTradingOptions.includes(yearsTrading as never)) {
    return {
      ok: false,
      error: "Please select a valid years-trading option.",
      field: "yearsTrading",
    };
  }
  if (tradeIn && !tradeInOptions.includes(tradeIn as never)) {
    return {
      ok: false,
      error: "Please select a valid trade-in option.",
      field: "tradeIn",
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

  // Attachments — optional (quotes, spec sheets, licence). Validate + read.
  const att = await readAttachments(formData.getAll("attachments"), {
    allowedMime: ALLOWED_MIME,
    allowedExt: ALLOWED_EXT,
    typeError: (name) =>
      `${name} isn't a supported type. PDF, Word or image files only.`,
    tooLargeError:
      "Attachments are too large to email. Please email them directly to sales@arrowindustries.com.au.",
    uploadError: UPLOAD_ERROR,
    logTag: "finance",
  });
  if (!att.ok) return { ok: false, error: att.error };
  const attachments = att.attachments;

  // Build the email
  const subject = `New Arrow Finance Enquiry — ${equipmentType} (${estimatedAmount})`;
  const attachmentNames = attachments.map((a) => a.filename);
  const fields: EmailFields = {
    fullName,
    businessName,
    abn,
    email,
    phone,
    location,
    contactPreference,
    equipmentType,
    financeType,
    estimatedAmount,
    deposit,
    timeframe,
    businessStructure,
    yearsTrading,
    tradeIn,
    tradeInDetails,
    message,
    attachmentNames,
  };
  const text = renderText(fields);
  const html = renderHtml(fields);

  // Upload attachments to Storage so they're viewable in the dashboard
  // (best-effort; falls back to filenames if Storage isn't configured).
  const storedAttachments = await uploadLeadAttachments(attachments, "finance");

  // Persist to Supabase (source of truth for the dashboard) — best effort,
  // never blocks the submission.
  await saveLead({
    source: "finance",
    name: fullName,
    businessName,
    email,
    phone,
    location,
    enquiryType: equipmentType,
    financeType,
    estimatedAmount,
    timeframe,
    message,
    attachments: storedAttachments.length ? storedAttachments : attachmentNames,
    details: {
      abn,
      contactPreference,
      deposit,
      businessStructure,
      yearsTrading,
      tradeIn,
      tradeInDetails,
    },
  });

  // If RESEND_API_KEY isn't set (e.g. local dev), log + return success so the
  // form flow can still be tested. Production deployments must have the key.
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[finance] RESEND_API_KEY not set — email not sent. Payload:\n",
      text,
    );
    return { ok: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const financeTo = await getEmailSetting("finance_email_to", TO);
    const financeCc = await getEmailSetting("finance_email_cc", CC || "");
    const result = await resend.emails.send({
      from: FROM,
      to: [financeTo],
      cc: financeCc ? [financeCc] : undefined,
      replyTo: email || undefined,
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (result.error) {
      console.error("[finance] Resend error:", result.error);
      if (attachments.length > 0) {
        return { ok: false, error: UPLOAD_ERROR };
      }
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true };
  } catch (err) {
    console.error("[finance] Submission error:", err);
    return { ok: false, error: GENERIC_ERROR };
  }
}

/* ---------- Renderers ---------- */

interface EmailFields {
  fullName: string;
  businessName: string;
  abn: string;
  email: string;
  phone: string;
  location: string;
  contactPreference: string;
  equipmentType: string;
  financeType: string;
  estimatedAmount: string;
  deposit: string;
  timeframe: string;
  businessStructure: string;
  yearsTrading: string;
  tradeIn: string;
  tradeInDetails: string;
  message: string;
  attachmentNames: string[];
}

function renderText(f: EmailFields) {
  return [
    "New Arrow Industries finance enquiry",
    "",
    `Name: ${dash(f.fullName)}`,
    `Business: ${dash(f.businessName)}`,
    `ABN: ${dash(f.abn)}`,
    `Email: ${dash(f.email)}`,
    `Phone: ${dash(f.phone)}`,
    `Suburb / Town: ${dash(f.location)}`,
    `Preferred contact: ${dash(f.contactPreference)}`,
    "",
    `Equipment: ${f.equipmentType}`,
    `Finance type: ${f.financeType}`,
    `Estimated amount: ${f.estimatedAmount}`,
    `Deposit available: ${dash(f.deposit)}`,
    `Timeframe: ${f.timeframe}`,
    "",
    `Business structure: ${dash(f.businessStructure)}`,
    `Years trading: ${dash(f.yearsTrading)}`,
    `Trade-in: ${dash(f.tradeIn)}`,
    `Trade-in details: ${dash(f.tradeInDetails)}`,
    "",
    "Message:",
    dash(f.message),
    "",
    `Attachments: ${
      f.attachmentNames.length > 0 ? f.attachmentNames.join(", ") : "—"
    }`,
    "",
    "—",
    "Applicant consented to be contacted and to their details being shared with Linx Australia Group to arrange finance.",
    "Submitted from: Arrow Industries website (Finance)",
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");
}

function renderHtml(f: EmailFields) {
  const row = (label: string, value: string, multiline = false) => {
    const v = escapeHtml(dash(value));
    return `<tr>
      <td style="padding:10px 16px 10px 0;color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;width:180px;vertical-align:top;">${label}</td>
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
          <div style="margin-top:6px;font-size:20px;font-weight:700;">New finance enquiry — ${escapeHtml(f.equipmentType)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", f.fullName)}
            ${row("Business", f.businessName)}
            ${row("ABN", f.abn)}
            ${row("Email", f.email)}
            ${row("Phone", f.phone)}
            ${row("Suburb / Town", f.location)}
            ${row("Preferred contact", f.contactPreference)}
          </table>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Equipment", f.equipmentType)}
              ${row("Finance type", f.financeType)}
              ${row("Estimated amount", f.estimatedAmount)}
              ${row("Deposit available", f.deposit)}
              ${row("Timeframe", f.timeframe)}
              ${row("Business structure", f.businessStructure)}
              ${row("Years trading", f.yearsTrading)}
              ${row("Trade-in", f.tradeIn)}
              ${row("Trade-in details", f.tradeInDetails, true)}
            </table>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Message</div>
            <div style="color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dash(f.message))}</div>
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Attachments</div>
            <div style="color:#111;font-size:15px;line-height:1.6;">${
              f.attachmentNames.length > 0
                ? f.attachmentNames.map((n) => `• ${escapeHtml(n)}`).join("<br/>")
                : "—"
            }</div>
          </div>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#fafafa;border-top:1px solid #e5e5e5;color:#888;font-size:12px;">
          Applicant consented to be contacted and to their details being shared with Linx Australia Group to arrange finance. Reply directly to respond to the applicant.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
