import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { MotionScript } from "@/components/motion/MotionScript";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { org, siteUrl } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: org.name,
    template: `%s | ${org.name}`,
  },
  description: org.metaDescription,
  applicationName: org.name,
  openGraph: {
    type: "website",
    siteName: org.name,
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

/** Verified fields only — information-bank.md §8. `founder` omitted (unconfirmed). */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: org.name,
  legalName: org.legalName,
  foundingDate: org.foundingDate,
  nonprofitStatus: "Nonprofit",
  taxID: org.taxId,
  address: {
    "@type": "PostalAddress",
    streetAddress: org.address.street,
    addressLocality: org.address.locality,
    addressRegion: org.address.region,
    addressCountry: org.address.country,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: ThemeScript/MotionScript set data-theme and
    // data-motion on <html> before hydration.
    <html
      lang="en"
      className={`${manrope.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        {/* First in <body>: runs synchronously before any content is parsed or
            painted. Not in an explicit <head>, which Next manages (e.g. it
            injects noindex on 404s, which would then mismatch on hydration). */}
        <ThemeScript />
        <MotionScript />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-meta font-semibold text-on-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MotionProvider />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organisationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
