import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { GalleryGrid } from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — Completed Tipper & Trailer Builds",
  description:
    "Recent Arrow Industries builds — custom tipper bodies, dog trailers and semi trailers from our Campbellfield workshop.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        heading="Completed builds and workshop projects."
        body="A look at recent tipper, dog and semi-trailer builds from our Campbellfield workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container>
          <GalleryGrid />
        </Container>
      </section>

      <CTASection
        eyebrow="Get a Quote"
        heading="See something close to what you need?"
        body="Tell us what you're after — chassis, payload, application — and we'll come back with a build proposal sized for your operation."
        primaryCta={{ label: "Request a Quote", href: "/request-a-quote" }}
        secondaryCta={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
