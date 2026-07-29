# Brian — Marketing Site

Single-page marketing site for **getbrian.xyz**. Brian builds AI-powered
apps and workflows that replace the CRM, project management, marketing, and
supply-chain SaaS small businesses are renting — for a £1,000 build fee plus
half of what they're already paying, forever. Built with Next.js (App
Router) + Tailwind CSS v4, deployed as a fully static site on Vercel.

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
- `src/app/pricing-section.tsx` — the £1,000 + 50% pricing model + worked example
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
  - legacy CliftonAi `logo-*.svg|png` kept for now — unreferenced by this site
  - Brian is never depicted as a person — no mascot or illustrated character.
- `public/screenshots/` — product card imagery (still shows the pre-rebrand CliftonAi product UIs — pending re-shoot)
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

Update `products` in `src/app/products-data.ts` if a subdomain or description changes. Note: these still live on `*.cliftonai.co` — the legacy domain remains live for the tools themselves even though the marketing site has moved to getbrian.xyz.

| Product | Category | URL |
|---|---|---|
| ContentFlow | self | flow.cliftonai.co |
| CRM | self | crm.cliftonai.co |
| DiffDoc | self | diffdoc.cliftonai.co |
| DealMaker | self | dealmaker.cliftonai.co |
| Merlows News | client | merlows.com |
| Empirely Game | client | empirely.cliftonai.co |
| GetForged | client | getforged.cliftonai.co |
| The Rising Lions | client | therisinglions.com |

## Deploy

Push to GitHub, import into Vercel, set the production domain to
`getbrian.xyz` (DNS/hosting/mailbox setup is a pending manual step — see
`tasks/todo.md`).
