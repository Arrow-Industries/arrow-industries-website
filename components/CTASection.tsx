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
    <section className="section pb-14 lg:pb-20">
      <Container>
        <div className="panel px-6 py-12 text-center sm:px-10 lg:py-16">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h2 className="mx-auto max-w-2xl font-display text-[1.75rem] font-semibold leading-[1.1] text-bone sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          {body && (
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-mute sm:text-lg">
              {body}
            </p>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
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
          {footnote && <p className="label mt-6">{footnote}</p>}
        </div>
      </Container>
    </section>
  );
}
