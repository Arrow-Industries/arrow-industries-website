/**
 * Terms and Conditions of Supply — read from the Arrow dashboard.
 *
 * The dashboard's Terms of supply module is the one place the wording lives.
 * It publishes versions to `terms-of-supply.json` in the shared `app-config`
 * Storage bucket; this reads the version in effect today, so the website shows
 * exactly what customers agree to on their quotes. Change the wording there,
 * never here.
 *
 * The parser mirrors the dashboard's (lib/terms-of-supply.ts in that repo) so
 * clause numbers match the quote PDF: `#` clause, `##` subclause, `-` (a),
 * `--` (i), `---` (A), plain line = paragraph, `**bold**`, `{11.2}` pins a
 * number.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { FALLBACK_TERMS } from "@/lib/terms-of-supply-fallback";

export interface PublishedTerms {
  version: number;
  effectiveFrom: string;
  source: string;
}

export type TermsBlock =
  | { kind: "clause"; number: string; heading: string; id: string }
  | { kind: "subclause"; number: string; heading: string; id: string }
  | { kind: "item"; depth: 1 | 2 | 3; label: string; text: string }
  | { kind: "para"; text: string };

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx"];
const letter = (n: number, upper = false) => {
  let s = "";
  let k = n;
  do { s = String.fromCharCode(97 + ((k - 1) % 26)) + s; k = Math.floor((k - 1) / 26); } while (k > 0);
  return upper ? s.toUpperCase() : s;
};

export function parseTerms(source: string): TermsBlock[] {
  const out: TermsBlock[] = [];
  let clause = 0;
  let sub = 0;
  let clauseLabel = "0";
  let a = 0, i = 0, A = 0;
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^##\s+(?:\{([\d.]+)\}\s*)?(.*)$/))) {
      if (m[1]) { const parts = m[1].split("."); sub = Number(parts[parts.length - 1]) || sub + 1; }
      else sub += 1;
      const number = m[1] || `${clauseLabel}.${sub}`;
      out.push({ kind: "subclause", number, heading: m[2].trim(), id: `clause-${number}` });
      a = i = A = 0;
    } else if ((m = line.match(/^#\s+(?:\{(\d+)\}\s*)?(.*)$/))) {
      clause = m[1] ? Number(m[1]) : clause + 1;
      clauseLabel = String(clause);
      sub = 0;
      out.push({ kind: "clause", number: clauseLabel, heading: m[2].trim(), id: `clause-${clauseLabel}` });
      a = i = A = 0;
    } else if ((m = line.match(/^(-{1,3})\s+(.*)$/))) {
      const depth = m[1].length as 1 | 2 | 3;
      let label: string;
      if (depth === 1) { a += 1; i = A = 0; label = `(${letter(a)})`; }
      else if (depth === 2) { i += 1; A = 0; label = `(${ROMAN[i - 1] ?? i})`; }
      else { A += 1; label = `(${letter(A, true)})`; }
      out.push({ kind: "item", depth, label, text: m[2].trim() });
    } else {
      out.push({ kind: "para", text: line });
      a = i = A = 0;
    }
  }
  return out;
}

export function boldRuns(text: string): { text: string; bold: boolean }[] {
  const runs: { text: string; bold: boolean }[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index), bold: false });
    runs.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), bold: false });
  return runs;
}

const todayMelbourne = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });

/** The version in effect today, from the dashboard; the bundled copy if that can't be read. */
export async function getPublishedTerms(): Promise<PublishedTerms> {
  const sb = getSupabaseAdmin();
  if (!sb) return FALLBACK_TERMS;
  try {
    // Read past the Storage CDN, as the roadworthy config does — a plain
    // download() can serve the terms from before the last publish.
    let text: string | null = null;
    const { data: signed } = await sb.storage.from("app-config").createSignedUrl("terms-of-supply.json", 60);
    if (signed?.signedUrl) {
      const res = await fetch(`${signed.signedUrl}&_=${Date.now()}`, { cache: "no-store" });
      if (res.ok) text = await res.text();
      else if (res.status === 404) return FALLBACK_TERMS;
    }
    if (text === null) {
      const { data, error } = await sb.storage.from("app-config").download("terms-of-supply.json");
      if (error || !data) return FALLBACK_TERMS;
      text = await data.text();
    }
    const parsed = JSON.parse(text) as { versions?: Partial<PublishedTerms>[] };
    const versions = (parsed.versions ?? []).filter(
      (v): v is PublishedTerms =>
        typeof v.version === "number" && typeof v.source === "string" && typeof v.effectiveFrom === "string" && v.source.trim().length > 0,
    );
    if (!versions.length) return FALLBACK_TERMS;
    const today = todayMelbourne();
    const live = versions.filter((v) => v.effectiveFrom <= today).sort((x, y) => y.version - x.version);
    return live[0] ?? [...versions].sort((x, y) => x.version - y.version)[0];
  } catch {
    return FALLBACK_TERMS;
  }
}
