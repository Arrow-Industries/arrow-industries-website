import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  Clock,
  Drill,
  GraduationCap,
  HandHelping,
  Hammer,
  Layers,
  Mail,
  MapPin,
  PaintRoller,
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
    "Join Arrow Industries' Campbellfield workshop. We hire boilermakers, auto electricians, painters, hydraulic fitters, trade assistants and apprentices — apply in under 2 minutes.",
  path: "/careers",
});

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
    icon: Hammer,
    title: "Boilermaker / Fabricator",
    body: "Heavy fabrication of tipper bodies, trailers and custom steel builds from start to finish.",
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
              Apply Now
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              Call 0468 067 280
            </Button>
          </>
        }
      />

      {/* Trust strip */}
      <div className="border-b border-line bg-ink-2">
        <Container className="py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-text">
            Family-owned workshop.{" "}
            <span className="text-bone">Steady work. Real builds.</span>
          </p>
        </Container>
      </div>

      {/* Why work with Arrow */}
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="Why Arrow"
            heading="A workshop worth turning up to."
          />
          <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {whyArrow.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex flex-col gap-4 bg-ink-2 p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center border border-accent/40 bg-accent/10">
                    <Icon
                      className="h-5 w-5 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h3 className="text-base font-bold text-bone">
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
      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="What we look for"
            heading="The people who fit in here."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {lookFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border border-line bg-ink-2 p-5"
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
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="Roles we hire for"
            heading="The trades that build an Arrow unit."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <li
                  key={role.title}
                  className="flex flex-col gap-3 border border-line bg-ink p-6 transition-colors hover:border-accent/50"
                >
                  <Icon
                    className="h-6 w-6 text-accent"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="text-base font-bold text-bone">
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
        className="scroll-mt-24 border-b border-line bg-ink py-16 lg:py-20"
      >
        <Container>
          <SectionHeader
            eyebrow="Apply"
            heading="Apply in under 2 minutes."
            body="No updated resume? Apply anyway. The more detail you give us, the easier it is to match you to the right role."
            className="mb-10"
          />
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <CareersForm />
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Email card */}
                <div className="border border-line bg-ink-2 p-6">
                  <h2 className="text-base font-bold text-bone">
                    Prefer to email?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-mute">
                    Send your resume or a quick note directly to our team.
                  </p>
                  <a
                    href={site.emailHref}
                    className="mt-4 inline-flex items-center gap-2 break-all text-base font-bold text-accent-text hover:underline"
                  >
                    <Mail className="h-5 w-5 shrink-0" aria-hidden />
                    {site.email}
                  </a>
                </div>

                {/* Workshop card */}
                <div className="border border-line bg-ink-2 p-6">
                  <h2 className="text-base font-bold text-bone">Workshop</h2>
                  <div className="mt-4 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
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
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
                      <Clock
                        className="h-[1.125rem] w-[1.125rem] text-accent"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
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
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
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
        primaryCta={{ label: "Apply Now", href: "#apply" }}
        phoneCta={{ label: "Call 0468 067 280", href: site.phoneHref }}
      />
    </>
  );
}
