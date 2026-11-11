import type { CSSProperties, ReactNode } from "react";

export type FAQItem = { question: string; answer: ReactNode };

/**
 * Numbered accordion with consistent dividers. Built on native
 * <details>/<summary> (keyboard + screen-reader support, no client JS);
 * the shared `name` makes it exclusive — one item open at a time.
 */
export function FAQAccordion({
  items,
  name = "faq",
  openFirst = true,
}: {
  items: FAQItem[];
  name?: string;
  /** Start with the first answer open. */
  openFirst?: boolean;
}) {
  return (
    <div className="border-t border-line">
      {items.map((item, i) => (
        <details
          key={item.question}
          name={name}
          open={openFirst && i === 0}
          data-reveal="up"
          style={{ "--i": i } as CSSProperties}
          className="group border-b border-line"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden="true"
              className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-alt text-micro font-semibold transition-colors group-open:bg-accent group-open:text-on-accent"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-meta font-medium sm:text-body">{item.question}</span>
            <span
              aria-hidden="true"
              className="relative size-3 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-ink after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-ink after:transition-transform group-open:after:scale-y-0"
            />
          </summary>
          <div className="pr-8 pb-5 pl-10 text-meta leading-relaxed text-muted">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
