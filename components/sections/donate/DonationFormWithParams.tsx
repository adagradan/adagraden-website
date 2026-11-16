"use client";

import { useSearchParams } from "next/navigation";
import { DonationForm } from "./DonationForm";

/** Pre-selects the cause from /donate?cause=<programme-slug>. Render inside <Suspense>. */
export function DonationFormWithParams({ cardEnabled }: { cardEnabled: boolean }) {
  const cause = useSearchParams().get("cause") ?? "all";
  return <DonationForm key={cause} initialCause={cause} cardEnabled={cardEnabled} />;
}
