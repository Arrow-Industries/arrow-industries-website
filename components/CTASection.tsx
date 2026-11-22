import type { ReactNode } from "react";
import { Action } from "@/components/Blocks";
import { site } from "@/data/site";

interface CTASectionProps {
  eyebrow?: string;
  /** A string has its last word set in red; pass JSX to choose the red part. */
  heading: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/** How every page signs off: one line, the next step, and the phone number. */
export function CTASection({
  eyebrow = "Talk to the workshop",
  heading,
  primaryCta = { label: "Request a quote", href: "/request-a-quote" },
  secondaryCta,
}: CTASectionProps) {
  let line: ReactNode = heading;
  if (typeof heading === "string") {
    const words = heading.trim().split(" ");
    const last = words.pop();
    line = (
      <>
        {words.join(" ")} <span className="red">{last}</span>
      </>
    );
  }
  return (
    <section className="cta">
      <div className="wrap">
        <p className="mlabel">{eyebrow}</p>
        <h2>{line}</h2>
        <div className="row">
          <div className="actions">
            <Action href={primaryCta.href}>{primaryCta.label}</Action>
            {secondaryCta && (
              <Action href={secondaryCta.href} tone="line-light" arrow={false}>
                {secondaryCta.label}
              </Action>
            )}
          </div>
          <a className="tel" href={site.phoneHref} aria-label={`Call ${site.phone}`}>
            {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
