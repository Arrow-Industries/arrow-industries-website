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
    <ul className="list-group">
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
                className="flex min-h-14 w-full items-center justify-between gap-4 px-[1.125rem] py-3.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="text-[0.9375rem] font-medium tracking-normal text-bone sm:text-base">
                  {item.title}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-4 w-4 shrink-0 text-mute transition-transform duration-300 ease-[var(--ease-mac)]",
                    isOpen && "rotate-180",
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
                <div className="px-[1.125rem] pb-5">{item.content}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
