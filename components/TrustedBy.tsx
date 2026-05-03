import { Container } from "@/components/Container";
import { customers } from "@/data/customers";

/**
 * Customer trust strip — sliding logo marquee.
 *
 * Matches the formatting of PartnerLogos (components section): track is
 * rendered twice for a seamless infinite loop, edges fade out via a
 * mask, hover pauses the animation.
 */
export function TrustedBy() {
  const loopItems = [...customers, ...customers];

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
            className="logo-marquee-track flex w-max items-center gap-12 py-3 group-hover:[animation-play-state:paused] sm:gap-16"
            style={{ animation: "logo-scroll 70s linear infinite" }}
            aria-label="Customers and dealer partners"
          >
            {loopItems.map((c, i) => (
              <li
                key={`${c.name}-${i}`}
                aria-hidden={i >= customers.length ? "true" : undefined}
                className="shrink-0"
              >
                {c.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.logo}
                    alt={c.name}
                    loading="lazy"
                    className="block h-12 w-32 object-contain sm:h-14 sm:w-40"
                  />
                ) : (
                  <span className="block whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mute/60 opacity-90 grayscale transition-all duration-300 hover:text-mute hover:opacity-100 hover:grayscale-0 sm:text-xs">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
