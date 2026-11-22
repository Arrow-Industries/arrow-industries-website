import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { CalendarCheck, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { Action, Crumbs, Facts, Head, Pair, Split, Steps } from "@/components/Blocks";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CheckGrid, InfoGrid, ProcessSteps, StatTiles } from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { SectionBar } from "@/components/SectionBar";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/schema";
import { getServiceBySlug } from "@/data/services";
import { getServiceContent } from "@/data/serviceContent";
import { site } from "@/data/site";
import { RoadworthyBookingForm } from "@/components/RoadworthyBookingForm";
import { RoadworthyUnavailable } from "@/components/RoadworthyUnavailable";
import { getRwcBookingOptions } from "@/lib/roadworthy";
import { flags } from "@/data/flags";

const SLUG = "licensed-vehicle-testing";
const lvtService = getServiceBySlug(SLUG);
const lvtContent = getServiceContent(SLUG);

export const metadata: Metadata = pageMetadata({
  title:
    "Heavy Vehicle & Trailer Roadworthy Inspections — Campbellfield",
  description:
    "VicRoads-licensed heavy vehicle and trailer inspections in Campbellfield — prime movers, rigid trucks, tippers, dog and semi trailers. Book online.",
  path: `/${SLUG}`,
});

// Booking requests land in the dashboard's Roadworthy tab for approval;
// price list + lead time come from the same shared config. Re-checked
// every 5 minutes so dashboard edits show up without a redeploy.
export const revalidate = 300;

const covered = [
  {
    title: "Heavy vehicle RWCs",
    body: "Prime movers, rigid trucks, tippers, dog trailers and semi trailers.",
  },
  {
    title: "Trailer inspections",
    body: "Dog trailers, semi trailers and combinations inspected for compliance and roadworthiness.",
  },
  {
    title: "Tipper & trailer specialists",
    body: "Inspections done by the team that builds tippers, dog trailers and semi trailers — deep familiarity with what passes and what doesn't.",
  },
  {
    title: "Fast turnaround inspections",
    body: "Inspections take 60–120 minutes. Defects discussed in writing if found.",
  },
];

const useCases = [
  "Selling a heavy vehicle or trailer privately",
  "Re-registering an unregistered truck or trailer",
  "Interstate vehicle relocation to Victoria",
  "Pre-purchase inspection before buying second-hand",
  "Annual fleet inspection and compliance",
  "Scheduled fleet servicing and recertification",
];

const inspectionTypes = [
  {
    title: "Standard RWC inspection",
    body: "Full inspection covering brakes, lights, suspension, tyres, structure and compliance. Certificate issued on pass.",
  },
  {
    title: "Re-registration inspection",
    body: "Inspection prepared for re-registration of unregistered vehicles or trailers, including interstate units entering Victoria.",
  },
  {
    title: "Pre-purchase inspection",
    body: "Independent inspection report before you buy — what's compliant, what's questionable and what'll cost.",
  },
  {
    title: "Fleet inspection block",
    body: "Bulk fleet inspections scheduled for predictable downtime and predictable cost.",
  },
];

const process = [
  {
    step: "01",
    title: "Book your slot",
    body: "Book online, call the workshop, or scan the QR with your phone.",
  },
  {
    step: "02",
    title: "Drop in to the workshop",
    body: `${site.address.line1}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}.`,
  },
  {
    step: "03",
    title: "Inspection completed",
    body: "Inspections take 60–120 minutes. Any defects documented in writing.",
  },
  {
    step: "04",
    title: "Certificate issued",
    body: "Pass: VicRoads-recognised certificate issued. Fail: written defect list provided.",
  },
];

const faqs = [
  {
    question: "How long does a heavy vehicle inspection take?",
    answer:
      "Heavy vehicle and trailer inspections take 60–120 minutes. If anything fails, we'll provide a written defect list so it can be addressed before re-inspection.",
  },
  {
    question: "Do I need to book in advance?",
    answer:
      "Yes — booking ahead is essential. Inspections run Monday to Friday by appointment only. Use the booking link above, call the workshop, or scan the QR code.",
  },
  {
    question: "What does an inspection cost?",
    answer:
      "Pricing is based on the vehicle's number of axles. You'll see your price as you complete the online booking form, or call us for a quote — there are no hidden charges.",
  },
  {
    question: "What if my vehicle fails?",
    answer:
      "We'll provide a written defect list. Have the items repaired at your preferred workshop, then bring the unit back to us for re-inspection.",
  },
  {
    question: "Are your certificates accepted statewide?",
    answer:
      "Yes. We're a fully VicRoads Licensed Vehicle Testing station — certificates are recognised by VicRoads for registration, transfer and re-registration anywhere in Victoria.",
  },
];

const keyPoints = [
  "Done in 60–120 minutes",
  "Defects documented in writing",
  "VicRoads-recognised certificate on a pass",
];

const stats = [
  { value: "60–120 min", label: "Inspection time" },
  { value: "In writing", label: "Any defects documented" },
  { value: "By axle", label: "How pricing works" },
  { value: "Statewide", label: "Accepted certificates" },
];

const inspected = ["Prime movers", "Rigid trucks", "Tippers", "Dog trailers", "Semi trailers"];

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Roadworthy", href: "/licensed-vehicle-testing" },
];

const panelLead = "mb-5 max-w-3xl text-[1.0625rem] leading-relaxed text-mute";

export default async function RoadworthyPage() {
  // Roadworthy inspections toggled offline — show the unavailable notice at the
  // same URL and skip the booking fetch + service JSON-LD. Flip
  // flags.roadworthyAvailable back to true to restore the full page.
  if (!flags.roadworthyAvailable) {
    return <RoadworthyUnavailable />;
  }

  const { truckTypes, trailerTypes, axlePrices, defectPrice, showPrices, leadDays, days, hoursByDay } = await getRwcBookingOptions();
  const fmt12 = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  };
  const weekdayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hoursRows = [1, 2, 3, 4, 5, 6, 7].map((d) => {
    const h = hoursByDay[String(d)];
    return { label: weekdayNames[d], time: h ? `${fmt12(h.start)} – ${fmt12(h.end)}` : "Closed" };
  });
  const minDateObj = new Date();
  minDateObj.setDate(minDateObj.getDate() + leadDays);
  const minDate = minDateObj.toISOString().slice(0, 10);
  const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDays = [...days].sort((a, b) => a - b);
  const openDaysLabel =
    sortedDays.length > 1 &&
    sortedDays[sortedDays.length - 1] - sortedDays[0] === sortedDays.length - 1
      ? `${dayNames[sortedDays[0]]} to ${dayNames[sortedDays[sortedDays.length - 1]]}`
      : sortedDays.map((d) => dayNames[d]).join(", ");

  return (
    <>
      <JsonLd
        data={[
          ...(lvtService ? [serviceSchema(lvtService, lvtContent)] : []),
          faqPageSchema(faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      <SectionBar
        title="Roadworthy"
        items={[
          { id: "book", label: "Book" },
          { id: "inspect", label: "What we inspect" },
          { id: "how", label: "How it works" },
          { id: "faq", label: "Questions" },
        ]}
        cta={{ href: "#book", label: "Book an inspection" }}
      />

      <section className="p-hero">
        <div className="wrap">
          <Crumbs crumbs={crumbs} />
          <p className="mlabel" style={{ marginTop: 30 }}>
            VicRoads Licensed Vehicle Tester · EX 12409
          </p>
          <h1 className="long" style={{ marginTop: 18 }}>
            Heavy vehicle &amp; trailer
            <br />
            roadworthy <span className="red">inspections.</span>
          </h1>
          <div className="row">
            <p>Heavy vehicle and trailer inspections at our Campbellfield workshop.</p>
            <div className="actions">
              <Action href="#book">Book an inspection</Action>
              <Action href={site.phoneHref} tone="line" arrow={false}>
                Call {site.phone}
              </Action>
            </div>
          </div>
          <Facts items={stats.map((s) => [s.value, s.label] as [string, string])} />
        </div>
      </section>

      {/* Booking request form — feeds the dashboard's approval queue */}
      <section className="sec" id="book">
        <div className="wrap book">
          <div className="book-card reveal">
            <p className="mlabel">Request a booking</p>
            <h2>
              Pick a day. We&rsquo;ll confirm <span className="red">your time.</span>
            </h2>
            <ul>
              {keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
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
                <small>Inspection hours, by appointment</small>
                <dl className="book-hours">
                  {hoursRows.map((h) => (
                    <div key={h.label}>
                      <dt>{h.label}</dt>
                      <dd>{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="qr">
              <Image
                src="/images/lvt/booking-qr-v2.png"
                alt="QR code — book a roadworthy inspection at Arrow Industries"
                width={160}
                height={160}
                unoptimized
              />
              <b>Scan to book</b>
            </div>
          </div>
          <div className="card p-4 sm:p-7">
            <RoadworthyBookingForm truckTypes={truckTypes} trailerTypes={trailerTypes} axlePrices={showPrices ? axlePrices : null} defectPrice={showPrices ? defectPrice : null} minDate={minDate} openDaysLabel={openDaysLabel} />
          </div>
        </div>
      </section>

      <Split
        id="inspect"
        label="Scope"
        heading={
          <>
            What we <span className="red">inspect.</span>
          </>
        }
        note="Inspected by the team that builds tippers and trailers."
      >
        <ul className="biglist">
          {inspected.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Split>

      <section className="sec ruled" id="how">
        <div className="wrap">
          <Head
            label="How it works"
            note="The workshop confirms every booking by email or phone, usually the same business day."
          >
            Four <span className="red">steps.</span>
          </Head>
          <Steps items={process.map((p) => [p.title, p.body] as [string, string])} />
        </div>
      </section>

      <Pair
        id="faq"
        label="Inspection types"
        heading={
          <>
            Pick the <span className="red">inspection.</span>
          </>
        }
        bullets={inspectionTypes.map((t) => t.title)}
        faqs={faqs}
      />

      <CTASection
        eyebrow="Roadworthy"
        heading={
          <>
            Book your <span className="red">inspection.</span>
          </>
        }
        primaryCta={{ label: "Book an inspection", href: "#book" }}
      />
    </>
  );
}
