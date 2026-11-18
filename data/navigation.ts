import type { LucideIcon } from "lucide-react";
import { ClipboardCheck, Landmark, ShoppingBag, Wrench } from "lucide-react";
import { flags } from "@/data/flags";
import { site } from "@/data/site";

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  /** Photo shown in a photo menu. */
  image?: string;
  imagePosition?: string;
  icon?: LucideIcon;
  /** Short call to action shown beside the item. */
  badge?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
  external?: boolean;
  /** `photos` lays the drop-down out as large photo tiles. */
  menu?: "photos";
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    menu: "photos",
    children: [
      {
        label: "Tipper Truck Bodies",
        href: "/tipper-truck-bodies",
        description: "4x2, 6x4, 8x4 and 10x4",
        image: "/images/builds/build-2.jpg",
        imagePosition: "60% 50%",
      },
      {
        label: "Dog Trailers",
        href: "/dog-trailers",
        description: "3-axle and 4-axle",
        image: "/images/builds/build-1.jpg",
        imagePosition: "18% 55%",
      },
      {
        label: "Semi Trailers",
        href: "/semi-trailers",
        description: "2-axle and 3-axle",
        image: "/images/builds/build-3.jpg",
        imagePosition: "70% 50%",
      },
    ],
  },
  { label: "Builds", href: "/builds" },
  {
    label: "Services",
    children: [
      {
        label: "Roadworthy Inspections",
        href: "/licensed-vehicle-testing",
        description: "VicRoads-licensed heavy vehicle testing.",
        icon: ClipboardCheck,
        badge: "Book",
      },
      {
        label: "Repairs & Servicing",
        href: "/repairs-servicing",
        description: "Workshop repairs, maintenance and modifications.",
        icon: Wrench,
      },
      {
        label: "Parts Shop",
        href: site.shop.parts,
        description: "Parts and components, online.",
        icon: ShoppingBag,
        external: true,
      },
      {
        label: "Finance",
        href: "/finance",
        description: "Finance your build through Linx Australia Group.",
        icon: Landmark,
      },
    ],
  },
  // A main part of the business, so it has its own place in the toolbar.
  { label: "Roadworthy", href: "/licensed-vehicle-testing" },
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
  ],
  services: [
    { label: "Roadworthy Inspections", href: "/licensed-vehicle-testing" },
    { label: "Repairs & Servicing", href: "/repairs-servicing" },
    { label: "Finance", href: "/finance" },
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
