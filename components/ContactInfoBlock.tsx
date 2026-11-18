import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";

export function ContactInfoBlock() {
  return (
    <div className="list-group">
      <Item
        icon={Phone}
        label="Phone"
        primary={
          <a href={site.phoneHref} className="hover:text-accent-text">
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
            className="break-words hover:text-accent-text"
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
            className="hover:text-accent-text"
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
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm font-normal">
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
    <div className="list-row gap-3.5">
      <span className="icon-tile">
        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="label">{label}</p>
        <div className="mt-0.5 text-sm font-medium leading-relaxed text-bone">
          {primary}
        </div>
      </div>
    </div>
  );
}
