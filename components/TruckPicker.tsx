"use client";

import { ChevronDown } from "lucide-react";
import { OTHER, TRUCK_MAKES, modelsFor, variantsFor } from "@/data/truck-models";

export interface TruckChoice {
  make: string;
  model: string;
  variant: string;
  other: string;
}

export const NO_TRUCK: TruckChoice = { make: "", model: "", variant: "", other: "" };

/** The make and model as the dashboard records them: "Actros 1835" in one field. */
export function truckValues(t: TruckChoice) {
  const typedMake = t.make === OTHER;
  return {
    make: typedMake ? t.other.trim() : t.make,
    model: typedMake
      ? ""
      : [t.model === OTHER ? t.other.trim() : t.model, t.variant === OTHER ? t.other.trim() : t.variant]
          .filter(Boolean)
          .join(" "),
  };
}

function Choice({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field appearance-none pr-10 [&>option]:bg-ink-2 [&>option]:text-bone"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={OTHER}>{OTHER}</option>
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
        />
      </div>
    </div>
  );
}

/** Truck make, model and variant, from the same list staff use on a quote. */
export function TruckPicker({
  value,
  onChange,
}: {
  value: TruckChoice;
  onChange: (next: TruckChoice) => void;
}) {
  const { make, model, variant, other } = value;
  const variants = model && model !== OTHER ? variantsFor(make, model) : [];
  const typing = make === OTHER || model === OTHER || variant === OTHER;
  const posted = truckValues(value);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="vehicleMake" value={posted.make} />
      <input type="hidden" name="vehicleModel" value={posted.model} />
      <Choice
        id="truckMake"
        label="Vehicle (make)"
        value={make}
        placeholder="Select a make…"
        options={TRUCK_MAKES.map((m) => m.name)}
        onChange={(next) => onChange({ make: next, model: "", variant: "", other: "" })}
      />
      {make && make !== OTHER && (
        <Choice
          id="truckModel"
          label="Model"
          value={model}
          placeholder="Select a model…"
          options={modelsFor(make)}
          onChange={(next) => onChange({ ...value, model: next, variant: "", other: "" })}
        />
      )}
      {variants.length > 0 && (
        <Choice
          id="truckVariant"
          label="Variant"
          value={variant}
          placeholder="Select a variant…"
          options={variants}
          onChange={(next) => onChange({ ...value, variant: next, other: "" })}
        />
      )}
      {typing && (
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="truckOther" className="field-label">
            {make === OTHER ? "Make and model" : variant === OTHER ? "Variant" : "Model"}
          </label>
          <input
            id="truckOther"
            type="text"
            value={other}
            maxLength={80}
            onChange={(e) => onChange({ ...value, other: e.target.value })}
            className="field"
          />
        </div>
      )}
    </div>
  );
}
