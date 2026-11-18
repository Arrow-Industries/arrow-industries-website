import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { flags } from "@/data/flags";

const covers = ["Prime movers", "Rigid trucks", "Trailers", "Fleets"];

/** The roadworthy business, set apart from the build work on a bright band. */
export function RoadworthyBand() {
  return (
    <section id="roadworthy" className="band bg-bone text-ink">
      <Container>
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[#b80500]">
          VicRoads Licensed Vehicle Tester
        </p>
        <p className="display mt-3 text-[23vw] leading-[0.88] lg:text-[min(23.5vw,21rem)]">EX 12409</p>
        <div className="mt-7 grid items-end gap-6 border-t-2 border-ink pt-6 lg:mt-11 lg:grid-cols-[1fr_auto]">
          <ul className="display flex flex-wrap gap-x-6 gap-y-1 text-[clamp(2rem,3.2vw,3rem)] leading-[1.05]">
            {covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div>
            <Button
              href={
                flags.roadworthyAvailable
                  ? "/licensed-vehicle-testing#book"
                  : "/licensed-vehicle-testing"
              }
              size="lg"
            >
              {flags.roadworthyAvailable ? "Book an inspection" : "Roadworthy inspections"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
