import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Image
        src="/images/logo-white.png"
        alt=""
        width={80}
        height={80}
        priority
        className="h-10 w-10"
      />
    </Link>
  );
}
