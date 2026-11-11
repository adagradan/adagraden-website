import type { CSSProperties } from "react";

/** Labelled bullet list for a programme's verified scope ("Who it serves"…). */
export function ScopeList({
  title,
  items,
  i = 0,
  tone = "light",
}: {
  title: string;
  items: string[];
  i?: number;
  tone?: "light" | "dark";
}) {
  return (
    <div data-reveal="up" style={{ "--i": i } as CSSProperties}>
      <h3
        className={`text-micro font-semibold tracking-[0.08em] uppercase ${tone === "dark" ? "text-on-dark-muted" : "text-muted"}`}
      >
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-meta leading-relaxed">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent text-on-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
