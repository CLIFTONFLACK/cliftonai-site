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
- **Fonts**: Space Grotesk (headings) + DM Sans (body), loaded via `next/font/google`
- Brand colors: Brian Navy `#0A1D3B` (masterbrand) + Brian Gold `#BA8B32` (CTA, wordmark) on white — both sampled from `docs/GetBrian_Logo.png`, not eyeballed

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app/page.tsx` — the one-page site (hero, positioning, products, pricing, who's Brian, contact, footer)
- `src/app/products-data.ts` — the product/portfolio data (names, copy, links, screenshots)
- `src/app/products-section.tsx` — product cards, client case-study rows, and detail modal
- `src/app/pricing-section.tsx` — the £2,500 + 50%-for-3-years pricing model, plus an
  interactive worked-example calculator (two sliders: monthly software spend, weekly
  hours on repetitive tasks) with animated, live-recomputed savings
- `src/app/hero-diagram.tsx` — animated hero integration diagram (CSS/SVG only)
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
  - Brian is never depicted as a person — no mascot or illustrated character.
- `scripts/gen-screenshots.mjs` — re-shoots the product cards; run `npm run screenshots`
- `public/screenshots/` — product card imagery, 1000×625 JPEG (16:10, matching the card's
  `aspect-[16/10]`). The four own-product shots are **generated** — captured from the live
  `*.getbrian.xyz` sites via headless Chrome, targets read out of `products-data.ts` so a
  capture always lands on the path its card renders. Re-run after any product redesign.
  The four client shots are hand-placed and deliberately left alone: those are other
  people's brands on their own release cycles.
- `assets/` — original source logo file (not shipped to production)
- `docs/GetBrian_Logo.png` — **the** brand source of truth; every SVG, favicon and OG image is generated from it

## Brand architecture

Brian is a services business, not a product house — the portfolio in
`src/app/products-data.ts` exists as **proof**, not as a product lineup:

- `category: "self"` — tools Brian built and runs himself daily (ContentFlow,
  CRM, DiffDoc, DealMaker). No brand prefix on the name; the product card
  lockup reads "Brian | \<tool\>" and each keeps its own accent color as a
  card keyline.
- `category: "client"` — client/venture brands. Keep their own names,
  rendered as case-study rows with a "Built by Brian" credit.

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
| Merlows News | client | merlows.com |
| Empirely Game | client | empirely.getbrian.xyz |
| GetForged | client | getforged.getbrian.xyz |
| The Rising Lions | client | therisinglions.com |
| HYDRGEL | client | hydrgel.com |
| Vance Health Hub | client | vancehealthhub.co.uk |

## Deploy

Push to GitHub, import into Vercel, set the production domain to
`getbrian.xyz` (DNS/hosting/mailbox setup is a pending manual step — see
`tasks/todo.md`).
