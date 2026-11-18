import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

/** The building blocks shared by the product and service pages. */

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="rule-list">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 py-3">
          <Check className="mt-1 h-4 w-4 shrink-0 text-accent-text" strokeWidth={2.5} aria-hidden />
          <p className="text-[1.0625rem] leading-snug text-bone">{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function CheckGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 border-t border-line py-3">
          <Check className="mt-1 h-4 w-4 shrink-0 text-accent-text" strokeWidth={2.5} aria-hidden />
          <p className="text-[1.0625rem] leading-snug text-bone">{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function InfoGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="border-t border-line py-4">
          <h3 className="text-[1.75rem] text-bone">{item.title}</h3>
          <p className="mt-2 text-[1.0625rem] leading-snug text-mute">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="pill">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ViewBuildsLink() {
  return (
    <Link
      href="/builds"
      className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-text"
    >
      View builds
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

export interface BuildCard {
  src: string;
  alt: string;
  title: string;
}

/** Photos first, edge to edge, with the name on the picture. */
export function BuildCards({ builds }: { builds: BuildCard[] }) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
      {builds.map((b) => (
        <li key={b.src} className="group relative aspect-[4/3] overflow-hidden bg-ink-2 lg:aspect-[4/5]">
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgb(10_11_12/0.88))]"
          />
          <h3 className="display-sm absolute inset-x-4 bottom-4 text-white">{b.title}</h3>
        </li>
      ))}
    </ul>
  );
}

/** A few big facts in place of a paragraph. */
export function StatTiles({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label} className="border-t border-line py-4">
          <p className="display text-[clamp(2rem,9.5vw,3.25rem)]">{item.value}</p>
          <p className="mt-1.5 text-[0.9375rem] text-mute">{item.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** Short choices: a name and a few words. */
export function ChoiceTiles({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="mt-7 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.title} className="border-t border-line py-4">
          <h3 className="display-md">{item.title}</h3>
          <p className="mt-2.5 text-[1.0625rem] leading-snug text-mute">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function ProcessSteps({
  steps,
}: {
  steps: { step: string; title: string; body: string }[];
}) {
  return (
    <ol
      className={cn(
        "mt-7 grid gap-x-6 sm:grid-cols-2",
        steps.length === 5 ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-4",
      )}
    >
      {steps.map((p, i) => (
        <li key={p.step} className="border-t border-line py-4">
          <span className="step-num">{i + 1}</span>
          <h3 className="mt-3 text-[1.75rem] text-bone">{p.title}</h3>
          <p className="mt-2 text-[1.0625rem] leading-snug text-mute">{p.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** A photo beside a message, for the one thing a section needs to say. */
export function PhotoBand({
  photo,
  eyebrow,
  heading,
  body,
  children,
  reverse,
}: {
  photo: Photo;
  eyebrow: string;
  heading: string;
  body?: string;
  children?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid bg-ink-2 lg:grid-cols-[1.15fr_1fr]">
      <div className={cn("relative aspect-[4/3] lg:aspect-auto lg:min-h-[36rem]", reverse && "lg:order-2")}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:p-16">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display-md">{heading}</h2>
        {body && <p className="mt-4 max-w-lg text-lg leading-snug text-mute">{body}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  );
}

/** Captioned photos showing how the work is done. Swipe on a phone. */
export function WorkshopStrip({
  items,
}: {
  items: { photo: Photo; title: string }[];
}) {
  return (
    <ul
      tabIndex={0}
      aria-label="Inside the workshop"
      className={cn(
        "flex snap-x snap-mandatory scroll-px-4 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] md:grid md:overflow-visible md:px-[clamp(1rem,3vw,2.5rem)] [&::-webkit-scrollbar]:hidden",
        items.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3",
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className="group relative aspect-[3/4] w-[76vw] shrink-0 snap-start overflow-hidden bg-ink-3 md:w-auto"
        >
          <Image
            src={item.photo.src}
            alt={item.photo.alt}
            fill
            sizes="(min-width: 768px) 33vw, 76vw"
            className="object-cover transition-transform duration-1000 ease-[var(--ease-mac)] group-hover:scale-[1.04]"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgb(10_11_12/0.9))]"
          />
          <h3 className="display-sm absolute inset-x-4 bottom-4 text-white">{item.title}</h3>
        </li>
      ))}
    </ul>
  );
}
