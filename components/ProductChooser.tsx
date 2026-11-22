"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { media, type Photo } from "@/data/media";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  tab: string;
  href: string;
  linkLabel: string;
  photo: Photo;
  facts: string[];
}

const products: Product[] = [
  {
    id: "tipper",
    tab: "Tipper",
    href: "/tipper-truck-bodies",
    linkLabel: "See tipper bodies",
    photo: media.tipperWhite,
    facts: ["4x2", "6x4", "8x4", "10x4"],
  },
  {
    id: "dog",
    tab: "Dog",
    href: "/dog-trailers",
    linkLabel: "See dog trailers",
    photo: media.truckAndDogDusk,
    facts: ["3-axle", "4-axle"],
  },
  {
    id: "semi",
    tab: "Semi",
    href: "/semi-trailers",
    linkLabel: "See semi trailers",
    photo: media.bodyPainted,
    facts: ["2-axle", "3-axle", "Tipping", "Prime mover"],
  },
];

/** Pick a product and the whole section changes to suit. */
export function ProductChooser() {
  const [activeId, setActiveId] = useState(products[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);
  const active = products.find((p) => p.id === activeId) ?? products[0];

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + products.length) % products.length;
    setActiveId(products[next].id);
    tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <section id="build" className="band">
      <Container>
        <p className="eyebrow">Build</p>
        <h2 className="sr-only">Custom tipper bodies, dog trailers and semi trailers</h2>
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Choose a product"
          className="mt-6 flex justify-between gap-2.5 border-b border-line lg:mt-10"
        >
          {products.map((p, i) => {
            const selected = p.id === active.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`product-tab-${p.id}`}
                aria-selected={selected}
                aria-controls="product-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(p.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "display relative min-h-16 pb-3 text-[13.5vw] leading-[0.9] transition-colors lg:text-[min(13.5vw,11rem)]",
                  selected
                    ? "text-bone after:absolute after:inset-x-0 after:-bottom-px after:h-1 after:bg-accent"
                    : "text-transparent [-webkit-text-stroke:1.2px_rgb(239_236_230/0.55)] hover:[-webkit-text-stroke-color:var(--color-bone)]",
                )}
              >
                {p.tab}
              </button>
            );
          })}
        </div>
      </Container>

      <div
        id="product-panel"
        role="tabpanel"
        aria-labelledby={`product-tab-${active.id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-3 md:aspect-[21/9]">
          {products.map((p) => (
            <Image
              key={p.id}
              src={p.photo.src}
              alt={p.id === active.id ? p.photo.alt : ""}
              fill
              sizes="100vw"
              className={cn(
                "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-mac)] md:object-[50%_62%]",
                p.id === active.id ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            />
          ))}
        </div>
        <Container className="flex flex-wrap items-center justify-between gap-5 pt-6">
          <ul className="display flex flex-wrap gap-x-5 gap-y-1.5 text-[clamp(2rem,3.4vw,3rem)] leading-none">
            {active.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2.5">
            <Button href={`/configure?product=${active.id}`} size="lg">
              Configure yours
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={active.href} size="lg" variant="secondary">
              {active.linkLabel}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
