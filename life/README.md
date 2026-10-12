# Life — rahulkd.com/life

A nightly ritual, a morning read-back, and the day's news. One HTML file on
GitHub Pages plus one scheduled GitHub Action. No server, no database, no
account, no API key, nothing to pay for.

## How it hangs together

```
life/index.html     the whole app — markup, styles, logic, no build step
life/feeds.json     which RSS feeds go in which section (edit this to change them)
life/fetch-news.mjs plain Node, no dependencies, parses RSS and Atom
life/news.json      what the last run found; the page reads it as a plain file
.github/workflows/news.yml   runs the fetch each morning and commits news.json
```

## Where your writing lives

In the browser, under one `localStorage` key (`life:v2`). It survives closing
the tab and restarting the machine. It does **not** follow you to another
device, and clearing your browsing data erases it.

That is the honest trade for having no server: nothing to sign into, nothing
that can leak, nothing that can go down — and no safety net either. So **Setup**
has *Download a backup* and *Restore from a backup*: one JSON file holding
everything, which is also how you get the same data onto your phone.

The page is public, because GitHub Pages is. What you write is not — it never
leaves your browser. The page carries `noindex` so it stays out of search.

## Tonight

One question per screen. Enter moves on, the numbered rail jumps anywhere.
Every step lives in the same `<form>` with the inactive ones hidden, so moving
between them never re-renders and nothing typed is lost.

1. **The day, in numbers** — scales and yes/no together, because they're fast
2. **Six short questions**, one per screen, four or five words each
3. **Tomorrow's three**
4. **Food** — breakfast, lunch, dinner, snack, each a time *and* what it is
5. **Habits** — see below
6. **The shape of tomorrow** — one line, wake, lights out
7. **Read it back** — the whole plan, rendered from the live form, before saving

Meal times pre-fill from your week, and tomorrow's gym/study/class blocks turn
into suggested habits with their times already in.

### The habit fields are the technique

Each slot asks five things, and each is one idea from *Atomic Habits* turned
into a field you can't skip past:

| field | technique |
|---|---|
| `at` + `place` | **implementation intention** — *I will [X] at [time] in [place]* |
| `after` | **habit stacking** — hung off something already in your day |
| `two_min` | **two-minute rule** — the version still doable on a bad night |
| `done` | the chain, ticked off on Today the next morning |

One submit writes the journal entry and tomorrow's plan together.

## Today

Reads last night's plan straight back: the one-line theme, *next up* with its
time and place, the three tasks, the habits with their anchor and bad-day
version, and the meals with times. Ticking anything writes back into the plan.

Below it: the week's shape for today, a code for the day, and the top headline
from each news section.

## News

`feeds.json` lists 20 public RSS feeds across six sections — AI & technology,
Markets & investing, Australia, India, Nepal, Discovery & innovation.

The Action runs at **19:50 UTC** (6:50am Sydney in summer, 5:50am in winter),
fetches every feed, and commits `news.json`. Minute is off the hour on purpose:
GitHub's runners are busiest at :00 and scheduled jobs get delayed there.

The page then just `fetch`es `news.json` from its own origin — no CORS problem,
nothing to authenticate. A run keeps anything still recent from the previous
one, so a single feed having a bad morning can't blank a section. Headlines
older than five days drop out.

Feed text is treated as **data**: titles are stored as text and escaped by the
page on output, links are kept only if they're `http(s)`, and nothing a feed
says is ever interpreted as markup or instruction.

Feeds that fail are listed at the bottom of the News page with their error, so
a dead feed is visible rather than silently missing.

**To run it by hand:** Actions → *Morning news* → *Run workflow*.
**To change the feeds:** edit `life/feeds.json`.

## Changing the questions

**Setup** adds, removes and reorders them. Removing one keeps the answers you
already gave — it just stops being asked.
