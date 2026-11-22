import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import {
  BuildCards,
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
import { Action, Head, PageOpen, Shots, Steps } from "@/components/Blocks";
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
    body: "Tipping semi trailers, 2-axle and 3-axle, matched to your prime mover.",
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

const recentBuilds = [media.tipperGraphite, media.scania, media.tipperWhite].map((b) => ({
  src: b.src,
  alt: b.alt,
  title: "Tipper body",
}));

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
        <p className="display text-[1.75rem] text-bone">{heading}</p>
        <p className="mt-2 text-[1.0625rem] leading-relaxed text-mute">
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

      <PageOpen
        crumbs={crumbs}
        long
        title={
          <>
            Built by operators,
            <br />
            <span className="red">for operators.</span>
          </>
        }
        sub="Designed, fabricated and serviced from our Campbellfield workshop."
        actions={
          <Action href="/builds" tone="line">
            See our work
          </Action>
        }
        photo={{ src: media.truckAndDogDusk.src, alt: media.truckAndDogDusk.alt, position: "70% 55%" }}
        facts={stats.map((s) => [s.value, s.label] as [string, string])}
      />

      <section className="sec">
        <div className="wrap story">
          <div className="reveal">
            <p className="mlabel">Our story</p>
            <h2>
              Built to suit <span className="red">the job.</span>
            </h2>
          </div>
          <div className="reveal">
            <p className="lead">Founded by Kon, who ran his own trucks and trailers in civil work.</p>
            <p>
              Today it&rsquo;s one workshop and one hands-on team, supporting operators across Australia. Every
              build starts with the chassis, payload, route and operating conditions.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <Container>
          <div>
            <DetailAccordion
              items={[
                {
                  id: "full-story",
                  title: "Read our full story",
                  content: (
                    <div className="max-w-3xl space-y-4 text-[1.0625rem] leading-relaxed text-mute">
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

      <section className="sec">
        <div className="wrap">
          <Head label="Inside the workshop">
            Same team, <span className="red">start to finish.</span>
          </Head>
          <Shots
            items={workshop.map((w, n) => ({
              src: w.photo.src,
              alt: w.photo.alt,
              title: w.title,
              tag: String(n + 1).padStart(2, "0"),
            }))}
          />
        </div>
      </section>

      <section className="sec ruled">
        <div className="wrap">
          <Head label="Experience">
            Built on <span className="red">experience.</span>
          </Head>
          <Steps items={milestones.map((m) => [m.title, m.body] as [string, string])} />
        </div>
      </section>

      <CTASection
        heading={
          <>
            Get a quote for your <span className="red">next build.</span>
          </>
        }
        secondaryCta={{ label: "Configure your build", href: "/configure" }}
      />
    </>
  );
}
