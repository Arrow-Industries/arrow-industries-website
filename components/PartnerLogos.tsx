import Image from "next/image";
import { partners } from "@/data/partners";

/**
 * Compact, premium partner logo strip.
 *
 * The list is rendered twice and a CSS animation translates the track to -50%,
 * giving a seamless infinite loop without JavaScript. Hover pauses the
 * animation. The container masks both edges so logos fade in / out cleanly.
 */
export function PartnerLogos() {
  const loopItems = [...partners, ...partners];

  return (
    <div
      className="marquee-mask group relative overflow-hidden"
    >
      <ul
        className="logo-marquee-track flex w-max items-center gap-12 py-3 group-hover:[animation-play-state:paused] sm:gap-16"
        style={{ animation: "logo-scroll 70s linear infinite" }}
        aria-label="Components we trust"
      >
        {loopItems.map((p, i) => (
          <li
            key={`${p.name}-${i}`}
            aria-hidden={i >= partners.length ? "true" : undefined}
            className="shrink-0"
          >
            {p.logo ? (
              <Image
                src={p.logo}
                alt={p.name}
                width={160}
                height={56}
                loading="lazy"
                className="block h-12 w-32 object-contain sm:h-14 sm:w-40"
              />
            ) : (
              <span className="block whitespace-nowrap label/60 opacity-90 grayscale transition-all duration-300 hover:text-mute hover:opacity-100 hover:grayscale-0 sm:text-xs">
                {p.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
