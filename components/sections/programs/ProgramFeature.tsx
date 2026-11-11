import { ViewTransition, type CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { ScopeList } from "@/components/ui/ScopeList";
import type { Program } from "@/lib/programs";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** One programme on the overview page: photo, story, verified scope, CTA. */
export function ProgramFeature({ program, index }: { program: Program; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <article
      id={program.slug}
      aria-labelledby={`${program.slug}-title`}
      className="scroll-mt-[calc(var(--header-h)+2rem)] border-t border-line pt-10 pb-16 first:border-t-0 first:pt-0 lg:pb-24"
    >
      {/* Shared element: morphs into the detail page's hero on navigation. */}
      <ViewTransition name={`program-photo-${program.slug}`} share="morph" default="none">
        <Media
          image={program.image}
          placeholder={program.imagePlaceholder}
          aspect="aspect-[16/10] md:aspect-[16/8]"
          sizes="(min-width: 1024px) 66vw, 100vw"
          reveal
          className="rounded-card"
        />
      </ViewTransition>
      <div className="mt-8 grid gap-10 md:grid-cols-12 md:gap-8 lg:mt-10">
        <div className="flex flex-col items-start gap-5 md:col-span-7">
          <p className="text-meta font-medium text-muted" data-reveal="fade">
            Programme {n} · From aim {index + 1} of our constitution
          </p>
          <h2 id={`${program.slug}-title`} className="text-section font-medium text-balance" data-reveal="split">
            <SplitText text={program.title} />
          </h2>
          <p className="max-w-[52ch] text-body text-muted" data-reveal="up" style={i(2)}>
            {program.summary}
          </p>
          <div data-reveal="up" style={i(3)}>
            <Button href={`/programs/${program.slug}`} variant="dark" size="sm" aria-label={`Learn more about ${program.title}`}>
              Learn More
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-8 rounded-card bg-surface-alt p-6 md:col-span-5">
          <ScopeList title="Who it serves" items={program.serves} i={2} />
          <ScopeList title="What it provides" items={program.provides} i={3} />
        </div>
      </div>
    </article>
  );
}
