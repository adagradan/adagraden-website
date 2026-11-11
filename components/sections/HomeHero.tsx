import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { ShieldCheck } from "@/components/ui/icons";
import { photos } from "@/lib/media";
import { donateHref, org } from "@/lib/site";

/** Illustrative photo — swap for a real, consented photo of the Foundation's work when available. */
const heroImage = photos.heroMotherAndChild;

/** Animation delay (seconds) for the load choreography. */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate overflow-hidden bg-dark text-on-dark"
    >
      {heroImage ? (
        /* Outer: scroll parallax. Inner image: load zoom-out from darkness. */
        <div className="parallax-hero absolute inset-0 -z-20">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          preload
          sizes="100vw"
          placeholder="blur"
          blurDataURL={heroImage.blurDataURL}
          style={{ objectPosition: heroImage.position }}
          className="load-hero-img object-cover"
        />
        </div>
      ) : (
        <p className="absolute top-5 right-5 z-10 hidden max-w-[34ch] rounded-card border border-line-dark bg-dark-raised px-4 py-2 text-right text-micro font-medium text-on-dark-muted md:block">
          [PLACEHOLDER: hero photograph — authentic, consented community photo]
        </p>
      )}
      {/* Contrast overlay so text stays legible on any photo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-dark/75 via-dark/60 to-dark/80 md:bg-linear-to-r md:from-dark/80 md:via-dark/45 md:to-dark/10" />

      <Container className="flex min-h-[min(calc(100svh-var(--header-h)),48rem)] flex-col justify-between gap-14 pt-20 pb-10 md:pt-28 lg:pt-36 lg:pb-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <h1 id="hero-title" className="load-split max-w-[15ch] text-hero font-medium text-balance">
            <SplitText text="Compassionate Care For Those Who Need It Most" />
          </h1>
          <p className="load-fade-up max-w-[46ch] text-meta text-on-dark/85 sm:text-body" style={d(0.95)}>
            {org.name} is a non-profit providing educational support,
            vocational training, small business setup, elderly stipends and
            medical assistance to the people who need it most.
          </p>
          <div className="load-fade-up flex flex-wrap items-center gap-x-6 gap-y-3 pt-3" style={d(1.1)}>
            <Button href={donateHref} variant="outline-light" size="sm">
              Donate Now
            </Button>
            <Link
              href="/programs"
              className="inline-flex min-h-11 items-center text-meta font-medium underline decoration-on-dark/40 underline-offset-4 hover:decoration-on-dark"
            >
              Explore our programmes
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Reference: avatar stack + headline figure. We show a verified trust signal instead. */}
          <p className="load-fade-up flex items-center gap-3" style={d(1.35)}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-on-dark/80 bg-on-dark/10">
              <ShieldCheck className="size-5 text-accent" />
            </span>
            <span className="text-card leading-tight font-medium">
              Six programmes of care
              <span className="block text-meta font-normal text-on-dark/80">Education, skills, livelihoods, welfare and health</span>
            </span>
          </p>

          {/* Reference: supporter quote card. We show our (draft) mission. */}
          <figure className="load-slide-in flex max-w-md gap-4 rounded-card bg-dark/55 p-2.5 pr-5 backdrop-blur-md" style={d(1.45)}>
            <Media
              image={photos.childrenSmiling}
              aspect="aspect-square"
              sizes="128px"
              tone="dark"
              className="w-24 shrink-0 rounded-inner sm:w-32"
            />
            <div className="flex flex-col justify-between gap-3 py-1.5">
              <blockquote className="text-meta leading-relaxed text-on-dark">
                <p>
                  We care for orphans, widows, single parents, the elderly and
                  the critically ill.
                </p>
              </blockquote>
              <figcaption className="text-meta leading-snug">
                <span className="block font-medium">Our mission</span>
                <span className="text-micro text-on-dark-muted">{org.wordmarkSub}</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
