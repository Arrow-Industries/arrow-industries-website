"use server";

/**
 * Compatibility shim — the Monday.com webhook integration has been replaced
 * with email-based delivery via Resend. The new server action lives in
 * `lib/email.ts`. This re-export keeps any older import paths working.
 */
export { submitQuoteForm } from "@/lib/email";
