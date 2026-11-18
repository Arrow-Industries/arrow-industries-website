import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { media } from "@/data/media";
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

const mapEmbed =
  "https://www.google.com/maps?q=Unit+3+62-66+Lara+Way+Campbellfield+VIC+3061&output=embed";

const [emailName, emailDomain] = site.email.split("@");

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Contact"
        heading="Contact Arrow Industries"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* Contact options: phone is dominant, text and email sit beside it */}
      <section className="section">
        <Container>
          <div className="grid gap-3 lg:grid-cols-3">
            <a
              href={site.phoneHref}
              className="card-link group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#e7100a,#c80500)] p-5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] sm:p-6 lg:flex-col lg:items-start"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Phone className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white/85">Call now</p>
                <p className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-3xl">
                  {site.phone}
                </p>
                <p className="mt-1 text-xs text-white/85">Mon – Fri, {site.hours[0].time}</p>
              </div>
              <ArrowRight
                className="hidden h-5 w-5 shrink-0 text-white transition-transform group-hover:translate-x-1 sm:block lg:hidden"
                aria-hidden
              />
            </a>

            <a
              href="sms:+61499717171"
              className="card card-link group flex items-center gap-4 p-5 sm:p-6 lg:flex-col lg:items-start"
            >
              <span className="icon-tile">
                <MessageSquare className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label">Text us</p>
                <p className="mt-1 font-display text-2xl font-semibold leading-tight text-bone sm:text-3xl">
                  {site.phone}
                </p>
              </div>
            </a>

            <a
              href={site.emailHref}
              className="card card-link group flex items-center gap-4 p-5 sm:p-6 lg:flex-col lg:items-start"
            >
              <span className="icon-tile">
                <Mail className="h-5 w-5 text-accent" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label">Email</p>
                <p className="mt-1 text-base font-semibold text-bone [overflow-wrap:anywhere] sm:text-lg">
                  {emailName}@<wbr />
                  {emailDomain}
                </p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* Visit the workshop: where it is, when it's open, and how to get there */}
      <section className="section">
        <Container>
          <SectionHeader eyebrow="Workshop" heading="Visit the workshop." className="mb-6" />

          <div className="card grid overflow-hidden lg:grid-cols-12">
            <div className="flex min-w-0 flex-col lg:col-span-5">
              <div className="relative aspect-[16/9]">
                <Image
                  src={media.workshop.src}
                  alt={media.workshop.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                <div>
                  <p className="label">Address</p>
                  <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-bone">
                    {site.address.line1}
                    <br />
                    {site.address.suburb} {site.address.state} {site.address.postcode}
                  </p>
                </div>

                <div>
                  <p className="label">Hours</p>
                  <dl className="mt-1.5 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 text-sm">
                    {site.hours.map((h) => (
                      <div key={h.label} className="contents">
                        <dt className="font-medium text-bone">{h.label}</dt>
                        <dd className="text-right tabular-nums text-mute">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5">
                  <Button
                    href={site.address.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    size="lg"
                    variant="secondary"
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    Get directions
                  </Button>
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
            </div>

            <div className="relative aspect-[4/3] w-full bg-ink-2 lg:col-span-7 lg:aspect-auto lg:min-h-[32rem]">
              <iframe
                title="Arrow Industries — Campbellfield workshop map"
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: "grayscale(0.5) invert(0.92) hue-rotate(180deg)" }}
              />
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Request a quote"
        heading="Get a quote for your next build or repair"
        primaryCta={{ label: "Request a quote", href: "/request-a-quote" }}
        secondaryCta={{ label: "Configure your build", href: "/configure" }}
      />
    </>
  );
}
