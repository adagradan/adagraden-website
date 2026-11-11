"use client";

import { useId, useState } from "react";
import { BlogCard } from "@/components/cards/BlogCard";
import type { Category, Post } from "@/lib/posts";

/**
 * Category navigation + article grid. Filtering happens in the browser so the
 * page stays fully static; buttons expose their state via aria-pressed and
 * the result count is announced politely.
 */
export function PostGrid({ posts, categories }: { posts: Post[]; categories: readonly Category[] }) {
  const [active, setActive] = useState<Category | "All">("All");
  const statusId = useId();
  const shown = active === "All" ? posts : posts.filter((p) => p.category === active);
  // Only offer categories that currently have articles.
  const options: (Category | "All")[] = ["All", ...categories.filter((c) => posts.some((p) => p.category === c))];

  return (
    <div className="flex flex-col gap-10">
      <div
        role="group"
        aria-label="Filter articles by category"
        aria-describedby={statusId}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {options.map((c) => {
          const on = c === active;
          const count = c === "All" ? posts.length : posts.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-meta font-medium transition-colors duration-300 ${
                on ? "border-ink bg-ink text-on-ink" : "border-line text-ink hover:border-ink"
              }`}
            >
              {c}
              <span className={`text-micro tabular-nums ${on ? "text-accent" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      <p id={statusId} aria-live="polite" className="sr-only">
        Showing {shown.length} {shown.length === 1 ? "article" : "articles"}
        {active === "All" ? "" : ` in ${active}`}
      </p>

      {shown.length ? (
        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((post, i) => (
            <BlogCard key={`${active}-${post.slug}`} post={post} index={i % 3} showExcerpt />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-line px-6 py-12 text-center text-body text-muted">
          No articles in {active} yet.
        </p>
      )}
    </div>
  );
}
