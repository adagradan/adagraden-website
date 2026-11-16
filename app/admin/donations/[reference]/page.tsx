import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AcknowledgeForm, ResendButton } from "@/components/admin/AcknowledgeForm";
import { amountOf, ago, fmtDate, requestTime, methodLabel, Panel, SetupNotice, StatusBadge } from "@/components/admin/ui";
import { CURRENCIES, formatMoney, isCurrency } from "@/lib/donate";
import { getDonation } from "@/lib/server/admin-data";
import { adminSetupProblems, requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = { title: "Donation" };

type Params = PageProps<"/admin/donations/[reference]">["params"];

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-line">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
          <dt className="text-meta text-muted">{k}</dt>
          <dd className="text-meta font-medium break-words">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

async function Detail({ params }: { params: Params }) {
  await connection();
  const problems = adminSetupProblems();
  if (problems.length) return <SetupNotice problems={problems} />;
  await requireAdmin();
  const { reference } = await params;
  const d = await getDonation(decodeURIComponent(reference));
  if (!d) notFound();
  const ack = d.acknowledgement;
  const now = await requestTime();

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-page font-medium tracking-wide tabular-nums">{d.reference}</h1>
        <StatusBadge d={d} />
      </div>
      <p className="mt-2 text-body text-muted">
        {amountOf(d)} · {d.causeLabel} · {methodLabel(d)} · logged {ago(d.createdAt, now)}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Panel className="p-6">
            <h2 className="text-card font-medium">Donation</h2>
            <Rows
              rows={[
                ["Reference", <span key="r" className="tracking-wide tabular-nums">{d.reference}</span>],
                ["Method", methodLabel(d)],
                [d.method === "card" ? "Amount paid" : "Amount pledged", amountOf(d)],
                ["Supporting", d.causeLabel],
                ["Logged", fmtDate(d.createdAt)],
                ...(d.method === "bank-transfer"
                  ? ([["Transfer details emailed", d.instructionsEmailedAt ? fmtDate(d.instructionsEmailedAt) : "No (email failed or not configured)"]] as [string, string][])
                  : []),
              ]}
            />
          </Panel>
          <Panel className="p-6">
            <h2 className="text-card font-medium">Donor</h2>
            <Rows
              rows={[
                ["Name", d.donor.anonymous ? "Anonymous (no name given)" : d.donor.name],
                [
                  "Email",
                  <a key="e" href={`mailto:${d.donor.email}?subject=${encodeURIComponent(`Your gift · Ref ${d.reference}`)}`} className="underline underline-offset-4">
                    {d.donor.email}
                  </a>,
                ],
              ]}
            />
          </Panel>
        </div>

        <div className="lg:col-span-5">
          <Panel className="p-6 lg:sticky lg:top-6">
            {ack ? (
              <>
                <h2 className="text-card font-medium">Acknowledged</h2>
                <Rows
                  rows={[
                    ["Amount received", formatMoney(ack.receivedMinor / 100, d.currency)],
                    ["When", fmtDate(ack.at)],
                    ["By", ack.by],
                    ...(ack.note ? ([["Note", ack.note]] as [string, string][]) : []),
                    [
                      "Thank-you email",
                      ack.emailSentAt ? (
                        `Sent ${fmtDate(ack.emailSentAt)}`
                      ) : (
                        <span key="x" className="text-danger">Not sent{ack.emailError ? `: ${ack.emailError}` : ""}</span>
                      ),
                    ],
                  ]}
                />
                <div className="mt-5">
                  <ResendButton reference={d.reference} />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-card font-medium">Acknowledge this gift</h2>
                <p className="mt-2 mb-6 text-meta text-muted">
                  Check your {d.currency} account for a transfer quoting <strong className="text-ink">{d.reference}</strong>. When it
                  has arrived, acknowledge it to thank the donor.
                </p>
                <AcknowledgeForm
                  reference={d.reference}
                  pledged={d.amountMinor / 100}
                  currency={d.currency}
                  symbol={isCurrency(d.currency) ? CURRENCIES[d.currency].symbol : d.currency}
                  email={d.donor.email}
                />
              </>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

export default function DonationPage(props: PageProps<"/admin/donations/[reference]">) {
  return (
    <>
      <Link href="/admin" className="mb-6 inline-flex min-h-11 items-center gap-2 text-meta font-semibold underline-offset-4 hover:underline">
        <span aria-hidden="true">←</span> All donations
      </Link>
      <Suspense fallback={<p className="text-body text-muted">Loading…</p>}>
        <Detail params={props.params} />
      </Suspense>
    </>
  );
}
