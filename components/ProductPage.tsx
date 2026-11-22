import type { ReactNode } from "react";
import { Action, Feat, Head, NextLink, PageOpen, Pair, Shots, type Crumb } from "@/components/Blocks";
import { CTASection } from "@/components/CTASection";
import type { FAQ } from "@/data/faqs";

export interface ProductPageProps {
  crumbs: Crumb[];
  /** The page heading, in two lines. The second is set in red. */
  title: [string, string];
  sub: string;
  photo?: { src: string; alt: string; position?: string };
  /** Shown in place of a photograph until a real one exists. */
  typePanel?: ReactNode;
  facts: [string, string][];
  points: { label: string; heading: ReactNode; note: string; items: [string, string][]; xl?: boolean };
  tags?: string[];
  options: string[];
  recent?: { src: string; alt: string; title: string; tag: string }[];
  setup: { heading: ReactNode; bullets: string[] };
  faqs: FAQ[];
  next: { href: string; name: string };
  configureHref: string;
}

/** One layout for every product: a bold opening, a few facts, then the detail. */
export function ProductPage(p: ProductPageProps) {
  return (
    <>
      <PageOpen
        crumbs={p.crumbs}
        title={
          <>
            {p.title[0]}
            <br />
            <span className="red">{p.title[1]}</span>
          </>
        }
        sub={p.sub}
        actions={
          <>
            <Action href="/request-a-quote">Request a quote</Action>
            <Action href="#options" tone="line" arrow={false}>
              Build options
            </Action>
          </>
        }
        photo={p.photo}
        typePanel={p.typePanel}
        facts={p.facts}
      />

      <section className="sec" id="chassis">
        <div className="wrap">
          <Head label={p.points.label} note={p.points.note}>
            {p.points.heading}
          </Head>
          <Feat items={p.points.items} xl={p.points.xl} />
        </div>
      </section>

      <section className="sec flush" id="options">
        <div className="wrap spec">
          <div className="spec-side reveal">
            <p className="mlabel">Build options</p>
            <h2>
              Spec it
              <br />
              your <span className="red">way.</span>
            </h2>
            <p>Drawings signed off before steel is cut.</p>
            {p.tags && (
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            )}
          </div>
          <ul className="list2 reveal">
            {p.options.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {p.recent && p.recent.length > 0 && (
        <section className="sec flush" id="builds">
          <div className="wrap">
            <Head
              label="Recent builds"
              action={
                <Action href="/builds" tone="line">
                  See all builds
                </Action>
              }
            >
              Off the <span className="red">floor.</span>
            </Head>
            <Shots items={p.recent} />
          </div>
        </section>
      )}

      <Pair id="faq" label="The complete setup" heading={p.setup.heading} bullets={p.setup.bullets} faqs={p.faqs} />

      <section style={{ paddingBottom: "var(--pad)" }}>
        <div className="wrap">
          <NextLink href={p.next.href} name={p.next.name} />
        </div>
      </section>

      <CTASection
        eyebrow="Request a quote"
        heading={
          <>
            Discuss your <span className="red">next build.</span>
          </>
        }
        secondaryCta={{ label: "Configure your build", href: p.configureHref }}
      />
    </>
  );
}
