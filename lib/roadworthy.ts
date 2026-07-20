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

export interface RwcBookingOptions {
  options: RwcOption[];
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
    return {
      options: options.length ? options : FALLBACK.options,
      leadDays: Number.isFinite(Number(cfg?.leadDays)) ? Math.max(0, Number(cfg.leadDays)) : FALLBACK.leadDays,
      days: Array.isArray(cfg?.days) && cfg.days.length ? cfg.days.map(Number).filter((d: number) => d >= 1 && d <= 7) : FALLBACK.days,
    };
  } catch {
    return FALLBACK;
  }
}
