import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
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
  InfoGrid,
  Pills,
  ProcessSteps,
  ViewBuildsLink,
} from "@/components/ProductParts";
import { SpecTabs } from "@/components/SpecTabs";
import { SectionHeader } from "@/components/SectionHeader";
import { media } from "@/data/media";
import { getServiceBySlug } from "@/data/services";
import { site } from "@/data/site";
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
  {
    src: "/images/builds/build-1.jpg",
    alt: "Arrow Industries 8x4 tipper body — civil application",
    title: "8x4 Tipper Build",
    application: "Civil application",
    specs: ["6.5m body", "2-way tailgate", "Retractable tarp"],
  },
  {
    src: "/images/builds/build-2.jpg",
    alt: "Arrow Industries 6x4 tipper body — quarry application",
    title: "6x4 Tipper Build",
    application: "Quarry application",
    specs: ["Heavy-duty floor", "Twin-ram hoist", "Wear-rated lining"],
  },
  {
    src: "/images/builds/build-3.jpg",
    alt: "Arrow Industries 10x4 tipper body — fleet setup",
    title: "10x4 Tipper Build",
    application: "Fleet setup",
    specs: ["Custom body length", "Full LED kit", "On-site ready"],
  },
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
    { label: "Products" },
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

      {/* 1 — HERO */}
      <ProductHero
        crumbs={crumbs}
        badge="Tipper Truck Bodies"
        heading={
          <>
            Tipper bodies engineered for{" "}
            <span className="text-accent">serious work.</span>
          </>
        }
        body="Built in Melbourne for civil, quarry, demolition, construction and fleet operators who need durable, cleanly finished equipment that performs on site."
        image={media.tipperGraphiteRear.src}
        imagePosition="64% 50%"
        note="Custom-built for 4x2, 6x4, 8x4 and 10x4 chassis."
        facts={credibilityPoints}
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
        label="Tipper truck body sections"
        items={[
          { id: "overview", label: "Overview" },
          { id: "builds", label: "Builds" },
          { id: "chassis", label: "Chassis" },
          { id: "setup", label: "Setup" },
          { id: "specs", label: "Specs" },
          { id: "process", label: "Process" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      <section id="overview" className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="No catalogue builds"
              heading="Built around the job — not the template."
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-[0.9375rem] leading-relaxed text-mute sm:text-base">
              Every Arrow tipper is engineered around the application, the
              payload and the chassis it&rsquo;s running on &mdash; sized
              correctly, balanced for the truck, and finished for the work it
              needs to do.
            </p>
            <div className="mt-5">
              <Pills items={applications} />
            </div>
          </div>
        </Container>
      </section>

      <section id="builds" className="section">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Recent builds"
              heading="Real trucks. Real jobs."
              body="A snapshot of recent units off the workshop floor."
            />
            <ViewBuildsLink />
          </div>
          <BuildCards builds={recentBuilds} />
        </Container>
      </section>

      <section id="chassis" className="section">
        <Container>
          <SectionHeader
            eyebrow="Configurations"
            heading="4x2, 6x4, 8x4 and 10x4 — built to the chassis."
            body="Custom-built for the chassis you run and the work the unit will actually do."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {chassisConfigs.map((c) => (
              <li key={c.title} className="card flex flex-col gap-2 p-5">
                <h3 className="font-display text-[1.0625rem] font-semibold text-bone">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{c.use}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="setup" className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Complete working setup"
              heading="Built as a complete working setup."
              body="A tipper body is only one part of the system. Every Arrow build is designed as a complete working setup — from the body and subframe through to hydraulics, hoist configuration, and trailer connections where required."
            />
            <p className="eyebrow mb-2 mt-5">The result</p>
            <CheckList items={completeSetup.outcomes} />
          </div>
          <div className="lg:col-span-7">
            <CheckList items={completeSetup.features} />
          </div>
        </Container>
      </section>

      <section id="specs" className="section">
        <Container>
          <SectionHeader
            eyebrow="Specifications"
            heading="Configure the unit to suit the work."
            body="Practical options operators actually ask for — specified up front, integrated into the build, supported after delivery."
            className="mb-6"
          />
          <SpecTabs
            label="Tipper body specifications"
            tabs={[
              {
                id: "options",
                label: "Build options",
                content: <CheckGrid items={buildOptions} />,
              },
              {
                id: "materials",
                label: "Materials & engineering",
                content: <InfoGrid items={materials} />,
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
            heading="From first call to delivery — five steps."
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
        heading={tipperContent.ctaHeading}
        body={tipperContent.ctaBody}
        primaryCta={{ label: "Request a quote", href: "/request-a-quote" }}
        secondaryCta={{ label: "Configure your build", href: "/configure?product=tipper" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Built in Melbourne. Backed by the team that built it."
      />
    </>
  );
}
