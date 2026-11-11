import Link from "next/link";
import { cacheLife } from "next/cache";
import type { CSSProperties, ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { photos } from "@/lib/media";
import { programs } from "@/lib/programs";
import { donateHref, mainNav, org } from "@/lib/site";

/** Year is cached (Cache Components forbids uncached `new Date()` in prerender). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const marqueeItems = [org.name, ...programs.map((p) => p.shortTitle)];

function MarqueeBand() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-3 pr-3 text-body font-medium whitespace-nowrap sm:text-card"
    >
      {marqueeItems.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span aria-hidden="true">/</span>
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-accent py-3.5 text-on-accent">
      <p className="sr-only">Our programme areas</p>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

function FooterColumn({ title, i, children }: { title: string; i: number; children: ReactNode }) {
  return (
    <div data-reveal="up" style={stagger(i)}>
      <h2 className="text-meta font-medium text-on-dark">{title}</h2>
      <ul className="mt-4 flex flex-col">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group/f inline-flex min-h-9 items-center text-meta text-on-dark-muted transition-colors hover:text-on-dark"
      >
        <span
          aria-hidden="true"
          className="h-px w-0 bg-accent transition-[width,margin] duration-300 group-hover/f:mr-2 group-hover/f:w-3"
        />
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="on-dark overflow-hidden bg-dark text-on-dark">
      <MarqueeBand />

      <Container>
        {/* CTA + link columns */}
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-start gap-7 lg:col-span-4">
            <p className="max-w-[16ch] text-section font-medium text-balance" data-reveal="split">
              <SplitText text="Help Us Care For Those Who Need It Most" />
            </p>
            <div className="flex flex-wrap gap-3" data-reveal="up" style={stagger(3)}>
              <Button href={donateHref} variant="light" size="sm">
                Donate Now
              </Button>
              <Button href="/contact" variant="outline-light" size="sm" arrow={false}>
                Contact Us
              </Button>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[0.8fr_1fr_1.7fr] lg:col-span-8"
          >
            <FooterColumn title="Quick Links" i={0}>
              {mainNav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href={donateHref}>Donate</FooterLink>
            </FooterColumn>

            <FooterColumn title="Programmes" i={1}>
              {programs.map((p) => (
                <FooterLink key={p.slug} href={`/programs/${p.slug}`}>
                  {p.shortTitle}
                </FooterLink>
              ))}
            </FooterColumn>

            <div className="col-span-2 flex flex-col gap-8 sm:col-span-1" data-reveal="up" style={stagger(2)}>
              <div>
                <h2 className="text-meta font-medium">Contact</h2>
                <p className="mt-4 flex flex-col gap-2 text-meta text-on-dark-muted">
                  {org.phone && <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="hover:text-on-dark">{org.phone}</a>}
                  {org.email && <a href={`mailto:${org.email}`} className="hover:text-on-dark">{org.email}</a>}
                  <Link href="/contact" className="inline-flex items-center gap-2 text-on-dark hover:text-accent">
                    Send us a message <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
              <div>
                <h2 className="text-meta font-medium">Location</h2>
                <address className="mt-4 text-meta leading-relaxed not-italic text-on-dark-muted">
                  {org.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </nav>
        </div>

        {/* Legal bar — border sits on an inner box so it aligns with the content edge. */}
        <div className="flex flex-col gap-2 border-t border-line-dark py-6 text-micro text-on-dark-muted md:flex-row md:items-center md:justify-between md:gap-8">
          {org.social.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {org.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-on-dark">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Owerri, Imo State, Nigeria</p>
          )}
          <p className="md:text-right">
            © <CurrentYear /> {org.name}.{" "}
            <span className="whitespace-nowrap">Registered non-profit, IT No. {org.cacNumber}</span>
          </p>
        </div>

        {/* Giant wordmark: letters rise into view. Fully visible, never cropped. */}
        <div className="flex items-end justify-between gap-8 pt-6 pb-8 lg:pb-10">
          <p
            aria-hidden="true"
            className="text-wordmark font-medium whitespace-nowrap lg:text-wordmark-lg"
            data-reveal="split"
          >
            <SplitText text={org.shortWordmark} by="chars" />
          </p>
          <Media
            image={photos.childrenLaughing}
            aspect="aspect-[16/10]"
            sizes="256px"
            tone="dark"
            reveal={4}
            className="hidden w-56 shrink-0 rounded-card lg:block xl:w-64"
          />
        </div>
      </Container>
    </footer>
  );
}
