import Link from "next/link";
import type { CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import { postHref, readingMinutes, type Post } from "@/lib/posts";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Lead story: large photo with the headline, summary and meta alongside. */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article aria-labelledby="featured-title" className="group grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
      <Link href={postHref(post)} tabIndex={-1} aria-hidden="true" className="block lg:col-span-7">
        <Media
          image={post.image}
          aspect="aspect-[16/11]"
          sizes="(min-width: 1024px) 56vw, 100vw"
          reveal
          className="rounded-card"
          imageClassName="transition-transform duration-1000 ease-out-soft group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col items-start gap-5 lg:col-span-5">
        <p className="flex flex-wrap items-center gap-3 text-micro" data-reveal="fade">
          <span className="rounded-full bg-accent px-3 py-1 font-semibold text-on-accent">Featured</span>
          <span className="font-semibold">{post.category}</span>
        </p>
        <h2 id="featured-title" className="text-section font-medium text-balance" data-reveal="split">
          <Link href={postHref(post)} className="underline-offset-[6px] hover:underline">
            <SplitText text={post.title} />
          </Link>
        </h2>
        <p className="text-body text-muted" data-reveal="up" style={i(2)}>
          {post.excerpt}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 text-meta text-muted" data-reveal="up" style={i(3)}>
          <time dateTime={post.dateTime}>{post.date}</time>
          <span aria-hidden="true" className="size-1 rounded-full bg-ink/40" />
          <span>{post.author}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-ink/40" />
          <span>{readingMinutes(post)} min read</span>
        </p>
        <div className="pt-2" data-reveal="up" style={i(4)}>
          <Button href={postHref(post)} variant="dark" size="sm">
            Read Article
          </Button>
        </div>
      </div>
    </article>
  );
}
