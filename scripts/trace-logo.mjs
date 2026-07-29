/**
 * Vectorise docs/GetBrian_Logo.png into the public/brand/*.svg asset set.
 *
 * The logo was delivered as raster only. Colour separation is clean (~0.7% of
 * pixels are anti-alias blends), so an automated trace reproduces it far more
 * faithfully than redrawing it by hand would. Re-run this if the source art is
 * ever revised — the SVGs are build output, GetBrian_Logo.png is the source.
 *
 *   node scripts/trace-logo.mjs
 *
 * Pipeline: nearest-reference-colour classification -> per-colour bitmask ->
 * marching-squares boundary extraction (outer loops + holes) -> Douglas-Peucker
 * simplification -> SVG paths with fill-rule="evenodd".
 */

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "docs", "GetBrian_Logo.png");
const OUT = path.join(root, "public", "brand");

// Sampled from the source file — see the plan / brand tokens.
const NAVY = [0x0a, 0x1d, 0x3b];
const GOLD = [0xba, 0x8b, 0x32];
const GOLD_DARK = "#A36A00";
const GOLD_LIGHT = "#E0B84F";

/**
 * Gold ramp for reversed (on-navy) variants. The on-white ramp starts at
 * #A36A00, which against navy is barely lighter than the ground — at favicon
 * sizes the traces resample into an indistinct dark smear. Reversed marks get a
 * lifted ramp so the traces stay legible on dark.
 */
const GOLD_DARK_REV = "#D2A03C";
const GOLD_LIGHT_REV = "#F2DCA0";
const WHITE = [0xff, 0xff, 0xff];

/**
 * Supersample factor. Tracing a hard-thresholded mask at native resolution
 * leaves a 1px staircase on every curve, which reads as visible wobble once the
 * mark is shown large. Lanczos-upscaling first recovers the sub-pixel edge
 * position that the source's anti-aliasing already encodes, so the staircase
 * drops to 1/SS px and simplification can smooth it away without eating the
 * genuinely sharp corners in the circuit traces.
 */
const SS = 4;

/** Simplification tolerance, in source pixels. Above the 1/SS staircase
 *  amplitude (so quantisation noise is flattened), well below anything the eye
 *  resolves at display size. */
const EPSILON = 0.45;

/** The source has a blank band at y 537-598 separating mark from wordmark. */
const SPLIT_Y = 567;

// ---------------------------------------------------------------- classify

/**
 * Classify every pixel as background / navy / gold.
 *
 * Warmth (r-b) is tested before RGB distance, and that ordering is load-bearing:
 * a 50% navy-on-white anti-alias pixel is ~#858E9D, which in plain RGB distance
 * is *nearer to gold* than to either navy or white. Nearest-reference alone
 * therefore paints a gold fringe along every navy edge in the mark. Splitting on
 * warmth first sends cool blends down the navy/white axis where they belong,
 * and only genuinely warm pixels compete for gold.
 */
function classify(data, info) {
  const { width: W, height: H, channels: ch } = info;
  // 0 = background, 1 = navy, 2 = gold
  const cls = new Uint8Array(W * H);
  const d2 = (r, g, b, ref) => {
    const dr = r - ref[0], dg = g - ref[1], db = b - ref[2];
    return dr * dr + dg * dg + db * db;
  };
  for (let p = 0, i = 0; p < W * H; p++, i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (ch === 4 && data[i + 3] < 128) continue;
    if (r - b > 20) {
      const dG = d2(r, g, b, GOLD), dW = d2(r, g, b, WHITE), dN = d2(r, g, b, NAVY);
      cls[p] = dG <= dW && dG <= dN ? 2 : dN < dW ? 1 : 0;
    } else {
      cls[p] = d2(r, g, b, NAVY) < d2(r, g, b, WHITE) ? 1 : 0;
    }
  }
  return cls;
}

// ------------------------------------------------------- contour extraction

/**
 * Extract closed boundary loops from a bitmask.
 *
 * Every "inside" pixel contributes a directed unit edge for each of its four
 * sides that faces an "outside" pixel, wound so that inside is always on the
 * right. Those edges chain head-to-tail into closed loops: outer boundaries and
 * hole boundaries both fall out, with opposite winding, which is exactly what
 * fill-rule="evenodd" wants.
 */
function extractLoops(mask, W, H) {
  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && mask[y * W + x] === 1;

  // Directed edges keyed by start vertex; a vertex can host two outgoing edges
  // where the shape pinches diagonally, hence an array.
  const outgoing = new Map();
  const key = (x, y) => x * 100000 + y;
  const push = (x1, y1, x2, y2) => {
    const k = key(x1, y1);
    const e = { x1, y1, x2, y2, used: false };
    const list = outgoing.get(k);
    if (list) list.push(e);
    else outgoing.set(k, [e]);
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!inside(x, y)) continue;
      if (!inside(x, y - 1)) push(x, y, x + 1, y);         // top    ->
      if (!inside(x + 1, y)) push(x + 1, y, x + 1, y + 1); // right  v
      if (!inside(x, y + 1)) push(x + 1, y + 1, x, y + 1); // bottom <-
      if (!inside(x - 1, y)) push(x, y + 1, x, y);         // left   ^
    }
  }

  const loops = [];
  for (const list of outgoing.values()) {
    for (const start of list) {
      if (start.used) continue;
      const pts = [];
      let e = start;
      while (e && !e.used) {
        e.used = true;
        pts.push([e.x1, e.y1]);
        const next = outgoing.get(key(e.x2, e.y2));
        if (!next) break;
        // Prefer continuing straight, then turning, so pinch points resolve
        // deterministically instead of chaining into a figure-eight.
        const dx = e.x2 - e.x1, dy = e.y2 - e.y1;
        let pick = null;
        for (const c of next) {
          if (c.used) continue;
          if (c.x2 - c.x1 === dx && c.y2 - c.y1 === dy) { pick = c; break; }
          if (!pick) pick = c;
        }
        e = pick;
      }
      if (pts.length >= 4) loops.push(pts);
    }
  }
  return loops;
}

// ------------------------------------------------------------- morphology

/** Square-kernel dilation, separable. Used only for the compact mark. */
function dilate(mask, W, H, r, yMax = H) {
  const tmp = new Uint8Array(W * H);
  for (let y = 0; y < yMax; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const lo = Math.max(0, x - r), hi = Math.min(W - 1, x + r);
      for (let n = lo; n <= hi; n++) if (mask[row + n]) { tmp[row + x] = 1; break; }
    }
  }
  const out = new Uint8Array(W * H);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < yMax; y++) {
      const lo = Math.max(0, y - r), hi = Math.min(yMax - 1, y + r);
      for (let n = lo; n <= hi; n++) if (tmp[n * W + x]) { out[y * W + x] = 1; break; }
    }
  }
  return out;
}

/** Shoelace. Outer loops come out positive under this tracer's winding; holes
 *  negative. Lets us drop ring interiors that would silt up at small sizes. */
function signedArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i], q = ring[(i + 1) % ring.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

// ------------------------------------------------------------- simplify

function dropCollinear(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[(i - 1 + pts.length) % pts.length];
    const b = pts[i];
    const c = pts[(i + 1) % pts.length];
    const cross = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    if (cross !== 0) out.push(b);
  }
  return out.length >= 3 ? out : pts;
}

function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}

function douglasPeucker(pts, eps) {
  if (pts.length < 3) return pts;
  let maxD = 0, idx = 0;
  const a = pts[0], b = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], a, b);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps) return [a, b];
  const left = douglasPeucker(pts.slice(0, idx + 1), eps);
  const right = douglasPeucker(pts.slice(idx), eps);
  return left.slice(0, -1).concat(right);
}

/**
 * Collinear-drop on the exact integer staircase, scale into source units, then
 * DP. Split the ring at its far point so the seam isn't pinned to an arbitrary
 * vertex (DP always keeps its endpoints, which would leave a kink there).
 */
function simplifyRing(pts, eps, scale) {
  const exact = dropCollinear(pts);
  const ring = exact.map(([x, y]) => [x / scale, y / scale]);
  if (ring.length < 4) return ring;
  let far = 0, farD = -1;
  for (let i = 1; i < ring.length; i++) {
    const d = Math.hypot(ring[i][0] - ring[0][0], ring[i][1] - ring[0][1]);
    if (d > farD) { farD = d; far = i; }
  }
  const partA = douglasPeucker(ring.slice(0, far + 1), eps);
  const partB = douglasPeucker(ring.slice(far).concat([ring[0]]), eps);
  return partA.slice(0, -1).concat(partB.slice(0, -1));
}

// ---------------------------------------------------------------- emit

const fmt = (n) => {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : String(r);
};

function loopsToPath(loops, dx = 0, dy = 0) {
  return loops
    .map((ring) => {
      const head = `M${fmt(ring[0][0] - dx)} ${fmt(ring[0][1] - dy)}`;
      const rest = ring
        .slice(1)
        .map((p) => `L${fmt(p[0] - dx)} ${fmt(p[1] - dy)}`)
        .join("");
      return head + rest + "Z";
    })
    .join("");
}

function bboxOf(loops) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const ring of loops)
    for (const [x, y] of ring) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  return { x0, y0, x1, y1 };
}

const ringBox = (ring) => bboxOf([ring]);

function svg({ title, loops, navyFill, goldId, pad = 6, reversed = false }) {
  const all = [...loops.navy, ...loops.gold];
  const b = bboxOf(all);
  const x = b.x0 - pad, y = b.y0 - pad;
  const w = b.x1 - b.x0 + pad * 2, h = b.y1 - b.y0 + pad * 2;
  const gb = loops.gold.length ? bboxOf(loops.gold) : null;
  const g0 = reversed ? GOLD_DARK_REV : GOLD_DARK;
  const g1 = reversed ? GOLD_LIGHT_REV : GOLD_LIGHT;

  const defs = gb
    ? `<defs><linearGradient id="${goldId}" x1="${fmt(gb.x0 - x)}" y1="0" x2="${fmt(
        gb.x1 - x
      )}" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${g0}"/><stop offset="1" stop-color="${g1}"/></linearGradient></defs>`
    : "";

  const parts = [];
  if (loops.navy.length)
    parts.push(
      `<path fill="${navyFill}" fill-rule="evenodd" d="${loopsToPath(loops.navy, x, y)}"/>`
    );
  if (loops.gold.length)
    parts.push(
      `<path fill="url(#${goldId})" fill-rule="evenodd" d="${loopsToPath(loops.gold, x, y)}"/>`
    );

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(w)} ${fmt(h)}" role="img" aria-label="${title}">` +
    `<title>${title}</title>${defs}${parts.join("")}</svg>\n`
  );
}

// ---------------------------------------------------------------- main

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;

const { data, info } = await sharp(SRC)
  .resize(W * SS, H * SS, { kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });
const cls = classify(data, info);
const SW = info.width, SH = info.height;

const maskOf = (want) => {
  const m = new Uint8Array(SW * SH);
  for (let p = 0; p < SW * SH; p++) if (cls[p] === want) m[p] = 1;
  return m;
};

const rawNavy = extractLoops(maskOf(1), SW, SH);
const rawGold = extractLoops(maskOf(2), SW, SH);

// Drop specks: sub-3px features are compression noise in the source, not art.
const MIN_EXTENT = 3 * SS;
const keep = (ring) => {
  const b = ringBox(ring);
  return b.x1 - b.x0 >= MIN_EXTENT && b.y1 - b.y0 >= MIN_EXTENT;
};

const simplify = (rings) =>
  rings.filter(keep).map((r) => simplifyRing(r, EPSILON, SS));

const navyAll = simplify(rawNavy);
const goldAll = simplify(rawGold);

const above = (ring) => (ringBox(ring).y0 + ringBox(ring).y1) / 2 < SPLIT_Y;

const markNavy = navyAll.filter(above);
const markGold = goldAll.filter(above);
const wordNavy = navyAll.filter((r) => !above(r));
const wordGold = goldAll.filter((r) => !above(r));

/*
 * Compact mark — an optical-size variant, not a different logo.
 *
 * The B has no left stem: the circuit traces are what close it. Drop them and
 * the mark reads unambiguously as a "3" (verified at 16/24/32/48px). But at
 * favicon sizes the traces as-drawn silt into mud. So instead of removing them,
 * thicken them: dilate the gold, fill the ring interiors that would clog
 * anyway, and subtract the navy back out so the B's edge stays crisp. Same
 * geometry, weighted for small sizes — the way a type family cuts a caption
 * weight rather than shipping the display cut at 8pt.
 */
const DILATE = Math.round(3.2 * SS);
const MARK_ROWS = SPLIT_Y * SS;

/*
 * Solo mark — B and tail swoosh, no circuit traces. For contexts that draw
 * their own traces into the mark (the hero diagram does exactly this), where
 * the logo's built-in traces would read as a duplicate of them. The swoosh is
 * the only gold in the bottom third; every trace crosses the upper two-thirds.
 */
const navyMarkBox = bboxOf(markNavy);
const tailTop = navyMarkBox.y0 + (navyMarkBox.y1 - navyMarkBox.y0) * 0.66;
const soloGold = markGold.filter((r) => ringBox(r).y0 >= tailTop);

const goldMark = maskOf(2);
const navyMark = maskOf(1);
const goldFat = dilate(goldMark, SW, SH, DILATE, MARK_ROWS);
for (let p = 0; p < SW * SH; p++) if (navyMark[p]) goldFat[p] = 0;

// Ring interiors are ~20px across in source units; anything under this closes
// up on screen at 32px anyway, so close it deliberately and evenly.
const MIN_HOLE = 26 * 26;
const compactGold = extractLoops(goldFat, SW, SH)
  .filter(keep)
  .map((r) => simplifyRing(r, EPSILON, SS))
  .filter((r) => {
    const a = signedArea(r);
    return a > 0 || Math.abs(a) >= MIN_HOLE;
  });

mkdirSync(OUT, { recursive: true });

const assets = [
  {
    file: "brian-logo.svg",
    title: "GetBrian",
    loops: { navy: navyAll, gold: goldAll },
    navyFill: "#0A1D3B",
    goldId: "gbGoldLogo",
  },
  {
    file: "brian-mark.svg",
    title: "GetBrian mark",
    loops: { navy: markNavy, gold: markGold },
    navyFill: "#0A1D3B",
    goldId: "gbGoldMark",
  },
  {
    file: "brian-mark-white.svg",
    title: "GetBrian mark",
    loops: { navy: markNavy, gold: markGold },
    navyFill: "#FFFFFF",
    goldId: "gbGoldWhite",
    reversed: true,
  },
  {
    file: "brian-mark-solo.svg",
    title: "GetBrian mark",
    loops: { navy: markNavy, gold: soloGold },
    navyFill: "#0A1D3B",
    goldId: "gbGoldSolo",
  },
  {
    file: "brian-mark-compact.svg",
    title: "GetBrian",
    loops: { navy: markNavy, gold: compactGold },
    navyFill: "#0A1D3B",
    goldId: "gbGoldCompact",
    pad: 4,
  },
  {
    // Reversed compact mark — what the favicon/app-icon tiles are built from.
    file: "brian-mark-compact-white.svg",
    title: "GetBrian",
    loops: { navy: markNavy, gold: compactGold },
    navyFill: "#FFFFFF",
    goldId: "gbGoldCompactWhite",
    pad: 4,
    reversed: true,
  },
  {
    file: "brian-wordmark.svg",
    title: "GetBrian",
    loops: { navy: wordNavy, gold: wordGold },
    navyFill: "#0A1D3B",
    goldId: "gbGoldWord",
    pad: 4,
  },
];

const written = [];
for (const a of assets) {
  const out = svg(a);
  writeFileSync(path.join(OUT, a.file), out, "utf8");
  const pts = [...a.loops.navy, ...a.loops.gold].reduce((n, r) => n + r.length, 0);
  written.push({ file: a.file, kb: (out.length / 1024).toFixed(1), rings: a.loops.navy.length + a.loops.gold.length, pts });
}

// ------------------------------------------------------------ self-check
// Re-rasterise the full lockup and diff it against the matching crop of the
// source. The SVG viewBox is the ink bbox plus padding, so the source has to be
// cropped to the same window for the comparison to mean anything.

const lockBox = bboxOf([...navyAll, ...goldAll]);
const PAD = 6;
const cx = Math.round(lockBox.x0 - PAD);
const cy = Math.round(lockBox.y0 - PAD);
const cw = Math.round(lockBox.x1 - lockBox.x0 + PAD * 2);
const chh = Math.round(lockBox.y1 - lockBox.y0 + PAD * 2);

const rendered = await sharp(path.join(OUT, "brian-logo.svg"))
  .resize(cw, chh, { fit: "fill" })
  .flatten({ background: "#ffffff" })
  .removeAlpha()
  .raw()
  .toBuffer();

const orig = await sharp(SRC)
  .extract({ left: cx, top: cy, width: cw, height: chh })
  .flatten({ background: "#ffffff" })
  .removeAlpha()
  .raw()
  .toBuffer();

const N = cw * chh;
let diff = 0, sumErr = 0;
for (let p = 0; p < N; p++) {
  const i = p * 3;
  const d =
    Math.abs(rendered[i] - orig[i]) +
    Math.abs(rendered[i + 1] - orig[i + 1]) +
    Math.abs(rendered[i + 2] - orig[i + 2]);
  sumErr += d;
  if (d > 90) diff++;
}

console.log(`source ${W}x${H}, compared over ${cw}x${chh} ink window`);
console.log(`navy rings ${navyAll.length}  gold rings ${goldAll.length}  (eps=${EPSILON}px)`);
console.table(written);
console.log(
  `self-check vs source: ${((diff / N) * 100).toFixed(2)}% pixels differ >90/765, ` +
    `mean abs error ${(sumErr / N / 3).toFixed(2)}/255 per channel`
);
