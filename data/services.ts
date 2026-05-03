import type { LucideIcon } from "lucide-react";
import {
  Truck,
  Container,
  Construction,
  Wrench,
  ClipboardCheck,
  Cog,
} from "lucide-react";
import { site } from "@/data/site";

export interface Service {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  image: string;
  category: "product" | "service" | "parts";
  external?: boolean;
  ctaLabel?: string;
}

export const services: Service[] = [
  {
    slug: "tipper-truck-bodies",
    href: "/tipper-truck-bodies",
    title: "Tipper Truck Bodies",
    shortTitle: "Tipper Bodies",
    tagline: "Built for demanding payloads, day in, day out.",
    description:
      "Custom tipper bodies engineered to suit your chassis, payload and application — designed for civil, quarry, haulage and waste operations.",
    icon: Truck,
    image: "/images/placeholders/service.svg",
    category: "product",
    ctaLabel: "View Builds →",
  },
  {
    slug: "dog-trailers",
    href: "/dog-trailers",
    title: "Dog Trailers",
    shortTitle: "Dog Trailers",
    tagline: "Built for balance, stability and consistent haulage.",
    description:
      "Dog trailers matched to your tipper for legal payload, control and durability — built and tested in-house.",
    icon: Container,
    image: "/images/placeholders/service.svg",
    category: "product",
    ctaLabel: "View Builds →",
  },
  {
    slug: "semi-trailers",
    href: "/semi-trailers",
    title: "Semi Trailers",
    shortTitle: "Semi Trailers",
    tagline: "ADR-compliant builds designed for long-term use.",
    description:
      "Tipping and flat-deck semi trailers built to ADR and VicRoads standards — focused on strength, efficiency and long-term use.",
    icon: Construction,
    image: "/images/placeholders/service.svg",
    category: "product",
    ctaLabel: "View Builds →",
  },
  {
    slug: "repairs-servicing",
    href: "/repairs-servicing",
    title: "Repairs & Servicing",
    shortTitle: "Repairs & Servicing",
    tagline: "Keeping your fleet operating reliably.",
    description:
      "Repairs, modifications, hydraulics and structural work for tipper bodies and trailers — keeping your equipment operating reliably.",
    icon: Wrench,
    image: "/images/placeholders/service.svg",
    category: "service",
    ctaLabel: "View Services →",
  },
  {
    slug: "licensed-vehicle-testing",
    href: "/licensed-vehicle-testing",
    title: "Licensed Vehicle Testing",
    shortTitle: "LVT / Roadworthy",
    tagline: "VicRoads-compliant inspections and certification.",
    description:
      "Licensed testing for heavy and light vehicles — roadworthy inspections and certificates issued in-house.",
    icon: ClipboardCheck,
    image: "/images/placeholders/service.svg",
    category: "service",
    ctaLabel: "Book Inspection →",
  },
  {
    slug: "parts-components",
    href: site.shop.parts,
    title: "Parts & Components",
    shortTitle: "Parts & Components",
    tagline: "Reliable components to support uptime and maintenance.",
    description:
      "Access components, hydraulics and fittings used across our builds — available through our online store.",
    icon: Cog,
    image: "/images/placeholders/service.svg",
    category: "parts",
    external: true,
    ctaLabel: "Shop Parts →",
  },
];

export const getServiceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);
