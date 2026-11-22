import type { ReactNode } from "react";
import { PageOpen } from "@/components/Blocks";
import type { BreadcrumbCrumb } from "@/lib/schema";

interface ProductHeroProps {
  crumbs: BreadcrumbCrumb[];
  badge?: string;
  heading: ReactNode;
  body: string;
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  actions: ReactNode;
  facts?: [string, string][];
}

/** The opening of a page: a big line, then one photograph. */
export function ProductHero({ crumbs, heading, body, image, imageAlt = "", imagePosition, actions, facts }: ProductHeroProps) {
  return (
    <PageOpen
      crumbs={crumbs}
      long
      title={heading}
      sub={body}
      actions={actions}
      photo={{ src: image, alt: imageAlt, position: imagePosition }}
      facts={facts}
    />
  );
}
