import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Button } from "@/components/Button";
import { Configurator } from "@/components/Configurator";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";
import { getBuildConfig } from "@/lib/build-options";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Configure Your Build — Tipper Bodies, Dog & Semi Trailers",
  description:
    "Choose your product, truck, dimensions, hydraulics, tarp, paint and options, then send your Arrow Industries build straight to the workshop for a quote.",
  path: "/configure",
});

// Options are edited in the dashboard; changes appear here within five minutes.
export const revalidate = 300;

export default async function ConfigurePage() {
  const config = await getBuildConfig();

  return (
    <>
      <PageHero
        compact
        eyebrow="Configure"
        heading="Configure your build."
        body="Choose the options that suit your work, then send your build to the workshop for a quote."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Configure", href: "/configure" },
        ]}
      />
      <section className="pb-14 pt-3 lg:pb-20">
        <Container>
          {config ? (
            <Configurator config={config} />
          ) : (
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-bone">
                The configurator is unavailable right now.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Send us your build details and the workshop will take it from there.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Button href="/request-a-quote" size="lg">
                  Request a quote
                </Button>
                <Button href={site.phoneHref} size="lg" variant="secondary">
                  <Phone className="h-4 w-4" aria-hidden />
                  Call {site.phone}
                </Button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
