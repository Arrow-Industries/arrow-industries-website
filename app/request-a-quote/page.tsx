import type { Metadata } from "next";
import { ListChecks, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { ContactInfoBlock } from "@/components/ContactInfoBlock";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Request a Quote — Tipper, Trailer, Repair or Roadworthy",
  description:
    "Request a quote for a custom tipper body, dog trailer, semi trailer, repair or roadworthy from Arrow Industries' Campbellfield workshop.",
  alternates: { canonical: "/request-a-quote" },
};

const reassurance = [
  {
    icon: ListChecks,
    title: "Clear next steps",
    body: "Send through your details and we'll come back with the best next step for your build, repair or inspection.",
  },
  {
    icon: Wrench,
    title: "Engineered to spec",
    body: "Send your chassis, payload and application — we'll spec the build around your job.",
  },
  {
    icon: ShieldCheck,
    title: "No obligation",
    body: "Quotes are written, itemised and free. No deposits, no commitments.",
  },
];

export default function RequestAQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        heading="Tell us what you need built, repaired or certified."
        body="The more you tell us up front — chassis, payload, application, target lead time — the faster we can come back with a build proposal and price."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Request a Quote", href: "/request-a-quote" },
        ]}
      />

      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <QuoteForm />
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="border border-line bg-ink-2 p-6">
                <h2 className="text-base font-bold text-bone">
                  Or call us directly
                </h2>
                <p className="mt-2 text-sm text-mute">
                  Got a job that's better explained on the phone? Talk to us
                  during workshop hours.
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-accent hover:underline"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  {site.phone}
                </a>
              </div>

              <ul className="grid gap-px overflow-hidden border border-line bg-line">
                {reassurance.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li
                      key={r.title}
                      className="flex gap-4 bg-ink-2 p-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
                        <Icon className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-bone">
                          {r.title}
                        </h3>
                        <p className="mt-1 text-xs text-mute">{r.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ContactInfoBlock />
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
