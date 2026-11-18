import type { Feature } from "@/data/features";

interface FeatureSectionProps {
  features: Feature[];
}

export function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <ul className="list-group">
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <li key={f.title} className="list-row gap-4 py-4">
            <span aria-hidden className="icon-tile">
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-bone">
                {f.title}
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-mute">
                {f.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
