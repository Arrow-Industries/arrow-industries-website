import Image from "next/image";
import { Container } from "@/components/Container";
import { fetchInstagramMedia, thumbFor } from "@/lib/instagram";

const MAX = 36;

// Shown if Instagram can't be reached, so the gallery is never an empty page.
const FALLBACK = [
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

export async function InstagramStrip() {
  const items = await fetchInstagramMedia(MAX);
  if (items.length === 0) {
    return (
      <section className="section">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FALLBACK.map((b) => (
              <li
                key={b.src}
                className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-line-soft bg-ink-2"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  return (
    <section className="section">
      <Container>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <li
              key={m.id}
              className="aspect-square overflow-hidden rounded-xl bg-ink-2"
            >
              <a
                href={m.permalink}
                target="_blank"
                rel="noreferrer"
                aria-label={m.caption?.slice(0, 80) || "Instagram post"}
                className="block h-full w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbFor(m)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
