import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { amountOf, ago, fmtDate, requestTime, methodLabel, Panel, SetupNotice, StatusBadge } from "@/components/admin/ui";
import { formatMoney } from "@/lib/donate";
import { donationStats, listDonations, type View } from "@/lib/server/admin-data";
import { adminSetupProblems, requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Donations" };

type SP = PageProps<"/admin">["searchParams"];

const href = (view: View, q: string, page = 1) => {
  const p = new URLSearchParams();
  if (view !== "unacknowledged") p.set("view", view);
  if (q) p.set("q", q);
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return `/admin${s ? `?${s}` : ""}`;
};

async function Dashboard({ searchParams }: { searchParams: SP }) {
  // Settings are read at request time (never baked into the prerendered shell).
  await connection();
  const problems = adminSetupProblems();
  if (problems.length) return <SetupNotice problems={problems} />;
  await requireAdmin();
  const sp = await searchParams;
  const view: View = sp.view === "all" ? "all" : "unacknowledged";
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = Math.max(1, Number(sp.page) || 1);
  const [stats, list] = await Promise.all([donationStats(), listDonations({ view, q, page })]);
  const now = await requestTime();

  return (
    <>
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel className="p-5">
          <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">Awaiting acknowledgement</p>
          <p className="mt-3 text-stat font-medium tabular-nums">{stats.unacknowledged}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">All donations</p>
          <p className="mt-3 text-stat font-medium tabular-nums">{stats.all}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">Received (acknowledged)</p>
          {stats.received.length ? (
            <ul className="mt-3 flex flex-col gap-1">
              {stats.received.map((r) => (
                <li key={r._id} className="flex items-baseline justify-between gap-3">
                  <span className="text-card font-medium tabular-nums">{formatMoney(r.total / 100, r._id)}</span>
                  <span className="text-micro text-muted">
                    {r.count} gift{r.count === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-card font-medium text-muted">—</p>
          )}
        </Panel>
      </div>

      {/* Tabs + search */}
      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter donations" className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {(
            [
              ["unacknowledged", `Unacknowledged (${stats.unacknowledged})`],
              ["all", `All (${stats.all})`],
            ] as const
          ).map(([v, label]) => (
            <Link
              key={v}
              href={href(v, q)}
              aria-current={view === v ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-full px-4 text-meta font-semibold transition-colors ${
                view === v ? "bg-ink text-on-ink" : "hover:bg-surface-alt"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form action="/admin" role="search" className="flex gap-2">
          {view === "all" && <input type="hidden" name="view" value="all" />}
          <label htmlFor="q" className="sr-only">
            Search by reference, email or name
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Reference, email or name"
            className="min-h-11 w-full rounded-full border border-line bg-surface px-4 text-meta md:w-72"
          />
          <button className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-meta font-semibold text-on-ink">Search</button>
        </form>
      </div>

      {/* List */}
      <Panel className="mt-4 overflow-hidden">
        {list.rows.length === 0 ? (
          <p className="p-10 text-center text-body text-muted">
            {q
              ? `No donations match “${q}”.`
              : view === "unacknowledged"
                ? "All caught up. Every donation has been acknowledged."
                : "No donations yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-meta">
              <thead className="border-b border-line bg-surface-alt text-micro tracking-[0.06em] text-muted uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Reference</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Donor</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Amount</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Supporting</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Logged</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.rows.map((d) => (
                  <tr key={d.reference} className="group relative transition-colors hover:bg-surface-alt">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/donations/${d.reference}`}
                        className="font-semibold tracking-wide tabular-nums underline-offset-4 after:absolute after:inset-0 group-hover:underline"
                      >
                        {d.reference}
                      </Link>
                      <span className="block text-micro text-muted">{methodLabel(d)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block font-medium">{d.donor.anonymous ? "Anonymous" : d.donor.name}</span>
                      <span className="text-micro text-muted">{d.donor.email}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap tabular-nums">{amountOf(d)}</td>
                    <td className="px-5 py-4">{d.causeLabel}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="block">{ago(d.createdAt, now)}</span>
                      <span className="text-micro text-muted">{fmtDate(d.createdAt)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge d={d} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {list.pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between text-meta">
          {page > 1 ? (
            <Link href={href(view, q, page - 1)} className="font-semibold underline-offset-4 hover:underline">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Page {page} of {list.pages}
          </span>
          {page < list.pages ? (
            <Link href={href(view, q, page + 1)} className="font-semibold underline-offset-4 hover:underline">
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function AdminHome(props: PageProps<"/admin">) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-page font-medium">Donations</h1>
        <p className="mt-2 text-body text-muted">
          Match each bank transfer to its reference, then acknowledge it to thank the donor.
        </p>
      </div>
      <Suspense fallback={<p className="text-body text-muted">Loading donations…</p>}>
        <Dashboard searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
