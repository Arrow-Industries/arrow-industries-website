import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { CalendarCheck, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CheckGrid, InfoGrid, ProcessSteps, StatTiles } from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
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

      <section className="bg-bone pb-10 pt-5 text-ink lg:pb-16 lg:pt-7">
        <Container>
          <div className="[&_*]:text-ink/70">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <p className="mt-7 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[#b80500] lg:mt-10">
            VicRoads Licensed Vehicle Tester
          </p>
          <p className="display mt-3 text-[23vw] leading-[0.88] lg:text-[min(23.5vw,21rem)]">EX 12409</p>
          <div className="mt-7 grid items-end gap-6 border-t-2 border-ink pt-6 lg:grid-cols-[1fr_auto]">
            <h1 className="display-md">Heavy vehicle &amp; trailer roadworthy inspections.</h1>
            <div className="flex flex-wrap gap-2.5">
              <Button href="#book" size="lg">
                <CalendarCheck className="h-4 w-4" aria-hidden />
                Book an inspection
              </Button>
              <Button href={site.phoneHref} size="lg" variant="light">
                Call {site.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Booking request form — feeds the dashboard's approval queue */}
      <section id="book" className="band">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
            <div className="min-w-0 lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <SectionHeader eyebrow="Request a booking" heading="Pick a day. We'll confirm your time." />
                <ul className="rule-list mt-7">
                  {keyPoints.map((point) => (
                    <li key={point} className="flex items-center gap-3 py-3 text-[1.0625rem] text-bone">
                      <Check className="h-4 w-4 shrink-0 text-accent-text" strokeWidth={2.5} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-7 sm:grid-cols-2">
                  <div>
                    <p className="label">Workshop</p>
                    <a
                      href={site.address.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 block font-medium leading-snug text-bone hover:text-accent-text"
                    >
                      {site.address.line1}
                      <br />
                      {site.address.suburb} {site.address.state} {site.address.postcode}
                    </a>
                  </div>
                  <div>
                    <p className="label">Inspection hours, by appointment</p>
                    <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                      {hoursRows.map((h) => (
                        <div key={h.label} className="contents">
                          <dt className="text-bone">{h.label}</dt>
                          <dd className="text-right tabular-nums text-mute">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                <div className="mt-8 hidden items-center gap-4 md:flex">
                  <div className="shrink-0 bg-white p-2">
                    <Image
                      src="/images/lvt/booking-qr-v2.png"
                      alt="QR code — book a roadworthy inspection at Arrow Industries"
                      width={160}
                      height={160}
                      className="h-24 w-24"
                      unoptimized
                    />
                  </div>
                  <p className="display text-[2rem]">Scan to book</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <div className="card p-4 sm:p-7">
                <RoadworthyBookingForm truckTypes={truckTypes} trailerTypes={trailerTypes} axlePrices={showPrices ? axlePrices : null} defectPrice={showPrices ? defectPrice : null} minDate={minDate} openDaysLabel={openDaysLabel} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="inspect" className="bg-ink-2 py-16 lg:py-24">
        <Container>
          <p className="eyebrow">What we inspect</p>
          <ul className="display display-md mt-4">
            {inspected.map((item) => (
              <li key={item} className="border-b border-line py-2.5">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <StatTiles items={stats} />
          </div>
        </Container>
      </section>

      <section id="how" className="band">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            heading="Four steps."
            body="The workshop checks the schedule and confirms every booking by email or phone, usually the same business day."
          />
          <ProcessSteps steps={process} />
        </Container>
      </section>

      <section id="inspections" className="scroll-mt-8 pb-16 lg:pb-24">
        <Container>
          <SectionHeader eyebrow="Inspection details" heading="The full detail." className="mb-7 lg:mb-11" />
          <DetailAccordion
            items={[
              {
                id: "covered",
                title: "What's covered",
                content: (
                  <>
                    <p className={panelLead}>
                      Full inspection scope &mdash; backed by 25+ years of experience building
                      tippers and trailers ourselves.
                    </p>
                    <InfoGrid items={covered} />
                  </>
                ),
              },
              {
                id: "types",
                title: "Inspection types",
                content: (
                  <>
                    <p className={panelLead}>Pick the inspection that suits the job.</p>
                    <InfoGrid items={inspectionTypes} />
                  </>
                ),
              },
              {
                id: "who",
                title: "Who it's for",
                content: (
                  <>
                    <p className={panelLead}>
                      If your truck, trailer or fleet vehicle needs a roadworthy certificate, we can help.
                    </p>
                    <CheckGrid items={useCases} />
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
        eyebrow="Roadworthy"
        heading="Book your heavy vehicle or trailer inspection."
        primaryCta={{ label: "Book an inspection", href: "#book" }}
      />
    </>
  );
}
