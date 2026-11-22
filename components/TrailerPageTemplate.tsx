import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { ProductPage } from "@/components/ProductPage";
import type { TruckWalk } from "@/data/truck-parts";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import type { FAQ } from "@/data/faqs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schema";

export interface TrailerRecentBuild {
  src: string;
  alt: string;
  title: string;
}

export interface TrailerTypeBlock {
  label: string;
  headline: string;
  bullets: string[];
}

export interface TrailerPageConfig {
  slug: string;
  service: Service;
  meta: { title: string; description: string };
  hero: {
    badge: string;
    subtext: string;
    capability: string[];
    /** Leave out to show the type panel until a real photo exists. */
    image?: string;
    imageAlt?: string;
    imagePosition?: string;
  };
  /** Tappable points on a real photo of this product. */
  walk?: TruckWalk;
  recentBuilds: TrailerRecentBuild[];
  trailerType: TrailerTypeBlock;
  /** Per-page copy for the complete setup card. */
  completeSetup: { heading: ReactNode; outcomes: string[]; bullets: string[] };
  /** Per-page options list. */
  features: string[];
  faqs: FAQ[];
  /** The four facts under the opening. */
  facts: [string, string][];
  /** The four short points under the facts. */
  points: { heading: ReactNode; note: string; items: [string, string][] };
  next: { href: string; name: string };
}

export function TrailerPageTemplate({ config }: { config: TrailerPageConfig }) {
  const { service, hero, recentBuilds, completeSetup, features, faqs } = config;
  const product = config.slug === "dog-trailers" ? "dog" : "semi";
  const [first, ...rest] = hero.badge.split(" ");

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Build" },
    { label: service.shortTitle, href: service.href },
  ];

  const schemaContent: ServiceContent = {
    metaTitle: config.meta.title,
    metaDescription: config.meta.description,
    h1: "Built to work with the truck.",
    lede: hero.subtext,
    intro:
      "Every Arrow trailer is designed to match the towing setup — from the tow connection through to hydraulics, braking and electrical systems.",
    keyFeatures: [],
    useCases: [],
    buildOptions: [],
    compliance: [],
    faqs,
    ctaHeading: "Get the setup right from the start.",
    ctaBody:
      "Send us your truck, job and target payload — we'll come back with a build proposal, lead time and pricing.",
  };

  return (
    <>
      <JsonLd data={[serviceSchema(service, schemaContent), faqPageSchema(faqs), breadcrumbSchema(crumbs)]} />
      <ProductPage
        crumbs={crumbs}
        title={[first, `${rest.join(" ").toLowerCase()}.`]}
        sub={hero.subtext}
        photo={hero.image ? { src: hero.image, alt: hero.imageAlt ?? "", position: hero.imagePosition } : undefined}
        typePanel={
          hero.image ? undefined : (
            <>
              Tipping.
              <br />
              <em>Flat-deck.</em>
            </>
          )
        }
        facts={config.facts}
        points={{ label: hero.badge, ...config.points }}
        options={features}
        recent={recentBuilds.map((b) => ({ ...b, tag: product === "dog" ? "Dog" : "Semi" }))}
        setup={{ heading: completeSetup.heading, bullets: completeSetup.bullets }}
        faqs={faqs}
        next={config.next}
        configureHref={`/configure?product=${product}`}
      />
    </>
  );
}
