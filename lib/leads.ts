/**
 * Durable capture of website enquiries into Supabase.
 *
 * These are the source of truth for the future Arrow dashboard. Both helpers
 * are BEST-EFFORT and never throw: if Supabase isn't configured, or a write
 * fails, they log and return so the form submission (and the email alert)
 * still succeeds. Email remains the instant alert; Supabase is the record.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (see
 * lib/supabase/admin.ts). Run lib/supabase/schema.sql in the Arrow project.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { notifyDashboardNewLead, notifyDashboardNewApplication } from "@/lib/notify-dashboard";

export interface LeadRecord {
  source: "quote" | "finance";
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  location?: string;
  enquiryType?: string;
  financeType?: string;
  estimatedAmount?: string;
  timeframe?: string;
  message?: string;
  attachments?: string[];
  /** Everything else, kept verbatim for the dashboard. */
  details?: Record<string, unknown>;
}

export interface ApplicationRecord {
  name: string;
  email?: string;
  mobile?: string;
  suburb?: string;
  role?: string;
  industryExperience?: string;
  yearsExperience?: string;
  workRights?: string;
  availability?: string;
  score?: number;
  category?: string;
  whyHire?: string;
  message?: string;
  resumeNames?: string[];
  details?: Record<string, unknown>;
}

export async function saveLead(lead: LeadRecord): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[leads] Supabase not configured — lead not persisted.");
    return;
  }
  try {
    const { error } = await supabase.from("leads").insert({
      source: lead.source,
      name: lead.name,
      business_name: lead.businessName || null,
      email: lead.email || null,
      phone: lead.phone || null,
      location: lead.location || null,
      enquiry_type: lead.enquiryType || null,
      finance_type: lead.financeType || null,
      estimated_amount: lead.estimatedAmount || null,
      timeframe: lead.timeframe || null,
      message: lead.message || null,
      attachments: lead.attachments ?? [],
      details: lead.details ?? {},
    });
    if (error) {
      console.error("[leads] Insert error:", error.message);
    } else {
      // Best-effort push to the dashboard so staff get notified of new leads.
      await notifyDashboardNewLead({
        source: lead.source,
        name: lead.name,
        businessName: lead.businessName,
        enquiryType: lead.enquiryType,
      });
    }
  } catch (err) {
    console.error("[leads] Insert threw:", err);
  }
}

export async function saveApplication(app: ApplicationRecord): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[leads] Supabase not configured — application not persisted.");
    return;
  }
  try {
    const { error } = await supabase.from("applications").insert({
      name: app.name,
      email: app.email || null,
      mobile: app.mobile || null,
      suburb: app.suburb || null,
      role: app.role || null,
      industry_experience: app.industryExperience || null,
      years_experience: app.yearsExperience || null,
      work_rights: app.workRights || null,
      availability: app.availability || null,
      score: app.score ?? null,
      category: app.category || null,
      why_hire: app.whyHire || null,
      message: app.message || null,
      resume_names: app.resumeNames ?? [],
      details: app.details ?? {},
    });
    if (error) {
      console.error("[leads] Application insert error:", error.message);
    } else {
      await notifyDashboardNewApplication({
        name: app.name,
        role: app.role,
        category: app.category,
        score: app.score,
      });
    }
  } catch (err) {
    console.error("[leads] Application insert threw:", err);
  }
}
