import { ArrowRight, Check, Phone, ShieldCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import { faqPageSchema, serviceSchema } from "@/lib/schema";
import { site } from "@/data/site";

interface ServicePageTemplateProps {
  service: Service;
  content: ServiceContent;
}

const buildProcess = [
  {
    step: "01",
    title: "Send details",
    body: "Share your chassis, payload, application and any access permits. Photos and drawings welcome.",
  },
  {
    step: "02",
    title: "We design",
    body: "We engineer the build to suit — sized for legal payload, balanced for the chassis, finished for the job.",
  },
  {
    step: "03",
    title: "Quote confirmed",
    body: "Written quote, GA drawings, lead time and deposit terms — sign-off before any steel is cut.",
  },
  {
    step: "04",
    title: "Build delivered",
    body: "Manufactured, finished, inspected and delivered ready for work — supported by the same team after handover.",
  },
];

export function ServicePageTemplate({
  service,
  content,
}: ServicePageTemplateProps) {
  const crumbCategory =
    service.category === "product" ? "Products" : "Services";

  const crumbs = [
    { label: "Home", href: "/" },
    { label: crumbCategory },
    { label: service.shortTitle, href: service.href },
  ];

  return (
    <>
      <JsonLd
        data={[serviceSchema(service, content), faqPageSchema(content.faqs)]}
      />

      <PageHero
        eyebrow={crumbCategory}
        heading={content.h1}
        body={content.lede}
        crumbs={crumbs}
        actions={
          <>
            <Button href="/request-a-quote" size="lg">
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4" aria-hidden />
              Call {site.phone}
            </Button>
          </>
        }
      />

      {/* Overview */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Overview"
              heading="Built around the job. Not built from a catalogue."
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-base leading-relaxed text-mute sm:text-lg">
              {content.intro}
            </p>
          </div>
        </Container>
      </section>

      {/* Key features */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Key features"
            heading="Built to perform, configured to suit."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
            {content.keyFeatures.slice(0, 6).map((f) => (
              <li key={f.title} className="flex flex-col gap-3 bg-ink-2 p-8">
                <span className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">
                  {f.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Use cases */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Use cases"
              heading="Built for the work in front of it."
              body="Every Arrow build is configured around the load it'll carry, the chassis it'll sit on and the route it'll run."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.useCases.map((u) => (
                <li
                  key={u}
                  className="flex items-center gap-3 text-sm text-bone sm:text-base"
                >
                  <Check
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

      {/* Configuration / Build options */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Configuration"
            heading="Every spec point is yours to set."
            body="Tell us how the unit needs to work — we engineer the build to suit. No catalogue sizes, no compromises."
          />
          <ul className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
            {content.buildOptions.map((b) => (
              <li
                key={b.title}
                className="flex flex-col gap-3 bg-ink-2 p-8"
              >
                <h3 className="font-display text-base font-bold text-bone sm:text-lg">
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-mute">
                  {b.description}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Compliance */}
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Compliance & specifications"
              heading="Built to standard. Documented to match."
              body="Compliance specs, materials, certification — the technical detail that backs the build."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line-soft">
              {content.compliance.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-accent"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <p className="text-sm leading-relaxed text-bone sm:text-base">
                    {c}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How your build comes together */}
      <section className="bg-ink py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="The build process"
            heading="How your build comes together."
            body="A clear four-step path from first call to delivery."
          />
          <ol className="mt-16 grid gap-px overflow-hidden bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {buildProcess.map((p) => (
              <li key={p.step} className="flex flex-col gap-3 bg-ink-2 p-8">
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
      <section className="bg-ink-2 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            heading="Common questions, answered."
          />
          <div className="mt-12">
            <FAQAccordion items={content.faqs} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Get a Quote"
        heading={content.ctaHeading}
        body={content.ctaBody}
        primaryCta={{
          label: content.ctaPrimaryLabel ?? "Request a Quote",
          href: "/request-a-quote",
        }}
        secondaryCta={{ label: "View Our Builds", href: "/gallery" }}
      />
    </>
  );
}
