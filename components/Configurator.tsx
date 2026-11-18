"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Link2 } from "lucide-react";
import { Button } from "@/components/Button";
import { TruckDrawing, type ProductId } from "@/components/TruckDrawing";
import { OTHER, TRUCK_MAKES, modelsFor, variantsFor } from "@/data/truck-models";
import type { BuildConfig, BuildGroup, BuildOption } from "@/lib/build-options";
import { cn } from "@/lib/utils";

/** Handed to the quote form, which reads it once on arrival. */
const BUILD_HANDOFF_KEY = "arrow.configured-build";

const WORK = ["Civil", "Quarry", "Demolition", "Construction", "Bulk haulage", "Waste", "Fleet"];

const chip =
  "min-h-11 rounded-[0.625rem] border px-3 text-sm font-medium transition-colors lg:min-h-10";
const chipOn = "border-bone bg-bone text-ink";
const chipOff = "border-line bg-white/[0.04] text-bone hover:bg-white/[0.1]";

const productOf = (name: string): ProductId =>
  /dog/i.test(name) ? "dog" : /semi/i.test(name) ? "semi" : "tipper";

/** "8X4" to "8x4", and "3-Axle Long WB" to "3-axle", for the drawing. */
const setupOf = (name: string) => {
  const drive = name.match(/(\d+)\s*x\s*(\d+)/i);
  if (drive) return `${drive[1]}x${drive[2]}`;
  const axles = name.match(/(\d)\s*-?\s*axle/i);
  return axles ? `${axles[1]}-axle` : name;
};

function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field appearance-none pr-9"
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
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
        />
      </div>
    </div>
  );
}

export function Configurator({ config }: { config: BuildConfig }) {
  const router = useRouter();

  const optionIndex = useMemo(() => {
    const index = new Map<string, { group: BuildGroup; option: BuildOption }>();
    for (const group of config.groups)
      for (const option of group.options) index.set(option.id, { group, option });
    return index;
  }, [config]);

  const appliesTo = (g: BuildGroup, categoryId: string) =>
    g.appliesTo.length === 0 || g.appliesTo.includes(categoryId);

  /** A pick can select others: type to length, length to hoist, and so on. */
  function applyAuto(base: Set<string>, trigger: string) {
    const next = new Set(base);
    const stack = [trigger];
    const seen = new Set<string>();
    while (stack.length) {
      const current = stack.pop() as string;
      if (seen.has(current)) continue;
      seen.add(current);
      for (const { group, option } of optionIndex.values()) {
        if (!option.autoFor?.includes(current)) continue;
        if (!group.multi) group.options.forEach((o) => next.delete(o.id));
        next.add(option.id);
        stack.push(option.id);
      }
    }
    return next;
  }

  /** The standard build for a type, exactly as the dashboard starts a quote. */
  function startingPoint(categoryId: string, typeId: string, base = new Set<string>()) {
    const next = applyAuto(base, typeId);
    for (const g of config.groups) {
      if (g.role !== "inclusion" || !appliesTo(g, categoryId) || !g.options.length) continue;
      if (!g.options.some((o) => next.has(o.id))) next.add(g.options[0].id);
    }
    return next;
  }

  const defaultCategory = config.categories[0];
  const defaultType =
    defaultCategory.types.find((t) => /8\s*x\s*4/i.test(t.name)) ?? defaultCategory.types[0];

  const [categoryId, setCategoryId] = useState(defaultCategory.id);
  const [typeId, setTypeId] = useState(defaultType?.id ?? "");
  const [selected, setSelected] = useState(() =>
    startingPoint(defaultCategory.id, defaultType?.id ?? ""),
  );
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [otherTruck, setOtherTruck] = useState("");
  const [work, setWork] = useState(WORK[0]);
  const [reference, setReference] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(config.sections[0]?.id ?? null);
  const [copied, setCopied] = useState(false);

  const category = config.categories.find((c) => c.id === categoryId) ?? defaultCategory;
  const type = category.types.find((t) => t.id === typeId) ?? category.types[0];

  function chooseCategory(id: string) {
    const next = config.categories.find((c) => c.id === id);
    if (!next) return;
    const first =
      next.types.find((t) => /8\s*x\s*4|4-axle|3-axle$/i.test(t.name)) ?? next.types[0];
    setCategoryId(id);
    setTypeId(first?.id ?? "");
    setSelected(startingPoint(id, first?.id ?? ""));
    setTyped({});
  }

  // Product pages link here with their product, and shared links carry a build.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const wanted = q.get("product");
    const match = config.categories.find(
      (c) => c.id === q.get("category") || (wanted && productOf(c.name) === wanted),
    );
    if (!match) return;
    const sharedType = match.types.find((t) => t.id === q.get("type"));
    const first =
      sharedType ??
      match.types.find((t) => /8\s*x\s*4|4-axle|3-axle$/i.test(t.name)) ??
      match.types[0];
    setCategoryId(match.id);
    setTypeId(first?.id ?? "");
    const next = startingPoint(match.id, first?.id ?? "");
    (q.get("add") ?? "").split(",").forEach((id) => optionIndex.has(id) && next.add(id));
    (q.get("remove") ?? "").split(",").forEach((id) => next.delete(id));
    setSelected(next);
    if (TRUCK_MAKES.some((m) => m.name === q.get("make"))) {
      setMake(q.get("make") as string);
      setModel(q.get("model") ?? "");
    }
    // Runs once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseType(id: string) {
    setTypeId(id);
    setSelected((prev) => startingPoint(categoryId, id, prev));
  }

  const isVisible = (o: BuildOption) =>
    (!o.forTypes?.length || o.forTypes.includes(type?.id ?? "")) &&
    (!o.showWhenSelected?.length || o.showWhenSelected.some((id) => selected.has(id)));

  function pick(group: BuildGroup, option: BuildOption) {
    setSelected((prev) => {
      let next = new Set(prev);
      if (!prev.has(option.id)) option.excludes?.forEach((id) => next.delete(id));
      if (group.multi) {
        if (next.has(option.id)) next.delete(option.id);
        else next.add(option.id);
        return next;
      }
      // Extras can be switched off again. Core specifications always need a value.
      if (next.has(option.id) && group.role === "addon") {
        next.delete(option.id);
        return next;
      }
      group.options.forEach((o) => next.delete(o.id));
      next.add(option.id);
      next = applyAuto(next, option.id);
      return next;
    });
  }

  const visibleGroups = config.groups
    .filter((g) => !g.hidden && appliesTo(g, category.id))
    .map((g) => ({ group: g, options: g.options.filter(isVisible) }))
    .filter((g) => g.options.length > 0);

  const chosenIn = (options: BuildOption[]) =>
    options
      .filter((o) => selected.has(o.id))
      .map((o) => (o.custom && typed[o.id]?.trim() ? typed[o.id].trim() : o.name));

  const truckName = [
    make === OTHER ? otherTruck.trim() : make,
    make === OTHER ? "" : model === OTHER ? otherTruck.trim() : model,
    variant && variant !== OTHER ? variant : "",
  ]
    .filter(Boolean)
    .join(" ");

  const buildName = `${type?.name ?? ""} ${category.name}`.trim();

  const specLines = config.sections.flatMap((section) => {
    const rows = visibleGroups
      .filter(({ group }) => group.section === section.id)
      .flatMap(({ group, options }) => {
        const values = chosenIn(options);
        return values.length ? [`${group.name}: ${values.join(", ")}`] : [];
      });
    return rows.length ? [``, section.title, ...rows.map((r) => `- ${r}`)] : [];
  });

  const summary = [
    `Build: ${buildName}`,
    truckName ? `Truck: ${truckName}` : "",
    `Main work: ${work}`,
    reference.trim() ? `Your reference: ${reference.trim()}` : "",
    ...specLines,
  ]
    .filter((line, i, all) => line !== "" || (i > 0 && all[i - 1] !== ""))
    .join("\n");

  // What the drawing can show of the current selection.
  const names = visibleGroups.flatMap(({ group, options }) =>
    options.filter((o) => selected.has(o.id)).map((o) => `${group.name}|${o.name}`),
  );
  const has = (pattern: RegExp) => names.some((n) => pattern.test(n));
  const drawn = [
    has(/^tarp type\|/i) && "Tarp system",
    has(/\|tool ?box/i) && "Toolbox setup",
    has(/\|water tank/i) && "Water tank",
    has(/^tow coupling\|/i) && "Tow coupling",
    has(/clearance lights\|/i) && "LED lighting",
    has(/^cameras/i) && "Camera and safety systems",
    has(/two-way/i) && "2-way tailgate",
    has(/spray suppress/i) && "Spray suppression",
    has(/side steps\||ladder/i) && "Access steps",
  ].filter((x): x is string => Boolean(x));

  const colourOption = config.groups
    .find((g) => /^bin colou?r$/i.test(g.name.trim()))
    ?.options.find((o) => selected.has(o.id));
  const colour = colourOption?.swatch ?? "#eeeeea";

  function requestQuote() {
    const payload = {
      enquiry: category.name,
      buildType: type?.name ?? "",
      truck: { make, model, variant, other: otherTruck },
      work,
      reference: reference.trim(),
      summary,
      configuration: {
        category: { id: category.id, name: category.name },
        type: { id: type?.id, name: type?.name },
        options: visibleGroups.flatMap(({ group, options }) =>
          options
            .filter((o) => selected.has(o.id))
            .map((o) => ({ group: group.name, id: o.id, name: o.name, value: typed[o.id]?.trim() || undefined })),
        ),
      },
    };
    try {
      window.sessionStorage.setItem(BUILD_HANDOFF_KEY, JSON.stringify(payload));
    } catch {
      // Private browsing can refuse storage; the form still opens.
    }
    router.push("/request-a-quote?from=configure");
  }

  async function share() {
    const standard = startingPoint(category.id, type?.id ?? "");
    const q = new URLSearchParams({ category: category.id, type: type?.id ?? "" });
    const add = [...selected].filter((id) => !standard.has(id));
    const remove = [...standard].filter((id) => !selected.has(id));
    if (add.length) q.set("add", add.join(","));
    if (remove.length) q.set("remove", remove.join(","));
    if (make && make !== OTHER) q.set("make", make);
    if (model && model !== OTHER) q.set("model", model);
    const url = `${window.location.origin}/configure?${q.toString()}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${buildName} | Arrow Industries`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The visitor closed the share sheet, or the browser refused the copy.
    }
  }

  const models = make && make !== OTHER ? modelsFor(make) : [];
  const variants = model && model !== OTHER ? variantsFor(make, model) : [];
  const needsTyping = make === OTHER || model === OTHER;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,1fr)] lg:items-start">
      <div className="panel lg:sticky lg:top-20">
        <div className="px-3 pb-2 pt-6 sm:px-6 sm:pt-8">
          <TruckDrawing
            product={productOf(category.name)}
            setup={setupOf(type?.name ?? "")}
            colour={colour}
            options={drawn}
            className="h-auto w-full"
          />
        </div>
        <div className="border-t border-line-soft p-5 sm:p-6">
          <p className="eyebrow">Your build</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bone" aria-live="polite">
            {buildName}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-mute">
            {truckName ? `${truckName}. ` : ""}
            {work} work.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="lg" onClick={requestQuote}>
              Request a quote
            </Button>
            <Button size="lg" variant="secondary" onClick={share}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
              {copied ? "Link copied" : "Share this build"}
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-mute">
            The drawing is a guide only. We confirm the final specification, compliance and pricing
            with you before any steel is cut.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="card grid gap-5 p-5 sm:p-6">
          <fieldset className="min-w-0">
            <legend className="field-label mb-2">Product</legend>
            <div className="grid gap-1.5">
              {config.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={c.id === category.id}
                  onClick={() => chooseCategory(c.id)}
                  className={cn(chip, "text-left", c.id === category.id ? chipOn : chipOff)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="field-label mb-2">Build type</legend>
            <div className="flex flex-wrap gap-1.5">
              {category.types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.id === type?.id}
                  onClick={() => chooseType(t.id)}
                  className={cn(chip, t.id === type?.id ? chipOn : chipOff)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="grid min-w-0 gap-3">
            <legend className="field-label mb-2">
              {productOf(category.name) === "tipper" ? "Your truck" : "Towing truck"}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                id="cfg-make"
                label="Make"
                value={make}
                placeholder="Select a make"
                options={TRUCK_MAKES.map((m) => m.name)}
                onChange={(v) => {
                  setMake(v);
                  setModel("");
                  setVariant("");
                }}
              />
              {make && make !== OTHER && (
                <Select
                  id="cfg-model"
                  label="Model"
                  value={model}
                  placeholder="Select a model"
                  options={models}
                  onChange={(v) => {
                    setModel(v);
                    setVariant("");
                  }}
                />
              )}
              {variants.length > 0 && (
                <Select
                  id="cfg-variant"
                  label="Variant"
                  value={variant}
                  placeholder="Select a variant"
                  options={variants}
                  onChange={setVariant}
                />
              )}
              {needsTyping && (
                <div className="flex min-w-0 flex-col gap-1.5">
                  <label htmlFor="cfg-other" className="field-label">
                    {make === OTHER ? "Make and model" : "Model"}
                  </label>
                  <input
                    id="cfg-other"
                    value={otherTruck}
                    onChange={(e) => setOtherTruck(e.target.value)}
                    className="field"
                  />
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="field-label mb-2">Main work</legend>
            <div className="flex flex-wrap gap-1.5">
              {WORK.map((w) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={w === work}
                  onClick={() => setWork(w)}
                  className={cn(chip, w === work ? chipOn : chipOff)}
                >
                  {w}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor="cfg-reference" className="field-label">
              Your reference
            </label>
            <input
              id="cfg-reference"
              value={reference}
              maxLength={80}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Job number, rego or site"
              className="field"
            />
          </div>
        </div>

        <div className="list-group">
          {config.sections.map((section) => {
            const groups = visibleGroups.filter(({ group }) => group.section === section.id);
            if (groups.length === 0) return null;
            const open = openSection === section.id;
            const count = groups.reduce(
              (n, { options }) => n + options.filter((o) => selected.has(o.id)).length,
              0,
            );
            const panelId = `cfg-section-${section.id}`;
            return (
              <div key={section.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenSection(open ? null : section.id)}
                    className="flex min-h-13 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-[0.9375rem] font-medium tracking-normal text-bone">
                      {section.title}
                    </span>
                    <span className="flex items-center gap-2 text-xs text-mute">
                      {count > 0 && `${count} selected`}
                      <ChevronDown
                        aria-hidden
                        className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                      />
                    </span>
                  </button>
                </h3>
                {open && (
                  <div id={panelId} className="grid gap-4 px-4 pb-5">
                    {groups.map(({ group, options }) => (
                      <fieldset key={group.id} className="min-w-0">
                        <legend className="field-label mb-2">{group.name}</legend>
                        <div className="flex flex-wrap gap-1.5">
                          {options.map((o) => {
                            const on = selected.has(o.id);
                            return (
                              <button
                                key={o.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => pick(group, o)}
                                className={cn(chip, "inline-flex items-center gap-2 py-1.5 text-left", on ? chipOn : chipOff)}
                              >
                                {o.swatch && (
                                  <span
                                    aria-hidden
                                    className="h-4 w-4 shrink-0 rounded-full border border-black/20"
                                    style={{ backgroundColor: o.swatch }}
                                  />
                                )}
                                {group.multi && on && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                                {o.name}
                              </button>
                            );
                          })}
                        </div>
                        {options
                          .filter((o) => o.custom && selected.has(o.id))
                          .map((o) => (
                            <input
                              key={o.id}
                              aria-label={`${group.name}: your details`}
                              value={typed[o.id] ?? ""}
                              onChange={(e) => setTyped((t) => ({ ...t, [o.id]: e.target.value }))}
                              placeholder="Tell us what you need"
                              maxLength={120}
                              className="field mt-2"
                            />
                          ))}
                      </fieldset>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
