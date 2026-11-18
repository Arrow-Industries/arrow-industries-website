import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

/** The bar along the bottom of phones and tablets: call, or ask for a quote. */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Mobile actions"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a
        href={site.phoneHref}
        className="display flex h-14.5 items-center justify-center gap-2 border-t border-line text-[1.5rem] text-bone"
      >
        <Phone className="h-5 w-5 text-accent-text" aria-hidden />
        Call
      </a>
      <Link
        href="/request-a-quote"
        className="display flex h-14.5 items-center justify-center bg-accent text-[1.5rem] text-white"
      >
        Get a quote
      </Link>
    </nav>
  );
}
