/**
 * Re-shoot the product-card screenshots in public/screenshots/.
 *
 *   node scripts/gen-screenshots.mjs            # all of Brian's own products
 *   node scripts/gen-screenshots.mjs crm flow   # just these
 *
 * Uses the installed Chrome in headless mode — no Puppeteer/Playwright, so no
 * bundled-Chromium download for what is an occasional chore. Set CHROME_PATH if
 * yours lives somewhere unusual.
 *
 * Targets are read out of products-data.ts rather than restated here: the whole
 * point is that each capture lands on the exact `screenshot` path the card
 * renders, so the two cannot drift.
 *
 * Only `category: "self"` products are shot. Client sites in the portfolio are
 * other people's brands on their own release cycles — re-shooting those on our
 * schedule would silently republish their site as it looked today.
 */

import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Card aspect is 16/9 (`aspect-[16/9]` in products-section.tsx) — keep the two
 * in step or the card will crop what was captured.
 *
 * 16/9 is chosen to land just past each site's hero and before the section
 * under it. Measured at 1400px wide, the band below the hero starts at y=812
 * (ContentFlow), 745 (CRM) and 874 (DiffDoc); DealMaker's runs past 1100. At
 * 788 all four show a complete header and hero — the earlier 16/10 crop sliced
 * the following section's headings in half.
 */
const SHOT_W = 1400;
const SHOT_H = 788;
const OUT_W = 1000;
const OUT_H = 563;
const SCALE = 2; // capture at 2x, downsample — much crisper text than a 1x grab

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome not found. Tried:\n  " + CHROME_CANDIDATES.join("\n  "));
  console.error("Set CHROME_PATH to your Chrome binary and re-run.");
  process.exit(1);
}

// ------------------------------------------------------------ targets

/**
 * Pull href/screenshot/category per product out of products-data.ts. A regex
 * over TypeScript is not something to be proud of, but the alternative is
 * restating the list here, and a stale duplicate is the exact failure this
 * script exists to fix. Guarded by the count assertion below.
 */
function readTargets() {
  const src = readFileSync(path.join(root, "src", "app", "products-data.ts"), "utf8");
  const body = src.slice(src.indexOf("export const products"));
  const out = [];
  for (const chunk of body.split(/\n  \{\n/).slice(1)) {
    // (^|\n) because `name` is the first field in each object, so it has no
    // newline before it once the chunk has been split off.
    const grab = (k) => chunk.match(new RegExp(`(?:^|\\n)\\s*${k}:\\s*"([^"]+)"`))?.[1];
    const href = grab("href");
    const screenshot = grab("screenshot");
    const category = grab("category");
    const name = grab("name");
    if (href && screenshot && category === "self") {
      out.push({ name, href, screenshot });
    }
  }
  return out;
}

const all = readTargets();
if (all.length !== 4) {
  console.error(
    `Expected 4 self-category products in products-data.ts, parsed ${all.length}.\n` +
      `The file's shape probably changed — fix readTargets() rather than trusting this.`
  );
  process.exit(1);
}

const filter = process.argv.slice(2).map((s) => s.toLowerCase());
const targets = filter.length
  ? all.filter((t) => filter.some((f) => t.href.includes(f) || t.name.toLowerCase().includes(f)))
  : all;

if (!targets.length) {
  console.error(`No products matched: ${filter.join(", ")}`);
  console.error(`Available: ${all.map((t) => t.name).join(", ")}`);
  process.exit(1);
}

// ------------------------------------------------------------ capture

const work = mkdtempSync(path.join(tmpdir(), "brian-shots-"));
const results = [];

try {
  for (const t of targets) {
    const raw = path.join(work, `${path.basename(t.screenshot, ".jpg")}.png`);
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        `--force-device-scale-factor=${SCALE}`,
        `--window-size=${SHOT_W},${SHOT_H}`,
        `--user-data-dir=${path.join(work, "profile")}`,
        `--screenshot=${raw}`,
        t.href,
      ],
      { stdio: "ignore", timeout: 120_000 }
    );

    if (!existsSync(raw) || statSync(raw).size === 0) {
      throw new Error(`capture produced nothing for ${t.href}`);
    }

    const dest = path.join(root, "public", t.screenshot);
    const info = await sharp(raw)
      .resize(OUT_W, OUT_H, { fit: "cover", position: "top" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dest);

    results.push({
      product: t.name,
      url: t.href.replace("https://", ""),
      file: t.screenshot,
      size: `${info.width}x${info.height}`,
      kb: (info.size / 1024).toFixed(0),
    });
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.table(results);
