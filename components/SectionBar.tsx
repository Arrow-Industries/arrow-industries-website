"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/lib/use-active-section";

export interface SectionBarItem {
  id: string;
  label: string;
}

/**
 * The slim bar that slides out from under the menu once a long page has been
 * scrolled: where you are, the other sections, and the one thing to do next.
 */
export function SectionBar({
  title,
  items,
  cta,
}: {
  title: string;
  items: SectionBarItem[];
  cta?: { href: string; label: string };
}) {
  const active = useActiveSection(items.map((i) => i.id));
  const [shown, setShown] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const markRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The red marker slides to sit under the section being read.
  useEffect(() => {
    const list = listRef.current;
    const mark = markRef.current;
    if (!list || !mark) return;
    function place() {
      const link = list!.querySelector<HTMLElement>('[aria-current="true"]');
      if (!link) {
        mark!.style.opacity = "0";
        return;
      }
      mark!.style.opacity = "1";
      mark!.style.width = `${link.offsetWidth}px`;
      mark!.style.transform = `translateX(${link.offsetLeft}px)`;
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <nav aria-label={`${title} sections`} className="subbar" data-shown={shown} inert={!shown}>
      <div className="wrap">
        <a
          href="#main"
          className="subbar-title"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {title}
        </a>
        <ul ref={listRef}>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
          <li ref={markRef} className="subbar-mark" aria-hidden role="presentation" />
        </ul>
        {cta &&
          (/^(#|https?:)/.test(cta.href) ? (
            <a
              href={cta.href}
              className="btn btn-red"
              {...(cta.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {cta.label}
            </a>
          ) : (
            <Link href={cta.href} className="btn btn-red">
              {cta.label}
            </Link>
          ))}
      </div>
    </nav>
  );
}

/** Marks the clause being read in a side list of in-page links. */
export function SideSpy({ ids, within }: { ids: string[]; within: string }) {
  const active = useActiveSection(ids);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(within);
    if (!nav) return;
    let current: HTMLElement | null = null;
    nav.querySelectorAll<HTMLElement>("a[href^='#']").forEach((a) => {
      const on = a.getAttribute("href") === `#${active}`;
      if (on) {
        a.setAttribute("aria-current", "true");
        current = a;
      } else a.removeAttribute("aria-current");
    });
    // Keep the marked link in view when the list scrolls on its own.
    const link = current as HTMLElement | null;
    if (link && nav.scrollHeight > nav.clientHeight) {
      const top = link.offsetTop - nav.clientHeight / 2 + link.offsetHeight / 2;
      nav.scrollTo({ top, behavior: "smooth" });
    }
  }, [active, within]);

  return null;
}
