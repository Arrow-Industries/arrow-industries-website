/**
 * Turns a customer's selections into something that can be drawn.
 *
 * The options themselves are edited in the dashboard, so nothing here knows
 * their ids. Each selection is recognised by the name of its group and option,
 * and anything not recognised still gets a marker on the drawing, in the part
 * of the vehicle its section belongs to. A new option added in the dashboard
 * therefore always shows up, even before it has a picture of its own.
 */

export type ProductId = "tipper" | "dog" | "semi";

/** One selected option, as the drawing needs it. */
export interface Pick {
  id: string;
  group: string;
  name: string;
  section: string;
  swatch?: string;
  /** What the customer typed, for a "Custom" option. */
  value?: string;
}

export type GlyphKind =
  | "camera"
  | "screen"
  | "beacon"
  | "strobe"
  | "roofbar"
  | "aerial"
  | "sounder"
  | "estop"
  | "switch"
  | "box"
  | "socket"
  | "sensor"
  | "gauge"
  | "battery"
  | "lamp"
  | "wire"
  | "dot";

/** Where on the vehicle a small fitting sits. */
export type Anchor =
  | "dash"
  | "roof"
  | "mirror"
  | "cabFront"
  | "underCab"
  | "gap"
  | "frontTop"
  | "side"
  | "rearTop"
  | "rearLow"
  | "cross"
  | "guard"
  | "tow"
  | "susp"
  | "top";

export interface Glyph {
  /** Unique on the drawing. */
  id: string;
  optionId: string;
  kind: GlyphKind;
  anchor: Anchor;
  aim?: "back" | "fwd" | "down";
  big?: boolean;
  /** For a wire: where it runs to. */
  to?: "tarp" | "susp" | "rear";
}

export type CouplingKind = "tri" | "duo" | "tap";

export interface BuildVisual {
  product: ProductId;
  /** "8x4", "3-axle" and so on. */
  setup: string;
  longWheelbase: boolean;
  /** Millimetres. Null until the customer has chosen one. */
  length: number | null;
  height: number | null;
  width: number | null;
  wall: number | null;
  floor: number | null;
  subframe: number;
  material: "steel" | "aluminium";
  hoist: "front" | "well" | null;
  /** Null means "match the cab". */
  bodyColour: string | null;
  customColour: boolean;
  metallic: boolean;
  /** Null means "match the chassis". */
  subframeColour: string | null;
  tarp: { type: "bow" | "pullout"; electric: boolean | null; colour: string } | null;
  lights: number;
  steps: number;
  mudflaps: 0 | 2 | 4;
  pto: "truck" | "trailer" | null;
  ptoExisting: boolean;
  tank: "partition" | "rear" | "side" | null;
  couplings: CouplingKind[];
  crossMember: string | null;
  tow: "drawbar" | "pintle" | "ball" | null;
  controls: "dash" | "remote" | null;
  flags: Set<string>;
  glyphs: Glyph[];
  /** For each selected option: the part of the drawing that shows it. */
  where: Record<string, string>;
}

const num = (s: string) => {
  const m = s.match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

/** A length or height in millimetres, from "5600mm", "5.6m" or a typed "5600". */
function millimetres(pick: Pick): number | null {
  const n = num(pick.value?.trim() || pick.name);
  if (n === null) return null;
  return n < 50 ? Math.round(n * 1000) : n;
}

export const setupOf = (typeName: string) => {
  const drive = typeName.match(/(\d+)\s*x\s*(\d+)/i);
  if (drive) return `${drive[1]}x${drive[2]}`;
  const axles = typeName.match(/(\d)\s*-?\s*axle/i);
  return axles ? `${axles[1]}-axle` : typeName.toLowerCase();
};

export const productOf = (categoryName: string): ProductId =>
  /dog/i.test(categoryName) ? "dog" : /semi/i.test(categoryName) ? "semi" : "tipper";

/** Fittings drawn as part of the body itself. */
const FLAGS: [RegExp, string][] = [
  [/splash guard/i, "guards"],
  [/tail ?gate/i, "tailgate"],
  [/grain lock/i, "grainLocks"],
  [/push lug/i, "pushLug"],
  [/shovel/i, "shovel"],
  [/spray suppress/i, "spray"],
  [/chrome/i, "chrome"],
  [/finger guard/i, "fingerGuards"],
  [/camera box/i, "cameraBox"],
  [/grain door/i, "grainDoor"],
  [/slide.?out ladder/i, "slideLadder"],
  [/drop.?down ladder|ladder/i, "dropLadder"],
  [/tool ?box/i, "toolbox"],
  [/chequer|checker/i, "chequer"],
  [/water tank/i, "waterTank"],
  [/vass|engineer/i, "vass"],
  [/pto programming/i, "ptoProg"],
  [/hydraulics? extended/i, "extHyd"],
  [/electrical extended/i, "extElec"],
  [/ebs extended/i, "extEbs"],
];

type GlyphRule = [RegExp, Omit<Glyph, "id" | "optionId">[]];

const cam = (anchor: Anchor, aim: Glyph["aim"]): Omit<Glyph, "id" | "optionId"> => ({
  kind: "camera",
  anchor,
  aim,
});

/** Electrical and safety fittings, each drawn as a small part where it is fitted. */
const GLYPHS: GlyphRule[] = [
  [/9".*monitor.*3 cameras/i, [{ kind: "screen", anchor: "dash", big: true }, cam("rearTop", "back"), cam("frontTop", "back"), { kind: "socket", anchor: "cross" }]],
  [/monitor.*3 cameras/i, [{ kind: "screen", anchor: "dash" }, cam("rearTop", "back"), cam("frontTop", "back"), { kind: "socket", anchor: "cross" }]],
  [/monitor/i, [{ kind: "screen", anchor: "dash" }, cam("rearTop", "back")]],
  [/blind spot/i, [cam("cabFront", "down")]],
  [/side camera/i, [cam("mirror", "back")]],
  [/trailer camera.*2/i, [{ kind: "socket", anchor: "cross" }, cam("rearTop", "back"), cam("side", "down")]],
  [/trailer camera/i, [{ kind: "socket", anchor: "cross" }, cam("rearTop", "back")]],
  [/camera/i, [cam("rearTop", "back")]],
  [/trailer wire-?up/i, [{ kind: "wire", anchor: "top", to: "rear" }, { kind: "socket", anchor: "cross" }]],
  [/truck set-?up.*truck and trailer/i, [{ kind: "wire", anchor: "top", to: "tarp" }, { kind: "socket", anchor: "cross" }]],
  [/truck set-?up.*trailer only/i, [{ kind: "wire", anchor: "top", to: "rear" }, { kind: "socket", anchor: "cross" }]],
  [/truck set-?up|tarp wiring/i, [{ kind: "wire", anchor: "top", to: "tarp" }]],
  [/body-?up kit/i, [{ kind: "lamp", anchor: "dash" }, { kind: "sensor", anchor: "gap" }]],
  [/body-?up alarm.*anderson/i, [{ kind: "sounder", anchor: "gap" }, { kind: "socket", anchor: "cross" }]],
  [/body-?up alarm/i, [{ kind: "sounder", anchor: "gap" }]],
  [/emergency stop|e-?stop/i, [{ kind: "estop", anchor: "dash" }, { kind: "estop", anchor: "side" }]],
  [/isolation/i, [{ kind: "switch", anchor: "underCab" }]],
  [/park brake/i, [{ kind: "sounder", anchor: "dash" }]],
  [/left-?hand audible/i, [{ kind: "sounder", anchor: "cabFront" }]],
  [/squawker|revers/i, [{ kind: "sounder", anchor: "rearLow" }]],
  [/brake control/i, [{ kind: "box", anchor: "dash" }]],
  [/beacon/i, [{ kind: "beacon", anchor: "roof" }, { kind: "switch", anchor: "dash" }]],
  [/roof bar/i, [{ kind: "roofbar", anchor: "roof" }]],
  [/strobe/i, [{ kind: "strobe", anchor: "guard" }]],
  [/uhf|aerial/i, [{ kind: "aerial", anchor: "roof" }]],
  [/control switches|dash switch/i, [{ kind: "switch", anchor: "dash" }]],
  [/abs|5-?pin|plug/i, [{ kind: "socket", anchor: "cross" }]],
  [/draw ?bar sensor/i, [{ kind: "sensor", anchor: "tow" }]],
  [/load scale/i, [{ kind: "gauge", anchor: "susp" }, { kind: "screen", anchor: "dash" }]],
  [/scale wire/i, [{ kind: "wire", anchor: "top", to: "susp" }, { kind: "gauge", anchor: "susp" }]],
  [/battery relocation.*full/i, [{ kind: "battery", anchor: "susp" }]],
  [/battery/i, [{ kind: "battery", anchor: "underCab" }]],
  [/alarm/i, [{ kind: "sounder", anchor: "rearLow" }]],
  [/light|lamp/i, [{ kind: "strobe", anchor: "guard" }]],
];

/** Where an option with no picture of its own is marked. */
const ZONE: Record<string, Anchor> = {
  body: "side",
  features: "side",
  hydraulics: "gap",
  towing: "cross",
  running_gear: "susp",
  electrical: "dash",
  electrical_optional: "dash",
  tarp: "frontTop",
  paint: "side",
  safety: "side",
  other: "side",
};

export function buildVisual(product: ProductId, typeName: string, picks: Pick[]): BuildVisual {
  const v: BuildVisual = {
    product,
    setup: setupOf(typeName),
    longWheelbase: /long/i.test(typeName),
    length: null,
    height: null,
    width: null,
    wall: null,
    floor: null,
    subframe: 150,
    material: "steel",
    hoist: null,
    bodyColour: null,
    customColour: false,
    metallic: false,
    subframeColour: null,
    tarp: null,
    lights: 0,
    steps: 0,
    mudflaps: 0,
    pto: null,
    ptoExisting: false,
    tank: null,
    couplings: [],
    crossMember: null,
    tow: null,
    controls: null,
    flags: new Set(),
    glyphs: [],
    where: {},
  };

  let tarpType: "bow" | "pullout" | null = null;
  let tarpElectric: boolean | null = null;
  let tarpColour = "#121416";
  let tarpTouched = false;

  for (const p of picks) {
    const g = p.group.trim();
    const at = (key: string) => {
      v.where[p.id] = key;
    };

    if (/length/i.test(g)) {
      v.length = millimetres(p);
      at("length");
    } else if (/subframe height/i.test(g)) {
      v.subframe = num(p.name) ?? 150;
      at("subframe");
    } else if (/top plate/i.test(g)) {
      at("subframe");
    } else if (/height/i.test(g)) {
      v.height = millimetres(p);
      at("height");
    } else if (/material/i.test(g)) {
      v.material = /alumin/i.test(p.name) ? "aluminium" : "steel";
      at("material");
    } else if (/floor/i.test(g)) {
      v.floor = num(p.name);
      at("floor");
    } else if (/wall|side.*thickness/i.test(g)) {
      v.wall = num(p.name);
      at("wall");
    } else if (/width/i.test(g)) {
      v.width = num(p.name);
      at("width");
    } else if (/^hoist$/i.test(g) || /hoist mount/i.test(g)) {
      v.hoist = /front/i.test(p.name) ? "front" : "well";
      at("hoist");
    } else if (/step/i.test(g)) {
      v.steps = /three|3/i.test(p.name) ? 3 : 2;
      at("steps");
    } else if (/clearance light/i.test(g)) {
      v.lights = num(p.name) ?? 5;
      at("lights");
    } else if (/pto.*fitment/i.test(g)) {
      v.pto = /trailer/i.test(p.name) ? "trailer" : "truck";
      at("pto");
    } else if (/pto.*supply/i.test(g)) {
      v.ptoExisting = /existing pto/i.test(p.name);
      if (!v.pto) v.pto = "truck";
      at("pto");
    } else if (/hydraulic tank/i.test(g)) {
      v.tank = /partition/i.test(p.name) ? "partition" : /rear/i.test(p.name) ? "rear" : "side";
      at("tank");
    } else if (/hydraulic coupling/i.test(g)) {
      const kind = (s: string): CouplingKind => (/tap/i.test(s) ? "tap" : /duo/i.test(s) ? "duo" : "tri");
      v.couplings = /both/i.test(p.name) ? [kind(p.name), kind(p.name)] : p.name.split("+").map(kind).slice(0, 2);
      at("couplings");
    } else if (/cross member/i.test(g)) {
      v.crossMember = p.name;
      at("cross");
    } else if (/tow coupling|^coupling/i.test(g)) {
      v.tow = /pintle/i.test(p.name) ? "pintle" : /ball/i.test(p.name) ? "ball" : "drawbar";
      at("tow");
    } else if (/^controls?$/i.test(g)) {
      v.controls = /remote/i.test(p.name) ? "remote" : "dash";
      at("controls");
    } else if (/tarp type/i.test(g)) {
      tarpType = /pull/i.test(p.name) ? "pullout" : "bow";
      tarpTouched = true;
      at("tarp");
    } else if (/tarp operation/i.test(g)) {
      tarpElectric = /electric/i.test(p.name);
      tarpTouched = true;
      at("tarpDrive");
    } else if (/tarp colou?r/i.test(g)) {
      tarpColour = p.swatch ?? tarpColour;
      tarpTouched = true;
      at("tarp");
    } else if (/mudflap/i.test(g)) {
      v.mudflaps = /4|wrap/i.test(p.name) ? 4 : 2;
      at("mudflaps");
    } else if (/^paint$/i.test(g) || /paint type|finish/i.test(g)) {
      v.metallic = /metallic|pearl/i.test(p.name);
      at("colour");
    } else if (/subframe colou?r/i.test(g)) {
      v.subframeColour = p.swatch ?? null;
      at("subframe");
    } else if (/colou?r/i.test(g)) {
      v.bodyColour = p.swatch ?? null;
      v.customColour = !p.swatch && /custom/i.test(p.name);
      at("colour");
    } else {
      const flag = FLAGS.find(([test]) => test.test(p.name))?.[1];
      if (flag) {
        v.flags.add(flag);
        at(`flag:${flag}`);
        continue;
      }
      const rule = GLYPHS.find(([test]) => test.test(`${g} ${p.name}`));
      const parts = rule?.[1] ?? [{ kind: "dot" as const, anchor: ZONE[p.section] ?? "side" }];
      parts.forEach((part, i) => v.glyphs.push({ ...part, id: `${p.id}:${i}`, optionId: p.id }));
      at(`glyph:${p.id}:0`);
    }
  }

  // A tarp is only drawn once a type is chosen; its drive and colour follow it.
  if (tarpType || (tarpTouched && tarpElectric !== null)) {
    v.tarp = { type: tarpType ?? "bow", electric: tarpElectric, colour: tarpColour };
  }
  // Trailer connections imply somewhere to connect them.
  if (v.couplings.length && !v.crossMember) v.crossMember = "";

  return v;
}
