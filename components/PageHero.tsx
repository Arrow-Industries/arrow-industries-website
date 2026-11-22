import type { ReactNode } from "react";
import { Crumbs } from "@/components/Blocks";
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

/** The opening of a plain page: one bold line with its last word in red. */
export function PageHero({ heading, body, crumbs, actions }: PageHeroProps) {
  const words = heading.trim().split(" ");
  const last = words.length > 1 ? words.pop() : undefined;
  return (
    <section className="p-hero">
      {crumbs && crumbs.length > 0 && <JsonLd data={breadcrumbSchema(crumbs)} />}
      <div className="wrap">
        {crumbs && <Crumbs crumbs={crumbs} />}
        <h1 className="long">
          {words.join(" ")}
          {last && (
            <>
              {" "}
              <span className="red">{last}</span>
            </>
          )}
        </h1>
        {(body || actions) && (
          <div className="row">
            {body && <p>{body}</p>}
            {actions && <div className="actions">{actions}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
