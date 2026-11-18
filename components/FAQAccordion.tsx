"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQ[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <ul className="rule-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${baseId}-${i}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                id={`${id}-q`}
                aria-expanded={isOpen}
                aria-controls={id}
                className="group flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="display text-[1.625rem] leading-none transition-colors group-hover:text-accent-text sm:text-[2rem]">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-6 w-6 shrink-0 text-mute transition-transform duration-300 ease-[var(--ease-mac)]",
                    isOpen && "rotate-180 text-accent-text",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={id}
              role="region"
              aria-labelledby={`${id}-q`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-[var(--ease-mac)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 pr-10 text-[1.0625rem] leading-relaxed text-mute">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
