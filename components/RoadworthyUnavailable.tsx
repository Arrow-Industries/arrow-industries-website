import { CalendarOff, Phone, Wrench } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { site } from "@/data/site";

/**
 * Shown at /licensed-vehicle-testing while roadworthy inspections are paused
 * (see data/flags.ts `roadworthyAvailable`). Same URL, so existing links, the
 * booking QR and search results still land somewhere sensible.
 */
export function RoadworthyUnavailable() {
  return (
    <>
      <PageHero
        eyebrow="Roadworthy / LVT"
        heading="Roadworthy inspections are temporarily unavailable."
        body="We've paused roadworthy (RWC) and defect clearance bookings for now. We expect to have inspections back up shortly — thanks for your patience."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Roadworthy", href: "/licensed-vehicle-testing" },
        ]}
      />

      <section className="bg-ink py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-2xl border border-line-soft bg-ink-2 p-8 sm:p-12">
            <span className="flex h-12 w-12 items-center justify-center border border-accent/40 bg-accent/10">
              <CalendarOff
                className="h-5 w-5 text-accent"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            <h2 className="mt-6 font-display text-2xl font-extrabold leading-tight text-bone sm:text-3xl">
              Online booking is paused
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mute">
              We&rsquo;re not taking roadworthy inspection or defect clearance
              bookings at the moment. For an urgent enquiry, call the workshop
              and we&rsquo;ll let you know when inspections resume.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={site.phoneHref} size="lg">
                <Phone className="h-4 w-4" aria-hidden />
                Call {site.phone}
              </Button>
              <Button href="/repairs-servicing" size="lg" variant="secondary">
                <Wrench className="h-4 w-4" aria-hidden />
                Repairs &amp; Servicing
              </Button>
            </div>

            <p className="mt-8 border-t border-line-soft pt-6 text-sm leading-relaxed text-mute">
              Looking for a new tipper body or trailer instead?{" "}
              <a
                href="/request-a-quote"
                className="text-accent-text hover:underline"
              >
                Request a quote
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
