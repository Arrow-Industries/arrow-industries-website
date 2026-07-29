/**
 * One place for the attachment limits, because the real constraint is not
 * obvious and every form had guessed differently.
 *
 * The binding limit is **Vercel**, not the mail provider. A Vercel Function
 * rejects any request body over **4.5 MB** with `413 FUNCTION_PAYLOAD_TOO_LARGE`
 * — at the platform edge, before a single line of our code runs. Nothing in the
 * app can raise it: `next.config.ts` sets `serverActions.bodySizeLimit: "30mb"`,
 * and that has no effect on the platform cap.
 *
 * This bit us in production. The forms advertised "Max 10MB per file" and the
 * server allowed 25 MB combined, so a customer attaching a few phone photos got
 * "Sorry — that didn't go through", with **no lead recorded anywhere** and
 * nothing in the logs but a bare 413. The booking form had already worked this
 * out and quietly capped itself at 3.5 MB; the quote, finance and careers forms
 * had not, and none of the three checked the COMBINED size at all — only each
 * file individually, so two 3 MB files sailed past the check and then failed.
 *
 * So the numbers below are deliberately below 4.5 MB, leaving room for the text
 * fields and multipart boundaries that share the request.
 *
 * If bigger uploads are ever needed, lifting these is the wrong move — the fix
 * is to upload straight from the browser to Supabase Storage and email links
 * instead of attachments, which sidesteps the function body entirely.
 */

/** Largest single file we accept, after any browser-side compression. */
export const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB

/** Largest combined payload. Under Vercel's 4.5 MB with room for form fields. */
export const MAX_TOTAL_BYTES = 3_500_000; // ~3.5 MB

/** Images above this get downscaled in the browser before upload. */
export const SHRINK_ABOVE = 500 * 1024;

/** Human-readable size, e.g. "1.4 MB" / "820 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Shown wherever a form explains its attachment limit. */
export const LIMIT_HINT = `Up to ${formatBytes(MAX_TOTAL_BYTES)} in total — photos are automatically shrunk before upload.`;

/**
 * Downscale an image in the browser (max 1600px, JPEG 80%) so phone camera
 * shots upload reliably. Anything that isn't an image, or that the browser
 * can't decode, comes back untouched — never throws.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8),
    );
    // Compression occasionally makes a small image bigger — keep the original.
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

export interface PreparedFiles {
  /** Files that fit, compressed where that helped. */
  accepted: File[];
  /** Null when everything fit; otherwise a message to show the customer. */
  error: string | null;
}

/**
 * Compress what can be compressed, then admit files while they still fit
 * within the combined budget. Rejects are reported by name rather than
 * silently dropped, and the message says what to do about it.
 *
 * `existing` is what the form is already holding, so the budget covers the
 * whole selection rather than each drop of new files.
 */
export async function prepareFiles(
  existing: File[],
  incoming: File[],
): Promise<PreparedFiles> {
  let total = existing.reduce((n, f) => n + f.size, 0);
  const accepted: File[] = [];
  const rejected: string[] = [];

  for (const file of incoming) {
    const ready = file.size > SHRINK_ABOVE ? await shrinkImage(file) : file;
    if (ready.size > MAX_FILE_BYTES || total + ready.size > MAX_TOTAL_BYTES) {
      rejected.push(file.name);
      continue;
    }
    total += ready.size;
    accepted.push(ready);
  }

  return {
    accepted,
    error: rejected.length
      ? `${rejected.join(", ")} couldn't be attached — there's a ${formatBytes(MAX_TOTAL_BYTES)} limit in total. Try fewer or smaller files, or email them to sales@arrowindustries.com.au.`
      : null,
  };
}
