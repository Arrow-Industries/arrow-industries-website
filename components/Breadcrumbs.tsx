import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbCrumb } from "@/lib/schema";

/** The trail shown above a page title. Structured data is emitted separately. */
export function Breadcrumbs({ crumbs }: { crumbs: BreadcrumbCrumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-mute">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link href={c.href} className="transition-colors hover:text-bone">
                  {c.label}
                </Link>
              ) : (
                <span
                  className={last ? "text-bone" : undefined}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-3.5 w-3.5 text-mute/50" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
