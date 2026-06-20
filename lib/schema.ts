import { site } from "@/data/site";
import type { Service } from "@/data/services";
import type { ServiceContent } from "@/data/serviceContent";
import type { FAQ } from "@/data/faqs";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.phoneIntl,
    email: site.email,
    taxID: `AU-ABN-${site.abn.replace(/\s/g, "")}`,
    // Google requires a raster logo (PNG/JPG); SVG is not accepted.
    image: `${site.url}/images/logo-black.png`,
    logo: `${site.url}/images/logo-black.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -37.681,
      longitude: 144.948,
    },
    areaServed: [
      { "@type": "State", name: "Victoria" },
      { "@type": "City", name: "Melbourne" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "16:00",
      },
    ],
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.linkedin,
    ].filter(Boolean),
    knowsAbout: [
      "Tipper truck bodies",
      "Dog trailers",
      "Semi trailers",
      "Truck repairs",
      "Roadworthy certificates",
      "Heavy vehicle servicing",
    ],
  };
}

export function serviceSchema(service: Service, content: ServiceContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${service.href}#service`,
    name: service.title,
    description: content.metaDescription,
    url: `${site.url}${service.href}`,
    provider: { "@id": `${site.url}/#business` },
    areaServed: [
      { "@type": "State", name: "Victoria" },
      { "@type": "City", name: "Melbourne" },
    ],
    serviceType: service.title,
    category: service.category === "product" ? "Manufacturing" : "Vehicle services",
  };
}

export function faqPageSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export function breadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  // Schema.org / Google require every ListItem to have a position, name and
  // item URL. We filter out unlinked taxonomy steps (e.g. a "Products"
  // category label that has no dedicated page) so every emitted ListItem
  // carries all three required fields. The visual breadcrumb in PageHero
  // still renders the unlinked steps for navigation context.
  const linked = crumbs.filter((c): c is Required<BreadcrumbCrumb> =>
    Boolean(c.href),
  );
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: linked.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href === "/" ? `${site.url}/` : `${site.url}${c.href}`,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    // Google requires a raster logo (PNG/JPG); SVG is not accepted.
    logo: `${site.url}/images/logo-black.png`,
    image: `${site.url}/images/logo-black.png`,
    description: site.description,
    telephone: site.phoneIntl,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: "AU",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneIntl,
        email: site.email,
        contactType: "sales",
        areaServed: "AU",
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      site.social.facebook,
      site.social.instagram,
      site.social.linkedin,
    ].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "en-AU",
  };
}
