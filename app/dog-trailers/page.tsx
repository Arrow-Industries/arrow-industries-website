import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrailerPageTemplate } from "@/components/TrailerPageTemplate";
import { getServiceBySlug } from "@/data/services";
import { fetchTopInstagramMedia } from "@/lib/instagram";

const slug = "dog-trailers";

const meta = {
  title:
    "Dog Trailers — Built to Match Your Truck Setup",
  description:
    "Tri-axle and quad-axle dog trailers engineered to integrate with your tipper. Drawbar, hydraulics, brakes and electrical built as one matched setup — for civil, quarry and fleet work.",
};

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `/${slug}` },
};

const faqs = [
  {
    question: "Can you build a dog to suit a tipper I already own?",
    answer:
      "Yes. Send us photos, dimensions and the tipper's payload spec. We'll design a dog that pairs cleanly — body height, hoist style, finish and capacity matched to the lead unit.",
  },
  {
    question: "What's the lead time on a new dog trailer?",
    answer:
      "Typical builds run 8–14 weeks depending on axle group, suspension and current workload. We confirm a delivery date in writing before you commit.",
  },
  {
    question: "Tri-axle or quad-axle — which should I choose?",
    answer:
      "Quad-axle gives you more legal mass under most access permits, but adds tare. Tri-axle is lighter and cheaper to operate. We'll help you weigh the trade-off against your typical payload.",
  },
  {
    question: "Do you offer PBS-compatible builds?",
    answer:
      "Yes — we build dog trailers to suit PBS combinations. If you already have the access permit in place we'll engineer to it; if you don't, we can take care of the PBS engineering and certification as part of the build. Either way, you end up with a combination that matches the permit.",
  },
];

const recentBuilds = [
  {
    src: "/images/builds/build-1.jpg",
    alt: "Arrow Industries 3-axle dog trailer build",
    title: "3-Axle Dog Trailer",
    application: "Civil application",
    specs: ["Matched to lead tipper", "Air suspension", "2-way tailgate"],
  },
  {
    src: "/images/builds/build-2.jpg",
    alt: "Arrow Industries 4-axle dog trailer build",
    title: "4-Axle Dog Trailer",
    application: "Quarry application",
    specs: ["High-payload PBS", "Heavy-duty drawbar", "Wear-rated floor"],
  },
  {
    src: "/images/builds/build-3.jpg",
    alt: "Arrow Industries truck and dog combination",
    title: "Truck & Dog Combination",
    application: "Fleet setup",
    specs: ["Matched truck and dog", "Integrated hydraulics", "Job-ready"],
  },
];

const trailerType = {
  label: "Dog trailers",
  headline: "Built to match the truck — not bolted on after.",
  bullets: [
    "3-axle and 4-axle configurations only",
    "Designed to match truck geometry",
    "Built for balance, load distribution and stability",
    "Suited to higher payload and civil applications",
  ],
};

const completeSetup = {
  outcomes: [
    "Truck-and-dog combination performs properly under load",
    "Stable through cornering and reversing",
    "No after-the-fact integration retrofits",
  ],
  bullets: [
    "Drawbar geometry and tow coupling matched to the lead truck",
    "Hoist hydraulics fed from the truck's PTO and lines",
    "Trailer brake harness wired into the truck's brake system",
    "12V/24V electrical connections fully integrated",
  ],
};

const features = [
  "2-way tailgate systems (air operated)",
  "Heavy-duty drawbars and tow connections",
  "Spreader chains",
  "Tarp systems (manual or electric)",
  "Spray suppression systems",
  "LED lighting and safety systems",
  "Access steps and practical operator features",
];

const midPageCta = {
  headline: "Already running a tipper?",
  body: "Send the lead-truck setup — we'll come back with a matched dog build proposal.",
};

export default async function Page() {
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const posts = await fetchTopInstagramMedia(6, 30);

  return (
    <TrailerPageTemplate
      config={{
        slug,
        service,
        meta,
        hero: {
          badge: "Dog Trailers",
          subtext:
            "Dog trailers designed to integrate properly with your tipper setup — built for durability, balance and real-world performance on-site.",
          capability: ["3-axle", "4-axle"],
        },
        recentBuilds,
        trailerType,
        completeSetup,
        features,
        midPageCta,
        faqs,
        posts,
      }}
    />
  );
}
