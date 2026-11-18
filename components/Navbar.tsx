"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { primaryNav, type NavChild, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Only downloaded the first time someone opens it.
const CommandPalette = dynamic(
  () => import("@/components/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const pathOf = (href: string) => href.split("#")[0];

function isGroupActive(item: NavItem, pathname: string) {
  return [...(item.children ?? []), ...(item.links ?? [])].some(
    (c) => !c.external && pathOf(c.href) === pathname,
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
    <>
      <header className="material sticky top-0 z-50 border-b border-line-soft">
        <Container className="flex h-15 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden h-full lg:block">
            <ul className="flex h-full items-stretch gap-1 xl:gap-3">
              {primaryNav.map((item) => (
                <DesktopNavItem key={item.label} item={item} pathname={pathname} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-3">
            <a
              href={site.phoneHref}
              className="display hidden min-h-11 items-center whitespace-nowrap text-2xl sm:inline-flex lg:hidden xl:inline-flex"
            >
              {site.phone}
            </a>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search the site"
              aria-keyshortcuts="Meta+K Control+K"
              className="icon-btn"
            >
              <Search className="h-[1.125rem] w-[1.125rem]" aria-hidden />
            </button>
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
          <Container className="flex h-15 shrink-0 items-center justify-between border-b border-line-soft">
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

          <Container className="flex-1 overflow-y-auto py-3">
            <ul className="rule-list border-t-0">
              {primaryNav.map((item) => {
                if (item.external) {
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                        className="display flex min-h-16 w-full items-center justify-between gap-3 text-[2.5rem]"
                      >
                        {item.label}
                        <ArrowUpRight className="h-6 w-6 text-mute" aria-hidden />
                      </a>
                    </li>
                  );
                }
                const expanded = openGroup === item.label;
                const links = [...(item.children ?? []), ...(item.links ?? [])];
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className="display flex min-h-16 w-full items-center justify-between gap-3 text-left text-[2.5rem]"
                      aria-expanded={expanded}
                      onClick={() => setOpenGroup(expanded ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-6 w-6 text-mute transition-transform duration-200",
                          expanded && "rotate-180 text-accent-text",
                        )}
                        aria-hidden
                      />
                    </button>
                    {expanded && (
                      <ul className="pb-3">
                        {links.map((child) => (
                          <li key={child.href + child.label}>
                            <MenuLink
                              child={child}
                              onPick={() => setOpen(false)}
                              className="flex min-h-12 items-center justify-between gap-3 py-2 text-[1.0625rem] font-medium text-bone"
                            >
                              {child.label}
                              {child.external ? (
                                <ArrowUpRight className="h-4 w-4 text-mute" aria-hidden />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-mute" aria-hidden />
                              )}
                            </MenuLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </Container>

          <div className="grid shrink-0 grid-cols-2 pb-[env(safe-area-inset-bottom)]">
            <a
              href={site.phoneHref}
              className="display flex h-14.5 items-center justify-center gap-2 bg-ink-3 text-[1.5rem]"
            >
              <Phone className="h-5 w-5 text-accent-text" aria-hidden />
              Call
            </a>
            <Link
              href="/request-a-quote"
              onClick={() => setOpen(false)}
              className="display flex h-14.5 items-center justify-center bg-accent text-[1.5rem] text-white"
            >
              Get a quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function MenuLink({
  child,
  onPick,
  className,
  pathname,
  children,
}: {
  child: NavChild;
  onPick: () => void;
  className?: string;
  pathname?: string;
  children: React.ReactNode;
}) {
  if (child.external) {
    return (
      <a href={child.href} target="_blank" rel="noreferrer" onClick={onPick} className={className}>
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
    >
      {children}
    </Link>
  );
}

function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const submenuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLLIElement>(null);

  // A tap or click anywhere else dismisses the menu.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!groupRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (item.external) {
    return (
      <li className="flex">
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="display inline-flex items-center gap-1 px-2 text-[1.375rem] text-bone/70 transition-colors hover:text-bone"
        >
          {item.label}
          <ArrowUpRight className="h-4 w-4 opacity-70" aria-hidden />
        </a>
      </li>
    );
  }

  const active = isGroupActive(item, pathname);
  const close = () => setOpen(false);

  return (
    <li
      ref={groupRef}
      className="flex"
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
        className={cn(
          "display relative inline-flex items-center gap-1 px-2 text-[1.375rem] transition-colors",
          open || active ? "text-bone" : "text-bone/70 hover:text-bone",
          "after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:bg-accent after:transition-opacity",
          open || active ? "after:opacity-100" : "after:opacity-0",
        )}
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
          className={cn("h-4 w-4 opacity-70 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={submenuId}
          className="absolute inset-x-0 top-full border-b-[3px] border-accent bg-ink shadow-[var(--shadow-float)] animate-pop"
        >
          <Container className="py-7">
            {item.menu === "photos" ? (
              <PhotoMenu item={item} pathname={pathname} onPick={close} />
            ) : (
              <ListMenu item={item} pathname={pathname} onPick={close} />
            )}
          </Container>
        </div>
      )}
    </li>
  );
}

interface MenuProps {
  item: NavItem;
  pathname: string;
  onPick: () => void;
}

function PhotoMenu({ item, pathname, onPick }: MenuProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_17rem] gap-8">
      <ul className="grid grid-cols-3 gap-1.5">
        {item.children?.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={onPick}
              aria-current={pathname === child.href ? "page" : undefined}
              className="group relative block aspect-[16/10] overflow-hidden bg-ink-3"
            >
              {child.image && (
                <Image
                  src={child.image}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-500 ease-[var(--ease-mac)] group-hover:scale-105"
                  style={{ objectPosition: child.imagePosition }}
                />
              )}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(transparent,rgb(10_11_12/0.92))]"
              />
              <span className="absolute inset-x-3.5 bottom-3">
                <span className="display block text-[2rem] text-white">{child.label}</span>
                {child.description && (
                  <span className="mt-1 block text-[0.8125rem] text-white/80">{child.description}</span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="rule-list self-center">
        {item.links?.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onPick}
              className="group flex min-h-13 items-center justify-between gap-3 font-medium text-bone transition-colors hover:text-accent-text"
            >
              {link.label}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListMenu({ item, pathname, onPick }: MenuProps) {
  return (
    <div className="grid grid-cols-[17rem_minmax(0,1fr)] items-start gap-8">
      <p className="display text-[3.25rem]">{item.label}</p>
      <ul className="grid grid-cols-2 gap-x-8 xl:grid-cols-4">
        {item.children?.map((child) => (
          <li key={child.href} className="border-t border-line">
            <MenuLink
              child={child}
              pathname={pathname}
              onPick={onPick}
              className="group flex h-full flex-col gap-1.5 py-3.5"
            >
              <span className="display flex items-center gap-1.5 text-[1.625rem] transition-colors group-hover:text-accent-text">
                {child.label}
                {child.external && <ArrowUpRight className="h-5 w-5 text-mute" aria-hidden />}
              </span>
              {child.description && <span className="text-sm text-mute">{child.description}</span>}
            </MenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
