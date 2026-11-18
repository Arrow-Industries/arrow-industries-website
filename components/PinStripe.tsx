import { cn } from "@/lib/utils";

/** The tapered pinstripe from the side of an Arrow body. */
export function PinStripe({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 34"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-[18px] w-full text-bone sm:h-[26px] lg:h-[34px]", className)}
    >
      <polygon fill="currentColor" points="0,17 1000,0 1000,3.5" />
      <polygon fill="currentColor" opacity="0.8" points="120,17 1000,6.5 1000,10" />
      <polygon fill="#e10600" points="240,17 1000,13 1000,20" />
      <polygon fill="currentColor" opacity="0.8" points="120,17 1000,24 1000,27.5" />
      <polygon fill="currentColor" points="0,17 1000,30.5 1000,34" />
    </svg>
  );
}
