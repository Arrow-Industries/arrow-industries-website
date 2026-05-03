export interface Customer {
  name: string;
  logo?: string;
}

export const customers: Customer[] = [
  { name: "ASG", logo: "/images/customers/asg.webp" },
  { name: "LTE", logo: "/images/customers/lte.jpeg" },
  { name: "NLA", logo: "/images/customers/nla.png" },
  { name: "Sitrak", logo: "/images/customers/sitrak.png" },
  { name: "Starbuck", logo: "/images/customers/starbuck.png" },
  { name: "Westgate Bin Hire", logo: "/images/customers/westgate-bin-hire.png" },
];
