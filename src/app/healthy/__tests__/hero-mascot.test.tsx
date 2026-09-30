import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LANDING_MS,
  entranceMode,
  flightOffset,
  HealthyHeroMascot,
} from "../hero-mascot.tsx";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const pageSource = readFileSync(path.resolve(testDir, "../page.tsx"), "utf8");
const componentSource = readFileSync(path.resolve(testDir, "../hero-mascot.tsx"), "utf8");
const mascotDir = path.resolve(testDir, "../../../../public/healthy/mascot");

// ---------------------------------------------------------------------------
// entranceMode
// ---------------------------------------------------------------------------

test("entranceMode bursts when motion is allowed, origin exists and page is at the top", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: 0, hasOrigin: true }), "bursting");
});

test("entranceMode is still under reduced motion even at the top with an origin", () => {
  assert.equal(entranceMode({ reducedMotion: true, scrollY: 0, hasOrigin: true }), "still");
});

test("entranceMode is still when there is no origin element", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: 0, hasOrigin: false }), "still");
});

test("entranceMode still bursts at exactly the 120px scroll threshold", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: 120, hasOrigin: true }), "bursting");
});

test("entranceMode is still one pixel past the threshold", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: 121, hasOrigin: true }), "still");
});

test("entranceMode is still for a fractional scroll just past the threshold", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: 120.5, hasOrigin: true }), "still");
});

test("entranceMode bursts for negative scrollY (iOS rubber-band overscroll)", () => {
  assert.equal(entranceMode({ reducedMotion: false, scrollY: -50, hasOrigin: true }), "bursting");
});

test("entranceMode is still when the landing spot is off screen", () => {
  assert.equal(
    entranceMode({ reducedMotion: false, scrollY: 0, hasOrigin: true, restInView: false }),
    "still",
  );
});

test("entranceMode is still with data saver on, even with everything else allowing the burst", () => {
  assert.equal(
    entranceMode({ reducedMotion: false, scrollY: 0, hasOrigin: true, restInView: true, saveData: true }),
    "still",
  );
});

test("entranceMode bursts when the landing spot is on screen and data saver is off", () => {
  assert.equal(
    entranceMode({ reducedMotion: false, scrollY: 0, hasOrigin: true, restInView: true, saveData: false }),
    "bursting",
  );
});

test("entranceMode is still when reduced motion, no origin and deep scroll all apply", () => {
  assert.equal(entranceMode({ reducedMotion: true, scrollY: 5000, hasOrigin: false }), "still");
});

// ---------------------------------------------------------------------------
// flightOffset
// ---------------------------------------------------------------------------

test("flightOffset is zero when the boxes share a centre", () => {
  const offset = flightOffset(
    { left: 90, top: 90, width: 20, height: 20 },
    { left: 50, top: 50, width: 100, height: 100 },
  );
  assert.deepEqual(offset, { dx: 0, dy: 0 });
});

test("flightOffset points from the rest centre to the origin centre", () => {
  // origin centre (110, 60); rest centre (300, 400)
  const offset = flightOffset(
    { left: 100, top: 50, width: 20, height: 20 },
    { left: 250, top: 300, width: 100, height: 200 },
  );
  assert.deepEqual(offset, { dx: -190, dy: -340 });
});

test("flightOffset is positive when the origin lies right of and below the rest box", () => {
  const offset = flightOffset(
    { left: 500, top: 700, width: 40, height: 10 },
    { left: 0, top: 0, width: 100, height: 100 },
  );
  assert.deepEqual(offset, { dx: 470, dy: 655 });
});

test("flightOffset handles negative (off-screen) coordinates", () => {
  const offset = flightOffset(
    { left: -200, top: -100, width: 100, height: 50 },
    { left: -20, top: -10, width: 40, height: 20 },
  );
  // origin centre (-150, -75); rest centre (0, 0)
  assert.deepEqual(offset, { dx: -150, dy: -75 });
});

test("flightOffset with zero-size boxes reduces to the difference of their corners", () => {
  const offset = flightOffset(
    { left: 10, top: 20, width: 0, height: 0 },
    { left: 4, top: 5, width: 0, height: 0 },
  );
  assert.deepEqual(offset, { dx: 6, dy: 15 });
});

test("flightOffset with a zero-size origin aims at its corner point", () => {
  const offset = flightOffset(
    { left: 100, top: 100, width: 0, height: 0 },
    { left: 0, top: 0, width: 200, height: 100 },
  );
  assert.deepEqual(offset, { dx: 0, dy: 50 });
});

test("flightOffset does not mutate its arguments", () => {
  const origin = { left: 1, top: 2, width: 3, height: 4 };
  const rest = { left: 5, top: 6, width: 7, height: 8 };
  flightOffset(origin, rest);
  assert.deepEqual(origin, { left: 1, top: 2, width: 3, height: 4 });
  assert.deepEqual(rest, { left: 5, top: 6, width: 7, height: 8 });
});

test("LANDING_MS is 546, the footage's touchdown time", () => {
  assert.equal(LANDING_MS, 546);
});

// ---------------------------------------------------------------------------
// Server-rendered markup
// ---------------------------------------------------------------------------

test("server render hides the wrapper with opacity-0 and no img", () => {
  const html = renderToStaticMarkup(<HealthyHeroMascot originSelector="#x" />);
  assert.match(html, /opacity-0/);
  assert.doesNotMatch(html, /<img/);
});

test("server render is not shown (no opacity-100 wrapper) before hydration", () => {
  const html = renderToStaticMarkup(<HealthyHeroMascot originSelector="#x" />);
  const wrapper = html.match(/^<div[^>]*>/)?.[0] ?? "";
  assert.doesNotMatch(wrapper, /opacity-100/);
  assert.match(wrapper, /opacity-0/);
});

test("server render is aria-hidden and ignores the pointer", () => {
  const html = renderToStaticMarkup(<HealthyHeroMascot originSelector="#x" />);
  const wrapper = html.match(/^<div[^>]*>/)?.[0] ?? "";
  assert.match(wrapper, /aria-hidden="true"/);
  assert.match(wrapper, /pointer-events-none/);
});

test("server render applies the className to the wrapper", () => {
  const html = renderToStaticMarkup(
    <HealthyHeroMascot originSelector="#x" className="absolute bottom-0 left-2" />,
  );
  const wrapper = html.match(/^<div[^>]*>/)?.[0] ?? "";
  assert.match(wrapper, /absolute bottom-0 left-2/);
});

test("server render never names the mascot Brian", () => {
  const html = renderToStaticMarkup(<HealthyHeroMascot originSelector="#x" />);
  assert.doesNotMatch(html, /brian/i);
});

test("component source only ever renders the img with an empty alt", () => {
  const alts = componentSource.match(/\balt=(?:"[^"]*"|\{[^}]*\})/g) ?? [];
  assert.deepEqual(alts, ['alt=""']);
});

test("component source hands the img the same WIDTH and HEIGHT constants", () => {
  assert.match(componentSource, /const WIDTH = 236;/);
  assert.match(componentSource, /const HEIGHT = 300;/);
});

// ---------------------------------------------------------------------------
// Page wiring
// ---------------------------------------------------------------------------

test("page passes an originSelector that is an id selector", () => {
  const match = pageSource.match(/originSelector="#([\w-]+)"/);
  assert.ok(match, "page.tsx has no originSelector=\"#id\"");
});

test("the originSelector id exists exactly once as an id attribute in the page", () => {
  const id = pageSource.match(/originSelector="#([\w-]+)"/)?.[1] ?? "";
  const occurrences = pageSource.match(new RegExp(`\\bid="${id}"`, "g")) ?? [];
  assert.equal(occurrences.length, 1);
});

test("the origin id sits on the hero call-to-action link", () => {
  const id = pageSource.match(/originSelector="#([\w-]+)"/)?.[1] ?? "";
  assert.match(pageSource, new RegExp(`<Link id="${id}" href="#healthy-picks-row"`));
});

// ---------------------------------------------------------------------------
// Asset invariants
// ---------------------------------------------------------------------------

function webpCanvas(buf: Buffer): { width: number; height: number } {
  assert.equal(buf.toString("ascii", 0, 4), "RIFF");
  assert.equal(buf.toString("ascii", 8, 12), "WEBP");
  assert.equal(buf.toString("ascii", 12, 16), "VP8X", "expected an extended WebP");
  return {
    width: 1 + buf.readUIntLE(24, 3),
    height: 1 + buf.readUIntLE(27, 3),
  };
}

/** Loop count from the ANIM chunk, or null when there is no ANIM chunk. */
function webpLoopCount(buf: Buffer): number | null {
  let pos = 12;
  while (pos + 8 <= buf.length) {
    const tag = buf.toString("ascii", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    if (tag === "ANIM") return buf.readUInt16LE(pos + 8 + 4);
    pos += 8 + size + (size % 2);
  }
  return null;
}

function declared(name: "WIDTH" | "HEIGHT"): number {
  const m = componentSource.match(new RegExp(`const ${name} = (\\d+);`));
  assert.ok(m, `${name} not found`);
  return Number(m[1]);
}

test("hero-burst.webp canvas matches the component's WIDTH x HEIGHT", () => {
  const canvas = webpCanvas(readFileSync(path.join(mascotDir, "hero-burst.webp")));
  assert.deepEqual(canvas, { width: declared("WIDTH"), height: declared("HEIGHT") });
});

test("hero-burst-still.webp canvas matches the component's WIDTH x HEIGHT", () => {
  const canvas = webpCanvas(readFileSync(path.join(mascotDir, "hero-burst-still.webp")));
  assert.deepEqual(canvas, { width: declared("WIDTH"), height: declared("HEIGHT") });
});

test("hero-burst.webp plays exactly once (loop count 1, not infinite)", () => {
  const loops = webpLoopCount(readFileSync(path.join(mascotDir, "hero-burst.webp")));
  assert.equal(loops, 1);
});

test("hero-burst-still.webp is a single image with no animation chunk", () => {
  assert.equal(webpLoopCount(readFileSync(path.join(mascotDir, "hero-burst-still.webp"))), null);
});

test("component references the two asset filenames that exist on disk", () => {
  assert.match(componentSource, /"\/healthy\/mascot\/hero-burst\.webp"/);
  assert.match(componentSource, /"\/healthy\/mascot\/hero-burst-still\.webp"/);
});
