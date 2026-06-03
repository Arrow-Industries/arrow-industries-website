import { statSync } from "node:fs";
import { join } from "node:path";
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
  { path: "/careers", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/finance", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/warranty", changeFrequency: "yearly" as const, priority: 0.5 },
  { path: "/terms-conditions", changeFrequency: "yearly" as const, priority: 0.5 },
];

/**
 * Build-time fallback timestamp. On Vercel we prefer the git commit
 * date; locally fall back to module load time. Used when a per-page
 * mtime can't be resolved.
 */
const BUILD_LAST_MODIFIED = (() => {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_DATE;
  if (fromEnv) {
    const d = new Date(fromEnv);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
})();

/**
 * Resolve a route's `lastmod` from its `page.tsx` file mtime when
 * possible, so sitemap entries reflect when each page was actually
 * touched (not the deploy time of the whole site). Falls back to
 * BUILD_LAST_MODIFIED if the stat fails (e.g. running in an
 * environment without filesystem access to source).
 *
 * Caveat: pages whose copy lives in shared data files (e.g. the
 * service pages reading from data/serviceContent.ts) won't update
 * here unless their page.tsx is also touched. This is a heuristic,
 * not a full content-derivation tracker.
 */
function pageLastModified(routePath: string): Date {
  const slug = routePath === "/" ? "" : routePath.slice(1);
  const filePath = join(process.cwd(), "app", slug, "page.tsx");
  try {
    return statSync(filePath).mtime;
  } catch {
    return BUILD_LAST_MODIFIED;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "/" : r.path}`,
    lastModified: pageLastModified(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
