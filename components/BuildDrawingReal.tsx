/**
 * The studio look for the build drawing: the same parts in the same places,
 * drawn as lit, painted metal rather than as outlines. Light comes from above
 * and a little in front; glossy panels pick up a pale sky and a darker floor.
 */

const G = 400;
const R = 52;
const round = (n: number) => Math.round(n * 100) / 100;

export function RealDefs({ floorTop, floorBottom }: { floorTop: number; floorBottom: number }) {
  return (
    <>
      <radialGradient id="bd-r-tyre">
        <stop offset="0" stopColor="#0b0b0c" />
        <stop offset=".58" stopColor="#111213" />
        <stop offset=".74" stopColor="#2a2c2f" />
        <stop offset=".88" stopColor="#17181a" />
        <stop offset="1" stopColor="#09090a" />
      </radialGradient>
      <linearGradient id="bd-r-alloy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".26" stopColor="#dde0e3" />
        <stop offset=".5" stopColor="#9a9fa4" />
        <stop offset=".62" stopColor="#cdd1d4" />
        <stop offset="1" stopColor="#7a7f84" />
      </linearGradient>
      <radialGradient id="bd-r-dish" cx=".5" cy=".42">
        <stop offset="0" stopColor="#5f646a" />
        <stop offset=".62" stopColor="#a9aeb3" />
        <stop offset="1" stopColor="#eceef0" />
      </radialGradient>
      <radialGradient id="bd-r-dome" cx=".42" cy=".36">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".6" stopColor="#b9bec3" />
        <stop offset="1" stopColor="#80858a" />
      </radialGradient>
      {/* Gloss on a flat painted panel: pale sky above the horizon, floor below it. */}
      <linearGradient id="bd-r-gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".36" />
        <stop offset=".2" stopColor="#fff" stopOpacity=".12" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".02" />
        <stop offset=".53" stopColor="#000" stopOpacity=".1" />
        <stop offset="1" stopColor="#000" stopOpacity=".32" />
      </linearGradient>
      {/* A round rail or tube, lit from above. */}
      <linearGradient id="bd-r-tube" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".18" />
        <stop offset=".28" stopColor="#fff" stopOpacity=".5" />
        <stop offset=".6" stopColor="#000" stopOpacity=".06" />
        <stop offset="1" stopColor="#000" stopOpacity=".42" />
      </linearGradient>
      {/* An upright post, lit from the front. */}
      <linearGradient id="bd-r-post" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".28" />
        <stop offset=".3" stopColor="#fff" stopOpacity=".28" />
        <stop offset=".65" stopColor="#000" stopOpacity=".04" />
        <stop offset="1" stopColor="#000" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id="bd-r-cabpaint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".34" stopColor="#f5f4f1" />
        <stop offset=".56" stopColor="#e9e7e3" />
        <stop offset=".6" stopColor="#dcdad5" />
        <stop offset="1" stopColor="#c2bfb9" />
      </linearGradient>
      <linearGradient id="bd-r-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9db0bf" />
        <stop offset=".32" stopColor="#4a5863" />
        <stop offset=".7" stopColor="#1a2026" />
        <stop offset="1" stopColor="#0c0f12" />
      </linearGradient>
      <linearGradient id="bd-r-plastic" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4b4e53" />
        <stop offset=".5" stopColor="#26282b" />
        <stop offset="1" stopColor="#131415" />
      </linearGradient>
      <linearGradient id="bd-r-rail" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5a5d62" />
        <stop offset=".14" stopColor="#303236" />
        <stop offset="1" stopColor="#151617" />
      </linearGradient>
      <linearGradient id="bd-r-edge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".2" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="bd-r-lens">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".6" stopColor="#dbe6ef" />
        <stop offset="1" stopColor="#9fb0bf" />
      </radialGradient>
      <linearGradient id="bd-r-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#edebe7" />
        <stop offset=".7" stopColor="#e3e0da" />
        <stop offset="1" stopColor="#d3cfc8" />
      </linearGradient>
      <linearGradient id="bd-r-floor" x1="0" y1={floorTop} x2="0" y2={floorBottom} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#bdb9b1" />
        <stop offset=".3" stopColor="#d2cec7" />
        <stop offset="1" stopColor="#e9e7e2" />
      </linearGradient>
      <linearGradient id="bd-r-fadeg" x1="0" y1={floorTop} x2="0" y2={floorTop + 70} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity=".55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <pattern id="bd-r-brush" width="2.2" height="14" patternUnits="userSpaceOnUse">
        <rect width="2.2" height="14" fill="#0c0d0e" />
        <path d="M1.1 0 V14" stroke="#34373b" strokeWidth=".7" />
      </pattern>
      {/* Lenses, lamps and screens */}
      <radialGradient id="bd-r-amber" cx=".4" cy=".34">
        <stop offset="0" stopColor="#fff1bd" />
        <stop offset=".5" stopColor="#ffab1e" />
        <stop offset="1" stopColor="#d27600" />
      </radialGradient>
      <radialGradient id="bd-r-red" cx=".4" cy=".34">
        <stop offset="0" stopColor="#ff9a8f" />
        <stop offset=".5" stopColor="#e3140c" />
        <stop offset="1" stopColor="#96090a" />
      </radialGradient>
      <radialGradient id="bd-r-glow">
        <stop offset="0" stopColor="#ffb020" stopOpacity=".5" />
        <stop offset="1" stopColor="#ffb020" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bd-r-glowred">
        <stop offset="0" stopColor="#ff3b30" stopOpacity=".5" />
        <stop offset="1" stopColor="#ff3b30" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="bd-r-optic" cx=".38" cy=".34">
        <stop offset="0" stopColor="#c4dcff" />
        <stop offset=".55" stopColor="#2b5fb0" />
        <stop offset="1" stopColor="#09182f" />
      </radialGradient>
      <radialGradient id="bd-r-view">
        <stop offset="0" stopColor="#6aa4ff" stopOpacity=".3" />
        <stop offset="1" stopColor="#6aa4ff" stopOpacity=".04" />
      </radialGradient>
      <linearGradient id="bd-r-screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a9cdf5" />
        <stop offset=".5" stopColor="#6f8fa8" />
        <stop offset=".52" stopColor="#4c5560" />
        <stop offset="1" stopColor="#23272c" />
      </linearGradient>
      {/* Painted, moulded and natural finishes */}
      <linearGradient id="bd-r-yellow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe768" />
        <stop offset=".45" stopColor="#f2c200" />
        <stop offset="1" stopColor="#c09200" />
      </linearGradient>
      <linearGradient id="bd-r-poly" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset=".5" stopColor="#e3e9ee" />
        <stop offset="1" stopColor="#b4c0ca" />
      </linearGradient>
      <linearGradient id="bd-r-wood" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8a5a2b" />
        <stop offset=".4" stopColor="#e2b47f" />
        <stop offset="1" stopColor="#8f5f2f" />
      </linearGradient>
      <linearGradient id="bd-r-flap" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0b0c0d" />
        <stop offset=".4" stopColor="#303236" />
        <stop offset="1" stopColor="#0e0f10" />
      </linearGradient>
      {/* A pocket let into a panel: dark under its top edge, catching light at the bottom. */}
      <linearGradient id="bd-r-recess" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".62" />
        <stop offset=".5" stopColor="#000" stopOpacity=".38" />
        <stop offset="1" stopColor="#000" stopOpacity=".2" />
      </linearGradient>
      <pattern id="bd-r-chequer" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#c9cdd1" />
        <path d="M.8 2.6 L2.6 .8 M3.8 5.6 L5.6 3.8" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M1.2 3 L3 1.2 M4.2 6 L6 4.2" stroke="#6f747a" strokeWidth=".6" strokeLinecap="round" />
      </pattern>
      <filter id="bd-r-blur" x="-30%" y="-150%" width="160%" height="400%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="bd-r-blur2" x="-10%" y="-300%" width="120%" height="700%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </>
  );
}

/** A truck wheel: tyre, polished alloy rim, and a steer or drive hub. */
export function RealWheel({ steer, trailer }: { steer: boolean; trailer?: boolean }) {
  const ten = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <g>
      <ellipse cy={R - 1} rx={47} ry={6} fill="#000" opacity=".5" filter="url(#bd-r-blur)" />
      <circle r={R} fill="url(#bd-r-tyre)" />
      <circle r={R - 1.3} fill="none" stroke="#000" strokeOpacity=".7" strokeWidth="2.6" strokeDasharray="2.6 2.1" />
      <circle r={45.5} fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth=".9" />
      <circle r={38.5} fill="none" stroke="#fff" strokeOpacity=".045" strokeWidth="5" />
      <path d="M-38.97 -18.17 A43 43 0 0 1 38.97 -18.17" fill="none" stroke="#fff" strokeOpacity=".15" strokeWidth="7" strokeLinecap="round" />
      <circle r={33.4} fill="#070708" />
      <circle r={31.6} fill="url(#bd-r-alloy)" />
      <circle r={28} fill={steer ? "url(#bd-r-dome)" : "url(#bd-r-dish)"} stroke="#000" strokeOpacity=".28" strokeWidth=".8" />
      {ten.map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <ellipse cx={0} cy={-20.5} rx={3.1} ry={4.5} fill="#0e0f10" />
          <path d="M-2.4 -17.4 Q0 -15.6 2.4 -17.4" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth=".8" />
        </g>
      ))}
      {steer ? (
        <>
          {ten.map((a) => (
            <circle key={a} cx={round(Math.cos((a * Math.PI) / 180) * 12.6)} cy={round(Math.sin((a * Math.PI) / 180) * 12.6)} r={1.7} fill="#f3f4f5" stroke="#4d5156" strokeWidth=".5" />
          ))}
          <circle r={8.6} fill="url(#bd-r-dome)" stroke="#000" strokeOpacity=".35" strokeWidth=".7" />
          <circle cx={-2.4} cy={-2.8} r={2.2} fill="#fff" opacity=".8" />
        </>
      ) : (
        <>
          <circle r={14.4} fill="#2a2c2f" stroke="#000" strokeOpacity=".5" strokeWidth=".8" />
          {ten.map((a) => (
            <circle key={a} cx={round(Math.cos((a * Math.PI) / 180) * 11.4)} cy={round(Math.sin((a * Math.PI) / 180) * 11.4)} r={1.5} fill="#d9dbdd" stroke="#34373b" strokeWidth=".5" />
          ))}
          <circle r={7.4} fill="#17181a" />
          <circle r={4.6} fill={trailer ? "#c8102e" : "url(#bd-r-dome)"} />
          {trailer && <circle cx={-1.2} cy={-1.4} r={1.3} fill="#fff" opacity=".55" />}
        </>
      )}
    </g>
  );
}

const CAB_SHELL = `M4 ${G - 70} L4 ${G - 188} Q5 ${G - 204} 12 ${G - 216} L32 ${G - 286} Q36 ${G - 297} 50 ${G - 297} L210 ${G - 297} Q222 ${G - 297} 222 ${G - 285} L222 ${G - 70} L197 ${G - 70} A60 60 0 0 0 83 ${G - 70} Z`;

const seam = "rgb(0 0 0 / .4)";
const shine = "rgb(255 255 255 / .75)";

/** A cab-over cab in white, as it leaves the dealer. No maker's badge: bodies suit any truck. */
export function RealCab() {
  return (
    <g>
      <defs>
        <clipPath id="bd-r-cabclip">
          <path d={CAB_SHELL} />
        </clipPath>
        <clipPath id="bd-r-doorglass">
          <path d={`M56 ${G - 214} L56 ${G - 276} Q56 ${G - 286} 67 ${G - 286} L147 ${G - 286} L147 ${G - 214} Z`} />
        </clipPath>
      </defs>

      {/* Bumper and fog lamp */}
      <path
        d={`M-4 ${G - 78} Q-4 ${G - 86} 5 ${G - 86} L46 ${G - 86} L46 ${G - 40} L6 ${G - 40} Q-4 ${G - 40} -4 ${G - 50} Z`}
        fill="url(#bd-r-plastic)"
        stroke={seam}
        strokeWidth=".8"
      />
      <rect x={4} y={G - 68} width={17} height={10} rx={3} fill="url(#bd-r-lens)" stroke="#000" strokeOpacity=".5" strokeWidth=".7" />
      <path d={`M-3 ${G - 74} H44`} stroke="#fff" strokeOpacity=".16" strokeWidth="1" />

      {/* Shell */}
      <path d={CAB_SHELL} fill="url(#bd-r-cabpaint)" stroke={seam} strokeWidth=".9" />
      <g clipPath="url(#bd-r-cabclip)">
        <rect x={0} y={G - 300} width={30} height={240} fill="url(#bd-r-edge)" />
        <rect x={196} y={G - 300} width={26} height={240} fill="url(#bd-r-edge)" transform={`rotate(180 209 ${G - 180})`} opacity=".7" />
        <rect x={0} y={G - 122} width={230} height={60} fill="#000" opacity=".06" />
        <path d={`M6 ${G - 152} H222`} stroke="#000" strokeOpacity=".16" strokeWidth="1" />
        <path d={`M6 ${G - 150.6} H222`} stroke={shine} strokeWidth=".9" />
        <path d={`M48 ${G - 296} H214`} stroke="#fff" strokeWidth="1.6" />
      </g>

      {/* Corner vane, headlamp and indicator */}
      <path d={`M6 ${G - 198} L20 ${G - 200} L20 ${G - 120} L6 ${G - 120} Z`} fill="#d6d4cf" stroke={seam} strokeWidth=".7" />
      <rect x={10.5} y={G - 192} width={4.5} height={66} rx={2.2} fill="#1d1f22" />
      <rect x={4.5} y={G - 116} width={21} height={29} rx={4.5} fill="#151618" />
      <rect x={7} y={G - 113.5} width={16} height={15} rx={3} fill="url(#bd-r-lens)" />
      <rect x={7} y={G - 96} width={16} height={6.5} rx={2.4} fill="#ff9a1a" />

      {/* Step well */}
      <rect x={46} y={G - 104} width={37} height={62} rx={3} fill="#0d0e0f" />
      <rect x={48} y={G - 84} width={33} height={4.5} rx={1.5} fill="#7b7f84" />
      <rect x={48} y={G - 57} width={33} height={4.5} rx={1.5} fill="#7b7f84" />
      <path d={`M48 ${G - 84} h33 M48 ${G - 57} h33`} stroke="#fff" strokeOpacity=".5" strokeWidth=".8" />

      {/* Wheel arch flare */}
      <path
        d={`M74 ${G - 72.2} A69 69 0 0 1 206 ${G - 72.2} L197.4 ${G - 69.5} A60 60 0 0 0 82.6 ${G - 69.5} Z`}
        fill="url(#bd-r-plastic)"
        stroke="#000"
        strokeOpacity=".5"
        strokeWidth=".7"
      />

      {/* Door: seams, handle */}
      <path d={`M50 ${G - 208} V${G - 105} M153 ${G - 292} V${G - 118} M50 ${G - 292} H153`} fill="none" stroke={seam} strokeWidth="1" />
      <path d={`M51.3 ${G - 208} V${G - 105} M154.3 ${G - 292} V${G - 118}`} fill="none" stroke={shine} strokeWidth=".8" />
      <rect x={129} y={G - 201} width={22} height={10} rx={3.5} fill="#131415" />
      <rect x={132} y={G - 198.2} width={16} height={3.4} rx={1.7} fill="url(#bd-r-alloy)" />

      {/* Glass, with the cab's interior just visible */}
      <path d={`M13 ${G - 214} L33 ${G - 284} L46 ${G - 288} L46 ${G - 214} Z`} fill="url(#bd-r-glass)" stroke="#0a0b0c" strokeWidth="1.4" />
      <path d={`M54 ${G - 212} L54 ${G - 277} Q54 ${G - 288} 66 ${G - 288} L149 ${G - 288} L149 ${G - 212} Z`} fill="#0a0b0c" />
      <g clipPath="url(#bd-r-doorglass)">
        <rect x={54} y={G - 290} width={96} height={80} fill="url(#bd-r-glass)" />
        <rect x={117} y={G - 272} width={18} height={20} rx={5} fill="#000" opacity=".5" />
        <path d={`M110 ${G - 212} L112 ${G - 248} Q113 ${G - 254} 120 ${G - 254} L134 ${G - 254} Q140 ${G - 254} 141 ${G - 246} L143 ${G - 212} Z`} fill="#000" opacity=".45" />
        <ellipse cx={75} cy={G - 228} rx={5} ry={15} transform={`rotate(-18 75 ${G - 228})`} fill="none" stroke="#000" strokeOpacity=".55" strokeWidth="3" />
        <rect x={54} y={G - 222} width={34} height={10} fill="#000" opacity=".4" />
        <path d={`M72 ${G - 290} L94 ${G - 290} L76 ${G - 210} L58 ${G - 210} Z`} fill="#fff" opacity=".1" />
        <path d={`M100 ${G - 290} L108 ${G - 290} L90 ${G - 210} L84 ${G - 210} Z`} fill="#fff" opacity=".07" />
      </g>
      <rect x={158} y={G - 288} width={50} height={62} rx={6.5} fill="#0a0b0c" />
      <rect x={160.5} y={G - 285.5} width={45} height={57} rx={4.5} fill="url(#bd-r-glass)" />
      <path d={`M170 ${G - 285} L182 ${G - 285} L170 ${G - 229} L161 ${G - 229} Z`} fill="#fff" opacity=".08" />

      {/* Visor, roof lamps, mirrors */}
      <path d={`M34 ${G - 292} L11 ${G - 279} L13 ${G - 273} L37 ${G - 285} Z`} fill="#1b1e22" opacity=".94" />
      <rect x={46} y={G - 300.5} width={8} height={3.6} rx={1.6} fill="#ff9a1a" />
      <rect x={66} y={G - 300.5} width={8} height={3.6} rx={1.6} fill="#ff9a1a" />
      <path d={`M42 ${G - 286} L-8 ${G - 268} M32 ${G - 224} L-8 ${G - 228}`} stroke="#18191b" strokeWidth="2.4" strokeLinecap="round" />
      <rect x={-18} y={G - 276} width={13} height={54} rx={4.5} fill="url(#bd-r-plastic)" stroke="#000" strokeOpacity=".5" strokeWidth=".7" />
      <path d={`M-15 ${G - 272} V${G - 228}`} stroke="#fff" strokeOpacity=".22" strokeWidth="1.2" strokeLinecap="round" />
      <rect x={-17} y={G - 218} width={11} height={15} rx={3.5} fill="url(#bd-r-plastic)" />
    </g>
  );
}

/** The fuel tank every truck carries; partitioned when the hydraulic oil shares it. */
export function RealFuelTank({ w, partition }: { w: number; partition: boolean }) {
  return (
    <g>
      <rect width={w} height={36} rx={17} fill="url(#bd-r-alloy)" stroke="#000" strokeOpacity=".4" strokeWidth=".8" />
      <rect x={w * 0.2} y={-1} width={5} height={38} rx={1.5} fill="#2a2c2f" />
      <rect x={w * 0.72} y={-1} width={5} height={38} rx={1.5} fill="#2a2c2f" />
      <rect x={w * 0.36} y={-4.5} width={11} height={6} rx={2} fill="#1b1c1e" />
      {partition && (
        <>
          <path d={`M${w * 0.56} 1 V35`} stroke="#d6141c" strokeWidth="2.4" />
          <rect x={w * 0.84 - 5} y={-4.5} width={11} height={6} rx={2} fill="#d6141c" />
        </>
      )}
      <path d={`M10 6 H${w - 10}`} stroke="#fff" strokeOpacity=".8" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

/** The studio: a pale wall, a floor that brightens toward the camera, and the shadow under the vehicle. */
export function RealStage({ minX, maxX, top, bottom, from, to }: { minX: number; maxX: number; top: number; bottom: number; from: number; to: number }) {
  return (
    <g>
      <rect x={minX} y={top} width={maxX - minX} height={G - top} fill="url(#bd-r-wall)" />
      <rect x={minX} y={G - 1} width={maxX - minX} height={bottom - G + 1} fill="url(#bd-r-floor)" />
      <rect x={minX} y={G - 10} width={maxX - minX} height={20} fill="#b5b1a9" opacity=".5" filter="url(#bd-r-blur2)" />
      <ellipse cx={(from + to) / 2} cy={G + 7} rx={(to - from) / 2 + 40} ry={11} fill="#000" opacity=".42" filter="url(#bd-r-blur2)" />
    </g>
  );
}
