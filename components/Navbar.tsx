"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { primaryNav, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
      <header className="sticky top-0 z-50 border-b border-line-soft bg-ink/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <DesktopNavItem key={item.label} item={item} />
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-mute transition-colors hover:text-bone"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {site.phone}
          </a>
          <Button href="/request-a-quote" size="md">
            Request a Quote
          </Button>
        </div>

        <button
          ref={openerRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-bone lg:hidden"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        </Container>
      </header>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          onKeyDown={onDialogKeyDown}
          className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-6">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-bone"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-6">
            <a
              href={site.phoneHref}
              className="flex items-center gap-3 rounded-sm border border-line px-4 py-3 text-bone"
            >
              <Phone className="h-5 w-5 text-accent" />
              <span className="font-medium">{site.phone}</span>
            </a>

            <ul className="mt-2 flex flex-col">
              {primaryNav.map((item) =>
                item.children ? (
                  <li key={item.label} className="border-b border-line/60">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-bone"
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
                          "h-4 w-4 transition-transform",
                          openGroup === item.label && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {openGroup === item.label && (
                      <ul className="flex flex-col gap-1 pb-3 pl-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-sm px-3 py-2 text-sm text-mute hover:bg-ink-3 hover:text-bone"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : item.external ? (
                  <li key={item.label} className="border-b border-line/60">
                    <a
                      href={item.href ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="block py-4 text-base font-medium text-bone"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.label} className="border-b border-line/60">
                    <Link
                      href={item.href ?? "#"}
                      onClick={() => setOpen(false)}
                      className="block py-4 text-base font-medium text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-6">
              <Button
                href="/request-a-quote"
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const submenuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!item.children) {
    const className =
      "rounded-sm px-3 py-2 text-sm font-medium text-bone/85 transition-colors hover:text-bone";
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
        <Link href={item.href ?? "#"} className={className}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Close when focus leaves the group entirely (keyboard navigation).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
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
        className="inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-medium text-bone/85 transition-colors hover:text-bone"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={submenuId}
        onClick={() => setOpen((p) => !p)}
        // Open on keyboard focus so the submenu is reachable without a mouse.
        onFocus={() => setOpen(true)}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full w-72 pt-2"
          onMouseEnter={() => setOpen(true)}
        >
          <ul
            id={submenuId}
            className="overflow-hidden rounded-sm border border-line bg-ink-2 shadow-2xl"
          >
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="group block px-4 py-3 transition-colors hover:bg-ink-3"
                  onClick={() => setOpen(false)}
                >
                  <span className="block text-sm font-semibold text-bone group-hover:text-accent-text">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-0.5 block text-xs text-mute">
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
