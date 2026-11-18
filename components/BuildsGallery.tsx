"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Link2, Play, X } from "lucide-react";
import { Button } from "@/components/Button";
import type { BuildItem, BuildProduct } from "@/lib/builds";
import { cn } from "@/lib/utils";

interface Filter {
  id: string;
  label: string;
  match: (b: BuildItem) => boolean;
}

const PRODUCTS: [BuildProduct, string][] = [
  ["tipper", "Tipper bodies"],
  ["dog", "Dog trailers"],
  ["semi", "Semi trailers"],
];

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

export function BuildsGallery({ builds }: { builds: BuildItem[] }) {
  const [filterId, setFilterId] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filters = useMemo(() => {
    const list: Filter[] = [{ id: "all", label: "All builds", match: () => true }];
    for (const [product, label] of PRODUCTS) {
      list.push({ id: product, label, match: (b) => b.products.includes(product) });
    }
    const brands = [...new Set(builds.flatMap((b) => (b.brand ? [b.brand] : [])))].sort();
    for (const brand of brands) {
      list.push({ id: brand, label: brand, match: (b) => b.brand === brand });
    }
    list.push({ id: "video", label: "Videos", match: (b) => Boolean(b.video) });
    return list.filter((f) => builds.some(f.match));
  }, [builds]);

  const active = filters.find((f) => f.id === filterId) ?? filters[0];
  const visible = useMemo(() => builds.filter(active.match), [builds, active]);
  const openIndex = visible.findIndex((b) => b.id === openId);

  // A shared link opens straight onto that build.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("build");
    if (id && builds.some((b) => b.id === id)) setOpenId(id);
  }, [builds]);

  // Keeps the address shareable while a build is open.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set("build", openId);
    else url.searchParams.delete("build");
    window.history.replaceState(window.history.state, "", url);
  }, [openId]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter builds"
        className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={f.id === active.id}
            onClick={() => setFilterId(f.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors",
              f.id === active.id
                ? "bg-bone text-ink"
                : "bg-white/[0.08] text-bone/80 hover:bg-white/[0.14] hover:text-bone",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "build" : "builds"}
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-3">
        {visible.map((build, i) => (
          <li
            key={build.id}
            className={cn(i === 0 && visible.length > 4 && "col-span-2 row-span-2")}
          >
            <BuildTile build={build} eager={i < 4} onOpen={() => setOpenId(build.id)} />
          </li>
        ))}
      </ul>

      {/* Rendered on the page body so it always fills the whole screen. */}
      {openIndex >= 0 &&
        createPortal(
          <BuildDialog
            build={visible[openIndex]}
            position={openIndex + 1}
            total={visible.length}
            onClose={() => setOpenId(null)}
            onMove={(step) => {
              const next = (openIndex + step + visible.length) % visible.length;
              setOpenId(visible[next].id);
            }}
          />,
          document.body,
        )}
    </div>
  );
}

function BuildTile({
  build,
  eager,
  onOpen,
}: {
  build: BuildItem;
  eager: boolean;
  onOpen: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);

  function startPreview(e: React.PointerEvent) {
    if (!build.video || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPreviewing(true);
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={startPreview}
      onPointerLeave={() => setPreviewing(false)}
      aria-label={`View ${build.name}`}
      className="group relative block aspect-square h-full w-full overflow-hidden rounded-xl bg-ink-2 text-left"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={build.image}
        alt=""
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.04]"
      />
      {previewing && build.video && (
        <video
          src={build.video}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgb(11_11_13/0.86))]"
      />
      <span className="absolute inset-x-3 bottom-2.5 text-[0.8125rem] font-semibold leading-tight text-white">
        {build.name}
      </span>
      {build.video && (
        <span className="material absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full">
          <Play className="h-3.5 w-3.5 fill-white text-white" aria-hidden />
        </span>
      )}
    </button>
  );
}

function BuildDialog({
  build,
  position,
  total,
  onClose,
  onMove,
}: {
  build: BuildItem;
  position: number;
  total: number;
  onClose: () => void;
  onMove: (step: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${build.name} | Arrow Industries`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // The visitor closed the share sheet, or the browser refused the copy.
    }
  }

  // Own the page while open, and hand focus back to the tile on the way out.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight" && total > 1) {
      onMove(1);
    } else if (e.key === "ArrowLeft" && total > 1) {
      onMove(-1);
    } else if (e.key === "Tab") {
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const arrow =
    "material absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-transform active:scale-95";

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm animate-fade sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={build.name}
        onKeyDown={onKeyDown}
        className="popover relative grid max-h-[calc(100dvh-1rem)] w-full max-w-5xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl bg-ink-2 animate-pop sm:max-h-[calc(100dvh-3rem)] lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,1fr)] lg:grid-rows-1"
      >
        <div
          className="relative aspect-[4/3] bg-black lg:aspect-auto lg:h-[min(38rem,calc(100dvh-3rem))]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null || total < 2) return;
            const moved = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(moved) > 48) onMove(moved < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {build.video ? (
            <video
              key={build.id}
              src={build.video}
              poster={build.image}
              controls
              autoPlay
              muted
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={build.id}
              src={build.image}
              alt={build.title}
              className="h-full w-full object-contain"
            />
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => onMove(-1)}
                aria-label="Previous build"
                className={cn(arrow, "left-2.5")}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                aria-label="Next build"
                className={cn(arrow, "right-2.5")}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </>
          )}
        </div>

        <div className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow pt-2">{build.name}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="icon-btn -mr-1 -mt-1"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <h2 className="mt-1 font-display text-xl font-semibold leading-snug text-bone sm:text-2xl">
            {build.title}
          </h2>
          {build.description && (
            <p className="mt-3 text-sm leading-relaxed text-mute">{build.description}</p>
          )}
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Button href="/request-a-quote" size="lg" className="flex-1">
              Request a quote
            </Button>
            <Button
              href={build.link}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="secondary"
              className="flex-1"
            >
              Instagram
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={share}
              className="inline-flex min-h-11 items-center gap-1.5 text-[0.8125rem] font-medium text-bone/85 transition-colors hover:text-bone"
            >
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
              {copied ? "Link copied" : "Share this build"}
            </button>
            <p className="label" aria-live="polite">
              {position} of {total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
