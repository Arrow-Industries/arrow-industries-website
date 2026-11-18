"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  CornerDownLeft,
  CreditCard,
  FileText,
  Home,
  Images,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { flags } from "@/data/flags";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

interface Command {
  label: string;
  hint?: string;
  href: string;
  icon: LucideIcon;
  group: "Actions" | "Products & services" | "Company";
  keywords?: string;
}

const COMMANDS: Command[] = [
  {
    group: "Actions",
    label: "Request a quote",
    href: "/request-a-quote",
    icon: ClipboardList,
    keywords: "price enquiry build order new",
  },
  {
    group: "Actions",
    label: "Configure your build",
    href: "/configure",
    icon: SlidersHorizontal,
    keywords: "customise custom spec colour options design tipper dog semi",
  },
  {
    group: "Actions",
    label: flags.roadworthyAvailable
      ? "Book a roadworthy inspection"
      : "Roadworthy inspections",
    href: flags.roadworthyAvailable
      ? "/licensed-vehicle-testing#book"
      : "/licensed-vehicle-testing",
    icon: CalendarCheck,
    keywords: "rwc lvt certificate vicroads test booking defect clearance",
  },
  {
    group: "Actions",
    label: "Call the workshop",
    hint: site.phone,
    href: site.phoneHref,
    icon: Phone,
    keywords: "phone ring talk speak",
  },
  {
    group: "Actions",
    label: "Email the team",
    hint: site.email,
    href: site.emailHref,
    icon: Mail,
    keywords: "message contact",
  },
  {
    group: "Actions",
    label: "Get directions",
    hint: site.address.suburb,
    href: site.address.mapsHref,
    icon: MapPin,
    keywords: "map address location workshop campbellfield lara way",
  },
  {
    group: "Actions",
    label: "Shop parts & components",
    href: site.shop.parts,
    icon: ShoppingBag,
    keywords: "store buy spare",
  },
  ...services
    .filter((s) => !s.external)
    .map<Command>((s) => ({
      group: "Products & services",
      label: s.title,
      href: s.href,
      icon: s.icon,
      keywords: `${s.tagline} ${s.description}`,
    })),
  {
    group: "Products & services",
    label: "Finance",
    href: "/finance",
    icon: BadgeDollarSign,
    keywords: "loan lease linx repayment chattel mortgage",
  },
  { group: "Company", label: "Home", href: "/", icon: Home },
  {
    group: "Company",
    label: "About Arrow",
    href: "/about",
    icon: Users,
    keywords: "story history team",
  },
  {
    group: "Company",
    label: "Builds",
    href: "/builds",
    icon: Images,
    keywords: "photos builds instagram work",
  },
  {
    group: "Company",
    label: "Careers",
    href: "/careers",
    icon: BriefcaseBusiness,
    keywords: "job apply work welder employment hiring",
  },
  {
    group: "Company",
    label: "Contact",
    href: "/contact",
    icon: MessageSquare,
    keywords: "hours opening address",
  },
  {
    group: "Company",
    label: "Apply for a credit account",
    href: "/credit",
    icon: CreditCard,
    keywords: "trade account terms",
  },
  ...(flags.warrantyPublished
    ? [{ group: "Company" as const, label: "Warranty", href: "/warranty", icon: ShieldCheck }]
    : []),
  {
    group: "Company",
    label: "Terms & Conditions",
    href: "/terms-conditions",
    icon: FileText,
    keywords: "legal supply",
  },
];

function matches(command: Command, query: string) {
  const haystack =
    `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/**
 * Spotlight for the site: ⌘K (or Ctrl K) from anywhere, type a few letters,
 * press return. Built as a combobox — focus stays in the search field and the
 * arrow keys move the highlighted result.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(
    () => COMMANDS.filter((c) => matches(c, query)),
    [query],
  );

  // Own the page while open, and hand focus back on the way out.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  function run(command: Command) {
    onClose();
    const { href } = command;
    if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      window.location.href = href;
    } else if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (href === "/credit") {
      // Served by the dashboard through a rewrite, so it needs a full load.
      window.location.assign(href);
    } else {
      router.push(href);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const count = results.length;
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // The search field is the only stop inside this dialog.
      e.preventDefault();
    } else if (e.key === "ArrowDown" && count > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % count);
    } else if (e.key === "ArrowUp" && count > 0) {
      e.preventDefault();
      setActive((i) => (i - 1 + count) % count);
    } else if (e.key === "Enter" && ordered[active]) {
      e.preventDefault();
      run(ordered[active]);
    }
  }

  const groups = (["Actions", "Products & services", "Company"] as const)
    .map((group) => ({
      group,
      items: results.filter((r) => r.group === group),
    }))
    .filter((g) => g.items.length > 0);

  // Results render grouped, so highlight is tracked against the flat order.
  const ordered = groups.flatMap((g) => g.items);
  const optionId = (i: number) => `${listId}-${i}`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/55 px-3 pt-[max(1rem,12vh)] animate-fade"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        onKeyDown={onKeyDown}
        className="material popover flex max-h-[min(32rem,76dvh)] w-full max-w-xl flex-col overflow-hidden rounded-2xl animate-pop"
      >
        <div className="flex items-center gap-3 border-b border-line-soft px-4">
          <Search className="h-[1.125rem] w-[1.125rem] shrink-0 text-mute" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={ordered[active] ? optionId(active) : undefined}
            aria-label="Search pages and actions"
            placeholder="Search Arrow Industries"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-13 w-full bg-transparent text-[1.0625rem] text-bone placeholder:text-mute/80 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="kbd shrink-0 px-1.5"
            aria-label="Close search"
          >
            esc
          </button>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5"
        >
          {groups.map(({ group, items }) => (
            <div key={group} role="group" aria-label={group} className="pb-1">
              <p aria-hidden className="label px-2.5 pb-1 pt-2">
                {group}
              </p>
              {items.map((item) => {
                const index = ordered.indexOf(item);
                const selected = index === active;
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    id={optionId(index)}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActive(index)}
                    onClick={() => run(item)}
                    className={cn(
                      "flex h-10 items-center gap-3 px-2.5 text-sm",
                      selected ? "bg-accent text-white" : "text-bone",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        selected ? "text-white" : "text-mute",
                      )}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="truncate font-medium">{item.label}</span>
                    {item.hint && (
                      <span
                        className={cn(
                          "ml-auto hidden truncate text-[0.8125rem] sm:block",
                          selected ? "text-white/85" : "text-mute",
                        )}
                      >
                        {item.hint}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {results.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-mute">
              Nothing found for &ldquo;{query}&rdquo;. Call us on{" "}
              <a href={site.phoneHref} className="link">
                {site.phone}
              </a>
              .
            </p>
          )}
        </div>

        <div
          aria-hidden
          className="hidden items-center gap-4 border-t border-line-soft px-4 py-2 text-xs text-mute sm:flex"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
            Move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="kbd">
              <CornerDownLeft className="h-3 w-3" />
            </span>
            Open
          </span>
        </div>
      </div>
    </div>
  );
}
