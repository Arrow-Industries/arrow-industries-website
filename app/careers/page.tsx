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
      <ProductHero
        crumbs={crumbs}
        badge="Careers"
        heading="Build heavy gear with us."
        body="We're always looking for reliable tradespeople and apprentices who take pride in their work."
        image={media.welding.src}
        imageAlt={media.welding.alt}
        imagePosition="50% 30%"
        actions={
          <>
            <Button href="#apply" size="lg">
              Apply now
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* 2 — Why work with Arrow */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="A workshop worth turning up to."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {whyArrow.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="card flex items-center gap-4 p-4 sm:flex-col sm:items-start sm:p-6"
                >
                  <span className="icon-tile shrink-0">
                    <Icon
                      className="h-5 w-5 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h3 className="text-[1.75rem] text-bone">
                    {item.title}
                  </h3>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 3 — The workshop */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="The workshop"
            heading="Inside the Campbellfield workshop."
          />
          <WorkshopStrip items={workshop} />
        </Container>
      </section>

      {/* 4 — Roles and the detail behind them */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Roles we hire for"
            heading="The roles that build an Arrow unit."
            className="mb-5"
          />
          <Pills items={roles.map((role) => role.title)} />
          <div className="mt-6">
            <DetailAccordion
              items={[
                {
                  id: "roles",
                  title: "Role descriptions",
                  content: <InfoGrid items={roles} />,
                },
                {
                  id: "look-for",
                  title: "What we look for",
                  content: (
                    <div className="grid gap-3">
                      <p className="display text-[1.75rem] text-bone">
                        The people who fit in here.
                      </p>
                      <CheckGrid items={lookFor} />
                      <p className="text-sm leading-relaxed text-mute">
                        The more detail you give us, the easier it is to match
                        you to the right role. Send your details through and
                        we&rsquo;ll be in touch if your experience matches a
                        current or upcoming opportunity.
                      </p>
                    </div>
                  ),
                },
                {
                  id: "why-arrow",
                  title: "Why work at Arrow",
                  content: (
                    <div className="grid gap-3">
                      <p className="text-sm leading-relaxed text-mute">
                        Family-owned workshop. Steady work. Real builds. Arrow
                        Industries builds custom tipper bodies, trailers and
                        heavy vehicle equipment from our Campbellfield workshop.
                      </p>
                      <InfoGrid
                        items={whyArrow.map((item) => ({
                          title: item.title,
                          body: item.body,
                        }))}
                      />
                    </div>
                  ),
                },
                {
                  id: "workshop",
                  title: "Inside the workshop",
                  content: (
                    <InfoGrid
                      items={workshop.map((item) => ({
                        title: item.title,
                        body: item.detail,
                      }))}
                    />
                  ),
                },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* 5 — Application form */}
      <section
        id="apply"
        className="section"
      >
        <Container>
          <SectionHeader
            eyebrow="Apply"
            heading="Apply in under 2 minutes."
            body="No updated resume? Apply anyway."
            className="mb-10"
          />
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <CareersForm />
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-20 flex flex-col gap-6">
                {/* Email card */}
                <div className="card p-6">
                  <h2 className="text-base font-semibold text-bone">
                    Prefer to email?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    Send your resume or a quick note directly to our team.
                  </p>
                  <a
                    href={site.emailHref}
                    className="mt-4 inline-flex items-center gap-2 break-all text-base font-semibold text-accent-text hover:underline"
                  >
                    <Mail className="h-5 w-5 shrink-0" aria-hidden />
                    {site.email}
                  </a>
                </div>

                {/* Workshop card */}
                <div className="card p-6">
                  <h2 className="text-base font-semibold text-bone">Workshop</h2>
                  <div className="mt-4 flex items-start gap-3">
                    <span className="icon-tile">
                      <MapPin
                        className="h-[1.125rem] w-[1.125rem] text-accent"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <a
                      href={site.address.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium leading-relaxed text-bone hover:text-accent-text"
                    >
                      {site.address.line1}
                      <br />
                      {site.address.suburb} {site.address.state}{" "}
                      {site.address.postcode}
                    </a>
                  </div>
                  <div className="mt-5 flex items-start gap-3 border-t border-line-soft pt-5">
                    <span className="icon-tile">
                      <Clock
                        className="h-[1.125rem] w-[1.125rem] text-accent"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="label">
                        Hours
                      </p>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed text-bone">
                        {site.hours[0].label}
                        <br />
                        {site.hours[0].time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* 6 — FAQ and call to action */}
      <section className="section">
        <Container className="max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            heading="Working at Arrow"
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <FAQAccordion items={careersFAQs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Get in touch"
        heading="Reckon you'd be a good fit?"
        primaryCta={{ label: "Apply now", href: "#apply" }}
      />
    </>
  );
}
