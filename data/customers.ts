export interface Customer {
  name: string;
  logo?: string;
}

// Placeholder entries — real customer logos pending written confirmation
// from each operator. Swap each `logo` path back to /images/customers/<file>
// once confirmed.
export const customers: Customer[] = [
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
  { name: "Arrow Industries", logo: "/images/logo-white.png" },
];
