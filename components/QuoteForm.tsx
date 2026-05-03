"use client";

import { useActionState, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Paperclip,
  X,
} from "lucide-react";
import { submitQuoteForm } from "@/lib/email";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";

const enquiryTypes = [
  "Tipper Truck Body",
  "Dog Trailer",
  "Semi Trailer",
  "Repairs & Servicing",
  "Roadworthy / LVT",
  "Parts & Components",
  "General Enquiry",
] as const;

const inputBase =
  "w-full rounded-sm border border-line bg-ink-2 px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const labelBase =
  "block text-xs font-semibold uppercase tracking-[0.16em] text-mute";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function QuoteForm() {
  const [state, formAction, isPending] = useActionState(submitQuoteForm, null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  function syncFileInput(next: File[]) {
    // Replace the underlying <input> file list so FormData picks up the
    // current selection (including after individual removals).
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
          Thanks — your enquiry has been sent.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute sm:text-base">
          We&rsquo;ve received your details and will review your enquiry
          shortly. You&rsquo;ll hear back from the Arrow team with the next
          step for your build, repair or inspection.
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mute">
          Most enquiries are reviewed within the same business day.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute">
          For urgent enquiries, call us on{" "}
          <a href={site.phoneHref} className="text-accent hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/gallery" size="md">
            View recent builds
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
    <form ref={formRef} action={formAction} className="grid gap-5" noValidate>
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

        <Field label="Business name" name="companyName">
          <input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            className={inputBase}
          />
        </Field>

        <Field label="Email" name="email" hint="Email or phone required.">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputBase}
          />
        </Field>

        <Field label="Phone" name="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 0468 067 280"
            className={inputBase}
          />
        </Field>
      </div>

      <Field label="Enquiry type" name="enquiryType" required>
        <div className="relative">
          <select
            id="enquiryType"
            name="enquiryType"
            required
            defaultValue=""
            className={cn(
              inputBase,
              "appearance-none pr-10",
              // Force option background dark on browsers that respect it
              "[&>option]:bg-ink-2 [&>option]:text-bone",
            )}
          >
            <option value="" disabled className="text-mute">
              Select an option…
            </option>
            {enquiryTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
          />
        </div>
      </Field>

      <Field
        label="Vehicle / chassis details"
        name="vehicleDetails"
        hint="Include make, model, configuration or chassis details if known."
      >
        <input
          id="vehicleDetails"
          name="vehicleDetails"
          type="text"
          placeholder="e.g. Kenworth T410, Isuzu FVZ 8x4"
          className={inputBase}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Vehicle year" name="vehicleYear">
          <input
            id="vehicleYear"
            name="vehicleYear"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            autoComplete="off"
            placeholder="e.g. 2018"
            className={inputBase}
          />
        </Field>

        <Field label="VIN number" name="vinNumber">
          <input
            id="vinNumber"
            name="vinNumber"
            type="text"
            autoComplete="off"
            placeholder="e.g. 6F5000000XXXXXXXX"
            className={inputBase}
          />
        </Field>
      </div>

      <Field
        label="Payload / application"
        name="payloadDetails"
        hint="Helpful for builds, trailers and fleet work. Leave blank if not relevant."
      >
        <input
          id="payloadDetails"
          name="payloadDetails"
          type="text"
          placeholder="e.g. quarry haul, civil site cycles, bulk grain, fleet servicing, repair issue"
          className={inputBase}
        />
      </Field>

      <Field
        label="Attach drawings or photos"
        name="attachments"
        hint="Upload drawings, site photos, damage images or spec sheets to help us assess your enquiry. Max 10MB per file."
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
            accept="image/*,application/pdf,.pdf"
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
            <p className="text-xs text-accent" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </Field>

      <Field label="Preferred timeframe" name="timeframe">
        <input
          id="timeframe"
          name="timeframe"
          type="text"
          placeholder="e.g. 8–10 weeks, ASAP, Q3"
          className={inputBase}
        />
      </Field>

      <Field label="Message / extra notes" name="description">
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="Tell us what you need — drawings, photos, repair issue, preferred build type, access requirements or any other details."
          className={cn(inputBase, "resize-y")}
        />
      </Field>

      {state && !state.ok && (
        <p
          role="alert"
          className="border border-accent bg-accent/10 px-4 py-3 text-sm text-accent"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Submit Enquiry"}
          {!isPending && <ArrowRight className="h-4 w-4" aria-hidden />}
        </Button>
        <p className="text-xs text-mute">
          By submitting, you agree to be contacted about your enquiry. We
          don&rsquo;t share your details.
        </p>
      </div>
    </form>
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
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-mute">{hint}</p>}
    </div>
  );
}
