"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";
import { subjects } from "@/lib/contact";
import { describedBy, fieldClass, FormField } from "@/components/ui/FormField";

const initial: ContactState = { status: "idle", values: { name: "", email: "", subject: "", message: "" } };

/**
 * Contact form: server-validated (Server Action), with pending, error,
 * success and "not delivered" states. Values survive a failed submission.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial);
  const id = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.status === "invalid" ? state.errors : {};
  const v = state.values;

  useEffect(() => {
    if (state.status === "invalid") {
      // Move focus to the first field with an error.
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    } else if (state.status !== "idle") {
      statusRef.current?.focus();
    }
  }, [state]);

  if (state.status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-4 outline-none">
        <span className="grid size-12 place-items-center rounded-full bg-accent text-card text-on-accent" aria-hidden="true">
          ✓
        </span>
        <h2 className="text-card font-medium">Thank you, your message has been sent.</h2>
        <p className="text-body text-muted">We will reply to you by email as soon as we can.</p>
      </div>
    );
  }

  const f = (name: keyof typeof v) => `${id}-${name}`;

  return (
    <form ref={formRef} action={action} noValidate className="flex flex-col gap-6" aria-busy={pending}>
      {(state.status === "not-configured" || state.status === "failed") && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-card border border-accent bg-accent/15 p-5 text-meta leading-relaxed outline-none"
        >
          <p className="font-semibold">Your message was not sent.</p>
          <p className="mt-1 text-ink/80">
            {state.status === "not-configured"
              ? "Our online inbox is not connected yet. Your message is still here, so you can copy it, or reach us using the details on this page."
              : "Something went wrong while sending. Your message is still here; please try again in a moment."}
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id={f("name")} label="Your name" required error={errors.name}>
          <input
            id={f("name")}
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            key={`name-${v.name}`}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy(f("name"), errors.name)}
            className={fieldClass(!!errors.name)}
          />
        </FormField>
        <FormField id={f("email")} label="Email address" required error={errors.email}>
          <input
            id={f("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={v.email}
            key={`email-${v.email}`}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy(f("email"), errors.email)}
            className={fieldClass(!!errors.email)}
          />
        </FormField>
      </div>

      <FormField id={f("subject")} label="What is it about?" required error={errors.subject}>
        <select
          id={f("subject")}
          name="subject"
          required
          defaultValue={v.subject}
          key={`subject-${v.subject}`}
          aria-invalid={!!errors.subject}
          aria-describedby={describedBy(f("subject"), errors.subject)}
          className={`${fieldClass(!!errors.subject)} min-h-12`}
        >
          <option value="" disabled>
            Choose a subject
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id={f("message")}
        label="Your message"
        required
        error={errors.message}
        hint="Please don't include bank details or other sensitive information."
      >
        <textarea
          id={f("message")}
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          key={`message-${v.message.length}`}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy(f("message"), errors.message, "hint")}
          className={`${fieldClass(!!errors.message)} resize-y`}
        />
      </FormField>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-micro text-muted">
          <span aria-hidden="true">*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-6 text-button font-semibold text-on-ink transition-colors duration-300 hover:bg-ink/85 disabled:cursor-progress disabled:opacity-80"
        >
          {pending ? "Sending…" : "Send message"}
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-accent text-on-accent"
          >
            {pending ? (
              <span className="size-4 animate-spin rounded-full border-2 border-ink border-t-transparent motion-reduce:animate-none" />
            ) : (
              "→"
            )}
          </span>
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? "Sending your message" : ""}
      </p>
    </form>
  );
}
