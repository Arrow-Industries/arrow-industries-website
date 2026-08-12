import type { NextConfig } from "next";

// Caching for static assets under /public.
//
// These filenames are NOT content-hashed, so a long browser `max-age` is
// actively dangerous: replacing a file (e.g. the booking QR) leaves visitors
// pinned to the old bytes until it expires, and `stale-while-revalidate` does
// NOT help — it only applies once max-age has already lapsed.
//
// So: keep the browser copy short-lived (a cheap 304 revalidation after 5
// minutes) while letting the CDN serve instantly and refresh in the background
// for up to 30 days. Near-identical performance, without the staleness trap.
const STATIC_ASSET_CACHE =
  "public, max-age=300, stale-while-revalidate=2592000";

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
  /*
   * Customer quotes live on this domain, and are served by the dashboard.
   *
   * A quote link is the most consequential thing Arrow emails anyone: sign
   * here for $60,000. It was going out as
   * "arrow-industries-dashboard.vercel.app/quote/sMeVwEn…" — an address that
   * looks like somebody's build server and reads, to a careful customer, like
   * exactly the sort of link you are told not to click.
   *
   * So the page is proxied under arrowindustries.com.au while the dashboard
   * keeps owning it. Both paths are needed: the HTML, and the endpoint the
   * page calls to take an option on or off and to accept — that fetch is
   * same-origin, so without the second rule the quote renders and then does
   * nothing.
   *
   * The dashboard sets an absolute assetPrefix so its scripts and styles still
   * resolve from there rather than from here.
   */
  async rewrites() {
    const dashboard = "https://dashboard.arrowindustries.com.au";
    return [
      { source: "/quote/:token", destination: `${dashboard}/quote/:token` },
      { source: "/quote/:token/:path*", destination: `${dashboard}/quote/:token/:path*` },
      { source: "/api/quote/:token", destination: `${dashboard}/api/quote/:token` },
    ];
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
