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
        <div className="mb-5">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          {heading && (
            <h3 className="font-display text-xl font-semibold leading-tight text-bone sm:text-2xl">
              {heading}
            </h3>
          )}
        </div>
      )}

      <dl className="list-group">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-0.5 px-[1.125rem] py-3 sm:grid-cols-[11rem_1fr] sm:gap-5"
          >
            <dt className="text-sm text-mute">{row.label}</dt>
            <dd className="text-sm leading-relaxed text-bone">{row.value}</dd>
          </div>
        ))}
      </dl>

      {footnote && (
        <p className="mt-3 text-xs leading-relaxed text-mute">{footnote}</p>
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
