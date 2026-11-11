import type { CSSProperties } from "react";

export type Fact = { value: string; label: string };

/**
 * Row of verified facts with hairline dividers — the reference "stats row",
 * used for facts rather than unverified impact figures.
 */
export function FactsStrip({ facts }: { facts: Fact[] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {facts.map((f, i) => (
        <div
          key={f.label}
          data-reveal="up"
          style={{ "--i": i } as CSSProperties}
          className={`flex flex-col gap-2 py-6 pr-4 lg:py-8 ${i % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${
            i > 0 ? "lg:border-l lg:border-line lg:pl-8" : ""
          } ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""}`}
        >
          <dt className="order-2 text-meta text-muted">{f.label}</dt>
          <dd className="order-1 text-card font-medium">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
