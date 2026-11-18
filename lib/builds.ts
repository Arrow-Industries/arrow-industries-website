import { thumbFor, type IgMedia } from "@/lib/instagram";

export type BuildProduct = "tipper" | "dog" | "semi";

export interface BuildItem {
  id: string;
  /** Short name shown on the tile, such as "Scania tipper body". */
  name: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  link: string;
  products: BuildProduct[];
  brand?: string;
}

/**
 * Instagram posts to leave off the Builds page, by the code in the post's
 * address (instagram.com/p/CODE). For announcements and anything that isn't
 * a build. Everything else appears automatically.
 */
const HIDDEN_POSTS = new Set([
  "DX9Bu5pRn2-", // Website launch announcement
  "DVcgO-_mMjD", // Partnership announcement
  "DQWK8HuErbN", // Crocs photo
]);

const BRANDS: [string, RegExp][] = [
  ["SITRAK", /\bsitrak\b/i],
  ["Scania", /\bscania\b/i],
  ["Mercedes-Benz", /\b(mercedes|benz|arocs|actros)\b/i],
  ["MAN", /\bMAN\b/],
  ["Volvo", /\bvolvo\b/i],
  ["Kenworth", /\bkenworth\b/i],
  ["Mack", /\bmack\b/i],
  ["Isuzu", /\bisuzu\b/i],
  ["Hino", /\bhino\b/i],
  ["Iveco", /\biveco\b/i],
  ["DAF", /\bDAF\b/],
  ["Fuso", /\bfuso\b/i],
  ["UD Trucks", /\bUD\b/],
];

const EMOJI = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{FE0F}\u{200D}\u{20E3}]/gu;

function clean(line: string) {
  return line
    .replace(EMOJI, "")
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–—•:|]+|[\s\-–—•:|]+$/g, "")
    .trim();
}

/** Contact details in old captions go out of date, so they aren't repeated. */
function isContactLine(line: string) {
  return (
    /(\d[\s-]?){8,}/.test(line) ||
    /https?:|www\.|\.com|@\w/i.test(line) ||
    /^(call|dm|message|contact|enquire|get in touch|link in bio)\b/i.test(line)
  );
}

function shorten(text: string, limit = 420) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return stop > 120 ? cut.slice(0, stop + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function productsIn(caption: string) {
  const found: BuildProduct[] = [];
  if (/\b(tippers?|tip truck|bodies|body|bins?)\b/i.test(caption)) found.push("tipper");
  if (/\b(dogs?|pbs)\b/i.test(caption)) found.push("dog");
  if (/\b(semis?|semi[- ]trailers?|b-?doubles?)\b/i.test(caption)) found.push("semi");
  return found;
}

function nameFor(products: BuildProduct[], brand?: string, isVideo = false) {
  if (isVideo) return brand ? `${brand} build video` : "Arrow build video";
  if (products.includes("tipper") && products.includes("dog")) return "Truck and dog combination";
  if (products.includes("dog")) return "Dog trailer";
  if (products.includes("semi")) return "Semi trailer";
  if (products.includes("tipper")) return brand ? `${brand} tipper body` : "Tipper body";
  return brand ? `${brand} build` : "Arrow build";
}

export function toBuilds(posts: IgMedia[]): BuildItem[] {
  const seen = new Set<string>();
  const builds: BuildItem[] = [];

  for (const post of posts) {
    const code = post.permalink.replace(/\/$/, "").split("/").pop() ?? post.id;
    if (HIDDEN_POSTS.has(code)) continue;

    // The same caption is sometimes posted across several photos in a row.
    const caption = post.caption ?? "";
    const key = caption.trim().toLowerCase();
    if (key && seen.has(key)) continue;
    seen.add(key);

    const lines = caption.split("\n").map(clean).filter(Boolean);
    const body = lines.slice(1).filter((l) => !isContactLine(l));
    const products = productsIn(caption);
    const brand = BRANDS.find(([, pattern]) => pattern.test(caption))?.[0];
    const name = nameFor(products, brand, post.media_type === "VIDEO");

    builds.push({
      id: post.id,
      name,
      title: lines[0] ?? name,
      description: shorten(body.join(" ")),
      image: thumbFor(post),
      video: post.media_type === "VIDEO" ? post.media_url : undefined,
      link: post.permalink,
      products,
      brand,
    });
  }

  return builds;
}
