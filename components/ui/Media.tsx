import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/lib/media";
import { ImageIcon } from "./icons";

/** A photo from lib/media.ts, or any image with at least src + alt. */
export type MediaImage = Pick<Photo, "src" | "alt"> &
  Partial<Pick<Photo, "blurDataURL" | "position" | "portraitPosition">>;

type MediaProps = {
  /** A real, consented photo. Omit until one is supplied. */
  image?: MediaImage;
  /** Describes the photo needed; shown as a marked placeholder until `image` exists. */
  placeholder?: string;
  /** Tailwind aspect class, fixed per component type (rules.md §8). */
  aspect?: string;
  sizes: string;
  tone?: "light" | "dark";
  preload?: boolean;
  className?: string;
  imageClassName?: string;
  /** Curtain-unveil + zoom-out when scrolled into view. `true` or a stagger index. */
  reveal?: boolean | number;
  /** Tall crop: use the photo's portrait focal point when it has one. */
  portrait?: boolean;
};

/**
 * Responsive image with a consistent aspect ratio. Until the organisation
 * supplies real, consented photography (information-bank.md open item #10),
 * it renders a clearly marked placeholder instead of stock imagery.
 */
export function Media({
  image,
  placeholder,
  aspect = "aspect-[4/3]",
  sizes,
  tone = "light",
  preload,
  className = "",
  imageClassName = "",
  reveal,
  portrait,
}: MediaProps) {
  const position = (portrait && image?.portraitPosition) || image?.position;
  return (
    <div
      className={`relative overflow-hidden ${aspect} ${className}`}
      data-reveal={reveal !== undefined && reveal !== false ? "image" : undefined}
      style={typeof reveal === "number" ? ({ "--i": reveal } as CSSProperties) : undefined}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          style={position ? { objectPosition: position } : undefined}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <ImagePlaceholder label={placeholder ?? "photo"} tone={tone} />
      )}
    </div>
  );
}

function ImagePlaceholder({ label, tone }: { label: string; tone: "light" | "dark" }) {
  const styles =
    tone === "dark"
      ? "bg-dark-raised text-on-dark-muted"
      : "bg-surface-alt text-muted";
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center ${styles}`}
    >
      <ImageIcon className="size-7 opacity-60" />
      <p className="max-w-[28ch] text-meta font-medium">
        [PLACEHOLDER: {label}]
      </p>
    </div>
  );
}
