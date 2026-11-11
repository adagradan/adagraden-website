import type { CSSProperties } from "react";
import { Media } from "@/components/ui/Media";
import { ShieldCheck } from "@/components/ui/icons";
import { photos } from "@/lib/media";
import { org } from "@/lib/site";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Overlapping photo pair + floating registration badge (reference About hero). */
export function AboutCollage() {
  return (
    <div className="relative pb-16 sm:pb-20 lg:pb-0">
      <div className="load-slide-in ml-auto w-[82%] sm:w-[72%] lg:w-[78%]" style={d(0.45)}>
        <Media
          image={photos.communityWomen}
          aspect="aspect-[4/5]"
          sizes="(min-width: 1024px) 40vw, 75vw"
          preload
          className="rounded-card"
        />
      </div>
      <div
        className="load-fade-up absolute bottom-0 left-0 w-[46%] sm:w-[40%] lg:-bottom-10 lg:w-[44%]"
        style={d(0.8)}
      >
        <Media
          image={photos.elderlyWoman}
          aspect="aspect-[3/4]"
          sizes="(min-width: 1024px) 20vw, 45vw"
          className="rounded-card ring-8 ring-surface"
        />
      </div>
      <div
        className="load-fade-up absolute top-8 left-[6%] flex items-center gap-3 rounded-full bg-surface py-2 pr-5 pl-2 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.25)] sm:left-[14%] lg:left-[4%]"
        style={d(1.1)}
      >
        <span className="grid size-9 place-items-center rounded-full bg-accent text-on-accent">
          <ShieldCheck className="size-4" />
        </span>
        <span className="text-micro leading-tight">
          <span className="block font-semibold text-ink">Caring since {org.registeredYear}</span>
          <span className="text-muted">Owerri, Imo State</span>
        </span>
      </div>
    </div>
  );
}
