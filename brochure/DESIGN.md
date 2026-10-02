# The free-first-video brochure — design thinking record

A4, landscape, folded once down the middle → four A5 panels.
Files: `index.html` (source of truth), `rahul-brochure-A4.pdf` (send this to a printer).

---

## 1. Empathise — who actually picks this up

The reader is not looking for a videographer. They are a café, gym, salon, barber,
florist or bottle-shop owner in Sydney, standing behind a counter, mid-shift. The
brochure is in a stack by the register or being handed over between customers.

What I heard from that context, and what it means:

| What they think | What it means for the brochure |
| --- | --- |
| "I know I should be posting reels. I don't have time." | Don't sell the idea of video. They already believe it. Sell the removal of effort. |
| "Marketing guys have burned me before." | Credibility has to be evidence, not adjectives. |
| "I have no idea what this costs and I'm not asking." | Price opacity is the silent killer. Publish the numbers. |
| "I don't want a call. I don't want a contract." | Every word that sounds like a sales process is a leak. |
| "I have about eight seconds." | The cover carries one idea, not five. |

**Hardest constraint:** it has to work at two distances — readable across a counter
from 1.5m, and rewarding in the hand at 30cm.

## 2. Define — the point of view

> A small-business owner who already believes in video, but has no time, no price
> confidence and no trust in marketers, needs a **zero-risk way to see what good
> content looks like for their own shop** — because the only thing that actually
> convinces them is watching their own business look good.

**How might we** make a stranger trust him enough to say yes in the eight seconds
they're holding a piece of paper?

## 3. Ideate — options considered

- Portfolio brochure (here's my work) — *rejected: it asks them to imagine the outcome.*
- Discount on the first video — *rejected: a discount is still a decision about money.*
- Tear-off contact strip — *rejected: a QR does the same job and doesn't get shredded.*
- Price-list-only card — *rejected: informative, zero pull.*
- **First video free, keep it either way** — *chosen.*
- QR as the single call to action — *chosen: the proof is video, and video doesn't fit on paper.*

Why the free video wins, in plain psychology:

- **Zero-price effect.** $0 isn't "cheap", it's a different category. The jump from $50 to $0 is bigger than $200 to $50.
- **Reciprocity.** He gives first. A finished video in their hands is a real gift, and real gifts create real obligation.
- **Risk reversal / regret aversion.** "Keep it anyway" removes the only reason to say no.
- **Endowment effect.** Once they hold a video of *their* shop, giving it up feels like a loss.
- **Pratfall / plain speech.** Admitting "nobody believes a brochure" buys more trust than another superlative.
- **Hick's law.** One offer, one action, one code. No menu of packages to weigh up.

## 4. Prototype — why the panels are in this order

A half-fold has a fixed reading order, and each panel gets exactly one job.
Nothing is repeated, because repetition is how brochures get thrown out.

| | Panel | Job | The one thing it does |
| --- | --- | --- | --- |
| Front (outside right) | **Your first video is on me** | Attention | Stop them at 1.5m. Orange block, ~27mm display type, one sentence, one 32mm QR. |
| Inside left | **Three steps. No contract. No catch.** | Interest | Kill the "what's the process?" fear in three short steps. |
| Inside right | **I've done this a few times** | Desire | Numbers and named clients on midnight navy — the spread opens into a hard turn of contrast. |
| Back (outside left) | **No quote form. Here's the whole price list.** | Action | Answer the unasked money question, show his face, give five ways to reach him and the QR again. |

That's AIDA mapped onto the physical fold, and the panel numbering (01 → 02 → 03)
runs in the order the paper actually opens.

Deliberate choices:

- **Two QRs, not one.** Brochures land face-up *or* face-down in a stack. Either way a code is showing.
- **Error correction level H (30%).** Survives a thumbprint, a scuff or a cheap printer.
- **Face on the back panel.** Liking bias: people hire a person, not a service.
- **Published prices.** Anchoring works better than mystery, and "from $45" makes the free video read as a genuine gift rather than a hook.
- **His site's own palette and type** (Anton / Inter / IBM Plex Mono, orange `#D9542E`, midnight `#121420`) so the paper and rahulkd.com feel like one thing when the QR lands them there.
- **Fonts are bundled locally** — printing never depends on a network, and the shop's PDF can't substitute Arial.

## 5. Test — what was actually checked

Rendered at true print size in Chromium and measured, not eyeballed:

- All four panels are exactly **148.5 × 210mm**.
- **No element sits within 8mm** of any trimmed edge or the fold.
- **No overlapping text** in any panel.
- Smallest type is **7.2pt** (the word "from" on the price list); all body copy is 8.6–10pt.
- PDF exports as **2 pages at 841.92 × 594.96pt** — A4 landscape, borders zero.
- Both QRs **decode to `https://rahulkd.com`** from a 300dpi raster of the final PDF,
  and the cover code still decodes when downsampled to ~190px, well past normal phone range.

### Still to test in the real world

The part no render can check: whether a shop owner picks it up. Worth trying two
cover lines across the first fifty — the current one, and a flatter
"Free video for your shop. No catch." — and counting scans. The QR makes that
measurable if he adds a `?src=` tag per batch.
