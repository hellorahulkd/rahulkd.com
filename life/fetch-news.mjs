// Pulls every feed in feeds.json and writes news.json next to the page.
// Runs in GitHub Actions on a schedule; plain Node, no dependencies, no keys.
//
// Feed text is data. Titles are stored as text and escaped by the page on the
// way out; links are kept only if they are http(s). Nothing in a feed is ever
// interpreted as instruction or markup.
import { readFile, writeFile } from "node:fs/promises";

const HERE = new URL(".", import.meta.url);
const PER_FEED = 10;          // newest few per feed is plenty for a morning read
const KEEP_DAYS = 5;
const TIMEOUT = 15000;

const dec = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
  .replace(/<[^>]*>/g, " ")           // strip after decoding, so &lt;p&gt; goes too
  .replace(/\s+/g, " ").trim();

function tag(block, names){
  for (const n of names){
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
    if (m) return dec(m[1]);
  }
  return null;
}
function linkOf(block){
  const href = block.match(/<link[^>]*\brel=["']?alternate["']?[^>]*\bhref=["']([^"']+)["']/i)
    || block.match(/<link[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i);
  const raw = href ? dec(href[1]) : tag(block, ["link", "guid", "id"]);
  return raw && /^https?:\/\//i.test(raw) ? raw : null;
}
function parseFeed(xml){
  const blocks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) || [];
  const out = [];
  for (const b of blocks.slice(0, PER_FEED)){
    const title = tag(b, ["title"]);
    const url = linkOf(b);
    if (!title || !url) continue;
    const when = tag(b, ["pubDate", "published", "updated", "dc:date"]);
    const t = when ? Date.parse(when) : NaN;
    out.push({
      title: title.slice(0, 260),
      url: url.slice(0, 900),
      at: Number.isFinite(t) ? new Date(t).toISOString() : null
    });
  }
  return out;
}
// Google News keeps the real masthead as a " - Source" tail on the title.
function sourceOf(name, title){
  const m = title.match(/\s[-–]\s([^-–]{2,40})$/);
  return (m ? m[1].trim() : name).slice(0, 48);
}
function trimTitle(title){
  return title.replace(/\s[-–]\s[^-–]{2,40}$/, "").trim() || title;
}

async function pull(name, url){
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, {
      signal: ctl.signal,
      headers: {
        "User-Agent": "rahulkd.com-life/1.0 (+https://rahulkd.com/life)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"
      }
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const items = parseFeed((await r.text()).slice(0, 2_000_000));
    if (!items.length) throw new Error("no items in feed");
    return { ok: true, items: items.map(it => ({ ...it, title: trimTitle(it.title), source: sourceOf(name, it.title) })) };
  } catch (err){
    return { ok: false, error: String(err.message || err).slice(0, 120), items: [] };
  } finally { clearTimeout(timer); }
}

const cfg = JSON.parse(await readFile(new URL("feeds.json", HERE), "utf8"));

// Keep what is still recent from the last run, so one bad morning at a single
// source doesn't blank a whole section.
let previous = {};
try { previous = JSON.parse(await readFile(new URL("news.json", HERE), "utf8")).sections || {}; } catch {}

const cutoff = Date.now() - KEEP_DAYS * 86400000;
const sections = {};
const problems = [];

for (const [key, { label, feeds }] of Object.entries(cfg)){
  const results = await Promise.all(feeds.map(([n, u]) => pull(n, u)));
  feeds.forEach(([n], i) => { if (!results[i].ok) problems.push(`${label} / ${n}: ${results[i].error}`); });

  const seen = new Set();
  const merged = [];
  for (const it of [...results.flatMap(r => r.items), ...((previous[key] || {}).items || [])]){
    if (!it || !it.url || seen.has(it.url)) continue;
    if (it.at && Date.parse(it.at) < cutoff) continue;
    seen.add(it.url);
    merged.push(it);
  }
  merged.sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
  sections[key] = { label, items: merged.slice(0, 14) };
}

const total = Object.values(sections).reduce((n, s) => n + s.items.length, 0);
await writeFile(new URL("news.json", HERE),
  JSON.stringify({ fetched_at: new Date().toISOString(), total, problems, sections }, null, 1) + "\n");

console.log(`${total} headlines across ${Object.keys(sections).length} sections`);
for (const p of problems) console.log("  ! " + p);
