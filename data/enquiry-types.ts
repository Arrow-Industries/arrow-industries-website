/** Enquiries that aren't a new build. Builds come from the dashboard's quote builder. */
export const SERVICE_ENQUIRIES = [
  "Repairs & Servicing",
  "Roadworthy / LVT",
  "Parts & Components",
  "General Enquiry",
] as const;

/** Shown if the dashboard's products can't be read, and still accepted from open pages. */
export const FALLBACK_PRODUCTS = ["Tipper Truck Body", "Dog Trailer", "Semi Trailer"] as const;
