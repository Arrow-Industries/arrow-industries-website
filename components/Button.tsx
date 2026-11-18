import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "light";
type Size = "sm" | "md" | "lg";

// The slant matches the ARROW lettering; the label is set back upright inside.
const base =
  "inline-flex -skew-x-[10deg] select-none items-center justify-center whitespace-nowrap font-semibold transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "text-bone shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-white/[0.1]",
  ghost: "text-bone hover:bg-white/[0.1]",
  /** For red backgrounds. */
  dark: "bg-ink text-white hover:bg-black",
  /** For bone and red backgrounds, an outline in the text colour. */
  light: "shadow-[inset_0_0_0_1.5px_currentColor] hover:bg-black/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-base",
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
  const label = (
    <span className="inline-flex skew-x-[10deg] items-center justify-center gap-2">{children}</span>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {label}
      </Link>
    );
  }

  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type ?? "button"} className={classes} {...buttonRest}>
      {label}
    </button>
  );
}
