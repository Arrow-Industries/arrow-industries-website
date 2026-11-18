import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import type { Photo } from "@/data/media";
import { cn } from "@/lib/utils";

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
      className="group inline-flex min-h-11 items-center gap-0.5 text-sm font-medium text-accent-text"
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
}

/** Photos first: the name sits on the picture and nothing else competes with it. */
export function BuildCards({ builds }: { builds: BuildCard[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {builds.map((b) => (
        <li
          key={b.title}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line-soft bg-ink-2 lg:aspect-[4/5]"
        >
          <Image
            src={b.src}
            alt={b.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgb(11_11_13/0.88))]"
          />
          <h3 className="absolute inset-x-4 bottom-3.5 font-display text-[1.0625rem] font-semibold text-white">
            {b.title}
          </h3>
        </li>
      ))}
    </ul>
  );
}

/** A few big facts in place of a paragraph. */
export function StatTiles({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.label} className="card p-4 sm:p-5">
          <p className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-[1.75rem]">
            {item.value}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-mute">{item.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** Short choices: a name and a few words. */
export function ChoiceTiles({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.title} className="card p-5">
          <h3 className="font-display text-xl font-semibold text-bone">{item.title}</h3>
          <p className="mt-1 text-sm leading-snug text-mute">{item.body}</p>
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

/** A large photo link, used for products and services. */
export function PhotoCard({
  href,
  photo,
  title,
  body,
  cta = "Learn more",
  className,
}: {
  href: string;
  photo: Photo;
  title: string;
  body: string;
  cta?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "card-link group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-line-soft bg-ink-2 p-5 sm:aspect-[5/6] lg:aspect-[4/5]",
        className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgb(11_11_13/0.92)_100%)]"
      />
      <h3 className="relative font-display text-2xl font-semibold text-white">{title}</h3>
      <p className="relative mt-1 text-sm leading-relaxed text-white/75">{body}</p>
      <span className="relative mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-accent-text">
        {cta}
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
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
  body: string;
  children?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="card grid overflow-hidden lg:grid-cols-2">
      <div className={cn("relative aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]", reverse && "lg:order-2")}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-[1.75rem] font-semibold leading-[1.12] text-bone sm:text-[2rem]">
          {heading}
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute sm:text-base">{body}</p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}

/** Three captioned photos showing how the work is done. */
export function WorkshopStrip({
  items,
}: {
  items: { photo: Photo; title: string; body?: string }[];
}) {
  return (
    <ul className="mt-6 grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className="card overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={item.photo.src}
              alt={item.photo.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="font-display text-[1.0625rem] font-semibold text-bone">{item.title}</h3>
            {item.body && <p className="mt-1 text-sm leading-relaxed text-mute">{item.body}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
