import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { InstagramStrip } from "@/components/InstagramStrip";

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

      <InstagramStrip />

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
