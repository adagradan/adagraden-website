import type { CSSProperties } from "react";

type SplitTextProps = {
  text: string;
  /** "words" for headings, "chars" for display type like the footer wordmark. */
  by?: "words" | "chars";
  /** Index offset, to continue a stagger across several SplitTexts. */
  offset?: number;
};

/**
 * Wraps each word (or letter) in a mask so it can rise into view.
 * The full string is exposed once as visually-hidden text; the split spans are
 * hidden from assistive tech so screen readers don't read it piece by piece.
 * Animate it with a parent `.load-split` (on page load) or
 * `data-reveal="split"` (on scroll).
 */
export function SplitText({ text, by = "words", offset = 0 }: SplitTextProps) {
  const units = by === "words" ? text.split(" ") : Array.from(text);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {units.map((unit, i) => (
        <span key={i}>
          <span className="split-unit">
            <span style={{ "--i": i + offset } as CSSProperties}>
              {unit === " " ? " " : unit}
            </span>
          </span>
          {by === "words" && i < units.length - 1 ? " " : null}
        </span>
      ))}
      </span>
    </>
  );
}
