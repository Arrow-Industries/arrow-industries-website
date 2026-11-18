import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import {
  CheckGrid,
  InfoGrid,
  PhotoBand,
  Pills,
  StatTiles,
  ViewBuildsLink,
  WorkshopStrip,
} from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { whyChooseArrow } from "@/data/features";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "About Arrow Industries — Australian Truck Body & Trailer Manufacturer",
  description:
    "Custom tipper bodies, dog trailers and semi trailers designed, built and serviced at our Campbellfield workshop — 25+ years backing operators Australia-wide.",
  path: "/about",
});

const crumbs = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

const stats = [
  { value: "25+", label: "Years experience" },
  { value: "Australian", label: "Built" },
  { value: "VicRoads", label: "Licensed" },
  { value: "Heavy-duty", label: "Builds" },
];

const workshop = [
  {
    photo: media.paintPrep,
    title: "Prep and paint",
    body: "Preparation, priming and painting.",
    detail: "Preparation, priming and painting of truck bodies, trailers and fabricated components.",
  },
  {
    photo: media.bodyPainted,
    title: "2-pack paint",
    body: "Any colour code you specify.",
    detail: "Finished to any 2-pack colour code you specify.",
  },
  {
    photo: media.onSite,
    title: "Built for real site conditions",
    body: "Quarries, tip sites and unsealed roads.",
    detail: "Engineered around continuous on-site work: quarries, tip sites and unsealed roads.",
  },
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

const whatWeBuild = [
  {
    title: "4x2 tipper bodies",
    body: "Configured for lighter payloads, urban work and tight access conditions.",
  },
  {
    title: "6x4 tipper bodies",
    body: "Configured to suit chassis and payload requirements.",
  },
  {
    title: "8x4 tipper bodies",
    body: "Built for heavy-duty transport and high-cycle work.",
  },
  {
    title: "Dog trailers",
    body: "Matched to your tipper for legal payload and stability.",
  },
  {
    title: "Semi trailers",
    body: "Tipping and flat-deck builds for long-haul performance.",
  },
];

const industries = [
  "Civil construction",
  "Quarry",
  "Transport",
  "Bulk haulage",
  "Waste management",
  "Earthmoving",
  "Fleet operators",
  "Truck dealers",
];

const recentBuilds = [media.tipperGraphite, media.scania, media.tipperWhite];

function TabIntro({
  heading,
  body,
  children,
}: {
  heading: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="mb-4 max-w-2xl">
        <p className="font-display text-lg font-semibold text-bone">{heading}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-mute sm:text-[0.9375rem]">
          {body}
        </p>
      </div>
      {children}
    </>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      {/* 1 — Hero */}
      <ProductHero
        crumbs={crumbs}
        badge="About"
        heading="Custom truck bodies and trailers built to handle demanding conditions."
        body="Designed, fabricated and serviced from our Campbellfield workshop, supporting operators across Australia."
        image={media.truckAndDogDusk.src}
        imagePosition="70% 55%"
        actions={
          <>
            <Button href="/request-a-quote" size="lg">
              Request a quote
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4" aria-hidden />
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* 2 — Stats and our story */}
      <section className="section">
        <Container>
          <StatTiles items={stats} />

          <div className="mt-10 lg:mt-14">
            <PhotoBand
              photo={media.welding}
              eyebrow="Our story"
              heading="Built for operators. Built to suit the job."
              body="Arrow Industries was founded by Kon, who worked in the civil industry operating his own trucks and trailers, understanding firsthand what equipment needs to handle. Aaron brings a background in civil engineering across major projects in Victoria. Today, we operate as one workshop, one hands-on team, supporting operators across Australia."
            />
          </div>

          <div className="mt-3">
            <DetailAccordion
              items={[
                {
                  id: "full-story",
                  title: "Read our full story",
                  content: (
                    <div className="space-y-4 text-sm leading-relaxed text-mute sm:text-[0.9375rem]">
                      <p>
                        Arrow Industries started as a fabrication workshop in
                        Campbellfield, building tipper bodies for operators who
                        needed stronger, more practical equipment.
                      </p>
                      <p>
                        The business was founded by Kon, who worked directly in
                        the civil industry operating his own trucks and trailers
                        on site — understanding firsthand what equipment needs
                        to handle.
                      </p>
                      <p>
                        That experience is backed by engineering insight, with
                        Aaron bringing a background in civil engineering across
                        major projects in Victoria, with a deep understanding of
                        site requirements, compliance and real-world operating
                        conditions.
                      </p>
                      <p>
                        Today, we operate the same way — one workshop, one
                        hands-on team, supporting operators across Australia.
                      </p>
                      <ul className="space-y-1 border-l-2 border-accent pl-4 text-bone">
                        <li className="font-semibold">Built for operators.</li>
                        <li className="font-semibold">Designed to suit the job.</li>
                        <li className="font-semibold">Custom-built for real conditions.</li>
                      </ul>
                      <p>
                        Each build is designed around the chassis, load, route
                        and operating conditions — practical, compliant and
                        built for long-term use.
                      </p>
                      <p>
                        When a unit comes back for servicing, repairs or
                        modifications, it&rsquo;s supported by the same team
                        that built it.
                      </p>
                      <p>
                        Supporting transport, construction and haulage operators
                        across Australia for{" "}
                        <span className="font-semibold text-bone">over 25 years</span>.
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* 3 — Inside the workshop */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Inside the workshop"
            heading="Welded, finished and inspected by the same team."
          />
          <WorkshopStrip items={workshop} />
        </Container>
      </section>

      {/* 4 — Milestones */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Experience"
            heading="Built on experience. Focused on what matters today."
          />
          <ol className="mt-7 grid lg:grid-cols-4 lg:gap-6">
            {milestones.map((m) => (
              <li
                key={m.title}
                className="relative flex flex-col gap-2 border-l border-line-soft pb-7 pl-5 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pt-5"
              >
                <span
                  aria-hidden
                  className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-accent lg:-top-[3.5px] lg:left-0"
                />
                <span className="eyebrow">{m.year}</span>
                <h3 className="text-base font-semibold text-bone">{m.title}</h3>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 5 — What we build, why Arrow, industries */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Custom-built"
            heading="Sized for the job in front of it."
            body="Every Arrow build starts with the chassis, payload, route and operating conditions."
            className="mb-5"
          />
          <Pills items={whatWeBuild.map((b) => b.title)} />
          <div className="mt-6">
            <DetailAccordion
              items={[
                {
                  id: "build",
                  title: "What we build",
                  content: (
                    <div className="grid gap-3">
                      <p className="text-sm leading-relaxed text-mute">
                        No catalogue sizes. No compromises. Just a unit
                        engineered to do the work it&rsquo;s asked to do, year
                        after year.
                      </p>
                      <InfoGrid items={whatWeBuild} />
                    </div>
                  ),
                },
                {
                  id: "why-arrow",
                  title: "Why Arrow",
                  content: (
                    <TabIntro
                      heading="Built for Australian conditions."
                      body="Decades of fabrication experience, real workshop capability and a refusal to cut corners on steel, welds or hydraulics."
                    >
                      <InfoGrid
                        items={whyChooseArrow.map((f) => ({
                          title: f.title,
                          body: f.description,
                        }))}
                      />
                    </TabIntro>
                  ),
                },
                {
                  id: "industries",
                  title: "Industries",
                  content: (
                    <TabIntro
                      heading="Built for operators across Australia."
                      body="Working with operators who rely on equipment that performs — across construction, quarry, transport, waste and fleet operations."
                    >
                      <CheckGrid items={industries} />
                    </TabIntro>
                  ),
                },
                {
                  id: "experience",
                  title: "Our experience",
                  content: (
                    <InfoGrid
                      items={milestones.map((m) => ({
                        title: m.title,
                        body: m.body,
                      }))}
                    />
                  ),
                },
                {
                  id: "workshop",
                  title: "Inside the workshop",
                  content: (
                    <InfoGrid
                      items={workshop.map((w) => ({
                        title: w.title,
                        body: w.detail,
                      }))}
                    />
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* 6 — Recent builds */}
      <section className="section">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Recent work" heading="Recent builds" />
            <ViewBuildsLink />
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentBuilds.map((b) => (
              <li
                key={b.src}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line-soft bg-ink-2"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="material absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-medium text-bone">
                  Tipper body
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 7 — Testimonials and call to action */}
      <Testimonials />

      <CTASection
        eyebrow="Talk to us"
        heading="Get a quote for your next build or repair"
        primaryCta={{ label: "Request a quote", href: "/request-a-quote" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
      />
    </>
  );
}
