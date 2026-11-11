import type { Block } from "@/lib/posts";

/** Readability-first article typography (≈68ch measure, generous leading). */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6 text-lead leading-[1.8] text-ink/90">
      {blocks.map((b, k) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={k} className="mt-6 text-card font-medium text-ink">
                {b.text}
              </h2>
            );
          case "quote":
            return (
              <figure key={k} className="my-4 border-l-2 border-accent pl-6">
                <blockquote className="text-card leading-snug font-medium text-ink">
                  <p>{b.text}</p>
                </blockquote>
                {b.cite && <figcaption className="mt-3 text-meta text-muted">{b.cite}</figcaption>}
              </figure>
            );
          case "list":
            return (
              <ul key={k} className="flex flex-col gap-2 pl-5 marker:text-accent [list-style:disc]">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          default:
            return <p key={k}>{b.text}</p>;
        }
      })}
    </div>
  );
}
