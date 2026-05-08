import type { Metadata } from "next";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Cog,
  FileSignature,
  Hammer,
  HardHat,
  Package,
  Phone,
  ShieldAlert,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema, serviceSchema } from "@/lib/schema";
import { getServiceBySlug } from "@/data/services";
import { getServiceContent } from "@/data/serviceContent";
import { site } from "@/data/site";

const SLUG = "repairs-servicing";
const repairsService = getServiceBySlug(SLUG);
const repairsContent = getServiceContent(SLUG);

export const metadata: Metadata = {
  title: "Truck Body & Trailer Repairs Campbellfield — Tipper Repair Workshop",
  description:
    "Tipper body, trailer and heavy vehicle component repairs, rebuilds and servicing from our Campbellfield workshop. Insurance work, hydraulics and fabrication.",
  alternates: { canonical: `/${SLUG}` },
};

const bookingUrl = site.booking.roadworthy;

const features = [
  {
    icon: Hammer,
    title: "Structural repairs",
    body: "Cracked rails, damaged cross-members and chassis-mount repairs welded back to spec.",
  },
  {
    icon: Truck,
    title: "Tipper bins",
    body: "Repairs, panel replacement and full rebuilds for damaged or worn tipper bodies.",
  },
  {
    icon: ShieldAlert,
    title: "Tailgates",
    body: "Tailgate hinges, latches, seals and full tailgate rebuilds for tippers and dogs.",
  },
  {
    icon: Cog,
    title: "Hydraulics",
    body: "Hoist, ram, pump and valve repairs — sourced and fitted from trusted suppliers.",
  },
  {
    icon: Wrench,
    title: "Modifications",
    body: "Custom fabrication, headboard changes, sub-frame work and chassis modifications.",
  },
  {
    icon: CalendarCheck,
    title: "Preventative servicing",
    body: "Scheduled maintenance to keep tippers, trailers and combinations operating reliably.",
  },
  {
    icon: Package,
    title: "Quality parts",
    body: "Replacement components from JOST, SAF-Holland, Hella, Wurth and other proven suppliers.",
  },
  {
    icon: FileSignature,
    title: "Insurance repairs",
    body: "Quoted and completed for insurer-managed claims with full documentation supplied.",
  },
];

const useCases = [
  { icon: Truck, label: "Damaged tipper bins" },
  { icon: ShieldAlert, label: "Tailgate failures" },
  { icon: Cog, label: "Hydraulic faults" },
  { icon: Hammer, label: "Structural cracking" },
  { icon: Wrench, label: "Suspension repairs" },
  { icon: Zap, label: "Electrical faults" },
  { icon: FileSignature, label: "Insurance repairs" },
  { icon: HardHat, label: "Fleet preparation" },
];

const repairOptions = [
  {
    title: "Diagnostic inspection",
    body: "Workshop inspection to identify the issue, scope the work and provide a written quote before any repair starts.",
  },
  {
    title: "Insurance repairs",
    body: "Full insurer documentation, quote support and repair work managed from start to finish — minimising downtime.",
  },
  {
    title: "Roadworthy combo",
    body: "Combine a roadworthy inspection with required repairs. We diagnose, you arrange the work, then return for re-inspection.",
  },
  {
    title: "Fleet servicing",
    body: "Scheduled servicing blocks for fleet operators — predictable downtime, predictable cost and consistent records.",
  },
];

const compliance = [
  "VicRoads Licensed Vehicle Testing station",
  "25+ years of heavy vehicle and trailer fabrication experience",
  "Documented inspection reports and insurer-ready quotes",
  "Components sourced from JOST, SAF-Holland, Hella, Wurth and other proven suppliers",
  "Repairs completed in the same workshop that builds Arrow tippers and trailers",
];

const faqs = [
  {
    question: "Do you handle insurance repairs?",
    answer:
      "Yes. We quote, document and complete insurer-managed claims for tipper bodies, trailers and heavy vehicle components — full documentation supplied to your insurer.",
  },
  {
    question: "How quickly can you turn repairs around?",
    answer:
      "Lead time depends on parts availability and workshop load. After a diagnostic inspection we'll give you a written quote with a realistic completion date.",
  },
  {
    question: "Do you service vehicles you didn't build?",
    answer:
      "Yes. We repair and service tippers, dog trailers, semi trailers and heavy vehicle components of any make — not just Arrow-built units.",
  },
  {
    question: "Can repairs be combined with a roadworthy inspection?",
    answer:
      "Yes. We can diagnose required work as part of a Licensed Vehicle Testing visit, then re-inspect once the repairs are complete.",
  },
];

export default function RepairsPage() {
  return (
    <>
      <JsonLd
        data={[
          ...(repairsService
            ? [serviceSchema(repairsService, repairsContent)]
            : []),
          faqPageSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow="Repairs & Servicing"
        heading="Truck body and trailer repairs, built for real work."
        body="Tipper bodies, trailers and heavy vehicle components repaired, rebuilt and maintained from our Campbellfield workshop."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Repairs & Servicing" },
        ]}
        actions={
          <>
            <Button
              href={bookingUrl}
              size="lg"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book Inspection Online
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4" aria-hidden />
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* Overview */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Overview"
              heading="Heavy vehicle repairs, done by the same team that builds tippers and trailers."
            />
          </div>
          <div className="lg:col-span-7 space-y-5 text-base leading-relaxed text-mute sm:text-lg">
            <p>
              From damaged tipper bins and tailgates to structural repairs and
              hydraulic faults, we get heavy vehicles and trailers back on the
              road quickly.
            </p>
            <p>
              We handle insurance repairs, fabrication work and ongoing
              servicing — all from the same workshop that builds our bodies.
            </p>
          </div>
        </Container>
      </section>

      {/* Key features */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Capability"
            heading="What we repair, rebuild and service."
            body="One workshop, full repair scope — from cracked rails to hydraulic rebuilds."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex flex-col gap-3 bg-ink-2 p-8">
                  <span className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mute">{f.body}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Common work */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Use cases"
              heading="Common repair and servicing work."
              body="Most jobs land in one of these categories — but if you're not sure, book a diagnostic inspection."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 gap-px overflow-hidden bg-line-soft sm:grid-cols-2">
              {useCases.map((u) => {
                const Icon = u.icon;
                return (
                  <li
                    key={u.label}
                    className="flex items-center gap-4 bg-ink p-5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent/10 text-accent">
                      <Icon
                        className="h-[1.125rem] w-[1.125rem]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    </span>
                    <span className="text-sm font-semibold text-bone sm:text-base">
                      {u.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      {/* Repair options */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Service options"
            heading="Repair and service options."
            body="Pick the path that suits the job. Every option starts with a written diagnostic and quote."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {repairOptions.map((r) => (
              <li
                key={r.title}
                className="flex flex-col gap-3 bg-ink-2 p-8"
              >
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{r.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Compliance / why us */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Why Arrow"
              heading="Workshop credentials that hold up under load."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line-soft">
              {compliance.map((c) => (
                <li key={c} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                  <ClipboardList
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {c}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="FAQ"
              heading="Common questions, answered."
              body="Still have a question? Call the workshop or book an inspection."
            />
            <div className="mt-8 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-mute">
                <Phone className="h-4 w-4 text-accent" aria-hidden />
                <a href={site.phoneHref} className="hover:text-bone">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-2 text-mute">
                <CalendarCheck className="h-4 w-4 text-accent" aria-hidden />
                Mon – Fri, 7:00 AM – 4:00 PM
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-line-soft">
              {faqs.map((f) => (
                <li key={f.question} className="py-7 first:pt-0 last:pb-0">
                  <h3 className="font-display text-lg font-bold text-bone sm:text-xl">
                    {f.question}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">
                    {f.answer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Repairs & Servicing"
        heading="Need a tipper or trailer repaired?"
        body="Book an inspection, get a clear quote and have the work completed from our Campbellfield workshop."
        primaryCta={{
          label: "Book Inspection Online",
          href: bookingUrl,
        }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Diagnostic inspection · Written quote · Insurance work supported"
      />
    </>
  );
}
