# Brian — Marketing Site

Single-page marketing site for **getbrian.xyz**. Brian builds AI-powered
apps and workflows that replace the CRM, project management, marketing, and
supply-chain SaaS small businesses are renting — for a £2,500 build fee
(negotiable on project scale) plus half of what they're already paying, for
three years, after which the system is handed over and owned outright. Built
with Next.js (App Router) + Tailwind CSS v4, deployed as a fully static site
on Vercel.

Campaign line: **"If you see Brian, get him."**

## Stack

- **Next.js 16** (App Router, Turbopack) — static export, no server runtime needed
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css`
- **Fonts**: Space Grotesk (headings) + DM Sans (body), loaded via `next/font/google` in the root layout. The homepage overrides the heading font with Bricolage Grotesque, loaded in `page.tsx` and scoped by re-declaring `--font-heading` on a wrapper div, so `/healthy`, `/cliftonflack` and the legal pages keep Space Grotesk.
- Brand colors: Brian Navy `#0A1D3B` (masterbrand) + Brian Gold `#BA8B32` (CTA, wordmark) on white — both sampled from `docs/GetBrian_Logo.png`, not eyeballed

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm install` does not work on the Google Drive volume (G:). The toolchain is run
from a mirror on local disk.

## Structure

- `src/app/page.tsx` — the one-page site, in this order: hero (poster-scale "If you see
  Brian, get him."), navy proof strip, Work (`WorkSection`), positioning (Replace /
  Personalise / Save), Built for clients (`ClientsSection`), Who's Brian (navy panel),
  pricing, contact, footer
- `src/app/products-data.ts` — the product/portfolio data (names, copy, links, screenshots).
  Optional fields: `tint` and `ink` (own tools: the tile's pale ground and a darkened
  accent for small text). There is no `featured` field: every client product is a card.
- `src/app/products-section.tsx` — exports `WorkSection` (bento grid of Brian's own tools,
  each a whole-tile link with a 16:9 screenshot) and `ClientsSection` (every client
  product as a card: 16:10 screenshot, name, tagline, and an "In development" badge
  where set). There is no product modal.
- `src/app/clients-carousel.tsx` — client component (`ClientsCarousel`) that holds the
  client card list. A 4-column grid on large screens, 2 columns from the `sm` breakpoint,
  and on phones a CSS scroll-snap swipe row with a "View all N" button that switches to a
  stacked list ("Show fewer" switches back). The cards arrive as children, so they stay
  server-rendered.
- `src/app/pricing-section.tsx` — the £2,500 + 50%-for-3-years pricing model, plus an
  interactive worked-example calculator with one slider (monthly software spend,
  £200 to £3,000) and animated, live-recomputed sums
- `src/app/pricing-math.ts` — the calculator's arithmetic: `BUILD_FEE` 2500, half the old
  spend (`ONGOING_SHARE` 0.5) for 3 years (`HANDOVER_YEARS`), measured over 6
  (`HORIZON_YEARS`); `sixYearSums()` returns rented, ongoing and saved totals
- `src/app/hero-diagram.tsx` — animated hero integration diagram (CSS/SVG only). No longer
  used by the homepage; nothing imports it
- `src/app/hero-mascot.tsx` — `HeroMascot`, the GetBrian mascot. He stands on the rule under
  the hero headline at its right end and waves once on page load (three swings over 2.2s,
  starting 0.9s in), then is still; he is still throughout under `prefers-reduced-motion`. Built
  from two images (body and arm) with the arm rotating about the shoulder in CSS
  (`.hero-mascot-arm` in `globals.css`): the wave is CSS only. The images are decorative
  (empty `alt`) and are wrapped in `MascotVideo`, so he is a button, not `aria-hidden`.
  `/healthy` has its own separate mascot (`public/healthy/brand/healthy-mascot.webp`)
- `src/app/mascot-video.tsx` — client component (`MascotVideo`). Wraps the mascot images in
  a `<button aria-label="Watch the GetBrian video">` that carries the positioning classes,
  with a small blinking play badge (`.mascot-play-blink` in `globals.css`; solid on hover,
  on focus and under `prefers-reduced-motion`). A click opens a native `<dialog>`
  (`showModal()`) with the 15-second video and plays it with sound, since the click is the
  gesture that allows that. The `<video>` is `preload="none"`, so nothing downloads until the
  first click. The X button, a backdrop click or Escape closes it, pauses the video and
  rewinds it. A press that starts on the video and is released on the backdrop does not
  close it. `body:has(dialog[open])` in `globals.css` freezes page scroll while it is open.
  Tests: `src/app/__tests__/mascot-video.test.tsx` and `mascot-video-behaviour.test.tsx`
- `src/app/healthy/hero-mascot.tsx` — client component (`HealthyHeroMascot`) for the
  `/healthy` hero: the Healthy mascot bursts out of the hero call-to-action button
  (`#healthy-hero-cta`, passed as `originSelector`), flies to the foot of the hero, lands,
  then waves in a loop for as long as he is on screen. `entranceMode()` picks one of three
  behaviours: `bursting` (the full entrance, then the looping wave); `waving` (the looping
  wave with no entrance, when the leap would not be seen: no button, page scrolled past
  `MAX_SCROLL_FOR_BURST`, or his landing spot off screen, which is the usual case on
  phones); `still` (`prefers-reduced-motion`, data saver on, or footage that fails to load
  or decode). `LANDING_MS` and `ENTRANCE_MS` must match what
  `scripts/healthy-mascot/build.py` prints. Decorative: empty `alt`, `aria-hidden`. He is
  the Healthy mascot, never named Brian. Tests: `src/app/healthy/__tests__/hero-mascot.test.tsx`
  (behaviour; a test holds `ENTRANCE_MS` to the file's summed frame time) and
  `src/app/healthy/__tests__/hero-mascot-frames.test.ts` (fails if any frame of any of the
  three files has an opaque pixel on the left, right or top edge of the canvas)
- `public/healthy/mascot/` — the mascot footage, all 336×320 WebP with alpha, generated by
  `scripts/healthy-mascot/` (below) and copied in by hand:
  - `hero-burst.webp` — the entrance, plays once (about 500 KB)
  - `hero-wave.webp` — the looping wave (about 245 KB); starts on the pose the entrance ends on
  - `hero-burst-still.webp` — the standing pose (about 18 KB)

  Plain `<img>`, not `next/image`, which would flatten the animation to one frame. The
  first version was replaced because his waving hand ran off the side of the generated
  clip and showed cut off on the page
- `scripts/healthy-mascot/` — Python (Pillow and numpy), run by hand from a working folder
  outside the repo. Not an npm script and not part of the site build. The source clip is
  not in the repo. Extract its frames first with `ffmpeg -i clip.mp4 g/%03d.png`, then
  `python cut.py` (`cut.py` cuts him out frame by frame, `g/NNN.png` to `cut/NNN.png`) and
  `python build.py` (assembles the three files into `out/`), then copy `out/*.webp` into
  `public/healthy/mascot/`. The crop box and frame ranges in `build.py` are specific to the
  one clip they were written for. `build.py` prints `LANDING_MS` and `ENTRANCE_MS`, which the
  constants in `hero-mascot.tsx` must match, and exits with an error if any frame touches
  the left, right or top edge
- `public/video/` — the homepage mascot video, **not generated by anything in this repo**.
  `getbrian-mascot.mp4` (9:16, 496×864, 14.8s, about 1.9 MB) loops because it ends on its own
  first frame; British voiceover over music. `getbrian-mascot-poster.webp` is its poster. Both
  were made outside the repo: three 5s Seedance 2.0 Mini element-mode clips on OpenArt from
  the mascot image, joined with fade-through-white transitions, captioned, with a Colin
  (Deepgram Flux via OpenRouter, voice `flux-colin-en`) voiceover. No script regenerates
  them. Keep the loop point if you re-cut it
- `src/app/layout.tsx` — fonts + metadata
- `src/app/globals.css` — color tokens, gradients, theme, animations
- `scripts/trace-logo.mjs` — vectorises `docs/GetBrian_Logo.png` into `public/brand/*.svg`
- `scripts/gen-icons.mjs` — favicons, OG image and the "Built by" badge, all derived from those SVGs
- `public/brand/` — **generated** logo assets; edit the source PNG and re-run `npm run brand`, don't hand-edit these:
  - `brian-logo.svg` — full lockup (mark + GetBrian wordmark)
  - `brian-mark.svg` / `-white.svg` — display mark, on light / dark grounds
  - `brian-mark-solo.svg` — mark without its circuit traces, for contexts that draw their own (the hero diagram)
  - `brian-mark-compact.svg` / `-white.svg` — small-size cut with thickened traces (nav, favicons). The traces are **not** decorative: without them the B reads as a "3", so the compact cut thickens rather than drops them.
  - `brian-wordmark.svg` — "GetBrian" only
  - `logo-icon.png` — legacy CliftonAi green mark, now unused. ContentFlow used to
    hotlink it absolutely as `https://cliftonai.co/brand/logo-icon.png` in its hero
    and footer, which made a `getbrian.xyz` product quietly depend on `cliftonai.co`
    still answering. **That hotlink is gone as of 29 July 2026** — re-verified by
    fetching all eight portfolio sites (`flow`, `crm`, `diffdoc`, `dealmaker`,
    `empirely`, `getforged` on getbrian.xyz, plus merlows.com and therisinglions.com):
    none of them requests a `cliftonai.co` asset, and nothing in this repo's `src/` or
    `scripts/` references the file either. So it is unblocked for deletion. It is kept
    for now only because that sweep can prove the portfolio, not a hotlink from
    somewhere outside it — an old email signature, a client's page, a deck.
  - `getbrian-mascot-body-512.webp` / `getbrian-mascot-arm-512.webp` — the homepage mascot: two
    cut-outs on the same 512px canvas (body without one arm, and that arm). They are cut from a
    master image that is kept outside these two files; re-cut both together if the artwork changes.
    Unlike the logo files above, `npm run brand` does not produce them.
  - There is a GetBrian mascot: a chunky 3D letter-B character. He is the mascot, not Brian.
    Brian himself is never depicted as a person — no human face, portrait, photo, avatar or
    silhouette standing in for him. The mascot is never named "Brian" and never captioned as
    Brian (the `/healthy` tests enforce this for its mascot's alt text, in
    `src/app/healthy/__tests__/mascot-animation.test.tsx`).
- `scripts/gen-screenshots.mjs` — re-shoots the product cards; run `npm run screenshots`
- `public/screenshots/` — product imagery. The own-tool shots are **generated** at
  1000×563 JPEG (16:9, matching the work tile's `aspect-[16/9]`) — captured via headless
  Chrome, targets read out of `products-data.ts` so a capture always lands on the path
  its tile renders (the script expects exactly 5 `category: "self"` products). Re-run
  after any product redesign. The client shots are hand-placed and deliberately left
  alone: those are other people's brands on their own release cycles. Client
  cards display them at 16:10.
- `assets/` — original source logo file (not shipped to production)
- `docs/GetBrian_Logo.png` — **the** brand source of truth; every SVG, favicon and OG image is generated from it

## Brand architecture

Brian is a services business, not a product house — the portfolio in
`src/app/products-data.ts` exists as **proof**, not as a product lineup:

- `category: "self"` — tools Brian built and runs himself (ContentFlow,
  CRM, DiffDoc, DealMaker, Healthy). No brand prefix on the name; each is a
  Work tile whose ground is the product's own `tint`.
- `category: "client"` — client/venture brands. Keep their own names. Each
  is a card in "Built for clients".

## Product links

Update `products` in `src/app/products-data.ts` if a subdomain or description changes.

Every own-product and hosted-client tool moved from `*.cliftonai.co` to
`*.getbrian.xyz` on 29 July 2026. The old subdomains are being switched off one at a
time rather than all at once, so a link left pointing at `cliftonai.co` will keep
working right up until it silently 404s — `crm` and `flow` had already gone dark before
this file was updated. Use `*.getbrian.xyz`.

| Product | Category | URL |
|---|---|---|
| ContentFlow | self | flow.getbrian.xyz |
| CRM | self | crm.getbrian.xyz |
| DiffDoc | self | diffdoc.getbrian.xyz |
| DealMaker | self | dealmaker.getbrian.xyz |
| Healthy | self | getbrian.xyz/healthy (`/healthy`) |
| Merlows News | client | merlows.com |
| Empirely Game | client | empirely.getbrian.xyz |
| GetForged | client | getforged.getbrian.xyz |
| The Rising Lions | client | therisinglions.com |
| HYDRGEL | client | hydrgel.com |
| Vance Health Hub | client | vancehealthhub.co.uk |
| Ai Simulator | client | anatop-simulator.vercel.app |
| BikeMe | client | bikeme-usgc.vercel.app |

## Deploy

Push to GitHub, import into Vercel, set the production domain to
`getbrian.xyz` (DNS/hosting/mailbox setup is a pending manual step — see
`tasks/todo.md`).
