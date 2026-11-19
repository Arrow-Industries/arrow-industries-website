import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { LocalNav } from "@/components/LocalNav";
import { ProductHero } from "@/components/ProductHero";
import {
  BuildCards,
  CheckGrid,
  CheckList,
  ChoiceTiles,
  InfoGrid,
  Pills,
  ProcessSteps,
  ViewBuildsLink,
} from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { TapTheTruck } from "@/components/TapTheTruck";
import { tipperWalk } from "@/data/truck-parts";
import { media } from "@/data/media";
import { getServiceBySlug } from "@/data/services";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
} from "@/lib/schema";
import type { ServiceContent } from "@/data/serviceContent";

const slug = "tipper-truck-bodies";

const meta = {
  title:
    "Tipper Truck Bodies Melbourne — Custom 4x2, 6x4, 8x4 & 10x4 Builds",
  description:
    "Custom heavy-duty tipper truck bodies built in Melbourne — 4x2, 6x4, 8x4 and 10x4 chassis engineered for civil, quarry, demolition and fleet worksites.",
};

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: `/${slug}`,
});

const faqs = [
  {
    question: "Can you build to suit any chassis?",
    answer:
      "Yes. We've built tipper bodies for every major Japanese, European and American truck brand. Send us your chassis make, model and wheelbase and we'll size the body to suit.",
  },
  {
    question: "What lead time should I expect for a new tipper body?",
    answer:
      "Most tipper builds run 6–12 weeks from confirmed order, depending on workload, spec and finish. We confirm a delivery date in writing before you commit.",
  },
  {
    question: "Do you offer fleet pricing for multiple bodies?",
    answer:
      "Yes — fleet operators ordering multiple identical units get scheduled build slots and pricing that reflects repeat work. Talk to us about your roll-out plan.",
  },
  {
    question: "Can I supply my own paint colour or fleet livery?",
    answer:
      "Yes. We finish to any 2-pack colour code you specify. If you need signage applied, we can coordinate with your preferred signwriter or recommend one.",
  },
  {
    question: "Do you back the work after delivery?",
    answer:
      "Yes — repairs, modifications and after-sales support are handled by the same workshop that built the unit. Coverage details are confirmed at order.",
  },
];

const tipperContent: ServiceContent = {
  metaTitle: meta.title,
  metaDescription: meta.description,
  h1: "Tipper bodies engineered for serious work.",
  lede:
    "Built in Melbourne for civil, quarry, demolition, construction and fleet operators who need durable, cleanly finished equipment that performs on site.",
  intro:
    "Every Arrow tipper is engineered around the application, the payload and the chassis it's running on — sized correctly, balanced for the truck, and finished for the work it needs to do.",
  keyFeatures: [],
  useCases: [],
  buildOptions: [],
  compliance: [],
  faqs,
  ctaHeading: "Discuss your next build.",
  ctaBody:
    "Send us your chassis, application and target payload — we'll come back with a build proposal, lead time and pricing.",
  ctaPrimaryLabel: "Request a quote",
};

const credibilityPoints = [
  "Melbourne-built",
  "Custom body configurations",
  "Heavy-duty materials",
  "Operator-focused layouts",
  "Built for Australian worksites",
];

const applications = [
  "Civil works",
  "Quarry haulage",
  "Demolition",
  "Construction",
  "Landscaping",
  "Bulk material transport",
  "Fleet operations",
];

const chassisConfigs = [
  {
    title: "4x2 tipper bodies",
    use: "Light-to-mid payload work — urban supply, landscape and tight-access sites where manoeuvrability matters.",
  },
  {
    title: "6x4 tipper bodies",
    use: "Civil cycles, contractor fleet work and mid-range haulage — the workhorse pairing for most operators.",
  },
  {
    title: "8x4 tipper bodies",
    use: "Heavy civil, demolition and quarry work where every legal tonne and every cycle counts.",
  },
  {
    title: "10x4 tipper bodies",
    use: "Maximum-payload builds for quarry, bulk haulage and high-output fleet operations.",
  },
];

const recentBuilds = [
  { src: media.tipperGraphite.src, alt: media.tipperGraphite.alt, title: "Graphite tipper body" },
  { src: media.scania.src, alt: media.scania.alt, title: "Scania tipper body" },
  { src: media.sitrak.src, alt: media.sitrak.alt, title: "SITRAK tipper body" },
];

const chassisChoices = [
  { title: "4x2", body: "Urban supply and tight-access sites" },
  { title: "6x4", body: "Civil and contractor fleet work" },
  { title: "8x4", body: "Heavy civil, demolition and quarry" },
  { title: "10x4", body: "Maximum payload and bulk haulage" },
];

const completeSetup = {
  outcomes: [
    "Proper balance on the chassis",
    "Correct load distribution",
    "Reliable operation on-site",
  ],
  features: [
    "Reinforced subframes and heavy-duty main bearers",
    "Multi-stage hoist systems matched to application",
    "Tailgate systems designed for real unloading conditions",
    "Integrated tarp systems and practical site features",
    "Full truck and trailer connection setups where required",
  ],
};

const materials = [
  {
    title: "Pressed side sheets and reinforced structures",
    body: "Side panels pressed for stiffness and dent resistance. Internal structure reinforced where the load actually works the body.",
  },
  {
    title: "Heavy-duty bearers and pivot systems",
    body: "Main bearers, cross members and pivot assemblies sized to handle real cycle counts — not catalogue-minimum sections.",
  },
  {
    title: "Clean welds and consistent fabrication",
    body: "Welds laid by qualified fabricators, inspected before paint. Repeatable construction across one-offs and fleet runs alike.",
  },
  {
    title: "Built for heavy loads and harsh conditions",
    body: "Engineered around continuous on-site work — quarries, tip sites, unsealed roads — not occasional light duty.",
  },
];

const buildOptions = [
  "Custom body sizing",
  "Hydraulic systems",
  "Underbody hoists",
  "Tarp systems (manual or electric)",
  "Toolbox setups",
  "Water tanks",
  "Tow couplings",
  "Lighting and electrical",
  "Mudguards and guards",
  "Camera and safety system integration",
  "Custom finishing details",
];

const whyArrow = [
  {
    title: "Cleaner fabrication",
    body: "Tighter finish, consistent weld quality and cleaner body lines across every build — visible whether you're standing next to a one-off or a fleet run.",
  },
  {
    title: "Built around the chassis",
    body: "Each body is designed to suit the chassis, application, axle setup and operator requirements — not adapted from a generic template.",
  },
  {
    title: "Designed for daily work",
    body: "Engineered for high-use operators across civil, construction, demolition, quarry and transport — where the unit earns its keep five to seven days a week.",
  },
  {
    title: "Premium component integration",
    body: "Hydraulics, suspension, towing, lighting and body accessories specified and installed to work as one system — not parts bolted together at the end.",
  },
  {
    title: "Workshop-backed support",
    body: "Direct communication, practical advice and after-sales backing from the people who actually build the unit — not a sales desk reading off a screen.",
  },
];

const process = [
  {
    step: "01",
    title: "Chassis and application review",
    body: "Truck make, wheelbase, payload, route and any photos or drawings you have. We work back from how the unit needs to perform on-site.",
  },
  {
    step: "02",
    title: "Build specification",
    body: "Body length, hoist style, tailgate, hydraulics layout and fit-out — GA drawings signed off before any steel is cut.",
  },
  {
    step: "03",
    title: "Fabrication",
    body: "Built in our Campbellfield workshop. Welded, finished and inspected by the same team end-to-end.",
  },
  {
    step: "04",
    title: "Hydraulics, electrical and fit-off",
    body: "PTO, pump, valves, lines, lighting and accessories installed and pressure-tested before the unit leaves the floor.",
  },
  {
    step: "05",
    title: "Testing and handover",
    body: "Compliance plates, weight stamps and documentation. Delivered ready for work — and backed by the same workshop after handover.",
  },
];

export default function Page() {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Build" },
    { label: service.shortTitle, href: service.href },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(service, tipperContent),
          faqPageSchema(faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      <ProductHero
        crumbs={crumbs}
        badge="Tipper Truck Bodies"
        heading={
          <>
            Tipper bodies for <span className="text-accent">serious work.</span>
          </>
        }
        body="Durable, cleanly finished bodies, built in Melbourne for the work ahead."
        image={media.tipperWhite.src}
        imageAlt={media.tipperWhite.alt}
        imagePosition="50% 62%"
        actions={
          <>
            <Button href="/configure?product=tipper" size="lg">
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
        label="Tipper truck body sections"
        items={[
          { id: "chassis", label: "Chassis" },
          { id: "tap", label: "The truck" },
          { id: "builds", label: "Builds" },
          { id: "specs", label: "Specifications" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      <section id="chassis" className="band scroll-mt-12">
        <Container>
          <SectionHeader
            eyebrow="Configurations"
            heading="Built to your chassis."
            body="Tipper bodies for any make or model of truck."
          />
          <ChoiceTiles items={chassisChoices} />
        </Container>
      </section>

      <TapTheTruck walk={tipperWalk} />

      <section id="builds" className="scroll-mt-12 pt-16 lg:pt-24">
        <Container className="flex flex-wrap items-end justify-between gap-4 pb-7 lg:pb-11">
          <SectionHeader eyebrow="Recent builds" heading="Real trucks. Real jobs." />
          <ViewBuildsLink />
        </Container>
        <BuildCards builds={recentBuilds} />
      </section>

      <section id="specs" className="band scroll-mt-12">
        <Container>
          <SectionHeader eyebrow="Specifications" heading="The full spec." className="mb-7 lg:mb-11" />
          <DetailAccordion
            items={[
              { id: "options", title: "Build options", content: <CheckGrid items={buildOptions} /> },
              { id: "materials", title: "Materials & engineering", content: <InfoGrid items={materials} /> },
              {
                id: "setup",
                title: "Complete working setup",
                content: (
                  <div className="grid gap-5">
                    <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-mute">
                      A tipper body is only one part of the system. Every Arrow build is designed
                      as a complete working setup &mdash; from the body and subframe through to
                      hydraulics, hoist configuration, and trailer connections where required.
                    </p>
                    <CheckList items={[...completeSetup.features, ...completeSetup.outcomes]} />
                  </div>
                ),
              },
              {
                id: "chassis-guide",
                title: "Chassis guide",
                content: (
                  <InfoGrid items={chassisConfigs.map((c) => ({ title: c.title, body: c.use }))} />
                ),
              },
              {
                id: "applications",
                title: "Applications",
                content: (
                  <div className="grid gap-5">
                    <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-mute">
                      Every Arrow tipper is engineered around the application, the payload and the
                      chassis it&rsquo;s running on &mdash; sized correctly, balanced for the truck,
                      and finished for the work it needs to do.
                    </p>
                    <Pills items={[...applications, ...credibilityPoints]} />
                  </div>
                ),
              },
              { id: "why-arrow", title: "Why Arrow", content: <InfoGrid items={whyArrow} /> },
              { id: "process", title: "The build process", content: <ProcessSteps steps={process} /> },
            ]}
          />
        </Container>
      </section>

      <section id="faq" className="band scroll-mt-20 pt-0 lg:pt-0">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions." className="mb-7 lg:mb-11" />
          <FAQAccordion items={faqs} />
        </Container>
      </section>

      <CTASection
        eyebrow="Request a quote"
        heading={tipperContent.ctaHeading}
        secondaryCta={{ label: "Configure your build", href: "/configure?product=tipper" }}
      />
    </>
  );
}
