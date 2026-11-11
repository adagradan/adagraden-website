import type { CSSProperties } from "react";
import type { Milestone } from "@/lib/constitution";

/**
 * Milestone timeline for dark sections. Desktop: a horizontal rail that draws
 * itself, with nodes popping in along it. Mobile: a vertical rail.
 * Upcoming milestones use a hollow node.
 */
export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <div className="relative">
      {/* Rails */}
      <span
        aria-hidden="true"
        data-reveal="line"
        className="absolute top-[0.4375rem] right-0 left-0 hidden h-px bg-line-dark lg:block"
      />
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-line-dark lg:hidden" />

      <ol className="grid gap-10 lg:grid-cols-3 lg:gap-8">
        {items.map((m, i) => (
          <li
            key={m.title}
            data-reveal="up"
            style={{ "--i": i + 1 } as CSSProperties}
            className="relative pl-10 lg:pt-12 lg:pl-0"
          >
            <span
              aria-hidden="true"
              className={`absolute top-0 left-0 size-3.5 rounded-full ${
                m.upcoming ? "border-2 border-accent bg-dark" : "bg-accent ring-4 ring-accent/20 text-on-accent"
              }`}
            />
            <time dateTime={m.dateTime} className="text-meta font-medium text-accent">
              {m.date}
              {m.upcoming && <span className="ml-2 text-on-dark-muted">· Upcoming</span>}
            </time>
            <h3 className="mt-3 text-card font-medium">{m.title}</h3>
            <p className="mt-2 max-w-[32ch] text-meta leading-relaxed text-on-dark-muted">{m.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
