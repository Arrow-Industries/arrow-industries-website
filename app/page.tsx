import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BuildWall } from "@/components/BuildWall";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { CTASection } from "@/components/CTASection";
import { PartnerLogos } from "@/components/PartnerLogos";
import { PhotoBand, ViewBuildsLink, WorkshopStrip } from "@/components/ProductParts";
import { ProductChooser } from "@/components/ProductChooser";
import { RoadworthyBand } from "@/components/RoadworthyBand";
import { SectionHeader } from "@/components/SectionHeader";
import { TapTheTruck } from "@/components/TapTheTruck";
import { Testimonials } from "@/components/Testimonials";
import { TrustedBy } from "@/components/TrustedBy";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { tipperWalk } from "@/data/truck-parts";
import { toBuilds } from "@/lib/builds";
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

const doors = [
  { href: "#build", note: "New truck body or trailer", label: "Build" },
  { href: "#roadworthy", note: "Heavy vehicle inspection", label: "Roadworthy" },
  { href: "#repairs", note: "Trucks, bodies and trailers", label: "Repairs" },
];

export default async function HomePage() {
  const posts = await fetchTopInstagramMedia(12, 30);
  const recentBuilds = toBuilds(posts).filter((b) => !b.video);

  return (
    <>
      <link rel="canonical" href={`${site.url}/`} />
      <Hero />
      <ProductChooser />
      <TapTheTruck walk={tipperWalk} id="tap-the-truck" />

      <section className="band">
        <Container>
          <SectionHeader eyebrow="Campbellfield workshop" heading="Steel to site." className="mb-7 lg:mb-11" />
        </Container>
        <WorkshopStrip
          items={[
            { photo: media.welding, title: "Welded in-house" },
            { photo: media.paintBooth, title: "Painted your colour" },
            { photo: media.tailgate, title: "Fitted and tested" },
            { photo: media.onSite, title: "Out to work" },
          ]}
        />
      </section>

      <section id="work" className="scroll-mt-15">
        <Container className="flex flex-wrap items-end justify-between gap-4 pb-7 lg:pb-11">
          <SectionHeader eyebrow="Recent work" heading="Off the floor." />
          <ViewBuildsLink />
        </Container>
        <BuildWall builds={recentBuilds} />
      </section>

      <Testimonials />
      <TrustedBy />
      <RoadworthyBand />

      <section id="repairs" className="scroll-mt-15">
        <PhotoBand
          photo={media.workshop}
          eyebrow="Repairs & servicing"
          heading="Fixed by the people who build them."
        >
          <Button href="/repairs-servicing" size="lg" variant="secondary">
            Repairs &amp; servicing
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </PhotoBand>
      </section>

      <section className="section">
        <Container>
          <p className="eyebrow mb-4 text-center">Built with proven components</p>
          <PartnerLogos />
        </Container>
      </section>

      <CTASection eyebrow="Talk to the workshop" heading="Get a quote for your next build or repair." />
    </>
  );
}

function Hero() {
  return (
    <section>
      <Container className="pb-4 pt-5 lg:pb-6 lg:pt-7">
        <p className="eyebrow">Melbourne-built tipper bodies and trailers. 25+ years&rsquo; experience.</p>
        <h1 className="display mt-3 whitespace-nowrap text-[21vw] leading-[0.88] lg:text-[min(12vw,13rem)]">
          Built for <span className="block text-accent lg:inline">real work.</span>
        </h1>
      </Container>

      {/* The poster is the first image to load; the film plays over it. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-3 lg:aspect-auto lg:h-[max(24rem,calc(100svh-3.75rem-19vw-6.25rem))]">
        <Image
          src="/images/home/hero-stage-v1.jpg"
          alt="An Arrow Industries tipper body on a five-axle truck in a studio"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_72%]"
        />
        <video
          className="hero-bg-video absolute inset-0 h-full w-full object-cover object-[50%_72%]"
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

      <nav aria-label="What do you need?" className="grid border-b border-line-soft lg:grid-cols-3">
        {doors.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group flex min-h-21 items-center justify-between gap-4 border-t border-line-soft px-[clamp(1rem,3vw,2.5rem)] py-3 transition-colors hover:bg-accent lg:min-h-25 lg:border-l lg:border-t-0 lg:first:border-l-0"
          >
            <span>
              <span className="block text-[0.8125rem] text-mute transition-colors group-hover:text-white">
                {d.note}
              </span>
              <span className="display mt-1 block text-[clamp(2.25rem,3vw,2.75rem)] leading-none">
                {d.label}
              </span>
            </span>
            <ArrowRight
              className="h-7 w-7 shrink-0 transition-transform group-hover:translate-x-1.5"
              strokeWidth={2}
              aria-hidden
            />
          </Link>
        ))}
      </nav>
    </section>
  );
}
