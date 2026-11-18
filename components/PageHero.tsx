import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, type BreadcrumbCrumb } from "@/lib/schema";
import { cn } from "@/lib/utils";

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
    <section>
      {crumbs && crumbs.length > 0 && <JsonLd data={breadcrumbSchema(crumbs)} />}
      <Container className={compact ? "pb-3 pt-5 lg:pt-7" : "pb-5 pt-5 lg:pb-8 lg:pt-7"}>
        {crumbs && <Breadcrumbs crumbs={crumbs} />}
        <div className="mt-7 lg:mt-10">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className={cn("max-w-[18ch]", compact ? "display-md" : "display-lg")}>{heading}</h1>
          {body && <p className="mt-5 max-w-2xl text-lg leading-snug text-mute">{body}</p>}
          {actions && <div className="mt-7 flex flex-wrap items-center gap-2.5">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}
