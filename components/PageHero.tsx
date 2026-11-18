import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
    <section className="relative isolate overflow-hidden">
      {crumbs && crumbs.length > 0 && <JsonLd data={breadcrumbSchema(crumbs)} />}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(60%_100%_at_20%_0%,rgb(225_6_0/0.13),transparent_70%)]"
      />
      <Container className={compact ? "pt-6 pb-4 lg:pt-8 lg:pb-6" : "pt-6 pb-6 lg:pt-8 lg:pb-10"}>
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        <div className={compact ? "mt-8 lg:mt-10" : "mt-10 lg:mt-14"}>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1
            className={
              compact
                ? "max-w-3xl font-display text-[2rem] font-semibold leading-[1.08] text-bone sm:text-[2.5rem] lg:text-5xl"
                : "max-w-4xl font-display text-[2.25rem] font-semibold leading-[1.05] text-bone sm:text-5xl lg:text-[3.5rem]"
            }
          >
            {heading}
          </h1>
          {body && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              {body}
            </p>
          )}
          {actions && (
            <div className="mt-7 flex flex-wrap items-center gap-2.5">{actions}</div>
          )}
        </div>
      </Container>
    </section>
  );
}
