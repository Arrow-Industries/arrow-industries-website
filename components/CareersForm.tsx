"use client";

import { useActionState, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Paperclip,
  X,
} from "lucide-react";
import { submitCareersForm } from "@/lib/careers";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";

/* ---------- Option lists (must match lib/careers.ts whitelists exactly) ---------- */

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

const licenceClassOptions = [
  "None",
  "Car Licence",
  "MR",
  "HR",
  "HC",
  "MC",
] as const;

const forkliftOptions = ["Yes", "No"] as const;

const tradeQualifiedOptions = [
  "Yes",
  "No",
  "Currently Completing",
  "Not Applicable",
] as const;

const weldingTicketsOptions = ["Yes", "No", "Not Applicable"] as const;

const readDrawingsOptions = [
  "Yes",
  "No",
  "Learning",
  "Not Applicable",
] as const;

const drugAlcoholOptions = ["Yes", "No", "Prefer Not To Say"] as const;

const availabilityOptions = [
  "Immediately",
  "1 Week",
  "2 Weeks",
  "1 Month",
  "More Than 1 Month",
] as const;

const WHY_HIRE_MAX = 250;

const inputBase =
  "w-full rounded-sm border border-line bg-ink-2 px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const labelBase =
  "block text-xs font-semibold uppercase tracking-[0.16em] text-mute";

const subHeadingBase =
  "text-xs font-semibold uppercase tracking-[0.22em] text-accent-text";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CareersForm() {
  const [state, formAction, isPending] = useActionState(
    submitCareersForm,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [whyHireCount, setWhyHireCount] = useState(0);

  function syncFileInput(next: File[]) {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }

  function handleFileChange(list: FileList | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    const oversize = incoming.find((f) => f.size > MAX_FILE_BYTES);
    if (oversize) {
      setFileError(
        `${oversize.name} is over 10MB. Please attach a smaller file.`,
      );
      return;
    }
    setFileError(null);
    const next = [...files, ...incoming];
    setFiles(next);
    syncFileInput(next);
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncFileInput(next);
    setFileError(null);
  }

  if (state?.ok) {
    return (
      <div className="border border-line-soft bg-ink-2 p-8 text-center sm:p-10">
        <CheckCircle2
          className="mx-auto h-9 w-9 text-accent"
          strokeWidth={1.5}
        />
        <h2 className="mt-5 font-display text-2xl font-extrabold text-bone">
          Thanks — your application has been sent.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute sm:text-base">
          We&rsquo;ve received your details. If there&rsquo;s a fit, someone
          from the Arrow team will be in touch about the next step.
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mute">
          Strong applications are kept on file even when nothing&rsquo;s
          advertised, so it&rsquo;s always worth getting in touch.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute">
          For a quick chat, call us on{" "}
          <a href={site.phoneHref} className="text-accent-text hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/about" size="md">
            About Arrow
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/" size="md" variant="secondary">
            Back to homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="grid gap-8" noValidate>
      {/* Honeypot — must remain empty. Hidden from real users + assistive tech. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* ---------- Personal Details ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Personal Details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="fullName" required>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className={inputBase}
            />
          </Field>

          <Field label="Mobile Number" name="mobile" required>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              autoComplete="tel"
              placeholder="e.g. 0468 067 280"
              className={inputBase}
            />
          </Field>

          <Field label="Email Address" name="email" required>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputBase}
            />
          </Field>

          <Field label="Suburb" name="suburb" required>
            <input
              id="suburb"
              name="suburb"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="e.g. Campbellfield"
              className={inputBase}
            />
          </Field>
        </div>
      </fieldset>

      {/* ---------- Role Information ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Role Information</legend>

        <Field label="Role You're Interested In" name="role" required>
          <SelectField
            id="role"
            name="role"
            required
            placeholder="Select a role…"
            options={roleOptions}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Relevant Industry Experience"
            name="industryExperience"
            required
          >
            <SelectField
              id="industryExperience"
              name="industryExperience"
              required
              placeholder="Select your experience…"
              options={industryExperienceOptions}
            />
          </Field>

          <Field label="Years Experience" name="yearsExperience" required>
            <SelectField
              id="yearsExperience"
              name="yearsExperience"
              required
              placeholder="Select years…"
              options={yearsExperienceOptions}
            />
          </Field>
        </div>
      </fieldset>

      {/* ---------- Qualifications & Tickets ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Qualifications &amp; Tickets</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Australian Work Rights" name="workRights" required>
            <SelectField
              id="workRights"
              name="workRights"
              required
              placeholder="Select…"
              options={workRightsOptions}
            />
          </Field>

          <Field label="Driver Licence Class" name="licenceClass">
            <SelectField
              id="licenceClass"
              name="licenceClass"
              placeholder="Select…"
              options={licenceClassOptions}
            />
          </Field>

          <Field label="Forklift Licence" name="forklift">
            <SelectField
              id="forklift"
              name="forklift"
              placeholder="Select…"
              options={forkliftOptions}
            />
          </Field>

          <Field label="Trade Qualified" name="tradeQualified">
            <SelectField
              id="tradeQualified"
              name="tradeQualified"
              placeholder="Select…"
              options={tradeQualifiedOptions}
            />
          </Field>

          <Field label="Welding Tickets" name="weldingTickets">
            <SelectField
              id="weldingTickets"
              name="weldingTickets"
              placeholder="Select…"
              options={weldingTicketsOptions}
            />
          </Field>

          <Field label="Can Read Fabrication Drawings?" name="readDrawings">
            <SelectField
              id="readDrawings"
              name="readDrawings"
              placeholder="Select…"
              options={readDrawingsOptions}
            />
          </Field>

          <Field label="Can Pass Drug & Alcohol Test?" name="drugAlcohol">
            <SelectField
              id="drugAlcohol"
              name="drugAlcohol"
              placeholder="Select…"
              options={drugAlcoholOptions}
            />
          </Field>
        </div>
      </fieldset>

      {/* ---------- Availability ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Availability</legend>
        <Field label="Availability / Start Date" name="availability" required>
          <SelectField
            id="availability"
            name="availability"
            required
            placeholder="Select…"
            options={availabilityOptions}
          />
        </Field>
      </fieldset>

      {/* ---------- Screening ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>A quick question</legend>
        <Field label="Why should we hire you?" name="whyHire" required>
          <textarea
            id="whyHire"
            name="whyHire"
            rows={4}
            required
            maxLength={WHY_HIRE_MAX}
            placeholder="Tell us briefly what makes you a good fit."
            onChange={(e) => setWhyHireCount(e.target.value.length)}
            className={cn(inputBase, "resize-y")}
          />
          <p className="text-right text-xs text-mute">
            {whyHireCount} / {WHY_HIRE_MAX}
          </p>
        </Field>
      </fieldset>

      {/* ---------- Resume ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Resume</legend>
        <Field
          label="Attach your resume"
          name="resume"
          hint="No resume? No problem. Apply anyway."
        >
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex w-fit items-center gap-2 rounded-sm border border-line bg-ink-2 px-4 py-3 text-sm text-bone transition-colors hover:border-bone"
            >
              <Paperclip className="h-4 w-4 text-accent" aria-hidden />
              {files.length > 0
                ? `${files.length} file${files.length === 1 ? "" : "s"} selected — add more`
                : "Choose files"}
            </button>
            <input
              ref={fileInputRef}
              id="resume"
              name="resume"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files)}
            />

            {files.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-sm border border-line-soft bg-ink-2 px-3 py-2 text-sm text-bone"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Paperclip
                        className="h-3.5 w-3.5 shrink-0 text-accent"
                        aria-hidden
                      />
                      <span className="truncate">{f.name}</span>
                      <span className="shrink-0 text-xs text-mute">
                        {formatBytes(f.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${f.name}`}
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-mute hover:bg-ink-3 hover:text-bone"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {fileError && (
              <p className="text-xs text-accent-text" role="alert">
                {fileError}
              </p>
            )}
          </div>
        </Field>
      </fieldset>

      {/* ---------- Additional Notes ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Additional Notes</legend>
        <Field label="Message / Additional Information" name="message">
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Anything else we should know? Tickets, licences, previous employers, preferred hours or role type."
            className={cn(inputBase, "resize-y")}
          />
        </Field>
      </fieldset>

      {state && !state.ok && (
        <p
          role="alert"
          className="border border-accent bg-accent/10 px-4 py-3 text-sm text-accent-text"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Submit Application"}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden />}
        </Button>
        <p className="text-xs leading-relaxed text-mute">
          By submitting, you agree to be contacted regarding current or future
          opportunities. Applications may be kept on file for future positions.
          We do not share your information with third parties.
        </p>
      </div>
    </form>
  );
}

function SelectField({
  id,
  name,
  required,
  placeholder,
  options,
}: {
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        className={cn(
          inputBase,
          "appearance-none pr-10",
          "[&>option]:bg-ink-2 [&>option]:text-bone",
        )}
      >
        <option value="" disabled className="text-mute">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
      />
    </div>
  );
}

function Field({
  label,
  name,
  required,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelBase}>
        {label}
        {required && <span className="ml-1 text-accent-text">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-mute">{hint}</p>}
    </div>
  );
}
