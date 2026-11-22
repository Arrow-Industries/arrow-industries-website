"use client";

import { useEffect, useState } from "react";

/**
 * Which of a page's sections is being read: the last one whose top has
 * reached the upper third of the window.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(undefined);
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.34;
      let current: string | undefined;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
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
  }, [key]);

  return active;
}
