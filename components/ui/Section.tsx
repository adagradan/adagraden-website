import type { ComponentPropsWithoutRef } from "react";

type Tone = "light" | "alt" | "dark";

const tones: Record<Tone, string> = {
  light: "bg-surface text-ink",
  alt: "bg-surface-alt text-ink",
  dark: "on-dark bg-dark text-on-dark",
};

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: Tone;
  /** Vertical rhythm: "default" for most sections, "compact" for bands. */
  spacing?: "default" | "compact";
};

/** Page section with consistent vertical spacing (64 / 96 / 128px). */
export function Section({
  tone = "light",
  spacing = "default",
  className = "",
  ...props
}: SectionProps) {
  const pad =
    spacing === "compact" ? "py-12 md:py-16" : "py-16 md:py-24 lg:py-32";
  return <section className={`${tones[tone]} ${pad} ${className}`} {...props} />;
}
