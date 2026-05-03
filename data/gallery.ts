export type GalleryCategory =
  | "All"
  | "Tipper"
  | "Dog Trailer"
  | "Semi Trailer"
  | "Repair";

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "All">;
  description: string;
  image: string;
  aspect: "portrait" | "landscape" | "square";
}

export const galleryCategories: GalleryCategory[] = [
  "All",
  "Tipper",
  "Dog Trailer",
  "Semi Trailer",
  "Repair",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "tipper-civil-01",
    title: "Civil tipper — Q&T 450 floor",
    category: "Tipper",
    description: "Heavy-duty civil tipper built for site cycles in Melbourne's north.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
  {
    id: "dog-quad-01",
    title: "Quad-axle dog trailer",
    category: "Dog Trailer",
    description: "Quad-axle dog trailer paired to a Kenworth tipper for a quarry operator.",
    image: "/images/placeholders/service.svg",
    aspect: "portrait",
  },
  {
    id: "semi-tipping-01",
    title: "Tipping semi trailer",
    category: "Semi Trailer",
    description: "Tipping semi-trailer built for inter-regional aggregate haulage.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
  {
    id: "repair-hoist-01",
    title: "Hoist repair & re-seal",
    category: "Repair",
    description: "Twin-ram hoist rebuild for a 12-year-old tipper. Back on the road in a week.",
    image: "/images/placeholders/service.svg",
    aspect: "square",
  },
  {
    id: "tipper-quarry-01",
    title: "Quarry tipper — abrasion-rated",
    category: "Tipper",
    description: "Abrasion-rated body for high-density quarry loads.",
    image: "/images/placeholders/service.svg",
    aspect: "portrait",
  },
  {
    id: "dog-tri-01",
    title: "Tri-axle dog — bulk haulage",
    category: "Dog Trailer",
    description: "Tri-axle dog with air suspension for long-distance bulk runs.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
  {
    id: "semi-flatdeck-01",
    title: "Flat-deck semi",
    category: "Semi Trailer",
    description: "PBS-aware flat-deck semi with WABCO EBS braking.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
  {
    id: "repair-tailgate-01",
    title: "Tailgate rebuild",
    category: "Repair",
    description: "Tailgate rebuilt and re-skinned after a rear-impact collision.",
    image: "/images/placeholders/service.svg",
    aspect: "square",
  },
  {
    id: "tipper-waste-01",
    title: "Sealed waste-spec tipper",
    category: "Tipper",
    description: "Sealed-tailgate body for a metropolitan waste operator.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
];
