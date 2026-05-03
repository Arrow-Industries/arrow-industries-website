import type { Feature } from "@/data/features";

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <ul className="divide-y divide-line-soft">
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <li key={f.title} className="flex gap-6 py-7 first:pt-0 last:pb-0">
            <span
              aria-hidden
              className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent/10 text-accent"
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-bone">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute sm:text-base">
                {f.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
