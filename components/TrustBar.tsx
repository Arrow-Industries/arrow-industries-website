import { Check } from "lucide-react";
import { trustBadges } from "@/data/industries";
import { Container } from "@/components/Container";

interface TrustBarProps {
  /**
   * Override the default trust-badge list (sourced from data/industries.ts).
   * Useful when a specific page wants a tailored trust strip (e.g. About).
   */
  items?: readonly string[];
}

export function TrustBar({ items }: TrustBarProps = {}) {
  const badges = items ?? trustBadges;
  return (
    <div className="border-y border-line-soft bg-ink-2/60">
      <Container className="py-3.5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mute sm:gap-x-10">
          {badges.map((b) => (
            <li key={b} className="inline-flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-accent" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
