import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { BlogCard } from "@/components/cards/BlogCard";
import { ArticleBody } from "@/components/sections/news/ArticleBody";
import { ShareButtons } from "@/components/sections/news/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { postHref, posts, readingMinutes } from "@/lib/posts";
import { donateHref, org, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  // Cache Components requires at least one result. Until the first article
  // is published, a reserved slug prerenders the 404 page (it matches no post).
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "coming-soon" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Page not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postHref(post) },
    // Placeholder articles must never be indexed.
    robots: post.placeholder ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url: postHref(post),
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image.src, alt: post.image.alt }],
    },
  };
}

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const url = `${siteUrl}${postHref(post)}`;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const jsonLd = post.placeholder
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.dateTime,
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "NGO", name: org.name },
        image: `${siteUrl}${post.image.src}`,
        mainEntityOfPage: url,
      };

  return (
    <PageTransition>
      <article aria-labelledby="page-title">
        {/* Header */}
        <header className="bg-surface">
          <Container className="pt-10 md:pt-14">
            <div className="load-fade-up" style={d(0.15)}>
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "News", href: "/blog" }, { label: post.category }]}
              />
            </div>
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-6 text-center md:mt-16">
              <p className="load-fade-up rounded-full bg-accent px-3 py-1 text-micro font-semibold text-on-accent" style={d(0.25)}>
                {post.category}
              </p>
              <h1 id="page-title" className="load-split text-page font-medium text-balance">
                <SplitText text={post.title} />
              </h1>
              <p className="load-fade-up max-w-[52ch] text-lead text-muted" style={d(0.75)}>
                {post.excerpt}
              </p>
              <p
                className="load-fade-up flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-meta text-muted"
                style={d(0.9)}
              >
                <span className="font-medium text-ink">{post.author}</span>
                <span aria-hidden="true" className="size-1 rounded-full bg-ink/40" />
                <time dateTime={post.dateTime}>{post.date}</time>
                <span aria-hidden="true" className="size-1 rounded-full bg-ink/40" />
                <span>{readingMinutes(post)} min read</span>
              </p>
            </div>
            <div className="load-fade-up mt-12 md:mt-16" style={d(1)}>
              <Media
                image={post.image}
                aspect="aspect-[16/10] md:aspect-[2/1]"
                sizes="(min-width: 1280px) 1200px, 100vw"
                preload
                className="rounded-card"
              />
            </div>
          </Container>
        </header>

        {/* Body */}
        <Container className="py-14 md:py-20">
          <div className="mx-auto max-w-[68ch]">
            <ArticleBody blocks={post.body} />
            <div className="mt-14 flex flex-col gap-10 border-t border-line pt-10">
              <ShareButtons url={url} title={post.title} />
              <div className="flex flex-col gap-4 rounded-card bg-surface-alt p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-body font-medium">Moved by this story? Help us continue the work.</p>
                <Button href={donateHref} size="sm" className="shrink-0 self-start sm:self-auto">
                  Donate Now
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="alt" aria-labelledby="related-title">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading id="related-title" eyebrow="Keep Reading" title="Related Articles" />
              <Button href="/blog" variant="dark" size="sm" className="shrink-0 self-start sm:self-auto">
                All News
              </Button>
            </div>
            <div className="mt-12 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
    </PageTransition>
  );
}
