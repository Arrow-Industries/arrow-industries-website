"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, Menu, Phone, Search, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { primaryNav, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Only downloaded the first time someone opens it.
const CommandPalette = dynamic(
  () => import("@/components/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Pages with their own toolbar item shouldn't also light up a parent menu.
const topLevelHrefs = new Set(
  primaryNav.filter((i) => !i.children && i.href).map((i) => i.href as string),
);

function isGroupActive(item: NavItem, pathname: string) {
  return (
    item.children?.some(
      (c) => c.href === pathname && !topLevelHrefs.has(c.href),
    ) ?? false
  );
}

const toolbarItem =
  "inline-flex h-8 items-center gap-1 rounded-[0.5rem] px-2.5 text-[0.8125rem] font-medium transition-colors";
const toolbarIdle = "text-bone/75 hover:bg-white/[0.08] hover:text-bone";
const toolbarActive = "bg-white/[0.11] text-bone";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [shortcut, setShortcut] = useState("⌘K");
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("Ctrl K");
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // While the mobile menu is open: lock scroll, move focus into the dialog,
  // and restore focus to the trigger when it closes.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const opener = openerRef.current;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [open]);

  // Escape closes; Tab is trapped within the dialog.
  function onDialogKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const list = Array.from(nodes);
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const mobileRow =
    "flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-[0.9375rem] font-medium text-bone";

  return (
    <>
      <header className="material sticky top-0 z-50 border-b border-line-soft">
        <Container className="flex h-14 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {primaryNav
                .filter((item) => item.href !== "/")
                .map((item) => (
                  <DesktopNavItem key={item.label} item={item} pathname={pathname} />
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the site"
              aria-keyshortcuts="Meta+K Control+K"
              className="icon-btn lg:hidden"
            >
              <Search className="h-[1.125rem] w-[1.125rem]" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-keyshortcuts="Meta+K Control+K"
              className="hidden h-8 items-center gap-2 rounded-[0.5rem] bg-white/[0.07] pl-2.5 pr-1.5 text-[0.8125rem] text-mute shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] transition-colors hover:bg-white/[0.11] hover:text-bone lg:inline-flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden />
              <span>Search</span>
              <span className="kbd" suppressHydrationWarning>
                {shortcut}
              </span>
            </button>
            <div className="hidden xl:block">
              <a
                href={site.phoneHref}
                aria-label={`Call ${site.phone}`}
                className={cn(toolbarItem, toolbarIdle, "whitespace-nowrap")}
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {site.phone}
              </a>
            </div>
            <div className="hidden lg:block">
              <Button href="/request-a-quote" size="sm">
                Request a quote
              </Button>
            </div>

            <button
              ref={openerRef}
              type="button"
              className="icon-btn lg:hidden"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </Container>
      </header>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onKeyDown={onDialogKeyDown}
          className="fixed inset-0 z-[60] flex flex-col bg-ink animate-fade lg:hidden"
        >
          <Container className="flex h-14 shrink-0 items-center justify-between border-b border-line-soft">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              className="icon-btn"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </Container>

          <Container className="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
            <ul className="list-group">
              {primaryNav.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={mobileRow}
                      aria-expanded={openGroup === item.label}
                      onClick={() =>
                        setOpenGroup((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-mute transition-transform duration-200",
                          openGroup === item.label && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openGroup === item.label && (
                      <ul className="border-t border-line-soft bg-white/[0.025] py-1">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="flex min-h-11 items-center px-6 py-2 text-sm text-bone/85"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : item.external ? (
                  <li key={item.label}>
                    <a
                      href={item.href ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className={mobileRow}
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 text-mute" aria-hidden />
                    </a>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href ?? "#"}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={mobileRow}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 text-mute/70" aria-hidden />
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-1 grid grid-cols-2 gap-2 pb-[env(safe-area-inset-bottom)]">
              <Button href={site.phoneHref} size="lg" variant="secondary">
                <Phone className="h-4 w-4 text-accent-text" aria-hidden />
                Call now
              </Button>
              <Button
                href="/request-a-quote"
                size="lg"
                onClick={() => setOpen(false)}
              >
                Request a quote
              </Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}

function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const submenuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLLIElement>(null);

  // A tap or click anywhere else dismisses the menu, as a Mac menu does.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!groupRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!item.children) {
    const active = !item.external && pathname === item.href;
    const className = cn(toolbarItem, active ? toolbarActive : toolbarIdle);
    if (item.external) {
      return (
        <li>
          <a
            href={item.href ?? "#"}
            target="_blank"
            rel="noreferrer"
            className={className}
          >
            {item.label}
          </a>
        </li>
      );
    }
    return (
      <li>
        <Link
          href={item.href ?? "#"}
          className={className}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  const active = isGroupActive(item, pathname);

  return (
    <li
      ref={groupRef}
      className="relative"
      // Hover is for mice only: on a touch screen the tap below does the work.
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      // Close when focus leaves the group entirely (keyboard navigation).
      onBlur={(e) => {
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={cn(toolbarItem, open || active ? toolbarActive : toolbarIdle)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? submenuId : undefined}
        onClick={(e) => {
          // A mouse has already opened it by hovering; don't close it again.
          if (e.detail === 0 || !window.matchMedia("(hover: hover)").matches) {
            setOpen((p) => !p);
          } else {
            setOpen(true);
          }
        }}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3 w-3 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full w-76 pt-2">
          <ul
            id={submenuId}
            className="material popover origin-top-left p-1.5 animate-pop"
          >
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="group block rounded-[0.5rem] px-2.5 py-2 transition-colors hover:bg-accent focus-visible:bg-accent"
                  aria-current={pathname === child.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-[0.8125rem] font-medium text-bone group-hover:text-white group-focus-visible:text-white">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-0.5 block text-xs text-mute group-hover:text-white/85 group-focus-visible:text-white/85">
                      {child.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
