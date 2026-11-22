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
        "inline-flex min-h-11 min-w-11 shrink-0 items-center transition-opacity hover:opacity-80",
        className,
      )}
    >
      {/* The arrow mark, cropped from the full logo, beside the wordmark. */}
      <span className="relative block h-[31px] w-[34px] overflow-hidden" aria-hidden>
        <Image
          src="/images/logo-black.png"
          alt=""
          width={112}
          height={112}
          priority
          className="absolute left-[-11px] top-[-4px] h-14 w-14 max-w-none"
        />
      </span>
      <span className="display ml-[11px] text-[1.6875rem] leading-none tracking-[0.02em]" aria-hidden>
        ARROW
      </span>
    </Link>
  );
}
