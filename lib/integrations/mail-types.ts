/**
 * The shape of an outgoing email, independent of who carries it.
 *
 * These types were the public contract of lib/mailer.ts when Microsoft Graph
 * was the only sender. They live here now so Gmail and Graph can both speak
 * them without either importing the other, and so the five call sites that
 * already import `SendMailOptions` / `MailAttachment` keep compiling unchanged.
 *
 * Note this differs from the dashboard's copy on purpose: the website's call
 * sites hand us Node `Buffer`s straight off the multipart form, so that is what
 * `MailAttachment` carries. Converting to base64 is each sender's business.
 */

export type MailProvider = "gmail" | "graph";

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendMailOptions {
  /**
   * Mailbox to send AS (defaults to MAIL_FROM).
   *
   * On Graph this had to be a mailbox in the tenant. On Gmail it has to be a
   * real Workspace user the service account may impersonate — a group or a
   * bare alias is refused with `unauthorized_client`. Same rule, different
   * console.
   */
  from?: string;
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export const toList = (list?: string | string[]): string[] =>
  (list ? (Array.isArray(list) ? list : [list]) : [])
    .map((s) => String(s).trim())
    .filter(Boolean);
