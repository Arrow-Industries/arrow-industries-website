import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { JsonLd } from "@/components/JsonLd";
import { Motion } from "@/components/Motion";
import { site } from "@/data/site";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

// The slanted capitals echo the ARROW lettering on the trucks.
const condensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: "italic",
  variable: "--font-condensed",
  display: "swap",
});

// Small labels and numbering.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Tipper Bodies & Trailers, Melbourne`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // Location-agnostic terms — Google handles local relevance ranking
  // from the LocalBusiness / address schema. These mirror the
  // localBusinessSchema().knowsAbout list so the site's topical scope is
  // consistent across keywords and structured data.
  keywords: [
    "tipper truck bodies",
    "dog trailers",
    "semi trailers",
    "truck repairs",
    "roadworthy certificates",
    "heavy vehicle servicing",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — Tipper Bodies & Trailers, Melbourne`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Tipper Bodies & Trailers, Melbourne`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Lets the call and quote bar sit clear of the iPhone home indicator.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${barlow.variable} ${condensed.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <Motion />
        <JsonLd
          data={[
            organizationSchema(),
            websiteSchema(),
            localBusinessSchema(),
          ]}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
