import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cn("container-page", className)}>{children}</Tag>;
}
