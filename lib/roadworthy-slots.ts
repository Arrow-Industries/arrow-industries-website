"use server";

/**
 * Live slot availability for the roadworthy booking form — for a chosen date,
 * returns the workshop's hourly slots (from the shared rwc-config hours) that
 * aren't already taken by confirmed bookings on the schedule. Best-effort: if
 * Supabase isn't reachable, every slot within hours is offered and staff sort
 * out clashes at approval time.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RwcSlot {
  /** 24h "HH:MM" — stored as the preferred time. */
  value: string;
  /** "9:00 am" — shown in the picker. */
  label: string;
}

const MEL = "Australia/Melbourne";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Melbourne-local calendar date + minutes-since-midnight for a UTC ISO stamp. */
function melParts(iso: string): { date: string; minutes: number } {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: MEL, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: MEL, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return { date, minutes: toMin(time) };
}

export async function getRwcSlots(date: string): Promise<RwcSlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const sb = getSupabaseAdmin();

  let dayStart = "06:00";
  let dayEnd = "16:00";
  if (sb) {
    try {
      const { data } = await sb.storage.from("app-config").download("rwc-config.json");
      if (data) {
        const cfg = JSON.parse(await data.text());
        if (typeof cfg?.dayStart === "string" && /^\d{2}:\d{2}$/.test(cfg.dayStart)) dayStart = cfg.dayStart;
        if (typeof cfg?.dayEnd === "string" && /^\d{2}:\d{2}$/.test(cfg.dayEnd)) dayEnd = cfg.dayEnd;
      }
    } catch {
      /* defaults */
    }
  }
  const startMin = toMin(dayStart);
  const endMin = Math.max(startMin + 60, toMin(dayEnd));

  // Confirmed bookings on that Melbourne date (fetch a generous UTC window,
  // then filter by local date).
  const busy: { start: number; end: number }[] = [];
  if (sb) {
    try {
      const windowStart = new Date(`${date}T00:00:00+08:00`);
      const { data } = await sb
        .from("rwc_bookings")
        .select("scheduled_at,duration_mins,status")
        .in("status", ["confirmed", "completed"])
        .gte("scheduled_at", windowStart.toISOString())
        .lt("scheduled_at", new Date(windowStart.getTime() + 48 * 3600e3).toISOString());
      for (const r of data ?? []) {
        if (!r.scheduled_at) continue;
        const p = melParts(r.scheduled_at as string);
        if (p.date !== date) continue;
        busy.push({ start: p.minutes, end: p.minutes + ((r.duration_mins as number) || 60) });
      }
    } catch (err) {
      console.error("[roadworthy-slots] lookup failed (offering all slots):", err);
    }
  }

  const slots: RwcSlot[] = [];
  for (let m = startMin; m + 60 <= endMin; m += 60) {
    if (busy.some((b) => b.start < m + 60 && b.end > m)) continue;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    const h12 = ((h + 11) % 12) + 1;
    slots.push({
      value: `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`,
      label: `${h12}:${String(mm).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`,
    });
  }
  return slots;
}
