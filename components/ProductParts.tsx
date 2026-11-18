import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

/** The building blocks shared by the tipper, dog and semi trailer pages. */

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li key={item} className="list-row">
          <Check className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
          <p className="text-sm leading-relaxed text-bone sm:text-[0.9375rem]">{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function CheckGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="card flex items-start gap-3 p-4">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
          <p className="text-sm leading-relaxed text-bone">{item}</p>
        </li>
      ))}
    </ul>
  );
}

export function InfoGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.title} className="card p-5">
          <h3 className="font-display text-base font-semibold text-bone">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-mute">{item.body}</p>
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
      className="group inline-flex items-center gap-0.5 text-sm font-medium text-accent-text"
    >
      View builds
      <ChevronRight
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

export interface BuildCard {
  src: string;
  alt: string;
  title: string;
  application: string;
  specs: string[];
}

export function BuildCards({ builds }: { builds: BuildCard[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {builds.map((b) => (
        <li key={b.title} className="card group flex flex-col overflow-hidden">
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.0625rem] font-semibold text-bone">{b.title}</h3>
              <span className="label shrink-0">{b.application}</span>
            </div>
            <p className="text-sm leading-relaxed text-mute">{b.specs.join(" · ")}</p>
          </div>
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
      className={
        steps.length === 5
          ? "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          : "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {steps.map((p, i) => (
        <li key={p.step} className="card flex flex-col gap-2.5 p-5">
          <span className="step-num">{i + 1}</span>
          <h3 className="font-display text-base font-semibold text-bone">{p.title}</h3>
          <p className="text-sm leading-relaxed text-mute">{p.body}</p>
        </li>
      ))}
    </ol>
  );
}
