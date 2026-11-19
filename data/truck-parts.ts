import { media, type Photo } from "@/data/media";

/** One tappable point on a photo. `x` and `y` are percentages across the photo. */
export interface TruckPart {
  title: string;
  body: string;
  x: number;
  y: number;
}

export interface TruckWalk {
  photo: Photo;
  width: number;
  height: number;
  parts: TruckPart[];
}

export const tipperWalk: TruckWalk = {
  photo: media.tipperGraphiteRear,
  width: 1440,
  height: 1060,
  parts: [
    { title: "Tarp system", body: "Manual or electric.", x: 35, y: 29 },
    { title: "Side sheets", body: "Pressed for stiffness and dent resistance.", x: 41, y: 46 },
    { title: "Paint", body: "2-pack, in any colour code you specify.", x: 72, y: 40 },
    { title: "Lighting", body: "Lighting and electrical, installed as one system.", x: 57, y: 56.5 },
    { title: "Tailgate", body: "Designed for real unloading conditions.", x: 85, y: 41 },
    { title: "Tow coupling", body: "Full truck and trailer connection setups where required.", x: 93, y: 76 },
  ],
};

export const dogWalk: TruckWalk = {
  photo: {
    src: "/images/site/dog-trailer-tap-v1.jpg",
    alt: "Graphite Arrow dog trailer showing its tarp, drawbar and running gear",
  },
  width: 1285,
  height: 1082,
  parts: [
    { title: "Tarp system", body: "Manual or electric.", x: 28.4, y: 24.2 },
    { title: "Access steps", body: "Access steps and practical operator features.", x: 14.4, y: 44.2 },
    { title: "Paint", body: "2-pack paint to your colour.", x: 50.6, y: 48 },
    { title: "Lighting", body: "LED lighting and safety systems.", x: 70.4, y: 61 },
    { title: "Spray suppression", body: "Spray suppression systems.", x: 43.6, y: 71.2 },
    { title: "Spreader chains", body: "Fitted to suit the drawbar.", x: 19.5, y: 74.9 },
    { title: "Drawbar", body: "Heavy-duty drawbars and tow connections.", x: 6.5, y: 83.6 },
  ],
};
