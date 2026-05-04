import { Container } from "@/components/Container";
import { fetchInstagramMedia, thumbFor } from "@/lib/instagram";

const MAX = 36;

export async function InstagramStrip() {
  const items = await fetchInstagramMedia(MAX);
  if (items.length === 0) return null;

  return (
    <section className="bg-ink py-10 lg:py-14">
      <Container>
        <ul className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <li
              key={m.id}
              className="aspect-square overflow-hidden bg-ink-2"
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
