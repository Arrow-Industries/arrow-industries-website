import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

/** Call, or ask for a quote: the same pair wherever it appears on a phone. */
export function DockActions({ onPick }: { onPick?: () => void }) {
  return (
    <div className="dock">
      <a href={site.phoneHref} className="dock-call" onClick={onPick}>
        <Phone aria-hidden />
        Call
      </a>
      <Link href="/request-a-quote" className="dock-quote" onClick={onPick}>
        Get a quote
      </Link>
    </div>
  );
}

/** The bar that floats at the bottom of phones and tablets. */
export function MobileActionBar() {
  return (
    <nav aria-label="Mobile actions" className="dock-fixed">
      <DockActions />
    </nav>
  );
}
