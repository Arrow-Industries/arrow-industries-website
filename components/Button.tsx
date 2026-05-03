import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white border border-accent hover:bg-accent-hover hover:border-accent-hover shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]",
  secondary:
    "bg-transparent text-bone border border-bone/25 hover:border-bone/60 hover:bg-bone/5",
  ghost: "bg-transparent text-bone hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type LinkProps = BaseProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseProps | "href"
  >;

type ButtonElProps = BaseProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseProps
  >;

export type ButtonProps = LinkProps | ButtonElProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type ?? "button"} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
