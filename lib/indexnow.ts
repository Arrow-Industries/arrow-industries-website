/**
 * IndexNow ping helper.
 *
 * Notifies search engines (Bing, Yandex, et al.) that one or more URLs
 * have changed so they can crawl on demand instead of waiting for the
 * next scheduled discovery. Key file lives at
 * /b45a47aa961f457f90a7b80ceaee8882.txt and is referenced via
 * keyLocation below.
 */

const KEY = "b45a47aa961f457f90a7b80ceaee8882";
const HOST = "arrowindustries.com.au";

export interface IndexNowResult {
  ok: boolean;
  status: number;
}

export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}
