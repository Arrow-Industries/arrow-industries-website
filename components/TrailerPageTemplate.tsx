import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Instagram,
  Phone,
} from "lucide-react";
import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import type { FAQ } from "@/data/faqs";
import { site } from "@/data/site";
import { thumbFor, type IgMedia } from "@/lib/instagram";
import {
  breadcrumbSchema,
  faqPageSchema,
  serviceSchema,
} from "@/lib/schema";

export interface TrailerRecentBuild {
  src: string;
  alt: string;
  title: string;
  application: string;
  specs: string[];
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
  };
  recentBuilds: TrailerRecentBuild[];
  trailerType: TrailerTypeBlock;
  /** Per-page copy for the "Designed to work together" section. */
  completeSetup: { outcomes: string[]; bullets: string[] };
  /** Per-page Features & options list. */
  features: string[];
  /** Per-page mid-section CTA copy. */
  midPageCta: { headline: string; body: string };
  faqs: FAQ[];
  posts: IgMedia[];
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

const fallbackBuilds = [
  { src: "/images/builds/build-1.jpg", alt: "Arrow Industries trailer build" },
  { src: "/images/builds/build-2.jpg", alt: "Arrow Industries trailer build" },
  { src: "/images/builds/build-3.jpg", alt: "Arrow Industries trailer build" },
];

export function TrailerPageTemplate({ config }: { config: TrailerPageConfig }) {
  const {
    service,
    hero,
    recentBuilds,
    trailerType,
    completeSetup,
    features,
    midPageCta,
    faqs,
    posts,
  } = config;
  const usingIg = posts.length > 0;

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
            {hero.badge}
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.02] text-bone sm:text-5xl lg:text-[4.5rem]">
            Built to work{" "}
            <span className="text-accent">with the truck.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            {hero.subtext}
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
          {hero.capability.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-bone/70">
              {hero.capability.map((c, i) => (
                <span key={c} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-line">
                      •
                    </span>
                  )}
                  {c}
                </span>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 2 — NOT JUST A TRAILER */}
      <section className="bg-ink-2 py-20 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Full setup thinking"
              heading="Built as part of the system."
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-mute sm:text-lg">
              A trailer only performs as well as how it works with the truck.
              Every Arrow trailer is designed to match the towing setup
              &mdash; from the tow connection through to hydraulics, braking
              and electrical systems.
            </p>
            <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
              The result is a combination that works properly on-site, not
              just on paper.
            </p>
          </div>
        </Container>
      </section>

      {/* 3 — RECENT BUILDS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Recent builds"
              heading="Real trailers. Real combinations."
              body="A snapshot of recent trailer builds off the workshop floor."
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
      <section className="bg-ink-2 py-20 lg:py-24">
        <Container>
          <SectionHeader eyebrow="Built for" heading="Who we build for." />
          <ul className="mt-12 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {builtFor.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 bg-ink px-7 py-8"
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

      {/* 5 — TRAILER TYPE */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow={trailerType.label}
              heading={trailerType.headline}
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line-soft">
              {trailerType.bullets.map((b) => (
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
        </Container>
      </section>

      {/* Mid-page CTA */}
      <section className="bg-ink-2 py-14">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-bold text-bone sm:text-2xl">
              {midPageCta.headline}
            </p>
            <p className="mt-1 text-sm text-mute">{midPageCta.body}</p>
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

      {/* 6 — DESIGNED TO WORK TOGETHER (complete setup, critical) */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Complete working setup"
              heading="Designed to work together."
            />
            <p className="mt-6 text-base leading-relaxed text-mute sm:text-lg">
              Every trailer is built to integrate with the truck &mdash; not
              added on after. The full combination is engineered to perform
              under load and on-site.
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
            <ul className="grid gap-px overflow-hidden bg-line-soft">
              {completeSetup.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-4 bg-ink-2 p-7"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {b}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 7 — ENGINEERING & STRUCTURE */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Engineering & structure"
            heading="Specified for heavy work. Built to survive it."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2">
            {engineering.map((e) => (
              <li key={e.title} className="flex flex-col gap-3 bg-ink p-8">
                <h3 className="font-display text-lg font-bold text-bone sm:text-xl">
                  {e.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{e.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 8 — FEATURES & OPTIONS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Features & options"
            heading="Configure the trailer to suit the work."
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

      {/* 9 — RUNNING GEAR & SYSTEMS */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Running gear & systems"
              heading="Suspension, brakes and axles matched to the work."
              body="The mechanical underpinnings — selected and configured for the load and route, not bundled to a default."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line-soft">
              {runningGear.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {r}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 10 — WHY ARROW */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="Built as part of a setup, not a standalone trailer."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
            {whyArrow.map((w) => (
              <li key={w.title} className="flex flex-col gap-3 bg-ink-2 p-7">
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {w.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 11 — REAL BUILDS (expanded gallery, IG) */}
      <section className="bg-ink-2 py-24 lg:py-32">
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
              body="Truck and dog combinations, semi setups, rear tipping shots and close fabrication detail."
            />
            <Button href="/gallery" variant="ghost" size="md">
              View gallery →
            </Button>
          </div>
          {usingIg ? (
            <ul className="mt-12 grid grid-cols-2 gap-1 md:grid-cols-3 lg:gap-2">
              {posts.map((p) => (
                <li
                  key={p.id}
                  className="aspect-square overflow-hidden bg-ink"
                >
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
                    className="group relative block aspect-[5/4] overflow-hidden bg-ink"
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

      {/* 12 — PROCESS */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="The build process"
            heading="From first call to delivery — four steps."
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.step} className="flex flex-col gap-3 bg-ink-2 p-8">
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

      {/* FAQ — kept for SEO */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            heading="Common questions, answered."
          />
          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* 13 — FINAL CTA */}
      <CTASection
        eyebrow="Get a Quote"
        heading="Get the setup right from the start."
        body="Send us your truck, job and target payload — we'll come back with a build proposal, lead time and pricing."
        primaryCta={{ label: "Get a Quote", href: "/request-a-quote" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Built in Melbourne. Backed by the team that built it."
      />
    </>
  );
}
