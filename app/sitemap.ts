import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const routes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.7 },
  { path: "/tipper-truck-bodies", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/dog-trailers", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/semi-trailers", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/repairs-servicing", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/licensed-vehicle-testing", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/request-a-quote", changeFrequency: "yearly" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
  { path: "/warranty", changeFrequency: "yearly" as const, priority: 0.5 },
  { path: "/terms-conditions", changeFrequency: "yearly" as const, priority: 0.5 },
];

/**
 * Stable build-time timestamp so sitemap lastmod values stay consistent
 * within a deploy (don't churn per-request). On Vercel we prefer the
 * commit date; locally fall back to module load time.
 */
const BUILD_LAST_MODIFIED = (() => {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_DATE;
  if (fromEnv) {
    const d = new Date(fromEnv);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
})();

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified: BUILD_LAST_MODIFIED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
