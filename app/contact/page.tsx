import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Arrow Industries — Campbellfield Workshop",
  description:
    "Contact Arrow Industries at our Campbellfield workshop. Phone, email, address and hours for tipper, trailer, repair and roadworthy enquiries.",
  alternates: { canonical: "/contact" },
};

const socials = [
  { label: "Instagram", href: site.social.instagram, icon: Instagram },
  { label: "Facebook", href: site.social.facebook, icon: Facebook },
  { label: "LinkedIn", href: site.social.linkedin, icon: Linkedin },
];

const helpItems = [
  "Custom tipper truck bodies",
  "Dog trailers & semi trailers",
  "Truck repairs & servicing",
  "Roadworthy certificates (LVT)",
  "Fleet maintenance",
  "General enquiries",
];

const mapEmbed =
  "https://www.google.com/maps?q=Unit+3+62-66+Lara+Way+Campbellfield+VIC+3061&output=embed";

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        heading="Contact Arrow Industries"
        body="Call, email, or visit our Campbellfield workshop."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* Primary contact actions — phone is dominant, email secondary */}
      <section className="border-b border-line bg-ink-2 py-10 lg:py-12">
        <Container>
          <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
            {/* Phone — primary, accent-filled */}
            <a
              href={site.phoneHref}
              className="group relative flex items-center gap-5 overflow-hidden border border-accent bg-accent p-6 text-white transition-all hover:bg-accent-hover sm:p-7 lg:col-span-3"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/30 bg-white/10">
                <Phone className="h-6 w-6 text-white" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/80">
                  Call Now
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                  {site.phone}
                </p>
                <p className="mt-1 text-xs text-white/85">
                  Mon – Fri, 7:00 AM – 4:00 PM
                </p>
              </div>
              <ArrowRight
                className="hidden h-5 w-5 shrink-0 text-white transition-transform group-hover:translate-x-1 sm:block"
                aria-hidden
              />
            </a>

            {/* Email — secondary */}
            <a
              href={site.emailHref}
              className="group flex items-center gap-5 border border-line bg-ink p-6 transition-colors hover:border-accent lg:col-span-2"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-accent/40 bg-accent/10 transition-colors group-hover:bg-accent/20">
                <Mail className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-mute">
                  Email
                </p>
                <p className="mt-1 break-all text-base font-semibold text-bone sm:text-lg">
                  {site.email}
                </p>
                <p className="mt-1 text-xs text-mute">For specs, drawings and quotes</p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* Main info + map */}
      <section className="border-b border-line bg-ink py-16 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Left column */}
          <div className="flex flex-col gap-10 lg:col-span-5">

            {/* Address + Hours */}
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line">
              <div className="flex gap-5 bg-ink-2 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
                  <MapPin className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">Workshop</p>
                  <div className="mt-1.5 text-sm font-medium leading-relaxed text-bone">
                    <a
                      href={site.address.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {site.address.line1}
                      <br />
                      {site.address.suburb} {site.address.state} {site.address.postcode}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 bg-ink-2 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
                  <Clock className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">Hours</p>
                  <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                    {site.hours.map((h) => (
                      <div key={h.label} className="contents">
                        <dt className="font-medium text-bone">{h.label}</dt>
                        <dd className="text-right tabular-nums text-mute">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            {/* What can we help with */}
            <div>
              <h2 className="font-display text-xl font-bold text-bone sm:text-2xl">
                What can we help with?
              </h2>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {helpItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-bone"
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-accent"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="border-t border-line pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-mute">
                Follow us
              </p>
              <ul className="flex items-center gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Arrow Industries on ${s.label}`}
                        className="inline-flex h-10 w-10 items-center justify-center border border-line bg-ink-2 text-bone transition-colors hover:border-accent hover:bg-accent hover:text-white"
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Right column — map */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden border border-line bg-ink-2">
              <div className="border-b border-line p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Workshop Location
                </p>
                <p className="mt-2 font-display text-lg font-bold text-bone sm:text-xl">
                  {site.address.line1}, {site.address.suburb} {site.address.state}{" "}
                  {site.address.postcode}
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <a
                    href={site.address.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 border border-line bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-bone transition-colors hover:border-accent hover:text-accent"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    Open in Google Maps
                  </a>
                  <a
                    href={site.phoneHref}
                    className="inline-flex items-center justify-center gap-1.5 border border-accent bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-accent-hover"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    Call Now
                  </a>
                </div>
              </div>

              <div className="aspect-[4/3] w-full bg-ink">
                <iframe
                  title="Arrow Industries — Campbellfield workshop map"
                  src={mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  style={{ border: 0, filter: "grayscale(0.5) invert(0.92) hue-rotate(180deg)" }}
                />
              </div>
            </div>
          </div>

        </Container>
      </section>

      {/* Trust line */}
      <section className="border-b border-line bg-ink py-8">
        <Container>
          <p className="text-center text-sm text-mute sm:text-base">
            Serving Melbourne&rsquo;s transport, construction and haulage industries for{" "}
            <span className="font-semibold text-bone">over 25 years</span>.
          </p>
        </Container>
      </section>

      <CTASection
        eyebrow="Get a Quote"
        heading="Get a quote for your next build or repair"
        body="Send your specs and the Arrow team will respond with the next steps."
        primaryCta={{ label: "Request a Quote", href: "/request-a-quote" }}
        phoneCta={{ label: `Call ${site.phone}`, href: site.phoneHref }}
      />
    </>
  );
}
