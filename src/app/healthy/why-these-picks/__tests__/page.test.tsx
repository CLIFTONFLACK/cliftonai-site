import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import Link from "next/link";
import Image from "next/image";

// why-these-picks/page.tsx imports `healthyOpenGraph` from ../../layout,
// which pulls in next/font/google and a global .css import that can't run
// outside Next's own build pipeline — the same problem sitemap.test.ts
// documents and solves the same way, via node:test's module mocking (needs
// --experimental-test-module-mocks, already on in the "test" script).
const FAKE_OPEN_GRAPH = { siteName: "Fake", type: "website" as const };

let WhyThesePicksPage: () => unknown;

test.before(async () => {
  mock.module(new URL("../../layout.tsx", import.meta.url), {
    exports: { healthyOpenGraph: FAKE_OPEN_GRAPH },
  });
  ({ default: WhyThesePicksPage } = await import("../page.tsx"));
});

/**
 * Walks the element tree the same way a reader would encounter it: recurses
 * into every host element's children, and — because the page composes real
 * text through local, hook-free components (BrandCard, GradeBadge, Prose,
 * PageHeading) rather than passing literal strings as children everywhere —
 * also calls those component functions to expand their output. `Link` and
 * `Image` are deliberately never invoked: they're Next built-ins that rely
 * on hooks/context that don't exist outside an actual React render, and
 * nothing here needs their internals, only their `children` prop.
 */
function collectText(node: unknown, out: string[]): void {
  if (node === null || node === undefined || typeof node === "boolean") return;
  if (typeof node === "string") {
    out.push(node);
    return;
  }
  if (typeof node === "number") {
    out.push(String(node));
    return;
  }
  if (Array.isArray(node)) {
    for (const child of node) collectText(child, out);
    return;
  }
  if (typeof node === "object" && "type" in node) {
    const el = node as { type: unknown; props?: { children?: unknown } };
    if (typeof el.type === "function" && el.type !== Link && el.type !== Image) {
      const rendered = (el.type as (props: unknown) => unknown)(el.props);
      collectText(rendered, out);
      return;
    }
    if (el.props && "children" in el.props) {
      collectText(el.props.children, out);
    }
  }
}

function pageText(): string {
  const out: string[] = [];
  collectText(WhyThesePicksPage(), out);
  return out.join(" ");
}

test("sanity: the walker actually reaches text nested inside BrandCard (proves the test below isn't vacuous)", () => {
  // "NSF Certified for Sport" only exists inside a BrandCard's rendered
  // output (r.say / r.brandClaims), never as a literal child of the page
  // component itself, so finding it proves collectText expanded BrandCard.
  assert.match(pageText(), /NSF Certified for Sport/);
});

test("why-these-picks page never renders the retired 'strong evidence' wording", () => {
  assert.doesNotMatch(pageText().toLowerCase(), /strong evidence/);
});

test("why-these-picks page never renders the retired 'moderate evidence' wording", () => {
  assert.doesNotMatch(pageText().toLowerCase(), /moderate evidence/);
});

test("why-these-picks page uses the current grade vocabulary instead (robust / promising / early)", () => {
  const text = pageText().toLowerCase();
  assert.match(text, /robust evidence/);
  assert.match(text, /promising evidence/);
  assert.match(text, /early evidence/);
});
