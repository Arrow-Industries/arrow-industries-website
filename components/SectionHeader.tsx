import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  heading: ReactNode;
  body?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  body,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="font-display text-[1.75rem] font-semibold leading-[1.12] text-bone sm:text-[2rem] lg:text-[2.25rem]">
        {heading}
      </h2>
      {body && (
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute sm:text-base">
          {body}
        </p>
      )}
    </div>
  );
}
