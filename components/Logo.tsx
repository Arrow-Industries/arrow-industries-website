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
        src="/images/logo-white.png"
        alt={`${site.name} — home`}
        width={56}
        height={56}
        priority
        className="h-12 w-12 sm:h-14 sm:w-14"
      />
    </Link>
  );
}
