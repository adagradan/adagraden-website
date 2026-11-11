import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import type { Program } from "@/lib/programs";

type ProgramCardProps = {
  program: Program;
  index: number;
  headingLevel?: "h2" | "h3";
};

/** Horizontal programme card for dark sections: image left, number/title/text/CTA right. */
export function ProgramCard({ program, index, headingLevel: H = "h3" }: ProgramCardProps) {
  return (
    <article
      data-reveal="up"
      style={{ "--i": index % 2 } as CSSProperties}
      className="group grid grid-cols-1 gap-5 rounded-card bg-dark-raised p-3 sm:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] sm:gap-6"
    >
      <Media
        image={program.image}
        reveal={(index % 2) + 1}
        placeholder={program.imagePlaceholder}
        aspect="aspect-[4/3] sm:aspect-auto sm:min-h-56"
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
        tone="dark"
        className="rounded-inner border border-line-dark"
        imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-105"
      />
      <div className="flex flex-col gap-2 px-2 pb-3 sm:px-0 sm:py-3 sm:pr-3">
        <p className="text-micro font-medium text-accent" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </p>
        <H className="text-card font-medium text-balance text-on-dark">{program.title}</H>
        <p className="text-meta leading-relaxed text-on-dark-muted">{program.summary}</p>
        <div className="mt-auto pt-4">
          <Button
            href={`/programs/${program.slug}`}
            variant="light"
            size="sm"
            arrow={false}
            aria-label={`Learn more about ${program.title}`}
          >
            Learn More
          </Button>
        </div>
      </div>
    </article>
  );
}
