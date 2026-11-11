import Link from "next/link";
import type { CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Media } from "@/components/ui/Media";
import { ArrowUpRight } from "@/components/ui/icons";
import type { Aim } from "@/lib/constitution";
import { programs } from "@/lib/programs";

/**
 * The constitution's aims as large numbered rows (reference "01 / 02" list):
 * number · verbatim aim · the programme it became, with a thumbnail link.
 */
export function AimsList({ aims }: { aims: Aim[] }) {
  return (
    <ol className="border-b border-line">
      {aims.map((aim, i) => {
        const program = programs.find((p) => p.slug === aim.programSlug);
        return (
          <li
            key={aim.programSlug}
            className="group grid gap-6 border-t border-line py-8 md:grid-cols-12 md:items-center md:gap-8 lg:py-10"
          >
            <span
              aria-hidden="true"
              className="text-display font-normal md:col-span-2"
              data-reveal="split"
              style={{ "--d": "60ms" } as CSSProperties}
            >
              <SplitText text={String(i + 1).padStart(2, "0")} by="chars" />
            </span>
            <p
              className="text-body leading-relaxed md:col-span-6 lg:text-lead"
              data-reveal="up"
              style={{ "--i": 1 } as CSSProperties}
            >
              <span className="sr-only">Aim {i + 1}: </span>
              {aim.text}
              {aim.incomplete && (
                <span className="mt-2 block text-micro text-muted">
                  This objective ends mid-sentence in our constitution; its full wording will be confirmed.
                </span>
              )}
            </p>
            {program && (
              <Link
                href={`/programs/${program.slug}`}
                data-reveal="up"
                style={{ "--i": 2 } as CSSProperties}
                className="flex items-center gap-4 rounded-card p-2 transition-colors hover:bg-surface-alt md:col-span-4"
              >
                <Media
                  image={program.image}
                  placeholder={program.imagePlaceholder}
                  aspect="aspect-[4/3]"
                  sizes="112px"
                  className="w-24 shrink-0 rounded-inner sm:w-28"
                  imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-110"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-micro tracking-[0.08em] text-muted uppercase">Programme</span>
                  <span className="text-meta font-semibold">{program.title}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-accent transition-transform duration-300 group-hover:rotate-45 text-on-accent"
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
