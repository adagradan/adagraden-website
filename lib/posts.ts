/**
 * The Foundation's own news & stories (information-bank.md §7: none yet).
 * Independent reporting on our causes lives in lib/news.ts.
 *
 * To publish a real article: add an entry with `placeholder: false`, real
 * title/date/author/body, and a consented photo. Placeholder entries are
 * marked noindex and excluded from the sitemap.
 */

import type { Photo } from "./media";

/** Editorial sections (site structure, not claims about the organisation). */
export const categories = ["Foundation News", "Programme Updates", "Stories", "Announcements"] as const;
export type Category = (typeof categories)[number];

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Display date and ISO date. */
  date: string;
  dateTime?: string;
  author: string;
  category: Category;
  image: Photo;
  body: Block[];
  placeholder: boolean;
};

/**
 * The Foundation's own articles. None published yet. Add real entries here
 * (placeholder: false, real date/author/body, a consented photo); the News
 * page, homepage, article pages and sitemap pick them up automatically.
 */
export const posts: Post[] = [];

export const postHref = (p: Post) => `/blog/${p.slug}`;

/** Rough reading time from the article body (≈ 220 words per minute). */
export function readingMinutes(p: Post) {
  const words = p.body
    .map((b) => (b.type === "list" ? b.items.join(" ") : b.text))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
