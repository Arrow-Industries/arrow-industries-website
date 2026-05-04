import type { Metadata } from "next";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { InstagramStrip } from "@/components/InstagramStrip";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Gallery | Arrow Industries",
  description:
    "View recent Arrow Industries builds, repairs and workshop projects including custom tipper bodies, dog trailers and heavy vehicle fabrication.",
  alternates: { canonical: "/gallery" },
};

const socials = [
  { label: "Instagram", href: site.social.instagram, icon: Instagram },
  { label: "Facebook", href: site.social.facebook, icon: Facebook },
  { label: "LinkedIn", href: site.social.linkedin, icon: Linkedin },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Gallery"
        heading="Recent builds, repairs and workshop projects."
        body="A look inside the Arrow workshop — finished builds, repairs and fabrication work."
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <InstagramStrip />

      <section className="border-t border-line bg-ink-2 py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold leading-[1.1] text-bone sm:text-4xl">
              Follow the workshop
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">
              See new builds, repairs and updates as they happen.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                Follow on Instagram
              </Button>
            </div>

            <ul className="mt-10 flex items-center justify-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Arrow Industries on ${s.label}`}
                      className="inline-flex h-11 w-11 items-center justify-center border border-line bg-ink text-bone transition-colors hover:border-accent hover:bg-accent hover:text-white"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
