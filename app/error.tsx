"use client";

/**
 * Friendly error boundary — replaces Next's default black "Application
 * error" screen if anything client-side throws (e.g. a form submission the
 * platform rejected). Branded, apologetic, and always offers the phone.
 */

import { useEffect } from "react";
import { RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/Button";
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
        <p className="eyebrow">
          Something went wrong
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-bone">
          Sorry — that didn&rsquo;t go through.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-mute sm:text-base">
          Please try again. If you were sending an enquiry or booking and it
          keeps happening, call us and we&rsquo;ll sort it out on the spot.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} size="lg">
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
          <Button href={site.phoneHref} size="lg" variant="secondary">
            <Phone className="h-4 w-4" aria-hidden />
            Call {site.phone}
          </Button>
        </div>
      </div>
    </div>
  );
}
