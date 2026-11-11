import Link from "next/link";
import type { CSSProperties } from "react";
import { Media } from "@/components/ui/Media";
import type { Program } from "@/lib/programs";

/**
 * Six-tile photo index under the Programmes hero. Each tile jumps to its
 * programme. Swipeable strip on small screens, six columns on desktop.
 */
export function ProgramFilmstrip({ programs }: { programs: Program[] }) {
  return (
    <nav aria-label="Jump to a programme" className="-mx-5 sm:-mx-8 lg:mx-0">
      <ol className="flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {programs.map((p, i) => (
          <li
            key={p.slug}
            className="load-fade-up w-44 shrink-0 snap-start sm:w-52 lg:w-auto"
            style={{ "--d": `${0.9 + i * 0.08}s` } as CSSProperties}
          >
            <Link
              href={`#${p.slug}`}
              className="group relative block overflow-hidden rounded-card"
            >
              <Media
                image={p.image}
                placeholder={p.imagePlaceholder}
                aspect="aspect-[3/4]"
                portrait
                sizes="(min-width: 1024px) 200px, 208px"
                imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-dark/85 via-dark/20 to-transparent transition-opacity duration-500 group-hover:opacity-90"
              />
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-on-dark">
                <span className="text-micro font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-meta leading-snug font-medium">{p.shortTitle}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
