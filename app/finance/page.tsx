import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Banknote, Clock, FileText, Mail, Percent, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductHero } from "@/components/ProductHero";
import {
  CheckList,
  InfoGrid,
  Pills,
  ProcessSteps,
} from "@/components/ProductParts";
import { DetailAccordion } from "@/components/DetailAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { FinanceForm } from "@/components/FinanceForm";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import type { FAQ } from "@/data/faqs";
import { media } from "@/data/media";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Equipment & Truck Finance — Tipper Bodies & Trailers",
  description:
    "Finance your next Arrow tipper body, trailer or truck-and-body package — competitive asset finance via Linx Australia Group. Apply online in minutes.",
  path: "/finance",
});

// Handles the finance form's server action (attachments streamed to Graph).
// See /request-a-quote for the rationale.
export const maxDuration = 60;

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
    title: "Tipper truck bodies",
    body: "Custom tipper bodies built to your chassis and application.",
  },
  {
    title: "Dog & semi trailers",
    body: "Heavy-duty dog and semi trailers engineered for payload.",
  },
  {
    title: "Truck & body packages",
    body: "Finance the complete setup — truck plus the Arrow body or trailer — in one facility.",
  },
  {
    title: "Repairs, upgrades & fit-outs",
    body: "Major repairs, modifications and equipment upgrades can often be financed too.",
  },
];

const steps = [
  {
    step: "01",
    title: "Send your details",
    body: "Tell us what you're building and how you'd prefer to finance it. Takes a couple of minutes.",
  },
  {
    step: "02",
    title: "Linx shortlists a lender",
    body: "Our finance partner reviews your profile and matches it to the right lender from their panel.",
  },
  {
    step: "03",
    title: "Approval & paperwork",
    body: "Rate and terms are confirmed and the paperwork is sorted — usually within a day or two.",
  },
  {
    step: "04",
    title: "We build, you collect",
    body: "Finance settles and your Arrow build heads out the workshop door, ready for work.",
  },
];

const trustPoints = [
  "Asset finance since 1999",
  "Panel of 50+ lenders",
  "Fast approvals",
];

const linxPoints = [
  "Independent — works for you, not one bank",
  "Specialists in transport & heavy equipment",
  "Negotiates rates across 50+ lenders",
  "Handles the paperwork end to end",
];

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Finance", href: "/finance" },
];

const panelLead = "mb-4 max-w-2xl text-sm leading-relaxed text-mute";

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
      <JsonLd data={[faqPageSchema(financeFAQs), breadcrumbSchema(crumbs)]} />

      <ProductHero
        crumbs={crumbs}
        badge="Finance"
        heading={
          <>
            Finance your <span className="text-accent">Arrow build.</span>
          </>
        }
        body="Competitive asset finance, arranged through our partner Linx Australia Group."
        image={media.scaniaGraphite.src}
        imageAlt={media.scaniaGraphite.alt}
        imagePosition="62% 50%"
        actions={
          <>
            <Button href="#apply" size="lg">
              Apply for finance
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* Why finance: titles here, the descriptions in the detail below */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="Why finance"
            heading="Get the gear working without the up-front hit."
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="card flex min-w-0 flex-col gap-3 p-4 sm:p-5">
                  <span className="icon-tile">
                    <Icon
                      className="h-5 w-5 text-accent"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <h3 className="text-[1.75rem] text-bone">
                    {item.title}
                  </h3>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Application form */}
      <section id="apply" className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <SectionHeader
              eyebrow="Apply"
              heading="Apply for finance."
              body="Linx will be in touch, usually within one business day. No obligation."
              className="mb-6"
            />
            <FinanceForm />
          </div>

          <aside className="min-w-0 lg:col-span-5">
            <div className="flex flex-col gap-4 lg:sticky lg:top-20">
              <div className="card p-6">
                <h2 className="text-base font-semibold text-bone">
                  Prefer to talk it through?
                </h2>
                <p className="mt-2 text-sm text-mute">
                  Call the Arrow team during workshop hours.
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-4 flex items-center gap-2 text-lg font-semibold text-accent-text hover:underline"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  {site.phone}
                </a>
                <a
                  href={site.emailHref}
                  className="mt-3 flex items-center gap-2 break-all text-sm font-semibold text-bone hover:text-accent-text"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </div>

              <div className="card flex flex-col items-center gap-4 p-6 text-center">
                <p className="label">Finance arranged by</p>
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

      {/* Finance partner: Linx */}
      <section className="section">
        <Container className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <SectionHeader
              eyebrow="Our finance partner"
              heading="Backed by Linx Australia Group."
              body="Arrow builds the gear. Linx sorts the finance."
            />
            <div className="mt-4">
              <Pills items={trustPoints} />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="card flex items-center justify-center p-8 sm:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/customers/linx.png"
                alt="Linx Australia Group"
                width={260}
                height={96}
                loading="lazy"
                className="h-auto w-56 max-w-full object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* The full wording, closed until someone wants it */}
      <section className="section">
        <Container>
          <SectionHeader
            eyebrow="How it works"
            heading="The detail, when you need it."
            className="mb-6"
          />
          <DetailAccordion
            items={[
              {
                id: "benefits",
                title: "Why finance",
                content: (
                  <>
                    <p className={panelLead}>
                      Your equipment earns its keep from day one. Financing lets you put it to
                      work now and pay for it as it pays you back.
                    </p>
                    <InfoGrid items={benefits} />
                  </>
                ),
              },
              {
                id: "steps",
                title: "How it works",
                content: (
                  <div className="[&>ol]:mt-0">
                    <p className="mb-4 display text-[1.75rem] text-bone">
                      Four steps to finance.
                    </p>
                    <ProcessSteps steps={steps} />
                  </div>
                ),
              },
              {
                id: "financeable",
                title: "What you can finance",
                content: (
                  <>
                    <p className="mb-2 display text-[1.75rem] text-bone">
                      From a single body to the whole rig.
                    </p>
                    <p className={panelLead}>
                      Spread the cost of a custom tipper body, trailer or complete
                      truck-and-body package.
                    </p>
                    <InfoGrid items={financeable} />
                  </>
                ),
              },
              {
                id: "options",
                title: "Finance options",
                content: (
                  <>
                    <p className="mb-2 display text-[1.75rem] text-bone">
                      Structured to suit your business.
                    </p>
                    <p className={panelLead}>
                      Linx can arrange any of the following. Not sure which
                      fits? Pick “recommend an option” on the form and
                      they&rsquo;ll talk it through with you.
                    </p>
                    <InfoGrid items={financeOptions} />
                  </>
                ),
              },
              {
                id: "linx",
                title: "About Linx Australia Group",
                content: (
                  <>
                    <p className={panelLead}>
                      Arrow builds the gear. Linx sorts the finance. They&rsquo;re an independent
                      asset finance broker who&rsquo;ve been at it since 1999, with a panel of
                      around 50 lenders and deep experience in transport, trucks, trailers and
                      heavy equipment. Asset, equipment and transport finance specialists.
                      Established 1999.
                    </p>
                    <CheckList items={linxPoints} />
                  </>
                ),
              },
            ]}
          />
          <p className="mt-6 text-xs leading-relaxed text-mute">
            General information only and not financial or tax advice. Speak to
            Linx Australia Group or your accountant about what suits your
            circumstances.
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section">
        <Container>
          <SectionHeader eyebrow="FAQ" heading="Finance questions" />
          <div className="mt-6">
            <FAQAccordion items={financeFAQs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Finance"
        heading="Get the gear working sooner."
        primaryCta={{ label: "Apply for finance", href: "#apply" }}
      />
    </>
  );
}
