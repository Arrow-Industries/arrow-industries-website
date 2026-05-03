"use client";

import Image from "next/image";
import { useState } from "react";
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
} from "@/data/gallery";
import { cn } from "@/lib/utils";

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory>("All");

  const filtered =
    active === "All"
      ? galleryItems
      : galleryItems.filter((i) => i.category === active);

  return (
    <div>
      <div role="tablist" aria-label="Filter gallery" className="flex flex-wrap gap-2">
        {galleryCategories.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                isActive
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-ink-2 text-mute hover:border-bone hover:text-bone",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="group relative overflow-hidden border border-line bg-ink-2"
          >
            <div className={cn("relative w-full", aspectClass[item.aspect])}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="inline-block border border-accent bg-accent/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">
                {item.category}
              </span>
              <h3 className="mt-2 text-base font-bold text-bone">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-mute">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-mute">
          No builds in this category yet.
        </p>
      )}
    </div>
  );
}
