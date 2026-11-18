import { flags } from "@/data/flags";
import { media } from "@/data/media";
import { site } from "@/data/site";

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /** Photo shown in a photo menu. */
  image?: string;
  imagePosition?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
  /** Plain links shown beside the photos in a photo menu. */
  links?: NavChild[];
  external?: boolean;
  /** `photos` lays the drop-down out as large photo tiles. */
  menu?: "photos";
}

export const primaryNav: NavItem[] = [
  {
    label: "Build",
    menu: "photos",
    children: [
      {
        label: "Tipper Bodies",
        href: "/tipper-truck-bodies",
        description: "4x2, 6x4, 8x4 and 10x4",
        image: media.tipperGraphiteRear.src,
        imagePosition: "62% 50%",
      },
      {
        label: "Dog Trailers",
        href: "/dog-trailers",
        description: "3-axle and 4-axle",
        image: media.dogSide.src,
        imagePosition: "30% 55%",
      },
      {
        label: "Semi Trailers",
        href: "/semi-trailers",
        description: "2-axle and 3-axle",
        image: media.bodyPainted.src,
        imagePosition: "45% 50%",
      },
    ],
    links: [
      { label: "Configure your build", href: "/configure" },
      { label: "Recent builds", href: "/builds" },
      { label: "Finance", href: "/finance" },
      { label: "Request a quote", href: "/request-a-quote" },
    ],
  },
  {
    label: "Roadworthy",
    children: [
      {
        label: "Book an inspection",
        href: "/licensed-vehicle-testing#book",
        description: "Pick a day and we'll confirm your time.",
      },
      {
        label: "What we inspect",
        href: "/licensed-vehicle-testing#inspect",
        description: "Trucks, trailers and fleets.",
      },
      {
        label: "How it works",
        href: "/licensed-vehicle-testing#how",
        description: "Four steps, start to finish.",
      },
      {
        label: "Common questions",
        href: "/licensed-vehicle-testing#faq",
        description: "Timing, cost and what happens next.",
      },
    ],
  },
  {
    label: "Repairs",
    children: [
      {
        label: "Repairs & servicing",
        href: "/repairs-servicing",
        description: "Bodies, trailers and heavy vehicle components.",
      },
      {
        label: "What we repair",
        href: "/repairs-servicing#overview",
        description: "From tailgates to hydraulics.",
      },
      {
        label: "Insurance & fleet work",
        href: "/repairs-servicing#services",
        description: "Service options for every job.",
      },
      {
        label: "Common questions",
        href: "/repairs-servicing#faq",
        description: "Lead times, insurers and more.",
      },
    ],
  },
  // The online store, which lives on its own site.
  { label: "Shop", href: site.shop.parts, external: true },
  {
    label: "Company",
    children: [
      { label: "About", href: "/about", description: "The people behind Arrow." },
      { label: "Careers", href: "/careers", description: "Join the workshop." },
      { label: "Contact", href: "/contact", description: "Call, email or visit us." },
    ],
  },
];

export const footerLinks = {
  products: [
    { label: "Tipper Truck Bodies", href: "/tipper-truck-bodies" },
    { label: "Dog Trailers", href: "/dog-trailers" },
    { label: "Semi Trailers", href: "/semi-trailers" },
    { label: "Builds", href: "/builds" },
    { label: "Configure your build", href: "/configure" },
    { label: "Finance", href: "/finance" },
  ],
  services: [
    { label: "Roadworthy Inspections", href: "/licensed-vehicle-testing" },
    { label: "Repairs & Servicing", href: "/repairs-servicing" },
    { label: "Shop", href: site.shop.parts },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Request a quote", href: "/request-a-quote" },
    { label: "Contact", href: "/contact" },
    ...(flags.warrantyPublished ? [{ label: "Warranty", href: "/warranty" }] : []),
    // Served by the dashboard, proxied onto this domain — see next.config.
    // Beside the terms on purpose: a trade customer reading what the account
    // is subject to is the one most likely to want one.
    { label: "Apply for a credit account", href: "/credit" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
};
