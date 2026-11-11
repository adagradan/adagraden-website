import type { CSSProperties, ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  breadcrumbs: Crumb[];
  title: string;
  intro?: ReactNode;
  /** Buttons / extra content under the intro. */
  children?: ReactNode;
  /** Right-hand visual (collage, image…). Omit for the compact text-only hero. */
  media?: ReactNode;
  /** Small aside under the title row (e.g. facts), full width. */
  footer?: ReactNode;
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Standard inner-page hero (rules.md §6): breadcrumb, page title, concise
 * intro, optional visual. Deliberately calmer than the homepage hero.
 * Animates on load (it is always above the fold).
 */
export function PageHero({ breadcrumbs, title, intro, children, media, footer }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="bg-surface">
      <Container className="pt-10 pb-16 md:pt-14 md:pb-20 lg:pb-24">
        <div className="load-fade-up" style={d(0.15)}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div
          className={`mt-10 grid gap-12 md:mt-14 ${media ? "lg:grid-cols-12 lg:items-center lg:gap-16" : ""}`}
        >
          <div className={`flex flex-col gap-6 ${media ? "lg:col-span-6" : "max-w-4xl"}`}>
            <h1 id="page-title" className="load-split max-w-[16ch] text-page font-medium text-balance">
              <SplitText text={title} />
            </h1>
            {intro && (
              <div className="load-fade-up max-w-[54ch] text-lead text-muted" style={d(0.75)}>
                {intro}
              </div>
            )}
            {children && (
              <div className="load-fade-up pt-2" style={d(0.9)}>
                {children}
              </div>
            )}
          </div>
          {media && <div className="lg:col-span-6">{media}</div>}
        </div>
        {footer && (
          <div className="load-fade-up mt-14 md:mt-20" style={d(1.05)}>
            {footer}
          </div>
        )}
      </Container>
    </section>
  );
}
