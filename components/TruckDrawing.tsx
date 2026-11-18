import type { ProductId } from "@/data/configurator";

interface TruckDrawingProps {
  product: ProductId;
  setup: string;
  style?: string;
  colour: string;
  options?: string[];
  className?: string;
}

const GROUND = 318;
const WHEEL = 35;
const LINE = "rgb(255 255 255 / 0.72)";

const AXLES: Record<string, number[]> = {
  "tipper:4x2": [172, 712],
  "tipper:6x4": [172, 664, 752],
  "tipper:8x4": [172, 272, 664, 752],
  "tipper:10x4": [172, 272, 590, 678, 766],
  "dog:3-axle": [372, 700, 788],
  "dog:4-axle": [340, 428, 700, 788],
  "semi:2-axle": [716, 804],
  "semi:3-axle": [628, 716, 804],
};

function Wheel({ x }: { x: number }) {
  const y = GROUND - WHEEL;
  return (
    <g>
      <circle cx={x} cy={y} r={WHEEL} fill="#111113" stroke={LINE} strokeWidth="2" />
      <circle cx={x} cy={y} r={WHEEL * 0.56} fill="#2a2b2f" stroke={LINE} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={WHEEL * 0.2} fill="#8d9096" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={x + Math.cos((a * Math.PI) / 180) * WHEEL * 0.38}
          cy={y + Math.sin((a * Math.PI) / 180) * WHEEL * 0.38}
          r="2"
          fill="#c9cbd0"
        />
      ))}
    </g>
  );
}

function Cab() {
  return (
    <g stroke={LINE} strokeWidth="2" strokeLinejoin="round">
      <path d="M100 268 V176 Q100 124 136 116 L226 104 Q250 102 250 126 V268 Z" fill="#d9dadc" />
      <path d="M114 182 L119 146 Q121 134 136 132 L198 124 V182 Z" fill="#17181b" />
      <path d="M208 122 L238 118 V182 H208 Z" fill="#17181b" />
      <path d="M100 232 H250" fill="none" />
      <rect x="88" y="244" width="30" height="24" rx="3" fill="#1b1c1f" />
      <rect x="92" y="140" width="10" height="32" rx="3" fill="#1b1c1f" />
    </g>
  );
}

function Body({
  x1,
  x2,
  colour,
  headboard,
}: {
  x1: number;
  x2: number;
  colour: string;
  headboard?: boolean;
}) {
  return (
    <g stroke={LINE} strokeWidth="2" strokeLinejoin="round">
      {headboard && (
        <path d={`M${x1} 130 L${x1 + 6} 88 L${x1 + 40} 96 L${x1 + 34} 130 Z`} fill={colour} style={{ transition: "fill 300ms" }} />
      )}
      <path
        d={`M${x1} 126 H${x2} V226 L${x2 - 18} 244 H${x1 + 18} L${x1} 226 Z`}
        fill={colour}
        style={{ transition: "fill 300ms" }}
      />
      <path d={`M${x1 + 10} 142 H${x2 - 10}`} stroke="rgb(255 255 255 / 0.28)" fill="none" />
      <path d={`M${x1 + 10} 222 H${x2 - 10}`} stroke="rgb(0 0 0 / 0.3)" fill="none" />
      <text
        x={x2 - 24}
        y="170"
        textAnchor="end"
        fontSize="20"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="1.5"
        fill="rgb(128 128 132 / 0.95)"
        stroke="none"
      >
        ARROW
      </text>
    </g>
  );
}

/** A side elevation drawn to suit the chosen product, setup, colour and options. */
export function TruckDrawing({
  product,
  setup,
  style,
  colour,
  options = [],
  className,
}: TruckDrawingProps) {
  const has = (name: string) => options.includes(name);
  const axles = AXLES[`${product}:${setup}`] ?? [];
  const flat = product === "semi" && style === "Flat-deck";

  const bodyStart = product === "tipper" ? 290 : product === "dog" ? 262 : 150;
  const bodyEnd = product === "semi" ? 880 : 860;
  const railStart = product === "tipper" ? 110 : product === "dog" ? 262 : 130;

  return (
    <svg
      viewBox="0 0 1000 350"
      role="img"
      aria-label={`${setup} ${product === "tipper" ? "tipper body" : `${product} trailer`} drawing`}
      className={className}
    >
      <line x1="30" y1={GROUND} x2="970" y2={GROUND} stroke="rgb(255 255 255 / 0.22)" strokeWidth="2" />

      {/* Chassis */}
      <rect x={railStart} y="250" width={bodyEnd - railStart} height="16" fill="#1b1c1f" stroke={LINE} strokeWidth="2" />

      {product === "tipper" && <Cab />}

      {product === "dog" && (
        <g stroke={LINE} strokeWidth="3" fill="none">
          <path d="M262 258 L92 268" />
          <circle cx="86" cy="268" r="8" fill="#1b1c1f" />
        </g>
      )}

      {product === "semi" && (
        <g stroke={LINE} strokeWidth="2">
          <rect x="130" y="266" width="62" height="10" fill="#1b1c1f" />
          <rect x="150" y="276" width="10" height="16" fill="#8d9096" />
          <path d="M300 266 V306 M286 306 H314" fill="none" strokeWidth="4" />
        </g>
      )}

      {flat ? (
        <g stroke={LINE} strokeWidth="2">
          <rect x={bodyStart} y="214" width={bodyEnd - bodyStart} height="36" rx="3" fill={colour} style={{ transition: "fill 300ms" }} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={bodyStart + 24 + i * 112} y="196" width="8" height="18" fill="#8d9096" />
          ))}
        </g>
      ) : (
        <Body x1={bodyStart} x2={bodyEnd} colour={colour} headboard={product === "tipper"} />
      )}

      {/* Options */}
      {has("Tarp system") && !flat && (
        <path
          d={`M${bodyStart + 8} 126 Q${(bodyStart + bodyEnd) / 2} 86 ${bodyEnd - 8} 126 Z`}
          fill="#17181b"
          stroke={LINE}
          strokeWidth="2"
        />
      )}
      {has("Toolbox setup") && (
        <rect x="476" y="268" width="62" height="34" rx="3" fill="#6f7278" stroke={LINE} strokeWidth="2" />
      )}
      {has("Water tank") && (
        <rect x="372" y="268" width="88" height="34" rx="16" fill="#3a3d42" stroke={LINE} strokeWidth="2" />
      )}
      {has("Tow coupling") && (
        <g fill="none" stroke={LINE} strokeWidth="4">
          <path d={`M${bodyEnd} 258 H${bodyEnd + 34}`} />
          <circle cx={bodyEnd + 42} cy="258" r="8" fill="#1b1c1f" strokeWidth="3" />
        </g>
      )}
      {has("LED lighting") && (
        <g fill="#ffb238">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle key={i} cx={bodyStart + 34 + i * ((bodyEnd - bodyStart - 68) / 7)} cy="240" r="3.5" />
          ))}
          <rect x={bodyEnd - 8} y="228" width="10" height="14" fill="#e3140c" />
        </g>
      )}
      {has("Camera and safety systems") && (
        <rect x={bodyEnd - 22} y="108" width="22" height="16" rx="3" fill="#17181b" stroke={LINE} strokeWidth="2" />
      )}
      {has("2-way tailgate") && !flat && (
        <path d={`M${bodyEnd + 6} 128 V236`} stroke="#ff5a52" strokeWidth="6" strokeLinecap="round" />
      )}
      {has("Spreader chains") && (
        <path d={`M${bodyEnd} 150 Q${bodyEnd + 26} 200 ${bodyEnd} 244`} fill="none" stroke="#c9cbd0" strokeWidth="3" strokeDasharray="5 5" />
      )}
      {has("Access steps") && (
        <g stroke={LINE} strokeWidth="3" fill="none">
          <path d={`M${bodyStart + 14} 266 V300 M${bodyStart + 40} 266 V300 M${bodyStart + 14} 280 H${bodyStart + 40} M${bodyStart + 14} 296 H${bodyStart + 40}`} />
        </g>
      )}

      {axles.map((x) => (
        <Wheel key={x} x={x} />
      ))}

      {has("Spray suppression") &&
        axles.slice(-1).map((x) => (
          <rect key={x} x={x + WHEEL + 6} y="256" width="12" height="52" rx="2" fill="#17181b" stroke={LINE} strokeWidth="2" />
        ))}
    </svg>
  );
}
