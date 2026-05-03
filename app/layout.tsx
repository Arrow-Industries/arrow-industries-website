import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Tipper Bodies & Trailers, Melbourne`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "tipper bodies Melbourne",
    "tipper truck bodies Victoria",
    "dog trailers Melbourne",
    "semi trailers Melbourne",
    "custom truck bodies Melbourne",
    "roadworthy Campbellfield",
    "truck repairs Melbourne",
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
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileActionBar />
        <JsonLd
          data={[
            organizationSchema(),
            websiteSchema(),
            localBusinessSchema(),
          ]}
        />
      </body>
    </html>
  );
}
