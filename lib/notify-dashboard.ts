/**
 * Best-effort push trigger: tell the Arrow dashboard a new enquiry landed so
 * subscribed staff get an OS notification (even with the app closed). Posts to
 * the dashboard's /api/push/notify with the shared PUSH_NOTIFY_SECRET.
 *
 * No-ops if env isn't set; never throws or blocks the form submission for long
 * (4s timeout).
 */
export async function notifyDashboardNewLead(input: {
  source: string;
  name: string;
  businessName?: string | null;
  enquiryType?: string | null;
}): Promise<void> {
  const url = process.env.DASHBOARD_PUSH_URL;
  const secret = process.env.PUSH_NOTIFY_SECRET;
  if (!url || !secret) return;

  const isFinance = input.source === "finance";
  const title = `${isFinance ? "New finance enquiry" : "New quote request"} — ${input.name}`;
  const body = [input.businessName, input.enquiryType].filter(Boolean).join(" · ") || undefined;

  await postNotify({ title, body, url: "/leads" });
}

export async function notifyDashboardNewApplication(input: {
  name: string;
  role?: string | null;
  category?: string | null;
  score?: number | null;
}): Promise<void> {
  const body =
    [input.role, input.category, input.score != null ? `score ${input.score}` : null]
      .filter(Boolean)
      .join(" · ") || undefined;
  await postNotify({
    title: `New job application — ${input.name}`,
    body,
    url: "/applications",
  });
}

/** Shared best-effort POST to the dashboard push endpoint (4s timeout). */
async function postNotify(payload: { title: string; body?: string; url: string }): Promise<void> {
  const url = process.env.DASHBOARD_PUSH_URL;
  const secret = process.env.PUSH_NOTIFY_SECRET;
  if (!url || !secret) return;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-push-secret": secret },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    /* best effort */
  } finally {
    clearTimeout(t);
  }
}
