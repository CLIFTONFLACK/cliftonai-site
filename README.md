# CliftonAi — Marketing Site

Single-page marketing site for **cliftonai.co**. Built with Next.js (App Router) + Tailwind CSS v4, deployed as a fully static site on Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack) — static export, no server runtime needed
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css`
- **Fonts**: Space Grotesk (headings) + DM Sans (body), loaded via `next/font/google`
- Brand colors sampled directly from the CliftonAi logo (`assets/CliftonAi-CRM_logo-source.png`)

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app/page.tsx` — the one-page site (hero, positioning, products, who we are, contact, footer)
- `src/app/products-data.ts` — the product/portfolio data (names, copy, links, screenshots)
- `src/app/products-section.tsx` — product cards, client case-study rows, and detail modal
- `src/app/hero-diagram.tsx` — animated hero integration diagram (CSS/SVG only)
- `src/app/layout.tsx` — fonts + metadata
- `src/app/globals.css` — color tokens, gradients, theme, animations
- `public/brand/` — logo assets (`logo-mark.svg` full mark, `logo-mark-compact.svg` for <48px, `logo-mark-white.svg` reversed; legacy PNGs kept for favicons)
- `public/screenshots/` — product card imagery
- `assets/` — original source logo file (not shipped to production)

## Brand architecture

Two kinds of entries in `src/app/products-data.ts`:

- `category: "self"` — CliftonAi sub-brands. Named `CliftonAi <Product>` (space-separated, no hyphen), carry a `shortName` (used in the lockup + footer) and an `accent` (card keyline).
- `category: "client"` — client/venture brands. Keep their own names, rendered as case-study rows with a "Built by CliftonAi" credit.

## Product links

Update `products` in `src/app/products-data.ts` if a subdomain or description changes:

| Product | Category | URL |
|---|---|---|
| CliftonAi ContentFlow | self | flow.cliftonai.co |
| CliftonAi CRM | self | crm.cliftonai.co |
| CliftonAi DiffDoc | self | diffdoc.cliftonai.co |
| CliftonAi DealMaker | self | dealmaker.cliftonai.co |
| Merlows News | client | merlows.com |
| Empirely Game | client | empirely.cliftonai.co |
| GetForged | client | getforged.cliftonai.co |
| The Rising Lions | client | therisinglions.com |

## Deploy

Push to GitHub, import into Vercel, set the production domain to `cliftonai.co`. See project chat history / handoff notes for the full multi-subdomain architecture recommendation.
