import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";

export function ContactInfoBlock() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line">
      <Item
        icon={Phone}
        label="Phone"
        primary={
          <a href={site.phoneHref} className="hover:text-accent">
            {site.phone}
          </a>
        }
      />
      <Item
        icon={Mail}
        label="Email"
        primary={
          <a
            href={site.emailHref}
            className="break-words hover:text-accent"
          >
            {site.email}
          </a>
        }
      />
      <Item
        icon={MapPin}
        label="Workshop"
        primary={
          <a
            href={site.address.mapsHref}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            {site.address.line1}
            <br />
            {site.address.suburb} {site.address.state}{" "}
            {site.address.postcode}
          </a>
        }
      />
      <Item
        icon={Clock}
        label="Hours"
        primary={
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
            {site.hours.map((h) => (
              <div key={h.label} className="contents">
                <dt className="text-bone">{h.label}</dt>
                <dd className="text-right tabular-nums text-mute">{h.time}</dd>
              </div>
            ))}
          </dl>
        }
      />
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof Phone;
  label: string;
  primary: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 bg-ink-2 p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent/40 bg-accent/10">
        <Icon className="h-[1.125rem] w-[1.125rem] text-accent" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute">
          {label}
        </p>
        <div className="mt-1.5 text-sm font-medium leading-relaxed text-bone">
          {primary}
        </div>
      </div>
    </div>
  );
}
