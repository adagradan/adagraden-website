import type { MetadataRoute } from "next";
import { org } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: org.name,
    short_name: "Ada Gradan",
    description: org.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#111111",
    icons: [
      { src: "/brand/png/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/png/app-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/png/app-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
