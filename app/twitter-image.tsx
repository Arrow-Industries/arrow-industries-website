import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Arrow Industries — Tipper Bodies & Trailers, Melbourne";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(225,6,0,0.28), transparent 55%)",
          padding: "80px",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <svg width="64" height="64" viewBox="0 0 200 220">
            <path
              d="M100 20 L185 180 L130 180 L100 120 L70 180 L15 180 Z"
              fill="#E10600"
            />
            <path
              d="M100 60 L150 160 L120 160 L100 120 L80 160 L50 160 Z"
              fill="#0A0A0A"
            />
            <rect x="80" y="200" width="40" height="6" fill="#E10600" />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <span>Arrow</span>
            <span style={{ color: "#E10600" }}>.</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#E10600",
            }}
          >
            Melbourne · Est. 25+ Years
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            <div style={{ display: "flex" }}>Tipper bodies and trailers,</div>
            <div style={{ display: "flex", color: "#E10600" }}>
              built tough.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#a3a3a3",
              maxWidth: 1000,
              lineHeight: 1.4,
            }}
          >
            Family-owned Melbourne manufacturer. Q&amp;T 450 grade steel.
            Custom tipper, dog and semi builds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #262626",
            paddingTop: "20px",
            fontSize: 18,
            color: "#a3a3a3",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex" }}>arrowindustries.com.au</div>
          <div style={{ display: "flex" }}>Campbellfield, VIC</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
