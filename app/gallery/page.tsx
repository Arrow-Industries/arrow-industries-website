import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/Button";
import { InstagramStrip } from "@/components/InstagramStrip";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Gallery — Recent Tipper, Dog & Semi Trailer Builds",
  description:
    "Recent Arrow Industries builds, repairs and workshop projects — custom tipper bodies, dog trailers, semi trailers and heavy vehicle fabrication.",
  path: "/gallery",
});

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
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
        ]}
        actions={
          <>
            <Button
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              size="lg"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Follow on Instagram
            </Button>
            <ul className="flex items-center gap-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Arrow Industries on ${s.label}`}
                      className="inline-flex h-11 w-11 items-center justify-center border border-line bg-ink-2 text-bone transition-colors hover:border-accent hover:bg-accent hover:text-white"
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

      <InstagramStrip />
    </>
  );
}
