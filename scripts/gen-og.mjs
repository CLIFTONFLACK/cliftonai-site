/**
 * Generates a product's og-image.png — the 1200x630 link preview card — in the one
 * layout every GetBrian product shares: the traced lockup vector, the product name
 * letterspaced in Gold Deep under it, a headline and a subline in plain type on the
 * dot-grid white ground, and the host along the bottom.
 *
 * This is the shared copy. Product repos call it rather than carrying their own, so the
 * card layout changes in one place:
 *
 *   node scripts/gen-og.mjs --product=DiffDoc --host=diffdoc.getbrian.xyz \
 *     --headline="See exactly what changed." \
 *     --sub="Two versions in, every insertion, deletion and edit marked up." \
 *     --out=../GetBrian-DiffDoc/repo/public/og-image.png
 *
 * Run from this repo, so `sharp` resolves from its node_modules. The lockup artwork is
 * read from public/brand/brian-logo.svg here, which is the source every product copies.
 *
 * Bricolage Grotesque and DM Sans are not loadable by librsvg, so the type falls back to
 * the machine's UI grotesque. The one thing that must be exact, the lockup, is the traced
 * vector, not type.
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--") && a.includes("="))
    .map((a) => {
      const i = a.indexOf("=");
      return [a.slice(2, i), a.slice(i + 1)];
    }),
);

for (const key of ["product", "host", "headline", "sub", "out"]) {
  if (!args[key]) {
    console.error(`missing --${key}=...`);
    process.exit(1);
  }
}

const NAVY = "#0A1D3B";
const INK = "#14172B";
const MUTED = "#454A64";
const GOLD_DEEP = "#8A6520";
const UI_FONT = "Segoe UI, Helvetica Neue, Arial, sans-serif";

const OG_W = 1200;
const OG_H = 630;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const lock = await sharp(path.join(root, "public", "brand", "brian-logo.svg"))
  .resize({ width: 320 })
  .png()
  .toBuffer();
const lockMeta = await sharp(lock).metadata();

const lockTop = 96;
const titleY = lockTop + lockMeta.height + 86;

const bg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">` +
    `<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">` +
    `<circle cx="1" cy="1" r="1" fill="rgba(20,23,43,0.09)"/></pattern></defs>` +
    `<rect width="${OG_W}" height="${OG_H}" fill="#ffffff"/>` +
    `<rect width="${OG_W}" height="${OG_H}" fill="url(#dots)"/>` +
    `<rect x="0" y="0" width="${OG_W}" height="7" fill="${NAVY}"/>` +
    `</svg>`,
);

const mid = OG_W / 2;
const text = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">` +
    `<text x="${mid}" y="${lockTop + lockMeta.height + 36}" text-anchor="middle" font-family="${UI_FONT}" font-size="30" font-weight="600" letter-spacing="6" fill="${GOLD_DEEP}">${esc(args.product.toUpperCase())}</text>` +
    `<text x="${mid}" y="${titleY + 16}" text-anchor="middle" font-family="${UI_FONT}" font-size="44" font-weight="700" fill="${INK}">${esc(args.headline)}</text>` +
    `<text x="${mid}" y="${titleY + 70}" text-anchor="middle" font-family="${UI_FONT}" font-size="26" font-weight="400" fill="${MUTED}">${esc(args.sub)}</text>` +
    `<text x="${mid}" y="${OG_H - 40}" text-anchor="middle" font-family="${UI_FONT}" font-size="24" font-weight="600" fill="${NAVY}">${esc(args.host)}</text>` +
    `</svg>`,
);

const og = await sharp(bg)
  .composite([
    { input: lock, left: Math.round((OG_W - lockMeta.width) / 2), top: lockTop },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

const out = path.resolve(process.cwd(), args.out);
writeFileSync(out, og);
console.log(`wrote ${out} (${(og.length / 1024).toFixed(1)} kB)`);
