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
    <ul className="list-group">
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
                className="flex min-h-13 w-full items-center justify-between gap-4 px-[1.125rem] py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-[0.9375rem] font-medium tracking-normal text-bone sm:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-mute transition-transform duration-300 ease-[var(--ease-mac)]",
                    isOpen && "rotate-180",
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
                <p className="px-[1.125rem] pb-4 pr-10 text-sm leading-relaxed text-mute sm:text-[0.9375rem]">
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
