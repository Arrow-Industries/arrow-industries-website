import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

/** The floating dock on phones and tablets: call, or ask for a quote. */
export function MobileActionBar() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 px-3 lg:hidden"
      style={{ bottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <nav
        aria-label="Mobile actions"
        className="material popover pointer-events-auto mx-auto grid max-w-md grid-cols-2 gap-1.5 rounded-2xl p-1.5"
      >
        <a
          href={site.phoneHref}
          className="flex h-11 items-center justify-center gap-2 rounded-[0.75rem] bg-white/[0.08] text-sm font-medium text-bone transition-transform active:scale-[0.98]"
        >
          <Phone className="h-4 w-4 text-accent-text" aria-hidden />
          Call now
        </a>
        <Link
          href="/request-a-quote"
          className="flex h-11 items-center justify-center rounded-[0.75rem] bg-[linear-gradient(180deg,#e7100a,#d90500)] text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] transition-transform active:scale-[0.98]"
        >
          Request a quote
        </Link>
      </nav>
    </div>
  );
}
