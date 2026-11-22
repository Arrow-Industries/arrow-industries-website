import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page building blocks: paper background, bold black and red lettering,
 * few photographs. Their styles live in app/variant-d.css.
 */

export interface Crumb {
  label: string;
  href?: string;
}

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

/** A pill link. `tone` picks the colour; an arrow follows the label by default. */
export function Action({
  href,
  tone = "red",
  arrow = true,
  children,
  className,
}: {
  href: string;
  tone?: "red" | "ink" | "line" | "line-light";
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const cls = cn("btn", `btn-${tone}`, className);
  const inner = (
    <>
      {children}
      {arrow && (
        <span className="arrow" aria-hidden>
          →
        </span>
      )}
    </>
  );
  if (isExternal(href))
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <p className="crumb">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={c.label}>
            {last ? <b>{c.label}</b> : c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
            {!last && " / "}
          </span>
        );
      })}
    </p>
  );
}

export function Facts({ items }: { items: [string, string][] }) {
  return (
    <div className="facts">
      {items.map(([big, small]) => (
        <div key={big + small}>
          <span className="big">{big}</span>
          <span>{small}</span>
        </div>
      ))}
    </div>
  );
}

/** The opening of an inner page: one bold line, one sentence, one photograph. */
export function PageOpen({
  crumbs,
  title,
  long,
  sub,
  actions,
  photo,
  typePanel,
  facts,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  long?: boolean;
  sub?: ReactNode;
  actions?: ReactNode;
  photo?: { src: string; alt: string; position?: string };
  typePanel?: ReactNode;
  facts?: [string, string][];
}) {
  return (
    <section className="p-hero">
      <div className="wrap">
        <Crumbs crumbs={crumbs} />
        <h1 className={cn(long && "long")}>{title}</h1>
        {(sub || actions) && (
          <div className="row">
            {sub && <p>{sub}</p>}
            {actions && <div className="actions">{actions}</div>}
          </div>
        )}
        {photo && (
          <div className="p-photo">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={1440}
              height={1080}
              priority
              sizes="(min-width: 1400px) 1340px, 100vw"
              style={{ objectPosition: photo.position }}
            />
          </div>
        )}
        {typePanel && (
          <div className="p-photo p-type" aria-hidden>
            <span>{typePanel}</span>
          </div>
        )}
        {facts && <Facts items={facts} />}
      </div>
    </section>
  );
}

/** A section heading: small label, bold line, and an optional note or action. */
export function Head({
  label,
  children,
  note,
  action,
}: {
  label: string;
  children: ReactNode;
  note?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="head reveal">
      <div>
        <p className="mlabel">{label}</p>
        <h2>{children}</h2>
      </div>
      {note && <p>{note}</p>}
      {action}
    </div>
  );
}

export function Feat({ items, xl, cols }: { items: [string, string][]; xl?: boolean; cols?: number }) {
  return (
    <div className="feat reveal" style={cols ? ({ "--n": cols } as React.CSSProperties) : undefined}>
      {items.map(([t, d]) => (
        <div key={t}>
          <h3 className={cn(xl && "xl")}>{t}</h3>
          <p>{d}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: [string, string][] }) {
  return (
    <div className="steps reveal" style={{ "--n": items.length } as React.CSSProperties}>
      {items.map(([t, d], i) => (
        <div key={t}>
          <small>{String(i + 1).padStart(2, "0")}</small>
          <h3>{t}</h3>
          <p>{d}</p>
        </div>
      ))}
    </div>
  );
}

/** Fold-out rows. `plain` sets the questions in ordinary type. */
export function Acc({
  items,
  plain,
  openFirst,
}: {
  items: { q: string; a: ReactNode }[];
  plain?: boolean;
  openFirst?: boolean;
}) {
  return (
    <div className={cn("acc", plain && "plain")}>
      {items.map((it, i) => (
        <details key={it.q} open={openFirst && i === 0}>
          <summary>
            <b>{it.q}</b>
            <i />
          </summary>
          <div className="body">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Heading and note on the left, anything on the right. */
export function Split({
  id,
  label,
  heading,
  note,
  tags,
  flush = true,
  children,
}: {
  id?: string;
  label: string;
  heading: ReactNode;
  note?: ReactNode;
  tags?: string[];
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={cn("sec", flush && "flush")} id={id}>
      <div className="wrap spec">
        <div className="spec-side reveal">
          <p className="mlabel">{label}</p>
          <h2>{heading}</h2>
          {note && <p>{note}</p>}
          {tags && (
            <div className="tags">
              {tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="reveal">{children}</div>
      </div>
    </section>
  );
}

/** A dark checklist card beside the questions. */
export function Pair({
  id,
  label,
  heading,
  bullets,
  faqs,
}: {
  id?: string;
  label: string;
  heading: ReactNode;
  bullets: string[];
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section className="sec flush" id={id}>
      <div className="wrap std">
        <div className="std-card reveal">
          <p className="mlabel">{label}</p>
          <h2>{heading}</h2>
          <ul>
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="faq reveal">
          <p className="mlabel">Questions</p>
          <h2>
            Asked <span className="red">often.</span>
          </h2>
          <Acc items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      </div>
    </section>
  );
}

export function Shots({
  items,
  className = "recent",
}: {
  items: { src: string; alt: string; title: string; tag: string; wide?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {items.map((s) => (
        <figure key={s.src + s.title} className={cn("shot reveal", s.wide && "wide")}>
          <div className="ph">
            <Image src={s.src} alt={s.alt} width={1440} height={1080} sizes="(min-width: 860px) 45vw, 100vw" />
          </div>
          <figcaption>
            {s.title}
            <span>{s.tag}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function NextLink({ href, label = "Next", name }: { href: string; label?: string; name: string }) {
  return (
    <Link className="next reveal" href={href}>
      <div>
        <small className="mlabel">{label}</small>
        <b>{name}</b>
      </div>
      <span className="go" aria-hidden>
        →
      </span>
    </Link>
  );
}
