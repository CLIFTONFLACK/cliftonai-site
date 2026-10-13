# Plan: desktop + mobile screenshots, getbrian.xyz and portfolio

## Scope (from `src/app/products-data.ts`)

In (12 sites, 24 base shots):

| # | Site | URL | Category |
|---|---|---|---|
| 1 | getbrian.xyz home | https://www.getbrian.xyz | main |
| 2 | Healthy | https://www.getbrian.xyz/healthy | self |
| 3 | ContentFlow | https://flow.getbrian.xyz | self |
| 4 | CRM | https://crm.getbrian.xyz | self |
| 5 | DiffDoc | https://diffdoc.getbrian.xyz | self |
| 6 | DealMaker | https://dealmaker.getbrian.xyz | self |
| 7 | Merlows News | https://merlows.com | client |
| 8 | Empirely Game | https://empirely.getbrian.xyz | client (in development) |
| 9 | GetForged | https://getforged.getbrian.xyz | client |
| 10 | The Rising Lions | https://www.therisinglions.com | client |
| 11 | HYDRGEL | https://www.hydrgel.com | client |
| 12 | BikeMe | https://bikeme-usgc.vercel.app | client |

Out (SLA / Vance): Vance Health Hub, Ai Simulator (Anatop). Also skip `/cliftonflack/vance-health-hub` and the `vance-*` / `anatop-*` files in `public/screenshots/`.

Optional extras, only if wanted: Healthy sub-pages (`/healthy/method`, `/about`, `/why-these-picks`, 3 product pages), `/cliftonflack/*` pages.

## Viewports

- Desktop: 1440x900 @2x
- Mobile: 390x844 @3x, mobile UA, touch emulation (iPhone 14 class)

Two frames per site and device: **hero** (above the fold) and **full page**. 12 x 2 x 2 = 48 files.

## Tooling

Extend the existing `scripts/gen-screenshots.mjs` pattern rather than a new stack, but it cannot do this job as is:
- headless `--screenshot` has no mobile emulation, no full-page, no wait for lazy content / fonts / animations;
- it parses `category: "self"` only and asserts exactly 5 targets.

New `scripts/gen-portfolio-shots.mjs`:
1. Playwright (`playwright-core` + installed Chrome via `channel: "chrome"`, so no Chromium download). Dev dependency only.
2. Target list read from `products-data.ts` (same regex approach, fix the count assertion), minus an explicit `EXCLUDE = ["Vance Health Hub", "Ai Simulator"]`, plus the home page. Healthy's href is a path, resolved against www.getbrian.xyz.
3. Per site and device: new context with viewport, `deviceScaleFactor`, `isMobile`, `hasTouch`; `goto` with `waitUntil: "networkidle"`; wait for `document.fonts.ready`; scroll top-to-bottom to trigger lazy images and reveal-on-scroll, scroll back; short settle; dismiss cookie banner by selector if one appears (decline, never accept); screenshot hero and `fullPage`.
4. Output to `assets/site-screenshots/<slug>/{desktop,mobile}-{hero,full}.png` (lossless masters, outside `public/` so nothing ships to Vercel). Plus `manifest.json` (url, timestamp, viewport, bytes, HTTP status).
5. Do NOT touch `public/screenshots/*.jpg`. Those are the product-card thumbnails and stay owned by `gen-screenshots.mjs`.

## Verification (must be able to fail)

- Per shot: HTTP status 200, file exists, dimensions match viewport x scale (mobile width exactly 1170, desktop 2880). Wrong size means emulation did not apply.
- Mobile check in-page: `window.innerWidth === 390` and `document.documentElement.scrollWidth <= 390`. Flags horizontal overflow, a real bug worth reporting.
- Blank / error detection: reject shots whose pixel variance is near zero, or whose page text matches `404|Application error|This deployment`. Negative control: run once against a deliberately bad URL and confirm it fails.
- Contact sheet: montage per device, then I eyeball it. DOM checks alone miss unstyled or half-loaded pages.
- Known risk: Empirely is "in development", and bikeme / Vercel previews may sit behind auth or sleep. Report these as skipped, not as passing.

## Decisions (settled 2026-10-13)

1. Pages: the 12 sites plus the 3 `/healthy/products/[slug]` pages (15 pages, 60 files). No other Healthy sub-pages, no `/cliftonflack/*`.
2. Client sites: yes, capture.
3. Output: `public/portfolio/<slug>/` (note: ships to Vercel, so keep PNG sizes in check, e.g. full-page shots may be large; check total before commit).
4. Format: PNG only.

## Original questions (answered above)

1. Include Healthy sub-pages and `/cliftonflack/*`, or just the 12 sites?
2. Client sites (Merlows, HYDRGEL, Rising Lions, GetForged, BikeMe, Empirely): fine to capture for portfolio use? The existing script deliberately avoids re-shooting these as it would freeze their live site as of today.
3. Output home: `assets/site-screenshots/` (recommended, gitignored? currently `assets/` is mostly untracked) or `public/portfolio/`?
4. Format: PNG masters only, or also resized JPG/WebP for web/social use?

## Execution

Agents per workflow rules: write script, then `code-reviewer` on the diff (no auth/payment surface, so no `security-auditor`). Run, build contact sheets, report skips.
