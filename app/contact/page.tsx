import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ArrowRight, CheckCircle2, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { CTASection } from "@/components/CTASection";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Arrow Industries — Campbellfield Workshop",
  description:
    "Contact Arrow Industries at our Campbellfield workshop. Phone, email, address and hours for tipper, trailer, repair and roadworthy enquiries.",
  path: "/contact",
});

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
      <section className="section">
        <Container>
          <div className="grid gap-3 lg:grid-cols-5">
            {/* Phone — primary, accent-filled */}
            <a
              href={site.phoneHref}
              className="card-link group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#e7100a,#c80500)] p-5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] sm:p-6 lg:col-span-3"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Phone className="h-6 w-6 text-white" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.8125rem] font-medium text-white/85">
                  Call Now
                </p>
                <p className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">
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
              className="card card-link group flex items-center gap-4 p-5 sm:p-6 lg:col-span-2"
            >
              <span className="icon-tile">
                <Mail className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label">
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
      <section className="section">
        <Container className="grid gap-6 lg:grid-cols-12 lg:gap-12">

          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-5">

            {/* Address + Hours */}
            <div className="list-group">
              <div className="list-row gap-3.5">
                <span className="icon-tile">
                  <MapPin className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label">Workshop</p>
                  <div className="mt-1.5 text-sm font-medium leading-relaxed text-bone">
                    <a
                      href={site.address.mapsHref}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent-text"
                    >
                      {site.address.line1}
                      <br />
                      {site.address.suburb} {site.address.state} {site.address.postcode}
                    </a>
                  </div>
                </div>
              </div>

              <div className="list-row gap-3.5">
                <span className="icon-tile">
                  <Clock className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label">Hours</p>
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
              <h2 className="font-display text-xl font-semibold text-bone sm:text-2xl">
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
            <div>
              <p className="label mb-2">
                Follow us
              </p>
              <ul className="flex items-center gap-1.5">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Arrow Industries on ${s.label}`}
                        className="icon-btn"
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
            <div className="card overflow-hidden">
              <div className="border-b border-line-soft p-5 sm:p-6">
                <p className="eyebrow">
                  Workshop Location
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-bone sm:text-xl">
                  {site.address.line1}, {site.address.suburb} {site.address.state}{" "}
                  {site.address.postcode}
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <a
                    href={site.address.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-sm bg-white/[0.08] px-4 text-sm font-medium text-bone transition-colors hover:bg-white/[0.13] lg:h-9"
                  >
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    Open in Google Maps
                  </a>
                  <a
                    href={site.phoneHref}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-sm bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-hover lg:h-9"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    Call Now
                  </a>
                </div>
              </div>

              <div className="aspect-[4/3] w-full bg-ink-2">
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
      <section className="section">
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
