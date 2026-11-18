import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { TrailerPageTemplate, type TrailerRecentBuild } from "@/components/TrailerPageTemplate";
import { media } from "@/data/media";
import { getServiceBySlug } from "@/data/services";

const slug = "semi-trailers";

const meta = {
  title:
    "Semi Trailers — Built for Bulk Haulage and Long-Haul Work",
  description:
    "Tipping and flat-deck semi trailers built to match your prime mover — 2 and 3 axle setups for higher volume, longer haul and consistent tipping.",
};

export const metadata: Metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: `/${slug}`,
});

const faqs = [
  {
    question: "Can you build a semi to suit my prime mover?",
    answer:
      "Yes. Send us the prime mover make, model, GCM and your typical loads. We'll design a semi with the right axle group, kingpin position and hydraulics to suit.",
  },
  {
    question: "What's the lead time on a new semi trailer?",
    answer:
      "Typical builds run 10–16 weeks depending on axle group, body style and current workload. We confirm a delivery date in writing before you commit.",
  },
  {
    question: "Do you offer PBS-compatible builds?",
    answer:
      "Yes — we build semi trailers to suit B-double, A-double and rigid-and-dog combinations. If you already have the access permit in place we'll engineer to it; if you don't, we can take care of the PBS engineering and certification as part of the build.",
  },
  {
    question: "Tipping or flat-deck?",
    answer:
      "Both. Tipping semis for bulk and quarry work, flat-deck variants for general freight — each engineered around your payload and route.",
  },
];

// Add real semi trailer builds here as photos become available.
const recentBuilds: TrailerRecentBuild[] = [];

const trailerType = {
  label: "Semi trailers",
  headline: "Built for higher volume and longer haul work.",
  bullets: [
    "2-axle and 3-axle setups",
    "Built for higher volume and longer haul work",
    "Designed for consistent tipping performance",
    "PBS-compatible builds where access permits apply",
  ],
};

const completeSetup = {
  outcomes: [
    "Combination tracks cleanly through high-speed and cornering",
    "Predictable stability under heavy and uneven loads",
    "No after-the-fact integration retrofits",
  ],
  bullets: [
    "Kingpin position and fifth-wheel geometry matched to the prime mover",
    "Hydraulics for tipping bodies fed from the prime mover circuit",
    "Brake and ABS/EBS systems configured to combination spec",
    "Electrical harness and ISO connections fully integrated",
  ],
};

const features = [
  "Tipping body or flat-deck configuration",
  "Tailgate systems on tipping semis (including 2-way air operated)",
  "Heavy-duty kingpin assemblies and landing gear",
  "Tarp systems (manual or electric)",
  "Spray suppression systems",
  "LED lighting, ABS/EBS and safety systems",
  "Access steps and practical operator features",
];

export default function Page() {
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <TrailerPageTemplate
      config={{
        slug,
        service,
        meta,
        hero: {
          badge: "Semi Trailers",
          subtext: "Semi trailers matched to your prime mover, built for long-term heavy work.",
          capability: ["2-axle", "3-axle"],
          image: media.bodyPainted.src,
          imagePosition: "50% 45%",
        },
        recentBuilds,
        trailerType,
        completeSetup,
        features,
        faqs,
      }}
    />
  );
}
