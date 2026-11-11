import type { MetadataRoute } from "next";
import { postHref, posts } from "@/lib/posts";
import { programs } from "@/lib/programs";
import { siteUrl } from "@/lib/site";

// Add each route here as its page is built.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/programs`, changeFrequency: "monthly", priority: 0.9 },
    ...programs.map((p) => ({
      url: `${siteUrl}/programs/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/donate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/faq`, changeFrequency: "yearly", priority: 0.5 },
    // Placeholder articles are noindex and never listed.
    ...posts
      .filter((p) => !p.placeholder)
      .map((p) => ({ url: `${siteUrl}${postHref(p)}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
