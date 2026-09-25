import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  // StepCard: div > [icon row div, h3 title]
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
// Step cards hold only the icon row and the title: no descriptions and no
// links, in either layout.
// ---------------------------------------------------------------------------

test("every step card, in both layouts, is just the icon row and the title", () => {
  for (const card of [...desktopStepCardEls(), ...mobileStepCardEls()]) {
    const kids = card.props.children as El[];
    assert.equal(kids.length, 2);
    assert.equal(kids[1].type, "h3");
  }
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
// No re-check / "back to step 1" line under the mobile list.
// ---------------------------------------------------------------------------

test("mobile layout is just the mark and the step list, with no re-check line", () => {
  const { mobile } = loop();
  const kids = mobile.props.children as El[];
  assert.equal(kids.length, 2);
  assert.equal(kids[1].type, "ol");
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

// ---------------------------------------------------------------------------
// The mark feeds each step: one spoke and one travelling pulse per step, and
// each card's icon glows on the same clock as its spoke's pulse.
// ---------------------------------------------------------------------------

function spokeGroup(): { glow: El; spokes: El[]; dots: El[] } {
  const { svg } = desktopParts();
  const g = (svg.props.children as unknown[])[3] as El;
  const [glow, spokes, dots] = g.props.children as [El, El[], El[]];
  return { glow, spokes, dots };
}

test("desktop ring draws a spoke from the mark to every step", () => {
  const { glow, spokes } = spokeGroup();
  assert.equal(glow.props.className, "healthy-hub-glow");
  assert.equal(spokes.length, 5);
  assert.equal(new Set(spokes.map((s) => s.props.d)).size, 5);
});

test("each spoke carries one pulse, staggered 2s apart in step order", () => {
  const { spokes, dots } = spokeGroup();
  assert.equal(dots.length, 5);
  dots.forEach((dot, k) => {
    const style = dot.props.style as { offsetPath: string; animationDelay: string };
    assert.equal(dot.props.className, "healthy-spoke-dot");
    assert.equal(style.offsetPath, `path('${spokes[k].props.d}')`);
    assert.equal(style.animationDelay, `${k * 2}s`);
  });
});

test("each step card's icon glows on its own spoke's clock, in both layouts", () => {
  for (const cards of [desktopStepCardEls(), mobileStepCardEls()]) {
    cards.forEach((card, k) => {
      const iconRow = (card.props.children as El[])[0];
      const badge = (iconRow.props.children as El[])[0];
      assert.match(badge.props.className as string, /\bhealthy-step-glow\b/);
      assert.equal((badge.props.style as { animationDelay: string }).animationDelay, `${k * 2}s`);
    });
  }
});

test("spoke pulses and the hub glow are hidden under reduced motion", () => {
  const rule = /\.healthy-spoke-dot,\s*\.healthy-hub-glow\s*\{\s*display:\s*none;/.exec(css);
  assert.ok(rule, "expected a rule hiding .healthy-spoke-dot and .healthy-hub-glow");
  const mediaStart = css.lastIndexOf("@media (prefers-reduced-motion: reduce)", rule.index);
  assert.ok(mediaStart >= 0, "rule must follow a prefers-reduced-motion block's opening");
  // A closing brace at column 0 between the two would mean the media block ended first.
  assert.doesNotMatch(css.slice(mediaStart, rule.index), /\n\}/);
});
