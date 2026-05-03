import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

interface CTASectionProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  phoneCta?: { label: string; href: string };
  footnote?: string;
}

export function CTASection({
  eyebrow,
  heading,
  body,
  primaryCta = { label: "Request a Quote", href: "/request-a-quote" },
  secondaryCta,
  phoneCta,
  footnote,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.16),transparent_55%)]"
      />
      <Container className="relative pt-24 pb-32 lg:pt-32 lg:pb-44">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl font-extrabold leading-[1.05] text-bone sm:text-4xl lg:text-[3.25rem]">
            {heading}
          </h2>
          {body && (
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              {body}
            </p>
          )}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            <Button href={primaryCta.href} size="lg">
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button href={secondaryCta.href} size="lg" variant="secondary">
                {secondaryCta.label}
              </Button>
            )}
            {phoneCta && (
              <Button href={phoneCta.href} size="lg" variant="secondary">
                {phoneCta.label}
              </Button>
            )}
          </div>
          {footnote && (
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-mute">
              {footnote}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
