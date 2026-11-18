import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { media } from "@/data/media";
import { site } from "@/data/site";
import type { BuildItem } from "@/lib/builds";
import { cn } from "@/lib/utils";

const TILES = 8;

// Tops the wall up if Instagram can't be reached or has few photos to show.
const FALLBACK = [
  media.tipperGraphite,
  media.scania,
  media.dogSide,
  media.sitrak,
  media.mercedes,
  media.dogWhite,
  media.tipperRear,
  media.truckAndDog,
];

const tile =
  "group relative block aspect-square h-full w-full overflow-hidden bg-ink-3";
const photo =
  "h-full w-full object-cover transition-transform duration-1000 ease-[var(--ease-mac)] group-hover:scale-105";

/** Recent work, edge to edge, ending with a way to follow along. */
export function BuildWall({ builds }: { builds: BuildItem[] }) {
  const live = builds.slice(0, TILES);
  const extras = FALLBACK.slice(0, TILES - live.length);

  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4">
      {live.map((b, i) => (
        <li key={b.id} className={cn(i === 0 && "col-span-2 row-span-2")}>
          <Link href={`/builds?build=${b.id}`} aria-label={`View ${b.name}`} className={tile}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image} alt="" loading="lazy" className={photo} />
          </Link>
        </li>
      ))}
      {extras.map((p, i) => (
        <li key={p.src} className={cn(live.length === 0 && i === 0 && "col-span-2 row-span-2")}>
          <Link href="/builds" aria-label={`View builds: ${p.alt}`} className={tile}>
            <Image
              src={p.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={photo}
            />
          </Link>
        </li>
      ))}
      <li>
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-square h-full w-full flex-col justify-between bg-accent p-4 text-white transition-colors hover:bg-accent-hover"
        >
          <Instagram className="h-7 w-7" aria-hidden />
          <span>
            <span className="display block text-[clamp(2rem,3.2vw,3.25rem)]">Follow the build</span>
            <span className="mt-1.5 block text-[0.8125rem] font-medium [overflow-wrap:anywhere]">
              @arrow_industries_co
            </span>
          </span>
        </a>
      </li>
    </ul>
  );
}
