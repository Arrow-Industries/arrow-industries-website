/**
 * Truck makes and models, copied from the Arrow dashboard (lib/truck-models.ts)
 * so a customer picks from the same list staff use on a quote. It is a
 * reference list: update both together when a make or model is added.
 */

export interface TruckMake {
  name: string;
  models: string[];
  /** Variants under a model, where the model alone doesn't identify the truck. */
  variants?: Record<string, string[]>;
}

/** The value that means "not in the list, let me type it". */
export const OTHER = "Other";

const MAKES_UNSORTED: TruckMake[] = [
  {
    name: "Isuzu",
    models: [
      "NLR", "NLS", "NMR", "NNR", "NPR", "NPS", "NQR",
      "FRR", "FSR", "FSD", "FTR", "FTS", "FVD", "FVL", "FVM", "FVR", "FVY", "FVZ",
      "FXY", "FXZ", "FXR", "FYH", "FYJ",
      "CXY", "CXZ", "EXY", "EXZ", "GXZ",
    ],
  },
  {
    name: "Hino",
    models: ["300 Series", "500 Series", "700 Series", "FC", "FD", "FE", "FG", "FL", "FM", "GD", "GH", "SS", "SH"],
    variants: {
      "300 Series": ["616", "716", "816", "917", "921"],
      "500 Series": ["1124", "1126", "1628", "1832", "2628", "2632", "FE 1426", "FG 1628", "FM 2628", "GH 1828"],
      "700 Series": ["2841", "2848", "SS 2848", "SH 1848", "FS 2848"],
    },
  },
  {
    name: "Fuso",
    models: ["Canter", "Fighter", "Shogun", "FV", "FN", "FS", "FP"],
    variants: {
      Canter: ["515", "615", "715", "815", "918"],
      Fighter: ["1024", "1124", "1627", "2427"],
      Shogun: ["360", "400", "455", "510"],
    },
  },
  { name: "Kenworth", models: ["K200", "K220", "T359", "T360", "T403", "T408", "T410", "T480", "T610", "T610SAR", "T659", "T909", "C509", "C510", "W900"] },
  {
    name: "Volvo",
    models: ["FE", "FL", "FM", "FMX", "FH", "FH16"],
    variants: {
      FH: ["460", "500", "540", "600", "700"],
      FH16: ["550", "600", "700", "780"],
      FM: ["380", "420", "460", "500", "540"],
      FMX: ["420", "460", "500", "540"],
      FE: ["280", "320", "350"],
      FL: ["240", "280"],
    },
  },
  {
    name: "Mercedes-Benz",
    models: ["Actros", "Arocs", "Atego", "Axor", "Econic", "Unimog"],
    variants: {
      Actros: [
        "1835", "1843", "1848", "1853",
        "2532", "2536", "2543", "2546", "2548", "2553", "2558",
        "2632", "2643", "2646", "2653", "2658", "2663",
        "3243", "3253", "3258", "3343", "3348", "3353", "3363",
        "4163",
      ],
      Arocs: ["2643", "2646", "3243", "3245", "3251", "3345", "3348", "4145", "4148"],
      Atego: ["1218", "1224", "1230", "1524", "1527", "1530", "1624", "1630"],
    },
  },
  {
    name: "Scania",
    models: ["P Series", "G Series", "R Series", "S Series", "L Series", "XT"],
    variants: {
      "P Series": ["280", "310", "360", "410", "450"],
      "G Series": ["410", "450", "460", "500", "540"],
      "R Series": ["450", "500", "540", "560", "590", "620", "660", "770"],
      "S Series": ["500", "540", "560", "590", "650", "730", "770"],
      "L Series": ["280", "320", "360"],
    },
  },
  {
    name: "DAF",
    models: ["LF", "CF", "XF", "XD", "XG", "XG+"],
    variants: {
      LF: ["230", "260", "280", "320"],
      CF: ["370", "410", "450", "530"],
      XF: ["450", "480", "530"],
      XD: ["450", "480"],
      XG: ["480", "530"],
    },
  },
  {
    name: "MAN",
    models: ["TGL", "TGM", "TGS", "TGX", "TGE"],
    variants: {
      TGL: ["12.220", "12.250"],
      TGM: ["18.290", "18.320", "26.290", "26.320"],
      TGS: ["26.480", "26.540", "33.480", "35.480"],
      TGX: ["26.540", "26.580", "26.640", "33.540", "33.640"],
    },
  },
  { name: "Iveco", models: ["Acco", "Daily", "Eurocargo", "Stralis", "S-Way", "X-Way", "Trakker", "Powerstar"] },
  {
    name: "UD",
    models: ["Kuzer", "Croner", "Condor", "Quon", "PK", "CW", "GW"],
    variants: {
      Kuzer: ["RK150", "RK280"],
      Croner: ["MK 11 250", "PK 17 280", "LK 11 250"],
      Quon: ["CD 25 360", "CG 32 420", "CW 26 420", "GW 26 460", "GK 17 420"],
    },
  },
  { name: "Mack", models: ["Anthem", "Granite", "Metro-Liner", "Superliner", "Trident", "Titan", "Vision"] },
  { name: "Western Star", models: ["47X", "48X", "49X", "4700", "4800", "4900", "5800", "6900"] },
  { name: "Freightliner", models: ["Argosy", "Cascadia", "Coronado", "Century Class", "Columbia"] },
  { name: "International", models: ["ProStar", "HX", "MV", "eMV", "9870"] },
  { name: "Hyundai", models: ["Mighty", "Pavise", "Xcient"] },
  { name: "Sitrak", models: ["C7H", "G7", "T5G", "T7H"] },
  { name: "Foton", models: ["Aumark", "Auman", "Tunland"] },
  { name: "JAC", models: ["N55", "N75", "N90"] },
  { name: "Dennis Eagle", models: ["Elite"] },
];

export const TRUCK_MAKES: TruckMake[] = [...MAKES_UNSORTED].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const modelsFor = (make: string): string[] =>
  TRUCK_MAKES.find((m) => m.name === make)?.models ?? [];

export const variantsFor = (make: string, model: string): string[] =>
  TRUCK_MAKES.find((m) => m.name === make)?.variants?.[model] ?? [];
