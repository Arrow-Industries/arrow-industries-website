import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CheckGrid, CheckList, InfoGrid, PhotoBand } from "@/components/ProductParts";
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

const panelLead = "mb-5 max-w-3xl text-[1.0625rem] leading-relaxed text-mute";

const features = [
  {
    title: "Structural repairs",
    body: "Cracked rails, damaged cross-members and chassis-mount repairs welded back to spec.",
  },
  {
    title: "Tipper bins",
    body: "Repairs, panel replacement and full rebuilds for damaged or worn tipper bodies.",
  },
  {
    title: "Tailgates",
    body: "Tailgate hinges, latches, seals and full tailgate rebuilds for tippers and dogs.",
  },
  {
    title: "Hydraulics",
    body: "Hoist, ram, pump and valve repairs — sourced and fitted from trusted suppliers.",
  },
  {
    title: "Modifications",
    body: "Custom fabrication, headboard changes, sub-frame work and chassis modifications.",
  },
  {
    title: "Preventative servicing",
    body: "Scheduled maintenance to keep tippers, trailers and combinations operating reliably.",
  },
  {
    title: "Quality parts",
    body: "Replacement components from JOST, SAF-Holland, Hella, Wurth and other proven suppliers.",
  },
  {
    title: "Insurance repairs",
    body: "Quoted and completed for insurer-managed claims with full documentation supplied.",
  },
];

const useCases = [
  "Damaged tipper bins",
  "Tailgate failures",
  "Hydraulic faults",
  "Structural cracking",
  "Suspension repairs",
  "Electrical faults",
  "Insurance repairs",
  "Fleet preparation",
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
            Fixed by the people <span className="text-accent">who build them.</span>
          </>
        }
        body="Tipper bodies, trailers and heavy vehicle components repaired, rebuilt and maintained from our Campbellfield workshop."
        image={media.workshop.src}
        imageAlt={media.workshop.alt}
        imagePosition="50% 42%"
        actions={
          <>
            <Button href={bookingUrl} size="lg" target="_blank" rel="noreferrer">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book an inspection
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              Call {site.phone}
            </Button>
          </>
        }
      />

      <section id="overview" className="band">
        <Container>
          <SectionHeader eyebrow="Capability" heading="What we repair." className="mb-7 lg:mb-11" />
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <li key={f.title} className="border-t border-line py-4">
                <h3 className="display-sm">{f.title}</h3>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="why-arrow">
        <PhotoBand
          photo={media.welding}
          eyebrow="Why Arrow"
          heading="One workshop. One team."
          body="Insurance repairs, fabrication work and ongoing servicing, done by the team that builds tippers and trailers."
        />
      </section>

      <section id="services" className="band">
        <Container>
          <SectionHeader eyebrow="Service options" heading="The full detail." className="mb-7 lg:mb-11" />
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
                    <CheckGrid items={useCases} />
                  </>
                ),
              },
              {
                id: "options",
                title: "Insurance, fleet & service options",
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

      <section id="faq" className="scroll-mt-8 pb-16 lg:pb-24">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Common questions." className="mb-7 lg:mb-11" />
          <FAQAccordion items={faqs} />
        </Container>
      </section>

      <CTASection
        eyebrow="Repairs & Servicing"
        heading="Need a tipper or trailer repaired?"
        primaryCta={{ label: "Book an inspection", href: bookingUrl }}
      />
    </>
  );
}
