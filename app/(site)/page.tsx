import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { HomeHero } from "@/components/sections/HomeHero";
import { AboutTabs } from "@/components/sections/AboutTabs";
import { ImpactBento } from "@/components/sections/ImpactBento";
import { PartnersBand } from "@/components/sections/PartnersBand";
import { ProcessSteps, type Step } from "@/components/sections/ProcessSteps";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FAQAccordion, type FAQItem } from "@/components/ui/FAQAccordion";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts } from "@/lib/posts";
import { externalNews, newsCheckedOn } from "@/lib/news";
import { programs } from "@/lib/programs";
import { photos } from "@/lib/media";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${org.name} | Owerri, Imo State` },
  description: org.metaDescription,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: org.name, description: org.metaDescription },
};

/** How a gift is handled — CONST Arts. 8, 10, 9 & 13, 11. */
const supportSteps: Step[] = [
  {
    title: "You Give",
    text: "Donations, grants and fundraising are how the Foundation is funded, alongside contributions from our members.",
  },
  {
    title: "We Record It",
    text: "Every receipt is logged in our income, cash and bank registers, and held in an account in the Foundation's own name.",
  },
  {
    title: "It Goes To The Work",
    text: "Funds may only be used for our charitable objectives. Nothing is paid out to members as profit.",
  },
  {
    title: "It Is Audited",
    text: "Independent, licensed auditors review our accounts every year. Their report is presented to our members every year.",
  },
];

/** Every answer is drawn from information-bank.md §1–6. */
const faqs: FAQItem[] = [
  {
    question: "How does the Foundation use donations?",
    answer:
      "Our constitution requires all income and property to be applied solely to our charitable objectives. Nothing is distributed to members as profit, and members of our governing body receive no salary beyond out-of-pocket expenses, reasonable rent or reasonable fees for services.",
  },
  {
    question: "What does the Foundation do?",
    answer:
      "We provide educational support, vocational training, help to start small businesses, stipends for the elderly and medical assistance to orphans, single parents, widows, the elderly and the critically ill.",
  },
  {
    question: "Who does the Foundation support?",
    answer:
      "Orphans and abandoned children, widows and widowers, single mothers and fathers, the elderly, people living with critical or chronic illness, and destitute individuals.",
  },
  {
    question: "How is the Foundation held accountable?",
    answer:
      "We keep a bank account in the Foundation's own name and maintain income, cash and bank registers. Independent licensed auditors review our accounts each year; the report goes to our Annual General Meeting.",
  },
  {
    question: "Where is the Foundation based?",
    answer: `Our office is at ${org.address.lines.join(", ")}.`,
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      {/* 1 — Hero */}
      <HomeHero />

      {/* 2 — Work process */}
      <Section aria-labelledby="process-title">
        <Container>
          <SectionHeading
            id="process-title"
            align="center"
            eyebrow="Work Process"
            title="How Your Support Is Received, Used And Checked"
          />
          <div className="mt-14 lg:mt-20">
            <ProcessSteps steps={supportSteps} />
          </div>
        </Container>
      </Section>

      {/* 3 — About */}
      <Section aria-labelledby="about-title" className="pt-0! lg:pt-4!">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-7">
            <SectionHeading id="about-title" eyebrow="About Us" title="About Our Compassionate Care Foundation" />
            <AboutTabs
              tabs={[
                {
                  label: "Our Mission",
                  content: (
                    <>
                      <p>{org.mission}</p>
                      <p className="mt-3">
                        We are a not-for-profit, non-political organisation,
                        based in Owerri, Imo State.
                      </p>
                    </>
                  ),
                },
                {
                  label: "Our Purpose",
                  content: (
                    <>
                      <p>
                        We are a non-profit welfare organisation providing educational
                        support, vocational training, small business setup,
                        elderly stipends, and medical assistance to orphans,
                        single parents, widows, the elderly, and the critically ill.
                      </p>
                      <p className="mt-3">
                        Every naira received must be applied solely to these
                        charitable objectives.
                      </p>
                    </>
                  ),
                },
              ]}
            />
            <Button href="/about" variant="dark" size="sm" className="self-start sm:ml-50">
              Learn More
            </Button>
          </div>
          <Media
            image={photos.communityWomen}
            aspect="aspect-[5/4] lg:aspect-[6/5]"
            sizes="(min-width: 1024px) 40vw, 100vw"
            reveal
            className="rounded-card lg:col-span-5"
          />
        </Container>
      </Section>

      {/* 4 — Programmes (dark) */}
      <Section tone="dark" aria-labelledby="programmes-title">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="programmes-title"
              tone="dark"
              eyebrow="Programmes"
              title="Programmes That Care For The Most Vulnerable"
            />
            <Button href="/programs" variant="outline-light" size="sm" className="shrink-0 self-start sm:self-auto">
              All Programmes
            </Button>
          </div>
          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2">
            {programs.map((program, i) => (
              <ProgramCard key={program.slug} program={program} index={i} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 5 — Impact (verified facts) */}
      <Section tone="alt" aria-labelledby="impact-title">
        <Container>
          <SectionHeading
            id="impact-title"
            align="center"
            eyebrow="At A Glance"
            title="Built On Care, Run With Accountability"
            intro="Every naira we receive is recorded, applied to our charitable objectives and independently audited."
          />
          <div className="mt-12 lg:mt-16">
            <ImpactBento />
          </div>
        </Container>
      </Section>

      {/* 6 — Partners band */}
      <PartnersBand />

      {/* 7 — FAQ */}
      <Section tone="alt" aria-labelledby="faq-title">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading id="faq-title" align="center" eyebrow="FAQ" title="Frequently Asked Questions About Our Foundation" />
            <div className="mt-12">
              <FAQAccordion items={faqs} />
            </div>
            <div className="mt-10 flex justify-center">
              <Button href="/faq" variant="outline" size="sm">
                See All Questions
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 8 — Latest news */}
      <Section aria-labelledby="news-title">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="news-title"
              eyebrow={posts.length ? "News" : "In The News"}
              title={posts.length ? "Latest Stories And Updates" : "The Causes We Serve, In The News"}
              intro={posts.length ? undefined : `Independent reporting on the needs our programmes address. Checked ${newsCheckedOn}.`}
            />
            <Button href="/blog" variant="dark" size="sm" className="shrink-0 self-start sm:self-auto">
              View All News
            </Button>
          </div>
          {posts.length ? (
            <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {externalNews.slice(0, 3).map((a, i) => (
                <NewsCard key={a.url} article={a} index={i} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
