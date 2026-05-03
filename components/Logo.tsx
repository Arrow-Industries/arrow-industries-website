import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={`inline-flex items-center gap-3 ${className ?? ""}`}
    >
      <Image
        src="/images/logo.svg"
        alt=""
        width={36}
        height={36}
        priority
        className="h-9 w-9"
      />
      <span className="font-display text-lg font-extrabold uppercase tracking-[0.18em] text-bone">
        Arrow<span className="text-accent">.</span>
      </span>
    </Link>
  );
}
