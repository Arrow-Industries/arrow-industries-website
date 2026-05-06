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
  "Civil and quarry work",
  "High workload applications",
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

const ourBuilds = {
  configurations: [
    "4x2, 6x4, 8x4 and 10x4 truck configurations",
    "Custom body lengths sized to your chassis",
    "450-grade and Hardox steel construction",
  ],
  realFeatures: [
    "Raised tailgates with 2-way swing",
    "Internal ramp storage",
    "Retractable tarp systems",
    "Heavy-duty cross members",
  ],
};

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

const features = [
  "Tailgate configurations (including 2-way systems)",
  "Hoist setups (matched to application)",
  "Tarp systems (manual or electric)",
  "Lighting and safety systems",
  "Access steps, racks and practical operator features",
  "Spray suppression and protection options",
];

const whyArrow = [
  {
    title: "Built for operators",
    body: "Engineered to spec, not styled for a showroom. Every detail justified by how the unit will work.",
  },
  {
    title: "Designed around real-world use",
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
    title: "Setups that actually work on-site",
    body: "Hydraulics, hoist, tailgate and connections balanced as one system — not parts bolted together.",
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
    title: "We design the setup",
    body: "GA drawings, body length, hoist configuration, tailgate, hydraulics and fit-out — signed off before any steel is cut.",
  },
  {
    step: "03",
    title: "Fabrication and build",
    body: "Built in our Campbellfield workshop. Welded, finished and inspected by the same team end-to-end.",
  },
  {
    step: "04",
    title: "Delivery ready for work",
    body: "Compliance plates, weight stamps and handover paperwork. Delivered ready for work — and backed by the same workshop after handover.",
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
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-mute">
            Built for civil, quarry and fleet applications
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-bone/70">
            <span>4x2</span>
            <span aria-hidden className="text-line">•</span>
            <span>6x4</span>
            <span aria-hidden className="text-line">•</span>
            <span>8x4</span>
            <span aria-hidden className="text-line">•</span>
            <span>10x4</span>
          </div>
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

      {/* 4 — BUILT FOR */}
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

      {/* 5 — OUR BUILDS (technical depth) */}
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

      {/* 8 — FEATURES & OPTIONS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Features & options"
            heading="Configure the unit to suit the work."
          />
          <ul className="mt-14 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
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

      {/* 12 — FINAL CTA */}
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
