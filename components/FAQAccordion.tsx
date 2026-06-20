"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/faqs";
import { cn } from "@/lib/utils";

interface FAQAccordionProps {
  items: FAQ[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <li key={item.question}>
            <button
              type="button"
              id={`${id}-q`}
              aria-expanded={isOpen}
              aria-controls={id}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-base font-semibold text-bone sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-accent transition-transform",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            <div
              id={id}
              role="region"
              aria-labelledby={`${id}-q`}
              aria-hidden={!isOpen}
              hidden={!isOpen}
              className="pb-6 pr-10 text-sm leading-relaxed text-mute sm:text-base"
            >
              {item.answer}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
