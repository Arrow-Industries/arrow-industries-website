"use client";

import {
  cloneElement,
  isValidElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Paperclip,
  X,
} from "lucide-react";
import { submitFinanceForm } from "@/lib/finance";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";

/* ---------- Option lists (must match lib/finance.ts whitelists exactly) ---------- */

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

export function FinanceForm() {
  const [state, formAction, isPending] = useActionState(
    submitFinanceForm,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  // On a failed submit, focus the offending field (fall back to the summary).
  useEffect(() => {
    if (state && !state.ok) {
      const target = state.field
        ? document.getElementById(state.field)
        : errorRef.current;
      target?.focus();
    }
  }, [state]);
  const [fileError, setFileError] = useState<string | null>(null);

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
          Thanks — your finance enquiry has been sent.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute sm:text-base">
          We&rsquo;ve received your details and passed them to our finance
          partner, Linx Australia Group. A finance specialist will be in touch
          to talk through your options — usually within one business day.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute">
          Need to talk sooner? Call us on{" "}
          <a href={site.phoneHref} className="text-accent-text hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tipper-truck-bodies" size="md">
            Explore builds
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

      {/* ---------- Your details ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Your details</legend>
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

          <Field label="Business name" name="businessName">
            <input
              id="businessName"
              name="businessName"
              type="text"
              autoComplete="organization"
              className={inputBase}
            />
          </Field>

          <Field label="Email" name="email" required>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputBase}
            />
          </Field>

          <Field label="Phone" name="phone" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="e.g. 0468 067 280"
              className={inputBase}
            />
          </Field>

          <Field label="Suburb / Town" name="location" required>
            <input
              id="location"
              name="location"
              type="text"
              required
              autoComplete="address-level2"
              placeholder="e.g. Campbellfield VIC"
              className={inputBase}
            />
          </Field>

          <Field label="ABN" name="abn" hint="If you have one.">
            <input
              id="abn"
              name="abn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 28 109 797 033"
              className={inputBase}
            />
          </Field>
        </div>

        <Select
          label="Preferred contact method"
          name="contactPreference"
          options={contactPreferenceOptions}
          placeholder="Either"
        />
      </fieldset>

      {/* ---------- What you'd like to finance ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>What you&rsquo;d like to finance</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Equipment"
            name="equipmentType"
            options={equipmentTypeOptions}
            required
          />
          <Select
            label="Finance type"
            name="financeType"
            options={financeTypeOptions}
            required
          />
          <Select
            label="Estimated amount"
            name="estimatedAmount"
            options={amountOptions}
            required
          />
          <Select
            label="Timeframe"
            name="timeframe"
            options={timeframeOptions}
            required
          />
        </div>

        <Field
          label="Deposit available"
          name="deposit"
          hint="Optional — a cash deposit or trade-in can improve your terms."
        >
          <input
            id="deposit"
            name="deposit"
            type="text"
            placeholder="e.g. $20,000 or none"
            className={inputBase}
          />
        </Field>
      </fieldset>

      {/* ---------- About your business ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>
          About your business{" "}
          <span className="font-normal lowercase tracking-normal text-mute">
            (optional — helps speed up approval)
          </span>
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Business structure"
            name="businessStructure"
            options={businessStructureOptions}
            placeholder="Select…"
          />
          <Select
            label="Years trading"
            name="yearsTrading"
            options={yearsTradingOptions}
            placeholder="Select…"
          />
          <Select
            label="Trading in equipment?"
            name="tradeIn"
            options={tradeInOptions}
            placeholder="No"
          />
          <Field label="Trade-in details" name="tradeInDetails">
            <input
              id="tradeInDetails"
              name="tradeInDetails"
              type="text"
              placeholder="Make, model, year"
              className={inputBase}
            />
          </Field>
        </div>
      </fieldset>

      {/* ---------- Attachments + notes ---------- */}
      <fieldset className="grid gap-5">
        <legend className={subHeadingBase}>Anything else</legend>

        <Field
          label="Attach quote or spec sheet"
          name="attachments"
          hint="Optional — PDF, Word or image files. Max 10MB per file."
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
              id="attachments"
              name="attachments"
              type="file"
              multiple
              accept="image/*,application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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

        <Field label="Message / notes" name="message">
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell us about the build, your situation or anything the finance team should know."
            className={cn(inputBase, "resize-y")}
          />
        </Field>
      </fieldset>

      {/* ---------- Consent ---------- */}
      <label
        htmlFor="consent"
        className="flex items-start gap-3 border border-line bg-ink-2 p-4 text-sm leading-relaxed text-mute"
      >
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="yes"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          I agree to be contacted about finance and to my details being shared
          with Arrow&rsquo;s finance partner, Linx Australia Group, to prepare a
          quote. Finance is subject to lender approval.
        </span>
      </label>

      {state && !state.ok && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="border border-accent bg-accent/10 px-4 py-3 text-sm text-accent-text focus:outline-none"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Submit Finance Enquiry"}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden />}
        </Button>
        <p className="text-xs text-mute">
          No obligation. General information only — not financial advice.
        </p>
      </div>
    </form>
  );
}

/* ---------- Field + Select helpers ---------- */

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
  const hintId = hint ? `${name}-hint` : undefined;
  const control =
    hintId && isValidElement(children)
      ? cloneElement(
          children as React.ReactElement<{ "aria-describedby"?: string }>,
          { "aria-describedby": hintId },
        )
      : children;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelBase}>
        {label}
        {required && <span className="ml-1 text-accent-text">*</span>}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="text-xs text-mute">
          {hint}
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <Field label={label} name={name} required={required}>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          defaultValue=""
          className={cn(
            inputBase,
            "appearance-none pr-10",
            "[&>option]:bg-ink-2 [&>option]:text-bone",
          )}
        >
          <option value="" disabled={required} className="text-mute">
            {placeholder ?? "Select an option…"}
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
    </Field>
  );
}
