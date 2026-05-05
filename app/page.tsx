import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
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

export default async function HomePage() {
  const topPosts = await fetchTopInstagramMedia(3, 30);
  return (
    <>
      <Hero />
      <TrustBar />
      <SpecPromise />
      <ServicesSection />
      <TrustedBy />
      <RecentBuildsSection posts={topPosts} />
      <PartnersSection />
      <CTASection
        eyebrow="Get a Quote"
        heading="Get a quote for your next build or repair"
        body="Tell us your application, payload and chassis — we'll return a build proposal, lead time and pricing."
        primaryCta={{ label: "Request a Quote →", href: "/request-a-quote" }}
        secondaryCta={{ label: "View Builds →", href: "/gallery" }}
        footnote="Built to spec. Supported by the team that builds your unit."
      />
    </>
  );
}

function SpecPromise() {
  return (
    <section className="bg-ink pt-3 pb-7">
      <Container>
        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-mute sm:text-base">
          Built with proven components for demanding work, backed by{" "}
          <span className="font-semibold text-bone">workshop support</span>.
        </p>
      </Container>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {/* Background layer — poster image (always present) + looping video over the top */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Static poster fallback — visible until the video loads, on prefers-reduced-motion, or if the video fails */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/hero-poster.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <video
          className="hero-bg-video absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/home/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/home-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay — left-weighted dark gradient so text stays readable while the
          right-side visual remains visible. Plus subtle red brand glows. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0.55)_45%,rgba(10,10,10,0.25)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,10,10,0.4)_0%,transparent_30%,transparent_70%,rgba(10,10,10,0.7)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(225,6,0,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(225,6,0,0.10),transparent_60%)]"
      />

      <Container className="relative pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-4xl">
          <Image
            src="/images/logo-white.png"
            alt="Arrow Industries"
            width={224}
            height={224}
            priority
            className="h-36 w-36 sm:h-44 sm:w-44 lg:h-56 lg:w-56"
          />
          <p className="mt-2 inline-flex items-center gap-2 border border-line-soft/60 bg-ink-2/40 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-mute backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Melbourne workshop · 25+ years
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-bone sm:text-5xl lg:text-[4.25rem]">
            Custom tipper bodies and trailers{" "}
            <span className="text-accent">engineered for real work.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Melbourne-based manufacturer engineering custom tipper bodies, dog
            trailers and semi trailers for civil, quarry, haulage and waste
            operators across Australia.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-2">
            <Button href="/request-a-quote" size="lg">
              Request a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <Button href={site.phoneHref} size="lg" variant="secondary">
              <Phone className="h-4 w-4 text-accent" aria-hidden />
              Call now: {site.phone}
            </Button>
          </div>
          <div className="mt-3">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-mute transition-colors hover:text-accent"
            >
              View our builds
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-mute">
            Call our team or send your details — we&rsquo;ll get your build
            underway.
          </p>
          <p className="mt-3 text-xs font-semibold text-mute/80">
            Built to spec. Ready for real work.
          </p>
        </div>
      </Container>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="bg-ink pt-24 pb-28 lg:pt-32 lg:pb-36">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-start md:gap-8">
          <SectionHeader
            eyebrow="Our capability"
            heading="What we build and service"
            body="Built, fabricated and serviced from our Campbellfield workshop — one team, every build engineered to suit the job."
          />
          <Button href="/request-a-quote" variant="secondary" size="md">
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-16 grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Container>
    </section>
  );
}

const FALLBACK_BUILDS = [
  {
    src: "/images/builds/build-1.jpg",
    alt: "Recent Arrow Industries 8x4 tipper body build for quarry application",
  },
  {
    src: "/images/builds/build-2.jpg",
    alt: "Recent Arrow Industries dog trailer build for civil construction",
  },
  {
    src: "/images/builds/build-3.jpg",
    alt: "Recent Arrow Industries semi trailer build for bulk haulage",
  },
];

function RecentBuildsSection({ posts }: { posts: IgMedia[] }) {
  const usingIg = posts.length > 0;
  return (
    <section className="bg-ink pt-4 pb-20 lg:pt-6 lg:pb-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow={usingIg ? "Most loved on Instagram" : "Recent work"}
            heading="Recent builds"
          />
          <Button href="/gallery" variant="ghost" size="md">
            View gallery →
          </Button>
        </div>
        <ul className="mt-12 grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {usingIg
            ? posts.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={p.caption?.slice(0, 120) || "View on Instagram"}
                    className="group relative block aspect-[5/4] overflow-hidden bg-ink-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbFor(p)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pt-10 pb-5">
                      <span className="font-display text-base font-bold text-bone">
                        @{p.username || "arrowindustries"}
                      </span>
                    </div>
                  </a>
                </li>
              ))
            : FALLBACK_BUILDS.map((b, i) => (
                <li key={`fallback-${i}`}>
                  <Link
                    href="/gallery"
                    aria-label="View gallery"
                    className="group relative block aspect-[5/4] overflow-hidden bg-ink-2"
                  >
                    <Image
                      src={b.src}
                      alt={b.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
    <section className="bg-ink-2 py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
            Components
          </p>
          <h2 className="mt-3 font-display text-lg font-extrabold leading-[1.15] text-bone sm:text-xl">
            Built with proven components from industry-leading suppliers
          </h2>
        </div>
        <div className="mt-8">
          <PartnerLogos />
        </div>
      </Container>
    </section>
  );
}
