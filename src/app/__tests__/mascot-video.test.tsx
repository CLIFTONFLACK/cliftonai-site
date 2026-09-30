import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// next/image needs Next's runtime; a plain <img> stands in for it.
let HeroMascot: () => React.ReactElement;
let MascotVideo: (props: { className?: string; children: React.ReactNode }) => React.ReactElement;

test.before(async () => {
  mock.module("next/image", {
    defaultExport: (props: { src: string; alt: string }) =>
      createElement("img", { src: props.src, alt: props.alt }),
  });
  ({ HeroMascot } = await import("../hero-mascot.tsx"));
  ({ MascotVideo } = await import("../mascot-video.tsx"));
});

const testDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(testDir, "../../../public");
const videoSource = readFileSync(path.resolve(testDir, "../mascot-video.tsx"), "utf8");
const heroSource = readFileSync(path.resolve(testDir, "../hero-mascot.tsx"), "utf8");
const css = readFileSync(path.resolve(testDir, "../globals.css"), "utf8");

const VIDEO_SRC = "/video/getbrian-mascot.mp4";
const POSTER_SRC = "/video/getbrian-mascot-poster.webp";

const heroHtml = () => renderToStaticMarkup(createElement(HeroMascot));
const tag = (markup: string, name: string) => markup.match(new RegExp(`<${name}\\b[^>]*>`))?.[0] ?? "";

// ---------------------------------------------------------------------------
// Server-rendered markup
// ---------------------------------------------------------------------------

test("HeroMascot renders a trigger button labelled to watch the GetBrian video", () => {
  const button = tag(heroHtml(), "button");

  assert.match(button, /aria-label="Watch the GetBrian video"/);
  assert.match(button, /aria-haspopup="dialog"/);
  assert.match(button, /type="button"/);
});

test("HeroMascot renders the dialog closed (no open attribute)", () => {
  const dialog = tag(heroHtml(), "dialog");

  assert.match(dialog, /^<dialog\b/);
  assert.match(dialog, /aria-label="GetBrian video"/);
  assert.doesNotMatch(dialog, /\bopen\b/);
});

test("video defers loading with preload=none and points at the mp4 and the poster", () => {
  const video = tag(heroHtml(), "video");

  assert.match(video, /preload="none"/);
  assert.ok(video.includes(`src="${VIDEO_SRC}"`), video);
  assert.ok(video.includes(`poster="${POSTER_SRC}"`), video);
});

test("video has controls, loops and plays inline", () => {
  const video = tag(heroHtml(), "video");

  assert.match(video, /\bcontrols=""/);
  assert.match(video, /\bloop=""/);
  assert.match(video, /\bplaysinline=""/i);
});

test("video does not autoplay on load", () => {
  assert.doesNotMatch(tag(heroHtml(), "video"), /autoplay/i);
});

test("close button is labelled Close video", () => {
  assert.match(heroHtml(), /<button[^>]*aria-label="Close video"/);
});

test("both mascot images keep empty alt text", () => {
  const imgs = heroHtml().match(/<img\b[^>]*>/g) ?? [];

  assert.equal(imgs.length, 2);
  assert.match(imgs[0], /alt=""/);
  assert.match(imgs[1], /alt=""/);
});

test("both mascot images sit inside the trigger button, not the dialog", () => {
  const html = heroHtml();
  const triggerInner = html.slice(html.indexOf("<button"), html.indexOf("</button>"));

  assert.equal((triggerInner.match(/<img\b/g) ?? []).length, 2);
});

test("play badge is decorative (aria-hidden)", () => {
  const html = heroHtml();
  const triggerInner = html.slice(html.indexOf("<button"), html.indexOf("</button>"));

  assert.match(triggerInner, /<span[^>]*aria-hidden="true"/);
});

test("className is applied to the trigger button", () => {
  const html = renderToStaticMarkup(
    createElement(MascotVideo, { className: "absolute right-3 test-marker" }, "x"),
  );

  assert.match(tag(html, "button"), /class="[^"]*absolute right-3 test-marker/);
});

test("trigger button renders without the literal string undefined when className is omitted", () => {
  const html = renderToStaticMarkup(createElement(MascotVideo, null, "x"));

  assert.doesNotMatch(tag(html, "button"), /undefined/);
});

test("HeroMascot passes its positioning classes to the trigger", () => {
  assert.match(tag(heroHtml(), "button"), /absolute right-0 bottom-full/);
});

test("children render inside the trigger button", () => {
  const html = renderToStaticMarkup(createElement(MascotVideo, null, "CHILD-TEXT"));

  assert.match(html, /<button[^>]*>CHILD-TEXT/);
});

// ---------------------------------------------------------------------------
// Brand rule: the mascot is never named Brian
// ---------------------------------------------------------------------------

test("no accessible label or alt text names the mascot Brian", () => {
  const html = heroHtml();
  const labels = html.match(/(?:aria-label|alt|title)="[^"]*"/g) ?? [];

  assert.ok(labels.length >= 5, `expected several labels, got ${labels.length}`);
  for (const label of labels) assert.doesNotMatch(label, /(?<!Get)Brian/);
});

test("rendered markup mentions Brian only as part of GetBrian", () => {
  assert.doesNotMatch(heroHtml(), /(?<!Get)Brian/i);
});

test("brand-rule regex does catch a bare Brian", () => {
  assert.match('aria-label="Watch Brian"', /(?<!Get)Brian/);
});

test("component sources set no non-empty alt on the mascot", () => {
  const alts = (videoSource + heroSource).match(/\balt=(?:"[^"]*"|\{[^}]*\})/g) ?? [];

  assert.deepEqual(alts, ['alt=""', 'alt=""']);
});

// ---------------------------------------------------------------------------
// Assets on disk
// ---------------------------------------------------------------------------

test("the mp4 referenced by the component exists and is non-empty", () => {
  assert.ok(videoSource.includes(`"${VIDEO_SRC}"`));
  assert.ok(statSync(path.join(publicDir, VIDEO_SRC)).size > 0);
});

test("the mp4 starts with an ftyp box", () => {
  const head = readFileSync(path.join(publicDir, VIDEO_SRC)).subarray(0, 12);

  assert.equal(head.toString("ascii", 4, 8), "ftyp");
});

test("the poster referenced by the component exists and is non-empty", () => {
  assert.ok(videoSource.includes(`"${POSTER_SRC}"`));
  assert.ok(statSync(path.join(publicDir, POSTER_SRC)).size > 0);
});

test("the poster is a WebP file", () => {
  const head = readFileSync(path.join(publicDir, POSTER_SRC)).subarray(0, 12);

  assert.equal(head.toString("ascii", 0, 4), "RIFF");
  assert.equal(head.toString("ascii", 8, 12), "WEBP");
});

test("the two mascot cut-out images HeroMascot renders exist on disk", () => {
  assert.ok(statSync(path.join(publicDir, "brand/getbrian-mascot-arm-512.webp")).size > 0);
  assert.ok(statSync(path.join(publicDir, "brand/getbrian-mascot-body-512.webp")).size > 0);
});

// ---------------------------------------------------------------------------
// Scroll lock
// ---------------------------------------------------------------------------

test("the play badge's blink class is defined in globals.css and switched off under reduced motion", () => {
  const badge = heroHtml().match(/<span[^>]*aria-hidden="true"[^>]*>/)?.[0] ?? "";

  assert.match(badge, /mascot-play-blink/);
  assert.match(css, /\.mascot-play-blink\s*\{\s*animation:\s*mascot-play-blink/);
  assert.match(css, /prefers-reduced-motion:\s*reduce\)\s*\{\s*\.mascot-play-blink\s*\{\s*animation:\s*none;/);
});

test("globals.css freezes body scroll while a dialog is open", () => {
  assert.match(css, /body:has\(dialog\[open\]\)\s*\{\s*overflow:\s*hidden;\s*\}/);
});
