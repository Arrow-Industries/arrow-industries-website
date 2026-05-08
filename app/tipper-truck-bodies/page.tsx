import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Instagram,
  Phone,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { getServiceBySlug } from "@/data/services";
import { site } from "@/data/site";
import {
  fetchTopInstagramMedia,
  thumbFor,
  type IgMedia,
} from "@/lib/instagram";
import {
  breadcrumbSchema,
  faqPageSchema,
  productSchema,
  serviceSchema,
} from "@/lib/schema";
import type { ServiceContent } from "@/data/serviceContent";

const slug = "tipper-truck-bodies";

const meta = {
  title:
    "Tipper Truck Bodies Melbourne — Custom 4x2, 6x4, 8x4 & 10x4 Builds",
  description:
    "Heavy-duty custom tipper truck bodies built in Melbourne for civil, quarry, demolition, construction and fleet operators. 4x2, 6x4, 8x4 and 10x4 chassis — engineered for serious Australian worksites.",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${slug}` },
};

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
  ctaPrimaryLabel: "Discuss Your Next Build",
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

const fallbackBuilds = [
  { src: "/images/builds/build-1.jpg", alt: "Arrow Industries 8x4 tipper body" },
  { src: "/images/builds/build-2.jpg", alt: "Arrow Industries dog trailer" },
  { src: "/images/builds/build-3.jpg", alt: "Arrow Industries semi trailer" },
];

export default async function Page() {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const igPosts = await fetchTopInstagramMedia(6, 30);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Products" },
    { label: service.shortTitle, href: service.href },
  ];

  return (
    <>
      <JsonLd
        data={[
          productSchema(service, tipperContent),
          serviceSchema(service, tipperContent),
          faqPageSchema(faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* 1 — HERO */}
      <section className="relative isolate overflow-hidden border-b border-line bg-ink">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src="/images/builds/build-1.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,10,0.92)_0%,rgba(10,10,10,0.7)_55%,rgba(10,10,10,0.45)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.18),transparent_55%)]"
        />

        <Container className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-mute">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={c.label} className="flex items-center gap-1.5">
                    {c.href && !last ? (
                      <Link href={c.href} className="hover:text-bone">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-bone" : undefined}>
                        {c.label}
                      </span>
                    )}
                    {!last && (
                      <ChevronRight className="h-3 w-3 text-line" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <p className="mb-5 inline-flex items-center gap-2 border border-line-soft/60 bg-ink-2/40 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mute backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Tipper Truck Bodies
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.02] text-bone sm:text-5xl lg:text-[4.5rem]">
            Tipper bodies engineered for{" "}
            <span className="text-accent">serious work.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Built in Melbourne for civil, quarry, demolition, construction and
            fleet operators who need durable, cleanly finished equipment that
            performs on site.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone/80">
            Custom-built for 4x2, 6x4, 8x4 and 10x4 chassis.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/request-a-quote" size="lg">
              Discuss Your Next Build
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              Talk to Arrow
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mute">
            {credibilityPoints.map((c, i) => (
              <li key={c} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden className="text-line">
                    •
                  </span>
                )}
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2 — NO CATALOGUE BUILDS */}
      <section className="bg-ink-2 py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="No catalogue builds"
              heading="Built around the job — not the template."
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-mute sm:text-lg">
              Every Arrow tipper is engineered around the application, the
              payload and the chassis it&rsquo;s running on &mdash; sized
              correctly, balanced for the truck, and finished for the work it
              needs to do.
            </p>
          </div>
        </Container>
      </section>

      {/* 3 — RECENT BUILDS (curated cards, high priority) */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Recent builds"
              heading="Real trucks. Real jobs."
              body="A snapshot of recent units off the workshop floor."
            />
            <Button href="/gallery" variant="ghost" size="md">
              View gallery →
            </Button>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {recentBuilds.map((b) => (
              <li
                key={b.title}
                className="group flex flex-col overflow-hidden bg-ink-2"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={b.src}
                    alt={b.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-bone sm:text-xl">
                      {b.title}
                    </h3>
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
                      {b.application}
                    </span>
                  </div>
                  <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-mute sm:text-sm">
                    {b.specs.map((s, i) => (
                      <li key={s} className="flex items-center gap-3">
                        {i > 0 && (
                          <span aria-hidden className="text-line">
                            •
                          </span>
                        )}
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4 — BUILT FOR REAL APPLICATIONS */}
      <section className="bg-ink py-20 lg:py-24">
        <Container>
          <SectionHeader
            eyebrow="Built for real applications"
            heading="Where Arrow tippers earn their keep."
          />
          <ul className="mt-12 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {applications.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 bg-ink-2 px-6 py-7"
              >
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
                <span className="font-display text-sm font-bold text-bone sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 5 — CONFIGURATIONS (4 chassis types with typical use) */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Configurations"
            heading="4x2, 6x4, 8x4 and 10x4 — built to the chassis."
            body="Custom-built for the chassis you run and the work the unit will actually do."
          />
          <ul className="mt-14 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {chassisConfigs.map((c) => (
              <li key={c.title} className="flex flex-col gap-4 bg-ink p-7">
                <h3 className="font-display text-lg font-bold text-bone sm:text-xl">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{c.use}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 6 — BUILT AS A COMPLETE SETUP (critical differentiator) */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Complete working setup"
              heading="Built as a complete working setup."
            />
            <p className="mt-6 text-base leading-relaxed text-mute sm:text-lg">
              A tipper body is only one part of the system. Every Arrow build
              is designed as a complete working setup &mdash; from the body
              and subframe through to hydraulics, hoist configuration, and
              trailer connections where required.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              The result
            </p>
            <ul className="mt-4 divide-y divide-line-soft">
              {completeSetup.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {o}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden bg-line-soft sm:grid-cols-1">
              {completeSetup.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-4 bg-ink-2 p-7"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {f}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 7 — MATERIALS & ENGINEERING */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Materials & engineering"
            heading="Specified for heavy work. Built to survive it."
            body="No vague claims — the steel, the welds and the geometry that put your unit on the road and keep it there."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2">
            {materials.map((m) => (
              <li key={m.title} className="flex flex-col gap-3 bg-ink-2 p-8">
                <h3 className="font-display text-lg font-bold text-bone sm:text-xl">
                  {m.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{m.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Mid-page CTA */}
      <section className="bg-ink-2 py-14">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-bold text-bone sm:text-2xl">
              Got a chassis ready to spec?
            </p>
            <p className="mt-1 text-sm text-mute">
              Send the details &mdash; we&rsquo;ll come back with a build
              proposal.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/request-a-quote" size="md">
              Get a Build Proposal
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="md" variant="secondary">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              {site.phone}
            </Button>
          </div>
        </Container>
      </section>

      {/* 8 — BUILD OPTIONS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Build options"
            heading="Configure the unit to suit the work."
            body="Practical options operators actually ask for — specified up front, integrated into the build, supported after delivery."
          />
          <ul className="mt-14 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
            {buildOptions.map((f) => (
              <li
                key={f}
                className="flex items-start gap-4 bg-ink-2 p-7"
              >
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-accent"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-bone sm:text-base">
                  {f}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 9 — WHY ARROW */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="Built for the operator, not the showroom."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
            {whyArrow.map((w) => (
              <li key={w.title} className="flex flex-col gap-3 bg-ink p-7">
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {w.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 10 — REAL BUILDS (expanded IG gallery) */}
      <RealBuildsSection posts={igPosts} />

      {/* 11 — PROCESS */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="The build process"
            heading="From first call to delivery — five steps."
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
            {process.map((p) => (
              <li key={p.step} className="flex flex-col gap-3 bg-ink p-8">
                <span className="font-display text-3xl font-extrabold text-accent">
                  {p.step}
                </span>
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ — kept for SEO and operator questions */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions, answered." />
          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* 12 — FINAL CTA */}
      <CTASection
        eyebrow="Talk to Arrow"
        heading={tipperContent.ctaHeading}
        body={tipperContent.ctaBody}
        primaryCta={{
          label: "Discuss Your Next Build",
          href: "/request-a-quote",
        }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Built in Melbourne. Backed by the team that built it."
      />
    </>
  );
}

function RealBuildsSection({ posts }: { posts: IgMedia[] }) {
  const usingIg = posts.length > 0;
  return (
    <section className="bg-ink py-24 lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Workshop gallery"
            heading={
              usingIg ? (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-accent sm:gap-4"
                >
                  <Instagram
                    className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                    aria-hidden
                  />
                  From the workshop floor
                </a>
              ) : (
                "From the workshop floor"
              )
            }
            body="Full truck shots, fabrication detail and on-site work — pulled live from Instagram."
          />
          <Button href="/gallery" variant="ghost" size="md">
            View gallery →
          </Button>
        </div>
        {usingIg ? (
          <ul className="mt-12 grid grid-cols-2 gap-1 md:grid-cols-3 lg:gap-2">
            {posts.map((p) => (
              <li key={p.id} className="aspect-square overflow-hidden bg-ink-2">
                <a
                  href={p.permalink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={p.caption?.slice(0, 120) || "View on Instagram"}
                  className="block h-full w-full"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbFor(p)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                  />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {fallbackBuilds.map((b, i) => (
              <li key={`fallback-${i}`}>
                <Link
                  href="/gallery"
                  aria-label="View gallery"
                  className="group relative block aspect-[5/4] overflow-hidden bg-ink-2"
                >
                  <Image
                    src={b.src}
                    alt={b.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
