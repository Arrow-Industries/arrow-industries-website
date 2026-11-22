"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * The site's small movements, in one place.
 *
 * Sections further down the page settle into place as they are reached, and
 * fold-out rows open and close smoothly. Nothing is hidden unless this has
 * run, so the page reads the same without it.
 */
export function Motion() {
  const pathname = usePathname();

  // Sections settle in as they come into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          // Neighbours arriving together follow one another in.
          el.style.setProperty("--d", `${Math.min(order++, 6) * 70}ms`);
          el.dataset.reveal = "in";
          el.addEventListener(
            "animationend",
            () => {
              delete el.dataset.reveal;
              el.style.removeProperty("--d");
            },
            { once: true },
          );
        }
      },
      { rootMargin: "0px 0px -7% 0px" },
    );

    function collect() {
      const fold = window.innerHeight * 0.92;
      document.querySelectorAll<HTMLElement>("main .reveal, main .section > *").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Only what is still below the window waits; the rest is already read.
        if (el.getBoundingClientRect().top < fold) return;
        el.dataset.reveal = "pending";
        observer.observe(el);
      });
    }

    const frame = requestAnimationFrame(collect);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => delete el.dataset.reveal);
    };
  }, [pathname]);

  // Fold-out rows open and close with their height, not in a jump.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const running = new WeakMap<HTMLElement, Animation>();

    function onClick(e: MouseEvent) {
      const summary = (e.target as Element | null)?.closest?.(".acc summary");
      const details = summary?.parentElement;
      if (!(details instanceof HTMLDetailsElement)) return;
      const body = details.querySelector<HTMLElement>(":scope > .body");
      if (!body || reduced.matches || typeof body.animate !== "function") return;

      e.preventDefault();
      running.get(body)?.cancel();

      const closing = details.open && !details.classList.contains("closing");
      if (!closing) {
        details.classList.remove("closing");
        details.open = true;
      } else {
        details.classList.add("closing");
      }

      const style = getComputedStyle(body);
      const full = {
        height: `${body.offsetHeight}px`,
        paddingBottom: style.paddingBottom,
        opacity: 1,
      };
      const shut = { height: "0px", paddingBottom: "0px", opacity: 0 };

      body.style.overflow = "hidden";
      const animation = body.animate(closing ? [full, shut] : [shut, full], {
        duration: closing ? 300 : 420,
        easing: EASE,
      });
      running.set(body, animation);
      animation.onfinish = () => {
        body.style.overflow = "";
        if (closing) {
          details.open = false;
          details.classList.remove("closing");
        }
      };
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
