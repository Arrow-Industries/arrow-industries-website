"use client";

/**
 * Roadworthy booking request form — submits to the shared Supabase bookings
 * table where the Arrow dashboard team confirms a time. Inspection types
 * (and prices, when enabled) come from the dashboard's price list.
 */

import { useActionState, useEffect, useRef, useState, isValidElement, cloneElement } from "react";
import { CalendarCheck, CheckCircle2, ChevronDown, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/Button";
import { submitRoadworthyBooking } from "@/lib/roadworthy-action";
import { getRwcSlots, type RwcSlotResult } from "@/lib/roadworthy-slots";
import type { RwcVehicleType } from "@/lib/roadworthy";
import { site } from "@/data/site";

const inputBase =
  "w-full rounded-sm border border-line bg-ink-2 px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelBase = "text-sm font-semibold text-bone";

// Vercel rejects request bodies over ~4.5MB, so every photo is compressed in
// the browser and the combined payload stays safely under that.
const SHRINK_ABOVE = 500 * 1024; // compress anything bigger than 500KB
const MAX_FILE_BYTES = 3 * 1024 * 1024; // per photo, post-compression
const MAX_TOTAL_BYTES = 3_500_000; // combined payload budget

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Downscale a photo in the browser (max 1600px, JPEG 80%) so phone camera
 *  shots upload reliably. Falls back to the original file if anything goes
 *  wrong (e.g. a format the browser can't decode). */
async function shrinkPhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function Field({
  label, name, required, hint, children,
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
      ? cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": hintId })
      : children;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className={labelBase}>
        {label}
        {required && <span className="ml-1 text-accent-text">*</span>}
      </label>
      {control}
      {hint && <p id={hintId} className="text-xs text-mute">{hint}</p>}
    </div>
  );
}

export function RoadworthyBookingForm({
  truckTypes,
  trailerTypes,
  axlePrices,
  durationMins,
  minDate,
  openDaysLabel,
}: {
  truckTypes: RwcVehicleType[];
  trailerTypes: RwcVehicleType[];
  /** Price per axle count — null hides prices from customers. */
  axlePrices: Record<string, number> | null;
  durationMins: number;
  /** Earliest selectable preferred date (yyyy-mm-dd). */
  minDate: string;
  /** e.g. "Monday to Friday" — shown as the date hint. */
  openDaysLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(submitRoadworthyBooking, null);
  const [vehicleType, setVehicleType] = useState("");
  const [axles, setAxles] = useState("");
  const [prefDate, setPrefDate] = useState("");
  const [slots, setSlots] = useState<RwcSlotResult | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [shrinking, setShrinking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const selectedType = [...truckTypes, ...trailerTypes].find((t) => t.label === vehicleType);

  function syncFileInput(next: File[]) {
    // Replace the underlying <input> file list so FormData picks up the
    // current selection (including after individual removals).
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }

  async function addFiles(list: FileList | File[] | null) {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list).filter(
      (f) => f.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?)$/i.test(f.name),
    );
    if (incoming.length === 0) {
      setFileError("Please add photos only (JPG, PNG, HEIC…).");
      return;
    }
    setFileError(null);
    setShrinking(true);
    const accepted: File[] = [];
    const rejected: string[] = [];
    let total = files.reduce((n, f) => n + f.size, 0);
    for (const f of incoming) {
      // Compress everything beyond thumbnail size so uploads stay small
      // enough for mobile connections and the server's request cap.
      const ready = f.size > SHRINK_ABOVE ? await shrinkPhoto(f) : f;
      if (ready.size > MAX_FILE_BYTES || total + ready.size > MAX_TOTAL_BYTES) {
        rejected.push(f.name);
        continue;
      }
      total += ready.size;
      accepted.push(ready);
    }
    setShrinking(false);
    if (rejected.length) {
      setFileError(
        `${rejected.join(", ")} couldn't be added — photos are capped at about 3.5MB combined so they upload reliably. Try fewer photos.`,
      );
    }
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

  useEffect(() => {
    if (state && !state.ok) {
      const target = state.field ? document.getElementById(state.field) : errorRef.current;
      target?.focus();
    }
    // Success replaces the form — bring the confirmation into view so mobile
    // users aren't left staring at where the bottom of the form used to be.
    if (state?.ok) {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  // Refresh the free time slots whenever the preferred date changes.
  useEffect(() => {
    if (!prefDate) {
      setSlots(null);
      return;
    }
    let live = true;
    setSlotsLoading(true);
    getRwcSlots(prefDate)
      .then((s) => {
        if (live) setSlots(s);
      })
      .catch(() => {
        if (live) setSlots({ closed: false, slots: [] });
      })
      .finally(() => {
        if (live) setSlotsLoading(false);
      });
    return () => {
      live = false;
    };
  }, [prefDate]);

  if (state?.ok) {
    return (
      <div className="border border-line-soft bg-ink-2 p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto h-9 w-9 text-accent" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-2xl font-extrabold text-bone">
          Booking request received.
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute sm:text-base">
          Your time isn&rsquo;t locked in just yet — our team will check the
          schedule and confirm your inspection by email or phone, usually
          within the same business day.
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mute">
          Once confirmed, please drop the vehicle off 15 minutes before your
          booking time.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-mute">
          Need it sooner? Call us on{" "}
          <a href={site.phoneHref} className="text-accent-text hover:underline">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {/* Honeypot — must remain empty. Hidden from real users + assistive tech. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="rwc-website">Website (leave blank)</label>
        <input id="rwc-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" required>
          <input id="firstName" name="firstName" type="text" required autoComplete="given-name" className={inputBase} />
        </Field>
        <Field label="Last name" name="lastName" required>
          <input id="lastName" name="lastName" type="text" required autoComplete="family-name" className={inputBase} />
        </Field>
        <Field label="Company name" name="companyName" hint="Optional — for company vehicles.">
          <input id="companyName" name="companyName" type="text" autoComplete="organization" className={inputBase} />
        </Field>
        <Field label="ABN" name="abn" hint="Required when booking as a company — goes on the invoice.">
          <input id="abn" name="abn" type="text" inputMode="numeric" placeholder="11 digits" className={inputBase} />
        </Field>
        <Field label="Email" name="email" required hint="Your confirmation goes here.">
          <input id="email" name="email" type="email" required autoComplete="email" className={inputBase} />
        </Field>
        <Field label="Phone" name="phone" required>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="e.g. 0468 067 280" className={inputBase} />
        </Field>
        <Field label="Driver licence number" name="licenceNumber" required hint="Needed for the inspection paperwork.">
          <input id="licenceNumber" name="licenceNumber" type="text" className={inputBase} />
        </Field>
      </div>

      <Field
        label="Vehicle type"
        name="vehicleType"
        required
        hint={
          vehicleType.startsWith("__other")
            ? "Type the vehicle type below."
            : selectedType?.desc || "Pick the closest match — it helps us allow the right time."
        }
      >
        <div className="relative">
          <select
            id="vehicleType"
            name="vehicleType"
            required
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className={inputBase + " appearance-none pr-10"}
          >
            <option value="" disabled>
              Select vehicle type…
            </option>
            <optgroup label="Trucks & heavy vehicles">
              {truckTypes.map((t) => (
                <option key={t.label} value={t.label}>{t.label}</option>
              ))}
              <option value="__other_truck">Other truck / heavy vehicle…</option>
            </optgroup>
            <optgroup label="Trailers">
              {trailerTypes.map((t) => (
                <option key={t.label} value={t.label}>{t.label}</option>
              ))}
              <option value="__other_trailer">Other trailer…</option>
            </optgroup>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
        </div>
      </Field>

      {vehicleType.startsWith("__other") && (
        <Field label="Tell us the vehicle type" name="vehicleTypeOther" required>
          <input
            id="vehicleTypeOther"
            name="vehicleTypeOther"
            type="text"
            required
            autoFocus
            placeholder={vehicleType === "__other_trailer" ? "e.g. Extendable trailer" : "e.g. Tilt tray"}
            className={inputBase}
          />
        </Field>
      )}

      <Field
        label="Number of axles"
        name="axles"
        required
        hint={
          axlePrices && axles
            ? `Inspection price: $${axlePrices[axles] ?? "—"} inc. GST · allow ${durationMins} minutes.`
            : `Sets your inspection price — allow ${durationMins} minutes.`
        }
      >
        <div className="relative sm:max-w-[calc(50%-0.625rem)]">
          <select
            id="axles"
            name="axles"
            required
            value={axles}
            onChange={(e) => setAxles(e.target.value)}
            className={inputBase + " appearance-none pr-10"}
          >
            <option value="" disabled>
              Select…
            </option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
                {axlePrices?.[String(n)] != null ? ` — $${axlePrices[String(n)]}` : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Vehicle make" name="vehicleMake" required>
          <input id="vehicleMake" name="vehicleMake" type="text" placeholder="e.g. Kenworth" className={inputBase} />
        </Field>
        <Field label="Vehicle model" name="vehicleModel" required>
          <input id="vehicleModel" name="vehicleModel" type="text" placeholder="e.g. T410" className={inputBase} />
        </Field>
        <Field label="Build year" name="vehicleYear" required>
          <input id="vehicleYear" name="vehicleYear" type="number" inputMode="numeric" placeholder="e.g. 2019" className={inputBase} />
        </Field>
        <Field label="VIN" name="vin" required hint="On the compliance / build plate.">
          <input id="vin" name="vin" type="text" placeholder="17 characters" className={inputBase + " uppercase"} />
        </Field>
        <Field label="Registration (rego)" name="rego" hint="Optional — leave blank if unregistered.">
          <input id="rego" name="rego" type="text" placeholder="e.g. ABC 123" className={inputBase + " uppercase"} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" name="preferredDate" required hint={`Inspections run ${openDaysLabel}, by appointment.`}>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            required
            min={minDate}
            value={prefDate}
            onChange={(e) => setPrefDate(e.target.value)}
            className={inputBase + " [color-scheme:dark]"}
          />
        </Field>
        <Field
          label="Preferred time"
          name="preferredTime"
          hint={
            !prefDate
              ? "Pick a date to see the available times."
              : slotsLoading
                ? "Checking the schedule…"
                : slots?.closed
                  ? `We're closed that day${slots.closedReason ? ` (${slots.closedReason})` : ""} — please pick another date.`
                  : slots && slots.slots.length === 0
                    ? "That day is fully booked — please pick another date, or choose Any time and we'll try to fit you in."
                    : "Live availability from our workshop schedule."
          }
        >
          <div className="relative">
            <select id="preferredTime" name="preferredTime" defaultValue="any" disabled={!prefDate || slotsLoading || slots?.closed} className={inputBase + " appearance-none pr-10 disabled:opacity-60"}>
              <option value="any">Any time</option>
              {(slots?.slots ?? []).map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          </div>
        </Field>
      </div>

      <Field label="Anything we should know?" name="message">
        <textarea id="message" name="message" rows={3} placeholder="e.g. failed items from a previous inspection, fleet booking, access notes…" className={inputBase + " resize-none"} />
      </Field>

      <Field
        label="Photos of the vehicle"
        name="photos"
        hint="Optional — a few photos of the vehicle (and anything you're unsure about) help us prepare. Big photos are shrunk automatically."
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void addFiles(e.dataTransfer.files);
            }}
            className={`flex w-full flex-col items-center gap-2 rounded-sm border border-dashed px-4 py-6 text-sm transition-colors ${
              dragging
                ? "border-accent bg-accent/10 text-bone"
                : "border-line bg-ink-2 text-bone hover:border-bone"
            }`}
          >
            <ImagePlus className="h-5 w-5 text-accent" aria-hidden />
            <span className="font-medium">
              {shrinking
                ? "Preparing photos…"
                : files.length > 0
                  ? `${files.length} photo${files.length === 1 ? "" : "s"} added — add more`
                  : "Add photos"}
            </span>
            <span className="text-xs text-mute">Click to choose, or drag &amp; drop — multiple photos welcome.</span>
          </button>
          <input
            ref={fileInputRef}
            id="photos"
            name="photos"
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />

          {files.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-sm border border-line-soft bg-ink-2 px-3 py-2 text-sm text-bone"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ImagePlus className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                    <span className="truncate">{f.name}</span>
                    <span className="shrink-0 text-xs text-mute">{formatBytes(f.size)}</span>
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

      {state && !state.ok && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={isPending}>
          <CalendarCheck className="h-4 w-4" aria-hidden />
          {isPending ? "Sending…" : "Request booking"}
        </Button>
        <p className="text-xs leading-relaxed text-mute">
          We&rsquo;ll confirm your time by email or phone — nothing is locked
          in until you hear from us.
        </p>
      </div>
    </form>
  );
}
