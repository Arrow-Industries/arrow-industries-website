import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  Award,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  Drill,
  Flame,
  GraduationCap,
  HandHelping,
  Hammer,
  Layers,
  Mail,
  MapPin,
  PaintRoller,
  Ruler,
  Users,
  Zap,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CareersForm } from "@/components/CareersForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import type { FAQ } from "@/data/faqs";
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
    icon: Flame,
    title: "Welder / Fabricator",
    body: "Entry-level or general welding and fabrication, working under direction. No formal qualification or prior experience required.",
  },
  {
    icon: Hammer,
    title: "Senior Welder / Fabricator",
    body: "Experienced welder/fabricator who works independently, reads drawings and handles more complex builds — without a formal trade qualification.",
  },
  {
    icon: Award,
    title: "Qualified Boilermaker / Welder",
    body: "Holds a recognised trade qualification — skilled fabrication, welding, drawing interpretation and complex manufacturing work.",
  },
  {
    icon: Zap,
    title: "Auto Electrician",
    body: "12V/24V wiring, lighting systems, diagnostics and hydraulic control systems.",
  },
  {
    icon: PaintRoller,
    title: "Painter",
    body: "Preparation, priming and painting of truck bodies, trailers and fabricated components.",
  },
  {
    icon: Drill,
    title: "Hydraulic Fitter",
    body: "Installation, servicing and troubleshooting of hydraulic systems, hoists, pumps and controls.",
  },
  {
    icon: HandHelping,
    title: "Trade Assistant",
    body: "Support fabrication, assembly and workshop operations while learning alongside experienced tradespeople.",
  },
  {
    icon: GraduationCap,
    title: "Apprentice",
    body: "Start your trade career in a busy workshop with hands-on training and real projects.",
  },
  {
    icon: Ruler,
    title: "Engineer",
    body: "Design and engineering support for custom builds — drawings, specs and compliance.",
  },
  {
    icon: ClipboardList,
    title: "Operations Supervisor",
    body: "Coordinate the workshop floor — scheduling, workflow and keeping builds on track.",
  },
  {
    icon: Briefcase,
    title: "Administration",
    body: "Office and customer support — scheduling, paperwork, invoicing and keeping things running.",
  },
  {
    icon: Users,
    title: "Other",
    body: "Have relevant heavy vehicle, manufacturing or workshop experience? We'd still like to hear from you.",
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
      <JsonLd data={faqPageSchema(careersFAQs)} />

      <PageHero
        eyebrow="Careers"
        heading="Build heavy gear with a Melbourne workshop that backs its trades."
        body="Arrow Industries builds custom tipper bodies, trailers and heavy vehicle equipment from our Campbellfield workshop. We're always looking for reliable tradespeople and apprentices who take pride in their work."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
        ]}
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

      {/* Trust strip */}
      <Container className="pb-2">
        <div className="card px-5 py-3.5">
          <p className="eyebrow">
            Family-owned workshop.{" "}
            <span className="text-bone">Steady work. Real builds.</span>
          </p>
        </div>
      </Container>

      {/* Why work with Arrow */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="A workshop worth turning up to."
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {whyArrow.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="card flex flex-col gap-4 p-5 sm:p-6"
                >
                  <span className="icon-tile">
                    <Icon
                      className="h-5 w-5 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h3 className="text-base font-semibold text-bone">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mute">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* What we look for */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="What we look for"
            heading="The people who fit in here."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {lookFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 card p-5"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-bone">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Roles we hire for */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Roles we hire for"
            heading="The roles that build an Arrow unit."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <li
                  key={role.title}
                  className="card flex flex-col gap-3 p-5 sm:p-6"
                >
                  <Icon
                    className="h-6 w-6 text-accent"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="text-base font-semibold text-bone">
                    {role.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mute">
                    {role.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Application form */}
      <section
        id="apply"
        className="section"
      >
        <Container>
          <SectionHeader
            eyebrow="Apply"
            heading="Apply in under 2 minutes."
            body="No updated resume? Apply anyway. The more detail you give us, the easier it is to match you to the right role."
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

      {/* FAQ */}
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
        body="Send your details through and we'll be in touch if your experience matches a current or upcoming opportunity."
        primaryCta={{ label: "Apply now", href: "#apply" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
      />
    </>
  );
}
