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
  let slotMins = 90;
  let configApplied = false;
  /** Minute windows the workshop isn't taking bookings in. */
  const blocked: { start: number; end: number }[] = [];
  if (sb) {
    try {
      // Read past the Storage CDN: objects are cached, so a plain download()
      // can serve the config from before staff closed a day or added a break.
      let text: string | null = null;
      const { data: signed } = await sb.storage.from("app-config").createSignedUrl("rwc-config.json", 60);
      if (signed?.signedUrl) {
        const res = await fetch(`${signed.signedUrl}&_=${Date.now()}`, { cache: "no-store" });
        if (res.ok) text = await res.text();
      }
      if (text === null) {
        const { data } = await sb.storage.from("app-config").download("rwc-config.json");
        if (data) text = await data.text();
      }
      if (text !== null) {
        configApplied = true;
        const cfg = JSON.parse(text);
        // Closures (public holidays, shutdown weeks) win outright.
        const onDate = (Array.isArray(cfg?.closures) ? cfg.closures : []).filter(
          (c: { from?: string; to?: string }) => YMD.test(c?.from ?? "") && YMD.test(c?.to ?? "") && c.from! <= date && date <= c.to!,
        );
        // A closure with no times shuts the whole day; with times it just
        // blocks that window.
        const wholeDay = onDate.find((c: { start?: string; end?: string }) => !HHMM.test(c?.start ?? "") || !HHMM.test(c?.end ?? ""));
        if (wholeDay) return { closed: true, closedReason: String(wholeDay.reason ?? "") || undefined, slots: [] };
        for (const c of onDate) blocked.push({ start: toMin(c.start), end: toMin(c.end) });

        // Recurring block-outs (lunch, standing meetings).
        for (const b of Array.isArray(cfg?.breaks) ? cfg.breaks : []) {
          if (!HHMM.test(b?.start ?? "") || !HHMM.test(b?.end ?? "")) continue;
          const days: number[] = Array.isArray(b.days) ? b.days.map(Number) : [];
          if (days.length && !days.includes(isoDay)) continue;
          blocked.push({ start: toMin(b.start), end: toMin(b.end) });
        }

        if (Number(cfg?.durationMins) >= 15) slotMins = Math.round(Number(cfg.durationMins));

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

  // Same-day bookings can't pick slots that have already started (30 min buffer).
  const nowMel = melParts(new Date().toISOString());
  const minStart = nowMel.date === date ? nowMel.minutes + 30 : -1;

  const slots: RwcSlot[] = [];
  for (let m = startMin; m + slotMins <= endMin; m += slotMins) {
    if (m < minStart) continue;
    if (busy.some((b) => b.start < m + slotMins && b.end > m)) continue;
    if (blocked.some((b) => b.start < m + slotMins && b.end > m)) continue;
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
