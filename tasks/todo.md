# Brian rebrand rollout (July 2026)

Rebrand CliftonAi → Brian (getbrian.xyz). Plan:
`~/.claude/plans/i-ve-changed-the-brand-agile-puddle.md`

## Plan

- [x] Brand assets: brian-mark(-compact/-white).svg, brian-wordmark.svg, brian-mascot.svg
- [x] Regenerate favicons (favicon-32, icon-512, apple-touch-icon, favicon.ico) from the Brian mark
- [x] OG image 1200×630 + wired into layout.tsx metadata
- [x] Rewrite public/brand/built-by-badge.html → "Built by Brian" → getbrian.xyz
- [x] globals.css token swap (green → Brian Blue/Spark Yellow, paper/ink surfaces, glows/blobs)
- [x] layout.tsx: siteUrl getbrian.xyz, new title/description/OG image
- [x] page.tsx copy rewrite (nav, hero, pillars Replace/Personalise/Save, who-is-Brian, contact hello@getbrian.xyz)
- [x] New pricing-section.tsx (£1,000 + 50% + profit-share + worked example)
- [x] products-data.ts: drop CliftonAi prefix, proof-first category copy, keep *.cliftonai.co URLs
- [x] products-section.tsx: lockup ("Brian | Product") + "Built by Brian" credit
- [x] hero-diagram.tsx: Brian hub mark (squircle + B) + recolored glow/pulse
- [x] README.md rewrite; package.json name → brian-site; launch.json → brian-dev; package-lock.json resynced
- [x] docs/brand-book.html written + published as Artifact
- [x] Verification: dev server clean, grep audit, DOM/text-content check, OG check

## Review

Shipped in this pass:

- **Assets**: new `public/brand/brian-mark*.svg` (compact/full/white) — a rounded-square "B" mark in Brian Blue (#1B3FAB) + Spark Yellow (#FFC107), replacing the old green C-ring. `brian-wordmark.svg` renders "br**ia**n" with the "ia" in Spark Yellow (the flip-to-"brain" joke), plus a swap-arrow glyph. `brian-mascot.svg` is a single-stroke biro-doodle character (flat cap, mug of tea) for social/campaign use only — deliberately not used on the live site, to keep the corporate side credible.
- **Favicons/OG**: generated via a Pillow script (no SVG rasterizer available in this environment) — `favicon-32.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon.ico` (16/32/48 multi-size), and a new `og-image.png` (none existed before) using the same mark + "brian" wordmark treatment + tagline.
- **Tokens** (`globals.css`): kept the existing CSS variable *names* (`--brand-forest/mid/emerald/emerald-bright`) to minimize churn across components, but repointed every value from forest-green to Brian Blue; added `--brand-spark`/`--brand-spark-deep` for the yellow CTA accent. Surfaces moved from a cool near-white/green-tinted scheme to a warm paper/ink scheme (`--bg: #faf8f3`, `--fg: #14172b`). All hardcoded rgba glow/shadow/blob values recolored to match.
- **Copy**: full rewrite of `page.tsx` around the services-led "Brian replaces your software stack" positioning, pillars renamed Replace/Personalise/Save, new `pricing-section.tsx` for the £1,000 + 50%-of-prior-spend model with a worked example (£900/mo stack → £450/mo, saving £4,400 year one / £5,400/year after). Own products (`products-data.ts`) repositioned as proof rather than a product lineup — "CliftonAi ContentFlow" etc. became plain "ContentFlow" etc., with the "Brian | ContentFlow" lockup carrying the brand mark instead of a name prefix; `*.cliftonai.co` URLs kept as-is since those tool subdomains are still live.
- **Founder**: "Clifton Flack" name and CF monogram deliberately untouched throughout — Brian is the brand, Clifton is the person; copy now frames it as "Brian is what Clifton builds."
- **Brand book**: `docs/brand-book.html`, a self-contained field-guide document (embedded Space Grotesk/DM Sans + a subset Segoe Print for handwritten marginalia, light/dark theme support) covering brand story, voice, visual identity, the "If you see Brian, get him" campaign, a social content/prompt library (text, image, faceless video, presenter video), and pricing messaging. Published as a private Artifact.
- **Caught mid-build**: the wordmark treatment initially spelled "brain" outright (tspan order "br"+"ai"+"n") instead of "brian" with "ia" highlighted — fixed in the SVG, the live nav/footer, and the OG-image generator before shipping.

Verification: `npm install` clean (package-lock resynced to `brian-site`), dev server (`brian-dev`) started with zero server or browser console errors, full page text/DOM content checked via `get_page_text`/`read_page` (£ figures, all copy, all links correct), zero broken network requests. Grep audit for `CliftonAi`/`cliftonai` across the repo (excluding `node_modules`) returns only intentional legacy: the brand book's historical narrative, README's legacy-subdomain table, and `products-data.ts`'s `*.cliftonai.co` links — all by design per the plan. `package-lock.json`'s stale `cliftonai-site` name was the one real leftover, fixed via `npm install`. Browser-pane screenshots timed out again this session (same tool issue noted in the prior rollout's review) — visual verification was done via DOM text/attribute checks instead of pixels.

## v2 revision (user feedback)

User corrected the first-pass visual identity on three points — see [[brian-visual-preferences]] memory:

- [x] White backgrounds instead of warm "paper" cream (`--bg`/`--bg-panel` in globals.css, brand-book CSS vars, OG image/favicon background)
- [x] Navy instead of blue (`--brand-forest/mid/emerald/emerald-bright` repointed to a navy ramp: #0b1633 → #37518f), gold instead of yellow (`--brand-spark` #c9a227, deep #a8841d)
- [x] Removed all representation of Brian as a person: deleted `public/brand/brian-mascot.svg`, stripped the brand book's "Mascot" section and mascot/animated-mascot prompts, reworked the "Wanted: Brian" poster and sighting-scene prompts to explicitly exclude any figure/silhouette, added a "Brian is never a face" principle to the visual-identity chapter
- [x] Recolored every asset touched in v1: brian-mark(-compact).svg, brian-wordmark.svg, built-by-badge.html, hero-diagram.tsx, favicons/OG image (regenerated), docs/brand-book.html (republished, same Artifact URL)
- [x] Verified: dev server clean, computed styles confirm CTA is gold `rgb(201,162,39)` on ink text and body background is pure white `rgb(255,255,255)`, grep audit shows old blue/yellow/paper hex codes remain only in the (intentionally untouched) legacy CliftonAi green logo files and this file's own historical v1 log

## v3 — real logo (29 July 2026)

User supplied the actual logo (`docs/GetBrian_Logo.png`). Everything in v1/v2 above was
built against *placeholder* brand assets invented to unblock the rebrand — a navy
squircle with a Space Grotesk "B", and a lowercase `br**ia**n` wordmark. The real mark
is different: a heavy navy **B** whose lower counter is cut so it also reads **G**, gold
circuit traces entering from the left through the B's open counter, a gold swoosh off
the tail, and the wordmark **GetBrian** (Get navy, Brian gold).

Two conflicts, both put to the user before starting: the wordmark (logo's "GetBrian"
won; lowercase brian/brain retired) and scope (brand fidelity + hero rework; page
structure and copy untouched).

- [x] `scripts/trace-logo.mjs` — vectorise the raster logo. Nearest-reference-colour
      classification → per-colour bitmask → marching-squares boundary extraction (outer
      loops + holes) → Douglas-Peucker → `fill-rule="evenodd"` paths. Emits six assets:
      `brian-logo` (lockup), `brian-mark`, `brian-mark-white`, `brian-mark-solo`,
      `brian-mark-compact`, `brian-mark-compact-white`, `brian-wordmark`.
- [x] `scripts/gen-icons.mjs` — favicons (16/32/48 `.ico` written directly, no Pillow
      dependency this time), `favicon-32`, `icon-512`, `apple-touch-icon`, `og-image`,
      and the "Built by" badge, all derived from the traced SVGs so there is one source
      of truth. `npm run brand` runs both.
- [x] Tokens repointed to **sampled** values and renamed off the dead CliftonAi-era
      names: `--brand-forest/mid/emerald/emerald-bright` → `--brand-navy{,-mid,-soft,-bright}`,
      `--brand-spark{,-deep}` → `--brand-gold{,-hover,-deep,-light}`. Navy `#0b1633` →
      `#0a1d3b`, gold `#c9a227` → `#ba8b32`.
- [x] Wordmark → `GetBrian` (navy/gold) as a shared `Wordmark` component in `page.tsx`,
      used by nav and footer. Kept as live text, not the SVG, so it stays selectable and
      indexable.
- [x] `hero-diagram.tsx` rebuilt in the logo's own vocabulary — orthogonal traces with
      45° jogs, hollow gold terminal rings, solid studs, gold pulses, real mark as hub.
- [x] Metadata: title/OG title → "GetBrian — …", `siteName` → GetBrian.
- [x] Nav CTA touch target 36px → 44px (was below the WCAG minimum).
- [x] `docs/brand-book.html` brought up to the real identity — see below.

### Findings worth keeping

- **The mark cannot lose its traces.** Stripped to B + swoosh it reads unambiguously as a
  **"3"** at every size (checked 16/24/32/48px) — the B has no left stem, the traces are
  what close it. So the small-size cut *thickens* the traces (3.2px dilation, ring
  interiors filled, navy subtracted back out) rather than dropping them, and
  `brian-mark-solo.svg` exists only for the hero, where the diagram's own traces play
  that role and the built-in ones would read as a duplicate set.
- **Classifier ordering is load-bearing.** A 50% navy-on-white anti-alias pixel (≈#858E9D)
  is nearer to gold than to navy or white in plain RGB distance, so nearest-reference
  alone painted a gold fringe along every navy edge (48 spurious gold rings vs the true
  17). Testing warmth (r−b) before distance fixes it.
- **Gold is a display colour.** Logo gold is **3.08:1** on white — fine for the logotype
  (WCAG 1.4.3 exempts it) but not for body text, hence `--brand-gold-deep` (5.30:1) for
  small gold text and `--brand-gold-hover` (#a87b2a, 4.66:1 with ink) for the CTA hover;
  `gold-deep` measured 3.34:1 there and was rejected for that role.
- **Reversed marks need a lifted gold ramp** (#D2A03C→#F2DCA0): the on-white ramp starts
  at #A36A00, which on navy resamples to an indistinct dark smear at icon sizes.
- **The trace draw-in now fails visible.** Base state is `stroke-dashoffset: 0` with the
  hidden state supplied by the keyframe `from` and held by `backwards`, so if the
  animation never runs the hero keeps its connections instead of silently losing them.

### Verification

Tracer self-check re-rasterises the lockup and diffs it against the matching crop of the
source: **1.94% of pixels differ by >90/765, mean absolute error 2.04/255 per channel** —
the residual is the gold gradient approximation and anti-alias edges. Marks rendered and
eyeballed at 16/24/32/48/180/512px. `tsc --noEmit`, `eslint` and `next build` all clean.
Dev server: zero console errors, every brand asset 200, no horizontal scroll at
375/768/1440. Computed styles confirm wordmark halves resolve to `rgb(10,29,59)` /
`rgb(186,139,50)`, all three gold CTAs measure **5.75:1** with ink text and 44px tall,
body navy text 9.0:1, and the only two elements at 3.08:1 are the wordmark's "Brian".
Draw-in animation sampled by seeking (`animation.currentTime`) since the browser pane
does not composite frames — hidden during delay, 0.32px at 900ms, drawn at 1500ms, and
drawn after cancelling the animation outright. Grep audit: no stale hex, no stale token
names, no lowercase-brian remnants.

Note: browser-pane screenshots time out again this session (third time running), so the
hero was verified by pulling the SSR'd SVG off the dev server and rasterising it with
sharp — see the render helper approach in this session's transcript.

### Brand book (same pass)

`docs/brand-book.html` documented the placeholder identity throughout, so it was updated
rather than left to rot:

- **Logo plates are now generated.** `gen-icons.mjs` rewrites them between
  `<!-- LOGO-PLATES:START/END -->` markers from `public/brand/*.svg`, namespacing each
  inlined gradient id so six marks on one page can't collide. Hand-inlining is exactly
  how a brand book goes stale, and the book has to stay self-contained (embedded fonts,
  no external requests) because it gets published as a standalone artifact. Verified
  idempotent — byte-identical across three consecutive runs.
- Palette expanded from 2 brand values to 7, each with its measured contrast and the one
  job it's allowed to do, plus a "why gold has four values" panel. The old margin note
  ("never gold text on white") was too blunt to be followed correctly.
- New rule panel: **the traces are structural** — includes the "3" failure and the three
  cuts (display / compact / solo) with the size that selects each.
- The brian→brain wordplay is kept as *name origin* but explicitly reframed as verbal-
  only, with a note saying the logo no longer renders it, so the retired treatment
  doesn't get reintroduced by someone reading the story chapter.
- Animated-wordmark prompt rewritten — it previously scripted the ia→ai letter-swap.
- Hex values in the image/video prompt library updated (they hard-coded the old pair).
- **Added the missing `<meta name="viewport">`.** The document already had 860px and
  720px breakpoints, but without that tag phones lay it out at ~980px and zoom out, so
  the responsive CSS was dead code. Confirmed at 375px: single-column grid, spine
  collapses to a horizontal strip, no page overflow.

Verified by serving the book through the dev server (the browser pane cannot open
`file://`), checking computed styles and layout at 375 and 1280, then removing the
temporary copy from `public/`. All six plates render at their intended sizes; the
reversed plate reads correctly on navy.

## Not done (needs user action / assets)

- `hello@getbrian.xyz` mailbox — unverified. (getbrian.xyz itself is live: www.getbrian.xyz and www.cliftonai.co both serve this repo, auto-deployed on push to main.)
- Re-shoot `public/screenshots/*.jpg` — still show pre-rebrand CliftonAi product UIs
- Retrofit sub-site repos (DealMaker, DiffDoc, CRM, ContentFlow) with the new "Built by
  Brian" badge — those live in other repos, some without push access (see prior memory)
- Founder photo for the "Who's Brian" section (still a CF monogram placeholder)
- **Re-publish the brand book Artifact.** The file is current, but the previously
  published copy at the Artifact URL in the `brian-rebrand` memory still shows the v2
  placeholder identity until it's re-uploaded.
- **Dead CliftonAi logo assets** still in `public/brand/` (`logo-*.png|svg`, ~5.3MB
  including a 5MB PNG), unreferenced but still deployed.
- OG image supporting text renders in Segoe UI, not Space Grotesk — the brand faces are
  fetched by Next at build time and aren't installed system-wide, so librsvg can't
  resolve them. The wordmark in that image is the traced vector, so the brand-critical
  part is exact.
