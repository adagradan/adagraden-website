"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

type Program = { slug: string; title: string };

const PRESETS = [5000, 10000, 25000, 50000, 100000];
const MIN = 500;

/** Locale-independent ₦ formatting (server and browser ICU can differ). */
const naira = (n: number) => `₦${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

/**
 * Gift builder. There is NO payment integration (information-bank.md open
 * item #11), so "Continue" leads to an honest summary that says no payment has
 * been taken and shows how to complete the gift. Swap the confirmation step
 * for a real provider (e.g. a hosted checkout) once one is set up.
 */
export function DonationForm({ programs }: { programs: Program[] }) {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | "other">(25000);
  const [custom, setCustom] = useState("");
  const [designation, setDesignation] = useState("general");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"choose" | "confirm">("choose");
  const summaryRef = useRef<HTMLHeadingElement>(null);
  const customRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const amount = preset === "other" ? Number(custom.replace(/[^\d]/g, "")) : preset;
  const destination =
    designation === "general" ? "where it is needed most" : programs.find((p) => p.slug === designation)?.title;

  useEffect(() => {
    if (step === "confirm") summaryRef.current?.focus();
  }, [step]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || amount < MIN) {
      setError(`Please enter an amount of at least ${naira(MIN)}.`);
      customRef.current?.focus();
      return;
    }
    setError(null);
    setStep("confirm");
  };

  if (step === "confirm") {
    return (
      <div className="flex flex-col gap-6" aria-live="polite">
        <div>
          <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">Your gift</p>
          <h2 ref={summaryRef} tabIndex={-1} className="mt-3 text-card font-medium outline-none">
            {naira(amount)} {frequency === "monthly" ? "every month" : "one time"}, {destination}.
          </h2>
        </div>

        <div className="rounded-card border border-accent bg-accent/15 p-5 text-meta leading-relaxed">
          <p className="font-semibold">No payment has been taken.</p>
          <p className="mt-1 text-ink/80">
            Online payments are not available yet. To complete your gift, please
            use bank transfer or contact us and we will guide you.
          </p>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line text-meta">
          {[
            ["Account name", "ADA GRADAN COMPASSIONATE CARE HANDS FOUNDATION"],
            ["Bank details", "Shared directly when you contact us"],
            ["Reference", frequency === "monthly" ? "Monthly gift" : "Donation"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[8rem_1fr] gap-3 bg-surface px-4 py-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="text-micro leading-relaxed text-muted">
          Our constitution requires a bank account in
          the Foundation&apos;s own name. Please confirm the account details with
          us directly before making a transfer.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-button font-semibold text-on-ink transition-colors hover:bg-ink/85"
          >
            Contact us to give
          </Link>
          <button
            type="button"
            onClick={() => setStep("choose")}
            className="inline-flex min-h-12 items-center rounded-full border border-ink/20 px-6 text-button font-semibold transition-colors hover:border-ink"
          >
            Change gift
          </button>
        </div>
      </div>
    );
  }

  const tab = (value: "once" | "monthly", label: string) => (
    <label
      className={`relative flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full text-meta font-semibold transition-colors duration-300 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
        frequency === value ? "bg-ink text-on-ink" : "text-ink hover:bg-surface-alt"
      }`}
    >
      <input
        type="radio"
        name="frequency"
        value={value}
        checked={frequency === value}
        onChange={() => setFrequency(value)}
        className="sr-only"
      />
      {label}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-7">
      <fieldset>
        <legend className="sr-only">How often would you like to give?</legend>
        <div className="flex gap-1 rounded-full border border-line p-1">
          {tab("once", "Give once")}
          {tab("monthly", "Give monthly")}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-meta font-semibold">Choose an amount</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <label
              key={p}
              className={`flex min-h-12 cursor-pointer items-center justify-center rounded-card border text-meta font-semibold transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
                preset === p ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name="amount"
                value={p}
                checked={preset === p}
                onChange={() => {
                  setPreset(p);
                  setError(null);
                }}
                className="sr-only"
              />
              {naira(p)}
            </label>
          ))}
          <label
            className={`flex min-h-12 cursor-pointer items-center justify-center rounded-card border text-meta font-semibold transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink ${
              preset === "other" ? "border-ink bg-ink text-on-ink" : "border-line hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name="amount"
              value="other"
              checked={preset === "other"}
              onChange={() => {
                setPreset("other");
                requestAnimationFrame(() => customRef.current?.focus());
              }}
              className="sr-only"
            />
            Other
          </label>
        </div>

        {preset === "other" && (
          <div className="mt-3">
            <label htmlFor={`${id}-custom`} className="text-meta font-medium">
              Your amount (₦)
            </label>
            <div
              className={`mt-2 flex min-h-12 items-center rounded-card border px-4 focus-within:border-ink ${
                error ? "border-danger" : "border-line"
              }`}
            >
              <span aria-hidden="true" className="text-body font-semibold text-muted">
                ₦
              </span>
              <input
                ref={customRef}
                id={`${id}-custom`}
                inputMode="numeric"
                autoComplete="off"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setError(null);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-err` : `${id}-hint`}
                placeholder="e.g. 15,000"
                className="ml-2 w-full bg-transparent py-3 text-body outline-none"
              />
            </div>
            {!error && (
              <p id={`${id}-hint`} className="mt-2 text-micro text-muted">
                Minimum {naira(MIN)}.
              </p>
            )}
          </div>
        )}
        {error && (
          <p id={`${id}-err`} role="alert" className="mt-2 text-meta font-medium text-danger">
            {error}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={`${id}-dest`} className="text-meta font-semibold">
          Where should it go?
        </label>
        <select
          id={`${id}-dest`}
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="mt-3 min-h-12 w-full rounded-card border border-line bg-surface px-4 text-meta focus:border-ink focus:outline-none"
        >
          <option value="general">Where it is needed most</option>
          {programs.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="group inline-flex min-h-13 items-center justify-between gap-3 rounded-full bg-accent py-1.5 pr-1.5 pl-6 text-button font-semibold text-on-accent transition-colors duration-300 hover:bg-ink hover:text-on-ink"
      >
        Continue{amount >= MIN ? ` with ${naira(amount)}${frequency === "monthly" ? " / month" : ""}` : ""}
        <span
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-full bg-on-accent text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-accent group-hover:text-on-accent"
        >
          →
        </span>
      </button>
      <p className="-mt-3 text-center text-micro text-muted">
        You will not be charged. Next, we show you how to complete your gift.
      </p>
    </form>
  );
}
