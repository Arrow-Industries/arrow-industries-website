import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Instagram } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { TrustBar } from "@/components/TrustBar";
import { TrustedBy } from "@/components/TrustedBy";
import { ServiceCard } from "@/components/ServiceCard";
import { CTASection } from "@/components/CTASection";
import { PartnerLogos } from "@/components/PartnerLogos";
import { SectionHeader } from "@/components/SectionHeader";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { fetchTopInstagramMedia, thumbFor, type IgMedia } from "@/lib/instagram";

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
  const topPosts = await fetchTopInstagramMedia(3, 30);
  return (
    <>
      <link rel="canonical" href={`${site.url}/`} />
      <Hero />
      <ServicesSection />
      <TrustedBy />
      <RecentBuildsSection posts={topPosts} />
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
          <Button href="/builds" size="lg" variant="secondary">
            View builds
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

function ServicesSection() {
  const [feature, ...rest] = services;
  const wide = rest[rest.length - 1];
  // Roadworthy is a main part of the business, so it leads the smaller cards.
  const standard = rest
    .slice(0, -1)
    .sort(
      (a, b) =>
        Number(b.slug === "licensed-vehicle-testing") -
        Number(a.slug === "licensed-vehicle-testing"),
    );

  return (
    <section className="section">
      <Container>
        <SectionHeader
          eyebrow="Our capability"
          heading="What we build and service"
          body="Built, fabricated and serviced from our Campbellfield workshop — one team, every build engineered to suit the job."
        />

        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li className="sm:col-span-2">
            <ServiceCard
              service={feature}
              variant="feature"
              image="/images/builds/build-2.jpg"
            />
          </li>
          {standard.map((s) => (
            <li key={s.slug}>
              <ServiceCard service={s} />
            </li>
          ))}
          <li className="sm:col-span-2 lg:col-span-3">
            <ServiceCard service={wide} variant="wide" />
          </li>
        </ul>
      </Container>
    </section>
  );
}

const FALLBACK_BUILDS = [
  {
    src: "/images/builds/build-1.jpg",
    alt: "Arrow Industries tipper body on a white cab-over truck, side view",
  },
  {
    src: "/images/builds/build-2.jpg",
    alt: "Arrow Industries tipper body with a graphite finish, side view",
  },
  {
    src: "/images/builds/build-3.jpg",
    alt: "Rear three-quarter view of an Arrow Industries tipper body",
  },
];

function RecentBuildsSection({ posts }: { posts: IgMedia[] }) {
  const usingIg = posts.length > 0;
  return (
    <section className="section">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow={usingIg ? "Recent builds" : "Recent work"}
            heading={
              usingIg ? (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent-text"
                >
                  <Instagram className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                  Follow us on Instagram
                </a>
              ) : (
                "Recent builds"
              )
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
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {usingIg
            ? posts.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={p.caption?.slice(0, 120) || "View on Instagram"}
                    className="group relative block aspect-[5/4] overflow-hidden rounded-2xl border border-line-soft bg-ink-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbFor(p)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
                    />
                    <span className="material absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-medium text-bone">
                      @{p.username || "arrowindustries"}
                    </span>
                  </a>
                </li>
              ))
            : FALLBACK_BUILDS.map((b, i) => (
                <li key={`fallback-${i}`}>
                  <Link
                    href="/builds"
                    aria-label="View builds"
                    className="group relative block aspect-[5/4] overflow-hidden rounded-2xl border border-line-soft bg-ink-2"
                  >
                    <Image
                      src={b.src}
                      alt={b.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-mac)] group-hover:scale-[1.03]"
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
