import type { ReactNode } from "react";
import { RealCab, RealDefs, RealFuelTank, RealStage, RealWheel } from "@/components/BuildDrawingReal";
import type { Anchor, BuildVisual, Glyph } from "@/lib/build-visual";

/**
 * A side elevation of the build, drawn to scale: one unit is ten millimetres.
 *
 * Everything on it comes from the customer's selections, so a change to the
 * build is a change to the drawing: the body grows with its length and height,
 * the axles follow the chassis type, and each fitting is drawn where it goes.
 */

interface BuildDrawingProps {
  visual: BuildVisual;
  /** Millimetres. Drawn when no length has been chosen yet. */
  fallbackLength: number;
  /** Millimetres. The longest body this chassis type offers, so the frame fits them all. */
  maxLength: number;
  /** The customer's truck, written under the cab. */
  truckName?: string;
  /** The part to point out, after a change. */
  spot?: { key: string; n: number } | null;
  /** Draw it as a lit studio model rather than a line drawing. */
  real?: boolean;
  className?: string;
}

const G = 400; // ground
const CH_TOP = G - 105;
const CH_BOT = G - 85;
const R = 52; // wheel radius
const CAB = "#eceae5";
const DARK = "#26282c";
const METAL = "#c8c6c0";

/** A group that slides to its place when the build changes. */
function At({ x = 0, y = 0, children }: { x?: number; y?: number; children: ReactNode }) {
  return (
    <g className="bd-move" style={{ transform: `translate(${x}px, ${y}px)` }}>
      {children}
    </g>
  );
}

/** A rectangle whose size and place ease to their new values. */
function Box({
  x,
  y,
  w,
  h,
  rx,
  className = "bd-s",
  ...rest
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  className?: string;
} & Omit<React.SVGProps<SVGRectElement>, "x" | "y" | "width" | "height" | "rx">) {
  return (
    <rect
      x={x}
      y={y}
      width={Math.max(0, w)}
      height={Math.max(0, h)}
      rx={rx}
      className={`bd-geo ${className}`}
      style={{ x, y, width: Math.max(0, w), height: Math.max(0, h) }}
      {...rest}
    />
  );
}

/** A part that eases in when it is added. */
const Pop = ({ children }: { children: ReactNode }) => <g className="bd-in">{children}</g>;

/** Server and browser must print the same number. */
const round = (n: number) => Math.round(n * 100) / 100;

function luminance(hex: string) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.replace(/./g, "$&$&") : m;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function Wheel({ x }: { x: number }) {
  const studs = Array.from({ length: 10 }, (_, i) => (i * Math.PI) / 5);
  return (
    <At x={x} y={G - R}>
      <circle r={R} fill="#1a1b1d" className="bd-s" />
      <circle r={R - 9} fill="none" stroke="#2c2e32" strokeWidth="5" />
      <circle r={30} fill="url(#bd-rim)" className="bd-s" />
      <circle r={21} fill="none" stroke="rgb(19 20 22 / .35)" strokeWidth="1" />
      {studs.map((a) => (
        <circle key={a} cx={round(Math.cos(a) * 15.5)} cy={round(Math.sin(a) * 15.5)} r="1.8" fill="#55585e" />
      ))}
      <circle r={9} fill="#3a3d42" className="bd-s" />
    </At>
  );
}

function Cab({ dash }: { dash?: ReactNode }) {
  return (
    <g>
      <rect x={-2} y={G - 72} width={82} height={34} rx={5} fill="#2c2e32" className="bd-s" />
      <path
        d={`M4 ${G - 70} L4 ${G - 188} Q5 ${G - 204} 12 ${G - 216} L32 ${G - 286} Q36 ${G - 297} 50 ${G - 297} L210 ${G - 297} Q222 ${G - 297} 222 ${G - 285} L222 ${G - 70} L197 ${G - 70} A60 60 0 0 0 83 ${G - 70} Z`}
        fill="url(#bd-cab)"
        className="bd-s"
      />
      {/* Glass */}
      <path d={`M14 ${G - 214} L34 ${G - 284} L46 ${G - 287} L46 ${G - 214} Z`} fill="url(#bd-glass)" className="bd-s" />
      <path
        d={`M54 ${G - 214} L54 ${G - 276} Q54 ${G - 287} 66 ${G - 287} L148 ${G - 287} L148 ${G - 214} Z`}
        fill="url(#bd-glass)"
        className="bd-s"
      />
      <rect x={158} y={G - 287} width={48} height={60} rx={5} fill="url(#bd-glass)" className="bd-s" />
      <path d={`M70 ${G - 280} L96 ${G - 280} L78 ${G - 222} L60 ${G - 222} Z`} fill="rgb(255 255 255 / .1)" />
      {/* Door, handle, step, lamps */}
      <path d={`M50 ${G - 208} L50 ${G - 122} L152 ${G - 122} L152 ${G - 208}`} fill="none" stroke="rgb(19 20 22 / .28)" strokeWidth="1.2" />
      <rect x={132} y={G - 198} width={15} height={4.5} rx={2} fill={DARK} />
      <rect x={-13} y={G - 264} width={11} height={50} rx={3.5} fill={DARK} className="bd-s" />
      <path d={`M-2 ${G - 240} L8 ${G - 240}`} className="bd-s" />
      <rect x={4} y={G - 104} width={11} height={20} rx={2.5} fill="#f6f2e4" className="bd-s" />
      <rect x={4} y={G - 80} width={11} height={6} rx={2} fill="#f0a020" />
      <rect x={44} y={G - 56} width={34} height={6} rx={2} fill="#3a3d42" />
      <path d={`M30 ${G - 292} L20 ${G - 283}`} stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      {dash}
    </g>
  );
}

const CONE = "rgb(214 20 28 / .16)";

/** A small fitting, drawn centred on its place. */
function GlyphMark({ g }: { g: Glyph }) {
  switch (g.kind) {
    case "camera": {
      const cone =
        g.aim === "down" ? "M0 4 L-16 34 L16 34 Z" : g.aim === "fwd" ? "M-6 0 L-40 -14 L-40 14 Z" : "M6 0 L40 -14 L40 14 Z";
      return (
        <g>
          <path d={cone} fill={CONE} />
          <rect x={-7} y={-5} width={14} height={10} rx={2.5} fill={DARK} className="bd-s" />
          <circle cx={g.aim === "fwd" ? -4 : g.aim === "down" ? 0 : 4} cy={g.aim === "down" ? 2 : 0} r={2.4} fill="#7fb4ff" />
        </g>
      );
    }
    case "screen": {
      const w = g.big ? 26 : 20;
      const h = g.big ? 17 : 13;
      return (
        <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2.5} fill="#0e1012" className="bd-s" />
          <rect x={-w / 2 + 2.5} y={-h / 2 + 2.5} width={w - 5} height={h - 5} rx={1} fill="#6fb0ff" opacity=".85" />
          <path d={`M0 ${h / 2} v4`} className="bd-s" />
        </g>
      );
    }
    case "beacon":
      return (
        <g>
          <circle cy={-6} r={15} fill="rgb(255 170 30 / .22)" />
          <rect x={-8} y={-2} width={16} height={4} rx={1.5} fill={DARK} />
          <path d="M-6.5 -2 Q-6.5 -13 0 -13 Q6.5 -13 6.5 -2 Z" fill="#ffab1e" className="bd-s" />
        </g>
      );
    case "strobe":
      return (
        <g>
          <circle r={11} fill="rgb(255 170 30 / .2)" />
          <rect x={-6} y={-3.5} width={12} height={7} rx={2.5} fill="#ffab1e" className="bd-s" />
        </g>
      );
    case "roofbar":
      return (
        <g>
          <path d="M-36 0 v-9 M36 0 v-9" className="bd-s" />
          <rect x={-42} y={-13} width={84} height={5} rx={2.5} fill={DARK} className="bd-s" />
          {[-30, -10, 10, 30].map((x) => (
            <circle key={x} cx={x} cy={-17} r={4.5} fill="#f6f2e4" className="bd-s" />
          ))}
        </g>
      );
    case "aerial":
      return (
        <g>
          <path d="M0 0 V-46" stroke="#131416" strokeWidth="1.4" strokeLinecap="round" />
          <rect x={-2.5} y={-8} width={5} height={8} rx={1.5} fill={DARK} />
          <circle cy={-46} r={1.8} fill="#131416" />
        </g>
      );
    case "sounder":
      return (
        <g>
          <path d="M-6 -3 H-2 L4 -8 V8 L-2 3 H-6 Z" fill={DARK} className="bd-s" />
          <path d="M8 -5 Q11 0 8 5 M12 -8 Q17 0 12 8" fill="none" stroke="#d6141c" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "estop":
      return (
        <g>
          <rect x={-7} y={-7} width={14} height={14} rx={2} fill="#f2c200" className="bd-s" />
          <circle r={4} fill="#d6141c" className="bd-s" />
        </g>
      );
    case "switch":
      return (
        <g>
          <rect x={-6} y={-5} width={12} height={10} rx={2.5} fill="#f4f3ef" className="bd-s" />
          <path d="M0 2 L3 -3" stroke="#d6141c" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "box":
      return (
        <g>
          <rect x={-8} y={-5.5} width={16} height={11} rx={2} fill={DARK} className="bd-s" />
          <circle cx={4} cy={0} r={1.6} fill="#58d68d" />
        </g>
      );
    case "socket":
      return (
        <g>
          <circle r={6.5} fill={DARK} className="bd-s" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={round(Math.cos((i * 2 * Math.PI) / 5) * 3.2)} cy={round(Math.sin((i * 2 * Math.PI) / 5) * 3.2)} r=".9" fill="#d9d6cf" />
          ))}
        </g>
      );
    case "sensor":
      return (
        <g>
          <circle r={8} fill="none" stroke="#d6141c" strokeWidth="1.2" strokeDasharray="2.5 2.5" />
          <circle r={3.4} fill="#d6141c" />
        </g>
      );
    case "gauge":
      return (
        <g>
          <circle r={8} fill="#f4f3ef" className="bd-s" />
          <path d="M0 0 L4.5 -4" stroke="#d6141c" strokeWidth="1.6" strokeLinecap="round" />
          <circle r={1.4} fill="#131416" />
        </g>
      );
    case "battery":
      return (
        <g>
          <rect x={-15} y={-9} width={30} height={18} rx={2.5} fill="#3a3d42" className="bd-s" />
          <path d="M-9 -9 v-3 h5 v3 M4 -9 v-3 h5 v3" className="bd-s" fill="none" />
          <path d="M-9 0 h5 M-6.5 -2.5 v5 M4 0 h5" stroke="#f4f3ef" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    case "lamp":
      return (
        <g>
          <circle r={8} fill="rgb(214 20 28 / .2)" />
          <circle r={3.6} fill="#d6141c" className="bd-s" />
        </g>
      );
    default:
      return (
        <g>
          <circle r={7} fill="#f4f3ef" stroke="#d6141c" strokeWidth="1.6" />
          <circle r={2.4} fill="#d6141c" />
        </g>
      );
  }
}

const TRUCK_SIDE: Anchor[] = ["dash", "roof", "mirror", "cabFront", "underCab", "gap"];

export function BuildDrawing({ visual: v, fallbackLength, maxLength, truckName, spot, real, className }: BuildDrawingProps) {
  const has = (flag: string) => v.flags.has(flag);
  const tipper = v.product === "tipper";

  // ---------- Where everything sits ----------
  const L = Math.round((v.length ?? fallbackLength) / 10);
  const H = Math.round((v.height ?? 1050) / 10);
  const sub = v.subframe / 10;
  const yB = CH_TOP - sub;
  const yT = yB - H;
  const bx1 = tipper ? 270 : v.product === "dog" ? 170 : 60;
  const end = bx1 + L;
  const mid = (bx1 + end) / 2;

  const group = (n: number, overhang: number, gap = 135) =>
    Array.from({ length: n }, (_, i) => end - overhang - (n - 1 - i) * gap);
  let front: number[] = [];
  let rear: number[] = [];
  if (tipper) {
    const twin = /^(8|10)x/.test(v.setup);
    front = twin ? [140, 322] : [140];
    rear = /^4x/.test(v.setup) ? [end - 150] : /^10x/.test(v.setup) ? group(3, 96, 132) : group(2, 115);
  } else if (v.product === "dog") {
    front = /^4/.test(v.setup) ? [bx1 + 75, bx1 + 210] : [bx1 + 95];
    rear = group(2, 115);
  } else {
    rear = group(/^2/.test(v.setup) ? 2 : 3, 130);
  }
  const axles = [...front, ...rear];
  const rearL = rear[0] - 60;
  const rearR = rear[rear.length - 1] + 60;
  const rearMid = (rearL + rearR) / 2;

  const bodyFill = v.customColour ? "#cfccc5" : (v.bodyColour ?? CAB);
  const darkBody = luminance(bodyFill) < 0.42;
  const onBody = darkBody ? "rgb(255 255 255 / .82)" : "rgb(19 20 22 / .7)";
  const tr = v.wall ? Math.max(6, v.wall * 3 - 5) : 9; // top rail, from the wall plate
  const fb = v.floor ? Math.max(6, v.floor * 2 - 2) : 9; // floor band, from the floor plate
  // Arrow's own bin, top to bottom: a deep top rail, the flat side with its
  // pinstripes running into the lettering, a rolled bottom rail, then the
  // light channel with the marker lamps set into it.
  const coam = real ? Math.min(20, Math.max(12, H * 0.15)) : 0;
  const chan = real ? 7 : 0;
  const stripeSpread = Math.min(26, Math.max(14, (H - coam - fb - chan) * 0.3));
  const stripeBase = yT + coam + 6 + stripeSpread;
  const stripeInk = darkBody ? "rgb(255 255 255 / .72)" : "rgb(19 20 22 / .78)";
  const brush = Math.max(6, Math.min(12, sub - 4));
  const lampY = real ? yB - chan / 2 : yB - fb - 12;

  // The frame is sized for the longest body of this chassis type, so it holds still.
  const maxEnd = bx1 + Math.round(Math.max(maxLength, v.length ?? 0, fallbackLength) / 10);
  const minX = (tipper ? -14 : v.product === "dog" ? -12 : bx1 - 12) - 26;
  const dimX = end + (v.tow || v.crossMember !== null ? 92 : 58);
  const maxX = maxEnd + 92 + 78;
  const viewBox = `${minX} 34 ${maxX - minX} 420`;

  // Parts hung under the chassis share the space between the axle groups.
  const spanStart = front.length ? front[front.length - 1] + R + 8 : v.product === "semi" ? bx1 + 272 : bx1 + 8;
  const spanEnd = rear[0] - R - 8;
  const under: { key: string; w: number }[] = [];
  const fuelTank = !!real && tipper;
  if (fuelTank) under.push({ key: "fuel", w: 74 });
  if (v.tank === "side") under.push({ key: "tank", w: 62 });
  if (v.tank === "partition" && !fuelTank) under.push({ key: "tank", w: 88 });
  if (has("toolbox")) under.push({ key: "toolbox", w: 62 });
  if (has("waterTank")) under.push({ key: "waterTank", w: 78 });
  if (has("slideLadder")) under.push({ key: "slideLadder", w: 86 });
  const wanted = under.reduce((n, u) => n + u.w, 0) + Math.max(0, under.length - 1) * 8;
  const fit = Math.min(1, Math.max(0.5, (spanEnd - spanStart) / Math.max(1, wanted)));
  let cursor = Math.max(spanStart, spanStart + (spanEnd - spanStart - wanted * fit) / 2);
  const slot: Record<string, { x: number; w: number }> = {};
  for (const u of under) {
    slot[u.key] = { x: cursor, w: u.w * fit };
    cursor += (u.w + 8) * fit;
  }
  // Partitioned hydraulic oil lives in the fuel tank, so that is where to point.
  const tankSpot = v.tank === "partition" && fuelTank ? slot.fuel : slot.tank;

  // ---------- Small fittings ----------
  const used: Partial<Record<Anchor, number>> = {};
  const truckBox = v.product === "dog" ? { x: -6, y: G - 196 } : { x: bx1 + 14, y: CH_BOT + 30 };
  let truckSide = 0;
  const place = (g: Glyph): [number, number] => {
    const i = used[g.anchor] ?? 0;
    used[g.anchor] = i + 1;
    if (!tipper && TRUCK_SIDE.includes(g.anchor)) {
      const n = truckSide++;
      return [truckBox.x + 18 + (n % 6) * 24, truckBox.y + 24 + Math.floor(n / 6) * 22];
    }
    switch (g.anchor) {
      case "dash":
        return [66 + (i % 5) * 17, G - 228 - Math.floor(i / 5) * 18];
      case "roof":
        return [70 + i * 48, G - 297];
      case "mirror":
        return [-8, G - 272 - i * 14];
      case "cabFront":
        return [-2, G - 160 + i * 22];
      case "underCab":
        return [206 - i * 30, G - 52];
      case "gap":
        return [236, CH_TOP - 14 - i * 20];
      case "frontTop":
        return [bx1 + 18 + i * 22, yT - 12];
      case "side":
        return [bx1 + 92 + i * 22, yB - fb - 36];
      case "rearTop":
        return [end - 12 - i * 22, yT - 12];
      case "rearLow":
        return [end + 22 + i * 18, G - 30];
      case "cross":
        return [end - 14 - i * 16, CH_BOT + 14];
      case "guard":
        return [rearMid - 20 + i * 40, G - 124];
      case "tow":
        return [end + 44, CH_TOP - 8 - i * 18];
      case "susp":
        return [rearMid + (i % 2 ? 26 : -26) * Math.ceil(i / 2 + 0.5) * 0.6, G - 78 + (i > 1 ? 14 : 0)];
      default:
        return [mid, yT - 12];
    }
  };
  const marks = v.glyphs.filter((g) => g.kind !== "wire").map((g) => ({ g, at: place(g) }));
  const wires = v.glyphs.filter((g) => g.kind === "wire");
  const truckSideCount = truckSide;

  // ---------- Where each selection can be pointed out ----------
  const dimY = yT - (v.tarp ? (v.tarp.type === "bow" ? 58 : 36) : 26);
  const A: Record<string, [number, number]> = {
    length: [mid, dimY],
    height: [dimX, (yT + yB) / 2],
    width: [mid, (yT + yB) / 2],
    material: [mid - L * 0.2, (yT + yB) / 2],
    colour: [mid + L * 0.12, (yT + yB) / 2],
    wall: [bx1 + L * 0.3, yT + tr / 2],
    floor: [bx1 + L * 0.3, yB - fb / 2],
    subframe: [bx1 + L * 0.62, yB + sub / 2],
    hoist: v.hoist === "well" ? [bx1 + 27, (yT + yB) / 2 + 8] : [bx1 - 15, (CH_TOP + yT) / 2],
    tarp: [mid, yT - 20],
    tarpDrive: [bx1 - 4, yT - 24],
    lights: [mid, lampY],
    steps: [bx1 + 49, yB - fb - 40],
    mudflaps: [rearR + 5, G - 40],
    pto: [208, G - 72],
    tank: v.tank === "rear" ? [235, CH_TOP - 36] : tankSpot ? [tankSpot.x + tankSpot.w / 2, CH_BOT + 22] : [mid, CH_BOT],
    couplings: [end - 10, CH_BOT + 34],
    cross: [end + 7, CH_TOP + 6],
    tow: [end + 30, CH_TOP + 12],
    controls: v.controls === "remote" ? [178, G - 160] : [100, G - 228],
    "flag:guards": [rearMid, G - 114],
    "flag:spray": real ? [mid, yB + brush / 2] : [rearMid, G - 106],
    "flag:tailgate": real ? [end - 8, yT + coam + 23] : [end + 4, (yT + yB) / 2],
    "flag:grainLocks": [end - 12, yB - fb - 9],
    "flag:pushLug": [end + 14, yB + 2],
    "flag:shovel": [bx1 + 16, (yT + yB) / 2],
    "flag:chrome": real ? [bx1 + L * 0.3, yB - chan / 2] : [bx1 + L * 0.72, yT + tr + 4],
    "flag:fingerGuards": [end + 3, yT - 3],
    "flag:cameraBox": [end - 31, yT + tr + 12],
    "flag:grainDoor": [end + 12, yB - 31],
    "flag:slideLadder": slot.slideLadder ? [slot.slideLadder.x + slot.slideLadder.w / 2, CH_BOT + 12] : [mid, CH_BOT],
    "flag:dropLadder": [end - 60, yB + 20],
    "flag:toolbox": slot.toolbox ? [slot.toolbox.x + slot.toolbox.w / 2, CH_BOT + 24] : [mid, CH_BOT],
    "flag:waterTank": slot.waterTank ? [slot.waterTank.x + slot.waterTank.w / 2, CH_BOT + 22] : [mid, CH_BOT],
    "flag:chequer": [rearMid, G - 118],
    "flag:vass": [bx1 + 87, CH_TOP + 9],
    "flag:ptoProg": [182, G - 140],
    "flag:extHyd": [bx1 + L * 0.45, CH_TOP + 5],
    "flag:extElec": [bx1 + L * 0.55, CH_TOP + 10],
    "flag:extEbs": [bx1 + L * 0.65, CH_TOP + 15],
    type: [rearMid, G - R],
  };
  for (const m of marks) A[`glyph:${m.g.id}`] = m.at;
  for (const w of wires) A[`glyph:${w.id}`] = [bx1 + L * 0.4, CH_TOP - 2];

  const pointed = spot ? (A[spot.key] ?? A.width) : null;

  const lightsAt = Array.from({ length: v.lights }, (_, i) =>
    v.lights === 1 ? mid : bx1 + 16 + (i * (L - 32)) / (v.lights - 1),
  );
  const planks = v.material === "aluminium" ? Array.from({ length: Math.floor((H - tr - fb - 8) / 15) }, (_, i) => yT + tr + 12 + i * 15) : [];
  const bow = (t: number) => yT - 2 + 2 * t * (1 - t) * -38;
  const tarpPath = `M${bx1 + 4} ${yT - 2} Q${mid} ${yT - 40} ${end - 4} ${yT - 2} Z`;
  const what = `${v.setup} ${tipper ? "tipper body" : `${v.product} trailer`}`;

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={`Side view of your ${what}`}
      className={`bd ${real ? "real" : ""} ${className ?? ""}`}
      style={{ aspectRatio: `${maxX - minX} / 420` }}
    >
      <defs>
        <linearGradient id="bd-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="bd-cab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f5f1" />
          <stop offset="1" stopColor="#dedbd4" />
        </linearGradient>
        <linearGradient id="bd-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b434c" />
          <stop offset="1" stopColor="#15181c" />
        </linearGradient>
        <linearGradient id="bd-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9c9a94" />
          <stop offset=".45" stopColor="#f2f0eb" />
          <stop offset="1" stopColor="#a8a6a0" />
        </linearGradient>
        <linearGradient id="bd-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".5" stopColor="#b9bcc2" />
          <stop offset="1" stopColor="#f4f5f7" />
        </linearGradient>
        <radialGradient id="bd-rim">
          <stop offset="0" stopColor="#f1efea" />
          <stop offset="1" stopColor="#bcb9b2" />
        </radialGradient>
        <linearGradient id="bd-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".42" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <pattern id="bd-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V9" stroke="rgb(19 20 22 / .28)" strokeWidth="2" />
        </pattern>
        <pattern id="bd-chequer" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#b9b7b1" />
          <path d="M1 3 L3 1 M4 6 L6 4" stroke="#6f6c66" strokeWidth="1.2" strokeLinecap="round" />
        </pattern>
        <pattern id="bd-fleck" width="11" height="11" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="3" r=".7" fill="#fff" opacity=".7" />
          <circle cx="8" cy="7" r=".6" fill="#fff" opacity=".5" />
          <circle cx="5" cy="10" r=".5" fill="#fff" opacity=".6" />
        </pattern>
        <clipPath id="bd-clip">
          <Box x={bx1} y={yT} w={L} h={H} className="" />
        </clipPath>
        <filter id="bd-soft" x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {real && <RealDefs floorTop={G} floorBottom={454} />}
        {real && (
          <mask id="bd-r-fade" maskUnits="userSpaceOnUse" x={minX} y={G} width={maxX - minX} height={80}>
            <rect x={minX} y={G} width={maxX - minX} height={80} fill="url(#bd-r-fadeg)" />
          </mask>
        )}
      </defs>

      {/* Floor */}
      {real ? (
        <>
          <RealStage minX={minX} maxX={maxX} top={34} bottom={454} from={axles[0] ?? bx1} to={end} />
          {/* The vehicle, mirrored faintly in the floor. */}
          <g mask="url(#bd-r-fade)" opacity=".5">
            <g transform={`translate(0 ${2 * G + 2}) scale(1 -1)`}>
              <use href="#bd-vehicle" />
            </g>
          </g>
        </>
      ) : (
        <>
          <ellipse cx={(axles[0] + end) / 2} cy={G + 5} rx={(end - (axles[0] ?? bx1)) / 2 + 70} ry={9} fill="rgb(19 20 22 / .22)" filter="url(#bd-soft)" />
          <path d={`M${minX + 10} ${G} H${maxX - 10}`} stroke="rgb(19 20 22 / .22)" strokeWidth="1.4" />
        </>
      )}

      <g id="bd-vehicle">
      {/* Chassis */}
      <Box x={tipper ? 200 : v.product === "dog" ? bx1 - 6 : bx1 + 30} y={CH_TOP} w={end + 6 - (tipper ? 200 : v.product === "dog" ? bx1 - 6 : bx1 + 30)} h={20} rx={2} fill={real ? "url(#bd-r-rail)" : DARK} />
      {real && (
        <g>
          {/* Suspension between the rear axles, and the frame's fixings */}
          {rear.slice(1).map((x, i) => {
            const cx = (x + rear[i]) / 2;
            return <path key={i} d={`M${cx - 17} ${CH_BOT} H${cx + 17} L${cx + 9} ${G - 54} H${cx - 9} Z`} fill="url(#bd-r-plastic)" stroke="#000" strokeOpacity=".5" strokeWidth=".7" />;
          })}
          <Box x={rear[0] - 20} y={G - 62} w={rear[rear.length - 1] - rear[0] + 40} h={6} rx={2} className="" fill="#101112" />
          {Array.from({ length: Math.max(0, Math.floor((end - bx1) / 46)) }, (_, i) => (
            <circle key={i} cx={bx1 + 20 + i * 46} cy={CH_TOP + 12} r={1.5} fill="#6a6d72" />
          ))}
          <Box x={bx1} y={CH_TOP + 0.6} w={end - bx1} h={1} className="" fill="rgb(255 255 255 / .22)" />
        </g>
      )}

      {v.product === "dog" && (
        <g>
          <path d={`M9 ${G - 84} L${front[0] - 46} ${G - 100} L${front[0] - 46} ${G - 80} Z`} fill={real ? "url(#bd-r-rail)" : DARK} className="bd-s" />
          {real && <path d={`M12 ${G - 85.4} L${front[0] - 46} ${G - 99}`} stroke="rgb(255 255 255 / .3)" strokeWidth="1" />}
          <circle cx={0} cy={G - 83} r={9} fill="none" stroke={real ? "#8d9196" : "#131416"} strokeWidth="4" />
          {real && <circle cx={0} cy={G - 83} r={11} fill="none" stroke="rgb(0 0 0 / .5)" strokeWidth=".8" />}
          <rect x={front[0] - 52} y={CH_BOT} width={front[front.length - 1] - front[0] + 104} height={9} rx={3} fill="#3a3d42" className="bd-s" />
        </g>
      )}
      {v.product === "semi" && (
        <g>
          <rect x={bx1 + 44} y={CH_BOT} width={112} height={8} rx={2} fill="#3a3d42" className="bd-s" />
          <rect x={bx1 + 96} y={CH_BOT + 8} width={8} height={15} fill={METAL} className="bd-s" />
          <path d={`M${bx1 + 250} ${CH_BOT} V${G - 14} M${bx1 + 250} ${CH_BOT + 12} L${bx1 + 290} ${CH_BOT}`} stroke="#131416" strokeWidth="5" strokeLinecap="round" fill="none" />
          <rect x={bx1 + 236} y={G - 16} width={28} height={7} rx={2} fill={DARK} className="bd-s" />
        </g>
      )}

      {/* Hydraulic and electrical runs to the rear */}
      {has("extHyd") && <Pop><Box x={230} y={CH_TOP + 3.5} w={end - 226} h={2.6} rx={1.3} className="" fill="#e0353c" /></Pop>}
      {has("extElec") && <Pop><Box x={230} y={CH_TOP + 8.7} w={end - 226} h={2.6} rx={1.3} className="" fill="#f0a020" /></Pop>}
      {has("extEbs") && <Pop><Box x={230} y={CH_TOP + 13.9} w={end - 226} h={2.6} rx={1.3} className="" fill="#4d8ef0" /></Pop>}

      {/* Under the chassis */}
      {slot.fuel && (
        <At x={slot.fuel.x} y={CH_BOT + 4}>
          <RealFuelTank w={slot.fuel.w} partition={v.tank === "partition"} />
        </At>
      )}
      {slot.tank && (
        <Pop>
          <At x={slot.tank.x} y={CH_BOT + 4}>
            <rect width={slot.tank.w} height={36} rx={v.tank === "partition" ? 16 : 6} fill="#4a4d53" className="bd-s" />
            <rect x={slot.tank.w * 0.18} y={-4} width={9} height={5} rx={1.5} fill={DARK} />
            {v.tank === "partition" ? (
              <>
                <path d={`M${slot.tank.w * 0.58} 0 V36`} stroke="#d6141c" strokeWidth="2.2" />
                <rect x={slot.tank.w * 0.74} y={-4} width={9} height={5} rx={1.5} fill="#d6141c" />
              </>
            ) : (
              <rect x={slot.tank.w - 10} y={7} width={3.5} height={22} rx={1.5} fill="#e9c46a" />
            )}
          </At>
        </Pop>
      )}
      {slot.toolbox && (
        <Pop>
          <At x={slot.toolbox.x} y={CH_BOT + 5}>
            <rect width={slot.toolbox.w} height={38} rx={3} fill="url(#bd-chequer)" className="bd-s" />
            <path d={`M0 11 H${slot.toolbox.w}`} className="bd-s" />
            <rect x={slot.toolbox.w / 2 - 6} y={15} width={12} height={4.5} rx={2} fill={DARK} />
          </At>
        </Pop>
      )}
      {slot.waterTank && (
        <Pop>
          <At x={slot.waterTank.x} y={CH_BOT + 5}>
            <rect width={slot.waterTank.w} height={34} rx={17} fill="#dfe7ee" className="bd-s" />
            <path d={`M10 21 Q${slot.waterTank.w / 2} 15 ${slot.waterTank.w - 10} 21`} stroke="#4d8ef0" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x={slot.waterTank.w / 2 - 5} y={-4} width={10} height={5} rx={1.5} fill={DARK} />
            <path d={`M${slot.waterTank.w - 8} 30 v9 h7`} stroke="#131416" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </At>
        </Pop>
      )}
      {slot.slideLadder && (
        <Pop>
          <At x={slot.slideLadder.x} y={CH_BOT + 6}>
            <rect width={slot.slideLadder.w} height={11} rx={2} fill="none" className="bd-s" stroke="#131416" />
            {Array.from({ length: Math.floor(slot.slideLadder.w / 12) }, (_, i) => (
              <path key={i} d={`M${8 + i * 12} 0 V11`} className="bd-s" />
            ))}
          </At>
        </Pop>
      )}
      {v.tank === "rear" && tipper && (
        <Pop>
          <rect x={226} y={CH_TOP - 72} width={19} height={72} rx={5} fill="#4a4d53" className="bd-s" />
          <rect x={231} y={CH_TOP - 77} width={9} height={6} rx={2} fill={DARK} />
          <rect x={239} y={CH_TOP - 58} width={3} height={36} rx={1.5} fill="#e9c46a" />
        </Pop>
      )}

      {/* Subframe */}
      <Box x={bx1} y={yB} w={L} h={sub} rx={1.5} fill={v.subframeColour ?? "#34373c"} />
      <Box x={bx1} y={yB} w={L} h={sub} className="" fill={real ? "url(#bd-r-tube)" : "url(#bd-shade)"} />

      {/* Hoist, mounted ahead of the body */}
      {v.hoist === "front" && (
        <Pop>
          <rect x={bx1 - 24} y={CH_TOP - 6} width={18} height={8} rx={2} fill={DARK} className="bd-s" />
          <Box x={bx1 - 22} y={CH_TOP - (CH_TOP - yT - 12) * 0.46} w={14} h={(CH_TOP - yT - 12) * 0.46 - 6} rx={3} fill="url(#bd-metal)" />
          <Box x={bx1 - 20} y={CH_TOP - (CH_TOP - yT - 12) * 0.8} w={10} h={(CH_TOP - yT - 12) * 0.36} rx={2.5} fill="url(#bd-metal)" />
          <Box x={bx1 - 18} y={yT + 12} w={6} h={(CH_TOP - yT - 12) * 0.22} rx={2} fill="url(#bd-metal)" />
          <Box x={bx1 - 18} y={yT + 9} w={18} h={6} rx={2} fill={DARK} />
        </Pop>
      )}

      {/* The body */}
      <Box x={bx1} y={yT} w={L} h={H} rx={2.5} fill={bodyFill} />
      <g clipPath="url(#bd-clip)">
        {v.customColour && <Box x={bx1} y={yT} w={L} h={H} className="" fill="url(#bd-hatch)" />}
        <Box x={bx1} y={yT} w={L} h={H} className="" fill={real ? "url(#bd-r-gloss)" : "url(#bd-shade)"} />
        {real && (
          <g>
            {/* The deep top rail, stepping back to the side sheet */}
            <Box x={bx1} y={yT} w={L} h={coam} className="" fill="rgb(0 0 0 / .17)" />
            <Box x={bx1} y={yT + coam - 1.2} w={L} h={1.2} className="" fill="rgb(0 0 0 / .32)" />
            <Box x={bx1} y={yT + coam} w={L} h={1.1} className="" fill="rgb(255 255 255 / .38)" />
            {/* Pinstripes, drawing together as they run back to the lettering */}
            {Array.from({ length: 7 }, (_, i) => {
              const t = i / 6;
              const x2 = Math.max(bx1 + 60, end - 98);
              return (
                <path
                  key={i}
                  d={`M${bx1 + 18} ${round(stripeBase - stripeSpread * (1 - t))} L${x2} ${round(stripeBase - 4 * (1 - t))}`}
                  stroke={stripeInk}
                  strokeWidth={round(0.6 + t * 1.2)}
                />
              );
            })}
            {/* The rolled bottom rail and the light channel under it */}
            <Box x={bx1} y={yB - chan - fb} w={L} h={fb} className="" fill="url(#bd-r-tube)" />
            <Box x={bx1} y={yB - chan - fb - 1} w={L} h={1} className="" fill="rgb(0 0 0 / .28)" />
            <Box x={bx1} y={yB - chan} w={L} h={chan} className="" fill={has("chrome") ? "url(#bd-r-alloy)" : "rgb(0 0 0 / .5)"} />
            <Box x={bx1} y={yB - chan} w={L} h={0.9} className="" fill="rgb(0 0 0 / .4)" />
            {/* Corner posts */}
            <Box x={bx1} y={yT} w={13} h={H} className="" fill="url(#bd-r-post)" />
            <Box x={end - 16} y={yT} w={16} h={H} className="" fill="url(#bd-r-post)" />
            <Box x={end - 16} y={yT} w={1} h={H} className="" fill="rgb(0 0 0 / .3)" />
          </g>
        )}
        {planks.map((y) => (
          <path key={y} d={`M${bx1} ${y} H${end}`} stroke={darkBody ? "rgb(255 255 255 / .2)" : "rgb(19 20 22 / .2)"} strokeWidth="1.2" />
        ))}
        {v.material === "aluminium" && <Box x={bx1} y={yT} w={L} h={H * 0.32} className="" fill="rgb(255 255 255 / .12)" />}
        {v.metallic && (
          <Pop>
            <Box x={bx1} y={yT} w={L} h={H} className="" fill="url(#bd-fleck)" />
            <At x={bx1 + L * 0.2}>
              <path d={`M0 ${yB} L${H * 0.9} ${yT} h${L * 0.16} L${L * 0.16} ${yB} Z`} fill="url(#bd-sheen)" />
            </At>
          </Pop>
        )}
        {!real && <Box x={bx1} y={yB - fb} w={L} h={fb} className="" fill="rgb(0 0 0 / .26)" />}
      </g>
      <Box x={bx1 - 3} y={yT - 3} w={L + 6} h={tr} rx={2} fill={bodyFill} />
      <Box x={bx1 - 3} y={yT - 3} w={L + 6} h={tr} rx={real ? tr / 2 : 2} className="" fill={real ? "url(#bd-r-tube)" : "rgb(0 0 0 / .2)"} />
      {real && <Box x={bx1} y={yB + sub} w={L} h={6} className="" fill="rgb(0 0 0 / .28)" />}
      <At x={end - 22} y={real ? stripeBase + 4 : yT + tr + Math.min(46, H * 0.42)}>
        {real && (
          <text textAnchor="end" x={1} y={1.2} className="bd-word" fill={darkBody ? "rgb(0 0 0 / .45)" : "rgb(255 255 255 / .6)"}>
            ARROW
          </text>
        )}
        <text textAnchor="end" className="bd-word" fill={onBody}>
          ARROW
        </text>
      </At>

      {/* Hoist, mounted in a well inside the body: shown as hidden detail */}
      {v.hoist === "well" && (
        <Pop>
          <Box x={bx1 + 9} y={yT + tr + 8} w={36} h={H - tr - 8} rx={3} className="" fill="none" stroke={onBody} strokeWidth="1.3" strokeDasharray="5 4" />
          <Box x={bx1 + 20} y={yT + tr + 16} w={14} h={H - tr - 20} rx={3} className="" fill="none" stroke={onBody} strokeWidth="1.3" strokeDasharray="5 4" />
        </Pop>
      )}

      {/* On the side of the body */}
      {has("chrome") && !real && (
        <Pop>
          <Box x={bx1 + 2} y={yT + tr + 1} w={L - 4} h={3.4} rx={1.7} className="" fill="url(#bd-chrome)" stroke="rgb(19 20 22 / .4)" strokeWidth=".6" />
          <Box x={bx1 + 2} y={yB - fb - 4} w={L - 4} h={3.4} rx={1.7} className="" fill="url(#bd-chrome)" stroke="rgb(19 20 22 / .4)" strokeWidth=".6" />
        </Pop>
      )}
      {lightsAt.map((x, i) => (
        <At key={i} x={x} y={lampY}>
          {real ? (
            <g className="bd-in">
              <rect x={-7} y={-2.9} width={14} height={5.8} rx={2.4} fill="url(#bd-r-alloy)" stroke="#000" strokeOpacity=".45" strokeWidth=".5" />
              <rect x={-5} y={-1.7} width={10} height={3.4} rx={1.6} fill={i === lightsAt.length - 1 ? "#e3140c" : "#ffa01c"} />
            </g>
          ) : (
            <rect x={-5} y={-3} width={10} height={6} rx={2.5} fill={i === lightsAt.length - 1 ? "#e3140c" : "#ffab1e"} className="bd-s bd-in" />
          )}
        </At>
      ))}
      {v.steps > 0 && (
        <At x={bx1 + 34} y={yB - fb}>
          {Array.from({ length: v.steps }, (_, i) => (
            <g key={i} className="bd-in">
              <rect x={0} y={-24 - i * 25} width={30} height={6} rx={2} fill={real ? "#141516" : METAL} className="bd-s" />
              <path d={`M4 ${-18 - i * 25} v5 M26 ${-18 - i * 25} v5`} className="bd-s" />
            </g>
          ))}
        </At>
      )}
      {has("shovel") && (
        <Pop>
          <At x={bx1 + 16} y={yT + tr}>
            <path d={`M0 10 V${H - tr - fb - 34}`} stroke="#8a5a2b" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 6 h10 v6 h-10 Z" fill="none" className="bd-s" />
            <At y={H - tr - fb - 34}>
              <path d="M-7 0 h14 l-2 14 q-5 6 -10 0 Z" fill={METAL} className="bd-s" />
            </At>
          </At>
        </Pop>
      )}
      {has("vass") && (
        <Pop>
          <At x={bx1 + 70} y={CH_TOP + 3}>
            <rect width={34} height={13} rx={2} fill="#f4f3ef" className="bd-s" />
            <text x={17} y={9.6} textAnchor="middle" className="bd-tiny" fill="#131416">
              VASS
            </text>
          </At>
        </Pop>
      )}

      {/* The tailgate and the rear of the body */}
      <Box x={end} y={yT - 3} w={8} h={H + 3} rx={2} fill={bodyFill} />
      <Box x={end} y={yT - 3} w={8} h={H + 3} rx={2} className="" fill={real ? "url(#bd-r-post)" : "rgb(0 0 0 / .3)"} />
      {real && <Box x={end} y={yT - 3} w={8} h={H + 3} rx={2} className="" fill="rgb(0 0 0 / .16)" />}
      {real && (
        <g>
          <At x={end} y={yT}>
            <path d="M-8 0 C-8 -21 15 -21 15 -3 V9" fill="none" stroke="rgb(0 0 0 / .55)" strokeWidth="8.4" strokeLinecap="round" />
            <path d="M-8 0 C-8 -21 15 -21 15 -3 V9" fill="none" stroke={bodyFill} strokeWidth="6.6" strokeLinecap="round" />
            <path d="M-9.6 -4 C-8 -19 10 -20 13.4 -8" fill="none" stroke="rgb(255 255 255 / .35)" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx={15} cy={9} r={3.6} fill="url(#bd-r-dome)" stroke="#000" strokeOpacity=".5" strokeWidth=".6" />
          </At>
          <At x={end} y={yB}>
            <path d="M3 -12 h10 q5 0 5 5 q0 6 -7 8 q-5 1 -8 -3 Z" fill={bodyFill} stroke="rgb(0 0 0 / .5)" strokeWidth=".8" />
            <path d="M11 0 q7 13 1 27" fill="none" stroke="#d3d5d8" strokeWidth="2.6" strokeDasharray="3.4 2.4" strokeLinecap="round" />
            {/* Warning decals, low at the rear as on every body */}
            <g transform={`translate(-52 ${-chan - fb - 15})`}>
              <rect width={13} height={10} rx={1.2} fill="#f7f6f2" />
              <rect width={13} height={3.4} rx={1.2} fill="#d6141c" />
              <rect x={15} width={13} height={10} rx={1.2} fill="#f7f6f2" />
              <rect x={15} width={13} height={3.4} rx={1.2} fill="#d6141c" />
            </g>
          </At>
          <At x={bx1 + L * 0.7} y={yT + coam + (H - coam - chan - fb) * 0.62}>
            <path d="M0 0 h11 M0 0 v15 h11" fill="none" stroke="rgb(0 0 0 / .78)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </At>
        </g>
      )}
      <At x={end} y={yT}>
        <circle cx={4} cy={3} r={3.4} fill={METAL} className="bd-s" />
        {has("fingerGuards") && (
          <Pop>
            <path d="M-8 -9 h22 v9 l-6 5 h-16 Z" fill="#f2c200" className="bd-s" />
            <path d="M-3 -9 l-4 9 M5 -9 l-4 9 M13 -9 l-4 9" stroke="#131416" strokeWidth="1.6" />
          </Pop>
        )}
        {has("tailgate") && real && (
          <Pop>
            {/* The air ram that works the two-way tailgate, on the rear post */}
            <rect x={-11.5} y={coam + 8} width={7} height={30} rx={3} fill="url(#bd-metal)" stroke="#000" strokeOpacity=".45" strokeWidth=".6" />
            <path d={`M-8 ${coam + 38} v9`} stroke="#d9dbdd" strokeWidth="2.2" strokeLinecap="round" />
            <path d={`M-8 ${coam + 8} q0 -6 -7 -6`} stroke="#4d8ef0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </Pop>
        )}
        {has("tailgate") && !real && (
          <Pop>
            <rect x={-104} y={tr + 5} width={40} height={8} rx={3.5} fill="url(#bd-metal)" className="bd-s" />
            <path d={`M-64 ${tr + 9} H-4`} stroke="#131416" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx={-4} cy={tr + 9} r={2.6} fill={DARK} />
            <path d={`M-104 ${tr + 9} q-8 0 -8 8`} stroke="#4d8ef0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </Pop>
        )}
        {has("cameraBox") && (
          <Pop>
            <rect x={-42} y={tr + 6} width={22} height={13} rx={2.5} fill={DARK} className="bd-s" />
            <circle cx={-27} cy={tr + 12.5} r={3} fill="#7fb4ff" />
          </Pop>
        )}
      </At>
      <At x={end} y={yB}>
        {has("tailgate") && <circle cx={4} cy={-6} r={3.4} fill={METAL} className="bd-s bd-in" />}
        {has("grainLocks") && (
          <Pop>
            <path d={`M-20 ${-fb - 6} h10 l5 -4`} stroke="#131416" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={-20} cy={-fb - 6} r={2.6} fill="#f2c200" className="bd-s" />
          </Pop>
        )}
        {has("grainDoor") && (
          <Pop>
            <rect x={8} y={-46} width={8} height={30} rx={2} fill={METAL} className="bd-s" />
            <path d="M16 -38 h5 v14 h-5" className="bd-s" fill="none" />
          </Pop>
        )}
        {has("pushLug") && (
          <Pop>
            <rect x={8} y={-5} width={13} height={14} rx={3} fill={DARK} className="bd-s" />
          </Pop>
        )}
        {has("dropLadder") && (
          <Pop>
            <path d={`M-70 ${-H + tr + 4} V${G - 40 - yB} M-50 ${-H + tr + 4} V${G - 40 - yB}`} stroke="#131416" strokeWidth="2.6" strokeLinecap="round" />
            {Array.from({ length: Math.floor((G - 40 - yT - tr) / 17) }, (_, i) => (
              <path key={i} d={`M-70 ${-H + tr + 14 + i * 17} h20`} stroke="#131416" strokeWidth="2" />
            ))}
          </Pop>
        )}
      </At>

      {/* Tarp */}
      {v.tarp && (
        <Pop>
          {v.tarp.type === "bow" ? (
            <g>
              <path d={tarpPath} style={{ d: `path("${tarpPath}")` } as React.CSSProperties} fill={v.tarp.colour} className="bd-s bd-fill bd-shape" />
              {real && <path d={tarpPath} fill="url(#bd-r-tube)" opacity=".5" />}
              {[0.14, 0.3, 0.46, 0.62, 0.78, 0.92].map((t) => (
                <g key={t}>
                  <path d={`M${bx1 + 4 + (L - 8) * t} ${yT - 2} V${bow(t) + 1}`} stroke="rgb(255 255 255 / .28)" strokeWidth="1.3" />
                  {real && <path d={`M${bx1 + 6.5 + (L - 8) * t} ${yT - 2} V${bow(t) + 2}`} stroke="rgb(0 0 0 / .35)" strokeWidth="2.4" />}
                </g>
              ))}
              <Box x={bx1 - 8} y={yT - 16} w={17} h={14} rx={3.5} fill={DARK} />
            </g>
          ) : (
            <g>
              <Box x={bx1 + 8} y={yT - 9} w={L - 18} h={6} rx={2} fill={v.tarp.colour} className="bd-s bd-fill" />
              <At x={bx1 + 2} y={yT - 12}>
                <circle r={10} fill={v.tarp.colour} className="bd-s bd-fill" />
                <circle r={3} fill={METAL} className="bd-s" />
              </At>
              <At x={end - 12} y={yT}>
                <rect y={-15} width={4.5} height={16} rx={2} fill={METAL} className="bd-s" />
              </At>
            </g>
          )}
          {real && (
            <g>
              <At x={bx1} y={yT}>
                <path d="M-8 -3 V-15 Q-6 -31 22 -33 L60 -33 Q86 -31 98 -3 Z" fill={bodyFill} stroke="rgb(0 0 0 / .5)" strokeWidth=".8" />
                <path d="M-8 -3 V-15 Q-6 -31 22 -33 L60 -33 Q86 -31 98 -3 Z" fill="url(#bd-r-gloss)" />
                <path d="M-2 -22 Q2 -29 22 -30 H58" fill="none" stroke="rgb(255 255 255 / .5)" strokeWidth="1.2" strokeLinecap="round" />
              </At>
              {Array.from({ length: Math.max(0, Math.floor((L - 130) / 74)) }, (_, i) => (
                <At key={i} x={bx1 + 122 + i * 74} y={yT}>
                  <rect x={-4} y={-6.5} width={8} height={5} rx={1.4} fill="#101112" />
                </At>
              ))}
            </g>
          )}
          {v.tarp.electric === true && (
            <Pop>
              <At x={bx1 - 12} y={yT - 32}>
                <rect width={16} height={14} rx={3} fill="#3a3d42" className="bd-s" />
                <path d="M9 2 L5 8 h4 l-3 5" stroke="#ffd23f" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </At>
            </Pop>
          )}
          {v.tarp.electric === false && (
            <Pop>
              <At x={bx1 + 4} y={yT}>
                <path d={`M0 -4 V${H - fb - 30} h-12`} stroke="#131416" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={-12} cy={H - fb - 30} r={4} fill={METAL} className="bd-s" />
              </At>
            </Pop>
          )}
        </Pop>
      )}

      {/* Wiring runs */}
      {wires.map((w, i) => {
        const y = CH_TOP - 3 - i * 3.5;
        const from = tipper ? 222 : bx1;
        const d =
          w.to === "tarp"
            ? `M${from} ${y} H${bx1 - 5} V${yT - 10}`
            : w.to === "susp"
              ? `M${from} ${y} H${rearMid} V${G - 86}`
              : `M${from} ${y} H${end + 4}`;
        return <path key={w.id} d={d} className="bd-in" fill="none" stroke="#f0a020" strokeWidth="2" strokeDasharray="7 4" strokeLinecap="round" strokeLinejoin="round" />;
      })}

      {/* Cab, and what is fitted to it */}
      {tipper && (
        <g>
          {real ? <RealCab /> : <Cab />}
          {v.pto && (
            <Pop>
              <path
                d={`M214 ${G - 72} V${CH_TOP - 2} H${v.hoist === "well" ? bx1 + 27 : bx1 - 15}${v.pto === "trailer" && !has("extHyd") ? ` M${bx1} ${CH_TOP + 4.8} H${end + 2}` : ""}`}
                fill="none"
                stroke="#e0353c"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={204} cy={G - 72} r={8} fill={v.ptoExisting ? "none" : "#55585e"} className="bd-s" strokeDasharray={v.ptoExisting ? "3 3" : undefined} />
              <circle cx={204} cy={G - 72} r={2.6} fill="#131416" />
              <rect x={210} y={G - 79} width={15} height={14} rx={3} fill="#d6141c" className="bd-s" />
            </Pop>
          )}
          {has("ptoProg") && (
            <Pop>
              <At x={182} y={G - 140}>
                <rect x={-8} y={-8} width={16} height={16} rx={2.5} fill="#1d2126" className="bd-s" />
                <path d="M-11 -4 h3 M-11 0 h3 M-11 4 h3 M8 -4 h3 M8 0 h3 M8 4 h3" stroke="#131416" strokeWidth="1.4" />
                <rect x={-3.5} y={-3.5} width={7} height={7} rx={1} fill="#58d68d" />
              </At>
            </Pop>
          )}
          {v.controls === "remote" && (
            <Pop>
              <At x={178} y={G - 160}>
                <path d="M0 -12 q-14 -8 -22 -30" stroke="#131416" strokeWidth="1.4" fill="none" strokeDasharray="3 3" />
                <rect x={-6.5} y={-12} width={13} height={24} rx={4} fill="#f2c200" className="bd-s" />
                <circle cy={-4} r={2.4} fill="#d6141c" />
                <circle cy={4} r={2.4} fill="#131416" />
              </At>
            </Pop>
          )}
          {v.controls === "dash" && (
            <Pop>
              <At x={100} y={G - 228}>
                <rect x={-17} y={-6} width={34} height={12} rx={3} fill="#f4f3ef" className="bd-s" />
                {[-9, 0, 9].map((x) => (
                  <path key={x} d={`M${x} 2.5 l2 -5`} stroke="#d6141c" strokeWidth="2" strokeLinecap="round" />
                ))}
              </At>
            </Pop>
          )}
          {truckName && (
            <text x={110} y={G + 30} textAnchor="middle" className="bd-dim" fill="#6f6c66">
              {truckName.toUpperCase()}
            </text>
          )}
        </g>
      )}

      {/* Guards, flaps and wheels */}
      {has("guards") && (
        <Pop>
          <path
            d={`M${rearL} ${G - 64} V${G - 100} Q${rearL} ${G - 114} ${rearL + 14} ${G - 114} H${rearR - 14} Q${rearR} ${G - 114} ${rearR} ${G - 100} V${G - 64}`}
            fill="none"
            stroke={has("chequer") ? "#8f8c86" : "#2b2d31"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Pop>
      )}
      {has("chequer") && (
        <Pop>
          <Box x={rearL + 8} y={G - 121} w={rearR - rearL - 16} h={7} rx={1.5} fill="url(#bd-chequer)" />
        </Pop>
      )}
      {has("spray") && real && (
        <Pop>
          <Box x={bx1 + 3} y={yB} w={L - 6} h={brush} className="" fill="url(#bd-r-brush)" />
        </Pop>
      )}
      {has("spray") && !real && (
        <Pop>
          {Array.from({ length: Math.floor((rearR - rearL - 16) / 5) }, (_, i) => (
            <path key={i} d={`M${rearL + 10 + i * 5} ${G - 110} v8`} stroke="#131416" strokeWidth="1.3" strokeLinecap="round" />
          ))}
          <path d={`M${rearL - 4} ${G - 64} v26 M${rearL} ${G - 64} v26 M${rearR} ${G - 64} v26 M${rearR + 4} ${G - 64} v26`} stroke="#131416" strokeWidth="1.3" strokeDasharray="3 2" />
        </Pop>
      )}
      {v.mudflaps > 0 && (
        <At x={rearR + 2} y={G - 68}>
          <rect width={7} height={54} rx={2} fill="#1d1e20" className="bd-s bd-in" />
        </At>
      )}
      {v.mudflaps === 4 && (
        <At x={rearL - 9} y={G - 68}>
          <rect width={7} height={54} rx={2} fill="#1d1e20" className="bd-s bd-in" />
        </At>
      )}
      {axles.map((x, i) =>
        real ? (
          <At key={i} x={x} y={G - R}>
            <RealWheel steer={tipper && i < front.length} trailer={!tipper} />
          </At>
        ) : (
          <Wheel key={i} x={x} />
        ),
      )}

      {/* The rear of the chassis */}
      <At x={end}>
        <rect x={-3} y={CH_BOT + 1} width={8} height={13} rx={2} fill="#e3140c" className="bd-s" />
        {v.crossMember !== null && (
          <Pop>
            <rect x={3} y={CH_TOP - 5} width={10} height={/34/.test(v.crossMember) ? 44 : 34} rx={2} fill="#4a4d53" className="bd-s" />
            {v.crossMember && (
              <text x={v.tow ? 46 : 20} y={CH_BOT + 30} className="bd-dim" fill="#6f6c66">
                {v.crossMember}
              </text>
            )}
          </Pop>
        )}
        {v.tow === "drawbar" && (
          <Pop>
            <path d={`M13 ${CH_TOP + 5} l12 -6 h13 v26 h-13 l-12 -6 Z`} fill={METAL} className="bd-s" />
            <path d={`M31 ${CH_TOP - 5} v34`} stroke="#131416" strokeWidth="3" strokeLinecap="round" />
          </Pop>
        )}
        {v.tow === "pintle" && (
          <Pop>
            <path d={`M13 ${CH_TOP + 4} h10 q16 0 16 12 q0 10 -11 10 q-7 0 -7 -7`} fill="none" stroke="#131416" strokeWidth="5" strokeLinecap="round" />
            <path d={`M23 ${CH_TOP + 2} l12 -8`} stroke="#131416" strokeWidth="3.4" strokeLinecap="round" />
          </Pop>
        )}
        {v.tow === "ball" && (
          <Pop>
            <path d={`M13 ${CH_TOP + 16} h18 v-6`} stroke="#131416" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={31} cy={CH_TOP + 3} r={8} fill="url(#bd-rim)" className="bd-s" />
          </Pop>
        )}
        {v.couplings.map((c, i) => (
          <g key={i} className="bd-in">
            <rect x={-28 + i * 17} y={CH_BOT + 26} width={14} height={13} rx={2.5} fill={c === "tap" ? "#f4f3ef" : "#d6141c"} className="bd-s" />
            {c === "tap" ? (
              <path d={`M${-21 + i * 17} ${CH_BOT + 32} l5 -9`} stroke="#131416" strokeWidth="2.4" strokeLinecap="round" />
            ) : (
              Array.from({ length: c === "tri" ? 3 : 2 }, (_, k) => (
                <circle key={k} cx={-24.5 + i * 17 + k * (c === "tri" ? 3.5 : 7)} cy={CH_BOT + 32.5} r="1.5" fill="#fff" />
              ))
            )}
          </g>
        ))}
      </At>

      {/* Fittings carried on the truck, when the build is a trailer */}
      {!tipper && truckSideCount > 0 && (
        <Pop>
          <rect
            x={truckBox.x}
            y={truckBox.y}
            width={Math.min(6, truckSideCount) * 24 + 12}
            height={Math.ceil(truckSideCount / 6) * 22 + 22}
            rx={6}
            fill="rgb(255 255 255 / .5)"
            stroke="#6f6c66"
            strokeWidth="1.2"
            strokeDasharray="5 4"
          />
          <text x={truckBox.x + 7} y={truckBox.y + 10.5} className="bd-tiny" fill="#6f6c66">
            ON THE TRUCK
          </text>
        </Pop>
      )}
      {marks.map(({ g, at }) => (
        <At key={g.id} x={at[0]} y={at[1]}>
          <Pop>
            <GlyphMark g={g} />
          </Pop>
        </At>
      ))}

      </g>

      {/* Dimensions */}
      <g className="bd-dims">
        <At x={bx1} y={dimY}>
          <path d="M0 -6 V8" stroke="#6f6c66" strokeWidth="1.2" />
        </At>
        <At x={end} y={dimY}>
          <path d="M0 -6 V8" stroke="#6f6c66" strokeWidth="1.2" />
        </At>
        <Box x={bx1} y={dimY - 0.6} w={L} h={1.2} className="" fill="#6f6c66" />
        <At x={mid} y={dimY - 9}>
          <text textAnchor="middle" className="bd-dim" fill={v.length ? "#131416" : "#d6141c"}>
            {v.length ? `${v.length.toLocaleString("en-AU")} mm` : "Choose a length"}
          </text>
        </At>
        <At x={dimX} y={yT}>
          <path d="M-7 0 H7" stroke="#6f6c66" strokeWidth="1.2" />
        </At>
        <At x={dimX} y={yB}>
          <path d="M-7 0 H7" stroke="#6f6c66" strokeWidth="1.2" />
        </At>
        <Box x={dimX - 0.6} y={yT} w={1.2} h={H} className="" fill="#6f6c66" />
        <At x={dimX + 12} y={(yT + yB) / 2}>
          <text className="bd-dim" fill={v.height ? "#131416" : "#d6141c"} dominantBaseline="middle">
            {v.height ? `${v.height.toLocaleString("en-AU")}` : "Height"}
          </text>
        </At>
      </g>

      {/* The part that just changed */}
      {spot && pointed && (
        <g key={spot.n} className="bd-spot">
          <At x={pointed[0]} y={pointed[1]}>
            <circle r={13} className="bd-ring" />
            <circle r={4} fill="#d6141c" stroke="#fff" strokeWidth="1.5" />
          </At>
        </g>
      )}
    </svg>
  );
}
