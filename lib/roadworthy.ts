/**
 * Roadworthy booking options — reads the config the dashboard maintains in
 * the shared app-config bucket (rwc-config.json) so vehicle types, prices,
 * per-day hours, closures and lead time stay in sync without a redeploy.
 * Falls back to a static list when Supabase isn't configured.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RwcVehicleType {
  label: string;
  desc: string;
}

export interface RwcClosureRange {
  from: string; // yyyy-mm-dd inclusive
  to: string;
  reason: string;
}

export interface RwcBookingOptions {
  /** Vehicle-type picker, grouped Trucks / Trailers (dashboard-editable). */
  truckTypes: RwcVehicleType[];
  trailerTypes: RwcVehicleType[];
  /** Inspection price by axle count ("2"…"6") — THE price driver. */
  axlePrices: Record<string, number>;
  /** Flat price per Heavy Vehicle Defect Clearance Certificate. */
  defectPrice: number;
  /** Show prices to customers on the booking form. */
  showPrices: boolean;
  /** Flat inspection duration in minutes. */
  durationMins: number;
  /** Minimum days ahead a booking can be requested. */
  leadDays: number;
  /** ISO weekdays taking bookings (1 = Mon … 7 = Sun). */
  days: number[];
  /** Per-weekday hours ("HH:MM"), null = closed — mirrors the dashboard. */
  hoursByDay: Record<string, { start: string; end: string } | null>;
  /** Blocked dates — public holidays, shutdown weeks. */
  closures: RwcClosureRange[];
}

const FALLBACK: RwcBookingOptions = {
  truckTypes: [
    { label: "Prime Mover", desc: "4x2, 6x4, 8x4 prime movers" },
    { label: "Rigid Truck", desc: "Tray, curtainsider, pantech, tautliner" },
    { label: "Tipper", desc: "Single axle, bogie drive, truck & dog combinations" },
    { label: "Concrete Agitator", desc: "Mixer trucks" },
    { label: "Crane Truck", desc: "Vehicle-mounted cranes" },
    { label: "Service Truck", desc: "Mine/service bodies" },
    { label: "Hooklift Truck", desc: "Hooklift bodies" },
    { label: "Skip Loader", desc: "Skip bin loaders" },
    { label: "Water Cart", desc: "Water tankers" },
    { label: "Vacuum Truck", desc: "Vacuum excavation units" },
    { label: "Fuel Tanker", desc: "Dangerous goods tankers (vehicle inspection only)" },
    { label: "Refrigerated Truck", desc: "Refrigerated bodies" },
    { label: "Livestock Truck", desc: "Stock crates" },
    { label: "Bus", desc: "Light and heavy buses" },
    { label: "Coach", desc: "Long-distance coaches" },
    { label: "Motorhome", desc: "Heavy motorhomes over 4.5T" },
  ],
  trailerTypes: [
    { label: "Semi Trailer", desc: "Standard semis" },
    { label: "B-Double Lead Trailer", desc: "Front trailer" },
    { label: "B-Double Rear Trailer", desc: "Rear trailer" },
    { label: "Dog Trailer", desc: "Full dog trailers" },
    { label: "Pig Trailer", desc: "Single axle group forward of centre" },
    { label: "Dolly", desc: "Converter dollies" },
    { label: "Low Loader", desc: "Low loaders and wideners" },
    { label: "Drop Deck Trailer", desc: "Step deck trailers" },
    { label: "Flat Top Trailer", desc: "Flatbed trailers" },
    { label: "Tipper Trailer", desc: "End and side tippers" },
    { label: "Tanker Trailer", desc: "Fuel, water, milk, etc." },
    { label: "Refrigerated Trailer", desc: "Reefer trailers" },
    { label: "Livestock Trailer", desc: "Stock trailers" },
    { label: "Skeletal Trailer", desc: "Container skeletal trailers" },
    { label: "Curtain Sider Trailer", desc: "Curtainsiders" },
    { label: "Road Train Trailer", desc: "A/B/C trailers (where applicable)" },
  ],
  axlePrices: { "2": 300, "3": 350, "4": 400, "5": 450, "6": 500 },
  defectPrice: 250,
  showPrices: false,
  durationMins: 90,
  leadDays: 1,
  days: [1, 2, 3, 4, 5],
  hoursByDay: {
    "1": { start: "06:00", end: "16:00" },
    "2": { start: "06:00", end: "16:00" },
    "3": { start: "06:00", end: "16:00" },
    "4": { start: "06:00", end: "16:00" },
    "5": { start: "06:00", end: "16:00" },
    "6": null,
    "7": null,
  },
  closures: [],
};

const YMD = /^\d{4}-\d{2}-\d{2}$/;

export async function getRwcBookingOptions(): Promise<RwcBookingOptions> {
  const sb = getSupabaseAdmin();
  if (!sb) return FALLBACK;
  try {
    const { data, error } = await sb.storage.from("app-config").download("rwc-config.json");
    if (error || !data) return FALLBACK;
    const cfg = JSON.parse(await data.text());
    const showPrices = !!cfg?.showPricesOnWebsite;

    const cleanTypes = (list: unknown, fallback: RwcVehicleType[]): RwcVehicleType[] => {
      if (!Array.isArray(list)) return fallback;
      const cleaned = list
        .filter((t: { label?: unknown }) => typeof t?.label === "string" && t.label)
        .map((t: { label: string; desc?: string }) => ({ label: t.label, desc: String(t.desc ?? "") }));
      return cleaned.length ? cleaned : fallback;
    };

    const axlePrices: Record<string, number> = { ...FALLBACK.axlePrices };
    if (cfg?.axlePrices && typeof cfg.axlePrices === "object") {
      for (const k of Object.keys(FALLBACK.axlePrices)) {
        const v = Number(cfg.axlePrices[k]);
        if (Number.isFinite(v) && v >= 0) axlePrices[k] = v;
      }
    }

    // Per-day hours (new shape) or legacy days[] — either way, the open days.
    const HHMM = /^\d{2}:\d{2}$/;
    let days: number[];
    let hoursByDay: Record<string, { start: string; end: string } | null>;
    if (cfg?.hours && typeof cfg.hours === "object") {
      hoursByDay = {};
      for (const d of [1, 2, 3, 4, 5, 6, 7]) {
        const h = cfg.hours[String(d)];
        hoursByDay[String(d)] = h && HHMM.test(h.start ?? "") && HHMM.test(h.end ?? "") ? { start: h.start, end: h.end } : null;
      }
      days = [1, 2, 3, 4, 5, 6, 7].filter((d) => !!hoursByDay[String(d)]);
    } else {
      days = Array.isArray(cfg?.days) && cfg.days.length ? cfg.days.map(Number).filter((d: number) => d >= 1 && d <= 7) : FALLBACK.days;
      const start = HHMM.test(cfg?.dayStart ?? "") ? cfg.dayStart : "06:00";
      const end = HHMM.test(cfg?.dayEnd ?? "") ? cfg.dayEnd : "16:00";
      hoursByDay = {};
      for (const d of [1, 2, 3, 4, 5, 6, 7]) hoursByDay[String(d)] = days.includes(d) ? { start, end } : null;
    }
    if (!days.length) days = FALLBACK.days;

    const closures: RwcClosureRange[] = (Array.isArray(cfg?.closures) ? cfg.closures : [])
      .filter((c: { from?: string; to?: string }) => YMD.test(c?.from ?? "") && YMD.test(c?.to ?? ""))
      .map((c: { from: string; to: string; reason?: string }) => ({ from: c.from, to: c.to, reason: String(c.reason ?? "") }));

    return {
      truckTypes: cleanTypes(cfg?.truckTypes, FALLBACK.truckTypes),
      trailerTypes: cleanTypes(cfg?.trailerTypes, FALLBACK.trailerTypes),
      axlePrices,
      defectPrice: Number(cfg?.defectPrice) >= 0 ? Math.round(Number(cfg.defectPrice)) : FALLBACK.defectPrice,
      showPrices,
      durationMins: Number(cfg?.durationMins) >= 15 ? Math.round(Number(cfg.durationMins)) : FALLBACK.durationMins,
      leadDays: Number.isFinite(Number(cfg?.leadDays)) ? Math.max(0, Number(cfg.leadDays)) : FALLBACK.leadDays,
      days,
      hoursByDay,
      closures,
    };
  } catch {
    return FALLBACK;
  }
}
