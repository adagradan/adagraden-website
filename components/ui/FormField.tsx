import type { ReactNode } from "react";

/**
 * Shared form field wrapper: visible label, optional hint, inline error wired
 * up with aria-describedby / aria-invalid by the caller via the returned ids.
 */
export function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-meta font-semibold">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-muted">
            *
          </span>
        ) : (
          <span className="ml-1 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-meta font-medium text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-micro text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Field control classes, shared by inputs, selects and textareas. */
export const fieldClass = (invalid?: boolean) =>
  `w-full rounded-card border bg-surface px-4 py-3 text-body transition-colors placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-ink/10 ${
    invalid ? "border-danger focus:border-danger" : "border-line hover:border-ink/30 focus:border-ink"
  }`;

export const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;
