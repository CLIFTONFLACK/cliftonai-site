# Brand & UI strategy rollout (July 2026)

Strategy doc: https://claude.ai/code/artifact/766e49cc-3402-45e3-872e-289b513eea6f
Empirely content/screenshot conflict: handled in a SEPARATE session — do not touch Empirely copy or screenshot here.

## Plan

- [x] 1. Hygiene: update stale `layout.tsx` meta description + README product lineup
- [x] 2. Hygiene: drop "View Demo" buttons (no distinct demo URLs exist); make `demoHref` optional
- [x] 3. Naming: rename own products to space-separated system (CliftonAi ContentFlow / CRM / DiffDoc / DealMaker), update descriptions, retitle category sections ("Our products" / "Built for clients")
- [x] 4. Logo: add SVG mark in two densities + white variant (`public/brand/*.svg`), use compact mark in nav/footer
- [x] 5. Lockup: product cards render the suffix lockup (wordmark + green divider + product name)
- [x] 6. Homepage restructure: pillars ABOVE products; own products 2-up cards with accent keyline; client work as case-study rows on a panel band; proof strip under hero CTAs; WhatsApp added to contact
- [x] 7. Motion: replace hero blobs with animated SVG integration diagram (CSS-only, reduced-motion safe)
- [x] 8. Verify: build passes, visual check in preview, both breakpoints

## Review

Shipped in this pass:

- `products-data.ts`: `Product` type gained optional `shortName` (lockup suffix) + `accent` (keyline); `demoHref` now optional and removed from all entries (all pointed at the same URL as `href`). Own products renamed to the space-separated system; descriptions updated to use short names on second mention. Category titles: "Our products" / "Built for clients". Empirely entry content untouched (separate session).
- `products-section.tsx`: split rendering — own products as 2-up cards with `ProductLockup` (CliftonAi | divider | product) and 3px accent keyline; client work as horizontal case-study rows with "Built by CliftonAi" credit on a `bg-bg-panel` band. Demo buttons render only when a distinct `demoHref` exists. Modal shares the lockup.
- `page.tsx`: section order now hero → positioning pillars → products → who we are → contact. Hero headline "AI that runs inside your commercial operation" + proof strip (4 products / 4 client platforms / founder-led). Hero blobs replaced by `HeroDiagram`. Contact gained a WhatsApp button. Nav + footer use the new compact SVG mark; footer links use short names.
- `hero-diagram.tsx` (new): CSS/SVG integration set-piece — four tool nodes draw connections into the compact C-mark hub, pulses travel the lines (offset-path), hub ring pulses. Degrades to static connected state under prefers-reduced-motion (pulses hidden).
- `public/brand/`: `logo-mark.svg` (full, segmented ring), `logo-mark-compact.svg` (<48px: solid ring, 3 spokes), `logo-mark-white.svg`. Legacy PNGs kept (favicons still reference them).
- `layout.tsx` meta + OG descriptions updated; README rewritten (structure, brand architecture, 8-product table).

Verification: `next build` clean, `eslint` clean, no console errors, no horizontal overflow at 1280px or 375px, grid 2-col → 1-col, client rows stack on mobile, modal opens/closes with correct links, offset-path supported in preview browser, nav SVG loads. Browser-pane screenshots timed out all session (tool issue), so visual verification was done via DOM/computed-style checks instead of pixels.

Not done (needs assets/decisions): founder photo in "Who we are"; real demo URLs; client-brand footer badges (their repos); sub-brand homepage template consolidation (their repos); favicon regeneration from the new compact mark.
