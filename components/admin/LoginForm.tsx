"use client";

import { useActionState } from "react";
import { requestLinkAction, type ActionState } from "@/app/admin/actions";
import { fieldClass } from "@/components/ui/FormField";

const init: ActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLinkAction, init);
  if (state.ok)
    return (
      <p role="status" className="rounded-card bg-accent/15 p-4 text-meta leading-relaxed">
        {state.message}
      </p>
    );
  return (
    <form action={action} className="flex flex-col gap-4">
      <label htmlFor="admin-email" className="text-meta font-semibold">
        Admin email address
      </label>
      <input id="admin-email" name="email" type="email" required autoComplete="email" autoFocus className={fieldClass(!!state.message)} />
      {state.message && (
        <p role="alert" className="text-meta font-medium text-danger">
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-button font-semibold text-on-ink transition-colors hover:bg-ink/85 disabled:opacity-70"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
