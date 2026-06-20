import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { footerLinks } from "@/data/navigation";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-ink-2 text-mute">
      <Container className="pt-10 pb-16">
        <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.22em] text-mute">
          Built and serviced in Campbellfield. Supporting operators across Australia.
        </p>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Custom truck bodies, trailers, repairs and roadworthy testing —
              fabricated and serviced from our Campbellfield workshop.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a
                  href={site.address.mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bone"
                >
                  {site.address.line1}
                  <br />
                  {site.address.suburb} {site.address.state}{" "}
                  {site.address.postcode}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a href={site.phoneHref} className="hover:text-bone">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                <a href={site.emailHref} className="hover:text-bone">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <FooterColumn title="Products" links={footerLinks.products} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Company" links={footerLinks.company} />

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone">
              Hours
            </h3>
            <ul className="space-y-2 text-sm">
              {site.hours.map((h) => (
                <li key={h.label}>
                  <span className="block text-bone">{h.label}</span>
                  <span className="block text-xs text-mute">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line-soft pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed">
            © {new Date().getFullYear()} Samaro Pty Ltd trading as Arrow
            Industries. All rights reserved.{" "}
            <span className="whitespace-nowrap">ABN {site.abn}</span>
          </p>
          <div className="flex items-center gap-3">
            <SocialLink href={site.social.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={site.social.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={site.social.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line-soft text-mute transition-colors hover:border-accent hover:text-accent-text"
    >
      {children}
    </a>
  );
}
