# Station Log

A personal morning dashboard. **It now lives in Notion**, in Kumar Rahul's Space:
<https://app.notion.com/p/3d7f9a0e3f1c81059584c1e7d8df8550>

This directory holds the two HTML pages that came before and beside it.

| File | What it is |
| --- | --- |
| `station-log.html` | The full interactive dashboard, retired. Source is kept because it does things Notion can't — see below. |
| `moved-to-notion.html` | What the Claude Artifact serves today: a signpost to the Notion page. Published at `claude.ai/code/artifact/86c7ac25-ce62-4586-bd94-4e800eaff742`. |

## The Notion build

One page with four boards nested inside it:

| Board | Holds |
| --- | --- |
| **Priorities** | Name, Done, Date, Held over, Note. Unfinished rows are carried to the next day and `Held over` counts the mornings. |
| **Daily log** | One row per day. Habits are tagged in a `Habits done` multi-select, so adding a habit is a new tag rather than a schema change. |
| **Goals** | Current / Target / Unit with a `Progress %` formula. |
| **Ledger** | One row per month, with `Left` = Budget − Spent. |

Extra views: *Still open* on Priorities (unticked, most-held-over first), *Month* calendar on Daily log, *In flight* on Goals.

A scheduled Routine fires at 6:20am Sydney (`20 20 * * *` UTC) and, in one pass:
rolls unfinished priorities forward, opens today's Daily log row, opens a Ledger row
for a new month, reads Google Calendar and Gmail, looks up the forecast and three
headlines, then rewrites the top of the page and the *Worth knowing* block via
`update_content` with verbatim `old_str` — never `replace_content`, which would take
the four child databases with it.

## Why the HTML version is still here

Notion has no live link to Google Calendar, so *Today's shape* on the Notion page is
accurate as of the morning run rather than the minute you look at it.
`station-log.html` had no such gap: it reached Google Calendar and Gmail itself
through the Artifact `mcp` capability on every open, drew the day as a density bar in
the colours set on the events in Google Calendar, refreshed every five minutes, and
triaged the inbox using Gmail's own category labels.

Publishing it back to the same artifact URL restores it:

```
Artifact(file_path="tools/station-log/station-log.html",
         url="https://claude.ai/code/artifact/86c7ac25-ce62-4586-bd94-4e800eaff742",
         capabilities={"db": {}, "sample": {},
                       "mcp": {"servers": [
                         {"server": "Google Calendar", "tools": ["list_events"]},
                         {"server": "Gmail", "tools": ["search_threads"]}]}})
```

It reaches every capability through `await claude.use(name)` and treats a `null`
answer as normal, so it also runs standalone on `localStorage` with each feed marked
not connected. Neither HTML file holds personal data.
