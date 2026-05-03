import Image from "next/image";
import { Container } from "@/components/Container";

/**
 * Customer / dealer-partner trust strip.
 *
 * Each entry can be a logo (logo path + name + optional href) or a wordmark
 * (name only). Replace the placeholder entries below with real partners.
 *
 * The list is rendered twice and a CSS animation translates the track to
 * -50% for a seamless infinite loop. Hover pauses the animation. The
 * container masks both edges so logos fade in / out cleanly.
 */
interface Partner {
  name: string;
  /** Path under /public, e.g. /images/partners/acme.svg. Leave undefined for a wordmark. */
  logo?: string;
  /** Optional outbound link. */
  href?: string;
}

const partners: Partner[] = [
  { name: "Partner 1" },
  { name: "Partner 2" },
  { name: "Partner 3" },
  { name: "Partner 4" },
  { name: "Partner 5" },
  { name: "Partner 6" },
  { name: "Partner 7" },
  { name: "Partner 8" },
];

export function TrustedBy() {
  const loopItems = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden bg-ink pt-12 pb-6 lg:pt-16 lg:pb-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(225,6,0,0.08),transparent_60%)]"
      />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
            Customers
          </p>
          <h2 className="mt-3 font-display text-lg font-extrabold leading-[1.15] text-bone sm:text-xl">
            Trusted by operators and dealer networks nationwide
          </h2>
        </div>

        <div
          className="group relative mt-10 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <ul
            className="logo-marquee-track flex w-max items-center gap-14 py-3 group-hover:[animation-play-state:paused] sm:gap-20"
            style={{ animation: "logo-scroll 80s linear infinite" }}
            aria-label="Customers and dealer partners"
          >
            {loopItems.map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                aria-hidden={i >= partners.length ? "true" : undefined}
                className="shrink-0"
              >
                <PartnerMark partner={p} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function PartnerMark({ partner }: { partner: Partner }) {
  const inner = partner.logo ? (
    <Image
      src={partner.logo}
      alt={partner.name}
      width={140}
      height={40}
      className="h-10 w-auto opacity-70 grayscale transition-all duration-300 group-hover:hover:opacity-100 group-hover:hover:grayscale-0"
    />
  ) : (
    <span className="block whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-mute opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:text-sm">
      {partner.name}
    </span>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noreferrer"
        aria-label={partner.name}
        className="flex items-center justify-center"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
