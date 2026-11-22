"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Link2, RotateCcw } from "lucide-react";
import { BuildDrawing } from "@/components/BuildDrawing";
import { OTHER, TRUCK_MAKES, modelsFor, variantsFor } from "@/data/truck-models";
import type { BuildConfig, BuildGroup, BuildOption } from "@/lib/build-options";
import { buildVisual, productOf, type Pick } from "@/lib/build-visual";
import { cn } from "@/lib/utils";

/** Handed to the quote form, which reads it once on arrival. */
const BUILD_HANDOFF_KEY = "arrow.configured-build";

const WORK = ["Civil", "Quarry", "Demolition", "Construction", "Bulk haulage", "Waste", "Fleet"];

const PRODUCT_NOTE: Record<string, string> = {
  tipper: "For any make or model of truck.",
  dog: "Arrow-built, matched to your tipper.",
  semi: "Arrow-built.",
};

/** Loose comparison, so "Two-Pak" and "Two-pack" count as the same wording. */
const plain = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** The quote's own wording for an option, when it says more than the name does. */
function detailOf(o: BuildOption) {
  const d = o.description?.trim();
  if (!d || d.length < 6) return null;
  const a = plain(d);
  const b = plain(o.name);
  return a === b || b.includes(a) ? null : d;
}

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
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field appearance-none pr-9">
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={OTHER}>{OTHER}</option>
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
      </div>
    </div>
  );
}

/** One numbered step of the build, folding open and shut. */
function Step({
  n,
  title,
  status,
  alert,
  open,
  onToggle,
  children,
}: {
  n: number;
  title: string;
  status?: string;
  alert?: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const id = `cfg-step-${n}`;
  return (
    <section className="cfg-step" data-open={open}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className="cfg-step-head">
          <small>{String(n).padStart(2, "0")}</small>
          <b>{title}</b>
          {status && <span className={cn("cfg-status", alert && "alert")}>{status}</span>}
          <i className="plus" aria-hidden />
        </button>
      </h3>
      <div id={id} className="cfg-fold" inert={!open}>
        <div>
          <div className="cfg-step-body">{children}</div>
        </div>
      </div>
    </section>
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
  const [selected, setSelected] = useState(() => startingPoint(defaultCategory.id, defaultType?.id ?? ""));
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [otherTruck, setOtherTruck] = useState("");
  const [work, setWork] = useState(WORK[0]);
  const [reference, setReference] = useState("");
  const [openStep, setOpenStep] = useState<string | null>("start");
  const [copied, setCopied] = useState(false);
  /** The last thing changed, so the drawing can point it out. */
  const [touched, setTouched] = useState<{ id: string; label: string; n: number } | null>(null);
  const touchCount = useRef(0);
  const touch = (id: string, label: string) => setTouched({ id, label, n: ++touchCount.current });

  const category = config.categories.find((c) => c.id === categoryId) ?? defaultCategory;
  const type = category.types.find((t) => t.id === typeId) ?? category.types[0];
  const product = productOf(category.name);

  const preferredType = (types: { id: string; name: string }[]) =>
    types.find((t) => /8\s*x\s*4|4-axle|3-axle$/i.test(t.name)) ?? types[0];

  function chooseCategory(id: string) {
    const next = config.categories.find((c) => c.id === id);
    if (!next) return;
    const first = preferredType(next.types);
    setCategoryId(id);
    setTypeId(first?.id ?? "");
    setSelected(startingPoint(id, first?.id ?? ""));
    setTyped({});
    setTouched(null);
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
    const first = sharedType ?? preferredType(match.types);
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
    const name = category.types.find((t) => t.id === id)?.name;
    setTouched({ id: "type", label: `${name ?? ""} chassis`.trim(), n: ++touchCount.current });
  }

  function resetToStandard() {
    setSelected(startingPoint(category.id, type?.id ?? ""));
    setTyped({});
    setTouched(null);
  }

  const visibleWith = (o: BuildOption, set: Set<string>) =>
    (!o.forTypes?.length || o.forTypes.includes(type?.id ?? "")) &&
    (!o.showWhenSelected?.length || o.showWhenSelected.some((id) => set.has(id)));

  /*
   * Where a specification has only one option on offer and nothing chosen, that
   * option is the answer: aluminium has one floor plate, so it is the floor.
   * Worked out from the selection each time rather than stored, so going back
   * to steel puts the steel choices back exactly as they were.
   */
  const chosen = useMemo(() => {
    const next = new Set(selected);
    for (let pass = 0; pass < 3; pass++) {
      let grew = false;
      for (const g of config.groups) {
        if (g.multi || (g.role !== "core" && g.role !== "base") || !appliesTo(g, category.id)) continue;
        const on = g.options.filter((o) => visibleWith(o, next));
        if (on.some((o) => next.has(o.id))) continue;
        // "Custom" is always there as a way out; it doesn't make it a choice.
        const fixed = on.filter((o) => !o.custom);
        if (fixed.length === 1) {
          next.add(fixed[0].id);
          grew = true;
        }
      }
      if (!grew) break;
    }
    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, category.id, type?.id, config]);

  const isVisible = (o: BuildOption) => visibleWith(o, chosen);

  function pick(group: BuildGroup, option: BuildOption) {
    const removing = selected.has(option.id) && (group.multi || group.role === "addon");
    touch(option.id, removing ? `Removed: ${option.name}` : `${group.name}: ${option.name}`);
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

  const inPlay = config.groups
    .filter((g) => appliesTo(g, category.id))
    .map((g) => ({ group: g, options: g.options.filter(isVisible) }))
    .filter((g) => g.options.length > 0);
  const visibleGroups = inPlay.filter(({ group }) => !group.hidden);

  const valueOf = (o: BuildOption) =>
    o.custom && typed[o.id]?.trim() ? typed[o.id].trim() : (o.description?.trim() || o.name);

  /** A specification that still needs an answer before the workshop can price it. */
  const isOpen = (g: BuildGroup, options: BuildOption[]) =>
    !g.multi && (g.role === "core" || g.role === "base") && !options.some((o) => chosen.has(o.id));

  // Trailers are Arrow's own product. Truck bodies suit any make or model.
  const isArrowTrailer = product !== "tipper";

  const truckName = isArrowTrailer
    ? ""
    : [
        make === OTHER ? otherTruck.trim() : make,
        make === OTHER ? "" : model === OTHER ? otherTruck.trim() : model,
        variant && variant !== OTHER ? variant : "",
      ]
        .filter(Boolean)
        .join(" ");

  const buildName = `${type?.name ?? ""} ${category.name}`.trim();

  // The build sheet: the same sections, labels and wording as the quote document.
  const sheet = config.sections
    .map((section) => ({
      section,
      rows: visibleGroups
        .filter(({ group }) => group.section === section.id)
        .flatMap(({ group, options }) => {
          const on = options.filter((o) => chosen.has(o.id));
          return on.length
            ? [{ group, values: on.map(valueOf), standard: group.role === "inclusion" }]
            : [];
        }),
    }))
    .filter((s) => s.rows.length > 0);

  const summary = [
    `Build: ${buildName}`,
    isArrowTrailer ? "Make: Arrow" : truckName ? `Truck: ${truckName}` : "",
    `Main work: ${work}`,
    reference.trim() ? `Your reference: ${reference.trim()}` : "",
    ...sheet.flatMap((s) => ["", s.section.title, ...s.rows.map((r) => `- ${r.group.name}: ${r.values.join(", ")}`)]),
  ]
    .filter((line, i, all) => line !== "" || (i > 0 && all[i - 1] !== ""))
    .join("\n");

  // ---------- The drawing ----------
  const picks: Pick[] = inPlay.flatMap(({ group, options }) =>
    options
      .filter((o) => chosen.has(o.id))
      .map((o) => ({
        id: o.id,
        group: group.name,
        name: o.name,
        section: group.section,
        swatch: o.swatch,
        value: typed[o.id]?.trim() || undefined,
      })),
  );
  const visual = buildVisual(product, type?.name ?? "", picks);

  const lengthGroup = inPlay.find(({ group }) => /length/i.test(group.name));
  const lengths = (lengthGroup?.options ?? [])
    .map((o) => Number(o.name.match(/\d{3,5}/)?.[0]))
    .filter((n) => Number.isFinite(n) && n > 0);
  const standardLength = product === "tipper" ? 5600 : product === "dog" ? 6300 : 8400;
  const fallbackLength = lengths.length ? Math.min(...lengths) : standardLength;
  const maxLength = lengths.length ? Math.max(...lengths) : standardLength;

  const spot =
    touched && (touched.id === "type" || visual.where[touched.id])
      ? { key: touched.id === "type" ? "type" : visual.where[touched.id], n: touched.n }
      : null;

  const mm = (n: number | null) => (n ? `${n.toLocaleString("en-AU")} mm` : "To choose");
  const readout: [string, string][] = [
    ["Length", mm(visual.length)],
    ["Height", mm(visual.height)],
    ["Width", visual.width ? mm(visual.width) : "—"],
    ["Sides", visual.wall ? `${visual.wall} mm` : "—"],
    ["Floor", visual.floor ? `${visual.floor} mm` : "—"],
    ["Body", visual.material === "aluminium" ? "Aluminium" : "Steel"],
  ];

  const openCount = visibleGroups.filter(({ group, options }) => isOpen(group, options)).length;

  function requestQuote() {
    const options = visibleGroups.flatMap(({ group, options: shown }) =>
      shown
        .filter((o) => chosen.has(o.id))
        .map((o) => ({ group: group.name, id: o.id, name: o.name, value: typed[o.id]?.trim() || undefined })),
    );
    const customVals = Object.fromEntries(
      Object.entries(typed).filter(([id, value]) => chosen.has(id) && value.trim()),
    );
    const payload = {
      enquiry: category.name,
      buildType: type?.name ?? "",
      truck: isArrowTrailer ? undefined : { make, model, variant, other: otherTruck },
      work,
      reference: reference.trim(),
      summary,
      configuration: {
        category: { id: category.id, name: category.name },
        type: { id: type?.id, name: type?.name },
        options,
        // The same shape the dashboard's quote builder saves, so a quote can
        // be started from this build with every option already chosen.
        selection: {
          categoryId: category.id,
          typeId: type?.id ?? "",
          selected: inPlay.flatMap(({ options: shown }) => shown.filter((o) => chosen.has(o.id)).map((o) => o.id)),
          customVals,
        },
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
    if (!isArrowTrailer && make && make !== OTHER) q.set("make", make);
    if (!isArrowTrailer && model && model !== OTHER) q.set("model", model);
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

  const toggle = (id: string) => setOpenStep((current) => (current === id ? null : id));
  const sectionSteps = config.sections
    .map((section) => ({ section, groups: visibleGroups.filter(({ group }) => group.section === section.id) }))
    .filter((s) => s.groups.length > 0);
  const stepIds = ["start", ...sectionSteps.map((s) => s.section.id), "review"];
  const nextAfter = (id: string) => stepIds[stepIds.indexOf(id) + 1] ?? null;

  const actions = (
    <div className="cfg-actions">
      <button type="button" className="btn btn-red" onClick={requestQuote}>
        Request a quote{" "}
        <span className="arrow" aria-hidden>
          →
        </span>
      </button>
      <button type="button" className="btn btn-line" onClick={share}>
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied ? "Link copied" : "Share this build"}
      </button>
    </div>
  );

  return (
    <div className="cfg">
      {/* The build, drawn as it stands */}
      <div className="cfg-side">
        <div className="cfg-stage">
          <div className="cfg-stage-top">
            <p className="mlabel">Your build</p>
            <button type="button" className="cfg-reset" onClick={resetToStandard}>
              <RotateCcw aria-hidden />
              Standard build
            </button>
          </div>
          <BuildDrawing
            visual={visual}
            fallbackLength={fallbackLength}
            maxLength={maxLength}
            truckName={truckName}
            spot={spot}
            className="cfg-drawing"
          />
          {/* Says what just changed, while the drawing points to it. */}
          <p className="cfg-toast" aria-live="polite">
            {touched && (
              <span key={touched.n} data-off={!spot}>
                {touched.label}
              </span>
            )}
          </p>
          <dl className="cfg-readout">
            {readout.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd key={value} className={cn(value === "To choose" && "todo")}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="cfg-title">
          <h2 aria-live="polite">{buildName}</h2>
          <p>
            {isArrowTrailer ? "Arrow-built. " : truckName ? `${truckName}. ` : ""}
            {work} work.
          </p>
          {actions}
          <p className="cfg-fine">
            The drawing is a guide only. We confirm the final specification, compliance and pricing with you
            before any steel is cut.
          </p>
        </div>
      </div>

      {/* The choices, in the order a quote is written */}
      <div className="cfg-steps">
        <Step
          n={1}
          title="Product & chassis"
          status={[type?.name, isArrowTrailer ? "Arrow" : truckName].filter(Boolean).join(" · ")}
          open={openStep === "start"}
          onToggle={() => toggle("start")}
        >
          <fieldset className="min-w-0">
            <legend className="field-label mb-2">Product</legend>
            <div className="cfg-products">
              {config.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={c.id === category.id}
                  onClick={() => chooseCategory(c.id)}
                  className="cfg-product"
                >
                  <b>{c.name}</b>
                  <span>{PRODUCT_NOTE[productOf(c.name)]}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="field-label mb-2">{isArrowTrailer ? "Axles" : "Chassis"}</legend>
            <div className="cfg-chips">
              {category.types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.id === type?.id}
                  onClick={() => chooseType(t.id)}
                  className="cfg-chip"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </fieldset>

          {isArrowTrailer ? (
            <div>
              <p className="field-label">Trailer make</p>
              <p className="display mt-1.5 text-[1.75rem]">Arrow</p>
            </div>
          ) : (
            <fieldset className="grid min-w-0 gap-3">
              <legend className="field-label mb-1">Your truck</legend>
              <p className="text-sm text-mute">
                We build for any make or model. Choose Other if yours isn&rsquo;t listed.
              </p>
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
          )}

          <fieldset className="min-w-0">
            <legend className="field-label mb-2">Main work</legend>
            <div className="cfg-chips">
              {WORK.map((w) => (
                <button key={w} type="button" aria-pressed={w === work} onClick={() => setWork(w)} className="cfg-chip">
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

          <button type="button" className="cfg-next" onClick={() => setOpenStep(nextAfter("start"))}>
            Next: {sectionSteps[0]?.section.title ?? "Review"} <span aria-hidden>→</span>
          </button>
        </Step>

        {sectionSteps.map(({ section, groups }, i) => {
          const count = groups.reduce((n, { options }) => n + options.filter((o) => chosen.has(o.id)).length, 0);
          const waiting = groups.filter(({ group, options }) => isOpen(group, options)).length;
          const next = nextAfter(section.id);
          const nextTitle = sectionSteps.find((s) => s.section.id === next)?.section.title ?? "Review your build";
          return (
            <Step
              key={section.id}
              n={i + 2}
              title={section.title}
              status={waiting ? `${waiting} to choose` : count ? `${count} chosen` : "None"}
              alert={waiting > 0}
              open={openStep === section.id}
              onToggle={() => toggle(section.id)}
            >
              {groups.map(({ group, options }) => {
                const picked = options.filter((o) => chosen.has(o.id));
                const details = picked.map(detailOf).filter(Boolean);
                return (
                  <fieldset key={group.id} className="cfg-group">
                    <legend>
                      {group.name}
                      {group.role === "inclusion" && <span className="cfg-tag">Standard</span>}
                      {group.multi && group.role !== "inclusion" && <span className="cfg-tag quiet">Choose any</span>}
                      {isOpen(group, options) && <span className="cfg-tag alert">Choose one</span>}
                    </legend>
                    <div className="cfg-chips">
                      {options.map((o) => {
                        const on = chosen.has(o.id);
                        return (
                          <button
                            key={o.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => pick(group, o)}
                            className="cfg-chip"
                          >
                            {o.swatch && <span aria-hidden className="cfg-swatch" style={{ backgroundColor: o.swatch }} />}
                            {group.multi && on && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                            {o.name}
                          </button>
                        );
                      })}
                    </div>
                    {details.length > 0 && <p className="cfg-detail">{details.join(" · ")}</p>}
                    {options
                      .filter((o) => o.custom && chosen.has(o.id))
                      .map((o) => (
                        <input
                          key={o.id}
                          aria-label={`${group.name}: your details`}
                          value={typed[o.id] ?? ""}
                          onChange={(e) => setTyped((t) => ({ ...t, [o.id]: e.target.value }))}
                          placeholder={/length|height|width/i.test(group.name) ? "In millimetres, e.g. 5200" : "Tell us what you need"}
                          maxLength={120}
                          className="field mt-2"
                        />
                      ))}
                  </fieldset>
                );
              })}
              <button type="button" className="cfg-next" onClick={() => setOpenStep(next)}>
                Next: {nextTitle} <span aria-hidden>→</span>
              </button>
            </Step>
          );
        })}

        <Step
          n={sectionSteps.length + 2}
          title="Review your build"
          status={openCount ? `${openCount} to choose` : "Ready to send"}
          alert={openCount > 0}
          open={openStep === "review"}
          onToggle={() => toggle("review")}
        >
          <div className="cfg-sheet">
            <div className="cfg-sheet-head">
              <p className="mlabel">Build sheet</p>
              <b>{buildName}</b>
              <span>
                {[isArrowTrailer ? "Arrow" : truckName, `${work} work`, reference.trim()].filter(Boolean).join(" · ")}
              </span>
            </div>
            {sheet.map(({ section, rows }) => (
              <div key={section.id} className="cfg-sheet-sec">
                <button type="button" onClick={() => setOpenStep(section.id)}>
                  {section.title}
                  <span>Change</span>
                </button>
                <dl>
                  {rows.map(({ group, values, standard }) => (
                    <div key={group.id}>
                      <dt>{group.name}</dt>
                      <dd>
                        {values.join(", ")}
                        {standard && <em>Standard</em>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            {openCount > 0 && (
              <p className="cfg-sheet-note">
                {openCount === 1 ? "One specification is" : `${openCount} specifications are`} still to choose. You
                can send the build as it is and we&rsquo;ll confirm the rest with you.
              </p>
            )}
          </div>
          {actions}
          <p className="cfg-fine">
            Sending opens the quote form with this build attached.
          </p>
        </Step>
      </div>
    </div>
  );
}
