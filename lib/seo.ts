import type { Metadata } from "next";

/**
 * Build per-page metadata with a matching canonical URL and page-specific
 * OpenGraph/Twitter text.
 *
 * The root layout supplies the site-wide defaults (metadataBase, the generated
 * OG/Twitter images, card type). Next.js does NOT derive per-page OG/Twitter
 * titles from the page `title`, so without this every shared link would render
 * the same generic card. This fills in the page-specific title/description.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Canonical path, e.g. "/about" or `/${slug}`. */
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}
