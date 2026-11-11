import type { Metadata } from "next";
import { NewsCard } from "@/components/cards/NewsCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHero } from "@/components/sections/PageHero";
import { FeaturedPost } from "@/components/sections/news/FeaturedPost";
import { PostGrid } from "@/components/sections/news/PostGrid";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/lib/media";
import { externalNews, newsCheckedOn } from "@/lib/news";
import { categories, posts } from "@/lib/posts";
import { org } from "@/lib/site";

export const metadata: Metadata = {
  title: "News & Stories",
  description: `News from ${org.name}, and independent reporting on the causes we serve in Nigeria.`,
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: `News & Stories | ${org.name}` },
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <PageTransition>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News" }]}
        title="News And Stories From Our Foundation"
        intro={
          <p>
            Updates on our programmes and the people we serve, always shared with
            their consent, alongside independent reporting on the causes behind
            our work.
          </p>
        }
      >
        {!posts.length && (
          <p className="inline-flex items-center gap-3 rounded-full border border-line py-2 pr-5 pl-2 text-meta">
            <span className="relative grid size-7 place-items-center">
              <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-accent/50 motion-reduce:animate-none" />
              <span aria-hidden="true" className="relative size-2.5 rounded-full bg-accent" />
            </span>
            We are a young foundation. Our first stories are on the way.
          </p>
        )}
      </PageHero>

      {featured && (
        <Section aria-label="Featured article" className="pt-0! md:pt-0! lg:pt-0!">
          <Container>
            <FeaturedPost post={featured} />
          </Container>
        </Section>
      )}

      {rest.length > 0 && (
        <Section tone="alt" aria-labelledby="all-title">
          <Container className="flex flex-col gap-10">
            <SectionHeading id="all-title" eyebrow="Browse" title="All Articles" />
            <PostGrid posts={rest} categories={categories} />
          </Container>
        </Section>
      )}

      <Section tone={posts.length ? "light" : "alt"} aria-labelledby="inthenews-title">
        <Container>
          <SectionHeading
            id="inthenews-title"
            eyebrow="In The News"
            title="The Causes We Serve, In The News"
            intro={`Independent reporting from Nigerian media on the needs our programmes address. These articles are not about the Foundation. Checked ${newsCheckedOn}.`}
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {externalNews.map((a, i) => (
              <NewsCard key={a.url} article={a} index={i % 2} />
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        title="Be Part Of The Stories We Tell"
        text="Your support helps us begin the work these pages will one day report on."
        image={photos.childrenLaughing}
      />
    </PageTransition>
  );
}
