/**
 * Giving configuration shared by the donate form (client) and the server
 * actions / emails. Bank details supplied by the Foundation on 16 Nov 2026.
 */

import { programs } from "./programs";

export const CURRENCIES = {
  NGN: { symbol: "₦", label: "Naira", min: 500, presets: [5000, 10000, 25000, 50000] },
  USD: { symbol: "$", label: "US Dollar", min: 5, presets: [10, 25, 50, 100] },
  GBP: { symbol: "£", label: "Pound", min: 5, presets: [10, 25, 50, 100] },
  EUR: { symbol: "€", label: "Euro", min: 5, presets: [10, 25, 50, 100] },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
export const isCurrency = (c: string): c is CurrencyCode => c in CURRENCIES;

/**
 * Deterministic money formatting (identical on server and in every browser,
 * so it never causes a hydration mismatch): ₦25,000 · $10 · £12.50
 */
export function formatMoney(amount: number, currency: string) {
  const symbol = isCurrency(currency) ? CURRENCIES[currency].symbol : `${currency} `;
  const fixed = Math.round(amount * 100) / 100;
  const [whole, frac] = fixed.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${symbol}${grouped}${frac === "00" ? "" : `.${frac}`}`;
}

/** Fidelity Bank — one account per currency, all in the Foundation's name. */
export const BANK = {
  name: "Fidelity Bank",
  // Confirm: the account name was not included with the details supplied.
  accountName: "Ada Gradan Compassionate Care Hands Foundation",
  swift: "FIDTNGLA",
  sortCode: "070100930",
  address: "Plot 269, Ikenegbu Layout, Owerri, Nigeria",
  accounts: { NGN: "5601837641", USD: "5250622151", GBP: "5250622522", EUR: "5250622498" },
} as const;

/** What a gift can be directed to: each programme, or wherever needed most. */
export const CAUSES = [
  { id: "all", label: "Where needed most" },
  ...programs.map((p) => ({ id: p.slug, label: p.shortTitle })),
];

export const causeLabel = (id: string) => CAUSES.find((c) => c.id === id)?.label ?? "Where needed most";
export const isCause = (id: string) => CAUSES.some((c) => c.id === id);
