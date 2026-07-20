/**
 * Roadworthy booking options — reads the price list the dashboard maintains
 * in the shared app-config bucket (rwc-config.json) so inspection types,
 * lead time and prices stay in sync without a redeploy. Falls back to a
 * static list when Supabase isn't configured.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RwcOption {
  key: string;
  label: string;
  /** Null when the dashboard hasn't enabled public prices. */
  price: number | null;
  durationMins: number;
}

export interface RwcVehicleType {
  label: string;
  desc: string;
}

export interface RwcBookingOptions {
  options: RwcOption[];
  /** Vehicle-type picker, grouped Trucks / Trailers (dashboard-editable). */
  truckTypes: RwcVehicleType[];
  trailerTypes: RwcVehicleType[];
  /** Minimum days ahead a booking can be requested. */
  leadDays: number;
  /** ISO weekdays taking bookings (1 = Mon … 7 = Sun). */
  days: number[];
}

const FALLBACK: RwcBookingOptions = {
  options: [
    { key: "truck", label: "Truck / prime mover RWC", price: null, durationMins: 60 },
    { key: "tipper", label: "Tipper truck RWC", price: null, durationMins: 60 },
    { key: "dog-trailer", label: "Dog trailer RWC", price: null, durationMins: 60 },
    { key: "semi-trailer", label: "Semi trailer RWC", price: null, durationMins: 60 },
    { key: "combination", label: "Truck & trailer combination", price: null, durationMins: 120 },
  ],
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
  leadDays: 1,
  days: [1, 2, 3, 4, 5],
};

export async function getRwcBookingOptions(): Promise<RwcBookingOptions> {
  const sb = getSupabaseAdmin();
  if (!sb) return FALLBACK;
  try {
    const { data, error } = await sb.storage.from("app-config").download("rwc-config.json");
    if (error || !data) return FALLBACK;
    const cfg = JSON.parse(await data.text());
    const showPrices = !!cfg?.showPricesOnWebsite;
    const items = Array.isArray(cfg?.items) ? cfg.items : [];
    const options: RwcOption[] = items
      .filter((i: { label?: unknown }) => typeof i?.label === "string" && i.label)
      .map((i: { key?: string; label: string; price?: number; durationMins?: number }) => ({
        key: i.key || i.label,
        label: i.label,
        price: showPrices && Number(i.price) > 0 ? Number(i.price) : null,
        durationMins: Number(i.durationMins) || 60,
      }));
    const cleanTypes = (list: unknown, fallback: RwcVehicleType[]): RwcVehicleType[] => {
      if (!Array.isArray(list)) return fallback;
      const cleaned = list
        .filter((t: { label?: unknown }) => typeof t?.label === "string" && t.label)
        .map((t: { label: string; desc?: string }) => ({ label: t.label, desc: String(t.desc ?? "") }));
      return cleaned.length ? cleaned : fallback;
    };
    return {
      options: options.length ? options : FALLBACK.options,
      truckTypes: cleanTypes(cfg?.truckTypes, FALLBACK.truckTypes),
      trailerTypes: cleanTypes(cfg?.trailerTypes, FALLBACK.trailerTypes),
      leadDays: Number.isFinite(Number(cfg?.leadDays)) ? Math.max(0, Number(cfg.leadDays)) : FALLBACK.leadDays,
      days: Array.isArray(cfg?.days) && cfg.days.length ? cfg.days.map(Number).filter((d: number) => d >= 1 && d <= 7) : FALLBACK.days,
    };
  } catch {
    return FALLBACK;
  }
}
