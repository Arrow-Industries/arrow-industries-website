"use server";

import { Resend } from "resend";
import { createMondayCandidate } from "@/lib/monday";
import { saveApplication } from "@/lib/leads";
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

const roleOptions = [
  "Boilermaker / Fabricator",
  "Auto Electrician",
  "Painter",
  "Hydraulic Fitter",
  "Trade Assistant",
  "Apprentice",
  "Other",
] as const;

const industryExperienceOptions = [
  "Tipper Bodies",
  "Truck Bodies",
  "Trailers",
  "Heavy Vehicle Manufacturing",
  "Hydraulics",
  "Fabrication / Structural Steel",
  "Automotive",
  "General Manufacturing",
  "No Direct Industry Experience",
] as const;

const yearsExperienceOptions = [
  "Apprentice",
  "Less than 1 Year",
  "1–3 Years",
  "3–5 Years",
  "5–10 Years",
  "10+ Years",
] as const;

const workRightsOptions = [
  "Australian Citizen",
  "Permanent Resident",
  "Full Working Rights Visa",
  "Restricted Visa",
  "Prefer Not To Say",
] as const;

const availabilityOptions = [
  "Immediately",
  "1 Week",
  "2 Weeks",
  "1 Month",
  "More Than 1 Month",
] as const;

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

const TO =
  process.env.CAREERS_EMAIL_TO ??
  process.env.QUOTE_EMAIL_TO ??
  "sales@arrowindustries.com.au";
const FROM_NAME = "Arrow Industries Careers";
const FROM_ADDRESS =
  process.env.QUOTE_EMAIL_FROM ?? "website@arrowindustries.com.au";
const FROM = `${FROM_NAME} <${FROM_ADDRESS}>`;

const GENERIC_ERROR =
  "Something went wrong. Please call us on 0468 067 280 or email sales@arrowindustries.com.au.";
const UPLOAD_ERROR =
  "Resume upload failed. Please try again or email your resume to sales@arrowindustries.com.au.";

/* ---------- Attachment whitelist (images + PDF + Word) ---------- */

const ALLOWED_MIME =
  /^(image\/(jpeg|png|jpg)$|application\/pdf$|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$)/i;
const ALLOWED_EXT = /\.(jpe?g|png|pdf|docx?)$/i;

// 5 submissions per 10 minutes per IP (per server instance).
const checkRateLimit = createRateLimiter();

/* ---------- Candidate scoring (server-side only — never shown to applicant) ---------- */

const HEAVY_VEHICLE_INDUSTRY = new Set<string>([
  "Tipper Bodies",
  "Truck Bodies",
  "Trailers",
  "Heavy Vehicle Manufacturing",
]);

function scoreCandidate(f: CareerFields): { score: number; category: string } {
  let score = 0;

  if (f.tradeQualified === "Yes") score += 20;

  if (f.yearsExperience === "5–10 Years" || f.yearsExperience === "10+ Years") {
    score += 20;
  }

  // Only one licence band applies.
  if (f.licenceClass === "HR") score += 5;
  else if (f.licenceClass === "HC") score += 10;
  else if (f.licenceClass === "MC") score += 15;

  if (f.forklift === "Yes") score += 5;
  if (f.weldingTickets === "Yes") score += 10;
  if (f.readDrawings === "Yes") score += 10;
  if (f.availability === "Immediately") score += 5;
  if (f.drugAlcohol === "Yes") score += 10;

  // Heavy vehicle / trailer experience.
  if (HEAVY_VEHICLE_INDUSTRY.has(f.industryExperience)) score += 15;

  // Hydraulic experience (industry OR role).
  if (f.industryExperience === "Hydraulics" || f.role === "Hydraulic Fitter") {
    score += 10;
  }

  // NOTE: "Strong Written Response +10" is a MANUAL reviewer adjustment — not
  // applied here. The email/Monday update flags this for the reviewer.

  let category: string;
  if (score >= 90) category = "Priority Interview";
  else if (score >= 70) category = "Interview Review";
  else if (score >= 50) category = "Future Opportunity";
  else category = "Low Priority";

  return { score, category };
}

/* ---------- Server action ---------- */

export async function submitCareersForm(
  _prevState: SubmitResult | null,
  formData: FormData,
): Promise<SubmitResult> {
  // Honeypot — silently accept (so bots think it worked) without sending.
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return { ok: true };

  // Personal details
  const fullName = String(formData.get("fullName") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const suburb = String(formData.get("suburb") ?? "").trim();

  // Role information
  const role = String(formData.get("role") ?? "").trim();
  const industryExperience = String(
    formData.get("industryExperience") ?? "",
  ).trim();
  const yearsExperience = String(formData.get("yearsExperience") ?? "").trim();

  // Qualifications & tickets
  const workRights = String(formData.get("workRights") ?? "").trim();
  const licenceClass = String(formData.get("licenceClass") ?? "").trim();
  const forklift = String(formData.get("forklift") ?? "").trim();
  const tradeQualified = String(formData.get("tradeQualified") ?? "").trim();
  const weldingTickets = String(formData.get("weldingTickets") ?? "").trim();
  const readDrawings = String(formData.get("readDrawings") ?? "").trim();
  const drugAlcohol = String(formData.get("drugAlcohol") ?? "").trim();

  // Availability
  const availability = String(formData.get("availability") ?? "").trim();

  // Screening + notes
  const whyHire = String(formData.get("whyHire") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  /* ---------- Validation (return on first failure) ---------- */

  if (!fullName) {
    return { ok: false, error: "Please provide your name.", field: "fullName" };
  }
  if (!mobile) {
    return {
      ok: false,
      error: "Please provide your mobile number.",
      field: "mobile",
    };
  }
  if (!isPhone(mobile)) {
    return {
      ok: false,
      error: "Please provide a valid mobile number.",
      field: "mobile",
    };
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
  if (!suburb) {
    return { ok: false, error: "Please provide your suburb.", field: "suburb" };
  }
  if (!roleOptions.includes(role as (typeof roleOptions)[number])) {
    return {
      ok: false,
      error: "Please select the role you're interested in.",
      field: "role",
    };
  }
  if (
    !industryExperienceOptions.includes(
      industryExperience as (typeof industryExperienceOptions)[number],
    )
  ) {
    return {
      ok: false,
      error: "Please select your relevant industry experience.",
      field: "industryExperience",
    };
  }
  if (
    !yearsExperienceOptions.includes(
      yearsExperience as (typeof yearsExperienceOptions)[number],
    )
  ) {
    return {
      ok: false,
      error: "Please select your years of experience.",
      field: "yearsExperience",
    };
  }
  if (
    !workRightsOptions.includes(workRights as (typeof workRightsOptions)[number])
  ) {
    return {
      ok: false,
      error: "Please select your Australian work rights.",
      field: "workRights",
    };
  }
  if (
    !availabilityOptions.includes(
      availability as (typeof availabilityOptions)[number],
    )
  ) {
    return {
      ok: false,
      error: "Please select your availability.",
      field: "availability",
    };
  }
  if (!whyHire) {
    return {
      ok: false,
      error: "Please tell us why we should hire you.",
      field: "whyHire",
    };
  }
  if (whyHire.length > 250) {
    return {
      ok: false,
      error: "Please keep your response to 250 characters or fewer.",
      field: "whyHire",
    };
  }

  // Rate limit (after validation so attackers can't spam to identify limits)
  const rl = await checkRateLimit();
  if (!rl.ok) {
    return {
      ok: false,
      error:
        "You've sent a few applications already. Please try again shortly, or call us direct.",
    };
  }

  // Resume — OPTIONAL. Validate, read into Buffers, build Resend attachments.
  const att = await readAttachments(formData.getAll("resume"), {
    allowedMime: ALLOWED_MIME,
    allowedExt: ALLOWED_EXT,
    typeError: (name) =>
      `${name} isn't a supported type. PDF, Word or image files only.`,
    tooLargeError:
      "Your files are too large to email. Please email them directly to sales@arrowindustries.com.au.",
    uploadError: UPLOAD_ERROR,
    logTag: "careers",
  });
  if (!att.ok) return { ok: false, error: att.error };
  const attachments = att.attachments;

  // Score the candidate (server-side only).
  const fields: CareerFields = {
    fullName,
    mobile,
    email,
    suburb,
    role,
    industryExperience,
    yearsExperience,
    workRights,
    licenceClass,
    forklift,
    tradeQualified,
    weldingTickets,
    readDrawings,
    drugAlcohol,
    availability,
    whyHire,
    message,
    attachmentNames: attachments.map((a) => a.filename),
  };
  const { score, category } = scoreCandidate(fields);

  // Persist to Supabase (source of truth for the dashboard) — best effort,
  // never blocks the submission.
  await saveApplication({
    name: fullName,
    email,
    mobile,
    suburb,
    role,
    industryExperience,
    yearsExperience,
    workRights,
    availability,
    score,
    category,
    whyHire,
    message,
    resumeNames: fields.attachmentNames,
    details: {
      licenceClass,
      forklift,
      tradeQualified,
      weldingTickets,
      readDrawings,
      drugAlcohol,
    },
  });

  // Build the email
  const subject = `New Arrow Job Application — ${role} (${category}, score ${score})`;
  const text = renderText(fields, score, category);
  const html = renderHtml(fields, score, category);

  // If RESEND_API_KEY isn't set (e.g. local dev), log + return success so the
  // form flow can still be tested. Production deployments must have the key.
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[careers] RESEND_API_KEY not set — email not sent. Payload:\n",
      text,
    );
    // Still attempt the best-effort Monday sync in dev if it's configured.
    await syncMonday(fields, score, category);
    return { ok: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email || undefined,
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (result.error) {
      console.error("[careers] Resend error:", result.error);
      if (attachments.length > 0) {
        return { ok: false, error: UPLOAD_ERROR };
      }
      return { ok: false, error: GENERIC_ERROR };
    }
  } catch (err) {
    console.error("[careers] Submission error:", err);
    return { ok: false, error: GENERIC_ERROR };
  }

  // Email succeeded — fire the best-effort Monday sync (never blocks/fails).
  await syncMonday(fields, score, category);

  return { ok: true };
}

/** Best-effort Monday.com mirror. Never surfaces errors to the user. */
async function syncMonday(
  f: CareerFields,
  score: number,
  category: string,
): Promise<void> {
  try {
    await createMondayCandidate({
      fullName: f.fullName,
      mobile: f.mobile,
      email: f.email,
      suburb: f.suburb,
      role: f.role,
      industryExperience: f.industryExperience,
      yearsExperience: f.yearsExperience,
      workRights: f.workRights,
      licenceClass: f.licenceClass,
      forklift: f.forklift,
      tradeQualified: f.tradeQualified,
      weldingTickets: f.weldingTickets,
      readDrawings: f.readDrawings,
      drugAlcohol: f.drugAlcohol,
      availability: f.availability,
      whyHire: f.whyHire,
      message: f.message,
      score,
      category,
      attachmentNames: f.attachmentNames,
    });
  } catch (err) {
    console.error("[careers] Monday sync error (ignored):", err);
  }
}

/* ---------- Renderers ---------- */

interface CareerFields {
  fullName: string;
  mobile: string;
  email: string;
  suburb: string;
  role: string;
  industryExperience: string;
  yearsExperience: string;
  workRights: string;
  licenceClass: string;
  forklift: string;
  tradeQualified: string;
  weldingTickets: string;
  readDrawings: string;
  drugAlcohol: string;
  availability: string;
  whyHire: string;
  message: string;
  attachmentNames: string[];
}

const MANUAL_NOTE =
  "Reviewer note: this score is automatic. Add +10 manually if the written response below is strong.";

function renderText(f: CareerFields, score: number, category: string) {
  return [
    "New Arrow Industries job application",
    "",
    `Score: ${score} — ${category}`,
    MANUAL_NOTE,
    "",
    "— Personal Details —",
    `Name: ${dash(f.fullName)}`,
    `Mobile: ${dash(f.mobile)}`,
    `Email: ${dash(f.email)}`,
    `Suburb: ${dash(f.suburb)}`,
    "",
    "— Role Information —",
    `Role of interest: ${dash(f.role)}`,
    `Relevant industry experience: ${dash(f.industryExperience)}`,
    `Years experience: ${dash(f.yearsExperience)}`,
    "",
    "— Qualifications & Tickets —",
    `Australian work rights: ${dash(f.workRights)}`,
    `Driver licence class: ${dash(f.licenceClass)}`,
    `Forklift licence: ${dash(f.forklift)}`,
    `Trade qualified: ${dash(f.tradeQualified)}`,
    `Welding tickets: ${dash(f.weldingTickets)}`,
    `Can read fabrication drawings: ${dash(f.readDrawings)}`,
    `Can pass drug & alcohol test: ${dash(f.drugAlcohol)}`,
    "",
    "— Availability —",
    `Availability / start date: ${dash(f.availability)}`,
    "",
    "— Why should we hire you? —",
    dash(f.whyHire),
    "",
    "— Additional Notes —",
    dash(f.message),
    "",
    `Attachments: ${
      f.attachmentNames.length > 0 ? f.attachmentNames.join(", ") : "—"
    }`,
    "",
    "—",
    "Submitted from: Arrow Industries website (Careers)",
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");
}

function renderHtml(f: CareerFields, score: number, category: string) {
  const row = (label: string, value: string, multiline = false) => {
    const v = escapeHtml(dash(value));
    return `<tr>
      <td style="padding:10px 16px 10px 0;color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;width:200px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#111;font-size:15px;line-height:1.55;${multiline ? "white-space:pre-wrap;" : ""}">${v}</td>
    </tr>`;
  };

  const sectionHeading = (label: string) =>
    `<tr><td colspan="2" style="padding:22px 0 6px;color:#0a0a0a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #e5e5e5;">${label}</td></tr>`;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border:1px solid #e5e5e5;">
        <tr><td style="padding:28px 32px;background:#0a0a0a;color:#fff;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#e10600;">Arrow Industries</div>
          <div style="margin-top:6px;font-size:20px;font-weight:700;">New job application — ${escapeHtml(f.role)}</div>
          <div style="margin-top:10px;display:inline-block;padding:6px 12px;background:#e10600;color:#fff;font-size:13px;font-weight:700;border-radius:2px;">${escapeHtml(category)} · Score ${score}</div>
          <div style="margin-top:10px;color:#bbb;font-size:12px;line-height:1.5;">${escapeHtml(MANUAL_NOTE)}</div>
        </td></tr>
        <tr><td style="padding:8px 32px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${sectionHeading("Personal Details")}
            ${row("Name", f.fullName)}
            ${row("Mobile", f.mobile)}
            ${row("Email", f.email)}
            ${row("Suburb", f.suburb)}
            ${sectionHeading("Role Information")}
            ${row("Role of interest", f.role)}
            ${row("Relevant industry experience", f.industryExperience)}
            ${row("Years experience", f.yearsExperience)}
            ${sectionHeading("Qualifications & Tickets")}
            ${row("Australian work rights", f.workRights)}
            ${row("Driver licence class", f.licenceClass)}
            ${row("Forklift licence", f.forklift)}
            ${row("Trade qualified", f.tradeQualified)}
            ${row("Welding tickets", f.weldingTickets)}
            ${row("Can read fabrication drawings", f.readDrawings)}
            ${row("Can pass drug & alcohol test", f.drugAlcohol)}
            ${sectionHeading("Availability")}
            ${row("Availability / start date", f.availability)}
          </table>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Why should we hire you?</div>
            <div style="color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dash(f.whyHire))}</div>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Additional notes</div>
            <div style="color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(dash(f.message))}</div>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5e5;">
            <div style="color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Resume / attachments</div>
            <div style="color:#111;font-size:15px;line-height:1.6;">${
              f.attachmentNames.length > 0
                ? f.attachmentNames.map((n) => `• ${escapeHtml(n)}`).join("<br/>")
                : "—"
            }</div>
          </div>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#fafafa;border-top:1px solid #e5e5e5;color:#888;font-size:12px;">
          Submitted from the Arrow Industries website careers page. Reply directly to respond to the applicant.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
