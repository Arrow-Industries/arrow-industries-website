/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * Bypasses Row Level Security — use ONLY in trusted server code (server
 * actions / route handlers where we've validated the input ourselves).
 * NEVER import this from a "use client" component, and never expose the
 * service-role key via a NEXT_PUBLIC_* variable.
 *
 * Returns `null` when Supabase isn't configured (e.g. local dev or before
 * the env vars are set in Vercel) so callers can no-op gracefully instead
 * of crashing. Required env:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
