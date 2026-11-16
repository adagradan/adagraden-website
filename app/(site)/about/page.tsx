import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { AboutCollage } from "@/components/sections/about/AboutCollage";
import { AimsList } from "@/components/sections/about/AimsList";
import { CTABanner } from "@/components/sections/CTABanner";
import { FactsStrip } from "@/components/sections/FactsStrip";
import { PageHero } from "@/components/sections/PageHero";
import { PartnersBand } from "@/components/sections/PartnersBand";
import { Timeline } from "@/components/sections/Timeline";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aims, governanceFacts, governingRoles, incomeSources, milestones } from "@/lib/constitution";
import { photos } from "@/lib/media";
import { donateHref, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Who we are: a Nigerian non-profit in Owerri, Imo State, caring for orphans, widows, single parents, the elderly and the critically ill.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: `About Us | ${org.name}` },
};

/** information-bank.md §4 — verified, consolidated beneficiary groups. */
const beneficiaryGroups = [
  "Orphans and abandoned children",
  "Underprivileged and destitute children",
  "Widows and widowers",
  "Single mothers and single fathers",
  "Less privileged men and women",
  "The elderly and vulnerable senior citizens",
  "People living with critical or chronic illness",
  "Destitute individuals",
];

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default function AboutPage() {
  return (
    <PageTransition>
      {/* 1 — Introduction */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        title="About Our Compassionate Care Foundation"
        intro={
          <p>
            {org.name} is a not-for-profit, non-political organisation providing
            educational support, vocational training, small business setup,
            elderly stipends and medical assistance to orphans, single parents,
            widows, the elderly and the critically ill.
          </p>
        }
        media={<AboutCollage />}
        footer={
          <FactsStrip
            facts={[
              { value: "Owerri, Imo State", label: "Where we are based" },
              { value: "6 programmes", label: "From education to medical care" },
              { value: "8 groups", label: "Of people our constitution commits us to" },
              { value: "Annual audit", label: "Of our accounts, by independent auditors" },
            ]}
          />
        }
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={donateHref}>Support Our Work</Button>
          <Button href="/programs" variant="outline" arrow={false}>
            Our Programmes
          </Button>
        </div>
      </PageHero>

      {/* 2 — Who we serve */}
      <Section tone="alt" aria-labelledby="serve-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <SectionHeading
              id="serve-title"
              eyebrow="Who We Serve"
              title="People Our Constitution Commits Us To Care For"
              intro="From children to the elderly, these are the people our constitution commits us to care for."
            />
            <Media
              image={photos.familyMotherChild}
              aspect="aspect-[4/3]"
              sizes="(min-width: 1024px) 38vw, 100vw"
              reveal
              className="rounded-card"
            />
          </div>
          <ul className="grid content-start gap-px self-center overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {beneficiaryGroups.map((g, n) => (
              <li
                key={g}
                data-reveal="up"
                style={i(n % 4)}
                className="flex min-h-28 flex-col justify-between gap-6 bg-surface p-6 transition-colors duration-300 hover:bg-accent/15"
              >
                <span aria-hidden="true" className="text-micro font-semibold text-muted">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="text-body font-medium">{g}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3 — Mission, vision & values */}
      <Section aria-labelledby="guides-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionHeading
            id="guides-title"
            eyebrow="What Guides Us"
            title="Our Mission And Purpose"
            className="lg:col-span-4"
          />
          <div className="flex flex-col gap-10 lg:col-span-8">
            <figure data-reveal="up" className="border-l-2 border-accent pl-6 md:pl-8">
              <figcaption className="text-meta font-semibold tracking-[0.08em] text-muted uppercase">
                Our Mission
              </figcaption>
              <blockquote className="mt-4 text-card font-medium text-balance md:text-section">
                <p>{org.mission}</p>
              </blockquote>
            </figure>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "What We Do",
                  body: "We provide educational support, vocational training, small business setup, elderly stipends, and medical assistance to orphans, single parents, widows, the elderly, and the critically ill.",
                  source: "Our purpose",
                },
                {
                  label: "Who We Are",
                  body: "A not-for-profit and non-political organisation, governed by the provisions of our constitution.",
                  source: "Our constitution",
                },
              ].map((b, n) => (
                <div
                  key={b.label}
                  data-reveal="up"
                  style={i(n + 1)}
                  className="flex flex-col justify-between gap-6 rounded-card border border-line p-6"
                >
                  <div>
                    <p className="text-meta font-semibold tracking-[0.08em] text-muted uppercase">{b.label}</p>
                    <p className="mt-3 text-body">{b.body}</p>
                  </div>
                  <p className="text-micro text-muted">{b.source}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 4 — Aims & objectives */}
      <Section aria-labelledby="aims-title" className="pt-0! md:pt-0! lg:pt-0!">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="aims-title"
              eyebrow="Our Objectives"
              title="Six Aims, In The Words Of Our Constitution"
              intro="Each programme we run comes directly from one of these aims."
            />
            <Button href="/programs" variant="dark" size="sm" className="shrink-0 self-start md:self-auto">
              All Programmes
            </Button>
          </div>
          <div className="mt-12 lg:mt-16">
            <AimsList aims={aims} />
          </div>
        </Container>
      </Section>

      {/* 5 — History & milestones */}
      <Section tone="dark" aria-labelledby="journey-title">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading
              id="journey-title"
              tone="dark"
              eyebrow="Our Journey"
              title="Where Our Story Begins"
              className="lg:col-span-7"
            />
            <p className="text-body text-on-dark-muted lg:col-span-5" data-reveal="up" style={i(2)}>
              The milestones that shape our story, and the ones still to
              come as our work grows.
            </p>
          </div>
          <div className="mt-14 lg:mt-20">
            <Timeline items={milestones} />
          </div>
        </Container>
      </Section>

      {/* 6 — Leadership & governance */}
      <Section tone="alt" aria-labelledby="gov-title">
        <Container>
          <SectionHeading
            id="gov-title"
            eyebrow="Leadership & Governance"
            title="Led By Trustees, Governed By Our Constitution"
          />
          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
              {governingRoles.map((r, n) => (
                <li key={r.role} data-reveal="up" style={i(n)} className="flex flex-col gap-4">
                  {/* Monogram, not a photo: no consented portraits yet. */}
                  <div
                    aria-hidden="true"
                    className={`grid aspect-[4/3] place-items-center rounded-card border ${
                      r.name ? "border-line bg-surface" : "border-dashed border-ink/20"
                    }`}
                  >
                    <span
                      className={`grid size-14 place-items-center rounded-full text-card font-semibold sm:size-20 sm:text-section ${
                        r.name ? "bg-accent text-on-accent" : "bg-surface-alt text-muted"
                      }`}
                    >
                      {r.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-meta text-muted">{r.role} · {r.note}</p>
                    <p className={`mt-1 text-body font-medium text-balance sm:text-card ${r.name ? "" : "text-muted"}`}>
                      {r.name ?? "Not yet named"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="flex flex-col lg:col-span-5">
              {governanceFacts.map((f, n) => (
                <div
                  key={f.label}
                  data-reveal="up"
                  style={i(n)}
                  className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line py-5 last:border-b"
                >
                  <dt className="text-meta font-semibold">{f.label}</dt>
                  <dd className="text-meta leading-relaxed text-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      {/* 7 — Accountability */}
      <Section aria-labelledby="funds-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SectionHeading id="funds-title" eyebrow="Accountability" title="How We Are Funded And Held To Account" />
            <p className="text-body text-muted" data-reveal="up" style={i(3)}>
              {org.transparency}
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {incomeSources.map((s, n) => (
              <li
                key={s}
                data-reveal="scale"
                style={i(n)}
                className="flex flex-col justify-between gap-10 rounded-card border border-line p-6 transition-colors duration-300 hover:border-ink/30"
              >
                <span aria-hidden="true" className="text-stat font-medium text-ink/15">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="text-body font-medium">{s}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 8 — Partners & supporters */}
      <PartnersBand />

      {/* 9 — Call to action */}
      <CTABanner
        title="Stand With Us, Change A Life"
        text="Every gift is recorded, applied only to our charitable objectives and independently audited each year."
        image={photos.motherCradlingBaby}
      />
    </PageTransition>
  );
}
