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
  /** Null when the dashboard hasn't enabled public prices. */
  price: number | null;
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
  /** Minimum days ahead a booking can be requested. */
  leadDays: number;
  /** ISO weekdays taking bookings (1 = Mon … 7 = Sun). */
  days: number[];
  /** Blocked dates — public holidays, shutdown weeks. */
  closures: RwcClosureRange[];
}

const FALLBACK: RwcBookingOptions = {
  truckTypes: [
    { label: "Prime Mover", desc: "4x2, 6x4, 8x4 prime movers", price: null },
    { label: "Rigid Truck", desc: "Tray, curtainsider, pantech, tautliner", price: null },
    { label: "Tipper", desc: "Single axle, bogie drive, truck & dog combinations", price: null },
    { label: "Concrete Agitator", desc: "Mixer trucks", price: null },
    { label: "Crane Truck", desc: "Vehicle-mounted cranes", price: null },
    { label: "Service Truck", desc: "Mine/service bodies", price: null },
    { label: "Hooklift Truck", desc: "Hooklift bodies", price: null },
    { label: "Skip Loader", desc: "Skip bin loaders", price: null },
    { label: "Water Cart", desc: "Water tankers", price: null },
    { label: "Vacuum Truck", desc: "Vacuum excavation units", price: null },
    { label: "Fuel Tanker", desc: "Dangerous goods tankers (vehicle inspection only)", price: null },
    { label: "Refrigerated Truck", desc: "Refrigerated bodies", price: null },
    { label: "Livestock Truck", desc: "Stock crates", price: null },
    { label: "Bus", desc: "Light and heavy buses", price: null },
    { label: "Coach", desc: "Long-distance coaches", price: null },
    { label: "Motorhome", desc: "Heavy motorhomes over 4.5T", price: null },
  ],
  trailerTypes: [
    { label: "Semi Trailer", desc: "Standard semis", price: null },
    { label: "B-Double Lead Trailer", desc: "Front trailer", price: null },
    { label: "B-Double Rear Trailer", desc: "Rear trailer", price: null },
    { label: "Dog Trailer", desc: "Full dog trailers", price: null },
    { label: "Pig Trailer", desc: "Single axle group forward of centre", price: null },
    { label: "Dolly", desc: "Converter dollies", price: null },
    { label: "Low Loader", desc: "Low loaders and wideners", price: null },
    { label: "Drop Deck Trailer", desc: "Step deck trailers", price: null },
    { label: "Flat Top Trailer", desc: "Flatbed trailers", price: null },
    { label: "Tipper Trailer", desc: "End and side tippers", price: null },
    { label: "Tanker Trailer", desc: "Fuel, water, milk, etc.", price: null },
    { label: "Refrigerated Trailer", desc: "Reefer trailers", price: null },
    { label: "Livestock Trailer", desc: "Stock trailers", price: null },
    { label: "Skeletal Trailer", desc: "Container skeletal trailers", price: null },
    { label: "Curtain Sider Trailer", desc: "Curtainsiders", price: null },
    { label: "Road Train Trailer", desc: "A/B/C trailers (where applicable)", price: null },
  ],
  leadDays: 1,
  days: [1, 2, 3, 4, 5],
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
        .map((t: { label: string; desc?: string; price?: number }) => ({
          label: t.label,
          desc: String(t.desc ?? ""),
          price: showPrices && Number(t.price) > 0 ? Number(t.price) : null,
        }));
      return cleaned.length ? cleaned : fallback;
    };

    // Per-day hours (new shape) or legacy days[] — either way, the open days.
    let days: number[];
    if (cfg?.hours && typeof cfg.hours === "object") {
      days = [1, 2, 3, 4, 5, 6, 7].filter((d) => {
        const h = cfg.hours[String(d)];
        return h && typeof h.start === "string" && typeof h.end === "string";
      });
    } else {
      days = Array.isArray(cfg?.days) && cfg.days.length ? cfg.days.map(Number).filter((d: number) => d >= 1 && d <= 7) : FALLBACK.days;
    }
    if (!days.length) days = FALLBACK.days;

    const closures: RwcClosureRange[] = (Array.isArray(cfg?.closures) ? cfg.closures : [])
      .filter((c: { from?: string; to?: string }) => YMD.test(c?.from ?? "") && YMD.test(c?.to ?? ""))
      .map((c: { from: string; to: string; reason?: string }) => ({ from: c.from, to: c.to, reason: String(c.reason ?? "") }));

    return {
      truckTypes: cleanTypes(cfg?.truckTypes, FALLBACK.truckTypes),
      trailerTypes: cleanTypes(cfg?.trailerTypes, FALLBACK.trailerTypes),
      leadDays: Number.isFinite(Number(cfg?.leadDays)) ? Math.max(0, Number(cfg.leadDays)) : FALLBACK.leadDays,
      days,
      closures,
    };
  } catch {
    return FALLBACK;
  }
}
