"use client";

/**
 * Roadworthy booking request form — submits to the shared Supabase bookings
 * table where the Arrow dashboard team confirms a time. Inspection types
 * (and prices, when enabled) come from the dashboard's price list.
 */

import { useActionState, useEffect, useRef, isValidElement, cloneElement } from "react";
import { CalendarCheck, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { submitRoadworthyBooking } from "@/lib/roadworthy-action";
import type { RwcOption } from "@/lib/roadworthy";
import { site } from "@/data/site";

const inputBase =
  "w-full rounded-sm border border-line bg-ink-2 px-4 py-3 text-sm text-bone placeholder:text-mute focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelBase = "text-sm font-semibold text-bone";

const TIME_SLOTS = ["Morning (6am – 10am)", "Midday (10am – 1pm)", "Afternoon (1pm – 4pm)", "Any time"];

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
  options,
  minDate,
  openDaysLabel,
}: {
  options: RwcOption[];
  /** Earliest selectable preferred date (yyyy-mm-dd). */
  minDate: string;
  /** e.g. "Monday to Friday" — shown as the date hint. */
  openDaysLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(submitRoadworthyBooking, null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state && !state.ok) {
      const target = state.field ? document.getElementById(state.field) : errorRef.current;
      target?.focus();
    }
  }, [state]);

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
        <Field label="Name" name="fullName" required>
          <input id="fullName" name="fullName" type="text" required autoComplete="name" className={inputBase} />
        </Field>
        <Field label="Business name" name="companyName">
          <input id="companyName" name="companyName" type="text" autoComplete="organization" className={inputBase} />
        </Field>
        <Field label="Email" name="email" hint="Email or phone required — confirmations go here.">
          <input id="email" name="email" type="email" autoComplete="email" className={inputBase} />
        </Field>
        <Field label="Phone" name="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. 0468 067 280" className={inputBase} />
        </Field>
        <Field label="Registration (rego)" name="rego" required>
          <input id="rego" name="rego" type="text" placeholder="e.g. ABC 123" className={inputBase + " uppercase"} />
        </Field>
        <Field label="Make / model" name="vehicle">
          <input id="vehicle" name="vehicle" type="text" placeholder="e.g. Kenworth T410" className={inputBase} />
        </Field>
      </div>

      <Field label="Inspection type" name="inspectionType" required>
        <div className="relative">
          <select id="inspectionType" name="inspectionType" required defaultValue="" className={inputBase + " appearance-none pr-10"}>
            <option value="" disabled>
              Select your vehicle…
            </option>
            {options.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
                {o.price != null ? ` — $${o.price}` : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" name="preferredDate" required hint={`Inspections run ${openDaysLabel}, by appointment.`}>
          <input id="preferredDate" name="preferredDate" type="date" required min={minDate} className={inputBase + " [color-scheme:dark]"} />
        </Field>
        <Field label="Preferred time" name="preferredTime">
          <div className="relative">
            <select id="preferredTime" name="preferredTime" defaultValue={TIME_SLOTS[3]} className={inputBase + " appearance-none pr-10"}>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          </div>
        </Field>
      </div>

      <Field label="Anything we should know?" name="message">
        <textarea id="message" name="message" rows={3} placeholder="e.g. failed items from a previous inspection, fleet booking, access notes…" className={inputBase + " resize-none"} />
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
