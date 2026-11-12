import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { ShieldCheck } from "@/components/ui/icons";
import { photos } from "@/lib/media";
import { beneficiaryHighlights, donateHref, org } from "@/lib/site";
import { programs } from "@/lib/programs";

/**
 * Reference "Our Impact" bento grid. The Foundation has no verified impact
 * figures yet (information-bank.md §7), so every tile shows a verified fact.
 * Swap in real figures here once the organisation supplies them.
 */

function StatTile({
  value,
  count,
  label,
  text,
  i,
  children,
}: {
  value?: string;
  /** Count up to this number when revealed. */
  count?: number;
  label: string;
  text?: string;
  i: number;
  children?: ReactNode;
}) {
  return (
    <div
      data-reveal="scale"
      style={{ "--i": i } as CSSProperties}
      className="flex flex-col justify-between gap-6 rounded-card border border-line bg-surface p-5 transition-shadow duration-500 hover:shadow-[0_12px_40px_-12px_rgb(0_0_0/0.15)]"
    >
      {children}
      {value && (
        <p className="text-stat font-medium tabular-nums">
          <span data-count={count}>{value}</span>
        </p>
      )}
      <div>
        <h3 className="text-meta font-semibold">{label}</h3>
        {text && <p className="mt-1.5 text-micro leading-relaxed text-muted">{text}</p>}
      </div>
    </div>
  );
}

/** Decorative concentric rings (reference avatar "orbit"); purely visual. */
function Orbit() {
  const dots = [
    "top-[6%] left-1/2",
    "top-1/2 left-[4%]",
    "top-1/2 left-[96%]",
    "top-[28%] left-[22%]",
    "top-[72%] left-[78%]",
    "top-[94%] left-1/2",
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-56">
      <div className="absolute inset-0 rounded-full border border-line-dark" />
      <div className="absolute inset-[22%] rounded-full border border-line-dark" />
      <div className="absolute inset-[42%] grid place-items-center rounded-full bg-accent text-on-accent">
        <ShieldCheck className="size-5" />
      </div>
      <div className="orbit-spin absolute inset-0">
        {dots.map((pos, i) => (
          <span
            key={pos}
            className={`absolute size-3 -translate-1/2 rounded-full border-2 border-dark ${pos} ${i % 2 ? "bg-on-dark-muted" : "bg-on-dark"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ImpactBento() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(13rem,auto))]">
      {/* Tall image card */}
      <div data-reveal="scale" style={{ "--i": 0 } as CSSProperties} className="on-dark relative isolate flex min-h-96 flex-col justify-between overflow-hidden rounded-card bg-dark p-5 text-on-dark lg:row-span-2">
        <Media
          image={photos.motherCradlingBaby}
          aspect=""
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          tone="dark"
          className="absolute! inset-0 -z-20"
        />
        {/* Legibility scrim: darkens top (text) and bottom (button) only. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-dark/80 via-dark/10 to-dark/70" />
        <p className="max-w-[24ch] text-meta leading-relaxed font-medium">
          Our work focuses on caring for orphans, widows, single parents, the
          elderly and the critically ill, with dignity.
        </p>
        <Button href={donateHref} variant="outline-light" size="sm" className="self-start">
          Donate Now
        </Button>
      </div>

      <StatTile
        i={1}
        value={org.registeredYear}
        label="Caring Since"
        text="Rooted in Owerri, Imo State."
      />

      {/* Tall dark card */}
      <div data-reveal="scale" style={{ "--i": 2 } as CSSProperties} className="on-dark flex flex-col justify-between gap-8 rounded-card bg-dark p-5 text-on-dark sm:row-span-2 lg:col-start-3 lg:row-start-1">
        <div>
          <p className="text-stat font-medium">
            Annual<span className="text-card text-on-dark-muted"> audit</span>
          </p>
          <h3 className="mt-3 text-meta font-semibold">Independently Audited</h3>
          <p className="mt-1.5 text-micro leading-relaxed text-on-dark-muted">
            Licensed auditors review our accounts each year. The report goes to
            our members at the Annual General Meeting.
          </p>
        </div>
        <Orbit />
      </div>

      <StatTile
        i={3}
        value={String(programs.length)}
        count={programs.length}
        label="Programme Areas"
        text="Each one set out in the objectives of our constitution."
      />

      <StatTile i={2} label="Who We Serve" text="The people our constitution commits us to care for.">
        <ul className="flex flex-wrap gap-1.5">
          {beneficiaryHighlights.map((g) => (
            <li key={g} className="rounded-full bg-surface-alt px-2.5 py-1 text-micro font-medium">
              {g}
            </li>
          ))}
        </ul>
      </StatTile>

      <StatTile
        i={4}
        value="2"
        count={2}
        label="Trustees"
        text="Our Chairman and Secretary, appointed under our constitution."
      />
    </div>
  );
}
