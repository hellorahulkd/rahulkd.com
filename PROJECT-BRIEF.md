# rahulkd.com — complete project brief

*A self-contained handoff. Paste or upload this whole file to give any AI assistant
full context on the project without it needing to visit the site.*

Last updated: 25 September 2026

---

## 1. What this is in one paragraph

A one-page personal portfolio site for **Rahul Kumar Das**, a Sydney-based content
creator, videographer and digital marketer. It is a single hand-written `index.html`
— no framework, no build step, no dependencies — served by GitHub Pages on the custom
domain **rahulkd.com**. The site's job is to get a prospective client from "who is
this" to "email sent" in one scroll, using embedded real videos as the proof rather
than describing the work in words. A companion print brochure (A4, folds to A5) was
added to hand out in physical shops.

---

## 2. Hosting, domain and deployment

| Thing | Value |
| --- | --- |
| Live URL | `https://rahulkd.com` |
| GitHub repo | `hellorahulkd/rahulkd.com` |
| Host | GitHub Pages, served from the `main` branch |
| Custom domain | Set by the `CNAME` file at repo root, containing `rahulkd.com` |
| DNS | A records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages). No Cloudflare or other CDN in front. |
| Deploy process | **Merging to `main` is the deploy.** There is no CI, no build, no staging. |
| History | 41 commits on `main`, ~22 merged pull requests |

---

## 3. Repository layout

```
CNAME                       → "rahulkd.com"
index.html                  → the entire portfolio site (1,092 lines, 60KB)
resume.pdf                  → downloadable CV, linked from the page
assets/                     → 19 JPGs (hero, about, client logos, video thumbnails)
brochure/                   → print brochure (currently on a branch, not yet merged)
  index.html                  the four-panel layout, print CSS
  rahul-brochure-A4.pdf       exported, print-ready
  DESIGN.md                   the design thinking write-up
  qr-rahulkd.png / .svg       QR code to rahulkd.com
  rahul.jpg                   square portrait crop
  fonts/                      Anton, Inter, IBM Plex Mono (woff2, bundled locally)
dashboard/, life/, tools/   → unrelated private side-projects that share the domain
```

> **Note on `dashboard/`, `life/` and `tools/`:** these are separate personal apps
> (a private life dashboard on Supabase, a retired morning dashboard) that happen to
> live in the same repo. They are *not* part of the portfolio project and are
> publicly reachable at `rahulkd.com/life` etc. Deliberately excluded from this brief.

---

## 4. Who Rahul is (facts, for accuracy)

- Arrived in Sydney from **Nepal at 19**, knowing nobody. First job in Australia was at **KFC**.
- Picked up a camera **about ten years ago** — photography first, then video, then storytelling.
- **4+ years** doing content professionally. **10M+ views** across the work.
- Brought **30+ clients** into a firm on a **$0 ad budget**.
- **President, Student Representative Council (SRC)**, Torrens University — represented **3,000+ students**. Promoted from member → social media manager → president.
- **TAC Assistant, Torrens University Australia** (current) — course fee and admissions data across UAC and QTAC systems, including a master reference workbook spanning 60+ courses.
- **Founder, Passport People** — a student travel brand for Sydney uni students aged 19–26.
- **MBA (Advanced)**, Torrens University Australia, Sydney campus, **full scholarship**, in progress.
- **Bachelor of Business Information Systems**, Torrens University Australia, completed **December 2025**.
- Works both sides of the camera: writes, shoots, presents, edits.
- Personal account content: cooking, memes, piano and singing, occasional educational posts.

**Contact:** `hello.rahulkd@gmail.com` · Instagram `@_rahul_kd_` (personal) and
`@rahul_yaps` (work) · `linkedin.com/in/rahulkd` · Sydney, Australia.

---

## 5. Page structure and full copy

Single page, sticky nav, seven numbered sections plus a hero.

### Hero
- Rotating badges: *Content Creator · Storyteller · Digital Marketer*
- Name set in three stacked lines: **RAHUL / KUMAR / DAS**
- A hand-drawn marker circle around the words **"Creative Portfolio"**
- Body: *"I'm easy to work with, quick to reply, and my rates are fair. Hire me, you won't be sorry. If you don't, I'll be a little sad, but I'll still like your brand."*
- Second line: *"I make videos people actually watch to the end. 10M+ views and counting — a few of those are my mum, most aren't."*
- CTAs: **Work with me** / **Grab my CV**
- Animated count-up stats strip: Views and counting · Years doing this · Brands worked with · Students led

### 01 — About Me · "Who's this guy?"
Three paragraphs covering the camera origin story, the Nepal → KFC → campaigns arc,
and the both-sides-of-the-camera pitch, ending: *"I'd rather earn your audience's
trust slowly than borrow their attention for an afternoon."*
Flanked by two photos and a scrolling marquee of skills: Content Strategy, UGC &
Video Production, Scripting & Editing, Brand Identity, Pitch Decks, Photography,
On-camera Presenting, Data & Spreadsheets.

### 02 — Content Portfolio · "Have a look"
Four sub-blocks, all with **live embedded video**:
1. **Campaign videos** — two Instagram reels side by side, labelled *107K Views · Campaign* and *83.6K Views · Sales*.
2. **A proper brand film** — a YouTube embed. *"Written, shot and cut by us, start to finish. No stock footage, no AI voiceover, no 'we'll fix it in post'."*
3. **The ones that took off** — three viral Instagram reels.
4. **Off the clock** — three personal reels (team fun, travel with friends, "how I manage it all"). *"On my own account I cook, make memes, play the piano and sing, and post something educational when the mood takes me. None of it breaks the internet. That was never really the point."*
5. **For YouTube & LinkedIn** — a YouTube sales film plus informative and storytelling reels, and a LinkedIn post embed.
Also a thumbnail row: Location showcase (10K), Informative (Billboard), Paid (106K), Fun (10K).

### 03 — Clients · "Brands that took a chance on me"
Graduate Plus (Job Ready Program) · Sydney Tax & Accountancy Services ·
Torrens University Australia · BMIHMS (Blue Mountains International Hotel School).

### 04 — Services & Pricing
| Service | Rate | Typical |
| --- | --- | --- |
| UGC video, 15–30 sec, Instagram & TikTok | $45/hr | ~$220 |
| UGC video, 60–90 sec, LinkedIn & Facebook | $45/hr | ~$270 |
| UGC video, 2–8 min, YouTube & LinkedIn | $55/hr | ~$400 |

Also: Single post $45 · Carousel ~$200 · Story $45 · Presentation ~$200 · Poster $80 · Brochure $80.
*"Every price covers the thinking, the writing, the shooting and the editing. Gear's on me — you're not renting a camera."*

### 05 — Testimonials · "Don't take my word for it"
- **Juliana Rodriguez**, Marketing Executive, Torrens University Australia — *"Working with Rahul was effortless, our campaign saw a 3x boost in reach."*
- **Basan Subedi**, Founder, Graduate Plus & DigiPearl — *"He shared our product exactly how we imagined, genuine and beautifully styled."*

### 06 — Beyond Content · "The other hats I wear"
TAC Assistant (current) · SRC President (leadership) · Passport People (ongoing) ·
MBA and BBIS (education). Links out to the CV.

### 07 — Let's Talk
*"Got something you want made? Send me the details. I reply fast, and I won't pitch you anything."*
Email, Instagram, LinkedIn. Dark "midnight" section. A floating availability pill
reads *"Open for new projects — Sydney, AU"* (hidden below 680px).

---

## 6. Embedded media inventory

13 iframes total, all third-party, no local video files.

**Instagram reels** (`instagram.com/reel/<id>/embed`):
`DLkA28Epd9h` (107K campaign) · `DKPCniky3_O` (83.6K sales) · `DYehDQJxJKr`,
`DYwxxr-x9qa`, `Dbx8SdERL0Z` (viral) · `DKb6l4iyXAk` (team fun) · `DPGgXVckiij`
(travel) · `DLvvGg9z4Zb` (how I manage it all) · `DRs-86Dkp8Q` (informative) ·
`DSKP8UJkidj` (storytelling)

**YouTube** (`youtube-nocookie.com/embed/<id>`): `ZtGtrbKrCpI` (brand film) · `YuhRqt8VN7A` (sales)

**LinkedIn**: `urn:li:activity:7405094085272756224` (BMIHMS)

---

## 7. Design system

**Influences:** Apple's "gallery wall" (large calm imagery), ElevenLabs' "architect's
blueprint" (numbered sections, monospace labels, hairline rules), Linear's "midnight
command center" (the dark contact section).

**Type**
- `Anton` — display headings, all-caps
- `Inter` (400/500/600/700/800) — body
- `IBM Plex Mono` (500/600) — eyebrows, section numbers, labels, captions

**Colour tokens** (CSS custom properties on `:root`)
```
--ink:          #14120F    --orange:       #D9542E
--paper:        #F7F5F1    --orange-dark:  #B33F22
--paper-dim:    #EDEAE2    --blue:         #3E5CDB
--card:         #FFFFFF    --green:        #1FA35C
--rule:         #DDD8CC    --midnight:     #121420
--cream-text:   #EDEAE2    --midnight-card:#1B1E2E
--max:          1080px     --midnight-rule:#2C3046
```

**Recurring motifs**
- Numbered sections (`01`–`07`) in mono, orange, beside each heading
- Hairline `rule-top` dividers between sections
- **Hand-drawn marker circle** — an SVG with `preserveAspectRatio="none"` and
  `vector-effect:non-scaling-stroke`, so the oval stretches to fit any text while the
  stroke keeps a constant hand-drawn weight. Reused three times.
- Floating, faintly animated social reaction icons (heart, comment, send, save)
- Scroll-triggered reveal animations and count-up stats

---

## 8. Technical implementation

- **One file.** All HTML, CSS and JS inline in `index.html`. Zero dependencies except Google Fonts.
- **Reveal animations**: `IntersectionObserver` with `threshold: 0` and
  `rootMargin: '0px 0px -8% 0px'`. CSS is scoped to `.js .reveal` and an inline
  script adds `.js` to `<html>` before `</head>`, so with JS disabled everything is
  visible. A `prefers-reduced-motion` rule disables the motion entirely.
- **Instagram iframe auto-height**: Instagram broadcasts a `postMessage` of type
  `MEASURE` carrying the real embed height. The page listens, validates the origin is
  `instagram.com`, and sets the iframe height to match — this is what removed the
  blank space under the reels.
- **Count-up stats**: a second `IntersectionObserver` animates the numbers once on entry.
- **Scroll spy** highlights the current nav item; a progress bar tracks scroll depth.
- **Section anchors** carry `scroll-margin-top:76px` so headings clear the sticky nav.
- Mobile was treated as the primary target after the phone layout was found broken.

---

## 9. The print brochure

Built September 2026 to hand out in Sydney shops. On the branch
`claude/rahulkitty-redesign-8m6cy2`, not yet merged.

**Format:** one A4 landscape sheet (297×210mm), printed double-sided, folded once
down the middle into four A5 panels (148.5×210mm each).

**The offer:** the first video is free. Rahul makes it, hands it over, and if they
don't like it they keep it anyway and pay nothing.

| Panel | Headline | Job |
| --- | --- | --- |
| Front | *Your first video is on me* | Stop them at 1.5m. Orange, 27mm display type, one sentence, a 32mm QR code. |
| Inside left | *Three steps. No contract. No catch.* | Kill the process fear. |
| Inside right | *I've done this a few times* | 10M+ / 107K / 83.6K / 30+, four named clients, Juliana's quote. Midnight navy. |
| Back | *No quote form. Here's the whole price list.* | Prices, his face, contact details, QR again. |

Two QR codes (both → `https://rahulkd.com`, error-correction level H) so a code is
visible whether the brochure lands face-up or face-down in a stack. Fonts are
bundled locally so printing never depends on a network. Verified at true print size:
panels exactly 148.5×210mm, nothing within 8mm of a trim edge or the fold, no
overlapping text, both codes decode from a 300dpi raster of the final PDF.

Built using the design thinking process (empathise → define → ideate → prototype →
test); the full write-up is in `brochure/DESIGN.md`.

---

## 10. Known issues and open items

**Discoverability — the site is effectively invisible to search and AI assistants.**
Verified missing from `index.html`:
- No `robots.txt` anywhere in the repo (so nothing is *blocked* — absence means allowed)
- No `sitemap.xml`
- No `rel="canonical"`
- No Open Graph or Twitter card tags — the link does not unfurl when pasted anywhere
- No JSON-LD / structured data (no `Person` or `ProfilePage` schema)
- Almost certainly not submitted to Google Search Console or Bing Webmaster Tools,
  and few or no backlinks

There *is* a `<title>` and a `<meta name="description">`.

**Rendering risk for crawlers.** 693 of 1,446 body words (47%) sit inside
`<section class="reveal">`, which renders at `opacity:0` until an IntersectionObserver
fires on scroll. A crawler that renders the page but doesn't scroll may see roughly
half the site as blank. Raw-HTML text extractors are unaffected.

**Unverified.** Whether GitHub Pages has "Enforce HTTPS" enabled and a valid
certificate provisioned for the custom domain.

**Cosmetic, open.** One Instagram reel cover in the "Off the clock" row renders
without letterboxing while its neighbours have black bars, because Instagram serves
a differently-shaped source video. This is cross-origin and cannot be fixed with CSS
— it would need the reels force-cropped to a uniform frame.

---

## 11. Good things to ask an AI assistant about this project

- Write the `robots.txt`, `sitemap.xml`, canonical, Open Graph and JSON-LD `Person`
  structured data for a one-page GitHub Pages portfolio
- Improve the discoverability so the site turns up in AI search results
- Critique the copy or the section order for conversion
- Suggest what a second page (case studies, a blog) would need to be worth adding
- Review the pricing against the Sydney UGC market
- Plan the distribution for the printed brochure
