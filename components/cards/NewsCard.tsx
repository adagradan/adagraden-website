import type { CSSProperties } from "react";
import { ArrowUpRight } from "@/components/ui/icons";
import type { ExternalArticle } from "@/lib/news";

/**
 * Card for independent reporting (lib/news.ts). Always names the outlet,
 * links out to the original, and never implies the Foundation's involvement.
 */
export function NewsCard({
  article,
  index = 0,
  headingLevel: H = "h3",
  tone = "light",
}: {
  article: ExternalArticle;
  index?: number;
  headingLevel?: "h2" | "h3";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <article
      data-reveal="up"
      style={{ "--i": index } as CSSProperties}
      className={`group relative flex h-full flex-col justify-between gap-8 rounded-card border p-6 transition-colors duration-300 ${
        dark ? "border-line-dark bg-dark-raised hover:border-on-dark/30" : "border-line bg-surface hover:border-ink/30"
      }`}
    >
      <div className="flex flex-col gap-4">
        <p className="flex flex-wrap items-center gap-2 text-micro">
          <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-on-accent">{article.cause}</span>
          <span className={dark ? "text-on-dark-muted" : "text-muted"}>
            <time dateTime={article.dateTime}>{article.date}</time>
          </span>
        </p>
        <H className="text-body leading-snug font-medium text-balance">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline"
          >
            {article.headline}
            <span className="sr-only"> ({article.outlet}, opens in a new tab)</span>
          </a>
        </H>
        <p className={`text-meta leading-relaxed ${dark ? "text-on-dark-muted" : "text-muted"}`}>{article.summary}</p>
      </div>
      <p className="flex items-center justify-between gap-4 text-meta font-semibold">
        <span>{article.outlet}</span>
        <span
          aria-hidden="true"
          className={`grid size-8 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-accent group-hover:text-on-accent ${
            dark ? "bg-on-dark/10" : "bg-surface-alt"
          }`}
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      </p>
    </article>
  );
}
