import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  const isExternal = service.external === true;
  const ctaLabel = service.ctaLabel ?? "Learn more →";

  const content = (
    <>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-all duration-300 group-hover:via-accent"
      />
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent/10 text-accent">
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="font-display text-lg font-bold leading-tight text-bone sm:text-xl">
          {service.title}
        </h3>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-mute sm:text-base">
        {service.tagline}
      </p>
      <span className="mt-auto pt-12 text-xs font-semibold uppercase tracking-[0.18em] text-mute transition-colors group-hover:text-accent">
        {ctaLabel}
      </span>
    </>
  );

  const className =
    "group relative flex h-full flex-col bg-ink-2 p-12 transition-colors duration-300 hover:bg-ink-3 sm:p-14";

  if (isExternal) {
    return (
      <a
        href={service.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={service.href} className={className}>
      {content}
    </Link>
  );
}
