import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "Warranty information for Arrow Industries products and services.",
  alternates: { canonical: "/warranty" },
};

export default function WarrantyPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        heading="Warranty"
        body={`Arrow Industries & Co — Samaro Pty Ltd, ABN ${site.abn}.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Warranty", href: "/warranty" },
        ]}
      />

      <section className="bg-ink py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-base leading-relaxed text-mute">

            {/* Issuer / intro block */}
            <div className="mb-12 border border-line-soft bg-ink-2 p-6 text-sm">
              <p className="font-display text-base font-bold text-bone">
                {site.tradingName}
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                This page will outline the warranty terms for Arrow Industries
                products and services. Final warranty details will be
                published here once confirmed.
              </p>
            </div>

            <Section number="1" heading="Coverage">
              <P>Details to be confirmed.</P>
            </Section>

            <Section number="2" heading="Exclusions">
              <P>Details to be confirmed.</P>
            </Section>

            <Section number="3" heading="Warranty Period">
              <P>Details to be confirmed.</P>
            </Section>

            <Section number="4" heading="Claims Process">
              <P>Details to be confirmed.</P>
            </Section>

            <Section number="5" heading="Contact">
              <P>
                For warranty enquiries, contact{" "}
                <a
                  href={site.emailHref}
                  className="text-accent hover:underline"
                >
                  {site.email}
                </a>{" "}
                or call{" "}
                <a
                  href={site.phoneHref}
                  className="text-accent hover:underline"
                >
                  {site.phone}
                </a>
                .
              </P>
            </Section>

            <div className="mt-16 border-t border-line-soft pt-6 text-sm">
              <p>
                See also our{" "}
                <a
                  href="/terms-conditions"
                  className="text-accent hover:underline"
                >
                  Terms &amp; Conditions of Supply
                </a>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Section({
  number,
  heading,
  children,
}: {
  number: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-12 scroll-mt-24" id={`clause-${number}`}>
      <h2 className="font-display text-xl font-extrabold text-bone sm:text-2xl">
        <span className="text-accent">{number}.</span> {heading}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed sm:text-base">
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}
