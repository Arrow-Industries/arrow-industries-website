"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecTab {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Keeps long specifications to one section of the page. Every panel stays in
 * the page's HTML, so nothing is lost to search engines.
 */
export function SpecTabs({ tabs, label }: { tabs: SpecTab[]; label: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: (active + 1) % tabs.length,
      ArrowLeft: (active - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = moves[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex max-w-full gap-0.5 overflow-x-auto rounded-xl bg-white/[0.06] p-1 [scrollbar-width:none] sm:inline-flex [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "h-9 shrink-0 whitespace-nowrap rounded-[0.5rem] px-3.5 text-[0.8125rem] font-medium transition-colors",
              active === i
                ? "bg-white/[0.14] text-bone shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
                : "text-mute hover:text-bone",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={active !== i}
          className="mt-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
