import type { Metadata } from "next";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { finalizeCardDonation, type FinalizeResult } from "@/lib/server/donations";
import { receiptRows } from "@/lib/server/mail";
import { org } from "@/lib/site";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = { title: "Thank you", robots: { index: false, follow: false } };

/** Flutterwave returns donors here with ?tx_ref=…&status=… — we re-verify server-side. */
async function Result({ searchParams }: { searchParams: PageProps<"/donate/thank-you">["searchParams"] }) {
  const sp = await searchParams;
  const txRef = typeof sp.tx_ref === "string" ? sp.tx_ref : "";
  const cancelled = sp.status === "cancelled";

  let result: FinalizeResult | null = null;
  if (txRef && !cancelled) {
    try {
      result = await finalizeCardDonation(txRef);
    } catch (e) {
      console.error("[thank-you] verify failed", e);
    }
  }
  const ok = result?.state === "successful" ? result : null;

  const title = ok ? "Thank you for your generosity" : cancelled ? "Payment cancelled" : "Checking your payment";
  const intro = ok
    ? ok.emailed
      ? "Your donation was successful. A receipt is on its way to your email."
      : "Your donation was successful. Please keep this page as your receipt."
    : cancelled
      ? "No payment was taken. You can try again whenever you are ready."
      : result?.state === "pending"
        ? "Your payment is still being processed. If you were charged, your receipt will arrive by email shortly."
        : "We could not confirm your payment yet. If money left your account, please contact us with your reference and we will sort it out.";

  return (
    <>
      <h1 className="text-page font-medium text-balance">{title}</h1>
      <p className="mt-4 text-lead text-muted">{intro}</p>

      {ok ? (
        <div className="mt-10 rounded-card border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-card font-medium">Donation receipt</h2>
          <dl className="mt-6 divide-y divide-line text-meta">
            {receiptRows(ok.receipt).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-micro text-muted">{org.name}</p>
        </div>
      ) : (
        txRef && <p className="mt-6 text-micro text-muted">Reference: {txRef}</p>
      )}

      <div className="mt-10 flex flex-wrap gap-3 print:hidden">
        {ok ? <PrintButton /> : <Button href="/donate#give">Try again</Button>}
        <Button href="/" variant="outline" arrow={false}>
          Back to home
        </Button>
      </div>
    </>
  );
}

export default function ThankYouPage(props: PageProps<"/donate/thank-you">) {
  return (
    <section className="bg-surface">
      <Container className="max-w-3xl py-20 md:py-28">
        <Suspense fallback={<p className="text-lead text-muted">Confirming your payment…</p>}>
          <Result searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}
