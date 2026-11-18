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
import { submitQuoteForm } from "@/lib/email";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { formatBytes, prepareFiles, LIMIT_HINT } from "@/lib/upload-limits";
import { FALLBACK_PRODUCTS, SERVICE_ENQUIRIES } from "@/data/enquiry-types";
import { NO_TRUCK, TruckPicker, type TruckChoice } from "@/components/TruckPicker";
import type { BuildCategory } from "@/lib/build-options";
import { submitKeepingAnswers } from "@/lib/submit-form";

const inputBase = "field";

const labelBase = "field-label";

export function QuoteForm({ products }: { products: BuildCategory[] }) {
  const productNames = products.length
    ? products.map((p) => p.name)
    : [...FALLBACK_PRODUCTS];
  const enquiryTypes = [...productNames, ...SERVICE_ENQUIRIES];
  const [enquiry, setEnquiry] = useState("");
  const [buildType, setBuildType] = useState("");
  const [truck, setTruck] = useState<TruckChoice>(NO_TRUCK);
  const buildTypes = products.find((p) => p.name === enquiry)?.types ?? [];
  // Trailers are Arrow's own product. Truck bodies suit any make or model.
  const isArrowTrailer = productNames.includes(enquiry) && /trailer/i.test(enquiry);

  const [state, formAction, isPending] = useActionState(submitQuoteForm, null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fromConfigurator, setFromConfigurator] = useState(false);
  const [configuration, setConfiguration] = useState("");

  // Arriving from the configurator: carry the chosen build into the form.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("from") !== "configure") return;
    const form = formRef.current;
    if (!form) return;
    let build: {
      enquiry?: string;
      work?: string;
      reference?: string;
      buildType?: string;
      truck?: TruckChoice;
      summary?: string;
      configuration?: unknown;
    } | null = null;
    try {
      build = JSON.parse(window.sessionStorage.getItem("arrow.configured-build") ?? "null");
    } catch {
      build = null;
    }
    if (!build?.summary) return;
    const set = (name: string, value: string) => {
      const field = form.elements.namedItem(name);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      }
    };
    setEnquiry(build.enquiry ?? "");
    setBuildType(build.buildType ?? "");
    if (build.truck) setTruck(build.truck);
    set("payloadDetails", build.work ?? "");
    set("customerReference", build.reference ?? "");
    set("description", build.summary.slice(0, 6000));
    setConfiguration(JSON.stringify(build.configuration ?? null));
    setFromConfigurator(true);
  }, []);

  // On a failed submit, move focus to the offending field (so keyboard and
  // screen-reader users land on the problem); fall back to the error summary.
  useEffect(() => {
    if (state && !state.ok) {
      const target = state.field
        ? document.getElementById(state.field)
        : errorRef.current;
      target?.focus();
    }
  }, [state]);

  function syncFileInput(next: File[]) {
    // Replace the underlying <input> file list so FormData picks up the
    // current selection (including after individual removals).
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }

  async function handleFileChange(list: FileList | null) {
    if (!list || list.length === 0) return;
    // Shrinks photos and enforces the COMBINED budget, not just per-file —
    // two large images used to pass this check and then die at Vercel's
    // request limit with an unexplained failure.
    const { accepted, error } = await prepareFiles(files, Array.from(list));
    setFileError(error);
    if (accepted.length) {
      const next = [...files, ...accepted];
      setFiles(next);
      syncFileInput(next);
    }
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncFileInput(next);
    setFileError(null);
  }

  if (state?.ok) {
    return (
      <div className="card p-8 text-center sm:p-10">
        <CheckCircle2
          className="mx-auto h-9 w-9 text-accent"
          strokeWidth={1.5}
        />
        <h2 className="mt-5 font-display text-2xl font-semibold text-bone">
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
          <a href={site.phoneHref} className="text-accent-text hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/builds" size="md">
            View builds
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
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => submitKeepingAnswers(e, formAction)}
      className="grid gap-3"
      noValidate
    >
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

      {fromConfigurator && (
        <p className="rounded-sm border border-line bg-white/[0.05] px-4 py-3 text-sm text-bone">
          Your configured build has been added to this form. Add your details and send it through.
        </p>
      )}

      {configuration && <input type="hidden" name="buildConfiguration" value={configuration} />}

      <fieldset className="form-section">
        <legend>Your build or job</legend>
      <Field label="Enquiry type" name="enquiryType" required>
        <div className="relative">
          <select
            id="enquiryType"
            name="enquiryType"
            required
            value={enquiry}
            onChange={(e) => {
              setEnquiry(e.target.value);
              setBuildType("");
            }}
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
            {enquiry && !enquiryTypes.includes(enquiry) && <option value={enquiry}>{enquiry}</option>}
            <optgroup label="New builds">
              {productNames.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </optgroup>
            <optgroup label="Services and other">
              {SERVICE_ENQUIRIES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </optgroup>
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
          />
        </div>
      </Field>

      {buildTypes.length > 0 && (
        <Field label="Build type" name="buildType">
          <div className="relative">
            <select
              id="buildType"
              name="buildType"
              value={buildType}
              onChange={(e) => setBuildType(e.target.value)}
              className={cn(inputBase, "appearance-none pr-10", "[&>option]:bg-ink-2 [&>option]:text-bone")}
            >
              <option value="">Select a build type…</option>
              {buildTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
            />
          </div>
        </Field>
      )}

      {isArrowTrailer ? (
        <div className="flex flex-col gap-2">
          <input type="hidden" name="vehicleMake" value="Arrow" />
          <input type="hidden" name="vehicleModel" value="" />
          <p className="field-label">Trailer make</p>
          <p className="display text-[1.75rem]">Arrow</p>
        </div>
      ) : (
        <TruckPicker value={truck} onChange={setTruck} />
      )}

      {!isArrowTrailer && (
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
      )}

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
        label="Your reference"
        name="customerReference"
        hint="A job number, rego or site, if you have one."
      >
        <input
          id="customerReference"
          name="customerReference"
          type="text"
          maxLength={80}
          autoComplete="off"
          className={inputBase}
        />
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
          rows={fromConfigurator ? 14 : 6}
          placeholder="Tell us what you need — drawings, photos, repair issue, preferred build type, access requirements or any other details."
          className={cn(inputBase, "resize-y")}
        />
      </Field>

      </fieldset>

      <fieldset className="form-section">
        <legend>Your details</legend>
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
            placeholder="e.g. 0412 345 678"
            className={inputBase}
          />
        </Field>
      </div>

      <Field
        label="Location / suburb"
        name="location"
        hint="Helps us plan delivery, transport & site access."
      >
        <input
          id="location"
          name="location"
          autoComplete="address-level2"
          placeholder="e.g. Campbellfield VIC, or your job site"
          className={inputBase}
        />
      </Field>

      </fieldset>

      <fieldset className="form-section">
        <legend>Drawings or photos</legend>
      <Field
        label="Attach drawings or photos"
        name="attachments"
        hint={`Upload drawings, site photos, damage images or spec sheets to help us assess your enquiry. ${LIMIT_HINT}`}
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
            <p className="text-xs text-accent-text" role="alert">
              {fileError}
            </p>
          )}
        </div>
      </Field>

      </fieldset>

      {state && !state.ok && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-sm border border-accent/50 bg-accent/10 px-4 py-3 text-sm text-accent-text focus:outline-none"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sending…" : "Submit enquiry"}
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
