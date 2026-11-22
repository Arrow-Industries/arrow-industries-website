import Image from "next/image";
import Link from "next/link";
import { Action, Facts, Head, NextLink, Steps } from "@/components/Blocks";
import { CTASection } from "@/components/CTASection";
import { media } from "@/data/media";
import { partners } from "@/data/partners";
import { site } from "@/data/site";

// Canonical for the home page is emitted directly in JSX (not via the
// Metadata.alternates.canonical API) so the trailing slash is preserved.
// Next.js's metadata pipeline calls stripTrailingSlash on canonical URLs,
// and flipping trailingSlash: true in next.config would force trailing
// slashes on every other page too — which we don't want. The other pages
// keep using Metadata.alternates.canonical (no trailing slash, matches
// their URL) as normal.

const range = [
  {
    href: "/tipper-truck-bodies",
    photo: media.tipperGraphite,
    title: "Tipper bodies",
    line: "For any make or model.",
  },
  {
    href: "/dog-trailers",
    photo: media.dogSide,
    title: "Dog trailers",
    line: "3-axle and 4-axle, matched to your tipper.",
  },
  {
    href: "/dog-trailers",
    photo: media.truckAndDogDusk,
    title: "Truck & dog sets",
    line: "Built together as one combination.",
  },
];

// A quiet row, so only the partners with a clean mark are shown.
const partnerRow = ["SAF-Holland", "JOST", "Hella", "Bartlett", "Base Air", "Wurth", "Bulla Tarps"];

export default function HomePage() {
  const logos = partners.filter((p) => p.logo && partnerRow.includes(p.name));

  return (
    <>
      <link rel="canonical" href={`${site.url}/`} />

      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <p className="mlabel">Family-owned · Campbellfield, Melbourne</p>
              <h1>
                Built for
                <br />
                <span className="red">real work.</span>
              </h1>
            </div>
            <div className="hero-side">
              <p>Tipper bodies for any make or model. Arrow-built dog and semi trailers.</p>
              <div className="actions">
                <Action href="/request-a-quote">Request a quote</Action>
                <Action href="#range" tone="line" arrow={false}>
                  See the range
                </Action>
              </div>
            </div>
          </div>
          {/* The film is shown whole, never cropped. The poster loads first. */}
          <div className="film">
            <Image
              src="/images/home/hero-stage-v1.jpg"
              alt="An Arrow tipper body in graphite"
              width={1920}
              height={1080}
              priority
              sizes="(min-width: 1400px) 1340px, 100vw"
            />
            <video
              className="hero-bg-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/home/hero-stage-v1.jpg"
              aria-hidden
            >
              <source src="/videos/home-hero.mp4" type="video/mp4" />
            </video>
          </div>
          <Facts
            items={[
              ["25+", "Years’ experience"],
              ["Any", "Make or model of truck"],
              ["In-house", "Built, painted and inspected"],
              ["EX 12409", "VicRoads LVT"],
            ]}
          />
        </div>
      </section>

      <section className="sec" id="range">
        <div className="wrap">
          <Head
            label="The range"
            note="Built to the chassis, the load and the work."
          >
            What we <span className="red">build.</span>
          </Head>
          <div className="range">
            {range.map((r) => (
              <Link key={r.title} className="rcard reveal" href={r.href}>
                <div className="ph">
                  <Image src={r.photo.src} alt={r.photo.alt} width={1440} height={1080} sizes="(min-width: 860px) 33vw, 100vw" />
                </div>
                <div className="txt">
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.line}</p>
                  </div>
                  <span className="go" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link className="semi reveal" href="/semi-trailers">
            <div>
              <b>Semi trailers</b>
              <span className="note">Tipping or flat-deck.</span>
            </div>
            <span className="btn btn-line">
              View <span className="arrow" aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="sec ruled">
        <div className="wrap">
          <Head label="How we build" note="One workshop, start to finish.">
            Steel to <span className="red">site.</span>
          </Head>
          <Steps
            items={[
              ["Review", "Chassis, payload and application."],
              ["Specify", "Drawings signed off before steel is cut."],
              ["Fabricate", "Built in our Campbellfield workshop."],
              ["Fit off", "Hydraulics, electrical and paint."],
              ["Hand over", "Tested, plated and ready for work."],
            ]}
          />
        </div>
      </section>

      <section className="sec flush">
        <div className="wrap service">
          <div className="svc dark reveal" id="roadworthy">
            <p className="mlabel">VicRoads LVT · EX 12409</p>
            <h3>
              Roadworthy
              <br />
              on site.
            </h3>
            <p>Heavy vehicle and trailer inspections at our Campbellfield workshop.</p>
            <div className="meta">
              <span>60–120 minutes</span>
              <Action href="/licensed-vehicle-testing">Book an inspection</Action>
            </div>
          </div>
          <div className="svc reveal" id="repairs">
            <p className="mlabel">Repairs &amp; servicing</p>
            <h3>
              Fixed by the people
              <br />
              who <span className="red">build them.</span>
            </h3>
            <p>Tipper bodies and trailers of any make, repaired and maintained.</p>
            <div className="meta">
              <span>Any make</span>
              <Action href="/repairs-servicing" tone="ink">
                Repairs &amp; servicing
              </Action>
            </div>
          </div>
        </div>
      </section>

      <section className="sec flush">
        <div className="wrap">
          <NextLink href="/builds" label="Our work" name="Off the floor" />
          <div className="logos reveal" style={{ borderTop: 0 }}>
            <p className="mlabel">Component partners</p>
            {logos.map((p) => (
              <Image key={p.name} src={p.logo as string} alt={p.name} width={160} height={56} />
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
