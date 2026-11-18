export interface Testimonial {
  quote: string;
  name: string;
  company?: string;
}

/**
 * Real customer quotes only, used with the customer's permission. The section
 * stays hidden on the site until at least one is added here.
 */
export const testimonials: Testimonial[] = [];
