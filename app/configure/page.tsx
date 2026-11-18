import type { Metadata } from "next";
import { Configurator } from "@/components/Configurator";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Configure Your Build — Tipper Bodies, Dog & Semi Trailers",
  description:
    "Choose your product, chassis or axles, main work, colour and options, then send your Arrow Industries build straight to the workshop for a quote.",
  path: "/configure",
});

export default function ConfigurePage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Configure"
        heading="Configure your build."
        body="Choose the setup that suits your work, then send it to the workshop for a quote."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Configure", href: "/configure" },
        ]}
      />
      <section className="pb-14 pt-3 lg:pb-20">
        <Container>
          <Configurator />
        </Container>
      </section>
    </>
  );
}
