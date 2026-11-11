import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "outline" | "outline-light" | "dark" | "light";

const variants: Record<Variant, { base: string; badge: string }> = {
  // Accent fill — reserved for the main conversion action (Donate).
  primary: {
    base: "bg-accent text-on-accent hover:bg-ink hover:text-on-ink",
    badge: "bg-on-accent text-accent group-hover:bg-accent group-hover:text-on-accent",
  },
  outline: {
    base: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-on-ink",
    badge: "bg-accent text-on-accent",
  },
  "outline-light": {
    base: "border border-on-dark/40 text-on-dark hover:border-on-dark hover:bg-on-dark hover:text-on-accent",
    badge: "bg-accent text-on-accent",
  },
  light: {
    base: "bg-on-dark text-on-accent hover:bg-accent hover:text-on-accent",
    badge: "bg-accent text-on-accent",
  },
  dark: {
    base: "bg-ink text-on-ink hover:bg-ink/85",
    badge: "bg-accent text-on-accent",
  },
};

type ButtonProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  variant?: Variant;
  size?: "md" | "sm";
  /** Show the circular arrow badge (reference style). */
  arrow?: boolean;
  className?: string;
};

/** Pill-shaped link button. Always a link: buttons that navigate are links. */
export function Button({
  variant = "primary",
  size = "md",
  arrow = true,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const v = variants[variant];
  const sizing =
    size === "sm"
      ? "min-h-11 gap-2.5 pl-4 text-meta"
      : "min-h-12 gap-3 pl-6 text-button";
  const rightPad = arrow ? "pr-1.5" : size === "sm" ? "pr-4" : "pr-6";
  return (
    <Link
      className={`group inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-300 ease-out-soft ${sizing} ${rightPad} ${v.base} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {arrow && (
        <span
          className={`grid shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300 ease-out-soft group-hover:rotate-45 ${size === "sm" ? "size-8" : "size-9"} ${v.badge}`}
        >
          <ArrowUpRight className="size-4" />
        </span>
      )}
    </Link>
  );
}
