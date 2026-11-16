import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { causeLabel } from "@/lib/donate";
import { verifyByReference } from "./flutterwave";
import { sendCardReceipt, type CardReceipt } from "./mail";

/** Card gifts: unguessable reference sent to Flutterwave. */
export const newCardRef = () => `AGF-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;

/** Bank transfers: short and easy to type into a transfer narration. */
const REF_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const newTransferRef = () => "TRF-" + Array.from({ length: 6 }, () => REF_CHARS[randomInt(REF_CHARS.length)]).join("");

export type FinalizeResult =
  | { state: "successful"; receipt: CardReceipt; emailed: boolean }
  | { state: "pending" | "failed" | "not_found" };

/**
 * Confirms a card gift with Flutterwave and emails the receipt. Idempotent:
 * the thank-you page and the webhook may both call it, in any order — the
 * Resend idempotency key guarantees one receipt. The receipt states what
 * Flutterwave says was actually paid, never what the browser claimed.
 */
export async function finalizeCardDonation(txRef: string): Promise<FinalizeResult> {
  if (!/^AGF-[A-Z0-9]+-[A-F0-9]{6}$/.test(txRef)) return { state: "not_found" };
  const tx = await verifyByReference(txRef);
  if (!tx) return { state: "not_found" };
  if (tx.status === "pending") return { state: "pending" };
  if (tx.status !== "successful") return { state: "failed" };

  const receipt: CardReceipt = {
    reference: tx.tx_ref,
    name: tx.meta?.donor_name || tx.customer?.name || "Friend",
    email: tx.customer?.email ?? "",
    amount: tx.amount,
    currency: tx.currency,
    causeLabel: causeLabel(tx.meta?.cause ?? "all"),
    paidAt: tx.created_at ? new Date(tx.created_at) : new Date(),
  };

  let emailed = false;
  if (receipt.email) {
    try {
      await sendCardReceipt(receipt);
      emailed = true;
    } catch (e) {
      console.error("[donate] receipt email failed", txRef, e instanceof Error ? e.message : e);
    }
  }
  return { state: "successful", receipt, emailed };
}
