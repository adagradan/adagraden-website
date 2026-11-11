import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { photos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Shown for unmatched URLs — including pages still being built (About,
 * Programmes, News, Contact, Donate), so navigation always lands somewhere
 * designed and the page transition plays.
 */
export default function NotFound() {
  return (
    <PageTransition>
      <section aria-labelledby="nf-title" className="bg-surface">
        <Container className="grid min-h-[calc(100svh-var(--header-h))] items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col items-start gap-6 lg:col-span-6">
            <p className="load-fade-up text-meta font-medium" style={{ "--d": "0.2s" } as CSSProperties}>
              <span aria-hidden="true">/ </span>404<span aria-hidden="true"> /</span>
            </p>
            <h1 id="nf-title" className="load-split max-w-[14ch] text-page font-medium text-balance">
              <SplitText text="This Page Isn't Here Yet" />
            </h1>
            <p
              className="load-fade-up max-w-[46ch] text-body text-muted"
              style={{ "--d": "0.8s" } as CSSProperties}
            >
              We are still building parts of this website, or the link may be
              incorrect. Please head back to the homepage to continue.
            </p>
            <div className="load-fade-up pt-2" style={{ "--d": "0.95s" } as CSSProperties}>
              <Button href="/" variant="dark">
                Back to Home
              </Button>
            </div>
          </div>
          <Media
            image={photos.communityWomen}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 45vw, 100vw"
            reveal
            className="rounded-card lg:col-span-6"
          />
        </Container>
      </section>
    </PageTransition>
  );
}
