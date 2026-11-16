"use server";

import { redirect } from "next/navigation";
import { CURRENCIES, causeLabel, formatMoney, isCause, isCurrency } from "@/lib/donate";
import { siteUrl } from "@/lib/site";
import { cardPaymentsEnabled } from "@/lib/server/env";
import { createPaymentLink } from "@/lib/server/flutterwave";
import { newCardRef, newTransferRef } from "@/lib/server/donations";
import { mailConfigured, sendTransferInstructions } from "@/lib/server/mail";

export type DonateState = { ok: boolean; message: string; reference?: string; emailed?: boolean };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

function readGift(fd: FormData) {
  const currency = str(fd.get("currency"));
  const cause = str(fd.get("cause")) || "all";
  const amount = Math.round(Number(str(fd.get("amount"))) * 100) / 100;
  if (!isCurrency(currency)) return { error: "Please choose a currency." } as const;
  const min = CURRENCIES[currency].min;
  if (!Number.isFinite(amount) || amount < min || amount > 100_000_000)
    return { error: `The minimum gift is ${formatMoney(min, currency)}.` } as const;
  if (!isCause(cause)) return { error: "Please choose what your gift should support." } as const;
  return { currency, cause, amount } as const;
}

/**
 * Bank transfer: give the donor a reference to quote and email them the exact
 * account for their currency (with a copy to NOTIFY_EMAIL so the Foundation
 * can match the transfer when it arrives).
 */
export async function pledgeTransfer(_: DonateState, fd: FormData): Promise<DonateState> {
  if (str(fd.get("company"))) return { ok: true, message: "", reference: "TRF-THANKS" }; // honeypot
  const email = str(fd.get("email")).toLowerCase();
  const name = str(fd.get("name")).slice(0, 100);
  if (!emailRe.test(email) || email.length > 200)
    return { ok: false, message: "Please enter a valid email address. We send your transfer details there." };
  const gift = readGift(fd);
  if ("error" in gift) return { ok: false, message: gift.error! };

  const reference = newTransferRef();
  let emailed = false;
  if (mailConfigured()) {
    try {
      await sendTransferInstructions({
        reference,
        name: name || "Friend",
        email,
        amount: gift.amount,
        currency: gift.currency,
        causeLabel: causeLabel(gift.cause),
      });
      emailed = true;
    } catch (e) {
      console.error("[donate] transfer email failed", reference, e instanceof Error ? e.message : e);
    }
  }
  return { ok: true, message: "", reference, emailed };
}

/** Card: start a Flutterwave hosted checkout (only when switched on). */
export async function startCardDonation(_: DonateState, fd: FormData): Promise<DonateState> {
  if (!cardPaymentsEnabled())
    return { ok: false, message: "Card payments are temporarily unavailable. Please give by bank transfer for now." };
  if (str(fd.get("company"))) return { ok: true, message: "" }; // honeypot
  const name = str(fd.get("name")).slice(0, 100);
  const email = str(fd.get("email")).toLowerCase();
  if (name.length < 2 || !emailRe.test(email) || email.length > 200)
    return { ok: false, message: "Please enter your full name and a valid email address. Your receipt is sent there." };
  const gift = readGift(fd);
  if ("error" in gift) return { ok: false, message: gift.error! };

  let link: string;
  try {
    link = await createPaymentLink({
      txRef: newCardRef(),
      amount: gift.amount,
      currency: gift.currency,
      redirectUrl: `${siteUrl}/donate/thank-you`,
      customer: { email, name },
      title: "Ada Gradan Foundation",
      description: `Donation: ${causeLabel(gift.cause)}`,
      logo: `${siteUrl}/brand/png/app-icon-192.png`,
      meta: { cause: gift.cause, donor_name: name },
    });
  } catch (e) {
    console.error("[donate] could not start card payment", e);
    return { ok: false, message: "Sorry, we could not start your payment. Please try again in a moment, or give by bank transfer." };
  }
  redirect(link); // Flutterwave's hosted, PCI-compliant checkout
}
