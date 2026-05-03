import type { Metadata } from "next";
import Image from "next/image";
import {
  Building2,
  Construction,
  HardHat,
  Mountain,
  Phone,
  Recycle,
  Shovel,
  Truck,
  Warehouse,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { FeatureSection } from "@/components/FeatureSection";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustBar } from "@/components/TrustBar";
import { Button } from "@/components/Button";
import { whyChooseArrow } from "@/data/features";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Arrow Industries — Australian Truck Body & Trailer Manufacturer",
  description:
    "Arrow Industries designs, fabricates and services custom tipper bodies, dog trailers and semi trailers from our Campbellfield workshop. 25+ years supporting operators across construction, quarry, transport and waste across Australia.",
  alternates: { canonical: "/about" },
};

const aboutTrustItems = [
  "25+ years experience",
  "Built in Australia",
  "VicRoads licensed",
  "Built for heavy-duty use",
] as const;

const stats = [
  { value: "25+", label: "Years experience" },
  { value: "Australian", label: "Built" },
  { value: "VicRoads", label: "Licensed" },
  { value: "Heavy-duty", label: "Builds" },
];

const milestones = [
  {
    year: "2004",
    title: "Company established",
    body: "Samaro Pty Ltd begins operating, building experience across fabrication and workshop environments.",
  },
  {
    year: "Operator background",
    title: "Built from real-world use",
    body: "Founded by Kon, working in civil jobs operating his own trucks and trailers — understanding firsthand what equipment needs to handle.",
  },
  {
    year: "Engineering background",
    title: "Backed by project-level insight",
    body: "Experience across major civil projects, bringing a deep understanding of compliance, loads and site conditions.",
  },
  {
    year: "Today",
    title: "Focused on tipper and trailer builds",
    body: "Custom manufacturing, repairs, servicing and testing supporting operators across Australia.",
  },
];

const industries = [
  { label: "Civil construction", icon: Construction },
  { label: "Quarry", icon: Mountain },
  { label: "Transport", icon: Truck },
  { label: "Bulk haulage", icon: Warehouse },
  { label: "Waste management", icon: Recycle },
  { label: "Earthmoving", icon: Shovel },
  { label: "Fleet operators", icon: HardHat },
  { label: "Truck dealers", icon: Building2 },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        heading="Custom truck bodies and trailers built to handle demanding conditions."
        body="Designed, fabricated and serviced from our Campbellfield workshop — supporting operators across construction, quarry, transport and waste across Australia."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        actions={
          <>
            <Button href="/request-a-quote" size="lg">
              Request a Quote
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </Button>
          </>
        }
      />

      <TrustBar items={aboutTrustItems} />

      {/* Stats */}
      <section className="bg-ink py-20 lg:py-24">
        <Container>
          <ul className="grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <li
                key={s.label}
                className="flex flex-col gap-2 bg-ink-2 p-8 text-center"
              >
                <span className="font-display text-3xl font-extrabold text-bone sm:text-4xl">
                  {s.value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Our Story */}
      <section className="bg-ink-2 py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Our story"
              heading="Built for operators. Built to suit the job."
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-mute sm:text-lg">
              <p>
                Arrow Industries started as a fabrication workshop in
                Campbellfield, building tipper bodies for operators who needed
                stronger, more practical equipment.
              </p>
              <p>
                The business was founded by Kon, who worked directly in the
                civil industry operating his own trucks and trailers on site —
                understanding firsthand what equipment needs to handle.
              </p>
              <p>
                That experience is backed by engineering insight, with Aaron
                bringing a background in civil engineering across major
                projects in Victoria, with a deep understanding of site
                requirements, compliance and real-world operating conditions.
              </p>
              <p>
                Today, we operate the same way — one workshop, one hands-on
                team, supporting operators across Australia.
              </p>

              <ul className="!my-6 space-y-2 border-l-2 border-accent pl-5 text-base text-bone">
                <li className="font-semibold">Built for operators.</li>
                <li className="font-semibold">Designed to suit the job.</li>
                <li className="font-semibold">Custom-built for real conditions.</li>
              </ul>

              <p>
                Each build is designed around the chassis, load, route and
                operating conditions — practical, compliant and built for
                long-term use.
              </p>
              <p>
                When a unit comes back for servicing, repairs or
                modifications, it&rsquo;s supported by the same team that
                built it.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden border border-line-soft bg-ink">
              <Image
                src="/images/about/workshop-fabrication.jpg"
                alt="Arrow Industries fabrication workshop in Campbellfield"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What we build */}
      <section className="bg-ink pt-28 pb-20 lg:pt-32 lg:pb-24">
        <Container>
          <SectionHeader eyebrow="Capability" heading="What we build" />
          <ul className="mt-12 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                title: "4x2 tipper bodies",
                desc: "Configured for lighter payloads, urban work and tight access conditions.",
              },
              {
                title: "6x4 tipper bodies",
                desc: "Configured to suit chassis and payload requirements.",
              },
              {
                title: "8x4 tipper bodies",
                desc: "Built for heavy-duty transport and high-cycle work.",
              },
              {
                title: "Dog trailers",
                desc: "Matched to your tipper for legal payload and stability.",
              },
              {
                title: "Semi trailers",
                desc: "Tipping and flat-deck builds for long-haul performance.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-3 bg-ink-2 p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                    {item.title}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-2 h-2 w-2 shrink-0 bg-accent"
                  />
                </div>
                <p className="text-sm leading-relaxed text-mute">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Milestones */}
      <section className="bg-ink py-20 lg:py-24">
        <Container>
          <SectionHeader
            eyebrow="Experience"
            heading="Built on experience. Focused on what matters today."
          />
          <ol className="mt-12 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.title} className="flex flex-col gap-3 bg-ink-2 p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-bone">{m.title}</h3>
                <p className="text-sm leading-relaxed text-mute">{m.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Section 1 — Built for Australian conditions */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Why Arrow"
              heading="Built for Australian conditions."
              body="Decades of fabrication experience, real workshop capability and a refusal to cut corners on steel, welds or hydraulics."
            />
          </div>
          <div className="lg:col-span-7">
            <FeatureSection features={whyChooseArrow} />
          </div>
        </Container>
      </section>

      {/* Section 2 — Built for operators across Australia */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Industries"
              heading="Built for operators across Australia."
              body="Working with operators who rely on equipment that performs — across construction, quarry, transport, waste and fleet operations."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line-soft">
              {industries.map((i) => {
                const Icon = i.icon;
                return (
                  <li
                    key={i.label}
                    className="flex items-center gap-5 py-5 first:pt-0 last:pb-0"
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <span className="text-base font-semibold text-bone sm:text-lg">
                      {i.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* Section 3 — Sized for the job in front of it */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Custom-built
            </p>
            <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.08] text-bone sm:text-4xl lg:text-[2.75rem]">
              Sized for the job in front of it.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              Every Arrow build starts with the chassis, payload, route and
              operating conditions. No catalogue sizes. No compromises. Just a
              unit engineered to do the work it&rsquo;s asked to do, year after
              year.
            </p>
          </div>
        </Container>
      </section>

      {/* Recent builds */}
      <section className="bg-ink-2 py-20 lg:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader eyebrow="Recent work" heading="Recent builds" />
            <Button href="/gallery" variant="ghost">
              View gallery →
            </Button>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                src: "/images/about/builds/build-1.jpg",
                alt: "Recent Arrow Industries tipper body build",
                label: "Tipper body",
                location: "VIC",
              },
              {
                src: "/images/about/builds/build-2.jpg",
                alt: "Recent Arrow Industries dog trailer build",
                label: "Dog trailer",
                location: "AUSTRALIA",
              },
              {
                src: "/images/about/builds/build-3.jpg",
                alt: "Recent Arrow Industries semi trailer build",
                label: "Semi trailer",
                location: "AUSTRALIA",
              },
            ].map((b) => (
              <li
                key={b.src}
                className="group relative aspect-[4/3] overflow-hidden bg-ink"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pt-10 pb-5">
                  <span className="font-display text-base font-bold text-bone">
                    {b.label}
                  </span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
                    {b.location}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Trust line */}
      <section className="bg-ink py-8">
        <Container>
          <p className="text-center text-sm text-mute sm:text-base">
            Supporting transport, construction and haulage operators across
            Australia for{" "}
            <span className="font-semibold text-bone">over 25 years</span>.
          </p>
        </Container>
      </section>

      <CTASection
        eyebrow="Talk to us"
        heading="Get a quote for your next build or repair"
        body="Speak with the Arrow team to get a quote or next steps."
        primaryCta={{ label: "Request a Quote", href: "/request-a-quote" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
      />
    </>
  );
}
