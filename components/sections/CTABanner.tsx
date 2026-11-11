import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Photo } from "@/lib/media";
import { donateHref } from "@/lib/site";

type CTABannerProps = {
  eyebrow?: string;
  title: string;
  text?: ReactNode;
  image: Photo;
  /** Override the default Donate + Contact actions. */
  actions?: ReactNode;
};

/**
 * Closing call-to-action used at the end of inner pages: a photo panel with a
 * legibility scrim, a heading that rises in, and the primary actions.
 */
export function CTABanner({ eyebrow = "Support Our Work", title, text, image, actions }: CTABannerProps) {
  return (
    <section aria-labelledby="cta-title" className="bg-surface py-16 md:py-24">
      <Container>
        <div
          data-reveal="image"
          className="on-dark relative isolate overflow-hidden rounded-card bg-dark text-on-dark"
        >
          <Image
            src={image.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            style={{ objectPosition: image.position }}
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-dark/90 via-dark/70 to-dark/30" />
          <div className="flex min-h-[26rem] flex-col justify-end gap-6 px-6 py-12 sm:px-10 md:min-h-[30rem] lg:px-16 lg:py-16">
            <p className="text-meta font-medium" data-reveal="fade">
              <span aria-hidden="true">/ </span>
              {eyebrow}
              <span aria-hidden="true"> /</span>
            </p>
            <h2 id="cta-title" className="max-w-[18ch] text-section font-medium text-balance" data-reveal="split">
              <SplitText text={title} />
            </h2>
            {text && (
              <div
                className="max-w-[52ch] text-body text-on-dark/80"
                data-reveal="up"
                style={{ "--i": 2 } as CSSProperties}
              >
                {text}
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2" data-reveal="up" style={{ "--i": 3 } as CSSProperties}>
              {actions ?? (
                <>
                  <Button href={donateHref}>Donate Now</Button>
                  <Button href="/contact" variant="outline-light" arrow={false}>
                    Contact Us
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
