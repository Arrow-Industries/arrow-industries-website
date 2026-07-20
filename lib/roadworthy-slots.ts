"use server";

/**
 * Live slot availability for the roadworthy booking form — for a chosen date,
 * returns the workshop's hourly slots (from that weekday's configured hours)
 * that aren't already taken by confirmed bookings. Closed days (weekly hours
 * or a closure like a public holiday) return closed: true. Best-effort: if
 * Supabase isn't reachable, default hours are offered and staff sort out
 * clashes at approval time.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface RwcSlot {
  /** 24h "HH:MM" — stored as the preferred time. */
  value: string;
  /** "9:00 am" — shown in the picker. */
  label: string;
}

export interface RwcSlotResult {
  closed: boolean;
  /** Why the day is closed, when a closure gives a reason. */
  closedReason?: string;
  slots: RwcSlot[];
}

const MEL = "Australia/Melbourne";
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{2}:\d{2}$/;

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

export async function getRwcSlots(date: string): Promise<RwcSlotResult> {
  if (!YMD.test(date)) return { closed: false, slots: [] };
  const sb = getSupabaseAdmin();
  const isoDay = ((new Date(date + "T12:00:00").getDay() + 6) % 7) + 1;

  let dayStart = "06:00";
  let dayEnd = "16:00";
  let configApplied = false;
  if (sb) {
    try {
      const { data } = await sb.storage.from("app-config").download("rwc-config.json");
      if (data) {
        configApplied = true;
        const cfg = JSON.parse(await data.text());
        // Closures (public holidays, shutdown weeks) win outright.
        const closure = (Array.isArray(cfg?.closures) ? cfg.closures : []).find(
          (c: { from?: string; to?: string }) => YMD.test(c?.from ?? "") && YMD.test(c?.to ?? "") && c.from! <= date && date <= c.to!,
        );
        if (closure) return { closed: true, closedReason: String(closure.reason ?? "") || undefined, slots: [] };

        if (cfg?.hours && typeof cfg.hours === "object") {
          const h = cfg.hours[String(isoDay)];
          if (!h || !HHMM.test(h.start ?? "") || !HHMM.test(h.end ?? "")) return { closed: true, slots: [] };
          dayStart = h.start;
          dayEnd = h.end;
        } else {
          // Legacy global fields.
          const days: number[] = Array.isArray(cfg?.days) && cfg.days.length ? cfg.days.map(Number) : [1, 2, 3, 4, 5];
          if (!days.includes(isoDay)) return { closed: true, slots: [] };
          if (HHMM.test(cfg?.dayStart ?? "")) dayStart = cfg.dayStart;
          if (HHMM.test(cfg?.dayEnd ?? "")) dayEnd = cfg.dayEnd;
        }
      }
    } catch {
      /* defaults */
    }
  }
  // No config reachable — default schedule is Mon–Fri.
  if (!configApplied && ![1, 2, 3, 4, 5].includes(isoDay)) return { closed: true, slots: [] };
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
  return { closed: false, slots };
}
