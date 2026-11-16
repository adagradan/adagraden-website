"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 text-button font-semibold text-on-ink transition-colors hover:bg-ink/85 print:hidden"
    >
      Print receipt
    </button>
  );
}
