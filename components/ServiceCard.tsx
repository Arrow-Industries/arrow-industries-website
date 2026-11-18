import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  /** `feature` carries a photograph; `wide` lays the card out as a single row. */
  variant?: "default" | "feature" | "wide";
  image?: string;
  className?: string;
}

export function ServiceCard({
  service,
  variant = "default",
  image,
  className,
}: ServiceCardProps) {
  const Icon = service.icon;
  const isExternal = service.external === true;
  const ctaLabel = (service.ctaLabel ?? "Learn more").replace(/\s*→\s*$/, "");
  const Chevron = isExternal ? ArrowUpRight : ChevronRight;

  const cta = (
    <span className="inline-flex items-center gap-0.5 text-sm font-medium text-accent-text">
      {ctaLabel}
      <Chevron
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </span>
  );

  const body =
    variant === "wide" ? (
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="icon-tile">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[1.0625rem] font-semibold text-bone">
            {service.title}
          </h3>
          <p className="mt-0.5 text-sm leading-relaxed text-mute">{service.tagline}</p>
        </div>
        {cta}
      </div>
    ) : (
      <div
        className={cn(
          "flex h-full flex-col p-5 sm:p-6",
          variant === "feature" && "relative z-10 max-w-sm justify-end",
        )}
      >
        <span className="icon-tile">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <h3
          className={cn(
            "mt-4 font-display font-semibold text-bone",
            variant === "feature" ? "text-2xl" : "text-[1.0625rem]",
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed",
            variant === "feature" ? "text-bone/75" : "text-mute",
          )}
        >
          {service.tagline}
        </p>
        <div className={variant === "feature" ? "mt-4" : "mt-auto pt-5"}>{cta}</div>
      </div>
    );

  const classes = cn(
    "card card-link group block h-full overflow-hidden",
    variant === "feature" && "min-h-[20rem]",
    className,
  );

  const media =
    variant === "feature" && image ? (
      <>
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 760px, 100vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(0deg,rgb(11_11_13/0.94)_8%,rgb(11_11_13/0.5)_55%,rgb(11_11_13/0.05)_100%)] sm:bg-[linear-gradient(90deg,rgb(11_11_13/0.94)_12%,rgb(11_11_13/0.45)_60%,rgb(11_11_13/0.05)_100%)]"
        />
      </>
    ) : null;

  if (isExternal) {
    return (
      <a href={service.href} target="_blank" rel="noreferrer" className={classes}>
        {media}
        {body}
      </a>
    );
  }

  return (
    <Link href={service.href} className={classes}>
      {media}
      {body}
    </Link>
  );
}
