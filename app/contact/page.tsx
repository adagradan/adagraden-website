import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { MapEmbed } from "@/components/sections/contact/MapEmbed";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MapPin } from "@/components/ui/icons";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${org.name}. Our office is in Akwakuma, Owerri, Imo State, Nigeria.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: `Contact Us | ${org.name}` },
};

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function DetailCard({ icon, title, children, n }: { icon: ReactNode; title: string; children: ReactNode; n: number }) {
  return (
    <li data-reveal="up" style={i(n)} className="flex gap-5 border-t border-line py-6 first:border-t-0 first:pt-0">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-alt text-ink">{icon}</span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-meta font-semibold">{title}</h2>
        <div className="text-meta leading-relaxed text-muted">{children}</div>
      </div>
    </li>
  );
}

export default function ContactPage() {
  const addressQuery = `${org.address.street}, ${org.address.locality}, ${org.address.region}, Nigeria`;

  return (
    <PageTransition>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="We Would Love To Hear From You"
        intro={
          <p>
            Whether you want to give, partner with us, volunteer or simply learn
            more about our work, send us a message.
          </p>
        }
      />

      <Section aria-label="Contact details and form" className="pt-0! md:pt-0! lg:pt-0!">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <ul className="flex flex-col lg:col-span-5">
            <DetailCard n={0} icon={<MapPin className="size-5" />} title="Visit us">
              <address className="not-italic">
                {org.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </DetailCard>
            {org.email && (
              <DetailCard n={1} icon={<Glyph d="M4 6h16v12H4zM4 7l8 6 8-6" />} title="Email">
                <a href={`mailto:${org.email}`} className="hover:text-ink">{org.email}</a>
              </DetailCard>
            )}
            {org.phone && (
              <DetailCard
                n={2}
                icon={<Glyph d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />}
                title="Phone & WhatsApp"
              >
                <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="hover:text-ink">{org.phone}</a>
              </DetailCard>
            )}
            {!org.email && !org.phone && (
              <DetailCard n={1} icon={<Glyph d="M4 6h16v12H4zM4 7l8 6 8-6" />} title="Write to us">
                Use the form on this page and we will reply to you by email. Our
                official phone line and email address will be listed here once
                they are set up.
              </DetailCard>
            )}
            <li data-reveal="up" style={i(3)} className="mt-4 rounded-card bg-surface-alt p-6">
              <p className="text-meta font-semibold">Looking for quick answers?</p>
              <p className="mt-1 text-meta text-muted">
                See how donations are used, how we are governed and more.
              </p>
              <Link
                href="/faq"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-meta font-semibold underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
              >
                Read the FAQ <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>

          <div
            className="load-slide-in rounded-card border border-line bg-surface p-6 shadow-[0_24px_64px_-24px_rgb(0_0_0/0.18)] sm:p-8 lg:col-span-7 lg:p-10"
            style={{ "--d": "0.6s" } as CSSProperties}
          >
            <h2 className="text-card font-medium">Send us a message</h2>
            <p className="mt-2 mb-8 text-meta text-muted">We read every message and reply by email.</p>
            <ContactForm />
          </div>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="map-title">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <SectionHeading id="map-title" eyebrow="Find Us" title="Our Office" />
            <p className="text-body text-muted" data-reveal="up" style={i(3)}>
              We are in Akwakuma, Owerri, off Mbieri Road and close to Luxury
              Place Guest House.
            </p>
          </div>
          <div className="lg:col-span-8" data-reveal="scale">
            <MapEmbed query={addressQuery} label={org.address.lines.join(", ")} />
          </div>
        </Container>
      </Section>
    </PageTransition>
  );
}
