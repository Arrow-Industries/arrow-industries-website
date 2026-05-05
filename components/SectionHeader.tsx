import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  heading: string;
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
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent",
            align === "center" && "justify-center",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-extrabold leading-[1.08] text-bone sm:text-4xl lg:text-[2.75rem]">
        {heading}
      </h2>
      {body && (
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
          {body}
        </p>
      )}
    </div>
  );
}
