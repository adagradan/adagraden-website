import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy. Its main job here is protecting the donation
 * account details: no script, frame or form may come from or go to anywhere
 * we haven't listed. See SECURITY.md.
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is required: Next.js streams page data in inline scripts on
  // statically prerendered pages, and nonces would force every page to render
  // dynamically (incompatible with partial prerendering). External scripts are
  // still blocked, and SRI (below) pins every JS file to its build-time hash.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  // Click-to-load map on the Contact page
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  // Card gifts continue to Flutterwave's hosted checkout
  "form-action 'self' https://checkout.flutterwave.com https://*.flutterwave.com",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]),
];

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    // Every JS file gets an integrity hash; browsers refuse a tampered file.
    sri: { algorithm: "sha256" },
  },
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
