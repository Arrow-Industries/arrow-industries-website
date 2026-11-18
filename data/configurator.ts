export type ProductId = "tipper" | "dog" | "semi";

export interface ConfigProduct {
  id: ProductId;
  label: string;
  /** Must match an enquiry type on the quote form. */
  enquiry: string;
  setupLabel: string;
  setups: string[];
  defaultSetup: string;
  styles?: string[];
  options: string[];
}

export const configProducts: ConfigProduct[] = [
  {
    id: "tipper",
    label: "Tipper body",
    enquiry: "Tipper Truck Body",
    setupLabel: "Chassis",
    setups: ["4x2", "6x4", "8x4", "10x4"],
    defaultSetup: "8x4",
    options: [
      "Tarp system",
      "Toolbox setup",
      "Water tank",
      "Tow coupling",
      "LED lighting",
      "Camera and safety systems",
    ],
  },
  {
    id: "dog",
    label: "Dog trailer",
    enquiry: "Dog Trailer",
    setupLabel: "Axles",
    setups: ["3-axle", "4-axle"],
    defaultSetup: "4-axle",
    options: [
      "2-way tailgate",
      "Tarp system",
      "Spreader chains",
      "Spray suppression",
      "LED lighting",
      "Access steps",
    ],
  },
  {
    id: "semi",
    label: "Semi trailer",
    enquiry: "Semi Trailer",
    setupLabel: "Axles",
    setups: ["2-axle", "3-axle"],
    defaultSetup: "3-axle",
    styles: ["Tipping", "Flat-deck"],
    options: [
      "2-way tailgate",
      "Tarp system",
      "Spray suppression",
      "LED lighting",
      "Access steps",
    ],
  },
];

export const configWork = [
  "Civil",
  "Quarry",
  "Demolition",
  "Construction",
  "Bulk haulage",
  "Waste",
  "Fleet",
];

export const configColours = [
  { name: "White", value: "#eeeeea" },
  { name: "Graphite", value: "#454a50" },
  { name: "Black", value: "#1d1e20" },
  { name: "Arrow red", value: "#c5140e" },
  { name: "Deep blue", value: "#204f8e" },
  { name: "Safety yellow", value: "#e6b01f" },
];
