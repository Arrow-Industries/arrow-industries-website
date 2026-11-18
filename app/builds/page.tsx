import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { BuildsGallery } from "@/components/BuildsGallery";
import { Button } from "@/components/Button";
import { CTASection } from "@/components/CTASection";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Testimonials } from "@/components/Testimonials";
import { site } from "@/data/site";
import { toBuilds, type BuildItem } from "@/lib/builds";
import { fetchInstagramMedia } from "@/lib/instagram";

export const metadata: Metadata = pageMetadata({
  title: "Builds — Recent Tipper, Dog & Semi Trailer Work",
  description:
    "A selection of recent Arrow Industries builds — custom tipper bodies, dog trailers, semi trailers and heavy vehicle fabrication from our Campbellfield workshop.",
  path: "/builds",
});

// New Instagram posts appear within the hour.
export const revalidate = 3600;

const socials = [
  { label: "Facebook", href: site.social.facebook, icon: Facebook },
  { label: "LinkedIn", href: site.social.linkedin, icon: Linkedin },
];

// Shown if Instagram can't be reached, so this page is never empty.
const FALLBACK: BuildItem[] = [
  {
    id: "build-1",
    name: "8x4 tipper body",
    title: "8x4 tipper build for civil work",
    description: "6.5m body, 2-way tailgate and a retractable tarp.",
    image: "/images/builds/build-1.jpg",
    link: site.social.instagram,
    products: ["tipper"],
  },
  {
    id: "build-2",
    name: "6x4 tipper body",
    title: "6x4 tipper build for quarry work",
    description: "Heavy-duty floor, twin-ram hoist and wear-rated lining.",
    image: "/images/builds/build-2.jpg",
    link: site.social.instagram,
    products: ["tipper"],
  },
  {
    id: "build-3",
    name: "10x4 tipper body",
    title: "10x4 tipper build for fleet work",
    description: "Custom body length and a full LED kit.",
    image: "/images/builds/build-3.jpg",
    link: site.social.instagram,
    products: ["tipper"],
  },
];

export default async function BuildsPage() {
  const posts = await fetchInstagramMedia(36);
  const builds = posts.length > 0 ? toBuilds(posts) : FALLBACK;

  return (
    <>
      <PageHero
        compact
        eyebrow="Builds"
        heading="A selection of recent work from the Arrow workshop."
        body="Browse tipper bodies, dog trailers and semi trailers, and select any build for a closer look."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Builds", href: "/builds" },
        ]}
        actions={
          <>
            <Button
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              size="lg"
              variant="secondary"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Follow on Instagram
            </Button>
            <ul className="flex items-center gap-1.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Arrow Industries on ${s.label}`}
                      className="icon-btn"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </>
        }
      />

      <section className="section">
        <Container>
          <BuildsGallery builds={builds} />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="card flex flex-wrap items-center justify-between gap-5 p-5 sm:p-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-bone">Running an Arrow?</h2>
              <p className="mt-1 text-sm leading-relaxed text-mute">
                Tag @arrow_industries_co and use #BuiltByArrow to show us your truck at work.
              </p>
            </div>
            <Button href={site.social.instagram} target="_blank" rel="noreferrer" variant="secondary">
              <Instagram className="h-4 w-4" aria-hidden />
              Follow on Instagram
            </Button>
          </div>
        </Container>
      </section>

      <Testimonials />

      <CTASection
        eyebrow="Request a quote"
        heading="Have a build in mind?"
        body="Tell us your application, payload and chassis, and we'll come back with a build proposal, lead time and pricing."
        secondaryCta={{ label: "Configure your build", href: "/configure" }}
      />
    </>
  );
}
