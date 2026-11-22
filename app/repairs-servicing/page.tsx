import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import { CTASection } from "@/components/CTASection";
import { Acc, Action, Feat, Head, PageOpen, Pair, Split } from "@/components/Blocks";
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

      <PageOpen
        crumbs={crumbs}
        long
        title={
          <>
            Fixed by the people
            <br />
            who <span className="red">build them.</span>
          </>
        }
        sub="Tipper bodies, trailers and heavy vehicle components repaired, rebuilt and maintained in Campbellfield."
        actions={
          <>
            <Action href={bookingUrl}>Book an inspection</Action>
            <Action href={site.phoneHref} tone="line" arrow={false}>
              Call {site.phone}
            </Action>
          </>
        }
        photo={{ src: media.workshop.src, alt: media.workshop.alt, position: "50% 42%" }}
        facts={[
          ["Any make", "Tippers, dogs and semis"],
          ["In writing", "Quote before work starts"],
          ["Insurance", "Claims documented"],
          ["25+", "Years’ experience"],
        ]}
      />

      <section className="sec" id="overview">
        <div className="wrap">
          <Head label="Capability" note="Not just Arrow-built units.">
            What we <span className="red">repair.</span>
          </Head>
          <Feat
            items={[
              ["Structural", "Cracked rails, cross-members and chassis mounts."],
              ["Tipper bins", "Repairs, panel replacement and rebuilds."],
              ["Tailgates", "Hinges, latches, seals and rebuilds."],
              ["Hydraulics", "Hoist, ram, pump and valve repairs."],
              ["Modifications", "Headboards, sub-frames and custom fabrication."],
              ["Servicing", "Scheduled maintenance for tippers and trailers."],
              ["Parts", "JOST, SAF-Holland, Hella and Wurth."],
              ["Insurance", "Quoted and documented for insurer claims."],
            ]}
          />
        </div>
      </section>

      <Split
        id="services"
        label="Service options"
        heading={
          <>
            How it <span className="red">works.</span>
          </>
        }
        note="Not sure what it needs? Start with a diagnostic inspection."
        tags={useCases}
      >
        <Acc openFirst items={repairOptions.map((o) => ({ q: o.title, a: o.body }))} />
      </Split>

      <Pair
        id="faq"
        label="Why Arrow"
        heading={
          <>
            One workshop. <span className="red">One team.</span>
          </>
        }
        bullets={compliance}
        faqs={faqs}
      />

      <CTASection
        eyebrow="Repairs & servicing"
        heading={
          <>
            Need a tipper or trailer <span className="red">repaired?</span>
          </>
        }
        primaryCta={{ label: "Book an inspection", href: bookingUrl }}
      />
    </>
  );
}
