import type { CSSProperties, ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/** "/ Eyebrow /" label + medium-weight Title Case heading + optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  id,
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  const muted = tone === "dark" ? "text-on-dark-muted" : "text-muted";
  return (
    <div className={`flex flex-col gap-3 ${centered ? "mx-auto items-center text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className="text-meta font-medium" data-reveal="fade">
          <span aria-hidden="true">/ </span>
          {eyebrow}
          <span aria-hidden="true"> /</span>
        </p>
      )}
      <Heading
        id={id}
        className={`max-w-[24ch] text-section font-medium text-balance ${centered ? "mx-auto" : ""}`}
        data-reveal={typeof title === "string" ? "split" : "up"}
        style={{ "--d": "120ms" } as CSSProperties}
      >
        {typeof title === "string" ? <SplitText text={title} /> : title}
      </Heading>
      {intro && (
        <p
          className={`mt-1 max-w-[58ch] text-body text-pretty ${muted}`}
          data-reveal="up"
          style={{ "--i": 3 } as CSSProperties}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
