// news-fetch — pulls each of the user's RSS feeds and stores the headlines.
//
// Plain RSS and Atom only: no API key, nothing to rotate, and nothing about
// Rahul leaves the box. Feed content is treated strictly as data — titles and
// links are stored and escaped on the way out, never interpreted.
//
// Two ways in:
//   * a signed-in POST from the dashboard  -> that user's feeds, now
//   * a POST carrying the cron secret      -> every user who has feeds
import { createClient } from "jsr:@supabase/supabase-js@2";

const URL_  = Deno.env.get("SUPABASE_URL")!;
const SRK   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CRON  = Deno.env.get("CRON_SECRET") ?? "";
const CATS  = new Set(["ai_tech","australia","india","nepal","markets","discovery"]);
const PER_FEED = 12;          // newest few from each feed is plenty for a morning read
const KEEP_DAYS = 4;          // anything older than this stops being "this morning"

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), {status:s, headers:{
    "Content-Type":"application/json",
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"authorization, content-type, apikey, x-cron-key"
  }});

/* ---------- a small, forgiving feed parser ---------- */
const dec = (s: string) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]*>/g, " ")
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h,16)))
  .replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&nbsp;/g," ")
  .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")
  .replace(/\s+/g," ").trim();

function tag(block: string, names: string[]): string | null {
  for (const n of names){
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
    if (m) return dec(m[1]);
  }
  return null;
}
function linkOf(block: string): string | null {
  const href = block.match(/<link[^>]*\brel=["']?alternate["']?[^>]*\bhref=["']([^"']+)["']/i)
    || block.match(/<link[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i);
  if (href) return dec(href[1]);
  const plain = tag(block, ["link","guid","id"]);
  return plain && /^https?:\/\//i.test(plain) ? plain : null;
}
function parseFeed(xml: string){
  const blocks = xml.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi) || [];
  const out: {title:string; url:string; published_at:string|null; summary:string|null}[] = [];
  for (const b of blocks.slice(0, PER_FEED)){
    const title = tag(b, ["title"]);
    const url = linkOf(b);
    if (!title || !url) continue;
    const when = tag(b, ["pubDate","published","updated","dc:date"]);
    const t = when ? Date.parse(when) : NaN;
    const summary = tag(b, ["description","summary"]);
    out.push({
      title: title.slice(0, 300),
      url: url.slice(0, 900),
      published_at: Number.isFinite(t) ? new Date(t).toISOString() : null,
      summary: summary ? summary.slice(0, 400) : null
    });
  }
  return out;
}

/* Google News wraps the real article; the title keeps a " - Source" tail. */
function sourceFrom(name: string, title: string){
  const m = title.match(/\s-\s([^-]{2,40})$/);
  return (m ? m[1].trim() : name).slice(0, 60);
}

async function pullOne(sb: any, src: any){
  try {
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 12000);
    const r = await fetch(src.feed_url, {
      signal: ctl.signal,
      headers: {"User-Agent":"rahulkd.com-life/1.0 (+https://rahulkd.com/life)",
                "Accept":"application/rss+xml, application/atom+xml, application/xml, text/xml, */*"}
    });
    clearTimeout(to);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const xml = (await r.text()).slice(0, 2_000_000);
    const items = parseFeed(xml);
    if (!items.length) throw new Error("no items found in feed");

    const rows = items.map(it => ({
      user_id: src.user_id,
      category: CATS.has(src.category) ? src.category : "ai_tech",
      title: it.title,
      url: it.url,
      source: sourceFrom(src.name, it.title),
      summary: it.summary,
      published_at: it.published_at
    }));
    // on_conflict do nothing, so re-running during the day is cheap and idempotent
    const { data, error } = await sb.from("life_news")
      .upsert(rows, {onConflict:"user_id,url", ignoreDuplicates:true}).select("id");
    if (error) throw error;
    await sb.from("life_news_sources")
      .update({last_ok:new Date().toISOString(), last_error:null}).eq("id", src.id);
    return (data || []).length;
  } catch (err) {
    await sb.from("life_news_sources")
      .update({last_error:String((err as Error).message || err).slice(0,200)}).eq("id", src.id);
    return 0;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return json({ok:true});
  if (req.method !== "POST") return json({error:"POST only"}, 405);

  const sb = createClient(URL_, SRK, {auth:{persistSession:false}});
  const auth = req.headers.get("Authorization") || "";
  const cronKey = req.headers.get("x-cron-key") || "";

  let userIds: string[] = [];
  if (CRON && cronKey && cronKey === CRON){
    const { data } = await sb.from("life_news_sources").select("user_id").eq("active", true);
    userIds = [...new Set((data || []).map((r: any) => r.user_id))];
  } else {
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return json({error:"Not signed in."}, 401);
    const { data:{ user }, error } = await sb.auth.getUser(token);
    if (error || !user) return json({error:"Not signed in."}, 401);
    userIds = [user.id];                       // never anyone else's feeds
  }
  if (!userIds.length) return json({added:0, feeds:0});

  const { data:srcs } = await sb.from("life_news_sources")
    .select("*").in("user_id", userIds).eq("active", true);
  const feeds = srcs || [];

  let added = 0;
  for (let i = 0; i < feeds.length; i += 5){
    const batch = await Promise.all(feeds.slice(i, i+5).map((s: any) => pullOne(sb, s)));
    added += batch.reduce((a: number, b: number) => a + b, 0);
  }

  const cutoff = new Date(Date.now() - KEEP_DAYS * 86400000).toISOString();
  await sb.from("life_news").delete().in("user_id", userIds).lt("fetched_at", cutoff);

  for (const uid of userIds){
    await sb.from("life_sync_log").insert({
      user_id: uid, source: "news", ok: true,
      detail: `${feeds.filter((f: any) => f.user_id === uid).length} feeds, ${added} new`
    });
  }
  return json({added, feeds: feeds.length});
});
