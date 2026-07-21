/**
 * ABR ABN Lookup — validate a customer's ABN against the Australian Business
 * Register (returns the registered entity name + GST status). Uses ABR_GUID
 * (free registration at abr.business.gov.au/Tools/WebServices). Best-effort:
 * returns null / configured:false when unset so the form still works.
 */

const ABR_BASE = "https://abr.business.gov.au/json";

export interface AbnDetails {
  abn: string;
  entityName: string | null;
  status: string | null;
  gstRegistered: boolean | null;
}

export const abrConfigured = (): boolean => !!process.env.ABR_GUID?.trim();

/** ATO modulus-89 ABN checksum. */
export function isValidAbn(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 11) return false;
  const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  return w.reduce((a, x, i) => a + x * (Number(d[i]) - (i === 0 ? 1 : 0)), 0) % 89 === 0;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

function stripJsonp(text: string): string {
  const a = text.indexOf("("), b = text.lastIndexOf(")");
  return a !== -1 && b > a ? text.slice(a + 1, b) : text;
}

export async function getAbnDetails(abn: string): Promise<AbnDetails | null> {
  const guid = process.env.ABR_GUID?.trim();
  const clean = abn.replace(/\D/g, "");
  if (!guid || !/^\d{11}$/.test(clean)) return null;
  try {
    const res = await fetch(`${ABR_BASE}/AbnDetails.aspx?abn=${clean}&callback=callback&guid=${encodeURIComponent(guid)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = JSON.parse(stripJsonp(await res.text())) as Record<string, unknown>;
    if (str(json.Abn) == null) return null;
    return {
      abn: str(json.Abn) ?? clean,
      entityName: str(json.EntityName),
      status: str(json.AbnStatus),
      gstRegistered: json.Gst !== undefined ? !!str(json.Gst) : null,
    };
  } catch {
    return null;
  }
}
