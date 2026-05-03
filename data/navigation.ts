import { site } from "@/data/site";

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
  external?: boolean;
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Products",
    children: [
      {
        label: "Tipper Truck Bodies",
        href: "/tipper-truck-bodies",
        description: "Custom-built tipper bodies in Q&T 450 steel.",
      },
      {
        label: "Dog Trailers",
        href: "/dog-trailers",
        description: "Heavy-duty dog trailers engineered for payload.",
      },
      {
        label: "Semi Trailers",
        href: "/semi-trailers",
        description: "Purpose-built semi trailers for Australian roads.",
      },
    ],
  },
  {
    label: "Services",
    children: [
      {
        label: "Licensed Vehicle Testing",
        href: "/licensed-vehicle-testing",
        description: "Book a roadworthy inspection.",
      },
      {
        label: "Repairs & Servicing",
        href: "/repairs-servicing",
        description: "Workshop repairs, maintenance and modifications.",
      },
    ],
  },
  { label: "Roadworthy", href: "/licensed-vehicle-testing" },
  { label: "Shop", href: site.shop.parts, external: true },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  products: [
    { label: "Tipper Truck Bodies", href: "/tipper-truck-bodies" },
    { label: "Dog Trailers", href: "/dog-trailers" },
    { label: "Semi Trailers", href: "/semi-trailers" },
  ],
  services: [
    { label: "Repairs & Servicing", href: "/repairs-servicing" },
    { label: "Licensed Vehicle Testing", href: "/licensed-vehicle-testing" },
    { label: "Custom Manufacturing", href: "/repairs-servicing" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Request a Quote", href: "/request-a-quote" },
    { label: "Contact", href: "/contact" },
    { label: "Warranty", href: "/warranty" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
  ],
};
