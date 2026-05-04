import { Instagram } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { fetchInstagramMedia, thumbFor } from "@/lib/instagram";
import { site } from "@/data/site";

const MAX = 24;

export async function InstagramStrip() {
  const items = await fetchInstagramMedia(MAX);
  if (items.length === 0) return null;

  return (
    <section className="border-b border-line bg-ink-2 py-20 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="From the workshop"
          heading="Latest from Instagram"
          body="Recent builds, work-in-progress shots and behind-the-scenes from the Arrow workshop."
        />

        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden bg-line sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="aspect-square bg-ink-2">
              <a
                href={m.permalink}
                target="_blank"
                rel="noreferrer"
                className="group relative block h-full w-full overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbFor(m)}
                  alt={m.caption?.slice(0, 120) ?? "Instagram post"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-ink/70 text-bone opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <Instagram className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm text-mute">
          Follow along on{" "}
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-bone underline-offset-4 hover:text-accent hover:underline"
          >
            @arrow_industries_co
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
