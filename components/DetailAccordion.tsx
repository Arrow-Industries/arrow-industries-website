"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DetailItem {
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Detail for the people who want it, out of the way of those who don't.
 * Everything stays in the page's HTML, so search engines still read it.
 */
export function DetailAccordion({ items }: { items: DetailItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();

  return (
    <ul className="rule-list">
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}`;
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                id={`${panelId}-button`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex min-h-18 w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span className="display display-sm transition-colors group-hover:text-accent-text">
                  {item.title}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-6 w-6 shrink-0 text-mute transition-transform duration-300 ease-[var(--ease-mac)]",
                    isOpen && "rotate-180 text-accent-text",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-button`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-mac)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-7 pt-1">{item.content}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
