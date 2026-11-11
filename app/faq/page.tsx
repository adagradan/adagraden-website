import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ScrollSpyNav } from "@/components/ui/ScrollSpyNav";
import { Section } from "@/components/ui/Section";
import { faqGroups } from "@/lib/faqs";
import { donateHref, org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers about ${org.name}: registration, governance, how donations are used and accounted for, and our programmes.`,
  alternates: { canonical: "/faq" },
  openGraph: { url: "/faq", title: `FAQ | ${org.name}` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  ),
};

export default function FAQPage() {
  return (
    <PageTransition>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        title="Questions, Answered Honestly"
        intro={
          <p>
            Everything here comes from our registration documents and
            constitution. If your question is not answered, please ask us.
          </p>
        }
      />

      <Section aria-label="Questions by topic" className="pt-0! md:pt-0! lg:pt-0!">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)] flex flex-col gap-10">
              <ScrollSpyNav
                label="Topics"
                items={faqGroups.map((g, i) => ({ id: g.id, label: g.title, index: String(i + 1).padStart(2, "0") }))}
              />
              <div className="rounded-card bg-surface-alt p-5">
                <p className="text-meta font-semibold">Still have a question?</p>
                <p className="mt-1 text-micro leading-relaxed text-muted">We read every message.</p>
                <Button href="/contact" variant="dark" size="sm" className="mt-4">
                  Contact Us
                </Button>
              </div>
            </div>
          </aside>

          <div className="flex flex-col gap-16 lg:col-span-9 lg:gap-20">
            {faqGroups.map((g, i) => (
              <section
                key={g.id}
                id={g.id}
                aria-labelledby={`${g.id}-title`}
                className="scroll-mt-[calc(var(--header-h)+2rem)]"
              >
                <div className="mb-8 flex items-baseline gap-4" data-reveal="up">
                  <span aria-hidden="true" className="text-meta font-semibold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 id={`${g.id}-title`} className="text-section font-medium">
                    {g.title}
                  </h2>
                </div>
                <FAQAccordion items={g.items} name={`faq-${g.id}`} openFirst={i === 0} />
              </section>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark" spacing="compact" aria-labelledby="faq-cta-title">
        <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="faq-cta-title" className="max-w-[22ch] text-section font-medium text-balance" data-reveal="up">
              Ready To Stand With Us?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3" data-reveal="up">
            <Button href={donateHref}>Donate Now</Button>
            <Button href="/contact" variant="outline-light" arrow={false}>
              Ask a Question
            </Button>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </PageTransition>
  );
}
