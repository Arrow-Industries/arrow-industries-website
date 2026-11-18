import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { LocalNav } from "@/components/LocalNav";
import { ProductHero } from "@/components/ProductHero";
import {
  BuildCards,
  CheckGrid,
  CheckList,
  InfoGrid,
  PhotoBand,
  Pills,
  ProcessSteps,
  ViewBuildsLink,
  type BuildCard,
} from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { media } from "@/data/media";
import { SectionHeader } from "@/components/SectionHeader";
import { TapTheTruck } from "@/components/TapTheTruck";
import type { TruckWalk } from "@/data/truck-parts";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import type { FAQ } from "@/data/faqs";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
} from "@/lib/schema";

export type TrailerRecentBuild = BuildCard;

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
    image: string;
    imageAlt?: string;
    imagePosition?: string;
  };
  /** Tappable points on a real photo of this product. */
  walk?: TruckWalk;
  recentBuilds: TrailerRecentBuild[];
  trailerType: TrailerTypeBlock;
  /** Per-page copy for the "Designed to work together" section. */
  completeSetup: { outcomes: string[]; bullets: string[] };
  /** Per-page Features & options list. */
  features: string[];
  faqs: FAQ[];
}

const builtFor = [
  "Owner operators",
  "Fleet operators",
  "Civil and quarry work",
  "High payload combinations",
];

const engineering = [
  {
    title: "Heavy-duty chassis design",
    body: "Chassis rails sized to combination mass and route demands — no underspec sections at high-stress points.",
  },
  {
    title: "Reinforced body construction",
    body: "Side panels, headboards and floor structure reinforced where the load actually works the body.",
  },
  {
    title: "Built for ongoing heavy loads",
    body: "Engineered around real cycle counts — continuous fleet work, not occasional duty.",
  },
  {
    title: "Designed for harsh site conditions",
    body: "Quarries, tip sites, unsealed roads and weather extremes — all considered at the design stage, not after.",
  },
];

const runningGear = [
  "Suspension setups matched to application",
  "Brake systems designed for load handling",
  "Axle configurations based on job requirements",
  "Built for stability and control",
];

const whyArrow = [
  {
    title: "Part of a full setup",
    body: "Built to integrate with the truck — not designed in isolation and bolted on after.",
  },
  {
    title: "Designed for real-world use",
    body: "Specified around the route, the load and the cycle — not catalogue assumptions.",
  },
  {
    title: "Clean fabrication and finish",
    body: "Visible welds laid clean. 2-pack paint to your colour. The unit looks the way it works.",
  },
  {
    title: "Consistent build quality",
    body: "Repeat builds match the first one. No drift on dimensions, finish or hardware between units.",
  },
  {
    title: "Built to perform on-site",
    body: "Hydraulics, brakes, drawgear and electrical balanced as one system that actually works under load.",
  },
];

const process = [
  {
    step: "01",
    title: "Tell us your truck and job",
    body: "Truck make, towing setup, payload, route and any access permits — and any photos or drawings you have.",
  },
  {
    step: "02",
    title: "We design the full setup",
    body: "GA drawings, axle group, drawgear, hydraulic and electrical layout — signed off before any steel is cut.",
  },
  {
    step: "03",
    title: "Fabrication",
    body: "Built in our Campbellfield workshop. Welded, finished and inspected by the same team end-to-end.",
  },
  {
    step: "04",
    title: "Delivery ready for work",
    body: "Compliance plates, weight stamps and handover paperwork. Delivered ready for work and backed after handover.",
  },
];

export function TrailerPageTemplate({ config }: { config: TrailerPageConfig }) {
  const {
    service,
    hero,
    recentBuilds,
    trailerType,
    completeSetup,
    features,
    faqs,
    walk,
  } = config;
  const product = config.slug === "dog-trailers" ? "dog" : "semi";

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
      <JsonLd
        data={[
          serviceSchema(service, schemaContent),
          faqPageSchema(faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      <ProductHero
        crumbs={crumbs}
        badge={hero.badge}
        heading={
          <>
            {hero.badge} <span className="text-accent">built to match.</span>
          </>
        }
        body={hero.subtext}
        image={hero.image}
        imageAlt={hero.imageAlt}
        imagePosition={hero.imagePosition}
        actions={
          <>
            <Button href={`/configure?product=${product}`} size="lg">
              Configure yours
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href="/request-a-quote" size="lg" variant="secondary">
              Request a quote
            </Button>
          </>
        }
      />

      <LocalNav
        label={`${service.shortTitle} sections`}
        items={[
          { id: "setups", label: "Setups" },
          ...(walk ? [{ id: "tap", label: "The trailer" }] : []),
          ...(recentBuilds.length > 0 ? [{ id: "builds", label: "Builds" }] : []),
          { id: "specs", label: "Specifications" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      <section id="setups" className="band scroll-mt-28">
        <Container>
          <p className="eyebrow">Configurations</p>
          <ul className="display display-lg mt-4 flex flex-wrap gap-x-[0.45em] gap-y-1">
            {hero.capability.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl border-t border-line pt-5 text-xl leading-snug text-mute">
            {trailerType.headline}
          </p>
        </Container>
      </section>

      {walk && <TapTheTruck walk={walk} heading="Tap the trailer." />}

      {recentBuilds.length > 0 && (
        <section id="builds" className="scroll-mt-28 pt-16 lg:pt-24">
          <Container className="flex flex-wrap items-end justify-between gap-4 pb-7 lg:pb-11">
            <SectionHeader eyebrow="Recent builds" heading="Real trailers. Real combinations." />
            <ViewBuildsLink />
          </Container>
          <BuildCards builds={recentBuilds} />
        </section>
      )}

      <section className="pt-16 lg:pt-24">
        <PhotoBand
          photo={config.slug === "dog-trailers" ? media.truckAndDog : media.welding}
          eyebrow="Complete working setup"
          heading="Designed to work together."
        >
          <Button href={`/configure?product=${product}`} size="lg">
            Configure your build
          </Button>
        </PhotoBand>
      </section>

      <section id="specs" className="band scroll-mt-28">
        <Container>
          <SectionHeader eyebrow="Specifications" heading="The full spec." className="mb-7 lg:mb-11" />
          <DetailAccordion
            items={[
              { id: "options", title: "Features & options", content: <CheckGrid items={features} /> },
              {
                id: "setup",
                title: "Complete working setup",
                content: (
                  <div className="grid gap-5">
                    <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-mute">
                      A trailer only performs as well as how it works with the truck. Every Arrow
                      trailer is designed to match the towing setup &mdash; from the tow connection
                      through to hydraulics, braking and electrical systems. The result is a
                      combination that works properly on-site, not just on paper.
                    </p>
                    <CheckList
                      items={[
                        ...trailerType.bullets,
                        ...completeSetup.bullets,
                        ...completeSetup.outcomes,
                      ]}
                    />
                  </div>
                ),
              },
              { id: "engineering", title: "Engineering", content: <InfoGrid items={engineering} /> },
              { id: "running-gear", title: "Running gear", content: <CheckGrid items={runningGear} /> },
              {
                id: "built-for",
                title: "Who we build for",
                content: <Pills items={builtFor} />,
              },
              { id: "why-arrow", title: "Why Arrow", content: <InfoGrid items={whyArrow} /> },
              { id: "process", title: "The build process", content: <ProcessSteps steps={process} /> },
            ]}
          />
        </Container>
      </section>

      <section id="faq" className="band scroll-mt-28 pt-0 lg:pt-0">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions." className="mb-7 lg:mb-11" />
          <FAQAccordion items={faqs} />
        </Container>
      </section>

      <CTASection
        eyebrow="Request a quote"
        heading="Get the setup right from the start."
        secondaryCta={{ label: "Configure your build", href: `/configure?product=${product}` }}
      />
    </>
  );
}
