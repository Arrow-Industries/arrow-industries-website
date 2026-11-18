import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { PinStripe } from "@/components/PinStripe";
import { site } from "@/data/site";

interface CTASectionProps {
  eyebrow?: string;
  heading: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/** How every page signs off: one line, the phone number, and the next step. */
export function CTASection({
  eyebrow,
  heading,
  primaryCta = { label: "Request a quote", href: "/request-a-quote" },
  secondaryCta,
}: CTASectionProps) {
  return (
    <section>
      <PinStripe />
      <div className="bg-accent py-12 text-white lg:py-20">
        <Container>
          {eyebrow && (
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em]">{eyebrow}</p>
          )}
          <h2 className="display-md mt-3 max-w-5xl">{heading}</h2>
          <a
            href={site.phoneHref}
            aria-label={`Call ${site.phone}`}
            className="display mt-6 block whitespace-nowrap text-[17.6vw] leading-[0.9] lg:mt-9 lg:text-[min(16vw,17rem)]"
          >
            {site.phone}
          </a>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-white/50 pt-6 lg:mt-10">
            <p className="font-medium">
              {site.address.line1}, {site.address.suburb} {site.address.state}{" "}
              {site.address.postcode}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button href={primaryCta.href} size="lg" variant="dark">
                {primaryCta.label}
              </Button>
              {secondaryCta && (
                <Button href={secondaryCta.href} size="lg" variant="light">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
