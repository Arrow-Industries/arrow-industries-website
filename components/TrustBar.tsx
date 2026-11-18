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
    <Container>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] font-medium text-mute sm:gap-x-8">
        {badges.map((b) => (
          <li key={b} className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} aria-hidden />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
