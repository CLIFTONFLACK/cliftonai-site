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

- `src/app/page.tsx` — the entire one-page site (hero, positioning, product grid, process, contact, footer)
- `src/app/layout.tsx` — fonts + metadata
- `src/app/globals.css` — color tokens, gradients, theme
- `public/brand/` — exported logo assets (icon, favicons)
- `assets/` — original source logo file (not shipped to production)

## Product links

The product grid links out to four subdomains. Update `products` in `src/app/page.tsx` if a subdomain or description changes:

| Product | Subdomain |
|---|---|
| ContentFlowSuite | flow.cliftonai.co |
| SLC-CRM | crm.cliftonai.co |
| Merlow's | merlow.cliftonai.co |
| Empirely | empirely.cliftonai.co |

## Deploy

Push to GitHub, import into Vercel, set the production domain to `cliftonai.co`. See project chat history / handoff notes for the full multi-subdomain architecture recommendation.
