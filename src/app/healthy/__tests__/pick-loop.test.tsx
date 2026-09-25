import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Link from "next/link";
import { PickLoop } from "../pick-loop.tsx";
import { LogoAnimation } from "../logo-animation.tsx";

/**
 * PickLoop is a plain server component (no hooks in its own body), so
 * calling it directly returns the React element tree, the same approach
 * components.test.tsx and job-rail.test.tsx use. LogoAnimation is a client
 * component with hooks in its own body (see logo-animation.test.tsx's own
 * comment) and is therefore treated as opaque here: we assert on the
 * *element* PickLoop hands it (type + props), never invoke it.
 */

type El = { type: unknown; props: Record<string, unknown> };

function fragmentChildren(el: ReturnType<typeof PickLoop>): El[] {
  const kids = (el as unknown as El).props.children;
  return Array.isArray(kids) ? (kids as El[]) : [kids as El];
}

function loop() {
  const [desktop, mobile] = fragmentChildren(PickLoop());
  return { desktop, mobile };
}

// ---------------------------------------------------------------------------
// Desktop ring structure
// ---------------------------------------------------------------------------

function desktopParts() {
  const { desktop } = loop();
  const kids = desktop.props.children as El[];
  // [svg, mark div, ol]
  const [svg, markDiv, ol] = kids;
  return { desktop, svg, markDiv, ol };
}

test("desktop ring is hidden below lg and shown at lg (hidden lg:block)", () => {
  const { desktop } = desktopParts();
  assert.match(desktop.props.className as string, /\bhidden\b/);
  assert.match(desktop.props.className as string, /\blg:block\b/);
});

test("mobile list is hidden at lg and shown below it (lg:hidden)", () => {
  const { mobile } = loop();
  assert.match(mobile.props.className as string, /\blg:hidden\b/);
});

// ---------------------------------------------------------------------------
// Chevrons: one per gap (5), including sign-off back to step 1.
// ---------------------------------------------------------------------------

test("desktop ring renders a chevron in every gap, including sign-off back to step 1", () => {
  const { svg } = desktopParts();
  const svgKids = svg.props.children as unknown[];
  // svgKids: [ring path, chevron array (one per gap), dot array]
  const chevronArray = svgKids[1] as (El | null)[];
  assert.equal(chevronArray.length, 5);
  for (const c of chevronArray) assert.equal((c as El).type, "path");
});

test("desktop ring has no 'Back to step 1' chip", () => {
  const { desktop } = desktopParts();
  assert.equal((desktop.props.children as El[]).length, 3);
});

test("desktop ring travels via exactly 2 .healthy-loop-dot circles", () => {
  const { svg } = desktopParts();
  const svgKids = svg.props.children as unknown[];
  const dotArray = svgKids[2] as El[];
  assert.equal(dotArray.length, 2);
  for (const dot of dotArray) {
    assert.equal(dot.type, "circle");
    assert.equal(dot.props.className, "healthy-loop-dot");
  }
});

// ---------------------------------------------------------------------------
// Both LogoAnimation uses pass showSteps={false} (the loop draws its own
// step cards; the caption list inside the mark would duplicate them).
// ---------------------------------------------------------------------------

test("desktop mark passes showSteps={false} to LogoAnimation", () => {
  const { markDiv } = desktopParts();
  const markEl = markDiv.props.children as El;
  assert.equal(markEl.type, LogoAnimation);
  assert.equal(markEl.props.showSteps, false);
});

test("mobile mark passes showSteps={false} to LogoAnimation", () => {
  const { mobile } = loop();
  const kids = mobile.props.children as El[];
  const markEl = kids[0];
  assert.equal(markEl.type, LogoAnimation);
  assert.equal(markEl.props.showSteps, false);
});

// ---------------------------------------------------------------------------
// Step order and count, identical between the two layouts. AI gathers the
// research first, human sign-off last. StepCard is not exported, but the
// element's own `type` is the very function PickLoop handed it (no hooks in
// its body), so it can be invoked the same way ProductCard/BuyButton are
// invoked in components.test.tsx.
// ---------------------------------------------------------------------------

const EXPECTED_TITLES = [
  "Brian Finds Clinical Data",
  "Information Gets Evaluated",
  "Products Get Matched",
  "Brian Creates Shortlist",
  "Human Final Approval",
];

function renderStepCard(el: El): El {
  const componentFn = el.type as (props: Record<string, unknown>) => El;
  return componentFn(el.props);
}

function stepCardTitle(cardEl: El): string {
  // StepCard: div > [icon row div, h3 title, optional Link]
  const kids = cardEl.props.children as El[];
  const h3 = kids[1];
  return h3.props.children as string;
}

function desktopStepCardEls(): El[] {
  const { ol } = desktopParts();
  const liEls = ol.props.children as El[];
  return liEls.map((li) => renderStepCard(li.props.children as El));
}

function mobileStepCardEls(): El[] {
  const { mobile } = loop();
  const kids = mobile.props.children as El[];
  const mobileOl = kids[1];
  const liEls = mobileOl.props.children as El[];
  return liEls.map((li) => {
    // li children: [dot span, StepCard element] — the dot comes first.
    const stepCardEl = (li.props.children as El[])[1];
    return renderStepCard(stepCardEl);
  });
}

test("desktop ring shows all 5 steps in order: Brian finds data first, human approval last", () => {
  const titles = desktopStepCardEls().map(stepCardTitle);
  assert.deepEqual(titles, EXPECTED_TITLES);
});

test("mobile list shows all 5 steps in the same order as the desktop ring", () => {
  const titles = mobileStepCardEls().map(stepCardTitle);
  assert.deepEqual(titles, EXPECTED_TITLES);
});

// ---------------------------------------------------------------------------
// The only link in the loop is "Read the policy" -> /healthy/about, and it
// appears exactly once per layout (on the human sign-off card only).
// ---------------------------------------------------------------------------

function linksIn(cardEls: El[]): El[] {
  return cardEls
    .map((card) => (card.props.children as unknown[])[2])
    .filter((c): c is El => typeof c === "object" && c !== null);
}

test("desktop: exactly one link across all step cards, on human sign-off, and it's next/link's Link", () => {
  const links = linksIn(desktopStepCardEls());
  assert.equal(links.length, 1);
  assert.equal(links[0].type, Link);
});

test("desktop link text reads exactly 'Read the policy'", () => {
  const links = linksIn(desktopStepCardEls());
  assert.equal(links[0].props.children, "Read the policy");
});

test("desktop link href is /healthy/about", () => {
  const links = linksIn(desktopStepCardEls());
  assert.equal(links[0].props.href, "/healthy/about");
});

test("mobile: exactly one link across all step cards, on human sign-off, pointing to /healthy/about", () => {
  const links = linksIn(mobileStepCardEls());
  assert.equal(links.length, 1);
  assert.equal(links[0].props.href, "/healthy/about");
  assert.equal(links[0].props.children, "Read the policy");
});

// ---------------------------------------------------------------------------
// Step card positions on the ring: the first card sits top-centre
// (left: 50%), and all 5 positions are distinct.
// ---------------------------------------------------------------------------

test("first step card on the desktop ring sits top-centre (left: 50%)", () => {
  const { ol } = desktopParts();
  const liEls = ol.props.children as El[];
  const firstStyle = liEls[0].props.style as { left: string; top: string };
  assert.equal(firstStyle.left, "50%");
});

test("all 5 step card positions on the desktop ring are distinct", () => {
  const { ol } = desktopParts();
  const liEls = ol.props.children as El[];
  const positions = liEls.map((li) => JSON.stringify(li.props.style));
  assert.equal(new Set(positions).size, 5);
});

// ---------------------------------------------------------------------------
// The re-check / "back to step 1" label, present in both layouts.
// ---------------------------------------------------------------------------

test("mobile list ends with the re-check label, back to step 1", () => {
  const { mobile } = loop();
  const kids = mobile.props.children as El[];
  const recheckP = kids[2];
  const text = (recheckP.props.children as unknown[])
    .filter((c): c is string => typeof c === "string")
    .join("");
  assert.match(text, /Re-checked at least every six months/);
  assert.match(text, /back to step 1\./);
});

// ---------------------------------------------------------------------------
// CSS: .healthy-loop-dot is hidden under prefers-reduced-motion (dots
// stop travelling for anyone who has asked for reduced motion).
// ---------------------------------------------------------------------------

const cssPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../globals.css");
const css = readFileSync(cssPath, "utf8");

test(".healthy-loop-dot is set to display: none inside a prefers-reduced-motion block", () => {
  const re = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/g;
  let block: string | undefined;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    if (m[1].includes(".healthy-loop-dot")) {
      block = m[1];
      break;
    }
  }
  assert.ok(block, "expected a prefers-reduced-motion block mentioning .healthy-loop-dot");
  assert.match(block!, /\.healthy-loop-dot\s*\{\s*display:\s*none\s*;\s*\}/);
});
