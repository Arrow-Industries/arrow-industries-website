import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { testimonials } from "@/data/testimonials";

/** Renders nothing until real customer quotes are added. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="section">
      <Container>
        <SectionHeader eyebrow="Customers" heading="What operators say." />
        <ul className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <li key={t.name + t.quote} className="card flex flex-col gap-4 p-6">
              <blockquote className="text-[1.0625rem] font-medium leading-snug text-bone">
                {t.quote}
              </blockquote>
              <p className="mt-auto text-sm text-mute">
                {t.name}
                {t.company ? `, ${t.company}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
