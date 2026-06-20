/**
 * Runtime-configurable enquiry email routing.
 *
 * Recipients are managed from the Arrow dashboard's Settings page and stored as
 * a JSON object in the private `app-config` Storage bucket. This reads an
 * override for a given key, falling back to the env-derived default when no
 * override is set (or Storage is unavailable). Best-effort + short-cached so a
 * form submission never blocks on it.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "app-config";
const OBJECT = "email-routing.json";
const TTL_MS = 5_000;

let cache: { at: number; data: Record<string, string> } | null = null;

async function loadRouting(): Promise<Record<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  const sb = getSupabaseAdmin();
  if (!sb) return {};
  try {
    const { data, error } = await sb.storage.from(BUCKET).download(OBJECT);
    if (error || !data) return {};
    const parsed = JSON.parse(await data.text());
    const obj = parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
    cache = { at: Date.now(), data: obj };
    return obj;
  } catch {
    return {};
  }
}

/** Resolve a routing key (e.g. "quote_email_to"), falling back to `fallback`. */
export async function getEmailSetting(key: string, fallback: string): Promise<string> {
  const routing = await loadRouting();
  const v = typeof routing[key] === "string" ? routing[key].trim() : "";
  return v || fallback;
}
