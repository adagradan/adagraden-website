import Link from "next/link";
import type { CSSProperties } from "react";
import { Media } from "@/components/ui/Media";
import { postHref, type Post } from "@/lib/posts";

/** Editorial news card: image, category + date, title (whole card clickable). */
export function BlogCard({
  post,
  index = 0,
  headingLevel: H = "h3",
  showExcerpt = false,
}: {
  post: Post;
  index?: number;
  headingLevel?: "h2" | "h3";
  showExcerpt?: boolean;
}) {
  return (
    <article
      data-reveal="up"
      style={{ "--i": index } as CSSProperties}
      className="group relative flex flex-col gap-4"
    >
      <div className="relative">
        <Media
          image={post.image}
          reveal={index}
          aspect="aspect-[16/11]"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="rounded-card border border-line"
          imageClassName="transition-transform duration-700 ease-out-soft group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-surface/95 px-3 py-1 text-micro font-semibold text-ink">
          {post.category}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-center gap-x-2 text-micro text-muted">
          <time dateTime={post.dateTime}>{post.date}</time>
          <span aria-hidden="true" className="size-1 rounded-full bg-ink/40" />
          <span>{post.author}</span>
        </p>
        <H className="text-body leading-snug font-medium text-balance">
          <Link
            href={postHref(post)}
            className="underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline"
          >
            {post.title}
          </Link>
        </H>
        {showExcerpt && <p className="text-meta leading-relaxed text-muted">{post.excerpt}</p>}
      </div>
    </article>
  );
}
