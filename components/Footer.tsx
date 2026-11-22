import Image from "next/image";
import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import { site } from "@/data/site";

const weekdays = site.hours[0];

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <Link href="/" aria-label={`${site.name} — home`}>
              <Image className="flogo" src="/images/logo-white.png" alt={site.name} width={264} height={264} />
            </Link>
          </div>
          <FooterColumn title="Build" links={footerLinks.products} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <div>
            <h4>Workshop</h4>
            <a href={site.address.mapsHref} target="_blank" rel="noreferrer">
              {site.address.line1}
              <br />
              {site.address.suburb} {site.address.state} {site.address.postcode}
            </a>
            <p>
              {weekdays.label}
              <br />
              {weekdays.time}
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={site.phoneHref}>{site.phone}</a>
            <a href={site.emailHref}>{site.email}</a>
            <a href={site.social.instagram} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer">
              Facebook ↗
            </a>
            <a href={site.social.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
        <div className="fbase">
          <span>
            © {new Date().getFullYear()} Samaro Pty Ltd trading as Arrow Industries. All rights reserved.
          </span>
          <span>ABN {site.abn}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4>{title}</h4>
      {links.map((l) =>
        l.href.startsWith("http") ? (
          <a key={l.href + l.label} href={l.href} target="_blank" rel="noreferrer">
            {l.label} ↗
          </a>
        ) : (
          <Link key={l.href + l.label} href={l.href}>
            {l.label}
          </Link>
        ),
      )}
    </div>
  );
}
