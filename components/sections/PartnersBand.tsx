import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { partners, partnersVisible } from "@/lib/partners";

/**
 * Yellow partner band (reference design). Renders nothing until partners are
 * switched on in lib/partners.ts and at least one is listed.
 */
export function PartnersBand() {
  if (!partnersVisible()) return null;
  return (
    <section aria-label="Partners and supporters" className="bg-accent text-on-accent">
      <Container>
        <ul data-reveal="fade" className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-6">
          {partners.map((p) => {
            const content = p.logo ? (
              <Image src={p.logo} alt={p.name} width={140} height={40} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-meta font-semibold">{p.name}</span>
            );
            return (
              <li key={p.name}>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center opacity-80 transition-opacity hover:opacity-100"
                  >
                    {content}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
