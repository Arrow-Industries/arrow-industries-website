import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import type { BreadcrumbCrumb } from "@/lib/schema";

interface ProductHeroProps {
  crumbs: BreadcrumbCrumb[];
  badge: string;
  heading: ReactNode;
  body: string;
  image: string;
  imagePosition?: string;
  /** A short line under the body, such as the chassis a body suits. */
  note?: string;
  actions: ReactNode;
  /** Small facts shown as pills along the bottom of the stage. */
  facts?: readonly string[];
}

/** The opening stage for a product page: one photograph, one message. */
export function ProductHero({
  crumbs,
  badge,
  heading,
  body,
  image,
  imagePosition,
  note,
  actions,
  facts,
}: ProductHeroProps) {
  return (
    <section>
      <Container className="pt-6 lg:pt-8">
        <Breadcrumbs crumbs={crumbs} />
        <div className="relative isolate mt-5 flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-3xl border border-line-soft bg-ink-2 lg:min-h-[38rem]">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(min-width: 1216px) 1152px, 100vw"
            className="-z-20 object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_11_13/0.2)_0%,rgb(11_11_13/0.55)_45%,rgb(11_11_13/0.94)_100%)] lg:bg-[linear-gradient(90deg,rgb(11_11_13/0.92)_0%,rgb(11_11_13/0.66)_48%,rgb(11_11_13/0.12)_100%)]"
          />
          <div className="max-w-2xl p-6 sm:p-8 lg:p-12">
            <p className="pill">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {badge}
            </p>
            <h1 className="mt-4 font-display text-[2.25rem] font-semibold leading-[1.04] text-bone sm:text-5xl lg:text-[3.5rem]">
              {heading}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-bone/75 sm:text-lg">
              {body}
            </p>
            {note && <p className="mt-3 text-sm font-medium text-bone/90">{note}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">{actions}</div>
            {facts && facts.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {facts.map((f) => (
                  <li key={f} className="pill">
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
