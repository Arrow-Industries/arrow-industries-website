import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ListChecks, Phone, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { site } from "@/data/site";
import { getBuildConfig } from "@/lib/build-options";

export const metadata: Metadata = pageMetadata({
  title: "Request a Quote — Tipper, Trailer, Repair or Roadworthy",
  description:
    "Request a quote for a custom tipper body, dog trailer, semi trailer, repair or roadworthy from Arrow Industries' Campbellfield workshop.",
  path: "/request-a-quote",
});

// This route handles the quote form's server action, which carries up to
// ~3.5MB of attachments (Vercel rejects request bodies past 4.5MB — see
// lib/upload-limits.ts) and posts them on to Gmail. The default function
// duration is too tight for that on a slow connection; Pro (with Fluid
// compute) allows far longer, so give it real headroom.
export const maxDuration = 60;

const reassurance = [
  { icon: ListChecks, title: "Clear next steps" },
  { icon: Wrench, title: "Engineered to spec" },
  { icon: ShieldCheck, title: "Free written quotes, no obligation" },
];

// Products come from the dashboard; changes appear here within five minutes.
export const revalidate = 300;

export default async function RequestAQuotePage() {
  const config = await getBuildConfig();

  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        heading="Tell us what you need built, repaired or certified."
        body="Share your chassis, payload, application and target lead time for a faster proposal and price."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Request a quote", href: "/request-a-quote" },
        ]}
      />

      <section className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <QuoteForm products={config?.categories ?? []} />
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-20 flex flex-col gap-3">
              <div className="card p-5">
                <h2 className="text-base font-semibold text-bone">
                  Or call us directly
                </h2>
                <p className="mt-2 text-sm text-mute">
                  Talk to us during workshop hours.
                </p>
                <a
                  href={site.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-bone transition-colors hover:text-accent-text"
                >
                  <Phone className="h-5 w-5" aria-hidden />
                  {site.phone}
                </a>
              </div>

              <ul className="list-group">
                {reassurance.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li key={r.title} className="list-row items-center">
                      <Icon className="h-[1.125rem] w-[1.125rem] shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
                      <span className="text-sm font-semibold text-bone">{r.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
