"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { pledgeTransfer, startCardDonation, type DonateState } from "@/app/donate/actions";
import { fieldClass } from "@/components/ui/FormField";
import { BANK, CAUSES, CURRENCIES, CURRENCY_CODES, causeLabel, formatMoney, type CurrencyCode } from "@/lib/donate";

const init: DonateState = { ok: false, message: "" };

const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-meta font-medium transition-colors duration-200 ${
    on ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink"
  }`;

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="mb-5 flex items-center gap-3 text-body font-semibold">
      <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-accent text-micro font-semibold text-on-accent">
        {n}
      </span>
      {children}
    </legend>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const t = document.createElement("textarea");
      t.value = value;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? `${label} copied` : `Copy ${label}`}
      className={`inline-flex min-h-9 shrink-0 items-center rounded-full px-3 text-micro font-semibold transition-colors ${
        done ? "bg-ink text-on-ink" : "bg-surface-alt hover:bg-accent hover:text-on-accent"
      }`}
    >
      {done ? "Copied ✓" : "Copy"}
    </button>
  );
}

function Row({ k, v, copy, strong }: { k: string; v: string; copy?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0">
        <dt className="text-micro text-muted">{k}</dt>
        <dd className={`wrap-break-word ${strong ? "text-card font-semibold tracking-wide tabular-nums" : "text-meta font-medium"}`}>{v}</dd>
      </div>
      {copy && <CopyButton value={v} label={k} />}
    </div>
  );
}

/** The account swaps with the currency; `key` replays the slide-in so the change is noticed. */
function Account({ currency }: { currency: CurrencyCode }) {
  return (
    <dl key={currency} className="panel-swap">
      <Row k={`${CURRENCIES[currency].label} account number`} v={BANK.accounts[currency]} copy strong />
      <Row k="Account name" v={BANK.accountName} copy />
      <Row k="Bank" v={BANK.name} />
      <Row k="Sort code" v={BANK.sortCode} copy />
      {currency !== "NGN" && <Row k="SWIFT code" v={BANK.swift} copy />}
      <Row k="Bank address" v={BANK.address} />
    </dl>
  );
}

export function DonationForm({ initialCause = "all", cardEnabled = false }: { initialCause?: string; cardEnabled?: boolean }) {
  const [tState, tAction, tPending] = useActionState(pledgeTransfer, init);
  const [cState, cAction, cPending] = useActionState(startCardDonation, init);
  const [cause, setCause] = useState(CAUSES.some((c) => c.id === initialCause) ? initialCause : "all");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [amount, setAmount] = useState<number | "">(CURRENCIES.NGN.presets[1]);
  const [method, setMethod] = useState<"transfer" | "card">("transfer");
  const [dismissed, setDismissed] = useState(false);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const id = useId();

  const money = typeof amount === "number" && amount > 0 ? formatMoney(amount, currency) : "";
  const pending = tPending || cPending;
  const state = method === "card" ? cState : tState;
  const label = causeLabel(cause);
  const changeCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    setAmount(CURRENCIES[c].presets[1]);
  };
  const showThanks = tState.ok && tState.reference && !dismissed;

  useEffect(() => {
    if (showThanks) thanksRef.current?.focus();
  }, [showThanks]);

  /* ---------------- after a transfer pledge: reference + account ---------------- */
  if (showThanks) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-line bg-surface p-6 sm:p-10">
        <div className="text-center">
          <span aria-hidden="true" className="heartbeat mx-auto grid size-14 place-items-center rounded-full bg-accent text-section text-on-accent">
            ♥
          </span>
          <h2 ref={thanksRef} tabIndex={-1} className="mt-5 text-section font-medium outline-none">
            Thank you for your generosity
          </h2>
          <p className="mt-3 text-body text-muted">
            Your gift of <strong className="text-ink">{money}</strong> for <strong className="text-ink">{label}</strong> is
            noted. Please complete your transfer using the details below.
          </p>
        </div>

        <div className="mt-8 rounded-card bg-accent/15 p-5">
          <p className="text-micro text-muted">Put this reference in your transfer narration</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <span className="text-section font-semibold tracking-widest">{tState.reference}</span>
            <CopyButton value={tState.reference!} label="reference" />
          </div>
        </div>

        <div className="mt-6">
          <Account currency={currency} />
        </div>

        <ol className="mt-8 flex flex-col gap-3 text-meta leading-relaxed">
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-micro text-on-ink">1</span>
            Send {money} from your bank app, quoting the reference above.
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-micro text-on-ink">2</span>
            We match your gift when it arrives and send you a receipt.
          </li>
        </ol>

        <p
          role="status"
          className={`mt-6 rounded-card p-4 text-meta ${tState.emailed ? "bg-surface-alt" : "border border-accent bg-accent/15"}`}
        >
          {tState.emailed
            ? "We have also emailed these details to you. Check your spam folder if you can't see them."
            : "We couldn't email these details just now, so please take a screenshot of this page."}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ink/20 text-button font-semibold transition-colors hover:border-ink"
        >
          Make another gift
        </button>
      </div>
    );
  }

  /* ---------------------------------- the form ---------------------------------- */
  return (
    <form
      action={method === "card" ? cAction : tAction}
      onSubmit={() => setDismissed(false)}
      className="grid gap-10 lg:grid-cols-12 lg:gap-12"
    >
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="cause" value={cause} />
      <input type="hidden" name="currency" value={currency} />

      <div className="flex flex-col gap-10 lg:col-span-7">
        <fieldset className="flex flex-col gap-5">
          <StepLabel n={1}>Your details</StepLabel>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-name`} className="text-meta font-semibold">
                Name {method === "card" ? <span aria-hidden="true" className="text-muted">*</span> : <span className="font-normal text-muted">(optional)</span>}
              </label>
              <input id={`${id}-name`} name="name" autoComplete="name" required={method === "card"} className={fieldClass()} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={`${id}-email`} className="text-meta font-semibold">
                Email address <span aria-hidden="true" className="text-muted">*</span>
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                aria-describedby={`${id}-email-hint`}
                className={fieldClass()}
              />
            </div>
          </div>
          <p id={`${id}-email-hint`} className="-mt-2 text-micro text-muted">
            Your transfer details and receipt are sent here.
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <StepLabel n={2}>What should it support?</StepLabel>
          <select aria-label="What should your gift support?" value={cause} onChange={(e) => setCause(e.target.value)} className={`${fieldClass()} min-h-12 sm:hidden`}>
            {CAUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="hidden flex-wrap gap-2 sm:flex" role="group" aria-label="What should your gift support?">
            {CAUSES.map((c) => (
              <button type="button" key={c.id} aria-pressed={cause === c.id} onClick={() => setCause(c.id)} className={chip(cause === c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <StepLabel n={3}>Currency and amount</StepLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Currency">
            {CURRENCY_CODES.map((c) => (
              <button
                type="button"
                key={c}
                aria-pressed={currency === c}
                onClick={() => changeCurrency(c)}
                className={`rounded-card border px-4 py-3 text-left transition-colors duration-200 ${
                  currency === c ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink"
                }`}
              >
                <span className="block text-card font-semibold">
                  {CURRENCIES[c].symbol} <span className="text-meta">{c}</span>
                </span>
                <span className={`text-micro ${currency === c ? "opacity-70" : "text-muted"}`}>{CURRENCIES[c].label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested amounts">
            {CURRENCIES[currency].presets.map((a) => (
              <button type="button" key={a} aria-pressed={amount === a} onClick={() => setAmount(a)} className={chip(amount === a)}>
                {formatMoney(a, currency)}
              </button>
            ))}
          </div>
          <div className="flex max-w-xs flex-col gap-2">
            <label htmlFor={`${id}-amount`} className="text-meta font-semibold">
              Amount ({currency}) <span aria-hidden="true" className="text-muted">*</span>
            </label>
            <input
              id={`${id}-amount`}
              name="amount"
              type="number"
              inputMode="decimal"
              min={CURRENCIES[currency].min}
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              aria-describedby={`${id}-amount-hint`}
              className={fieldClass()}
            />
            <p id={`${id}-amount-hint`} className="text-micro text-muted">
              Minimum {formatMoney(CURRENCIES[currency].min, currency)}
            </p>
          </div>
        </fieldset>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-card border border-line bg-surface p-6 shadow-[0_24px_64px_-24px_rgb(0_0_0/0.18)] sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <div className="flex gap-1 rounded-full border border-line p-1" role="group" aria-label="Payment method">
            <button
              type="button"
              aria-pressed={method === "transfer"}
              onClick={() => setMethod("transfer")}
              className={`min-h-10 flex-1 rounded-full px-3 text-meta font-semibold transition-colors ${
                method === "transfer" ? "bg-ink text-on-ink" : "hover:bg-surface-alt"
              }`}
            >
              Bank transfer
            </button>
            <button
              type="button"
              aria-pressed={method === "card"}
              disabled={!cardEnabled}
              onClick={() => setMethod("card")}
              className={`min-h-10 flex-1 rounded-full px-3 text-meta font-semibold transition-colors disabled:cursor-not-allowed disabled:text-muted ${
                method === "card" ? "bg-ink text-on-ink" : "hover:bg-surface-alt disabled:hover:bg-transparent"
              }`}
            >
              Card{!cardEnabled && <span className="ml-1 text-micro font-normal">· soon</span>}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-meta text-muted">
              Your gift to <span className="font-semibold text-ink">{label}</span>
            </p>
            <p className="text-section font-semibold tabular-nums" aria-live="polite">
              {money || "—"}
            </p>
          </div>

          {method === "transfer" ? (
            <div className="mt-4">
              <p className="mb-1 text-meta font-semibold">Send your {currency} gift to:</p>
              <Account currency={currency} />
              <p className="mt-3 rounded-card bg-surface-alt p-3 text-micro leading-relaxed">
                Tap the button below and we will email you these details with a reference to quote, then match your
                gift when it arrives.
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-card bg-surface-alt p-3 text-meta leading-relaxed">
              You will be taken to Flutterwave to pay securely by card. We never see or store your card details.
            </p>
          )}

          {state.message && !state.ok && (
            <p role="alert" className="mt-4 rounded-card border border-danger/40 p-3 text-meta font-medium text-danger">
              {state.message}
            </p>
          )}

          <button
            disabled={pending}
            className="group mt-6 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-button font-semibold text-on-accent transition-colors duration-300 hover:bg-ink hover:text-on-ink disabled:cursor-progress disabled:opacity-70"
          >
            {pending ? "One moment…" : method === "transfer" ? "I'm giving by transfer. Email me the details" : `Donate ${money}`}
          </button>
          <p className="mt-4 text-center text-micro leading-relaxed text-muted">
            Please only use the account details shown on this page.
          </p>
        </div>
      </aside>
    </form>
  );
}
