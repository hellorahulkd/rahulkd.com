# rahulkd.com/life

A private life dashboard: the day's shape, the three things that matter, food,
money, and a journal you fill in at night. Static page on GitHub Pages talking
to Supabase.

## How it hangs together

- `index.html` — the whole app. No build step, no framework. The Supabase JS
  client loads as an ES module from jsDelivr; everything else ships in the file.
- **Supabase project** `djqabdzhxtydkapltkcd` — *hellorahulkd's dashboard
  Project*, in the `rahulkd` org, region ap-south-1. Nothing else lives in it.
  Tables are prefixed `life_`.
- **Auth** is a magic link. There is no password.
- The publishable key in the page is *meant* to be public. Every `life_` table
  has RLS on with a single policy — `user_id = auth.uid()` — so the key alone
  reads and writes nothing.

## Tables

| Table | What it holds |
| --- | --- |
| `life_settings` | name, timezone, currency, wake and sleep times |
| `life_journal` | one row per night; typed columns for the dials, `answers` jsonb for anything the form grows later |
| `life_journal_fields` | **the form itself, as rows.** One per question: label, type, section, options, scale range. The Journal tab renders from this, so changing the nightly form is data, not code |
| `life_tasks` | the three, plus anything added by hand. `journal_id` marks the ones a journal entry created |
| `life_routine` | the weekly template. `starts_on`/`ends_on` scope a block to a date range, which is how class only shows during the trimester |
| `life_day_overrides` | skip, move or add a block on one date, so a week can bend without being rewritten |
| `life_meal_plan` / `life_meal_log` | what you mean to eat by weekday; what you actually ate |
| `life_budget_categories` / `life_transactions` | buckets with a monthly amount, and every spend against them |
| `life_savings_goals` | target, saved, and a date — which is what turns a goal into a monthly number |
| `life_calendar` | today's Google Calendar events, written in by the scheduled morning run (a static page can't hold Google OAuth) |

## Setup this needs once

1. **Supabase → Authentication → URL Configuration**, on project
   `djqabdzhxtydkapltkcd` — check the ref in the dashboard URL, there is a
   second project with a nearly identical name.
   - Site URL: `https://rahulkd.com/life`
   - Redirect URLs: `https://rahulkd.com/**`
   Site URL defaults to `http://localhost:3000`; leave it and every magic link
   lands on a dead localhost page.
2. **Merge this branch into `main`.** GitHub Pages serves `main`, so `/life`
   only goes live once it lands there.

## Editing it

Everything is in one file, in this order: CSS tokens → shell → one `view*()`
function per tab → a delegated `click` / `change` / `submit` handler → `boot()`.

**The nightly form is not in the code.** It is rows in `life_journal_fields`,
rendered by `fieldHTML()`. Supported types: `scale`, `short`, `para`, `number`,
`choice`, `checks`, `select`, `bool`, `date`, `time` — which covers every
question type Google Forms offers. Add or reorder questions from the page
itself (Journal → *Edit these questions*), or insert rows directly.

Where an answer is stored depends on the field's `key`: if it matches a column
on `life_journal` (`mood`, `sleep_hours`, `wins`, …) it goes there and is
queryable; anything else lands in the `answers` jsonb. Deleting a question never
deletes answers already given — they just stop being displayed.

To work on it offline, stub the Supabase client — the shape used is small
(`from().select().eq().order()`, `auth.getSession()`), and a fake one renders
every view without a network.

## Voice capture

`Capture` records (or takes an uploaded file), stores the audio in the private
`recordings` bucket, and calls the `transcribe` Edge Function. The function runs
with `verify_jwt` on and builds its Supabase client from the *caller's* token, so
RLS — not a client-supplied header — decides what it can touch.

State lives on `life_recordings.status`:
`uploading → uploaded → transcribing → organising → ready`, or `failed`.
A failure never deletes `storage_path`, so Retry re-runs against the same audio.
Both upstream calls are wrapped in `AbortController` (120s transcribe, 60s plan)
and the browser adds its own 210s ceiling, so nothing loads indefinitely.
`REC.busyId` plus a 409 from the function guard against double submits.

Proposed tasks stay on the recording row until you tick and accept them; only
then do they become `life_tasks` with `source='voice'`. `date_is_explicit`
separates a date you actually said from one the model inferred, and the UI says
which is which. Model enums are re-validated server-side — an unknown area or
priority is coerced, never trusted.

**Not configured yet:** the function needs `OPENAI_API_KEY` in Supabase →
Edge Functions → Secrets. Until it's set, a run returns `not_configured`, leaves
the recording at `uploaded` rather than `failed`, and the UI offers Retry.

## Google Calendar + Gmail

Sign in with Google (`access_type=offline`, `prompt=consent`) and Supabase Auth
returns a `provider_refresh_token`. The page posts it **once** to
`google-sync` with `action:"link"`; it is stored in `life_google_auth`, a table
with RLS on and **no policy for `authenticated`**, so only an Edge Function
holding the service role can ever read it back. The browser cannot retrieve it.

`google-sync` then:
- **Calendar** — primary calendar, 28 days from today, every page in that window
  (`singleEvents`, `orderBy=startTime`, up to 12 pages). Clashes get
  `is_overlapping`. The window is deleted and rewritten each run, so an event
  deleted in Google disappears here; rows already promoted to a task are spared.
  The inclusive last date covered is recorded in `life_sync_log.covered_through`.
- **Gmail** — `is:unread in:inbox newer_than:7d -category:promotions
  -category:social -category:forums`, newest 20 threads read as *metadata only*.
  Bodies are never stored. `List-Unsubscribe` or a no-reply-shaped sender marks
  a thread as noise; everything else is a candidate for a reply. When more than
  20 matched, the log says so — the count shown is a sample, never a total.

It never writes to Calendar, and never sends, marks read, archives or deletes
mail. Each run writes a row to `life_sync_log`, which the Inbox header reads so
it can say *when* it last succeeded and name a source that failed, rather than
showing stale data as if it were current.

**Needs:** `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` as Edge Function secrets,
and Google enabled as an Auth provider with the same credentials.

## Video transcription

Whisper caps uploads at 25 MB, so video is handled in the browser before upload:
`decodeAudioData` pulls the audio track out, an `OfflineAudioContext` downmixes
it to 16 kHz mono, and it is written out as WAV — roughly 13 minutes per 25 MB.
No ffmpeg, no library, nothing leaves the machine until the audio is ready.
Anything over the limit after that says how long it is and asks you to trim.

## The nightly ritual (Tonight)

`life_day_plan`, keyed `(user_id, on_date)`, holds tomorrow:
`wake_time`, `sleep_time`, `theme`, plus two JSON columns.

- `meals` — `{breakfast:{at,what}, lunch:{…}, dinner:{…}, snack:{…}}`
- `intentions` — `[{what, at, place, after, two_min, area, done}]`

The intention shape is the point. Each of those keys is one technique from
*Atomic Habits*, made into a field you cannot skip past:

| field | technique |
|---|---|
| `at` + `place` | **implementation intention** — *I will [X] at [time] in [place]* |
| `after` | **habit stacking** — hung off something already in the day |
| `two_min` | **two-minute rule** — the version you can still do on a bad night |
| `done` | the chain, ticked off on Today the next morning |

Tonight is a stepper, not a long form: one question per screen, Enter moves on,
and the numbered rail jumps anywhere. All steps live in one `<form>` with the
inactive ones hidden, so moving between them never re-renders and nothing typed
is lost. The last step reads the whole form back before anything is saved.

The journal questions themselves come from `life_journal_fields`, same as
before. The seeded set is now `short` rather than `para` — the form asks a
question and expects four or five words, not a paragraph. Scales, numbers and
yes/no are grouped onto one opening screen because they're fast; everything
else gets a screen each.

One submit writes all three: the `life_journal` entry, up to three
`life_tasks` for tomorrow, and the `life_day_plan` row. Ticking a habit off the
next morning writes back into `intentions` in place.

## News

`life_news_sources` is an editable list of RSS feeds per category
(`ai_tech`, `markets`, `australia`, `india`, `nepal`, `discovery`).
The `news-fetch` Edge Function pulls each one, parses RSS **and** Atom with a
small forgiving regex parser — no XML library, no API key, nothing to rotate —
and upserts into `life_news` on `(user_id, url)`, so re-running during the day
is idempotent. Anything older than four days is dropped on each run.

Feed text is data, never instruction: titles and links are stored, escaped on
output, and nothing in a feed is ever interpreted.

**What triggers it:** opening the dashboard. If the newest headline is more
than four hours old, the page pulls in the background and re-renders when it
lands — so the news is fresh at the moment it's read, rather than fresh at 6am
and stale by the time anyone looks. A failed pull is silent; the page still
works. `Refresh now` on the News page forces it.

A scheduled pull is wired but dormant: set a `CRON_SECRET` Edge Function
secret and the function will accept an `x-cron-key` header and run for every
user who has feeds, which `pg_cron` + `pg_net` can call on a schedule. Without
that secret the cron path is simply off, and only a signed-in request works —
and it only ever touches that user's own feeds.
