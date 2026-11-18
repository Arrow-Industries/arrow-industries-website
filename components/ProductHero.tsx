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
  imageAlt?: string;
  imagePosition?: string;
  actions: ReactNode;
}

/** The opening of a page: a big line, then one photograph edge to edge. */
export function ProductHero({
  crumbs,
  badge,
  heading,
  body,
  image,
  imageAlt = "",
  imagePosition,
  actions,
}: ProductHeroProps) {
  return (
    <section>
      <Container className="pb-6 pt-5 lg:pb-8 lg:pt-7">
        <Breadcrumbs crumbs={crumbs} />
        <p className="eyebrow mt-7 lg:mt-10">{badge}</p>
        <h1 className="display-lg mt-3 max-w-[16ch]">{heading}</h1>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <p className="max-w-xl text-lg leading-snug text-mute">{body}</p>
          <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
        </div>
      </Container>
      <div className="relative aspect-[4/3] bg-ink-3 md:aspect-[16/9] lg:aspect-auto lg:h-[min(74svh,52vw)]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: imagePosition }}
        />
      </div>
    </section>
  );
}
