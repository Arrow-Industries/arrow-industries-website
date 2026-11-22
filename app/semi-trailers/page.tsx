import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { TrailerPageTemplate, type TrailerRecentBuild } from "@/components/TrailerPageTemplate";
import { media } from "@/data/media";
import { getServiceBySlug } from "@/data/services";

const slug = "semi-trailers";

const meta = {
  title:
    "Semi Tipper Trailers — 2-Axle and 3-Axle, Built for Bulk Haulage",
  description:
    "Semi tipper trailers built to match your prime mover — 2 and 3 axle setups for higher volume and consistent tipping.",
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
      "Yes. Send us the prime mover make, model, GCM and your typical loads. We'll design a semi tipper with the right axle group, kingpin position and hydraulics to suit.",
  },
  {
    question: "What's the lead time on a new semi trailer?",
    answer:
      "Typical builds run 10–16 weeks depending on axle group, body style and current workload. We confirm a delivery date in writing before you commit.",
  },
  {
    question: "Do you offer PBS-compatible builds?",
    answer:
      "Yes. If you already have the access permit in place we'll engineer to it; if you don't, we can take care of the PBS engineering and certification as part of the build.",
  },
  {
    question: "How is a semi tipper different from a dog trailer?",
    answer:
      "It carries the same Arrow tipping body as our 4-axle dog trailer. The difference is how it is towed: a semi sits on the prime mover's fifth wheel, where a dog trailer follows a tipper truck on a drawbar.",
  },
];

// Add real semi trailer builds here as photos become available.
const recentBuilds: TrailerRecentBuild[] = [];

const trailerType = {
  label: "Semi tipper trailers",
  headline: "A tipping body, behind a prime mover.",
  bullets: [
    "2-axle and 3-axle setups",
    "The same tipping body as our 4-axle dog trailer",
    "Designed for consistent tipping performance",
    "PBS-compatible builds where access permits apply",
  ],
};

const completeSetup = {
  heading: (
    <>
      Matched to the <span className="red">prime mover.</span>
    </>
  ),
  outcomes: [
    "Combination tracks cleanly through high-speed and cornering",
    "Predictable stability under heavy and uneven loads",
    "No after-the-fact integration retrofits",
  ],
  bullets: [
    "Kingpin position and fifth-wheel geometry matched to the prime mover",
    "Hoist hydraulics fed from the prime mover",
    "Brake and ABS/EBS systems configured to combination spec",
    "Electrical harness and ISO connections fully integrated",
  ],
};

const features = [
  "Steel or aluminium tipping body",
  "2-way tailgate systems, air operated",
  "Heavy-duty kingpin assemblies and landing gear",
  "Tarp systems, manual or electric",
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
          badge: "Semi Tipper Trailers",
          subtext: "A tipping body behind your prime mover. 2-axle and 3-axle.",
          capability: ["2-axle", "3-axle"],
        },
        recentBuilds,
        trailerType,
        completeSetup,
        features,
        faqs,
        facts: [
          ["2 / 3 axle", "Setups"],
          ["Tipping", "Bulk and quarry work"],
          ["10–16 wks", "Typical build"],
          ["PBS", "Compatible builds"],
        ],
        points: {
          heading: (
            <>
              A tipper, on a <span className="red">semi.</span>
            </>
          ),
          note: "The same Arrow tipping body as our 4-axle dog trailer, behind a prime mover.",
          items: [
            ["2 or 3 axle", "2-axle and 3-axle setups."],
            ["Tipping", "For bulk and quarry work."],
            ["Prime mover", "Kingpin and hydraulics matched to yours."],
            ["PBS", "Compatible builds where access permits apply."],
          ],
        },
        next: { href: "/tipper-truck-bodies", name: "Tipper bodies" },
      }}
    />
  );
}
