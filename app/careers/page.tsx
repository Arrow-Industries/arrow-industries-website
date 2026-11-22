import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Clock, Hammer, Layers, Mail, MapPin, Users } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import {
  CheckGrid,
  InfoGrid,
  Pills,
  WorkshopStrip,
} from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { CareersForm } from "@/components/CareersForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { Acc, Action, Feat, Head, PageOpen, Pair, Split } from "@/components/Blocks";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import type { FAQ } from "@/data/faqs";
import { media } from "@/data/media";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Careers — Trades & Workshop Jobs at Arrow Industries",
  description:
    "Trades and workshop jobs at Arrow Industries, Campbellfield — boilermakers, auto electricians, painters, hydraulic fitters and apprentices. Apply in minutes.",
  path: "/careers",
});

// Handles the careers form's server action (resume upload streamed to Graph).
// See /request-a-quote for the rationale.
export const maxDuration = 60;

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/careers" },
];

const whyArrow = [
  {
    icon: Hammer,
    title: "Real builds, not repetitive line work",
    body: "Every build is different, from tipper bodies to trailers and custom heavy vehicle projects.",
  },
  {
    icon: Layers,
    title: "Stable, ongoing work",
    body: "Full-time roles, consistent hours and a strong pipeline of work.",
  },
  {
    icon: Users,
    title: "Hands-on family business",
    body: "You're not just a number. Good work gets noticed by the people running the place.",
  },
];

const lookFor = [
  "Reliable and turns up on time",
  "Takes pride in quality workmanship",
  "Works safely in a busy workshop",
  "Positive attitude and team mindset",
  "Willing to learn and improve",
  "Experience with heavy vehicles, fabrication, hydraulics or manufacturing is a bonus",
];

const roles = [
  {
    title: "Welder / Fabricator",
    body: "Entry-level or general welding and fabrication, working under direction. No formal qualification or prior experience required.",
  },
  {
    title: "Senior Welder / Fabricator",
    body: "Experienced welder/fabricator who works independently, reads drawings and handles more complex builds — without a formal trade qualification.",
  },
  {
    title: "Qualified Boilermaker / Welder",
    body: "Holds a recognised trade qualification — skilled fabrication, welding, drawing interpretation and complex manufacturing work.",
  },
  {
    title: "Auto Electrician",
    body: "12V/24V wiring, lighting systems, diagnostics and hydraulic control systems.",
  },
  {
    title: "Painter",
    body: "Preparation, priming and painting of truck bodies, trailers and fabricated components.",
  },
  {
    title: "Hydraulic Fitter",
    body: "Installation, servicing and troubleshooting of hydraulic systems, hoists, pumps and controls.",
  },
  {
    title: "Trade Assistant",
    body: "Support fabrication, assembly and workshop operations while learning alongside experienced tradespeople.",
  },
  {
    title: "Apprentice",
    body: "Start your trade career in a busy workshop with hands-on training and real projects.",
  },
  {
    title: "Engineer",
    body: "Design and engineering support for custom builds — drawings, specs and compliance.",
  },
  {
    title: "Operations Supervisor",
    body: "Coordinate the workshop floor — scheduling, workflow and keeping builds on track.",
  },
  {
    title: "Administration",
    body: "Office and customer support — scheduling, paperwork, invoicing and keeping things running.",
  },
  {
    title: "Other",
    body: "Have relevant heavy vehicle, manufacturing or workshop experience? We'd still like to hear from you.",
  },
];

const workshop = [
  {
    photo: media.paintBooth,
    title: "Prep and paint",
    body: "Preparation, priming and painting.",
    detail: "Preparation, priming and painting of truck bodies, trailers and fabricated components.",
  },
  {
    photo: media.welding,
    title: "Fabrication",
    body: "Inspected before paint.",
    detail: "Welds laid by qualified fabricators, inspected before paint.",
  },
  {
    photo: media.workshop,
    title: "Campbellfield workshop",
    body: "One workshop, one hands-on team.",
    detail: "One workshop, one hands-on team. Monday to Friday, 7:00 AM to 4:00 PM.",
  },
];

const careersFAQs: FAQ[] = [
  {
    question: "Do you have positions open right now?",
    answer:
      "It depends on workload and current projects. Even if nothing is advertised, we keep strong applications on file and contact suitable candidates when opportunities become available.",
  },
  {
    question: "Do I need trailer or tipper body experience?",
    answer:
      "Not necessarily. Experience in fabrication, heavy vehicles, hydraulics, auto electrical or manufacturing can all be highly relevant.",
  },
  {
    question: "Can I apply without a resume?",
    answer:
      "Yes. Complete the form with as much information as possible and we'll contact you if there's a suitable opportunity.",
  },
  {
    question: "Do you take apprentices?",
    answer:
      "Yes. We welcome apprentice and trade assistant applications from people with the right attitude and willingness to learn.",
  },
  {
    question: "What are the workshop hours?",
    answer:
      "Monday to Friday, 7:00 AM to 4:00 PM. Overtime may be available depending on workload.",
  },
];

export default function CareersPage() {
  return (
    <>
      <JsonLd data={[faqPageSchema(careersFAQs), breadcrumbSchema(crumbs)]} />

      {/* 1 — Hero */}
      <PageOpen
        crumbs={crumbs}
        long
        title={
          <>
            Build heavy gear
            <br />
            <span className="red">with us.</span>
          </>
        }
        sub="We’re always looking for reliable tradespeople and apprentices who take pride in their work."
        actions={
          <>
            <Action href="#apply">Apply now</Action>
            <Action href={site.phoneHref} tone="line" arrow={false}>
              Call {site.phone}
            </Action>
          </>
        }
        photo={{ src: media.welding.src, alt: media.welding.alt, position: "50% 30%" }}
        facts={[
          ["Full-time", "Stable, ongoing work"],
          ["Mon–Fri", "7:00 AM – 4:00 PM"],
          ["Family", "Hands-on business"],
          ["Apprentices", "Welcome"],
        ]}
      />

      <section className="sec">
        <div className="wrap">
          <Head label="Why Arrow">
            Worth turning <span className="red">up to.</span>
          </Head>
          <Feat
            cols={3}
            items={[
              ["Real builds", "Every build is different, from tipper bodies to trailers."],
              ["Stable work", "Full-time roles, consistent hours and a strong pipeline."],
              ["Family business", "Good work gets noticed by the people running the place."],
            ]}
          />
        </div>
      </section>

      <Split
        label="Roles"
        heading={
          <>
            Where you <span className="red">fit.</span>
          </>
        }
        note="Nothing advertised? Strong applications are kept on file."
      >
        <Acc openFirst items={roles.map((r) => ({ q: r.title, a: r.body }))} />
      </Split>

      <section className="sec flush" id="apply">
        <div className="wrap book">
          <div className="book-card reveal" style={{ alignSelf: "start", position: "sticky", top: 96 }}>
            <p className="mlabel">Apply</p>
            <h2>
              Apply in under <span className="red">2 minutes.</span>
            </h2>
            <ul>
              <li>No updated resume? Apply anyway</li>
              <li>Apprentices and trade assistants welcome</li>
              <li>Strong applications are kept on file</li>
            </ul>
            <div className="book-meta">
              <div>
                <small>Workshop</small>
                <a href={site.address.mapsHref} target="_blank" rel="noreferrer">
                  {site.address.line1}
                  <br />
                  {site.address.suburb} {site.address.state} {site.address.postcode}
                </a>
              </div>
              <div>
                <small>Hours</small>
                {site.hours[0].label}
                <br />
                {site.hours[0].time}
              </div>
              <div>
                <small>Prefer to email?</small>
                <a href={site.emailHref}>{site.email}</a>
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <CareersForm />
          </div>
        </div>
      </section>

      <Pair
        label="What we look for"
        heading={
          <>
            The right <span className="red">attitude.</span>
          </>
        }
        bullets={lookFor}
        faqs={careersFAQs}
      />

      <CTASection
        eyebrow="Get in touch"
        heading={
          <>
            Reckon you&rsquo;d be a <span className="red">good fit?</span>
          </>
        }
        primaryCta={{ label: "Apply now", href: "#apply" }}
      />
    </>
  );
}
