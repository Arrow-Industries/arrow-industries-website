import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const routes = [
  { path: "/", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.7 },
  { path: "/tipper-truck-bodies", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/dog-trailers", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/semi-trailers", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/repairs-servicing", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/licensed-vehicle-testing", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/gallery", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/request-a-quote", changeFrequency: "yearly" as const, priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
  { path: "/terms-conditions", changeFrequency: "yearly" as const, priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
