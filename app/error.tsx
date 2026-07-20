"use client";

/**
 * Friendly error boundary — replaces Next's default black "Application
 * error" screen if anything client-side throws (e.g. a form submission the
 * platform rejected). Branded, apologetic, and always offers the phone.
 */

import { useEffect } from "react";
import { RefreshCw, Phone } from "lucide-react";
import { site } from "@/data/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error-boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-text">
          Something went wrong
        </p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-bone">
          Sorry — that didn&rsquo;t go through.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-mute sm:text-base">
          Please try again. If you were sending an enquiry or booking and it
          keeps happening, call us and we&rsquo;ll sort it out on the spot.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 border border-line px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:border-bone"
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call {site.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
