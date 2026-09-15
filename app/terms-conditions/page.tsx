import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
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

      <section className="bg-ink py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-base leading-relaxed text-mute">

            {/* Issuer block */}
            <div className="mb-12 border border-line bg-ink-2 p-6 text-sm">
              <p className="font-display text-base font-bold text-bone">
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

            <div className="text-sm leading-relaxed sm:text-base">
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
        </Container>
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

const indent: Record<1 | 2 | 3, string> = { 1: "", 2: "pl-8", 3: "pl-16" };

function Block({ b }: { b: TermsBlock }) {
  if (b.kind === "clause")
    return (
      <h2 id={b.id} className="mt-12 first:mt-0 mb-4 scroll-mt-24 font-display text-xl font-extrabold text-bone sm:text-2xl">
        <span className="text-accent">{b.number}.</span> {b.heading}
      </h2>
    );
  if (b.kind === "subclause")
    return (
      <h3 id={b.id} className="mt-6 mb-3 scroll-mt-24 font-display text-base font-bold text-bone sm:text-lg">
        <span className="text-accent-text/80">{b.number}</span>{" "}
        <span className="ml-1">{b.heading}</span>
      </h3>
    );
  if (b.kind === "item")
    return (
      <div className={`mt-3 grid grid-cols-[2rem_1fr] gap-x-1 ${indent[b.depth]}`}>
        <span className="text-mute">{b.label}</span>
        <div><Rich text={b.text} /></div>
      </div>
    );
  return (
    <p className="mt-4">
      <Rich text={b.text} />
    </p>
  );
}
