"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requestSignInLink, requireAdmin, signInWithToken, signOut } from "@/lib/server/auth";
import { donations, type Donation } from "@/lib/server/db";
import { sendAcknowledgement } from "@/lib/server/mail";

export type ActionState = { ok: boolean; message: string };

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

/* ------------------------------------------------------------- sign-in */

export async function requestLinkAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd.get("email"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, message: "Please enter a valid email address." };
  try {
    await requestSignInLink(email);
  } catch (e) {
    console.error("[admin] sign-in link failed", e instanceof Error ? e.message : e);
  }
  // Same answer whether or not the address is an admin.
  return { ok: true, message: "If that address is an admin, a sign-in link is on its way. It expires in 15 minutes." };
}

export async function confirmSignInAction(fd: FormData) {
  const ok = await signInWithToken(str(fd.get("token")));
  redirect(ok ? "/admin" : "/admin/login?error=link");
}

export async function signOutAction() {
  await signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------- acknowledgement */

function ackPayload(d: Donation) {
  return {
    reference: d.reference,
    name: d.donor.name,
    anonymous: d.donor.anonymous,
    email: d.donor.email,
    receivedAmount: (d.acknowledgement?.receivedMinor ?? d.amountMinor) / 100,
    currency: d.currency,
    causeLabel: d.causeLabel,
    receivedAt: d.acknowledgement?.at ?? new Date(),
  };
}

export async function acknowledgeAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const reference = str(fd.get("reference"));
  const received = Math.round(Number(str(fd.get("received"))) * 100);
  const note = str(fd.get("note")).slice(0, 500);
  if (!Number.isFinite(received) || received <= 0) return { ok: false, message: "Enter the amount that arrived in the account." };

  const col = await donations();
  // Atomic: only the first acknowledgement wins, so a double-click or two
  // admins at once can never send two emails.
  const updated = await col.findOneAndUpdate(
    { reference, method: "bank-transfer", acknowledgement: { $exists: false } },
    { $set: { acknowledgement: { at: new Date(), by: admin.email, receivedMinor: received, ...(note ? { note } : {}) } } },
    { returnDocument: "after" },
  );
  if (!updated) {
    refresh();
    return { ok: false, message: "This donation has already been acknowledged." };
  }

  try {
    await sendAcknowledgement(ackPayload(updated));
    await col.updateOne({ reference }, { $set: { "acknowledgement.emailSentAt": new Date() }, $unset: { "acknowledgement.emailError": "" } });
    refresh();
    return { ok: true, message: `Acknowledged. A thank-you email was sent to ${updated.donor.email}.` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await col.updateOne({ reference }, { $set: { "acknowledgement.emailError": msg.slice(0, 300) } });
    refresh();
    return { ok: false, message: "Acknowledged, but the email could not be sent. Use “Resend email” to try again." };
  }
}

export async function resendAcknowledgementAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const reference = str(fd.get("reference"));
  const col = await donations();
  const d = await col.findOne({ reference, acknowledgement: { $exists: true } });
  if (!d) return { ok: false, message: "This donation has not been acknowledged yet." };
  try {
    await sendAcknowledgement(ackPayload(d));
    await col.updateOne({ reference }, { $set: { "acknowledgement.emailSentAt": new Date() }, $unset: { "acknowledgement.emailError": "" } });
    refresh();
    return { ok: true, message: `Email sent to ${d.donor.email}.` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await col.updateOne({ reference }, { $set: { "acknowledgement.emailError": msg.slice(0, 300) } });
    refresh();
    return { ok: false, message: "The email still could not be sent. Please check the email settings." };
  }
}
