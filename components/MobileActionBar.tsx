import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-ink/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav aria-label="Mobile actions" className="grid grid-cols-2">
        <a
          href={site.phoneHref}
          className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-bone transition-colors hover:text-accent"
        >
          <Phone className="h-4 w-4 text-accent" aria-hidden />
          Call Now
        </a>
        <Link
          href="/request-a-quote"
          className="flex items-center justify-center gap-2 bg-accent px-4 py-4 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover sm:text-sm"
        >
          Request a Quote
        </Link>
      </nav>
    </div>
  );
}
