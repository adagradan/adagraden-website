"use client";

import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};
/** Server snapshot is always false, so SSR and hydration agree. */
const useCanNativeShare = () =>
  useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);

type ShareButtonsProps = { url: string; title: string };

const btn =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-meta font-medium transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-on-ink";

/**
 * Share links that need no third-party scripts: WhatsApp (most-used channel
 * in Nigeria), X, Facebook, LinkedIn, copy link, and the device share sheet
 * where the browser supports it.
 */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useCanNativeShare();
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — the address bar still works */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-micro font-semibold tracking-[0.08em] text-muted uppercase">Share this article</p>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} className={btn}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </li>
        {canNativeShare && (
          <li>
            <button
              type="button"
              onClick={() => navigator.share({ title, url }).catch(() => {})}
              className={btn}
            >
              More…
            </button>
          </li>
        )}
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </p>
    </div>
  );
}
