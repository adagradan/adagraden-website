import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHero } from "@/components/sections/PageHero";
import { ProgramFeature } from "@/components/sections/programs/ProgramFeature";
import { ProgramFilmstrip } from "@/components/sections/programs/ProgramFilmstrip";
import { Container } from "@/components/ui/Container";
import { ScrollSpyNav } from "@/components/ui/ScrollSpyNav";
import { Section } from "@/components/ui/Section";
import { photos } from "@/lib/media";
import { programs } from "@/lib/programs";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Programmes",
  description:
    "Six programmes from our constitution: skills training, medical aid, elderly care, family welfare, children's education and livelihood support in Owerri, Imo State.",
  alternates: { canonical: "/programs" },
  openGraph: { url: "/programs", title: `Our Programmes | ${org.name}` },
};

export default function ProgramsPage() {
  return (
    <PageTransition>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Programmes" }]}
        title="Six Programmes, One Commitment To Care"
        intro={
          <p>
            Each of our programmes comes from an aim written into our
            constitution. We are a young foundation: as our work begins, we will
            publish activities and verified outcomes for every programme here.
          </p>
        }
        footer={<ProgramFilmstrip programs={programs} />}
      />

      <Section aria-label="Programme details" className="pt-0! md:pt-0! lg:pt-0!">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)]">
              <ScrollSpyNav
                label="Programmes"
                items={programs.map((p, i) => ({
                  id: p.slug,
                  label: p.shortTitle,
                  index: String(i + 1).padStart(2, "0"),
                }))}
              />
            </div>
          </aside>
          <div className="lg:col-span-9">
            {programs.map((program, i) => (
              <ProgramFeature key={program.slug} program={program} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        title="Help Us Bring These Programmes To Life"
        text="Your support helps us begin this work. Every gift is recorded, applied only to our charitable objectives and independently audited each year."
        image={photos.educationClassroom}
      />
    </PageTransition>
  );
}
