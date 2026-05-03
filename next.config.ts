import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Allow quote-form attachments up to ~25MB combined
      // (10MB per file, multiple files). Defaults to 1MB.
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
