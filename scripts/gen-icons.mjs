/**
 * Generate every raster brand derivative from the traced SVGs.
 *
 *   node scripts/trace-logo.mjs && node scripts/gen-icons.mjs
 *
 * Everything here derives from public/brand/*.svg so there is exactly one
 * source of truth for the mark. Outputs:
 *   public/favicon-32.png, public/icon-512.png, public/apple-touch-icon.png
 *   src/app/favicon.ico   (16/32/48 multi-size)
 *   public/og-image.png   (1200x630)
 *
 * Icons are the navy mark on a light tile, matching the Brian Alert System
 * dashboard (brianalerts.vercel.app). They sit on a tile rather than being a
 * bare transparent mark for two reasons: the mark is wide (roughly 5:4) so a
 * filled square lets it run to the edges instead of floating small in the
 * frame, and an opaque ground is the only thing that keeps a navy mark legible
 * on the dark surfaces these get shown on. apple-touch-icon needs an opaque
 * square regardless — iOS composites transparency onto black.
 */

import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = path.join(root, "public", "brand");

const NAVY = "#0A1D3B";
const INK = "#14172B";
const MUTED = "#454A64";

/**
 * Supporting text only. The brand faces (Space Grotesk / DM Sans) are loaded by
 * Next from Google Fonts at build time and are not installed system-wide, so
 * librsvg cannot resolve them here — verified: requesting either returns
 * byte-identical output to the default fallback. The brand-critical part of the
 * OG image is the wordmark, and that is the traced vector, not type.
 */
const UI_FONT = "Segoe UI, DejaVu Sans, Arial, sans-serif";

/** Icon ground. Matches the Brian Alert System dashboard's icons, which show the
 *  navy mark on light rather than reversing it out of a navy tile. */
const ICON_GROUND = "#FFFFFF";

const tile = (size) => {
  const r = Math.round(size * 0.18);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${ICON_GROUND}"/></svg>`
  );
};

/**
 * The navy mark on a light ground, matching the dashboard at brianalerts.
 *
 * The ground is opaque on purpose. The dashboard's own icons are transparent,
 * and a transparent navy mark is close to invisible everywhere it gets shown on
 * something dark — Chrome's dark tab strip, and Vercel's project list, which is
 * black. Checked by compositing the real file over #ffffff / #35363a / #000000:
 * only the white ground survives all three. Same artwork, same colours, just not
 * relying on the host surface being light.
 *
 * Below ~64px it switches to the compact cut, whose thickened traces survive the
 * resample — the display cut smears to a gold blur at 16px.
 */
async function icon(size) {
  const inner = Math.round(size * 0.86);
  const src = size <= 64 ? "brian-mark-compact.svg" : "brian-mark.svg";
  const mark = await sharp(path.join(BRAND, src))
    .resize({ width: inner, height: inner, fit: "inside" })
    .png()
    .toBuffer();
  const m = await sharp(mark).metadata();
  return sharp(tile(size))
    .composite([
      {
        input: mark,
        left: Math.round((size - m.width) / 2),
        top: Math.round((size - m.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO is just a directory of PNGs; no encoder dependency needed. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = Buffer.alloc(16 * images.length);
  let offset = 6 + 16 * images.length;
  for (let i = 0; i < images.length; i++) {
    const { size, buf } = images[i];
    const e = i * 16;
    entries.writeUInt8(size >= 256 ? 0 : size, e + 0);
    entries.writeUInt8(size >= 256 ? 0 : size, e + 1);
    entries.writeUInt8(0, e + 2);
    entries.writeUInt8(0, e + 3);
    entries.writeUInt16LE(1, e + 4);
    entries.writeUInt16LE(32, e + 6);
    entries.writeUInt32LE(buf.length, e + 8);
    entries.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  }
  return Buffer.concat([header, entries, ...images.map((i) => i.buf)]);
}

// ------------------------------------------------------------------ icons

const written = [];
const record = (p, buf) => {
  writeFileSync(p, buf);
  written.push({ file: path.relative(root, p).replace(/\\/g, "/"), kb: (buf.length / 1024).toFixed(1) });
};

record(path.join(root, "public", "favicon-32.png"), await icon(32));
record(path.join(root, "public", "icon-512.png"), await icon(512));
record(path.join(root, "public", "apple-touch-icon.png"), await icon(180));

const ico = buildIco(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await icon(size) })))
);
record(path.join(root, "src", "app", "favicon.ico"), ico);

// --------------------------------------------------------------- og image

const OG_W = 1200;
const OG_H = 630;

// Centred stack: lockup over tagline. Link previews are usually rendered a few
// hundred pixels wide, so a centred block stays legible where a two-column
// layout would not.
const lock = await sharp(path.join(BRAND, "brian-logo.svg"))
  .resize({ width: 360 })
  .png()
  .toBuffer();
const lockMeta = await sharp(lock).metadata();

const lockTop = 74;
const taglineY = lockTop + lockMeta.height + 78;

const bg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">` +
    `<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">` +
    `<circle cx="1" cy="1" r="1" fill="rgba(20,23,43,0.09)"/></pattern></defs>` +
    `<rect width="${OG_W}" height="${OG_H}" fill="#ffffff"/>` +
    `<rect width="${OG_W}" height="${OG_H}" fill="url(#dots)"/>` +
    `<rect x="0" y="0" width="${OG_W}" height="7" fill="${NAVY}"/>` +
    `</svg>`
);

const mid = OG_W / 2;
const text = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">` +
    `<text x="${mid}" y="${taglineY}" text-anchor="middle" font-family="${UI_FONT}" font-size="44" font-weight="700" fill="${INK}">If you see Brian, get him.</text>` +
    `<text x="${mid}" y="${taglineY + 50}" text-anchor="middle" font-family="${UI_FONT}" font-size="26" font-weight="400" fill="${MUTED}">He replaces the software you rent with software you own.</text>` +
    `<text x="${mid}" y="${OG_H - 40}" text-anchor="middle" font-family="${UI_FONT}" font-size="24" font-weight="600" fill="${NAVY}">getbrian.xyz</text>` +
    `</svg>`
);

const og = await sharp(bg)
  .composite([
    { input: lock, left: Math.round((OG_W - lockMeta.width) / 2), top: lockTop },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

record(path.join(root, "public", "og-image.png"), og);

// ------------------------------------------------------- endorsement badge
// Generated rather than hand-maintained so the inlined mark can never drift
// from the traced source. Stays self-contained (no external requests, no
// webfont) because it gets pasted into client footers we do not control.

const compact = readFileSync(path.join(BRAND, "brian-mark-compact.svg"), "utf8");
const viewBox = compact.match(/viewBox="([^"]+)"/)[1];
const markGuts = compact
  .replace(/^[\s\S]*?<\/title>/, "")
  .replace(/<\/svg>\s*$/, "")
  .trim();

const BADGE_H = 18;
const BADGE_W = Math.round(BADGE_H * (653.8 / 517.3));

const badge = `<!--
  GetBrian "Built by" endorsement badge.
  Framework-agnostic, self-contained (inline SVG mark, inline styles).
  Drop into any client-site footer. Keep it SMALLER than the client's own logo.

  GENERATED by scripts/gen-icons.mjs from public/brand/brian-mark-compact.svg —
  edit those, not this file.

  On dark grounds, swap two colours:
    - "GetBrian" text: ${NAVY} -> #8FA3D6
    - label text:      ${MUTED} -> #9AA3C9
  and swap the mark for brian-mark-compact-white.svg.
-->
<a href="https://getbrian.xyz" target="_blank" rel="noopener"
   aria-label="Built by GetBrian — opens getbrian.xyz"
   style="display:inline-flex;align-items:center;gap:7px;
          font:500 12px/1 system-ui,-apple-system,'Segoe UI',sans-serif;
          color:${MUTED};text-decoration:none;letter-spacing:.02em;
          opacity:.85;transition:opacity .2s ease;"
   onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85">
  <svg width="${BADGE_W}" height="${BADGE_H}" viewBox="${viewBox}" fill="none"
       aria-hidden="true" style="display:block;flex:none;">${markGuts}</svg>
  <span>Built by <strong style="color:${NAVY};font-weight:600;">GetBrian</strong></span>
</a>
`;

record(path.join(BRAND, "built-by-badge.html"), Buffer.from(badge, "utf8"));

// ------------------------------------------------------ brand book plates
// The brand book is a self-contained document (embedded fonts, no external
// requests) so it can be published as a standalone artifact — which means the
// marks have to be inlined rather than linked. Inlining by hand is how a brand
// book goes stale, so the plates are regenerated here between marker comments.

const BOOK = path.join(root, "docs", "brand-book.html");

/** Strip an asset down to its paint, and namespace its gradient ids so three
 *  inlined marks on one page can't collide. */
function inlineMark(file, idSuffix) {
  const raw = readFileSync(path.join(BRAND, file), "utf8");
  const box = raw.match(/viewBox="([^"]+)"/)[1];
  let body = raw.replace(/^[\s\S]*?<\/title>/, "").replace(/<\/svg>\s*$/, "").trim();
  for (const id of raw.match(/id="([^"]+)"/g) ?? []) {
    const name = id.slice(4, -1);
    body = body.split(`id="${name}"`).join(`id="${name}${idSuffix}"`);
    body = body.split(`url(#${name})`).join(`url(#${name}${idSuffix})`);
  }
  const [, , w, h] = box.split(/\s+/).map(Number);
  return { box, body, aspect: w / h };
}

const plates = [
  { file: "brian-mark.svg", h: 74, dark: false, caption: "Display mark &mdash; 40px and up" },
  { file: "brian-mark-compact.svg", h: 74, dark: false, caption: "Compact cut &mdash; below 40px" },
  { file: "brian-mark-white.svg", h: 74, dark: true, caption: "Reversed, for dark grounds" },
  { file: "brian-wordmark.svg", h: 34, dark: false, caption: "Wordmark" },
  { file: "brian-logo.svg", h: 96, dark: false, caption: "Full lockup" },
  { file: "brian-mark-solo.svg", h: 74, dark: false, caption: "Solo &mdash; only where traces are drawn separately" },
];

const platesHtml =
  `      <div class="grid-3">\n` +
  plates
    .map(({ file, h, dark, caption }, i) => {
      const { box, body, aspect } = inlineMark(file, `-bb${i}`);
      return (
        `        <div class="logo-plate${dark ? " dark" : ""}">\n` +
        `          <svg width="${Math.round(h * aspect)}" height="${h}" viewBox="${box}" fill="none" role="img" aria-label="${caption.replace(/&mdash;/g, "-")}">${body}</svg>\n` +
        `          <span class="plate-caption">${caption}</span>\n` +
        `        </div>`
      );
    })
    .join("\n") +
  `\n      </div>`;

const bookSrc = readFileSync(BOOK, "utf8");
const START = "<!-- LOGO-PLATES:START";
const END = "<!-- LOGO-PLATES:END -->";
const s = bookSrc.indexOf(START);
const e = bookSrc.indexOf(END);
if (s < 0 || e < 0) {
  console.warn("! brand-book.html: LOGO-PLATES markers missing, plates not updated");
} else {
  const head = bookSrc.slice(0, bookSrc.indexOf("-->", s) + 3);
  const book = head + "\n" + platesHtml + "\n      " + bookSrc.slice(e);
  record(BOOK, Buffer.from(book, "utf8"));
}

console.table(written);
