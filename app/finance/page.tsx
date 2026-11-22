import Image from "next/image";
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
import { Acc, Action, Feat, Head, PageOpen, Split, Steps } from "@/components/Blocks";
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

      <PageOpen
        crumbs={crumbs}
        long
        title={
          <>
            Get the gear
            <br />
            <span className="red">working sooner.</span>
          </>
        }
        sub="Competitive asset finance, arranged through our partner Linx Australia Group."
        actions={
          <>
            <Action href="#apply">Apply for finance</Action>
            <Action href={site.phoneHref} tone="line" arrow={false}>
              Call {site.phone}
            </Action>
          </>
        }
        photo={{ src: media.scaniaGraphite.src, alt: media.scaniaGraphite.alt, position: "62% 50%" }}
        facts={[
          ["Since 1999", "Linx in asset finance"],
          ["50+", "Lenders on the panel"],
          ["24–48 hrs", "Many approvals"],
          ["4 ways", "To structure it"],
        ]}
      />

      <section className="sec">
        <div className="wrap">
          <Head label="Why finance" note="Arrow builds the gear. Linx sorts the finance.">
            Without the <span className="red">up-front hit.</span>
          </Head>
          <Feat
            items={[
              ["Keep cash", "Spread the cost over the build’s working life."],
              ["Rates", "Linx negotiates across a panel of 50+ lenders."],
              ["Approvals", "Many are approved within 24–48 hours."],
              ["Terms", "Structured around your cash flow and tax position."],
            ]}
          />
        </div>
      </section>

      <Split
        label="How it works"
        heading={
          <>
            The <span className="red">detail.</span>
          </>
        }
        note="Finance the body, the trailer, the truck, or the complete package."
        tags={financeable.map((f) => f.title)}
      >
        <Acc openFirst items={financeOptions.map((o) => ({ q: o.title, a: o.body }))} />
      </Split>

      <section className="sec ruled">
        <div className="wrap">
          <Head label="The process">
            Four <span className="red">steps.</span>
          </Head>
          <Steps items={steps.map((st) => [st.title, st.body] as [string, string])} />
        </div>
      </section>

      <section className="sec flush" id="apply">
        <div className="wrap book">
          <div className="book-card reveal">
            <p className="mlabel">Our finance partner</p>
            <h2>
              Backed by <span className="red">Linx.</span>
            </h2>
            <ul>
              {linxPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="qr">
              <Image className="partner" src="/images/customers/linx.png" alt="Linx Australia Group" width={220} height={90} />
              <span className="by">
                Finance arranged by
                <br />
                Linx Australia Group
              </span>
            </div>
          </div>
          <div className="min-w-0 reveal">
            <SectionHeader
              eyebrow="Apply"
              heading="Apply for finance."
              body="Linx will be in touch, usually within one business day. No obligation."
              className="mb-6"
            />
            <FinanceForm />
          </div>
        </div>
      </section>

      <Split
        label="Questions"
        heading={
          <>
            Finance <span className="red">questions.</span>
          </>
        }
        note="General information only. All finance is subject to lender approval."
      >
        <Acc plain items={financeFAQs.map((f) => ({ q: f.question, a: f.answer }))} />
      </Split>

      <CTASection
        eyebrow="Finance"
        heading={
          <>
            Get the gear <span className="red">working sooner.</span>
          </>
        }
        primaryCta={{ label: "Apply for finance", href: "#apply" }}
      />
    </>
  );
}
