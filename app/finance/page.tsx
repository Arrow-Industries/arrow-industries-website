import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import {
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  Handshake,
  Mail,
  Percent,
  PhoneCall,
  Truck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { FinanceForm } from "@/components/FinanceForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema } from "@/lib/schema";
import type { FAQ } from "@/data/faqs";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Equipment & Truck Finance — Tipper Bodies & Trailers",
  description:
    "Finance your next Arrow tipper body, trailer or truck-and-body package. Competitive asset finance arranged through Linx Australia Group — apply online in minutes.",
  path: "/finance",
});

const benefits = [
  {
    icon: Banknote,
    title: "Keep cash in the business",
    body: "Spread the cost of your build over its working life instead of tying up working capital up front.",
  },
  {
    icon: Percent,
    title: "Competitive rates",
    body: "Linx negotiates across a panel of 50+ lenders to find the right rate and structure for your situation.",
  },
  {
    icon: Clock,
    title: "Fast approvals",
    body: "Many applications are approved within 24–48 hours once Linx has your details.",
  },
  {
    icon: FileText,
    title: "Flexible terms",
    body: "Chattel mortgage, lease, hire purchase or rental — structured around your cash flow and tax position.",
  },
];

const financeOptions = [
  {
    title: "Chattel Mortgage",
    body: "Own the asset from day one, with repayments fixed over the term. A common choice for businesses claiming GST and depreciation.",
  },
  {
    title: "Finance Lease",
    body: "The lender owns the asset and leases it to you, with the option to take ownership at the end of the term.",
  },
  {
    title: "Hire Purchase",
    body: "Hire the equipment with fixed repayments and take ownership once the final payment is made.",
  },
  {
    title: "Rental / Operating Lease",
    body: "Lower commitment, off-balance-sheet use of the equipment for an agreed period — handy for shorter horizons.",
  },
];

const financeable = [
  {
    icon: Truck,
    title: "Tipper truck bodies",
    body: "Custom tipper bodies built to your chassis and application.",
  },
  {
    icon: Truck,
    title: "Dog & semi trailers",
    body: "Heavy-duty dog and semi trailers engineered for payload.",
  },
  {
    icon: Handshake,
    title: "Truck & body packages",
    body: "Finance the complete setup — truck plus the Arrow body or trailer — in one facility.",
  },
  {
    icon: Wrench,
    title: "Repairs, upgrades & fit-outs",
    body: "Major repairs, modifications and equipment upgrades can often be financed too.",
  },
];

const steps = [
  {
    title: "Send your details",
    body: "Tell us what you're building and how you'd prefer to finance it. Takes a couple of minutes.",
  },
  {
    title: "Linx shortlists a lender",
    body: "Our finance partner reviews your profile and matches it to the right lender from their panel.",
  },
  {
    title: "Approval & paperwork",
    body: "Rate and terms are confirmed and the paperwork is sorted — usually within a day or two.",
  },
  {
    title: "We build, you collect",
    body: "Finance settles and your Arrow build heads out the workshop door, ready for work.",
  },
];

const financeFAQs: FAQ[] = [
  {
    question: "Who provides the finance?",
    answer:
      "Arrow builds the equipment; the finance is arranged through Linx Australia Group, an independent asset finance broker operating since 1999 with a panel of around 50 lenders. They negotiate the rate and structure on your behalf.",
  },
  {
    question: "What can I finance?",
    answer:
      "Tipper truck bodies, dog and semi trailers, complete truck-and-body packages, and in many cases major repairs, upgrades and fit-outs.",
  },
  {
    question: "Do I have to finance the whole build through Arrow?",
    answer:
      "No. You can finance just the body or trailer, the truck, or the complete package — whatever suits. Linx will structure it around your needs.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Many applications are approved within 24–48 hours once Linx has your details. More complex deals can take a little longer.",
  },
  {
    question: "What documents will I need?",
    answer:
      "It depends on the lender and loan size, but typically ID, your ABN, and recent financials or bank statements. Linx will tell you exactly what's needed.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. The information on this page is general only. Linx Australia Group is licensed to arrange finance and will give you advice specific to your situation. All finance is subject to lender approval.",
  },
];

export default function FinancePage() {
  return (
    <>
      <JsonLd data={faqPageSchema(financeFAQs)} />

      <PageHero
        eyebrow="Finance"
        heading="Finance your next Arrow build."
        body="Spread the cost of a custom tipper body, trailer or complete truck-and-body package. Competitive asset finance, arranged through our partner Linx Australia Group."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Finance", href: "/finance" },
        ]}
        actions={
          <>
            <Button href="#apply" size="lg">
              Apply for Finance
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
            Asset finance since 1999.{" "}
            <span className="text-bone">
              Panel of 50+ lenders. Fast approvals.
            </span>
          </p>
        </Container>
      </div>

      {/* Why finance */}
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="Why finance"
            heading="Get the gear working without the up-front hit."
            body="Your equipment earns its keep from day one. Financing lets you put it to work now and pay for it as it pays you back."
          />
          <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => {
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

      {/* Finance partner — Linx */}
      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Our finance partner"
              heading="Backed by Linx Australia Group."
              body="Arrow builds the gear. Linx sorts the finance. They're an independent asset finance broker who've been at it since 1999, with a panel of around 50 lenders and deep experience in transport, trucks, trailers and heavy equipment."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Independent — works for you, not one bank",
                "Specialists in transport & heavy equipment",
                "Negotiates rates across 50+ lenders",
                "Handles the paperwork end to end",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-bone"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-col items-center gap-6 border border-line bg-ink-2 p-8 text-center sm:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/customers/linx.png"
                alt="Linx Australia Group"
                width={260}
                height={96}
                loading="lazy"
                className="h-auto w-56 max-w-full object-contain"
              />
              <p className="text-sm leading-relaxed text-mute">
                Asset, equipment and transport finance specialists. Established
                1999.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What you can finance */}
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="What you can finance"
            heading="From a single body to the whole rig."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financeable.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex flex-col gap-3 border border-line bg-ink p-6 transition-colors hover:border-accent/50"
                >
                  <Icon
                    className="h-6 w-6 text-accent"
                    strokeWidth={1.5}
                    aria-hidden
                  />
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

      {/* Finance options */}
      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="Finance options"
            heading="Structured to suit your business."
            body="Linx can arrange any of the following. Not sure which fits? Pick “recommend an option” on the form and they'll talk it through with you."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {financeOptions.map((opt) => (
              <li
                key={opt.title}
                className="border border-line bg-ink-2 p-6"
              >
                <h3 className="text-base font-bold text-bone">{opt.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  {opt.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-mute">
            General information only and not financial or tax advice. Speak to
            Linx Australia Group or your accountant about what suits your
            circumstances.
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            heading="Four steps to finance."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 border border-line bg-ink p-6"
              >
                <span className="font-display text-3xl font-extrabold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-bold text-bone">{step.title}</h3>
                <p className="text-sm leading-relaxed text-mute">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Application form */}
      <section
        id="apply"
        className="scroll-mt-24 border-b border-line bg-ink py-16 lg:py-20"
      >
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Apply"
              heading="Apply for finance."
              body="Send your details and our finance partner Linx Australia Group will be in touch — usually within one business day — to talk through your options. No obligation."
              className="mb-8"
            />
            <FinanceForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="border border-line bg-ink-2 p-6">
                <h2 className="text-base font-bold text-bone">
                  Prefer to talk it through?
                </h2>
                <p className="mt-2 text-sm text-mute">
                  Call the Arrow team during workshop hours and we&rsquo;ll
                  point you in the right direction.
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-accent-text hover:underline"
                >
                  <PhoneCall className="h-5 w-5" aria-hidden />
                  {site.phone}
                </a>
                <a
                  href={site.emailHref}
                  className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-bone hover:text-accent-text"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </div>

              <div className="flex flex-col items-center gap-4 border border-line bg-ink-2 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
                  Finance arranged by
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/customers/linx.png"
                  alt="Linx Australia Group"
                  width={180}
                  height={67}
                  loading="lazy"
                  className="h-auto w-40 max-w-full object-contain"
                />
              </div>

              <p className="text-xs leading-relaxed text-mute">
                Arrow Industries is not a credit provider or financial adviser.
                Finance is arranged through Linx Australia Group and is subject
                to lender approval, terms and conditions. Information provided is
                general only.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-b border-line bg-ink-2 py-16 lg:py-20">
        <Container className="max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            heading="Finance questions"
            align="center"
            className="mx-auto"
          />
          <div className="mt-10">
            <FAQAccordion items={financeFAQs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Finance"
        heading="Get the gear working sooner."
        body="Apply online and our finance partner will sort the rest while we build your unit."
        primaryCta={{ label: "Apply for Finance", href: "#apply" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
      />
    </>
  );
}
