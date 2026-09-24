import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "../../data.ts";
import { references } from "../references.ts";

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

// ---------------------------------------------------------------------------
// The public page must not leak the creator-only "say" / "don't say" copy,
// and must not link to the noindexed creator-notes page.
// ---------------------------------------------------------------------------

/**
 * Collects every `href` reachable in the tree, expanding local components the
 * same way `collectText` does, but also recording `Link`/`<a>` hrefs instead
 * of skipping them (the opposite trade-off from `collectText`, which only
 * needs the visible words).
 */
function collectHrefs(node: unknown, out: string[]): void {
  if (node === null || node === undefined || typeof node === "boolean") return;
  if (Array.isArray(node)) {
    for (const child of node) collectHrefs(child, out);
    return;
  }
  if (typeof node === "object" && "type" in node) {
    const el = node as { type: unknown; props?: { children?: unknown; href?: unknown } };
    if (el.props && typeof el.props.href === "string") out.push(el.props.href);
    if (typeof el.type === "function" && el.type !== Link && el.type !== Image) {
      const rendered = (el.type as (props: unknown) => unknown)(el.props);
      collectHrefs(rendered, out);
      return;
    }
    if (el.props && "children" in el.props) {
      collectHrefs(el.props.children, out);
    }
  }
}

function pageHrefs(): string[] {
  const out: string[] = [];
  collectHrefs(WhyThesePicksPage(), out);
  return out;
}

test("sanity: real reference data actually contains 'say' and 'dontSay' copy (proves the absence check below isn't vacuous)", () => {
  assert.ok(references.length > 0, "fixture assumption: at least one reference exists");
  for (const r of references) {
    assert.ok(r.say.length > 0, `fixture assumption: ${r.slug} has 'say' entries`);
    assert.ok(r.dontSay.length > 0, `fixture assumption: ${r.slug} has 'dontSay' entries`);
  }
});

test("why-these-picks page renders none of the creator-only 'say' lines", () => {
  const text = pageText();
  for (const r of references) {
    for (const line of r.say) {
      assert.doesNotMatch(text, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});

test("why-these-picks page renders none of the creator-only 'dontSay' lines", () => {
  const text = pageText();
  for (const r of references) {
    for (const line of r.dontSay) {
      assert.doesNotMatch(text, new RegExp(line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});

test("why-these-picks page has no link to the noindexed creator-notes page", () => {
  const hrefs = pageHrefs();
  assert.ok(hrefs.length > 0, "sanity: the page renders at least one link");
  assert.ok(
    hrefs.every((href) => !href.includes("creator-notes")),
    `found a link to creator-notes: ${hrefs.filter((h) => h.includes("creator-notes")).join(", ")}`,
  );
});

// ---------------------------------------------------------------------------
// Brand heading: names the shared brand, or falls back when picks differ.
// ---------------------------------------------------------------------------

test('heading names "Thorne" when every current pick shares that brand (real data)', () => {
  const brands = new Set(products.map((p) => p.brand));
  assert.equal(brands.size, 1, "fixture assumption: all real picks currently share one brand");
  assert.match(pageText(), /Why Thorne across all three/);
});

test('heading falls back to "Why these brands" / "this brand" once picks span more than one brand', () => {
  // Temporarily give one real product a different brand, mirroring the
  // withTempProducts pattern in components.test.tsx: mutate in place and
  // always restore in `finally`, rather than forking data.ts.
  const target = products[0];
  const originalBrand = target.brand;
  target.brand = "Some Other Brand";
  try {
    const text = pageText();
    assert.match(text, /Why these brands/);
    assert.match(text, /this brand\s+kept winning the comparison/);
    assert.doesNotMatch(text, /Why Thorne across all three/);
  } finally {
    target.brand = originalBrand;
  }
});

test("card headings show the product's brand and name together", () => {
  const text = pageText();
  for (const r of references) {
    const product = products.find((p) => p.slug === r.slug);
    assert.ok(product, `fixture assumption: a product exists for reference slug ${r.slug}`);
    assert.match(text, new RegExp(`${(product as Product).brand}\\s+${(product as Product).name}`));
  }
});
