"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { pledgeTransfer, startCardDonation, type DonateState } from "@/app/(site)/donate/actions";
import { fieldClass } from "@/components/ui/FormField";
import { BANK, CAUSES, CURRENCIES, CURRENCY_CODES, causeLabel, formatMoney, type CurrencyCode } from "@/lib/donate";

const init: DonateState = { ok: false, message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-meta font-medium transition-colors duration-200 ${
    on ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink"
  }`;

/* --------------------------------------------------------------- pieces */

function SectionLabel({ children }: { children: ReactNode }) {
  return <legend className="mb-4 text-body font-semibold">{children}</legend>;
}

/** "Step 1 of 2" progress, visible and announced. */
function StepTrack({ current }: { current: 1 | 2 }) {
  const steps = ["Your details", "Your gift"];
  return (
    <ol aria-label={`Step ${current} of 2`} className="flex flex-wrap items-center gap-3 text-micro font-semibold">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={s} aria-current={state === "current" ? "step" : undefined} className="flex items-center gap-3">
            <span
              className={`grid size-6 place-items-center rounded-full ${
                state === "todo" ? "border border-line text-muted" : state === "done" ? "bg-ink text-on-ink" : "bg-accent text-on-accent"
              }`}
            >
              {state === "done" ? "✓" : n}
            </span>
            <span className={state === "todo" ? "text-muted" : ""}>{s}</span>
            {n < steps.length && <span aria-hidden="true" className="h-px w-8 bg-line" />}
          </li>
        );
      })}
    </ol>
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

/**
 * Fraud guard: a donor's bank shows the account name before money moves. If a
 * number on this page were ever tampered with, this check stops the transfer.
 */
function NameCheck({ currency }: { currency: CurrencyCode }) {
  return (
    <div className="mt-3 flex gap-3 rounded-card border border-ink/15 p-3 text-micro leading-relaxed" role="note">
      <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-ink font-semibold text-on-ink">
        !
      </span>
      <p>
        <strong className="font-semibold">Before you send:</strong>{" "}
        {currency === "NGN"
          ? "your bank app will show the account name. "
          : "check the account name and SWIFT code with your bank. "}
        It must read <strong className="font-semibold uppercase">{BANK.accountName}</strong>. If it shows any other name,
        stop and contact us.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ form */

/**
 * Two steps:
 *  1. Name (optional = anonymous) and email (required).
 *  2. What it supports, currency, amount, payment method and — only now —
 *     the account details.
 */
export function DonationForm({ initialCause = "all", cardEnabled = false }: { initialCause?: string; cardEnabled?: boolean }) {
  const [tState, tAction, tPending] = useActionState(pledgeTransfer, init);
  const [cState, cAction, cPending] = useActionState(startCardDonation, init);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [amount, setAmount] = useState<number | "">(CURRENCIES.NGN.presets[1]);
  const [cause, setCause] = useState(CAUSES.some((c) => c.id === initialCause) ? initialCause : "all");
  const [method, setMethod] = useState<"transfer" | "card">("transfer");
  const [errors, setErrors] = useState<{ email?: string; amount?: string }>({});
  const [dismissed, setDismissed] = useState(false);
  const stepTwoRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const id = useId();

  const min = CURRENCIES[currency].min;
  const money = typeof amount === "number" && amount > 0 ? formatMoney(amount, currency) : "";
  const pending = tPending || cPending;
  const state = method === "card" ? cState : tState;
  const label = causeLabel(cause);
  const showThanks = Boolean(tState.ok && tState.reference && !dismissed);

  const changeCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    setAmount(CURRENCIES[c].presets[1]);
    setErrors((e) => ({ ...e, amount: undefined }));
  };

  useEffect(() => {
    if (showThanks) thanksRef.current?.focus();
  }, [showThanks]);

  const continueToStepTwo = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address. We send your transfer details and receipt there.";
    setErrors(next);
    if (next.email) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    setEmail(email.trim());
    setName(name.trim());
    setStep(2);
    requestAnimationFrame(() => stepTwoRef.current?.focus());
  };

  /* ------------------------- after a transfer pledge ------------------------- */
  if (showThanks) {
    return (
      <div className="panel-swap mx-auto max-w-2xl rounded-card border border-line bg-surface p-6 sm:p-10">
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
          <NameCheck currency={currency} />
        </div>

        <ol className="mt-8 flex flex-col gap-3 text-meta leading-relaxed">
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-micro text-on-ink">1</span>
            Send {money} from your bank app, quoting the reference above.
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-micro text-on-ink">2</span>
            We match your gift when it arrives and send you a thank-you receipt.
          </li>
        </ol>

        <p role="status" className={`mt-6 rounded-card p-4 text-meta ${tState.emailed ? "bg-surface-alt" : "border border-accent bg-accent/15"}`}>
          {tState.emailed
            ? `We have also emailed these details to ${email}. Check your spam folder if you can't see them.`
            : "We couldn't email these details just now, so please take a screenshot of this page."}
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            setStep(1);
          }}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ink/20 text-button font-semibold transition-colors hover:border-ink"
        >
          Make another gift
        </button>
      </div>
    );
  }

  /* ------------------ step 1: who is giving, and how much ------------------ */
  if (step === 1) {
    return (
      <form
        onSubmit={continueToStepTwo}
        noValidate
        className="panel-swap mx-auto max-w-2xl rounded-card border border-line bg-surface p-6 shadow-[0_24px_64px_-24px_rgb(0_0_0/0.18)] sm:p-10"
      >
        <StepTrack current={1} />
        <h2 className="mt-6 text-section font-medium">First, tell us who is giving</h2>
        <p className="mt-2 text-meta text-muted">Next, you choose your gift and see where to send it.</p>

        <div className="mt-8 flex flex-col gap-8">
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-name`} className="text-meta font-semibold">
                  Name <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id={`${id}-name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={100}
                  aria-describedby={`${id}-name-hint`}
                  className={fieldClass()}
                />
                <p id={`${id}-name-hint`} className="text-micro text-muted">
                  Leave blank to give anonymously.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={`${id}-email`} className="text-meta font-semibold">
                  Email address <span aria-hidden="true" className="text-muted">*</span>
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((x) => ({ ...x, email: undefined }));
                  }}
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${id}-email-error` : `${id}-email-hint`}
                  className={fieldClass(!!errors.email)}
                />
                {errors.email ? (
                  <p id={`${id}-email-error`} role="alert" className="text-meta font-medium text-danger">
                    {errors.email}
                  </p>
                ) : (
                  <p id={`${id}-email-hint`} className="text-micro text-muted">
                    For your account details, reference and receipt.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        <button className="mt-10 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-button font-semibold text-on-accent transition-colors duration-300 hover:bg-ink hover:text-on-ink">
          Continue to your gift <span aria-hidden="true">→</span>
        </button>
      </form>
    );
  }

  /* ------------- step 2: what it supports, method, account details ------------- */
  return (
    <form
      action={method === "card" ? cAction : tAction}
      onSubmit={(e) => {
        if (typeof amount !== "number" || !Number.isFinite(amount) || amount < min) {
          e.preventDefault();
          setErrors((x) => ({ ...x, amount: `Please enter an amount of at least ${formatMoney(min, currency)}.` }));
          document.getElementById(`${id}-amount`)?.focus();
          return;
        }
        setDismissed(false);
      }}
      noValidate
      className="panel-swap grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {/* Step 1 answers, carried into the submission */}
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="cause" value={cause} />

      <div ref={stepTwoRef} tabIndex={-1} className="flex flex-col gap-8 rounded-card border border-line bg-surface p-5 outline-none sm:p-8 lg:col-span-7">
        <StepTrack current={2} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-surface-alt p-4">
          <p className="flex items-center gap-3 text-meta">
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-ink text-micro font-semibold text-on-ink">
              ✓
            </span>
            <span>
              Giving as <strong>{name || "Anonymous"}</strong>
              <span className="block text-micro text-muted">{email}</span>
            </span>
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex min-h-10 items-center rounded-full px-3 text-meta font-semibold underline underline-offset-4 hover:text-muted"
          >
            Change
          </button>
        </div>

        <fieldset>
          <SectionLabel>What should it support?</SectionLabel>
          <select
            aria-label="What should your gift support?"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className={`${fieldClass()} min-h-12 sm:hidden`}
          >
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

        <fieldset>
          <SectionLabel>Currency</SectionLabel>
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
        </fieldset>

        <fieldset>
          <SectionLabel>Amount</SectionLabel>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested amounts">
            {CURRENCIES[currency].presets.map((a) => (
              <button
                type="button"
                key={a}
                aria-pressed={amount === a}
                onClick={() => {
                  setAmount(a);
                  setErrors((x) => ({ ...x, amount: undefined }));
                }}
                className={chip(amount === a)}
              >
                {formatMoney(a, currency)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex max-w-xs flex-col gap-2">
            <label htmlFor={`${id}-amount`} className="text-meta font-semibold">
              Or enter an amount ({currency}) <span aria-hidden="true" className="text-muted">*</span>
            </label>
            <div
              className={`flex items-center gap-2 rounded-card border bg-surface px-4 focus-within:border-ink ${
                errors.amount ? "border-danger" : "border-line"
              }`}
            >
              <span aria-hidden="true" className="font-semibold text-muted">
                {CURRENCIES[currency].symbol}
              </span>
              <input
                id={`${id}-amount`}
                type="number"
                inputMode="decimal"
                min={min}
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value === "" ? "" : Number(e.target.value));
                  setErrors((x) => ({ ...x, amount: undefined }));
                }}
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? `${id}-amount-error` : `${id}-amount-hint`}
                className="w-full bg-transparent py-3 text-body outline-none"
              />
            </div>
            {errors.amount ? (
              <p id={`${id}-amount-error`} role="alert" className="text-meta font-medium text-danger">
                {errors.amount}
              </p>
            ) : (
              <p id={`${id}-amount-hint`} className="text-micro text-muted">
                Minimum {formatMoney(min, currency)}
              </p>
            )}
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
              <NameCheck currency={currency} />
              <p className="mt-3 rounded-card bg-surface-alt p-3 text-micro leading-relaxed">
                Tap the button below and we will email you these details with a reference to quote, then match your gift when it
                arrives.
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-card bg-surface-alt p-3 text-meta leading-relaxed">
              You will be taken to Flutterwave to pay securely by card. We never see or store your card details.
              {!name && " Please go back and add your name: it appears on your card receipt."}
            </p>
          )}

          {state.message && !state.ok && (
            <p role="alert" className="mt-4 rounded-card border border-danger/40 p-3 text-meta font-medium text-danger">
              {state.message}
            </p>
          )}

          <button
            disabled={pending}
            className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 text-button font-semibold text-on-accent transition-colors duration-300 hover:bg-ink hover:text-on-ink disabled:cursor-progress disabled:opacity-70"
          >
            {pending ? "One moment…" : method === "transfer" ? "I'm giving by transfer. Email me the details" : `Donate ${money}`}
          </button>
          <p className="mt-4 text-center text-micro leading-relaxed text-muted">Please only use the account details shown on this page.</p>
        </div>
      </aside>
    </form>
  );
}
