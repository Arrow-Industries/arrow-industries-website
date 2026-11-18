import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { footerLinks } from "@/data/navigation";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line-soft text-mute">
      <Container className="py-10 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Custom truck bodies, trailers, repairs and roadworthy testing —
              fabricated and serviced from our Campbellfield workshop.
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic">
              <a
                href={site.address.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="block transition-colors hover:text-bone"
              >
                {site.address.line1}, {site.address.suburb} {site.address.state}{" "}
                {site.address.postcode}
              </a>
              <a href={site.phoneHref} className="block transition-colors hover:text-bone">
                {site.phone}
              </a>
              <a href={site.emailHref} className="block transition-colors hover:text-bone">
                {site.email}
              </a>
            </address>
          </div>

          <FooterColumn title="Products" links={footerLinks.products} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Company" links={footerLinks.company} />

          <div className="lg:col-span-2">
            <h3 className="text-[0.8125rem] font-semibold tracking-normal text-bone">Hours</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {site.hours.map((h) => (
                <li key={h.label}>
                  <span className="block text-bone/85">{h.label}</span>
                  <span className="block text-[0.8125rem]">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line-soft pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed">
            © {new Date().getFullYear()} Samaro Pty Ltd trading as Arrow
            Industries. All rights reserved.{" "}
            <span className="whitespace-nowrap">ABN {site.abn}</span>
          </p>
          <div className="flex items-center gap-1.5">
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
      <h3 className="text-[0.8125rem] font-semibold tracking-normal text-bone">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="transition-colors hover:text-bone">
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
      className="icon-btn text-mute hover:text-bone"
    >
      {children}
    </a>
  );
}
