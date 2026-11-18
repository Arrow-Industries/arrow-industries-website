import { ArrowRight, Phone } from "lucide-react";
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
  Pills,
  ProcessSteps,
  ViewBuildsLink,
  type BuildCard,
} from "@/components/ProductParts";
import { SpecTabs } from "@/components/SpecTabs";
import { SectionHeader } from "@/components/SectionHeader";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import type { FAQ } from "@/data/faqs";
import { site } from "@/data/site";
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
  };
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
  } = config;

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Products" },
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

      {/* 1 — HERO */}
      <ProductHero
        crumbs={crumbs}
        badge={hero.badge}
        heading={
          <>
            Built to work <span className="text-accent">with the truck.</span>
          </>
        }
        body={hero.subtext}
        image="/images/builds/build-1.jpg"
        note="Built for civil, quarry and fleet applications"
        facts={hero.capability}
        actions={
          <>
            <Button href="/request-a-quote" size="lg">
              Request a quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4 text-accent-text" aria-hidden />
              Call {site.phone}
            </Button>
          </>
        }
      />

      <LocalNav
        label={`${service.shortTitle} sections`}
        items={[
          { id: "overview", label: "Overview" },
          { id: "builds", label: "Builds" },
          { id: "setup", label: "Setup" },
          { id: "specs", label: "Specs" },
          { id: "process", label: "Process" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      <section id="overview" className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow={trailerType.label}
              heading="Built as part of the system."
            />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-mute sm:text-base">
              A trailer only performs as well as how it works with the truck.
              Every Arrow trailer is designed to match the towing setup &mdash;
              from the tow connection through to hydraulics, braking and
              electrical systems. The result is a combination that works
              properly on-site, not just on paper.
            </p>
            <div className="mt-5">
              <Pills items={builtFor} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <h3 className="mb-3 font-display text-lg font-semibold text-bone">
              {trailerType.headline}
            </h3>
            <CheckList items={trailerType.bullets} />
          </div>
        </Container>
      </section>

      <section id="builds" className="section">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Recent builds"
              heading="Real trailers. Real combinations."
              body="A snapshot of recent trailer builds off the workshop floor."
            />
            <ViewBuildsLink />
          </div>
          <BuildCards builds={recentBuilds} />
        </Container>
      </section>

      <section id="setup" className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Complete working setup"
              heading="Designed to work together."
              body="Every trailer is built to integrate with the truck, not added on after. The full combination is engineered to perform under load and on-site."
            />
            <p className="eyebrow mb-2 mt-5">The result</p>
            <CheckList items={completeSetup.outcomes} />
          </div>
          <div className="lg:col-span-7">
            <CheckList items={completeSetup.bullets} />
          </div>
        </Container>
      </section>

      <section id="specs" className="section">
        <Container>
          <SectionHeader
            eyebrow="Specifications"
            heading="Configure the trailer to suit the work."
            className="mb-6"
          />
          <SpecTabs
            label={`${service.shortTitle} specifications`}
            tabs={[
              {
                id: "options",
                label: "Features & options",
                content: <CheckGrid items={features} />,
              },
              {
                id: "engineering",
                label: "Engineering",
                content: <InfoGrid items={engineering} />,
              },
              {
                id: "running-gear",
                label: "Running gear",
                content: <CheckGrid items={runningGear} />,
              },
              {
                id: "why-arrow",
                label: "Why Arrow",
                content: <InfoGrid items={whyArrow} />,
              },
            ]}
          />
        </Container>
      </section>

      <section id="process" className="section">
        <Container>
          <SectionHeader
            eyebrow="The build process"
            heading="From first call to delivery — four steps."
          />
          <ProcessSteps steps={process} />
        </Container>
      </section>

      <section id="faq" className="section">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions, answered." />
          <div className="mt-6">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Request a quote"
        heading="Get the setup right from the start."
        body="Send us your truck, job and target payload — we'll come back with a build proposal, lead time and pricing."
        primaryCta={{ label: "Request a quote", href: "/request-a-quote" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Built in Melbourne. Backed by the team that built it."
      />
    </>
  );
}
