"use client";

import { useState } from "react";
import { MapPin } from "@/components/ui/icons";

/**
 * Click-to-load map. Google Maps is a third-party service, so nothing is
 * requested from Google until the visitor asks for the map.
 */
export function MapEmbed({ query, label }: { query: string; label: string }) {
  const [show, setShow] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="relative min-h-96 overflow-hidden rounded-card border border-line bg-surface-alt md:aspect-[16/9] md:min-h-0">
      {show ? (
        <iframe
          title={`Map: ${label}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          {/* Decorative contour pattern */}
          <svg aria-hidden="true" className="absolute inset-0 size-full text-ink/[0.06]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
            {Array.from({ length: 9 }, (_, k) => (
              <ellipse key={k} cx="200" cy="150" rx={30 + k * 28} ry={20 + k * 18} fill="none" stroke="currentColor" strokeWidth="1.5" />
            ))}
          </svg>
          <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-accent text-on-accent ring-[10px] ring-accent/25">
            <MapPin className="size-6" />
          </span>
          <p className="relative max-w-[30ch] text-meta font-medium">{label}</p>
          <div className="relative flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-meta font-semibold text-on-ink transition-colors hover:bg-ink/85"
            >
              Load map
            </button>
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-ink/20 bg-surface px-5 text-meta font-semibold transition-colors hover:border-ink"
            >
              Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className="relative text-micro text-muted">Loading the map shares your visit with Google.</p>
        </div>
      )}
    </div>
  );
}
