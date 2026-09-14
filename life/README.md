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
