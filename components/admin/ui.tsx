import { connection } from "next/server";
import type { ReactNode } from "react";
import { formatMoney } from "@/lib/donate";
import type { Donation } from "@/lib/server/db";

/** Lagos time, the same on server and client. */
export const fmtDate = (d: Date) =>
  d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" });

/**
 * Current time for admin pages. `connection()` first, as Cache Components
 * requires: it pins the render to the request, so server HTML and the RSC
 * payload agree (no hydration mismatch on "5 min ago").
 */
export async function requestTime() {
  await connection();
  return Date.now();
}

export function ago(d: Date, now: number) {
  const m = Math.round((now - d.getTime()) / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export const amountOf = (d: Donation) => formatMoney(d.amountMinor / 100, d.currency);

export function StatusBadge({ d }: { d: Donation }) {
  return d.acknowledgement ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-2.5 py-1 text-micro font-semibold whitespace-nowrap">
      <span aria-hidden="true">✓</span> Acknowledged
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-micro font-semibold whitespace-nowrap text-on-accent">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-on-accent" /> Awaiting
    </span>
  );
}

export const methodLabel = (d: Donation) => (d.method === "card" ? "Card" : "Bank transfer");

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-line bg-surface ${className}`}>{children}</div>;
}

export function SetupNotice({ problems }: { problems: string[] }) {
  return (
    <Panel className="mx-auto max-w-xl p-6 sm:p-8">
      <h1 className="text-card font-medium">The admin dashboard is not set up yet</h1>
      <p className="mt-2 text-meta text-muted">Add these settings to the environment, then restart or redeploy:</p>
      <ul className="mt-4 flex flex-col gap-2 text-meta">
        {problems.map((p) => (
          <li key={p} className="flex gap-3">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            {p}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
