"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LocalNavItem {
  id: string;
  label: string;
}

/**
 * The strip of in-page links on long product pages. It stays under the toolbar
 * and follows along, so a 12-section page can be read like a short one.
 */
export function LocalNav({ items, label }: { items: LocalNavItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      // The current section is the last one to have reached the top third.
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label={label}
      className="material sticky top-15 z-30 border-b border-line-soft"
    >
      <ul className="container-page flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "display relative inline-flex h-12 items-center text-[1.375rem] transition-colors",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-accent",
                active === item.id
                  ? "text-bone after:opacity-100"
                  : "text-mute after:opacity-0 hover:text-bone",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
