"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { Button } from "@/components/Button";
import { TruckDrawing } from "@/components/TruckDrawing";
import {
  configColours,
  configProducts,
  configWork,
  type ProductId,
} from "@/data/configurator";
import { cn } from "@/lib/utils";

const chip =
  "min-h-11 rounded-[0.625rem] border px-3.5 text-sm font-medium transition-colors lg:min-h-10";
const chipOn = "border-bone bg-bone text-ink";
const chipOff = "border-line bg-white/[0.04] text-bone hover:bg-white/[0.1]";

function Group({ title, value, children }: { title: string; value?: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 flex w-full items-baseline justify-between gap-3 text-[0.8125rem] font-medium text-mute">
        {title}
        {value && <span className="font-normal text-bone/85">{value}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

export function Configurator() {
  const [productId, setProductId] = useState<ProductId>("tipper");
  const product = configProducts.find((p) => p.id === productId) ?? configProducts[0];
  const [setup, setSetup] = useState(product.defaultSetup);
  const [style, setStyle] = useState("Tipping");
  const [work, setWork] = useState(configWork[0]);
  const [colour, setColour] = useState(configColours[0]);
  const [options, setOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // A shared link, or a product page's button, opens with that build selected.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const next = configProducts.find((p) => p.id === q.get("product"));
    if (!next) return;
    setProductId(next.id);
    setSetup(next.setups.includes(q.get("setup") ?? "") ? (q.get("setup") as string) : next.defaultSetup);
    if (next.styles?.includes(q.get("style") ?? "")) setStyle(q.get("style") as string);
    if (configWork.includes(q.get("work") ?? "")) setWork(q.get("work") as string);
    const c = configColours.find((x) => x.name === q.get("colour"));
    if (c) setColour(c);
    setOptions((q.get("options") ?? "").split("|").filter((o) => next.options.includes(o)));
  }, []);

  function chooseProduct(id: ProductId) {
    const next = configProducts.find((p) => p.id === id);
    if (!next) return;
    setProductId(id);
    setSetup(next.defaultSetup);
    setOptions((current) => current.filter((o) => next.options.includes(o)));
  }

  const usesStyle = Boolean(product.styles);
  const available = product.options.filter(
    (o) => !(usesStyle && style === "Flat-deck" && (o === "2-way tailgate" || o === "Tarp system")),
  );
  const chosen = options.filter((o) => available.includes(o));

  const summary = useMemo(() => {
    const name = `${setup} ${usesStyle ? `${style.toLowerCase()} ` : ""}${product.label.toLowerCase()}`;
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      lines: [
        `Build: ${name}`,
        `Main work: ${work}`,
        `Body colour: ${colour.name}`,
        `Options: ${chosen.length ? chosen.join(", ") : "None selected"}`,
      ],
    };
  }, [setup, usesStyle, style, product.label, work, colour.name, chosen]);

  const quoteHref = `/request-a-quote?${new URLSearchParams({
    enquiry: product.enquiry,
    work,
    build: summary.lines.join("\n"),
  }).toString()}`;

  async function share() {
    const q = new URLSearchParams({ product: productId, setup, work, colour: colour.name });
    if (usesStyle) q.set("style", style);
    if (chosen.length) q.set("options", chosen.join("|"));
    const url = `${window.location.origin}/configure?${q.toString()}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${summary.name} | Arrow Industries`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The visitor closed the share sheet, or the browser refused the copy.
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(21rem,1fr)] lg:items-start">
      <div className="panel lg:sticky lg:top-20">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgb(255_255_255/0.035)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.035)_1px,transparent_1px)] [background-size:32px_32px]"
        />
        <div className="px-3 pb-2 pt-6 sm:px-6 sm:pt-10">
          <TruckDrawing
            product={productId}
            setup={setup}
            style={usesStyle ? style : undefined}
            colour={colour.value}
            options={chosen}
            className="h-auto w-full"
          />
        </div>
        <div className="border-t border-line-soft p-5 sm:p-6">
          <p className="eyebrow">Your build</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-bone" aria-live="polite">
            {summary.name}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-mute">
            {work} work, {colour.name.toLowerCase()} body
            {chosen.length ? `. Options: ${chosen.join(", ")}` : ""}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href={quoteHref} size="lg">
              Request a quote
            </Button>
            <Button size="lg" variant="secondary" onClick={share}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
              {copied ? "Link copied" : "Share this build"}
            </Button>
          </div>
        </div>
      </div>

      <div className="card grid gap-5 p-5 sm:p-6">
        <Group title="Product">
          <div className="grid grid-cols-3 gap-1.5">
            {configProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={p.id === productId}
                onClick={() => chooseProduct(p.id)}
                className={cn(chip, "whitespace-nowrap px-1 text-[0.8125rem]", p.id === productId ? chipOn : chipOff)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Group>

        <Group title={product.setupLabel}>
          <div className="flex flex-wrap gap-1.5">
            {product.setups.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === setup}
                onClick={() => setSetup(s)}
                className={cn(chip, s === setup ? chipOn : chipOff)}
              >
                {s}
              </button>
            ))}
          </div>
        </Group>

        {product.styles && (
          <Group title="Body style">
            <div className="flex flex-wrap gap-1.5">
              {product.styles.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={s === style}
                  onClick={() => setStyle(s)}
                  className={cn(chip, s === style ? chipOn : chipOff)}
                >
                  {s}
                </button>
              ))}
            </div>
          </Group>
        )}

        <Group title="Main work">
          <div className="flex flex-wrap gap-1.5">
            {configWork.map((w) => (
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
        </Group>

        <Group title="Body colour" value={colour.name}>
          <div className="flex flex-wrap gap-2.5">
            {configColours.map((c) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                aria-pressed={c.name === colour.name}
                onClick={() => setColour(c)}
                style={{ backgroundColor: c.value }}
                className={cn(
                  "h-11 w-11 rounded-full border-2 border-white/25 transition-transform active:scale-95",
                  c.name === colour.name && "outline outline-2 outline-offset-2 outline-bone",
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-mute">Painted in 2-pack to your colour. Tell us your exact shade in the quote.</p>
        </Group>

        <Group title="Options">
          <ul className="list-group">
            {available.map((o) => {
              const on = chosen.includes(o);
              return (
                <li key={o}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() =>
                      setOptions((c) => (c.includes(o) ? c.filter((x) => x !== o) : [...c, o]))
                    }
                    className="flex min-h-12 w-full items-center justify-between gap-3 px-3.5 text-left text-sm text-bone"
                  >
                    {o}
                    <span
                      aria-hidden
                      className={cn(
                        "relative h-6 w-10 shrink-0 rounded-full transition-colors",
                        on ? "bg-accent" : "bg-white/15",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200",
                          on ? "left-[1.125rem]" : "left-0.5",
                        )}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>

        <p className="text-xs leading-relaxed text-mute">
          The drawing is a guide only. We confirm the final specification, compliance and pricing
          with you before any steel is cut.
        </p>
      </div>
    </div>
  );
}
