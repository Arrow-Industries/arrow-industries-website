import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, type BreadcrumbCrumb } from "@/lib/schema";

interface PageHeroProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  crumbs?: BreadcrumbCrumb[];
  compact?: boolean;
  actions?: ReactNode;
}

export function PageHero({ eyebrow, heading, body, crumbs, compact, actions }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {crumbs && crumbs.length > 0 && (
        <JsonLd data={breadcrumbSchema(crumbs)} />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.16),transparent_55%)]"
      />
      <Container className={`relative ${compact ? "py-10 lg:py-14" : "py-16 lg:py-24"}`}>
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.label} className="flex items-center gap-1.5">
                    {c.href && !last ? (
                      <Link href={c.href} className="hover:text-bone">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-bone" : undefined}>
                        {c.label}
                      </span>
                    )}
                    {!last && (
                      <ChevronRight className="h-3 w-3 text-line" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-accent-text">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.05] text-bone sm:text-5xl lg:text-[3.75rem]">
          {heading}
        </h1>
        {body && (
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-mute sm:text-lg">
            {body}
          </p>
        )}
        {actions && (
          <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </Container>
    </section>
  );
}
