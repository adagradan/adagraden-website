import "server-only";
import { env } from "./env";

const BASE = process.env.FLW_BASE_URL ?? "https://api.flutterwave.com/v3";

async function flw<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: { Authorization: `Bearer ${env("FLW_SECRET_KEY")}`, "Content-Type": "application/json", ...init?.headers },
    signal: AbortSignal.timeout(15_000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 404) throw new Error(`Flutterwave ${res.status}: ${json?.message ?? "request failed"}`);
  return json as T;
}

export type FlwTransaction = {
  id: number;
  tx_ref: string;
  flw_ref?: string;
  amount: number;
  currency: string;
  status: string; // "successful" | "failed" | "pending"
  payment_type?: string;
  created_at?: string;
  customer?: { name?: string; email?: string };
  meta?: Record<string, string> | null;
};

/** Hosted checkout: card details are entered on Flutterwave, never on our site. */
export async function createPaymentLink(p: {
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customer: { email: string; name: string };
  title: string;
  description: string;
  logo?: string;
  meta: Record<string, string>;
}): Promise<string> {
  const json = await flw<{ status: string; message: string; data?: { link: string } }>("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: p.txRef,
      amount: p.amount,
      currency: p.currency,
      redirect_url: p.redirectUrl,
      customer: p.customer,
      meta: p.meta,
      customizations: { title: p.title, description: p.description, ...(p.logo ? { logo: p.logo } : {}) },
    }),
  });
  if (json.status !== "success" || !json.data?.link) throw new Error(`Flutterwave could not start payment: ${json.message}`);
  return json.data.link;
}

/** Always confirm with Flutterwave directly; never trust a redirect or webhook body. */
export async function verifyByReference(txRef: string): Promise<FlwTransaction | null> {
  const json = await flw<{ status: string; data?: FlwTransaction }>(
    `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
  );
  return json.status === "success" && json.data ? json.data : null;
}
