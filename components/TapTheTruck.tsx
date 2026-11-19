"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/Container";
import type { TruckWalk } from "@/data/truck-parts";
import { cn } from "@/lib/utils";

/** The detail, on the truck itself: tap a part to read about it. */
export function TapTheTruck({
  walk,
  id = "tap",
  eyebrow = "The detail",
  heading = "Tap the truck.",
}: {
  walk: TruckWalk;
  id?: string;
  eyebrow?: string;
  heading?: string;
}) {
  const { photo, parts, width, height } = walk;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const part = parts[active];

  function pick(index: number) {
    setActive(index);
    const list = listRef.current;
    const chip = list?.children[index] as HTMLElement | undefined;
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: chip.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <section id={id} className="scroll-mt-12 bg-ink-2 pt-16 lg:pt-24">
      <Container>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display-lg mt-3">{heading}</h2>
      </Container>

      <div className="mt-7 grid grid-cols-[minmax(0,1fr)] lg:mt-11 lg:grid-cols-[auto_minmax(22rem,1fr)]">
        <div
          className="relative aspect-[var(--ratio)] bg-ink-3 lg:w-[min(calc(100vw-22rem),calc(78svh*var(--ratio)))]"
          style={{ "--ratio": width / height } as CSSProperties}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
          />
          {parts.map((p, i) => (
            <button
              key={p.title}
              type="button"
              aria-label={p.title}
              aria-pressed={i === active}
              onClick={() => pick(i)}
              className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={cn(
                  "block h-[1.125rem] w-[1.125rem] rounded-full transition-all duration-200",
                  i === active
                    ? "bg-accent shadow-[0_0_0_7px_rgb(225_6_0/0.4),inset_0_0_0_2px_#fff]"
                    : "bg-white shadow-[0_0_0_5px_rgb(255_255_255/0.3),0_2px_8px_rgb(0_0_0/0.5)] group-hover:scale-125",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-col justify-center pb-10 lg:gap-3 lg:p-[clamp(1.75rem,4vw,4rem)]">
          <div className="order-2 min-h-40 px-4 sm:px-8 lg:order-1 lg:min-h-48 lg:px-0" aria-live="polite">
            <h3 className="display-md">{part.title}</h3>
            <p className="mt-3 max-w-[30ch] text-xl leading-snug text-mute">{part.body}</p>
          </div>
          <div
            ref={listRef}
            className="relative order-1 flex gap-1.5 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-8 lg:order-2 lg:flex-wrap lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden"
          >
            {parts.map((p, i) => (
              <button
                key={p.title}
                type="button"
                aria-pressed={i === active}
                onClick={() => pick(i)}
                className={cn(
                  "min-h-11 shrink-0 border px-3.5 text-sm font-medium transition-colors",
                  i === active
                    ? "border-bone bg-bone text-ink"
                    : "border-line text-mute hover:border-bone hover:text-bone",
                )}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
