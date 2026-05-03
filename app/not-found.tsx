import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="border-b border-line bg-ink py-32">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          404 — Page not found
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-bone sm:text-5xl">
          That page took a wrong turn.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-mute sm:text-lg">
          The page you're looking for doesn't exist or has been moved. Head
          back to the homepage or check out what we build.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/request-a-quote" variant="secondary" size="lg">
            Request a Quote
          </Button>
        </div>
      </Container>
    </section>
  );
}
