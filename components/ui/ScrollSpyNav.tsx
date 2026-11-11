"use client";

import { useEffect, useState } from "react";

export type SpyItem = { id: string; label: string; index: string };

/**
 * Sticky in-page index that highlights the section currently in view.
 * Works as plain anchor links without JS; the highlight is an enhancement.
 */
export function ScrollSpyNav({ items, label }: { items: SpyItem[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        // The section occupying the most of the reading band wins.
        let best: string | undefined;
        let max = 0;
        for (const [id, r] of visible) if (r > max) [best, max] = [id, r];
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label={label}>
      <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">{label}</p>
      <ol className="mt-5 flex flex-col border-l border-line">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex min-h-11 items-center gap-3 border-l-2 py-2 pl-4 text-meta transition-colors duration-300 ${
                  on ? "border-accent font-semibold text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <span className="text-micro tabular-nums">{it.index}</span>
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
