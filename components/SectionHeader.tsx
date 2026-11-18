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
    <div className={cn("max-w-5xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="display-md">{heading}</h2>
      {body && <p className="mt-4 max-w-2xl text-lg leading-snug text-mute">{body}</p>}
    </div>
  );
}
