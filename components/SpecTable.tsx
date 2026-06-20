import type { ReactNode } from "react";

export interface SpecRow {
  label: string;
  value: ReactNode;
}

interface SpecTableProps {
  /**
   * Optional heading rendered above the table.
   */
  heading?: string;
  /**
   * Optional eyebrow rendered above the heading.
   */
  eyebrow?: string;
  rows: SpecRow[];
  /**
   * Footnote shown under the table. Defaults to the standard Arrow disclaimer.
   */
  footnote?: string;
}

const DEFAULT_FOOTNOTE =
  "Final specifications are confirmed based on chassis, payload, application and compliance requirements.";

export function SpecTable({
  heading,
  eyebrow,
  rows,
  footnote = DEFAULT_FOOTNOTE,
}: SpecTableProps) {
  return (
    <div>
      {(eyebrow || heading) && (
        <div className="mb-8">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-text">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h3 className="font-display text-2xl font-extrabold leading-tight text-bone sm:text-3xl">
              {heading}
            </h3>
          )}
        </div>
      )}

      <div className="overflow-hidden border border-line-soft bg-ink-2">
        <dl className="divide-y divide-line-soft">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6 sm:py-6"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
                {row.label}
              </dt>
              <dd className="text-sm leading-relaxed text-bone sm:text-base">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {footnote && (
        <p className="mt-4 text-xs leading-relaxed text-mute">{footnote}</p>
      )}
    </div>
  );
}

/**
 * Standard Arrow Industries spec rows, ready for product pages.
 * Pass directly to <SpecTable rows={defaultSpecRows} /> or override fields.
 */
export const defaultSpecRows: SpecRow[] = [
  { label: "Application", value: "Matched to payload and application" },
  { label: "Chassis type", value: "Confirmed to chassis" },
  { label: "Material", value: "Custom to build" },
  { label: "Steel grade", value: "Q&T 450 steel where applicable" },
  { label: "Body dimensions", value: "Custom to build" },
  { label: "Capacity / payload", value: "Matched to payload and application" },
  { label: "Hoist / hydraulic setup", value: "Confirmed to chassis and use case" },
  {
    label: "Compliance notes",
    value: "ADR and road regulation requirements considered",
  },
  { label: "Custom options", value: "Custom to build" },
];
