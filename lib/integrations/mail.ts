/**
 * Which carrier takes the mail.
 *
 * The website sends through Gmail now. Microsoft Graph is still here and still
 * works, because a cutover you can't reverse without a code change isn't a
 * cutover, it's a leap.
 *
 * Selection is by configuration, not by catching failures. An automatic retry
 * on the other provider sounds like resilience but it cannot tell "the send was
 * rejected" from "the send worked and the response was lost", and the failure
 * mode is a customer receiving the same quote twice.
 *
 *   MAIL_PROVIDER=gmail | graph   (optional — overrides the default)
 *
 * There is one retry, and it is deliberately not that. If Google refuses to let
 * the service account act as a particular mailbox, that fails while acquiring
 * the token — before any message exists — so re-sending as MAIL_FROM cannot
 * deliver twice. See ImpersonationError.
 */

import { gmailConfigured, sendViaGmail, verifyGmail, ImpersonationError } from "@/lib/integrations/gmail";
import { graphConfigured, sendViaGraph, verifyGraph } from "@/lib/integrations/graph";
import type { MailProvider, SendMailOptions } from "@/lib/integrations/mail-types";

/** The provider that would actually carry a message right now, if any. */
export function activeProvider(): MailProvider | null {
  const forced = process.env.MAIL_PROVIDER?.trim().toLowerCase();
  if (forced === "gmail") return gmailConfigured() ? "gmail" : null;
  if (forced === "graph") return graphConfigured() ? "graph" : null;
  if (gmailConfigured()) return "gmail";
  if (graphConfigured()) return "graph";
  return null;
}

/** The mailbox the website sends as by default. */
export const mailFrom = (): string => process.env.MAIL_FROM?.trim() ?? "";

/**
 * Verify the ACTIVE provider's credentials. Sends nothing.
 *
 * On Graph this is the step that fails when the client secret has expired; on
 * Gmail it is the step that fails when the key is malformed or the mailbox
 * isn't one the service account may impersonate.
 */
export async function verifyActive(): Promise<
  { ok: true; provider: MailProvider } | { ok: false; provider: MailProvider | null; error: string }
> {
  const provider = activeProvider();
  if (!provider) {
    return {
      ok: false,
      provider: null,
      error:
        "No mailer configured. Set GOOGLE_SA_JSON (or GOOGLE_SA_CLIENT_EMAIL + GOOGLE_SA_PRIVATE_KEY) and MAIL_FROM for Gmail, or AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET / MAIL_FROM for Graph.",
    };
  }
  try {
    if (provider === "gmail") await verifyGmail(mailFrom());
    else await verifyGraph();
    return { ok: true, provider };
  } catch (err) {
    return { ok: false, provider, error: String(err) };
  }
}

export async function sendMail(opts: SendMailOptions, html: string): Promise<void> {
  const provider = activeProvider();
  if (!provider)
    throw new Error(
      "Mailer not configured (GOOGLE_SA_* + MAIL_FROM, or AZURE_* + MAIL_FROM)",
    );

  if (provider === "graph") return sendViaGraph(opts, html);

  try {
    return await sendViaGmail(opts, html);
  } catch (err) {
    // Only this one case, and only when there is somewhere else to send from.
    // Nothing was transmitted, so this cannot duplicate a message.
    const fallback = mailFrom();
    if (err instanceof ImpersonationError && fallback && err.mailbox !== fallback) {
      console.error(
        `[mailer] Gmail won't impersonate ${err.mailbox} — sending as ${fallback} instead. ` +
          `If ${err.mailbox} is a shared inbox implemented as a Google Group, it can never be a sender; ` +
          `set roadworthy_email_from to a real user or leave it as ${fallback}.`,
      );
      return await sendViaGmail({ ...opts, from: fallback }, html);
    }
    throw err;
  }
}
