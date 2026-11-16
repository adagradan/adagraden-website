import "server-only";
import { BANK, formatMoney, isCurrency } from "@/lib/donate";
import { org, siteUrl } from "@/lib/site";
import { optionalEnv } from "./env";

/**
 * Email through Resend's REST API (RESEND_API_KEY, MAIL_FROM on a verified
 * domain). NOTIFY_EMAIL receives a copy of every pledge, receipt and message.
 * Idempotency keys mean a retry can never email someone twice.
 */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const mailConfigured = () => Boolean(optionalEnv("RESEND_API_KEY") && optionalEnv("MAIL_FROM"));
const replyTo = () => org.email ?? optionalEnv("NOTIFY_EMAIL");

async function send(o: {
  to: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
}): Promise<void> {
  const key = optionalEnv("RESEND_API_KEY");
  const from = optionalEnv("MAIL_FROM");
  if (!key || !from) throw new Error("Email is not configured (RESEND_API_KEY / MAIL_FROM).");
  const res = await fetch(optionalEnv("RESEND_API_URL") ?? "https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(o.idempotencyKey ? { "Idempotency-Key": o.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from,
      to: o.to,
      ...(o.bcc?.length ? { bcc: o.bcc } : {}),
      ...(o.replyTo ? { reply_to: o.replyTo } : {}),
      subject: o.subject,
      html: o.html,
      text: o.text,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/* ------------------------------------------------------------- templates */

const footer = `${org.name}<br>${org.address.lines.map(esc).join(", ")}`;

function layout(kicker: string, inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f7f5;font-family:Arial,Helvetica,sans-serif;color:#111111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#080808;color:#ffffff;padding:26px 32px;border-bottom:4px solid #f5d65e">
<img src="${siteUrl}/brand/png/logo-horizontal-reversed-480.png" alt="${esc(org.name)}" width="260" style="display:block;border:0;max-width:100%;height:auto">
<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a8a8a8;margin-top:14px">${esc(kicker)}</div></td></tr>
<tr><td style="padding:32px">${inner}</td></tr>
<tr><td style="background:#f7f7f5;padding:20px 32px;font-size:12px;line-height:1.6;color:#6b6b6b">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

const table = (rows: [string, string][]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid #e5e5e5">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#6b6b6b;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;text-align:right;font-weight:600;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;

const firstName = (name: string) => (name && name !== "Friend" ? name.split(" ")[0] : "friend");

/* ------------------------------------------------------ bank transfer pledge */

export type TransferPledge = {
  reference: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  causeLabel: string;
};

export function transferDetailsRows(currency: string): [string, string][] {
  const cur = isCurrency(currency) ? currency : "NGN";
  return [
    ["Bank", BANK.name],
    ["Account name", BANK.accountName],
    [`Account number (${cur})`, BANK.accounts[cur]],
    ["Sort code", BANK.sortCode],
    ...(cur !== "NGN" ? ([["SWIFT code", BANK.swift]] as [string, string][]) : []),
    ["Bank address", BANK.address],
  ];
}

export async function sendTransferInstructions(p: TransferPledge) {
  const amount = formatMoney(p.amount, p.currency);
  const rows: [string, string][] = [
    ...transferDetailsRows(p.currency),
    ["Amount to send", amount],
    ["Payment reference", p.reference],
  ];
  const html = layout(
    "Bank transfer details",
    `<h1 style="font-size:24px;margin:0 0 12px;font-weight:600">Thank you, ${esc(firstName(p.name))}.</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#444">We are so grateful for your gift of <strong>${esc(amount)}</strong> toward <strong>${esc(p.causeLabel)}</strong>. Here is where to send it.</p>
${table(rows)}
<p style="font-size:14px;line-height:1.6;margin:20px 0 0"><strong>Please put your payment reference (${esc(p.reference)}) in the transfer narration</strong> so we can match your gift. When it arrives, we will send you a receipt.</p>
<p style="font-size:13px;line-height:1.6;color:#6b6b6b;margin:16px 0 0">Please only use the account details above, which match our website. Questions? Simply reply to this email.</p>`,
  );
  const text = `Thank you, ${firstName(p.name)}.\n\nWe are grateful for your gift of ${amount} toward ${p.causeLabel}. Please send it to:\n\n${rows
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\nPut your payment reference (${p.reference}) in the transfer narration. We will send your receipt when it arrives.\n\n${org.name}`;
  const notify = optionalEnv("NOTIFY_EMAIL");
  await send({
    to: [p.email],
    bcc: notify ? [notify] : undefined,
    replyTo: replyTo(),
    subject: `Your bank transfer details · Ref ${p.reference}`,
    html,
    text,
    idempotencyKey: `transfer-${p.reference}`,
  });
}

/* ------------------------------------------------------------ card receipt */

export type CardReceipt = {
  reference: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  causeLabel: string;
  paidAt: Date;
};

export const receiptRows = (r: CardReceipt): [string, string][] => [
  ["Receipt / reference", r.reference],
  ["Date", r.paidAt.toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "Africa/Lagos" })],
  ["Donor", r.name],
  ["Supporting", r.causeLabel],
  ["Amount", formatMoney(r.amount, r.currency)],
];

/** Safe to call from both the thank-you page and the webhook: the key dedupes. */
export async function sendCardReceipt(r: CardReceipt) {
  const amount = formatMoney(r.amount, r.currency);
  const rows = receiptRows(r);
  const html = layout(
    "Donation receipt",
    `<h1 style="font-size:24px;margin:0 0 12px;font-weight:600">Thank you, ${esc(firstName(r.name))}.</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 24px;color:#444">Your gift of <strong>${esc(amount)}</strong> has been received and will go toward <strong>${esc(r.causeLabel)}</strong>. We are deeply grateful.</p>
${table(rows)}
<p style="font-size:13px;line-height:1.6;color:#6b6b6b;margin:24px 0 0">Please keep this email as your receipt. Questions? Simply reply to this email.</p>`,
  );
  const text = `Thank you, ${firstName(r.name)}.\n\nYour gift of ${amount} has been received and will go toward ${r.causeLabel}.\n\n${rows
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\n${org.name}`;
  const notify = optionalEnv("NOTIFY_EMAIL");
  await send({
    to: [r.email],
    bcc: notify ? [notify] : undefined,
    replyTo: replyTo(),
    subject: `Thank you for your donation · Receipt ${r.reference}`,
    html,
    text,
    idempotencyKey: `receipt-${r.reference}`,
  });
}

/* --------------------------------------------- transfer acknowledgement */

export type Acknowledgement = {
  reference: string;
  name: string;
  anonymous: boolean;
  email: string;
  receivedAmount: number;
  currency: string;
  causeLabel: string;
  receivedAt: Date;
};

export const acknowledgementRows = (a: Acknowledgement): [string, string][] => [
  ["Reference", a.reference],
  ["Date received", a.receivedAt.toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "Africa/Lagos" })],
  ["Donor", a.anonymous ? "Anonymous" : a.name],
  ["Supporting", a.causeLabel],
  ["Amount received", formatMoney(a.receivedAmount, a.currency)],
];

/** Sent when an admin confirms a bank transfer arrived. Doubles as the receipt. */
export async function sendAcknowledgement(a: Acknowledgement) {
  const amount = formatMoney(a.receivedAmount, a.currency);
  const rows = acknowledgementRows(a);
  const greeting = a.anonymous ? "Thank you." : `Thank you, ${esc(firstName(a.name))}.`;
  const html = layout(
    "Gift received",
    `<h1 style="font-size:24px;margin:0 0 12px;font-weight:600">${greeting}</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 24px;color:#444">We have received your gift of <strong>${esc(amount)}</strong>, and it will go toward <strong>${esc(a.causeLabel)}</strong>. From all of us, thank you for standing with the people we serve.</p>
${table(rows)}
<p style="font-size:13px;line-height:1.6;color:#6b6b6b;margin:24px 0 0">Please keep this email as your receipt. Questions? Simply reply to this email.</p>`,
  );
  const text = `${a.anonymous ? "Thank you." : `Thank you, ${firstName(a.name)}.`}\n\nWe have received your gift of ${amount}, and it will go toward ${a.causeLabel}.\n\n${rows
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\nPlease keep this email as your receipt.\n\n${org.name}`;
  const notify = optionalEnv("NOTIFY_EMAIL");
  await send({
    to: [a.email],
    bcc: notify ? [notify] : undefined,
    replyTo: replyTo(),
    subject: `We have received your gift · Ref ${a.reference}`,
    html,
    text,
    idempotencyKey: `ack-${a.reference}`,
  });
}

/* --------------------------------------------------------- admin sign-in */

export async function sendAdminSignInLink(email: string, link: string) {
  await send({
    to: [email],
    subject: "Your sign-in link · Ada Gradan admin",
    html: layout(
      "Admin sign-in",
      `<h1 style="font-size:22px;margin:0 0 12px;font-weight:600">Sign in to the admin dashboard</h1>
<p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">This link works once and expires in 15 minutes.</p>
<p style="margin:0 0 24px"><a href="${esc(link)}" style="display:inline-block;background:#f5d65e;color:#111111;text-decoration:none;font-weight:600;padding:14px 26px;border-radius:999px">Sign in</a></p>
<p style="font-size:13px;line-height:1.6;color:#6b6b6b;margin:0">If you didn't ask for this, you can ignore this email. Nobody can sign in without it.</p>`,
    ),
    text: `Sign in to the Ada Gradan admin dashboard (works once, expires in 15 minutes):\n${link}\n\nIf you didn't ask for this, ignore this email.`,
  });
}

/* ----------------------------------------------------------- contact form */

/** To the Foundation (reply goes to the visitor) + a short acknowledgement. */
export async function sendContactEmails(m: { name: string; email: string; subject: string; message: string }) {
  const team = optionalEnv("NOTIFY_EMAIL");
  if (!team) throw new Error("NOTIFY_EMAIL is not set.");
  const rows: [string, string][] = [
    ["Name", m.name],
    ["Email", m.email],
    ["Subject", m.subject],
    ["Message", m.message],
  ];
  await send({
    to: [team],
    replyTo: m.email,
    subject: `New message: ${m.subject} — ${m.name}`,
    html: layout("New website message", `${table(rows)}<p style="font-size:13px;color:#6b6b6b;margin-top:16px">Reply to this email to answer ${esc(m.name)} directly.</p>`),
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
  });
  // The acknowledgement is a courtesy; never fail the submission because of it.
  await send({
    to: [m.email],
    replyTo: replyTo(),
    subject: "We have received your message",
    html: layout(
      "Message received",
      `<h1 style="font-size:22px;margin:0 0 12px;font-weight:600">Thank you, ${esc(firstName(m.name))}.</h1><p style="font-size:15px;line-height:1.6;color:#444">We have received your message about <strong>${esc(m.subject.toLowerCase())}</strong> and will reply as soon as we can.</p>`,
    ),
    text: `Thank you, ${firstName(m.name)}. We have received your message and will reply as soon as we can.\n\n${org.name}`,
  }).catch((e) => console.error("[contact] acknowledgement failed", e instanceof Error ? e.message : e));
}
