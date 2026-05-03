export const site = {
  name: "Arrow Industries",
  legalName: "Samaro Pty Ltd",
  tradingName: "Arrow Industries & Co",
  tradingAs: "Samaro Pty Ltd t/a Arrow Industries & Co",
  tagline: "Heavy-duty tipper bodies and trailers, built in Melbourne.",
  description:
    "Family-owned Melbourne manufacturer engineering custom tipper bodies, dog trailers and semi trailers. Q&T 450 grade steel. Built for civil, quarry, haulage and waste.",
  url: "https://arrowindustries.com.au",
  phone: "0468 067 280",
  phoneHref: "tel:+61468067280",
  email: "sales@arrowindustries.com.au",
  emailHref: "mailto:sales@arrowindustries.com.au",
  abn: "28 109 797 033",
  address: {
    line1: "Unit 3/62–66 Lara Way",
    suburb: "Campbellfield",
    state: "VIC",
    postcode: "3061",
    country: "Australia",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Unit+3+62-66+Lara+Way+Campbellfield+VIC+3061",
  },
  hours: [
    { label: "Monday – Friday", time: "7:00 AM – 4:00 PM" },
    { label: "Saturday", time: "Closed" },
    { label: "Sunday", time: "Closed" },
  ],
  social: {
    facebook: "https://www.facebook.com/ArrowIndustriesCo/",
    instagram: "https://www.instagram.com/arrow_industries_co/",
    linkedin: "https://au.linkedin.com/company/arrow-industries-co",
  },
  booking: {
    /** Square Appointments — public booking page (services list). */
    roadworthy:
      "https://book.squareup.com/appointments/pqwf7p2lpg0x87/location/LBPHJRSQGTM9H/services",
  },
  shop: {
    /** Square Online — parts & components storefront. */
    parts: "https://arrow-industries.square.site/",
  },
} as const;

export type Site = typeof site;
