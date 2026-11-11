"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type AboutTab = { label: string; content: ReactNode };

/** Vertical tab labels (left) with panel text (right) — reference "Our Mission / Our Vision". */
export function AboutTabs({ tabs }: { tabs: AboutTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next: number | undefined;
    if (e.key in keys) next = (active + keys[e.key] + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-10">
      <div role="tablist" aria-orientation="vertical" aria-label="About us" className="flex gap-6 sm:flex-col sm:gap-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`flex min-h-11 items-center text-left text-body font-medium transition-colors ${
              active === i ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-px bg-ink transition-[width,margin] duration-300 ${active === i ? "mr-2 w-4" : "w-0"}`}
            />
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          id={`${base}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${i}`}
          hidden={active !== i}
          tabIndex={0}
          className="text-meta leading-relaxed text-muted sm:text-body"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
