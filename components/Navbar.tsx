"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DockActions } from "@/components/MobileActionBar";
import { primaryNav, type NavChild, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";

// Only downloaded the first time someone opens it.
const CommandPalette = dynamic(
  () => import("@/components/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** A pause before a hovered menu opens, so crossing the bar doesn't flash one. */
const OPEN_DELAY = 70;
/** A pause before it closes, so a diagonal move to the panel keeps it open. */
const CLOSE_DELAY = 160;

const pathOf = (href: string) => href.split("#")[0];
const linksOf = (item: NavItem) => [...(item.children ?? []), ...(item.links ?? [])];

function isGroupActive(item: NavItem, pathname: string) {
  return linksOf(item).some((c) => !c.external && pathOf(c.href) === pathname);
}

// Layout effects warn on the server; the menus only measure in the browser.
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Navbar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [flyout, setFlyout] = useState<string | null>(null);
  const [flyHeight, setFlyHeight] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [warm, setWarm] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const glideRef = useRef<HTMLSpanElement>(null);
  const triggers = useRef(new Map<string, HTMLElement>());
  const panels = useRef(new Map<string, HTMLElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyoutRef = useRef<string | null>(null);
  flyoutRef.current = flyout;

  const cancelTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  /** Slide the soft highlight under a menu label, or fade it away. */
  const glideTo = useCallback((label: string | null) => {
    const glide = glideRef.current;
    const header = headerRef.current;
    if (!glide || !header) return;
    const el = label ? triggers.current.get(label) : null;
    if (!el) {
      glide.dataset.on = "false";
      return;
    }
    const left = el.getBoundingClientRect().left - header.getBoundingClientRect().left;
    // First appearance: place it without sliding in from wherever it last was.
    const snap = glide.dataset.on !== "true";
    if (snap) glide.style.transition = "none";
    glide.style.width = `${el.offsetWidth}px`;
    glide.style.transform = `translateX(${left}px)`;
    if (snap) {
      void glide.offsetWidth;
      glide.style.transition = "";
    }
    glide.dataset.on = "true";
  }, []);

  const closeFlyout = useCallback(() => {
    cancelTimer();
    setFlyout(null);
    glideTo(null);
  }, [glideTo]);

  function hoverItem(item: NavItem) {
    cancelTimer();
    glideTo(item.label);
    const next = item.external ? null : item.label;
    if (next === flyoutRef.current) return;
    // Moving between menus is immediate; the first one waits a moment.
    const wait = flyoutRef.current ? 0 : OPEN_DELAY;
    timer.current = setTimeout(() => setFlyout(next), wait);
  }

  function leaveBar() {
    cancelTimer();
    timer.current = setTimeout(() => {
      setFlyout(null);
      glideTo(null);
    }, CLOSE_DELAY);
  }

  // The shared panel takes the height of whichever menu is showing.
  useBrowserLayoutEffect(() => {
    function measure() {
      const panel = flyout ? panels.current.get(flyout) : null;
      setFlyHeight(panel ? panel.offsetHeight : 0);
    }
    measure();
    if (!flyout) return;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [flyout]);

  // Anything that changes the page puts the menus away.
  useEffect(() => {
    setFlyout(null);
    setSheetOpen(false);
    glideTo(null);
  }, [pathname, glideTo]);

  useEffect(() => () => cancelTimer(), []);

  // On a wide screen, fetch the menu photographs once the page is quiet, so
  // they are already there the first time the menu opens. Phones never do.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const id = setTimeout(() => setWarm(true), 1200);
    return () => clearTimeout(id);
  }, []);

  // A hairline appears under the bar once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // While the phone menu is open: lock the page behind it, and put it away if
  // the window grows into the desktop layout.
  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = "hidden";
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setSheetOpen(false);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = "";
      wide.removeEventListener("change", onWide);
    };
  }, [sheetOpen]);

  // Escape closes the phone menu; Tab stays within the bar and the menu.
  function onSheetKeyDown(e: React.KeyboardEvent) {
    if (!sheetOpen) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setSheetOpen(false);
      menuBtnRef.current?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = [
      ...(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ...(sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
    ].filter((n) => n.offsetParent !== null && !n.closest("[inert]"));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const open = flyout !== null;

  return (
    <>
      <header
        ref={headerRef}
        className="site-bar"
        data-scrolled={scrolled}
        data-open={open || sheetOpen}
        onPointerEnter={(e) => e.pointerType === "mouse" && cancelTimer()}
        onPointerLeave={(e) => e.pointerType === "mouse" && leaveBar()}
        onBlur={(e) => {
          // Keyboard focus leaving the bar closes the menu.
          if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) closeFlyout();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && flyout) {
            const trigger = triggers.current.get(flyout);
            closeFlyout();
            trigger?.focus();
          }
          onSheetKeyDown(e);
        }}
      >
        <span aria-hidden className="fly-bg" style={{ height: flyHeight }} />
        <span aria-hidden ref={glideRef} className="bar-glide" data-on="false" />

        <div className="wrap bar-row">
          <Logo />

          <nav aria-label="Primary" className="bar-nav">
            <ul>
              {primaryNav.map((item) => (
                <DesktopItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  open={flyout === item.label}
                  warm={warm || flyout !== null}
                  height={flyHeight}
                  onHover={() => hoverItem(item)}
                  onToggle={(next) => {
                    cancelTimer();
                    setFlyout(next ? item.label : null);
                    glideTo(next ? item.label : null);
                  }}
                  onPick={closeFlyout}
                  registerTrigger={(el) => {
                    if (el) triggers.current.set(item.label, el);
                    else triggers.current.delete(item.label);
                  }}
                  registerPanel={(el) => {
                    if (el) panels.current.set(item.label, el);
                    else panels.current.delete(item.label);
                  }}
                />
              ))}
            </ul>
          </nav>

          <div className="bar-end">
            <a href={site.phoneHref} className="bar-phone">
              {site.phone}
            </a>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the site"
              aria-keyshortcuts="Meta+K Control+K"
              className="bar-icon"
            >
              <Search className="h-[1.125rem] w-[1.125rem]" aria-hidden />
            </button>
            <Link href="/request-a-quote" className="btn btn-ink bar-cta">
              Request a quote
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              className="bar-icon menu-btn"
              aria-label={sheetOpen ? "Close menu" : "Open menu"}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen((o) => !o)}
            >
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Dims and softens the page while a menu is down. A click puts it away. */}
      <div aria-hidden className="fly-scrim" data-open={open} onClick={closeFlyout} />

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="sheet"
        data-open={sheetOpen}
        inert={!sheetOpen}
        onKeyDown={onSheetKeyDown}
      >
        <div className="sheet-body">
          <ul className="sheet-list">
            {primaryNav.map((item, i) => {
              const style = { "--i": i } as React.CSSProperties;
              if (item.external) {
                return (
                  <li key={item.label} style={style}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setSheetOpen(false)}
                      className="sheet-row"
                    >
                      {item.label}
                      <span className="sheet-out" aria-hidden>
                        ↗
                      </span>
                    </a>
                  </li>
                );
              }
              const expanded = openGroup === item.label;
              return (
                <li key={item.label} style={style}>
                  <button
                    type="button"
                    className="sheet-row"
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup(expanded ? null : item.label)}
                  >
                    {item.label}
                    <i className="plus" aria-hidden />
                  </button>
                  <div className="sheet-sub" data-open={expanded} inert={!expanded}>
                    <ul>
                      {item.href && !linksOf(item).some((c) => c.href === item.href) && (
                        <li>
                          <MenuLink
                            child={{ label: item.overview ?? item.label, href: item.href }}
                            pathname={pathname}
                            onPick={() => setSheetOpen(false)}
                          >
                            {item.overview ?? item.label}
                            <span aria-hidden>→</span>
                          </MenuLink>
                        </li>
                      )}
                      {linksOf(item).map((child) => (
                        <li key={child.href + child.label}>
                          <MenuLink child={child} pathname={pathname} onPick={() => setSheetOpen(false)}>
                            {child.label}
                            <span aria-hidden>{child.external ? "↗" : "→"}</span>
                          </MenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sheet-foot">
          <DockActions onPick={() => setSheetOpen(false)} />
        </div>
      </div>
    </>
  );
}

function MenuLink({
  child,
  onPick,
  className,
  pathname,
  style,
  children,
}: {
  child: NavChild;
  onPick: () => void;
  className?: string;
  pathname?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (child.external) {
    return (
      <a href={child.href} target="_blank" rel="noreferrer" onClick={onPick} className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={child.href}
      onClick={onPick}
      aria-current={pathname === child.href ? "page" : undefined}
      className={className}
      style={style}
    >
      {children}
    </Link>
  );
}

interface DesktopItemProps {
  item: NavItem;
  pathname: string;
  open: boolean;
  warm: boolean;
  height: number;
  onHover: () => void;
  onToggle: (open: boolean) => void;
  onPick: () => void;
  registerTrigger: (el: HTMLElement | null) => void;
  registerPanel: (el: HTMLElement | null) => void;
}

function DesktopItem({
  item,
  pathname,
  open,
  warm,
  height,
  onHover,
  onToggle,
  onPick,
  registerTrigger,
  registerPanel,
}: DesktopItemProps) {
  const submenuId = useId();
  const hover = (e: React.PointerEvent) => e.pointerType === "mouse" && onHover();

  if (item.external) {
    return (
      <li>
        <a
          ref={registerTrigger}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="bar-link"
          onPointerEnter={hover}
        >
          {item.label}
          <span className="bar-out" aria-hidden>
            ↗
          </span>
        </a>
      </li>
    );
  }

  return (
    <li>
      {/* The heading is a link to the whole section. Hovering it, or pressing
          the down arrow, opens the panel of everything inside. */}
      <Link
        ref={registerTrigger}
        href={item.href ?? "#"}
        className="bar-link"
        data-current={isGroupActive(item, pathname) || pathname === item.href}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={submenuId}
        onPointerEnter={hover}
        onClick={onPick}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown" && e.key !== " ") return;
          e.preventDefault();
          onToggle(true);
          const panel = document.getElementById(submenuId);
          // Wait for the panel to become reachable before moving into it.
          window.setTimeout(() => panel?.querySelector<HTMLElement>("a[href]")?.focus(), 60);
        }}
      >
        {item.label}
      </Link>

      {/* Stays in the page so the links are always there to be read; only the
          open one can be seen or reached. */}
      <div id={submenuId} className="fly" data-active={open} inert={!open} style={{ height }}>
        <div ref={registerPanel} className="wrap fly-inner">
          {item.href ? (
            <Link href={item.href} onClick={onPick} className="mlabel fly-item fly-head">
              {item.label}
              <b aria-hidden>→</b>
            </Link>
          ) : (
            <p className="mlabel fly-item">{item.label}</p>
          )}
          {item.menu === "photos" ? (
            <PhotoMenu item={item} pathname={pathname} onPick={onPick} warm={warm} />
          ) : (
            <ListMenu item={item} pathname={pathname} onPick={onPick} />
          )}
        </div>
      </div>
    </li>
  );
}

interface MenuProps {
  item: NavItem;
  pathname: string;
  onPick: () => void;
}

const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

function PhotoMenu({ item, pathname, onPick, warm }: MenuProps & { warm: boolean }) {
  const cards = item.children ?? [];
  return (
    <div className="fly-build">
      <ul className="fly-cards">
        {cards.map((child, i) => (
          <li key={child.href} className="fly-item" style={step(i + 1)}>
            <Link
              href={child.href}
              onClick={onPick}
              aria-current={pathname === child.href ? "page" : undefined}
              className="fly-card"
            >
              <span className="ph">
                {child.image && (
                  <Image
                    src={child.image}
                    alt=""
                    fill
                    sizes="360px"
                    loading={warm ? "eager" : "lazy"}
                    style={{ objectPosition: child.imagePosition }}
                  />
                )}
              </span>
              <span className="t">
                <span>
                  <b>{child.label}</b>
                  {child.description && <small>{child.description}</small>}
                </span>
                <span className="go" aria-hidden>
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="fly-links">
        {item.links?.map((link, i) => (
          <li key={link.href} className="fly-item" style={step(cards.length + 1 + i)}>
            <MenuLink child={link} pathname={pathname} onPick={onPick}>
              {link.label}
              <span aria-hidden>→</span>
            </MenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListMenu({ item, pathname, onPick }: MenuProps) {
  return (
    <ul className="fly-cols">
      {item.children?.map((child, i) => (
        <li key={child.href} className="fly-item" style={step(i + 1)}>
          <MenuLink child={child} pathname={pathname} onPick={onPick}>
            <b>
              {child.label}
              <span aria-hidden>{child.external ? "↗" : "→"}</span>
            </b>
            {child.description && <small>{child.description}</small>}
          </MenuLink>
        </li>
      ))}
    </ul>
  );
}
