import type { NextConfig } from "next";

// Long-lived caching for static assets under /public. These paths are stable
// (not content-hashed), so we use a long max-age plus stale-while-revalidate
// rather than `immutable` — a replaced file still refreshes within a day.
const STATIC_ASSET_CACHE =
  "public, max-age=2592000, stale-while-revalidate=86400";

const SECURITY_HEADERS = [
  // The site is HTTPS-only on Vercel; lock it in (2 years, subdomains).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next's default is only 60s, which re-runs an optimization for every
    // image far too often. Our source images are static, so cache optimized
    // variants for 30 days — fewer transformations (Vercel image quota) and a
    // much higher CDN hit rate.
    minimumCacheTTL: 2592000,
  },
  experimental: {
    serverActions: {
      // Allow quote-form attachments up to ~25MB combined
      // (10MB per file, multiple files). Defaults to 1MB.
      bodySizeLimit: "30mb",
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
    ];
  },
};

export default nextConfig;
