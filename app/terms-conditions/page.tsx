import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";
import { getPublishedTerms, parseTerms, boldRuns, type TermsBlock } from "@/lib/terms-of-supply";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions for the Supply of Goods and Services",
  description:
    "Arrow Industries & Co terms and conditions for the supply of goods and services. Samaro Pty Ltd t/a Arrow Industries & Co.",
  path: "/terms-conditions",
});

/**
 * The wording comes from the Arrow dashboard (Terms of supply), not from this
 * file — see lib/terms-of-supply. Rendered per visit (the storage read skips
 * the CDN cache), so a version published in the dashboard shows straight away.
 */
export const dynamic = "force-dynamic";

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

export default async function TermsPage() {
  const terms = await getPublishedTerms();
  const blocks = parseTerms(terms.source);

  return (
    <>
      <PageHero
        compact
        eyebrow="Legal"
        heading="Terms & Conditions of Supply"
        body={`Arrow Industries & Co — Samaro Pty Ltd, ABN ${site.abn}.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms-conditions" },
        ]}
      />

      <section className="sec tight">
        <div className="wrap legal">
          <nav className="legal-nav scroll" aria-label="Clauses">
            <p className="mlabel">Clauses</p>
            {blocks.map((b) =>
              b.kind === "clause" ? (
                <a key={b.id} href={`#${b.id}`}>
                  <span>{b.number}</span>
                  {b.heading}
                </a>
              ) : null,
            )}
          </nav>
          <div className="legal-body text-base leading-relaxed text-mute">

            {/* Issuer block */}
            <div className="card mb-3 p-5 text-sm sm:p-6">
              <p className="font-display text-base font-semibold text-bone">
                {site.tradingName}
              </p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
                <dt className="text-mute">ABN</dt>
                <dd className="text-bone">{site.abn}</dd>
                <dt className="text-mute">Address</dt>
                <dd className="text-bone">
                  {site.address.line1}, {site.address.suburb}{" "}
                  {site.address.state} {site.address.postcode}
                </dd>
                <dt className="text-mute">Phone</dt>
                <dd className="text-bone">
                  <a href={site.phoneHref} className="hover:text-accent-text">
                    {site.phone}
                  </a>
                </dd>
                <dt className="text-mute">Email</dt>
                <dd className="text-bone">
                  <a href={site.emailHref} className="hover:text-accent-text">
                    {site.email}
                  </a>
                </dd>
                <dt className="text-mute">Version</dt>
                <dd className="text-bone">
                  {terms.version}, effective {longDate(terms.effectiveFrom)}
                </dd>
              </dl>
            </div>

            {/*
              Where a trade customer is already reading what an account is
              subject to — which is the moment they want one. Under the
              issuer block rather than in the clauses: an offer inside the
              terms would read as part of them.
            */}
            <div className="card mb-10 p-5 sm:p-6">
              <p className="font-display text-base font-semibold text-bone">
                Want an account with us?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Trade customers can apply for a credit account online. It takes about five
                minutes and we come back to you within two business days.
              </p>
              <Button href="/credit" variant="secondary" className="mt-4">
                Apply for a credit account
              </Button>
            </div>

            <div className="terms">
              {blocks.map((b, i) => <Block key={i} b={b} />)}
            </div>

            {/* Footer note */}
            <div className="mt-16 border-t border-line pt-6 text-sm">
              <p>
                Questions about these terms can be directed to{" "}
                <a href={site.emailHref} className="text-accent-text hover:underline">
                  {site.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Rendering ---------- */

function Rich({ text }: { text: string }) {
  return (
    <>
      {boldRuns(text).map((r, i) =>
        r.bold ? <strong key={i} className="font-semibold text-bone">{r.text}</strong> : <span key={i}>{r.text}</span>,
      )}
    </>
  );
}

function Block({ b }: { b: TermsBlock }) {
  if (b.kind === "clause")
    return (
      <h2 id={b.id} className="tclause display">
        <span className="red">{b.number}.</span> {b.heading}
      </h2>
    );
  if (b.kind === "subclause")
    return (
      <h3 id={b.id} className="tsub">
        <span>{b.number}</span> {b.heading}
      </h3>
    );
  if (b.kind === "item")
    return (
      <div className={`titem d${b.depth}`}>
        <span>{b.label}</span>
        <div>
          <Rich text={b.text} />
        </div>
      </div>
    );
  return (
    <p>
      <Rich text={b.text} />
    </p>
  );
}
