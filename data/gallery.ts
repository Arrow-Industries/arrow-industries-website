export type GalleryCategory =
  | "All"
  | "Tipper"
  | "Dog Trailer"
  | "Semi Trailer";

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
    id: "dog-tri-01",
    title: "Tri-Axle Dog Trailer",
    category: "Dog Trailer",
    description: "Tri-Axle dog trailer paired to a tipper for general bulk haulage.",
    image: "/images/placeholders/service.svg",
    aspect: "portrait",
  },
  {
    id: "dog-tri-super-01",
    title: "Tri-Axle Super Dog-Trailer",
    category: "Dog Trailer",
    description: "Tri-Axle super dog-trailer for maximum legal payload under PBS access.",
    image: "/images/placeholders/service.svg",
    aspect: "portrait",
  },
  {
    id: "dog-quad-01",
    title: "Quad-Axle Dog Trailer",
    category: "Dog Trailer",
    description: "Quad-Axle dog trailer paired to a Kenworth tipper for a quarry operator.",
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
    id: "tipper-quarry-01",
    title: "Quarry tipper — abrasion-rated",
    category: "Tipper",
    description: "Abrasion-rated body for high-density quarry loads.",
    image: "/images/placeholders/service.svg",
    aspect: "portrait",
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
    id: "tipper-waste-01",
    title: "Sealed waste-spec tipper",
    category: "Tipper",
    description: "Sealed-tailgate body for a metropolitan waste operator.",
    image: "/images/placeholders/service.svg",
    aspect: "landscape",
  },
];
