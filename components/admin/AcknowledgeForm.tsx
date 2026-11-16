"use client";

import { useActionState, useState } from "react";
import { acknowledgeAction, resendAcknowledgementAction, type ActionState } from "@/app/admin/actions";
import { fieldClass } from "@/components/ui/FormField";

const init: ActionState = { ok: false, message: "" };

function Feedback({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-card p-3 text-meta ${state.ok ? "bg-accent/15" : "border border-danger/40 text-danger"}`}
    >
      {state.message}
    </p>
  );
}

export function AcknowledgeForm({
  reference,
  pledged,
  currency,
  symbol,
  email,
}: {
  reference: string;
  pledged: number;
  currency: string;
  symbol: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(acknowledgeAction, init);
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="reference" value={reference} />
      <div className="flex flex-col gap-2">
        <label htmlFor="received" className="text-meta font-semibold">
          Amount received ({currency})
        </label>
        <div className="flex items-center gap-2 rounded-card border border-line bg-surface px-4 focus-within:border-ink">
          <span aria-hidden="true" className="font-semibold text-muted">
            {symbol}
          </span>
          <input
            id="received"
            name="received"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="any"
            required
            defaultValue={pledged}
            aria-describedby="received-hint"
            className="w-full bg-transparent py-3 text-body outline-none"
          />
        </div>
        <p id="received-hint" className="text-micro text-muted">
          Pre-filled with the pledged amount. Change it if a different amount arrived.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="note" className="text-meta font-semibold">
          Internal note <span className="font-normal text-muted">(optional, not emailed)</span>
        </label>
        <textarea id="note" name="note" rows={2} maxLength={500} className={`${fieldClass()} resize-y`} />
      </div>

      <Feedback state={state} />

      {confirming ? (
        <div className="flex flex-col gap-3 rounded-card bg-surface-alt p-4">
          <p className="text-meta">
            This marks the gift as received and emails a thank-you receipt to <strong>{email}</strong>.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={pending}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-meta font-semibold text-on-accent transition-colors hover:bg-ink hover:text-on-ink disabled:opacity-70"
            >
              {pending ? "Acknowledging…" : "Yes, acknowledge and email"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-meta font-semibold hover:border-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-button font-semibold text-on-ink transition-colors hover:bg-ink/85"
        >
          Acknowledge donation
        </button>
      )}
    </form>
  );
}

export function ResendButton({ reference }: { reference: string }) {
  const [state, action, pending] = useActionState(resendAcknowledgementAction, init);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="reference" value={reference} />
      <Feedback state={state} />
      <button
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/20 px-5 text-meta font-semibold transition-colors hover:border-ink disabled:opacity-70"
      >
        {pending ? "Sending…" : "Resend acknowledgement email"}
      </button>
    </form>
  );
}
