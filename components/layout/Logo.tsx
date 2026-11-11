import Link from "next/link";
import { org } from "@/lib/site";

/**
 * Logo concept (awaiting the Foundation's approval — information-bank.md open
 * item #8). Master files live in /public/brand. The hands use currentColor so
 * the mark follows the theme; the held circle is always the brand yellow.
 */
const PALM =
  "M9 14c-4 0-5.5 4-5.5 9C3.5 43 16 56.5 29.8 57.5c.9.07 1.5-.6 1.5-1.5v-5.3c0-.8-.6-1.4-1.4-1.5C19.3 48 14 38.5 14.5 22c.1-5-1.5-8-5.5-8z";

export function Mark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d={PALM} />
        <path d={PALM} transform="translate(64 0) scale(-1 1)" />
      </g>
      <circle cx="32" cy="28" r="9" className="fill-accent" />
    </svg>
  );
}

/** `compact`: hide the descriptor on small screens (header). */
export function Logo({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const sub = tone === "dark" ? "text-on-dark-muted" : "text-muted";
  return (
    <Link
      href="/"
      className="group inline-flex min-h-11 items-center gap-3"
      aria-label={`${org.name}, home`}
    >
      <Mark className="size-10 shrink-0 transition-transform duration-500 ease-out-soft group-hover:-rotate-6 sm:size-11" />
      <span className="flex flex-col leading-none">
        <span className="text-card font-extrabold tracking-tight">
          {org.shortWordmark}
          <span className="text-accent" aria-hidden="true">.</span>
        </span>
        <span
          className={`mt-1 text-micro font-semibold tracking-[0.08em] uppercase ${sub} ${compact ? "hidden sm:block" : ""}`}
        >
          {org.wordmarkSub}
        </span>
      </span>
    </Link>
  );
}
