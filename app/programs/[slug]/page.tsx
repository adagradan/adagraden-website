import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { NewsCard } from "@/components/cards/NewsCard";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScopeList } from "@/components/ui/ScopeList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aims } from "@/lib/constitution";
import { photos } from "@/lib/media";
import { newsFor } from "@/lib/news";
import { programs } from "@/lib/programs";
import { donateHref, org } from "@/lib/site";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return { title: "Page not found" };
  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/programs/${slug}` },
    openGraph: {
      url: `/programs/${slug}`,
      title: `${program.title} | ${org.name}`,
      description: program.summary,
      images: program.image ? [{ url: program.image.src, alt: program.image.alt }] : undefined,
    },
  };
}

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const index = programs.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const program = programs[index];
  const aim = aims[index];
  const n = String(index + 1).padStart(2, "0");
  const prev = programs[(index - 1 + programs.length) % programs.length];
  const next = programs[(index + 1) % programs.length];
  const related = [next, programs[(index + 2) % programs.length]];
  const article = newsFor(program.slug);

  return (
    <PageTransition>
      {/* 1 — Image hero */}
      {/* No solid background when there is a photo: during navigation the page
          snapshot paints above the morphing photo, and an opaque fill would
          black it out. The scrim alone keeps text legible. */}
      <section
        aria-labelledby="page-title"
        className={`on-dark relative isolate overflow-hidden text-on-dark ${program.image ? "" : "bg-dark"}`}
      >
        {program.image && (
          <ViewTransition name={`program-photo-${program.slug}`} share="morph" default="none">
            <div className="parallax-hero absolute inset-0 -z-20">
              <Image
                src={program.image.src}
                alt={program.image.alt}
                fill
                preload
                sizes="100vw"
                placeholder="blur"
                blurDataURL={program.image.blurDataURL}
                style={{ objectPosition: program.image.position }}
                // No load zoom here: the shared-element morph is the entrance, and a
                // fade-from-dark after it lands would flash the hero black.
                className="object-cover"
              />
            </div>
          </ViewTransition>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-dark/75 via-dark/60 to-dark/90 md:via-dark/35"
        />
        <Container className="flex min-h-[min(calc(88svh-var(--header-h)),44rem)] flex-col justify-between gap-16 pt-10 pb-12 md:pt-14 lg:pb-16">
          <div className="load-fade-up" style={d(0.2)}>
            <Breadcrumbs
              tone="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "Programmes", href: "/programs" },
                { label: program.shortTitle },
              ]}
            />
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-5 lg:col-span-8">
              <p className="load-fade-up text-meta font-medium text-accent" style={d(0.3)}>
                Programme {n}
              </p>
              <h1 id="page-title" className="load-split max-w-[16ch] text-page font-medium text-balance">
                <SplitText text={program.title} />
              </h1>
            </div>
            <div className="flex flex-col items-start gap-6 lg:col-span-4">
              <p className="load-fade-up text-body text-on-dark/85" style={d(0.85)}>
                {program.summary}
              </p>
              <div className="load-fade-up" style={d(1)}>
                <Button href={donateHref}>Support This Programme</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2 — The aim + verified scope */}
      <Section aria-labelledby="aim-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <SectionHeading id="aim-title" eyebrow="The Aim Behind It" title="Written Into Our Constitution" />
            <figure data-reveal="up" style={i(2)} className="relative rounded-card bg-surface-alt p-8 md:p-10">
              <span
                aria-hidden="true"
                className="absolute top-6 right-6 text-stat leading-none font-medium text-ink/10 select-none md:top-8 md:right-8"
              >
                {n}
              </span>
              <blockquote className="max-w-[46ch] pr-12 text-lead leading-relaxed font-medium md:pr-16 md:text-card md:leading-snug">
                <p>&ldquo;{aim.text}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 text-meta text-muted">
                Aim {index + 1}, Article 3 of our Constitution
                {aim.incomplete && " · this objective ends mid-sentence in our constitution"}
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-col gap-10 self-end rounded-card border border-line p-8 lg:col-span-5">
            <ScopeList title="Who it serves" items={program.serves} i={1} />
            <ScopeList title="What it provides" items={program.provides} i={2} />
          </div>
        </Container>
      </Section>

      {/* 3 — Why it matters: independent reporting on this cause + where we stand */}
      <Section tone="alt" aria-labelledby="matters-title">
        <Container>
          <SectionHeading
            id="matters-title"
            eyebrow="Why It Matters"
            title={article ? "The Need, In The News" : "Where Things Stand"}
          />
          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
            {article && (
              <div className="lg:col-span-7">
                <NewsCard article={article} />
              </div>
            )}
            <div
              data-reveal="up"
              style={i(1)}
              className={`flex flex-col justify-between gap-8 rounded-card bg-dark p-6 text-on-dark lg:p-8 ${
                article ? "lg:col-span-5" : "lg:col-span-8"
              }`}
            >
              <div>
                <p className="text-micro font-semibold tracking-[0.08em] text-on-dark-muted uppercase">Our progress</p>
                <p className="mt-4 text-body">
                  We are a young foundation. As this programme gets
                  under way, we will publish its activities and verified outcomes
                  here, rather than make claims we cannot yet support.
                </p>
              </div>
              {article && (
                <p className="text-micro leading-relaxed text-on-dark-muted">
                  The article is independent reporting by {article.outlet}. It is
                  not about the Foundation&apos;s own work.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4 — Related programmes */}
      <Section tone="dark" aria-labelledby="related-title">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading id="related-title" tone="dark" eyebrow="Keep Exploring" title="Related Programmes" />
            <Button href="/programs" variant="outline-light" size="sm" className="shrink-0 self-start sm:self-auto">
              All Programmes
            </Button>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {related.map((p) => (
              <ProgramCard key={p.slug} program={p} index={programs.indexOf(p)} />
            ))}
          </div>

          {/* Previous / next */}
          <nav aria-label="Programme navigation" className="mt-12 grid grid-cols-2 border-t border-line-dark pt-6">
            <Link href={`/programs/${prev.slug}`} className="group flex flex-col gap-1 pr-4">
              <span className="text-micro text-on-dark-muted">
                <span aria-hidden="true" className="inline-block transition-transform group-hover:-translate-x-1">←</span>{" "}
                Previous
              </span>
              <span className="text-meta font-medium sm:text-body">{prev.title}</span>
            </Link>
            <Link href={`/programs/${next.slug}`} className="group flex flex-col items-end gap-1 pl-4 text-right">
              <span className="text-micro text-on-dark-muted">
                Next{" "}
                <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="text-meta font-medium sm:text-body">{next.title}</span>
            </Link>
          </nav>
        </Container>
      </Section>

      {/* 5 — CTA */}
      <CTABanner
        title={`Help Us Begin ${program.shortTitle}`}
        text="Every gift is recorded, applied only to our charitable objectives and independently audited each year."
        image={index === 3 ? photos.motherCradlingBaby : photos.familyMotherChild}
      />
    </PageTransition>
  );
}
