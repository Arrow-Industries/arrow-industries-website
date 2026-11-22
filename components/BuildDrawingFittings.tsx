import type { CouplingKind, Glyph } from "@/lib/build-visual";

/**
 * The fittings of the studio look: each one drawn as the part itself, lit from
 * above like the rest of the model, and sized to the same scale (one unit is
 * ten millimetres). Every part is drawn around its own origin so the drawing
 * can put it wherever the build calls for it.
 */

const round = (n: number) => Math.round(n * 100) / 100;
const edge = { stroke: "#000", strokeOpacity: 0.5, strokeWidth: 0.6 } as const;
const BLACK = "url(#bd-r-plastic)";
const ALLOY = "url(#bd-r-alloy)";

/** Arrow's arrowhead. Drawn one unit tall, standing on its base; scale it to size. */
export function ArrowMark({ s, fill = "#e3141c" }: { s: number; fill?: string }) {
  return (
    <path
      transform={`scale(${s})`}
      fillRule="evenodd"
      d="M0 -1 L.565 0 L0 -.185 L-.565 0 Z M0 -.7 L.26 -.255 L0 -.32 L-.26 -.255 Z"
      fill={fill}
    />
  );
}

/** A small electrical or safety fitting, centred on the place it is fitted. */
export function RealGlyph({ g }: { g: Glyph }) {
  switch (g.kind) {
    case "camera": {
      const down = g.aim === "down";
      const lx = down ? 0 : g.aim === "fwd" ? -5.4 : 5.4;
      const ly = down ? 3.6 : 0;
      const view = down ? "M0 5 L-15 32 L15 32 Z" : g.aim === "fwd" ? "M-7 0 L-38 -13 L-38 13 Z" : "M7 0 L38 -13 L38 13 Z";
      return (
        <g>
          <path d={view} fill="url(#bd-r-view)" />
          <rect x={-2} y={-9.5} width={4} height={5} fill="#2a2c2f" {...edge} />
          <rect x={-5} y={-10.5} width={10} height={2.4} rx={1} fill={ALLOY} {...edge} />
          <rect x={-8} y={-5.2} width={16} height={10.4} rx={3.4} fill={BLACK} {...edge} />
          <path d="M-5.5 -3.6 H5.5" stroke="#fff" strokeOpacity=".3" strokeWidth="1" strokeLinecap="round" />
          <circle cx={lx} cy={ly} r={3.3} fill="#07080a" />
          <circle cx={lx} cy={ly} r={2.4} fill="url(#bd-r-optic)" />
          <circle cx={lx - 0.8} cy={ly - 0.9} r={0.7} fill="#fff" opacity=".9" />
        </g>
      );
    }
    case "screen": {
      const w = g.big ? 28 : 22;
      const h = g.big ? 19 : 15;
      return (
        <g>
          <path d={`M0 ${h / 2} v4.5 M-5 ${h / 2 + 4.5} h10`} fill="none" stroke="#1b1c1e" strokeWidth="2.2" strokeLinecap="round" />
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2.6} fill={BLACK} {...edge} />
          <rect x={-w / 2 + 1.8} y={-h / 2 + 1.8} width={w - 3.6} height={h - 3.6} rx={1.1} fill="url(#bd-r-screen)" />
          {/* The reversing view, with its guide lines */}
          <path d={`M${-w / 2 + 3.4} ${h / 2 - 3} L-2.4 -1 M${w / 2 - 3.4} ${h / 2 - 3} L2.4 -1`} stroke="#ffd23f" strokeWidth=".7" strokeLinecap="round" />
          <path d={`M${-w / 2 + 1.8} ${-h / 2 + 1.8} h${round((w - 3.6) * 0.55)} l-4.5 ${h - 3.6} h${round(-(w - 3.6) * 0.55 + 4.5)} Z`} fill="#fff" opacity=".13" />
        </g>
      );
    }
    case "beacon":
      return (
        <g>
          <circle cy={-9} r={19} fill="url(#bd-r-glow)" />
          <rect x={-9} y={-3.4} width={18} height={4.4} rx={1.4} fill={ALLOY} {...edge} />
          <path d="M-7 -3.4 V-10 Q-7 -16.5 0 -16.5 Q7 -16.5 7 -10 V-3.4 Z" fill="url(#bd-r-amber)" stroke="#7a4500" strokeOpacity=".6" strokeWidth=".6" />
          <path d="M-7 -6.6 H7 M-7 -9.8 H7" stroke="#a85e00" strokeOpacity=".4" strokeWidth=".5" />
          <path d="M-4.4 -5.4 V-10.4 Q-4.4 -13.6 -1.6 -14.2" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      );
    case "strobe":
      return (
        <g>
          <ellipse rx={15} ry={10} fill="url(#bd-r-glow)" />
          <rect x={-8.5} y={-4.6} width={17} height={9.2} rx={2.6} fill={ALLOY} {...edge} />
          <rect x={-6.6} y={-3} width={13.2} height={6} rx={1.6} fill="url(#bd-r-amber)" />
          <path d="M-3.3 -3 v6 M0 -3 v6 M3.3 -3 v6" stroke="#8f5200" strokeOpacity=".45" strokeWidth=".5" />
          <rect x={-5.6} y={-2.4} width={11.2} height={1.1} rx={0.55} fill="#fff" opacity=".65" />
        </g>
      );
    case "roofbar":
      // Seen from the side: one bracket, the end of the bar, and the nearest lamp in profile.
      return (
        <g>
          <path d="M-7 0 L-3.4 -9 H5.4 L9 0 Z" fill={BLACK} {...edge} />
          <path d="M-15 -24.5 Q-1 -24.5 1.6 -17 Q-1 -9.5 -15 -9.5 Z" fill={BLACK} {...edge} />
          <path d="M-11 -22.6 Q-3 -22 -0.6 -17.6" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1" strokeLinecap="round" />
          <rect x={-17.6} y={-25.6} width={3.4} height={17.2} rx={1.5} fill={ALLOY} {...edge} />
          <path d="M-18.4 -22.5 v11" stroke="#fff6cf" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx={1.6} cy={-11} r={3.5} fill={ALLOY} {...edge} />
          <circle cx={1.6} cy={-11} r={1.2} fill="#3a3d42" />
        </g>
      );
    case "aerial":
      return (
        <g>
          <rect x={-3.2} y={-5} width={6.4} height={5} rx={1.4} fill={BLACK} {...edge} />
          <rect x={-1.5} y={-12.5} width={3} height={7.5} rx={0.8} fill="#2a2c2f" />
          <path d="M-1.5 -6.6 h3 M-1.5 -8.4 h3 M-1.5 -10.2 h3" stroke="#000" strokeOpacity=".7" strokeWidth=".6" />
          <path d="M0 -12.5 Q1.6 -34 .6 -58" fill="none" stroke="#17181a" strokeWidth="1" strokeLinecap="round" />
          <circle cx={0.6} cy={-58} r={1.3} fill="#17181a" />
        </g>
      );
    case "sounder":
      return (
        <g>
          <path d="M10.5 -4 Q13 0 10.5 4 M14 -6.5 Q18 0 14 6.5" fill="none" stroke="#d6141c" strokeOpacity=".65" strokeWidth="1.1" strokeLinecap="round" />
          <rect x={-7.5} y={-6.5} width={15} height={13} rx={2.4} fill={BLACK} {...edge} />
          <path d="M-4 -3 h6 M-4 0 h8 M-4 3 h8" stroke="#000" strokeOpacity=".75" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-4 -3.7 h6 M-4 -.7 h8 M-4 2.3 h8" stroke="#fff" strokeOpacity=".2" strokeWidth=".5" strokeLinecap="round" />
          <circle cx={4.6} cy={-3.6} r={1} fill="#ff3b30" />
        </g>
      );
    case "estop":
      return (
        <g>
          <rect x={-7.5} y={-8} width={15} height={16} rx={2.2} fill="url(#bd-r-yellow)" {...edge} />
          <circle cy={0.6} r={5.6} fill="#6d0906" />
          <circle cy={-0.4} r={5} fill="url(#bd-r-red)" />
          <ellipse cx={-1.5} cy={-2.4} rx={1.9} ry={1.1} fill="#fff" opacity=".7" />
        </g>
      );
    case "switch":
      return (
        <g>
          <rect x={-6} y={-7} width={12} height={14} rx={2.2} fill={BLACK} {...edge} />
          <rect x={-4} y={-5} width={8} height={10} rx={1.3} fill="#0a0b0c" />
          <path d="M-4 -5 h8 v4.2 l-8 1.6 Z" fill="#474a4f" />
          <rect x={-2} y={1.8} width={4} height={1.5} rx={0.75} fill="#ff9a1a" />
        </g>
      );
    case "box":
      return (
        <g>
          <rect x={-9.5} y={-6.5} width={19} height={13} rx={2.2} fill={BLACK} {...edge} />
          <rect x={-7.5} y={-4.2} width={9.5} height={5.4} rx={0.9} fill="#06140a" />
          <path d="M-6 -1.5 h2.2 M-2.6 -1.5 h2.2" stroke="#58d68d" strokeWidth="1.5" />
          <circle cx={5.2} cy={-1.4} r={2.4} fill={ALLOY} {...edge} />
          <path d="M5.2 -1.4 l1.2 -1.5" stroke="#17181a" strokeWidth=".7" strokeLinecap="round" />
          <rect x={-7.5} y={3} width={15} height={1.1} rx={0.55} fill="#fff" opacity=".13" />
        </g>
      );
    case "socket":
      return (
        <g>
          <rect x={-8} y={-8} width={16} height={16} rx={2.6} fill={BLACK} {...edge} />
          <path d="M-5.6 -6.4 Q0 -11.6 5.6 -6.4 Z" fill={ALLOY} {...edge} />
          <circle r={6} fill={ALLOY} {...edge} />
          <circle r={4.3} fill="#0a0b0c" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={round(Math.cos((i * 2 * Math.PI) / 5 - Math.PI / 2) * 2.5)} cy={round(Math.sin((i * 2 * Math.PI) / 5 - Math.PI / 2) * 2.5)} r=".8" fill="#d8b25a" />
          ))}
        </g>
      );
    case "sensor":
      return (
        <g>
          <path d="M-7 0 q-5.5 0 -6.5 6.5" fill="none" stroke="#17181a" strokeWidth="1.4" strokeLinecap="round" />
          <rect x={-7.5} y={-2.8} width={11.5} height={5.6} rx={1} fill={ALLOY} {...edge} />
          <path d="M-5.2 -2.8 v5.6 M-3.2 -2.8 v5.6 M-1.2 -2.8 v5.6 M.8 -2.8 v5.6" stroke="#000" strokeOpacity=".3" strokeWidth=".5" />
          <rect x={-2.6} y={-4} width={3} height={8} rx={0.7} fill="#8d9196" {...edge} />
          <rect x={4} y={-3.1} width={4.2} height={6.2} rx={1} fill="#f08a1c" {...edge} />
          <circle cx={-6.2} cy={0} r={0.9} fill="#58d68d" />
        </g>
      );
    case "gauge":
      return (
        <g>
          <circle r={8.8} fill={ALLOY} {...edge} />
          <circle r={7} fill="#f7f6f2" />
          {[-130, -95, -60, -25, 10, 45].map((a) => (
            <path key={a} d="M0 -6.2 v1.6" transform={`rotate(${a + 45})`} stroke="#17181a" strokeWidth=".7" />
          ))}
          <path d="M0 0 L4 -4.2" stroke="#d6141c" strokeWidth="1.3" strokeLinecap="round" />
          <circle r={1.4} fill="#17181a" />
          <path d="M-5.2 -3 A6 6 0 0 1 2.8 -5.3" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case "battery":
      return (
        <g>
          <rect x={-10} y={-12.5} width={5} height={4.5} rx={1} fill="#c8102e" {...edge} />
          <rect x={5} y={-12.5} width={5} height={4.5} rx={1} fill="#2a2c2f" {...edge} />
          <rect x={-16} y={-9} width={32} height={19} rx={2.4} fill={BLACK} {...edge} />
          <rect x={-16} y={-9} width={32} height={4.6} rx={2.2} fill="#44474c" />
          <path d="M-13 -7.6 H13" stroke="#fff" strokeOpacity=".28" strokeWidth=".9" strokeLinecap="round" />
          <rect x={-11} y={-1.6} width={22} height={7.6} rx={1} fill="#f2c200" />
          <path d="M-8 2.2 h4 M-6 .2 v4 M4 2.2 h4" stroke="#17181a" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      );
    case "lamp":
      return (
        <g>
          <circle r={10} fill="url(#bd-r-glowred)" />
          <circle r={4.8} fill={ALLOY} {...edge} />
          <circle r={3.5} fill="url(#bd-r-red)" />
          <circle cx={-1} cy={-1.1} r={0.9} fill="#fff" opacity=".85" />
        </g>
      );
    default:
      // An option with no picture of its own: a plain marker where it is fitted.
      return (
        <g>
          <circle cy={0.8} r={7.4} fill="#000" opacity=".25" />
          <circle r={7} fill="#f7f6f2" stroke="#d6141c" strokeWidth="1.6" />
          <circle r={2.4} fill="#d6141c" />
        </g>
      );
  }
}

/** The headboard mast every Arrow truck body carries, lettered down its face. */
export function Mast({ paint, ink }: { paint: string; ink: string }) {
  const shape = "M-3 -2 L-3 -50 Q-3 -55 -8 -57 L-11 -58.5 Q-15 -64 -9 -68 L20 -68 Q26 -68 28 -62 L34 -40 L52 -10 L54 -2 Z";
  return (
    <g>
      <path d={shape} fill={paint} stroke="rgb(0 0 0 / .55)" strokeWidth=".8" strokeLinejoin="round" />
      <path d={shape} fill="url(#bd-r-post)" />
      <path d="M-10 -66.2 H19" stroke="rgb(255 255 255 / .5)" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M27 -61 L33 -39.4 L51 -9.4" fill="none" stroke="rgb(0 0 0 / .3)" strokeWidth="2" strokeLinejoin="round" />
      <text transform="translate(7.5 -61) rotate(90)" className="bd-mast" fill={ink}>
        ARROW
      </text>
      <path d="M11 -25 v9 m-3.2 -3.6 l3.2 3.6 l3.2 -3.6" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A foothold let into the side sheet, with Arrow's name pressed into it. */
export function StepPlate({ h, paint, ink, dark }: { h: number; paint: string; ink: string; dark: boolean }) {
  return (
    <g>
      <rect width={46} height={h} rx={2} fill={paint} stroke="rgb(0 0 0 / .6)" strokeWidth=".7" />
      <rect width={46} height={h} rx={2} fill="url(#bd-r-recess)" opacity={dark ? 1 : 0.4} />
      <rect x={1.2} y={h - 2.2} width={43.6} height={1.5} rx={0.75} fill="#fff" opacity=".3" />
      {h >= 7.5 && (
        <text x={21} y={h / 2 + 2.2} textAnchor="middle" className="bd-plate" fill={ink}>
          ARROW
        </text>
      )}
      {h >= 7.5 && <path d={`M33.5 ${h / 2 - 1.8} l3.2 1.8 l-3.2 1.8 Z`} fill={ink} />}
    </g>
  );
}

/** The handwheel that winds a manual tarp. */
export function TarpWheel() {
  return (
    <g>
      <rect x={-2} y={-2} width={13} height={4} rx={1.4} fill="#2a2c2f" {...edge} />
      <circle r={7.2} fill="none" stroke="#000" strokeOpacity=".5" strokeWidth="3" />
      <circle r={7.2} fill="none" stroke="#d6d9dc" strokeWidth="2" />
      <path d="M-5.2 -5 A7.2 7.2 0 0 1 4 -6" fill="none" stroke="#fff" strokeWidth=".8" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d="M0 -1.6 V-6.4" transform={`rotate(${a})`} stroke="#b4b8bc" strokeWidth="1.3" strokeLinecap="round" />
      ))}
      <circle r={2.3} fill="url(#bd-r-dome)" {...edge} />
      <circle cx={0} cy={-7.2} r={1.5} fill="#17181a" />
    </g>
  );
}

/** The electric motor that drives the tarp, with its cable down to the chassis. */
export function TarpMotor() {
  return (
    <g>
      <path d="M-2 5 q-6 3 -5 12" fill="none" stroke="#17181a" strokeWidth="1.5" strokeLinecap="round" />
      <rect x={-9} y={-5.5} width={15} height={11} rx={3} fill={BLACK} {...edge} />
      <path d="M-6 -3.6 H3" stroke="#fff" strokeOpacity=".3" strokeWidth="1" strokeLinecap="round" />
      <path d="M-4.5 -5.5 v11 M-1.5 -5.5 v11" stroke="#000" strokeOpacity=".45" strokeWidth=".6" />
      <rect x={5} y={-4.4} width={5} height={8.8} rx={1.4} fill={ALLOY} {...edge} />
      <circle cx={7.5} cy={0} r={1.5} fill="#3a3d42" />
      <circle cx={-6.4} cy={2.6} r={0.9} fill="#58d68d" />
    </g>
  );
}

/** A mudflap, hung behind the wheels and carrying the arrowhead. */
export function Mudflap() {
  return (
    <g>
      <rect x={-1.5} y={-3.5} width={14} height={4.5} rx={1.2} fill="#2a2c2f" {...edge} />
      <rect width={11} height={54} rx={1.5} fill="url(#bd-r-flap)" {...edge} />
      <g transform="translate(5.5 33)">
        <ArrowMark s={8.4} />
      </g>
      <rect x={1.6} y={35.6} width={7.8} height={1.7} rx={0.4} fill="#fff" opacity=".88" />
      <rect x={0} y={49.6} width={11} height={2.4} fill={ALLOY} opacity=".85" />
    </g>
  );
}

/** A hydraulic oil tank, strapped to the chassis. */
export function OilTank({ w }: { w: number }) {
  return (
    <g>
      <rect x={round(w * 0.42)} y={-5} width={11} height={6} rx={2} fill={ALLOY} {...edge} />
      <rect width={w} height={36} rx={5} fill={BLACK} {...edge} />
      <path d={`M7 4.6 H${w - 7}`} stroke="#fff" strokeOpacity=".32" strokeWidth="1.3" strokeLinecap="round" />
      <rect x={round(w * 0.14)} y={-1} width={4} height={38} rx={1.2} fill={ALLOY} {...edge} />
      <rect x={round(w * 0.62)} y={-1} width={4} height={38} rx={1.2} fill={ALLOY} {...edge} />
      <rect x={w - 10.5} y={8} width={3.6} height={21} rx={1.8} fill="#f5ecc4" {...edge} />
      <rect x={w - 10.5} y={15} width={3.6} height={14} rx={1.8} fill="#d99a16" />
    </g>
  );
}

/** The same tank stood upright behind the cab. */
export function OilTankUpright({ h }: { h: number }) {
  return (
    <g>
      <rect x={5} y={-5.5} width={10} height={6.5} rx={2} fill={ALLOY} {...edge} />
      <rect width={20} height={h} rx={5} fill="#1c1d1f" {...edge} />
      <rect width={20} height={h} rx={5} fill="url(#bd-r-post)" />
      <rect x={-1} y={round(h * 0.2)} width={22} height={3.6} rx={1.2} fill={ALLOY} {...edge} />
      <rect x={-1} y={round(h * 0.72)} width={22} height={3.6} rx={1.2} fill={ALLOY} {...edge} />
      <rect x={12.6} y={round(h * 0.3)} width={3.4} height={round(h * 0.36)} rx={1.7} fill="#f5ecc4" {...edge} />
      <rect x={12.6} y={round(h * 0.42)} width={3.4} height={round(h * 0.24)} rx={1.7} fill="#d99a16" />
    </g>
  );
}

/** Arrow's black toolbox, with the arrowhead on its door. */
export function Toolbox({ w }: { w: number }) {
  return (
    <g>
      <rect width={w} height={38} rx={3} fill={BLACK} {...edge} />
      <rect x={2} y={2} width={w - 4} height={34} rx={2} fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth=".8" />
      <path d={`M5 3.6 H${w - 5}`} stroke="#fff" strokeOpacity=".28" strokeWidth="1.1" strokeLinecap="round" />
      <rect x={w / 2 - 5.5} y={6} width={11} height={6.4} rx={1.6} fill={ALLOY} {...edge} />
      <rect x={w / 2 - 3.4} y={8} width={6.8} height={2.2} rx={1.1} fill="#17181a" />
      <g transform={`translate(${round(w / 2)} 31)`}>
        <ArrowMark s={13} />
      </g>
    </g>
  );
}

/** A poly water tank with its tap. */
export function WaterTank({ w }: { w: number }) {
  return (
    <g>
      <rect x={w / 2 - 5.5} y={-4.5} width={11} height={5.5} rx={1.8} fill="#2f6fd0" {...edge} />
      <rect width={w} height={34} rx={12} fill="url(#bd-r-poly)" {...edge} />
      <path d={`M${round(w * 0.3)} 1 V33 M${round(w * 0.7)} 1 V33`} stroke="#8fa2b3" strokeOpacity=".55" strokeWidth="1.2" />
      <path d={`M11 5.4 H${w - 11}`} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${w - 8} 29 v8.5 h6.5`} fill="none" stroke="#7a5d14" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${w - 8} 29 v8.5 h6.5`} fill="none" stroke="#d2ab4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${w - 8} 33 h-5`} stroke="#d6141c" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

/** A slide-out ladder, stowed in its tray under the body. */
export function SlideLadder({ w }: { w: number }) {
  return (
    <g>
      <rect width={w} height={12.5} rx={2} fill={BLACK} {...edge} />
      <rect x={2.5} y={2} width={w - 5} height={8.5} rx={1} fill="#060607" />
      {Array.from({ length: Math.max(0, Math.floor((w - 12) / 9)) }, (_, i) => (
        <rect key={i} x={7 + i * 9} y={3.6} width={2.4} height={5.4} fill="#aab0b5" />
      ))}
      <rect x={3.5} y={2.6} width={w - 7} height={2.2} rx={1.1} fill={ALLOY} />
      <rect x={3.5} y={7.8} width={w - 7} height={2.2} rx={1.1} fill={ALLOY} />
      <rect x={w - 2.5} y={3.4} width={5.5} height={5.6} rx={1.6} fill="#c8102e" {...edge} />
    </g>
  );
}

/** A drop-down ladder: rails hooked over the top rail, rungs to the ground. */
export function DropLadder({ top, bottom }: { top: number; bottom: number }) {
  const rungs = Math.max(0, Math.floor((bottom - top - 14) / 17));
  return (
    <g>
      {[-21.6, -1.6].map((x) => (
        <g key={x}>
          <path d={`M${x + 1.6} ${top + 4} v-7 q0 -4 4 -4 h3`} fill="none" stroke="#000" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
          <path d={`M${x + 1.6} ${top + 4} v-7 q0 -4 4 -4 h3`} fill="none" stroke="#cfd3d6" strokeWidth="2.6" strokeLinecap="round" />
          <rect x={x} y={top} width={3.2} height={bottom - top} rx={1.4} fill="url(#bd-metal)" {...edge} />
          <rect x={x - 0.6} y={bottom - 3} width={4.4} height={4.4} rx={1.2} fill="#17181a" />
        </g>
      ))}
      {Array.from({ length: rungs }, (_, i) => (
        <g key={i}>
          <rect x={-18.4} y={top + 12 + i * 17} width={16.8} height={2.8} rx={1.2} fill={ALLOY} {...edge} />
          <rect x={-18.4} y={top + 15.2 + i * 17} width={16.8} height={1.2} fill="#000" opacity=".22" />
        </g>
      ))}
    </g>
  );
}

/** The shovel in its holder, blade down. */
export function Shovel({ reach }: { reach: number }) {
  return (
    <g>
      <path d="M-4.6 9 v-5 q0 -3.4 4.6 -3.4 q4.6 0 4.6 3.4 v5" fill="none" stroke="#17181a" strokeWidth="2.2" strokeLinecap="round" />
      <rect x={-1.6} y={7} width={3.2} height={Math.max(0, reach - 5)} rx={1.4} fill="url(#bd-r-wood)" {...edge} />
      <rect x={-4.4} y={round(reach * 0.3)} width={8.8} height={3.4} rx={1.2} fill={ALLOY} {...edge} />
      <rect x={-4.4} y={round(reach * 0.72)} width={8.8} height={3.4} rx={1.2} fill={ALLOY} {...edge} />
      <g transform={`translate(0 ${reach})`}>
        <path d="M-1.8 -4 h3.6 v4 h4.2 l-1.6 13 q-4.4 5.6 -8.8 0 l-1.6 -13 h4.2 Z" fill="url(#bd-metal)" {...edge} />
        <path d="M0 1 V14" stroke="#000" strokeOpacity=".2" strokeWidth=".8" />
      </g>
    </g>
  );
}

/** The engineer's compliance plate, riveted to the chassis. */
export function VassPlate() {
  return (
    <g>
      <rect width={34} height={13} rx={1.6} fill={ALLOY} {...edge} />
      {[2.6, 31.4].flatMap((x) => [2.6, 10.4].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={0.9} fill="#5d6166" />))}
      <text x={17} y={9.4} textAnchor="middle" className="bd-tiny" fill="#131416">
        VASS
      </text>
    </g>
  );
}

/** The hydraulic pump on the gearbox's power take-off. */
export function PtoPump({ existing }: { existing: boolean }) {
  return (
    <g>
      <circle r={8.8} fill={existing ? "#3a3d42" : "url(#bd-r-dish)"} {...edge} strokeDasharray={existing ? "2.6 2" : undefined} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={round(Math.cos((a * Math.PI) / 180) * 6.4)} cy={round(Math.sin((a * Math.PI) / 180) * 6.4)} r={0.9} fill="#2a2c2f" />
      ))}
      <circle r={2.8} fill="#17181a" />
      <rect x={6} y={-8} width={17} height={16} rx={3} fill="#b3121a" {...edge} />
      <rect x={6} y={-8} width={17} height={16} rx={3} fill="url(#bd-r-tube)" />
      <path d="M11 -8 v16 M18 -8 v16" stroke="#000" strokeOpacity=".28" strokeWidth=".7" />
      <rect x={12} y={-11.5} width={5.5} height={4.5} rx={1} fill={ALLOY} {...edge} />
    </g>
  );
}

/** The module that tells the truck its power take-off is fitted. */
export function PtoModule() {
  return (
    <g>
      <rect x={-6} y={7.5} width={12} height={4.5} rx={1} fill="#17181a" />
      <rect x={-10} y={-8} width={20} height={16} rx={2} fill={ALLOY} {...edge} />
      <path d="M-7 -5 h14 M-7 -2.2 h14 M-7 .6 h14" stroke="#000" strokeOpacity=".28" strokeWidth=".7" />
      <path d="M-7 -4.3 h14 M-7 -1.5 h14 M-7 1.3 h14" stroke="#fff" strokeOpacity=".6" strokeWidth=".5" />
      <circle cx={6.4} cy={4.8} r={1.1} fill="#58d68d" />
    </g>
  );
}

/** The wireless handset for the hoist, in its cradle. */
export function RemoteHandset() {
  return (
    <g>
      <rect x={-8.5} y={-1} width={17} height={15} rx={2.6} fill={BLACK} {...edge} />
      <rect x={-1.5} y={-17.5} width={3} height={6} rx={1.3} fill="#17181a" />
      <rect x={-6.5} y={-13} width={13} height={24} rx={4} fill="url(#bd-r-yellow)" {...edge} />
      <path d="M-4.3 -9.5 V7" stroke="#fff" strokeOpacity=".5" strokeWidth="1" strokeLinecap="round" />
      <circle cy={-6.4} r={2.7} fill="url(#bd-r-red)" {...edge} />
      <circle cy={0.4} r={2.1} fill="#17181a" />
      <circle cy={6} r={2.1} fill="#2f9e5b" />
    </g>
  );
}

/** The hoist switches on the dash, seen through the glass. */
export function DashSwitches() {
  return (
    <g>
      <rect x={-18} y={-7.5} width={36} height={15} rx={2.6} fill={BLACK} {...edge} />
      {[-10.4, 0, 10.4].map((x, i) => (
        <g key={x}>
          <rect x={x - 3.5} y={-4.8} width={7} height={9.6} rx={1.2} fill="#08090a" />
          <path d={`M${x - 3.5} -4.8 h7 v4 l-7 1.5 Z`} fill="#474a4f" />
          <rect x={x - 1.7} y={1.9} width={3.4} height={1.4} rx={0.7} fill={i === 1 ? "#ff9a1a" : "#ff3b30"} />
        </g>
      ))}
    </g>
  );
}

/** The marker lamp at the very rear of the chassis. */
export function RearLamp() {
  return (
    <g>
      <rect x={-4} y={-0.6} width={10} height={15.2} rx={2.4} fill={BLACK} {...edge} />
      <rect x={-2.6} y={0.8} width={7.2} height={8} rx={1.6} fill="url(#bd-r-red)" />
      <rect x={-2.6} y={9.6} width={7.2} height={3.6} rx={1.4} fill="url(#bd-r-amber)" />
      <rect x={-1.8} y={1.5} width={1.3} height={6.4} rx={0.65} fill="#fff" opacity=".5" />
    </g>
  );
}

/** A towing coupling on the rear cross member. `top` is the top of the chassis rail. */
export function TowCoupling({ kind, top }: { kind: "drawbar" | "pintle" | "ball"; top: number }) {
  if (kind === "drawbar") {
    const body = `M13 ${top + 4} h10 l15 -9 v30 l-15 -9 h-10 Z`;
    return (
      <g>
        <path d={body} fill="#3e4146" {...edge} />
        <path d={body} fill="url(#bd-r-tube)" />
        <path d={`M30 ${top + 1.6} l8 -4.8 v26.4 l-8 -4.8 Z`} fill="#08090a" />
        <rect x={23.6} y={top - 17} width={5} height={24} rx={2} fill="url(#bd-metal)" {...edge} />
        <path d={`M26 ${top - 16} h10.5`} stroke="#000" strokeOpacity=".5" strokeWidth="4.2" strokeLinecap="round" />
        <path d={`M26 ${top - 16} h10.5`} stroke="#c8102e" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    );
  }
  if (kind === "pintle") {
    const hook = `M17 ${top + 20} h9 q13 0 13 -10.5 q0 -6.5 -6.5 -6.5`;
    return (
      <g>
        <rect x={13} y={top - 3} width={6.5} height={31} rx={1.6} fill="#3e4146" {...edge} />
        <rect x={13} y={top - 3} width={6.5} height={31} rx={1.6} fill="url(#bd-r-post)" />
        <path d={hook} fill="none" stroke="#0c0d0e" strokeWidth="7.4" strokeLinecap="round" />
        <path d={hook} fill="none" stroke="#54585d" strokeWidth="5" strokeLinecap="round" />
        <path d={`M19 ${top + 18.6} h8 q10.5 0 11 -8`} fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1" strokeLinecap="round" />
        <path d={`M18 ${top + 3} h9 l8.5 -4`} fill="none" stroke="#0c0d0e" strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M18 ${top + 3} h9 l8.5 -4`} fill="none" stroke="#c8102e" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={20.5} cy={top + 3} r={1.5} fill="#d9dbdd" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M13 ${top + 18} h20 v-9`} fill="none" stroke="#0c0d0e" strokeWidth="7.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M13 ${top + 18} h20 v-9`} fill="none" stroke="#484b50" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={27} y={top + 7.4} width={12} height={3.2} rx={1.2} fill={ALLOY} {...edge} />
      <circle cx={33} cy={top + 0.5} r={8.6} fill="url(#bd-r-dome)" {...edge} />
      <ellipse cx={30.2} cy={top - 2.8} rx={2.8} ry={1.8} fill="#fff" opacity=".85" />
    </g>
  );
}

/** A trailer connection at the rear: three or two lines, or a plain tap. */
export function RearCoupling({ kind }: { kind: CouplingKind }) {
  if (kind === "tap") {
    return (
      <g>
        <rect x={1} y={5} width={12} height={6} rx={1.6} fill="#c9a23f" {...edge} />
        <rect x={4} y={2.6} width={6} height={10.8} rx={1.6} fill="#d8b25a" {...edge} />
        <circle cx={7} cy={8} r={1.8} fill="#8a6b1f" />
        <path d="M7 8 l6.4 -7.6" stroke="#000" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
        <path d="M7 8 l6.4 -7.6" stroke="#c8102e" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    );
  }
  const ports = kind === "tri" ? [3.4, 7, 10.6] : [4.4, 9.6];
  return (
    <g>
      <rect width={14} height={13} rx={2.4} fill={ALLOY} {...edge} />
      {ports.map((x) => (
        <g key={x}>
          <circle cx={x} cy={7.6} r={kind === "tri" ? 1.5 : 1.9} fill="#0c0d0e" />
          <circle cx={x} cy={7.6} r={kind === "tri" ? 0.6 : 0.8} fill="#d8b25a" />
        </g>
      ))}
      <path d="M1.2 -.4 h11.6" stroke="#000" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
      <path d="M1.2 -.4 h11.6" stroke="#c8102e" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

/** A semi trailer's kingpin and skid plate. Drawn from the underside of the chassis. */
export function Kingpin() {
  return (
    <g>
      <rect x={-56} y={0} width={112} height={8} rx={2} fill="#3e4146" {...edge} />
      <rect x={-56} y={0} width={112} height={8} rx={2} fill="url(#bd-r-tube)" />
      <rect x={-7} y={8} width={14} height={3.4} rx={1} fill={ALLOY} {...edge} />
      <path d="M-3.6 11.4 h7.2 v5 h1.8 v6 h-10.8 v-6 h1.8 Z" fill="url(#bd-metal)" {...edge} />
    </g>
  );
}

/** A semi trailer's landing leg, wound down to the ground. `drop` is its full reach. */
export function LandingLeg({ drop }: { drop: number }) {
  const outer = round(drop * 0.62);
  return (
    <g>
      <path d={`M3 ${round(outer * 0.4)} L44 0`} stroke="#0c0d0e" strokeWidth="5.4" strokeLinecap="round" />
      <path d={`M3 ${round(outer * 0.4)} L44 0`} stroke="#3e4146" strokeWidth="3.4" strokeLinecap="round" />
      <rect x={-3.6} y={outer - 6} width={7.2} height={drop - outer} rx={1} fill="url(#bd-metal)" {...edge} />
      <rect x={-6} y={0} width={12} height={outer} rx={1.6} fill="#232528" {...edge} />
      <rect x={-6} y={0} width={12} height={outer} rx={1.6} fill="url(#bd-r-post)" />
      <rect x={-9} y={4} width={18} height={13} rx={2} fill={BLACK} {...edge} />
      <path d="M9 10.5 h9 v9 h6" fill="none" stroke="#000" strokeOpacity=".5" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10.5 h9 v9 h6" fill="none" stroke="#cfd3d6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cy={drop - 7} r={2.6} fill="#17181a" />
      <path d={`M-14 ${drop} l3 -6 h22 l3 6 Z`} fill="#232528" {...edge} />
      <path d={`M-10.4 ${drop - 5} h20.8`} stroke="#fff" strokeOpacity=".3" strokeWidth=".9" strokeLinecap="round" />
    </g>
  );
}
