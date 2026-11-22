import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Action, Head, PageOpen } from "@/components/Blocks";
import { CTASection } from "@/components/CTASection";
import { media } from "@/data/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What We Build — Tipper Bodies, Dog Trailers & Semi Trailers",
  description:
    "Arrow Industries builds tipper truck bodies for any make or model, and Arrow dog and semi trailers, in Campbellfield, Melbourne.",
  path: "/range",
});

const products = [
  {
    href: "/tipper-truck-bodies",
    photo: media.tipperGraphite,
    title: "Tipper bodies",
    line: "For any make or model. 4x2, 6x4, 8x4 and 10x4.",
  },
  {
    href: "/dog-trailers",
    photo: media.dogSide,
    title: "Dog trailers",
    line: "3-axle and 4-axle, matched to your tipper.",
  },
  {
    href: "/semi-trailers",
    photo: media.bodyPainted,
    title: "Semi trailers",
    line: "2-axle and 3-axle. Tipping or flat-deck.",
  },
];

const more = [
  { href: "/configure", title: "Configure your build", note: "Choose your options, then send it to the workshop for a quote." },
  { href: "/builds", title: "Recent builds", note: "Off the floor." },
  { href: "/finance", title: "Finance", note: "Asset finance, arranged through our partner Linx Australia Group." },
];

export default function RangePage() {
  return (
    <>
      <PageOpen
        crumbs={[{ label: "Home", href: "/" }, { label: "Build" }]}
        title={
          <>
            What we <span className="red">build.</span>
          </>
        }
        sub="Built to the chassis, the load and the work."
        actions={
          <>
            <Action href="/request-a-quote">Request a quote</Action>
            <Action href="/configure" tone="line" arrow={false}>
              Configure your build
            </Action>
          </>
        }
      />

      <section className="sec tight">
        <div className="wrap">
          <div className="range">
            {products.map((p) => (
              <Link key={p.href} className="rcard reveal" href={p.href}>
                <div className="ph">
                  <Image
                    src={p.photo.src}
                    alt={p.photo.alt}
                    width={1440}
                    height={1080}
                    sizes="(min-width: 860px) 33vw, 100vw"
                  />
                </div>
                <div className="txt">
                  <div>
                    <h2 className="rcard-title">{p.title}</h2>
                    <p>{p.line}</p>
                  </div>
                  <span className="go" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec flush">
        <div className="wrap">
          <Head label="Next steps">
            Plan your <span className="red">build.</span>
          </Head>
          <div className="rows">
            {more.map((m) => (
              <Link key={m.href} className="semi reveal" href={m.href}>
                <div>
                  <b>{m.title}</b>
                  <span className="note">{m.note}</span>
                </div>
                <span className="btn btn-line">
                  View{" "}
                  <span className="arrow" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading={
          <>
            Get a quote for your <span className="red">next build.</span>
          </>
        }
        secondaryCta={{ label: "Configure your build", href: "/configure" }}
      />
    </>
  );
}
