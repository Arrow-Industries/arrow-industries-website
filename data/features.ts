import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Hammer,
  Settings2,
  HeartHandshake,
  Factory,
} from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyChooseArrow: Feature[] = [
  {
    title: "Built for durability",
    description:
      "Designed for Australian conditions — heavy gauge steel, reinforced cross-members and welds you can rely on.",
    icon: ShieldCheck,
  },
  {
    title: "Long service life",
    description:
      "Wear-rated plate and reinforced cross-members built to handle abrasion, impact and high-cycle work — year after year.",
    icon: Hammer,
  },
  {
    title: "Custom manufacturing",
    description:
      "Configured, sized and finished to suit your operation — built to spec, not off a catalogue.",
    icon: Settings2,
  },
  {
    title: "After-sales support",
    description:
      "Repairs and modifications handled by the same team that built your unit.",
    icon: HeartHandshake,
  },
  {
    title: "Workshop capability",
    description:
      "25+ years of fabrication, hydraulic and trailer experience under one roof.",
    icon: Factory,
  },
];
