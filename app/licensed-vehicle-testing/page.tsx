import type { Metadata } from "next";
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
import { faqPageSchema } from "@/lib/schema";
import { site } from "@/data/site";

const SLUG = "licensed-vehicle-testing";

export const metadata: Metadata = {
  title:
    "Heavy Vehicle & Trailer Roadworthy Inspections — Campbellfield",
  description:
    "VicRoads-licensed heavy vehicle and trailer inspections at our Campbellfield workshop. Prime movers, rigid trucks, tippers, dog trailers and semi trailers — book online.",
  alternates: { canonical: `/${SLUG}` },
};

const bookingUrl = site.booking.roadworthy;

// QR rendered server-side from a public QR endpoint so the page works without
// uploading Square's PNG. Swap to a local /images/lvt/booking-qr.png whenever
// the Square-issued asset is dropped in.
const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(bookingUrl)}`;

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
      "Yes — booking is recommended for all heavy vehicles and trailers. Use the booking link above, call the workshop, or scan the QR code.",
  },
  {
    question: "What does an inspection cost?",
    answer:
      "Cost depends on vehicle type. Rigid trucks, prime movers, dog trailers and semi trailers are priced separately. Call us for a current price list — there are no hidden charges.",
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

export default function RoadworthyPage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faqs)} />

      <PageHero
        eyebrow="Roadworthy / LVT"
        heading="VicRoads-licensed heavy vehicle and trailer inspections."
        body="Prime movers, rigid trucks, trailers and fleet vehicles tested and certified from our Campbellfield workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Roadworthy" }]}
        actions={
          <>
            <Button href={bookingUrl} size="lg" target="_blank" rel="noreferrer">
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

      {/* Booking — the conversion centrepiece */}
      <section className="bg-ink-2 py-20 lg:py-28">
        <Container>
          <div className="grid gap-10 overflow-hidden border border-line-soft bg-ink lg:grid-cols-12">
            {/* Left — booking copy + CTAs */}
            <div className="flex flex-col justify-between gap-10 p-8 sm:p-12 lg:col-span-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Book online
                </p>
                <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] text-bone sm:text-4xl">
                  Book your inspection. Get back on the road.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
                  Secure a time, confirm your vehicle details and have your
                  inspection completed at our Campbellfield workshop.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
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
              </div>

              <dl className="grid grid-cols-1 gap-4 border-t border-line-soft pt-8 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mute">
                    Workshop
                  </dt>
                  <dd className="mt-2 text-bone">
                    <a
                      href={site.address.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {site.address.line1}
                      <br />
                      {site.address.suburb} {site.address.state}{" "}
                      {site.address.postcode}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mute">
                    Hours
                  </dt>
                  <dd className="mt-2 text-bone">
                    Mon – Fri, 7:00 AM – 4:00 PM
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right — QR card */}
            <div className="flex flex-col items-center justify-center gap-5 border-t border-line-soft bg-ink-2 p-8 sm:p-12 lg:col-span-5 lg:border-l lg:border-t-0">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                Scan to book
              </p>
              <div className="bg-white p-4">
                {/*
                  TODO: when Square's QR PNG is supplied, save it to
                  /public/images/lvt/booking-qr.png and swap this <img> src.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrSrc}
                  alt="QR code — book a roadworthy inspection at Arrow Industries"
                  width={240}
                  height={240}
                  className="h-60 w-60"
                />
              </div>
              <p className="max-w-xs text-center text-xs leading-relaxed text-mute">
                Scan with your phone camera to open the booking page directly.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What's covered */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="What's covered"
            heading="Heavy vehicle and trailer inspections."
            body="Full inspection scope — backed by 25+ years of experience building tippers and trailers ourselves."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2">
            {covered.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.title} className="flex gap-5 bg-ink-2 p-8 sm:p-10">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-bone">
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
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
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
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Inspection types"
            heading="Pick the inspection that suits the job."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {inspectionTypes.map((t) => (
              <li
                key={t.title}
                className="flex flex-col gap-3 bg-ink-2 p-8"
              >
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{t.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="What to expect"
            heading="A clear four-step inspection process."
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <li key={p.step} className="flex flex-col gap-3 bg-ink p-8">
                <span className="font-display text-3xl font-extrabold text-accent">
                  {p.step}
                </span>
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-ink py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
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
                Mon – Fri, 7:00 AM – 4:00 PM
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
        eyebrow="Roadworthy"
        heading="Book your heavy vehicle or trailer inspection today."
        body="VicRoads-licensed inspections from our Campbellfield workshop."
        primaryCta={{
          label: "Book Inspection Online",
          href: bookingUrl,
        }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
        footnote="VicRoads-licensed · Fast turnaround · Statewide-accepted certificates"
      />
    </>
  );
}
