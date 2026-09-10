# Station Log

A personal morning dashboard, published as a private Claude Artifact:
<https://claude.ai/code/artifact/86c7ac25-ce62-4586-bd94-4e800eaff742>

`station-log.html` is the source of that page, kept here for version control.

## What's on it

| Panel | Where the data comes from |
| --- | --- |
| Briefing, weather, headlines, quote | `dash/brief` in the artifact database, rewritten each morning by a scheduled Routine |
| Today / Tomorrow | Google Calendar `list_events`, read live by the page on open, refreshed every 5 min |
| Inbox | Gmail `search_threads` (`is:unread in:inbox newer_than:3d`), same |
| Priorities, habits, goals, ledger | `dash/*` in the artifact database, written by the page itself |

Unfinished priorities are carried to the next day with a "held over" count. The
monthly ledger resets when the month does. Habit streaks run back from today, and
today being unticked doesn't break one.

## Notes on the source

The file is written for the Artifact runtime, which wraps it in its own
`<!doctype html><head>…</head><body>` — so it deliberately has no `<html>`,
`<head>` or `<body>` tags of its own.

It reaches its capabilities through `await claude.use(name)` and treats a `null`
answer as normal: opened anywhere that isn't a Claude Artifact viewer it still
renders, falling back to `localStorage` and showing each feed as not connected.
It holds no personal data — everything personal lives in the artifact's database,
behind the owner's account.

Calendar events are coloured with the colour Rahul set on them in Google Calendar,
so the day bar reads the way his calendar does.

## Republishing

```
Artifact(file_path="…/station-log.html",
         url="https://claude.ai/code/artifact/86c7ac25-ce62-4586-bd94-4e800eaff742")
```

Omitting the `url` from a fresh conversation creates a *second* artifact rather
than updating this one.
