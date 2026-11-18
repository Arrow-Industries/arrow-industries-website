import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Build options for the website configurator, read from the Arrow dashboard.
 *
 * The dashboard's quote builder is the one place these are edited (Settings,
 * Quote builder). Its file also holds costs, sell prices, margins, suppliers
 * and parts lists, so everything here is copied field by field: anything not
 * named below never reaches a customer's browser.
 */

export interface BuildOption {
  id: string;
  name: string;
  swatch?: string;
  custom?: boolean;
  forTypes?: string[];
  showWhenSelected?: string[];
  autoFor?: string[];
  excludes?: string[];
}

export interface BuildGroup {
  id: string;
  name: string;
  multi: boolean;
  role: string;
  /** Decided automatically by the build, so never shown as a choice. */
  hidden: boolean;
  appliesTo: string[];
  section: string;
  options: BuildOption[];
}

export interface BuildCategory {
  id: string;
  name: string;
  types: { id: string; name: string }[];
}

export interface BuildConfig {
  categories: BuildCategory[];
  groups: BuildGroup[];
  sections: { id: string; title: string }[];
}

// The same sections, in the same order, as the customer's quote document.
const SECTIONS = [
  { id: "body", title: "Body & dimensions" },
  { id: "features", title: "Body features" },
  { id: "hydraulics", title: "Hoist & hydraulics" },
  { id: "towing", title: "Towing & trailer connections" },
  { id: "running_gear", title: "Running gear" },
  { id: "electrical", title: "Electrical & controls" },
  { id: "electrical_optional", title: "Electrical optionals" },
  { id: "tarp", title: "Tarp system" },
  { id: "paint", title: "Paint & finish" },
  { id: "safety", title: "Safety & compliance" },
  { id: "other", title: "Additional specifications" },
];

// First match wins, mirroring sectionForGroup in the dashboard.
const SECTION_RULES: [RegExp, string][] = [
  [/\btarp\b/i, "tarp"],
  [/paint|colour|color|finish/i, "paint"],
  [/hoist|pto|pump|hydraulic|ram/i, "hydraulics"],
  [/tow|drawbar|coupling|rear extension|cross member/i, "towing"],
  [/electric|light|control|switch|camera|ebs|wiring/i, "electrical"],
  [/engineer|vass|compliance|mudflap|alarm|e-?stop|safety/i, "safety"],
  [/length|width|height|thickness|material|subframe|dimension/i, "body"],
  [/feature|step|guard|toolbox|ladder|tank|holder|lock/i, "features"],
];

const ROLE_ORDER: Record<string, number> = { base: 0, core: 1, inclusion: 2, addon: 3 };

type Raw = Record<string, unknown>;
const text = (v: unknown) => (typeof v === "string" ? v : "");
const ids = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x !== "") : [];
const list = (v: unknown) => (Array.isArray(v) ? (v as Raw[]) : []);

function sectionFor(group: Raw) {
  const own = text(group.section);
  if (SECTIONS.some((s) => s.id === own)) return own;
  return SECTION_RULES.find(([rule]) => rule.test(text(group.name)))?.[1] ?? "other";
}

function toOption(o: Raw): BuildOption {
  return {
    id: text(o.id),
    name: text(o.name),
    swatch: text(o.swatch) || undefined,
    custom: o.custom === true || undefined,
    forTypes: ids(o.forTypes),
    showWhenSelected: ids(o.showWhenSelected),
    autoFor: ids(o.autoFor),
    excludes: ids(o.excludes),
  };
}

export function toBuildConfig(raw: Raw): BuildConfig {
  const groups = list(raw.optionGroups)
    .map<BuildGroup>((g) => {
      const scope = ids(g.appliesTo);
      return {
        id: text(g.id),
        name: text(g.name),
        multi: g.multi === true,
        role: text(g.role) || "addon",
        hidden: g.hidden === true,
        appliesTo: scope.length ? scope : text(g.categoryId) ? [text(g.categoryId)] : [],
        section: sectionFor(g),
        options: list(g.options).map(toOption),
      };
    })
    .sort((a, b) => (ROLE_ORDER[a.role] ?? 3) - (ROLE_ORDER[b.role] ?? 3));

  return {
    categories: list(raw.categories).map((c) => ({
      id: text(c.id),
      name: text(c.name),
      types: list(c.types).map((t) => ({ id: text(t.id), name: text(t.name) })),
    })),
    groups,
    sections: SECTIONS.filter((s) => groups.some((g) => g.section === s.id)),
  };
}

/** Null when the dashboard's options can't be read right now. */
export async function getBuildConfig(): Promise<BuildConfig | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb.storage.from("app-config").download("quote-configurator.json");
    if (error || !data) return null;
    const config = toBuildConfig(JSON.parse(await data.text()) as Raw);
    return config.categories.length > 0 ? config : null;
  } catch (err) {
    console.error("[build-options] read failed", err);
    return null;
  }
}
