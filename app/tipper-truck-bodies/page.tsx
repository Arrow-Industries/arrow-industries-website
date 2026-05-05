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
  serviceSchema,
} from "@/lib/schema";
import type { ServiceContent } from "@/data/serviceContent";

const slug = "tipper-truck-bodies";

const meta = {
  title:
    "Tipper Truck Bodies — Custom-Built for Operators, Fleets & Civil Work",
  description:
    "Premium custom tipper bodies engineered to your truck and application. 4x2, 6x4, 8x4 builds in 450-grade and Hardox steel — built in Melbourne for civil, quarry and high-payload work.",
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
  h1: "Built for the Job. Engineered to Last.",
  lede:
    "Premium custom tipper bodies for operators, fleets and civil work — built with high-grade materials and engineered for real-world performance.",
  intro:
    "Arrow doesn't build catalogue bodies. Every tipper is engineered around the application, the payload and the chassis it'll run on — sized to the job, not pulled off a shelf.",
  keyFeatures: [],
  useCases: [],
  buildOptions: [],
  compliance: [],
  faqs,
  ctaHeading: "Tell us your setup. We'll build it right.",
  ctaBody:
    "Send us your truck, application and target payload — we'll return a build proposal, lead time and pricing.",
  ctaPrimaryLabel: "Get a Quote",
};

const builtFor = [
  "Owner operators",
  "Fleet operators",
  "Civil & quarry work",
  "High-payload applications",
];

const ourBuilds = {
  configurations: [
    "4x2, 6x4 and 8x4 truck configurations",
    "6.0m–6.5m bodies — custom lengths to suit chassis",
    "PBS combinations up to ~49.5T",
    "450-grade and Hardox steel construction",
  ],
  realFeatures: [
    "Raised tailgates with 2-way swing",
    "Internal ramp storage",
    "Retractable tarp systems",
    "Heavy-duty cross members",
  ],
};

const materials = [
  {
    title: "450-grade & Hardox steel",
    body: "Floors, walls and high-wear zones built from Q&T 450 and Hardox plate — abrasion-rated for quarry, civil and high-density loads.",
  },
  {
    title: "Reinforced sub-frames",
    body: "Engineered sub-frames spread hoist and payload forces across the chassis — no flex, no fatigue points, no unplanned cracks down the track.",
  },
  {
    title: "Precision welds & fabrication",
    body: "Welds laid by qualified fabricators, inspected before paint. Clean lines, full penetration where it matters, repair-friendly construction.",
  },
  {
    title: "Engineered for heavy use",
    body: "Designed around real cycle counts and harsh operating environments — quarries, tip sites, unsealed roads and continuous fleet work.",
  },
];

const features = {
  body: [
    "Tailgate styles — barn-door, top-hinged, grain, sealed waste",
    "Hoist options — front-mount or under-body twin-ram",
    "Retractable tarp systems with manual or electric drive",
    "Wear-rated body plate to suit material density",
  ],
  fitOut: [
    "LED rear, side-marker and work lighting",
    "Reverse and side-view camera systems",
    "Tool boxes, ladder racks and mud flap kits",
    "Site-spec features — chains, beacons, isolators",
  ],
};

const whyArrow = [
  {
    title: "Built for operators",
    body: "Engineered to spec, not styled for a showroom. Every detail justified by how the unit will work.",
  },
  {
    title: "Clean fabrication, premium finish",
    body: "Visible welds laid clean. 2-pack paint to your colour. The unit looks the way it works.",
  },
  {
    title: "Designed for payload",
    body: "Tare watched, structural steel sized to the load. More legal payload, more revenue per cycle.",
  },
  {
    title: "Consistent across the fleet",
    body: "Repeat builds match the first one. No drift on dimensions, finish or hardware between units.",
  },
];

const process = [
  {
    step: "01",
    title: "Tell us your truck and application",
    body: "Chassis make, wheelbase, payload, route, access permits — and any photos or drawings you have.",
  },
  {
    step: "02",
    title: "We design your build",
    body: "GA drawings, body length, hoist style, tailgate config and fit-out — all signed off before steel is cut.",
  },
  {
    step: "03",
    title: "Fabrication",
    body: "Built in our Campbellfield workshop. Welded, finished and inspected by the same team end-to-end.",
  },
  {
    step: "04",
    title: "Delivery",
    body: "Compliance plates, weight stamps and handover paperwork. Backed by the same workshop after delivery.",
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
            Built for the job.{" "}
            <span className="text-accent">Engineered to last.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Premium custom tipper bodies for operators, fleets and civil work —
            built with high-grade materials and designed for real-world
            performance.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/request-a-quote" size="lg">
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              Speak to the team
            </Button>
          </div>
        </Container>
      </section>

      {/* 2 — INTRO */}
      <section className="bg-ink-2 py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="No catalogue builds"
              heading="Built around the job — not pulled off a shelf."
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-mute sm:text-lg">
              Arrow doesn&rsquo;t build catalogue bodies. Every tipper is
              engineered around the application, the payload and the chassis
              it&rsquo;ll run on &mdash; sized for legal mass, balanced for the
              truck, finished for the work in front of it.
            </p>
          </div>
        </Container>
      </section>

      {/* 3 — BUILT FOR */}
      <section className="bg-ink py-20 lg:py-24">
        <Container>
          <SectionHeader eyebrow="Built for" heading="Who we build for." />
          <ul className="mt-12 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {builtFor.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 bg-ink-2 px-7 py-8"
              >
                <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
                <span className="font-display text-base font-bold text-bone sm:text-lg">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 4 — OUR BUILDS */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Our builds"
              heading="Configurations and features that earn their keep."
              body="We build to the spec sheet your job actually needs — not a generic catalogue model."
            />
          </div>
          <div className="lg:col-span-7 space-y-10">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Configurations
              </p>
              <ul className="divide-y divide-line-soft">
                {ourBuilds.configurations.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-bone sm:text-base">
                      {c}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Real-build features
              </p>
              <ul className="divide-y divide-line-soft">
                {ourBuilds.realFeatures.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-bone sm:text-base">
                      {c}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 5 — MATERIALS & ENGINEERING */}
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
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="md" variant="secondary">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              {site.phone}
            </Button>
          </div>
        </Container>
      </section>

      {/* 6 — FEATURES & OPTIONS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-12">
            <SectionHeader
              eyebrow="Features & options"
              heading="Configure the unit to suit the work."
            />
          </div>
          <div className="lg:col-span-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Body & hoist
            </p>
            <ul className="divide-y divide-line-soft">
              {features.body.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {b}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Fit-out & site features
            </p>
            <ul className="divide-y divide-line-soft">
              {features.fitOut.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
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
          </div>
        </Container>
      </section>

      {/* 7 — WHY ARROW */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="Built for the operator, not the showroom."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {whyArrow.map((w) => (
              <li key={w.title} className="flex flex-col gap-3 bg-ink p-8">
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {w.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 8 — REAL BUILDS */}
      <RealBuildsSection posts={igPosts} />

      {/* 9 — PROCESS */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="The build process"
            heading="From first call to delivery — four steps."
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
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

      {/* 10 — FINAL CTA */}
      <CTASection
        eyebrow="Get a Quote"
        heading={tipperContent.ctaHeading}
        body={tipperContent.ctaBody}
        primaryCta={{ label: "Get a Quote", href: "/request-a-quote" }}
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
            eyebrow="Real builds"
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
                  Latest from the workshop
                </a>
              ) : (
                "Latest from the workshop"
              )
            }
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
