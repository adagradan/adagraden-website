import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { DonationForm } from "@/components/sections/donate/DonationForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { FAQAccordion, type FAQItem } from "@/components/ui/FAQAccordion";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight, ShieldCheck } from "@/components/ui/icons";
import { programs } from "@/lib/programs";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description: `Support ${org.name}. Every gift is applied solely to our charitable objectives and independently audited each year.`,
  alternates: { canonical: "/donate" },
  openGraph: { url: "/donate", title: `Donate | ${org.name}` },
};

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** CONST Arts. 9, 10, 11, 13 — what every donor can rely on. */
const promises = [
  { title: "Used only for our aims", text: "Our constitution allows funds to be used only to achieve the Foundation's aims and objectives." },
  { title: "Recorded in full", text: "Every gift is logged in our income, cash-receipts and bank registers, in an account in the Foundation's own name." },
  { title: "Independently audited", text: "Licensed auditors review our accounts every year. The report is presented to our members every year." },
  { title: "No profit for members", text: "Nothing is distributed to members as profit. Governing-body members receive no salary, only out-of-pocket expenses or reasonable fees for services." },
];

const otherWays = [
  {
    title: "Bank transfer",
    text: "Our constitution requires an account in the Foundation's own name. Contact us and we will share the account details with you directly.",
    href: "/contact",
    cta: "Ask for details",
  },
  {
    title: "Grants & partnerships",
    text: "Our constitution welcomes grants and aid from individuals, corporate bodies and government agencies.",
    href: "/contact",
    cta: "Talk to us",
  },
  {
    title: "Fundraise for us",
    text: "Fundraising events and community projects are one of the ways our constitution provides for the Foundation to be funded.",
    href: "/contact",
    cta: "Plan an event",
  },
];

const faqs: FAQItem[] = [
  {
    question: "Can I donate online by card?",
    answer:
      "Not yet. Online payments are not set up, and no payment is taken on this website. The donation form shows you how to complete your gift by bank transfer or by contacting us.",
  },
  {
    question: "How will my donation be used?",
    answer:
      "Our constitution requires all income and property to be applied solely to the Foundation's charitable objectives. You can tell us which programme you would like your gift to support, or leave it to be used where it is needed most.",
  },
  {
    question: "How do I know my gift is accounted for?",
    answer:
      "Every receipt is recorded in our registers, and independent licensed auditors review our accounts each year. Their report goes to our Annual General Meeting.",
  },
];

export default function DonatePage() {
  return (
    <PageTransition>
      {/* 1 — Hero with gift builder */}
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Donate" }]}
        title="Give With Confidence, Give With Care"
        intro={
          <p>
            Your gift helps us care for orphans, widows, single parents, the
            elderly and the critically ill in our community.
          </p>
        }
        media={
          <div className="load-slide-in rounded-card border border-line bg-surface p-6 shadow-[0_24px_64px_-24px_rgb(0_0_0/0.18)] sm:p-8" style={{ "--d": "0.5s" } as CSSProperties}>
            <DonationForm programs={programs.map(({ slug, title }) => ({ slug, title }))} />
          </div>
        }
      >
        <ul className="flex flex-col gap-3">
          {[
            "A not-for-profit, non-political foundation",
            "Applied solely to our charitable objectives",
            "Accounts independently audited every year",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-meta">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
                <ShieldCheck className="size-3.5" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* 2 — What your gift supports */}
      <Section tone="alt" aria-labelledby="supports-title">
        <Container>
          <SectionHeading
            id="supports-title"
            eyebrow="What You Support"
            title="Choose A Programme Or Give Where Needed Most"
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {programs.map((p, n) => (
              <li key={p.slug} data-reveal="up" style={i(n % 3)}>
                <Link
                  href={`/programs/${p.slug}`}
                  className="group flex h-full items-center gap-4 rounded-card border border-line bg-surface p-3 pr-5 transition-colors duration-300 hover:border-ink/30"
                >
                  <Media
                    image={p.image}
                    placeholder={p.imagePlaceholder}
                    aspect="aspect-square"
                    sizes="96px"
                    className="w-20 shrink-0 rounded-inner sm:w-24"
                    imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-110"
                  />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-micro font-semibold text-muted">{String(n + 1).padStart(2, "0")}</span>
                    <span className="text-meta leading-snug font-semibold">{p.title}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-alt transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-accent group-hover:text-on-accent"
                  >
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 3 — Our promise */}
      <Section tone="dark" aria-labelledby="promise-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SectionHeading id="promise-title" tone="dark" eyebrow="Our Promise" title="Every Naira Accounted For" />
            <p className="text-body text-on-dark-muted" data-reveal="up" style={i(3)}>
              These commitments are written into our constitution, not just our
              website.
            </p>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-card bg-line-dark sm:grid-cols-2 lg:col-span-7">
            {promises.map((p, n) => (
              <li key={p.title} data-reveal="fade" style={i(n)} className="flex flex-col gap-4 bg-dark p-6 lg:p-8">
                <span aria-hidden="true" className="text-micro font-semibold text-accent">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <h3 className="text-card font-medium">{p.title}</h3>
                <p className="text-meta leading-relaxed text-on-dark-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 4 — Other ways to give */}
      <Section aria-labelledby="ways-title">
        <Container>
          <SectionHeading id="ways-title" eyebrow="Other Ways To Give" title="More Ways To Stand With Us" />
          <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
            {otherWays.map((w, n) => (
              <li
                key={w.title}
                data-reveal="scale"
                style={i(n)}
                className="flex flex-col justify-between gap-10 rounded-card border border-line p-6 transition-colors duration-300 hover:border-ink/30 lg:p-8"
              >
                <div>
                  <h3 className="text-card font-medium">{w.title}</h3>
                  <p className="mt-3 text-meta leading-relaxed text-muted">{w.text}</p>
                </div>
                <Link
                  href={w.href}
                  className="group inline-flex min-h-11 items-center gap-2 self-start text-meta font-semibold underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                >
                  {w.cta}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 5 — Donation FAQ */}
      <Section tone="alt" aria-labelledby="dfaq-title">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading id="dfaq-title" align="center" eyebrow="Questions" title="Before You Give" />
            <div className="mt-12">
              <FAQAccordion items={faqs} name="donate-faq" />
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
