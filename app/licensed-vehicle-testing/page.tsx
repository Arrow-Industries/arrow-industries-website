import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
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
    icon: Truck,
    title: "Heavy vehicle RWCs",
    body: "Prime movers, rigid trucks, tippers, dog trailers and semi trailers.",
  },
  {
    icon: ClipboardCheck,
    title: "Trailer inspections",
    body: "Dog trailers, semi trailers and combinations inspected for compliance and roadworthiness.",
  },
  {
    icon: ShieldCheck,
    title: "Tipper & trailer specialists",
    body: "Inspections done by the team that builds tippers, dog trailers and semi trailers — deep familiarity with what passes and what doesn't.",
  },
  {
    icon: CalendarCheck,
    title: "Fast turnaround inspections",
    body: "Most inspections completed within a few hours. Defects discussed in writing if found.",
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
    body: "Most inspections take 60–90 minutes. Any defects documented in writing.",
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
      "Most heavy vehicle and trailer inspections take 60–90 minutes. If anything fails, we'll provide a written defect list so it can be addressed before re-inspection.",
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

export default async function RoadworthyPage() {
  // Roadworthy inspections toggled offline — show the unavailable notice at the
  // same URL and skip the booking fetch + service JSON-LD. Flip
  // flags.roadworthyAvailable back to true to restore the full page.
  if (!flags.roadworthyAvailable) {
    return <RoadworthyUnavailable />;
  }

  const { truckTypes, trailerTypes, axlePrices, defectPrice, showPrices, durationMins, leadDays, days, hoursByDay } = await getRwcBookingOptions();
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
        ]}
      />

      <PageHero
        eyebrow="Roadworthy / LVT · EX 12409"
        heading="VicRoads-licensed heavy vehicle and trailer inspections."
        body="Licensed Vehicle Tester EX 12409. Prime movers, rigid trucks, trailers and fleet vehicles tested and certified from our Campbellfield workshop."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Roadworthy", href: "/licensed-vehicle-testing" },
        ]}
        actions={
          <>
            <Button href="#book" size="lg">
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

      {/* Booking request form — feeds the dashboard's approval queue */}
      <section id="book" className="section">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionHeader
                eyebrow="Request a booking"
                heading="Pick a day — we'll confirm your time."
                body="Tell us about the vehicle and when suits. The workshop checks the schedule and confirms every booking by email or phone, usually the same business day."
              />
              <ul className="mt-8 grid gap-3">
                {[
                  "Most inspections completed in 60–90 minutes",
                  "Any defects documented in writing on the spot",
                  "VicRoads-recognised certificate issued on a pass",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-bone sm:text-base">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div className="card p-5 sm:p-7">
                <RoadworthyBookingForm truckTypes={truckTypes} trailerTypes={trailerTypes} axlePrices={showPrices ? axlePrices : null} defectPrice={showPrices ? defectPrice : null} durationMins={durationMins} minDate={minDate} openDaysLabel={openDaysLabel} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Visit details, hours and the QR for the workshop wall */}
      <section className="section">
        <Container className="grid gap-3 md:grid-cols-12">
          <div className="list-group md:col-span-8">
            <div className="list-row gap-3.5">
              <span className="icon-tile">
                <MapPin className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label">Workshop</p>
                <a
                  href={site.address.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 block text-sm font-medium leading-relaxed text-bone hover:text-accent-text"
                >
                  {site.address.line1}, {site.address.suburb} {site.address.state}{" "}
                  {site.address.postcode}
                </a>
              </div>
            </div>
            <div className="list-row gap-3.5">
              <span className="icon-tile">
                <Clock className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label">Inspection hours, by appointment</p>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                  {hoursRows.map((h) => (
                    <div key={h.label} className="contents">
                      <dt className="text-bone">{h.label}</dt>
                      <dd className="text-right tabular-nums text-mute">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="card hidden flex-col items-center justify-center gap-3 p-5 text-center md:col-span-4 md:flex">
            <p className="eyebrow">Scan to book</p>
            <div className="rounded-xl bg-white p-2.5">
              <Image
                src="/images/lvt/booking-qr-v2.png"
                alt="QR code — book a roadworthy inspection at Arrow Industries"
                width={160}
                height={160}
                className="h-40 w-40"
                unoptimized
              />
            </div>
            <p className="max-w-[14rem] text-xs leading-relaxed text-mute">
              Open the booking form on your phone.
            </p>
          </div>
        </Container>
      </section>

      {/* What's covered */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="What's covered"
            heading="Heavy vehicle and trailer inspections."
            body="Full inspection scope — backed by 25+ years of experience building tippers and trailers ourselves."
          />
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {covered.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.title} className="card flex gap-5 p-5 sm:p-6">
                  <span className="icon-tile">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-bone">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-mute sm:text-base">
                      {c.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Who it's for */}
      <section className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Who it's for"
              heading="Built for operators and fleet compliance."
              body="If your truck, trailer or fleet vehicle needs a roadworthy certificate, we can help."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {useCases.map((u) => (
                <li
                  key={u}
                  className="flex items-center gap-3 text-sm text-bone sm:text-base"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Inspection types */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Inspection types"
            heading="Pick the inspection that suits the job."
          />
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {inspectionTypes.map((t) => (
              <li
                key={t.title}
                className="card flex flex-col gap-3 p-5 sm:p-6"
              >
                <h3 className="font-display text-base font-semibold text-bone sm:text-lg">
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="What to expect"
            heading="A clear four-step inspection process."
          />
          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.step} className="card flex flex-col gap-3 p-5 sm:p-6">
                <span className="step-num">
                  {p.step}
                </span>
                <h3 className="font-display text-base font-semibold text-bone sm:text-lg">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="FAQ"
              heading="Common questions, answered."
              body="Still have a question? Call the workshop or send us an enquiry."
            />
            <div className="mt-8 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-mute">
                <Phone className="h-4 w-4 text-accent" aria-hidden />
                <a href={site.phoneHref} className="hover:text-bone">
                  {site.phone}
                </a>
              </p>
              <p className="flex items-center gap-2 text-mute">
                <Clock className="h-4 w-4 text-accent" aria-hidden />
                Mon – Fri, 6:00 AM – 4:00 PM
              </p>
              <p className="flex items-start gap-2 text-mute">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a
                  href={site.address.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bone"
                >
                  {site.address.line1}, {site.address.suburb}
                </a>
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ul className="list-group">
              {faqs.map((f) => (
                <li key={f.question} className="list-row flex-col gap-1 py-4">
                  <h3 className="font-display text-lg font-semibold text-bone sm:text-xl">
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
        eyebrow="Roadworthy"
        heading="Book your heavy vehicle or trailer inspection today."
        body="VicRoads-licensed inspections from our Campbellfield workshop."
        primaryCta={{
          label: "Book Inspection Online",
          href: "#book",
        }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="VicRoads Licensed Vehicle Tester EX 12409 · Fast turnaround · Statewide-accepted certificates"
      />
    </>
  );
}
