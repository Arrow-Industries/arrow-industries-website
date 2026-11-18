import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  CalendarCheck,
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
import { ProductHero } from "@/components/ProductHero";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CheckList, InfoGrid, PhotoBand } from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schema";
import { media } from "@/data/media";
import { getServiceBySlug } from "@/data/services";
import { getServiceContent } from "@/data/serviceContent";
import { site } from "@/data/site";

const SLUG = "repairs-servicing";
const repairsService = getServiceBySlug(SLUG);
const repairsContent = getServiceContent(SLUG);

export const metadata: Metadata = pageMetadata({
  title: "Truck Body & Trailer Repairs Campbellfield — Tipper Repair Workshop",
  description:
    "Tipper body, trailer and heavy vehicle component repairs, rebuilds and servicing from our Campbellfield workshop. Insurance work, hydraulics and fabrication.",
  path: `/${SLUG}`,
});

const bookingUrl = site.booking.roadworthy;

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Repairs & Servicing", href: "/repairs-servicing" },
];

const panelLead = "mb-4 max-w-2xl text-sm leading-relaxed text-mute";

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
          breadcrumbSchema(crumbs),
        ]}
      />

      <ProductHero
        crumbs={crumbs}
        badge="Repairs & Servicing"
        heading={
          <>
            Truck body and trailer repairs,{" "}
            <span className="text-accent">built for real work.</span>
          </>
        }
        body="Tipper bodies, trailers and heavy vehicle components repaired, rebuilt and maintained from our Campbellfield workshop."
        image={media.workshop.src}
        imagePosition="50% 42%"
        actions={
          <>
            <Button
              href={bookingUrl}
              size="lg"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book an inspection
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4 text-accent-text" aria-hidden />
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* What we repair: icons and titles, with the descriptions in the detail below */}
      <section id="overview" className="section">
        <Container>
          <SectionHeader
            eyebrow="Capability"
            heading="What we repair, rebuild and service."
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="card flex min-w-0 flex-col gap-3 p-4 sm:p-5">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-bone">
                    {f.title}
                  </h3>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section id="why-arrow" className="section">
        <Container>
          <PhotoBand
            photo={media.welding}
            eyebrow="Why Arrow"
            heading="Done by the same team that builds tippers and trailers."
            body="Insurance repairs, fabrication work and ongoing servicing, all from one workshop."
          />
        </Container>
      </section>

      {/* The full wording, closed until someone wants it */}
      <section id="services" className="section">
        <Container>
          <SectionHeader
            eyebrow="Service options"
            heading="The detail, when you need it."
            className="mb-6"
          />
          <DetailAccordion
            items={[
              {
                id: "capability",
                title: "What each repair covers",
                content: (
                  <>
                    <p className={panelLead}>
                      From damaged tipper bins and tailgates to structural repairs and
                      hydraulic faults, we get heavy vehicles and trailers back on the
                      road quickly. One workshop, full repair scope &mdash; from cracked
                      rails to hydraulic rebuilds.
                    </p>
                    <InfoGrid items={features} />
                  </>
                ),
              },
              {
                id: "common",
                title: "Common work",
                content: (
                  <>
                    <p className={panelLead}>
                      Most jobs land in one of these categories &mdash; but if you&rsquo;re not sure, book a diagnostic inspection.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {useCases.map((u) => {
                        const Icon = u.icon;
                        return (
                          <li key={u.label} className="card flex items-center gap-3 p-4">
                            <span className="icon-tile">
                              <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden />
                            </span>
                            <span className="min-w-0 text-sm font-semibold text-bone">{u.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ),
              },
              {
                id: "options",
                title: "Service options",
                content: (
                  <>
                    <p className={panelLead}>
                      Pick the path that suits the job. Every option starts with a written diagnostic and quote.
                    </p>
                    <InfoGrid items={repairOptions} />
                  </>
                ),
              },
              {
                id: "credentials",
                title: "Workshop credentials",
                content: (
                  <>
                    <p className={panelLead}>
                      We handle insurance repairs, fabrication work and ongoing servicing
                      &mdash; all from the same workshop that builds our bodies.
                    </p>
                    <CheckList items={compliance} />
                  </>
                ),
              },
            ]}
          />
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions, answered." />
          <div className="mt-6">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Repairs & Servicing"
        heading="Need a tipper or trailer repaired?"
        primaryCta={{
          label: "Book an inspection",
          href: bookingUrl,
        }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="Diagnostic inspection · Written quote · Insurance work supported"
      />
    </>
  );
}
