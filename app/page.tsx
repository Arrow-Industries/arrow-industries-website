import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Instagram } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { TrustBar } from "@/components/TrustBar";
import { TrustedBy } from "@/components/TrustedBy";
import { CTASection } from "@/components/CTASection";
import { PartnerLogos } from "@/components/PartnerLogos";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/data/site";
import { PhotoBand, PhotoCard, WorkshopStrip } from "@/components/ProductParts";
import { Testimonials } from "@/components/Testimonials";
import { TruckDrawing } from "@/components/TruckDrawing";
import { media } from "@/data/media";
import { toBuilds, type BuildItem } from "@/lib/builds";
import { fetchTopInstagramMedia } from "@/lib/instagram";

// Canonical for the home page is emitted directly in JSX (not via the
// Metadata.alternates.canonical API) so the trailing slash is preserved.
// Next.js's metadata pipeline calls stripTrailingSlash on canonical URLs,
// and flipping trailingSlash: true in next.config would force trailing
// slashes on every other page too — which we don't want. The other pages
// keep using Metadata.alternates.canonical (no trailing slash, matches
// their URL) as normal.

// Cache the page (incl. the Instagram fetch below) so the external Graph API
// call never sits on a user's request path. Refreshes at most hourly.
export const revalidate = 3600;

export default async function HomePage() {
  const posts = await fetchTopInstagramMedia(12, 30);
  const recentBuilds = toBuilds(posts)
    .filter((b) => !b.video)
    .slice(0, 4);
  return (
    <>
      <link rel="canonical" href={`${site.url}/`} />
      <Hero />
      <ProductsSection />
      <RoadworthySection />
      <WorkshopSection />
      <ConfigureSection />
      <RecentBuildsSection builds={recentBuilds} />
      <Testimonials />
      <TrustedBy />
      <PartnersSection />
      <CTASection
        eyebrow="Request a quote"
        heading="Get a quote for your next build or repair"
        body="Tell us your application, payload and chassis — we'll return a build proposal, lead time and pricing."
        primaryCta={{ label: "Request a quote", href: "/request-a-quote" }}
        secondaryCta={{ label: "View builds", href: "/builds" }}
        footnote="Built to spec. Supported by the team that builds your unit."
      />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(55%_70%_at_50%_0%,rgb(225_6_0/0.17),transparent_72%)]"
      />
      <Container className="pt-12 text-center sm:pt-16 lg:pt-20">
        <p className="pill">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          Melbourne workshop · 25+ years
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl font-display text-[2.5rem] font-semibold leading-[1.03] text-bone sm:text-6xl lg:text-[4.5rem]">
          Custom tipper bodies and trailers{" "}
          <span className="text-accent">engineered for real work.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
          Melbourne-based manufacturer engineering custom tipper bodies, dog
          trailers and semi trailers for civil, quarry, haulage and waste
          operators across Australia.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <Button href="/request-a-quote" size="lg">
            Request a quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Button href="/configure" size="lg" variant="secondary">
            Configure your build
          </Button>
        </div>

        {/* The stage. The poster is the LCP image; the video plays over it. */}
        <div className="relative mx-auto mt-10 max-w-6xl lg:mt-14">
          <div
            aria-hidden
            className="absolute -inset-x-10 -bottom-10 top-1/3 -z-10 bg-[radial-gradient(50%_50%_at_50%_60%,rgb(225_6_0/0.2),transparent_75%)] blur-2xl"
          />
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-[var(--shadow-float)] lg:rounded-3xl">
            <Image
              src="/images/home/hero-stage-v1.jpg"
              alt="An Arrow Industries tipper body on a five-axle truck in a studio"
              fill
              priority
              sizes="(min-width: 1216px) 1152px, 100vw"
              className="object-cover"
            />
            <video
              className="hero-bg-video absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/images/home/hero-stage-v1.jpg"
              aria-hidden="true"
            >
              <source src="/videos/home-hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Container>
      <div className="pt-7 lg:pt-9">
        <TrustBar />
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section className="section">
      <Container>
        <SectionHeader
          eyebrow="What we build"
          heading="Built in Campbellfield for the work ahead."
          body="Every tipper body and trailer is engineered around your chassis, payload and application."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PhotoCard
            href="/tipper-truck-bodies"
            photo={media.tipperGraphiteRear}
            title="Tipper bodies"
            body="Custom-built for 4x2, 6x4, 8x4 and 10x4 chassis."
          />
          <PhotoCard
            href="/dog-trailers"
            photo={media.truckAndDogDusk}
            title="Dog trailers"
            body="3-axle and 4-axle trailers matched to your truck."
          />
          <PhotoCard
            href="/semi-trailers"
            photo={media.bodyPainted}
            title="Semi trailers"
            body="Tipping and flat-deck builds on 2 and 3 axles."
            className="sm:col-span-2 sm:aspect-[16/9] lg:col-span-1 lg:aspect-[4/5]"
          />
        </div>
      </Container>
    </section>
  );
}

function RoadworthySection() {
  return (
    <section className="section">
      <Container>
        <PhotoBand
          photo={media.workshop}
          eyebrow="Roadworthy inspections"
          heading="VicRoads-licensed heavy vehicle testing."
          body="Licensed Vehicle Tester EX 12409. Prime movers, rigid trucks, trailers and fleet vehicles tested and certified at our Campbellfield workshop."
        >
          <div className="flex flex-wrap gap-2.5">
            <Button href="/licensed-vehicle-testing#book" size="lg">
              Book an inspection
            </Button>
            <Button href="/repairs-servicing" size="lg" variant="secondary">
              Repairs &amp; servicing
            </Button>
          </div>
        </PhotoBand>
      </Container>
    </section>
  );
}

function WorkshopSection() {
  return (
    <section className="section">
      <Container>
        <SectionHeader
          eyebrow="Inside the workshop"
          heading="One team, from first weld to final coat."
        />
        <WorkshopStrip
          items={[
            {
              photo: media.welding,
              title: "Fabricated in-house",
              body: "Welds laid by qualified fabricators and inspected before paint.",
            },
            {
              photo: media.paintBooth,
              title: "Finished to your colour",
              body: "2-pack paint, with a clean finish on every build.",
            },
            {
              photo: media.onSite,
              title: "Ready for real work",
              body: "Built for quarries, tip sites and unsealed roads.",
            },
          ]}
        />
      </Container>
    </section>
  );
}

function ConfigureSection() {
  return (
    <section className="section">
      <Container>
        <div className="panel grid items-center gap-4 p-6 sm:p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="eyebrow mb-2">Configure</p>
            <h2 className="font-display text-[1.75rem] font-semibold leading-[1.1] text-bone sm:text-4xl">
              Spec your truck in a few clicks.
            </h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-mute sm:text-base">
              Choose the setup, colour and options, then send your build to the workshop for a quote.
            </p>
            <div className="mt-5">
              <Button href="/configure" size="lg">
                Configure your build
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </div>
          <TruckDrawing
            product="tipper"
            setup="8x4"
            colour="#c5140e"
            options={["Tarp system", "LED lighting"]}
            className="h-auto w-full"
          />
        </div>
      </Container>
    </section>
  );
}

const FALLBACK_BUILDS = [
  media.tipperGraphite,
  media.dogSide,
  media.sitrak,
  media.truckAndDog,
];

function RecentBuildsSection({ builds }: { builds: BuildItem[] }) {
  const usingIg = builds.length > 0;
  return (
    <section className="section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Recent builds"
            heading={
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors hover:text-accent-text"
              >
                <Instagram className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                Follow the workshop
              </a>
            }
          />
          <Link
            href="/builds"
            className="group inline-flex items-center gap-0.5 text-sm font-medium text-accent-text"
          >
            View builds
            <ChevronRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {usingIg
            ? builds.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/builds?build=${b.id}`}
                    aria-label={`View ${b.name}`}
                    className="group relative block aspect-square overflow-hidden rounded-xl bg-ink-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.04]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,rgb(11_11_13/0.86))]"
                    />
                    <span className="absolute inset-x-3 bottom-2.5 text-[0.8125rem] font-semibold text-white">
                      {b.name}
                    </span>
                  </Link>
                </li>
              ))
            : FALLBACK_BUILDS.map((photo) => (
                <li key={photo.src}>
                  <Link
                    href="/builds"
                    aria-label="View builds"
                    className="group relative block aspect-square overflow-hidden rounded-xl bg-ink-2"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.04]"
                    />
                  </Link>
                </li>
              ))}
        </ul>
      </Container>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Components</p>
          <h2 className="mt-1.5 font-display text-lg font-semibold leading-snug text-bone sm:text-xl">
            Built with proven components from industry-leading suppliers
          </h2>
        </div>
        <div className="mt-5">
          <PartnerLogos />
        </div>
      </Container>
    </section>
  );
}
