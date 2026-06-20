/**
 * Upload lead/enquiry attachments to Supabase Storage so they're viewable in
 * the Arrow dashboard (not just emailed). Best-effort: if Storage isn't
 * configured or an upload fails, returns whatever uploaded (caller falls back
 * to filenames). Files still get emailed via Resend regardless.
 *
 * Bucket `lead-attachments` is PRIVATE — the dashboard serves files through
 * short-lived signed URLs generated server-side with the service-role key.
 */

import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "lead-attachments";

interface AttachmentBuffer {
  filename: string;
  content: Buffer;
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
};

/** Slugify a filename to a storage-safe form, preserving the extension. */
function safeName(name: string): string {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
  return ext ? `${base}.${ext}` : base;
}

/**
 * Uploads each attachment and returns the stored object paths (which include
 * "/", so the dashboard can tell them apart from legacy plain filenames).
 * Returns [] if Storage isn't configured or all uploads fail.
 */
export async function uploadLeadAttachments(
  attachments: AttachmentBuffer[],
  source: string,
): Promise<string[]> {
  if (!attachments.length) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("[lead-attachments] Supabase not configured — files emailed only.");
    return [];
  }

  const now = new Date();
  const prefix = `${source}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const paths: string[] = [];

  for (const att of attachments) {
    const ext = att.filename.split(".").pop()?.toLowerCase() ?? "";
    const path = `${prefix}/${randomUUID().slice(0, 8)}-${safeName(att.filename)}`;
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(path, att.content, {
        contentType: MIME_BY_EXT[ext] ?? "application/octet-stream",
        upsert: false,
      });
      if (error) {
        console.error("[lead-attachments] upload error:", error.message);
        continue;
      }
      paths.push(path);
    } catch (err) {
      console.error("[lead-attachments] upload threw:", err);
    }
  }
  return paths;
}
