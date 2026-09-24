import test from "node:test";
import assert from "node:assert/strict";
import { JobRail } from "../job-rail.tsx";
import { ProductCard } from "../components.tsx";
import { Icon } from "../icons.tsx";
import { goals, type Product } from "../data.ts";

/**
 * JobRail is a plain function (no hooks), so calling it directly returns the
 * React element tree without needing a renderer — the same approach
 * components.test.tsx uses for BuyButton/ProductCard. Nested elements such as
 * <RailReveal> and <ProductCard> are *not* executed by this: JSX only records
 * `{ type, props }`, so we can inspect what JobRail handed them without
 * needing RailReveal's hooks or ProductCard's own rendering to work.
 */
function baseProduct(overrides: Partial<Product> = {}): Product {
  return {
    slug: "fixture-product",
    name: "Fixture Product",
    brand: "Fixture Brand",
    category: "Creatine",
    format: "Powder",
    image: null,
    imageAlt: "",
    summary: "A fixture product for tests.",
    verdict: "It is a fixture.",
    bestFor: [],
    notFor: [],
    servingSize: null,
    servingsPerContainer: null,
    ingredients: [],
    priceUsd: null,
    priceCheckedAt: null,
    testing: [],
    evidence: [],
    safety: [],
    pros: [],
    cons: [],
    brandUrl: "https://brand.example.com",
    affiliateUrl: null,
    redirectAllowed: false,
    lastReviewed: null,
    verified: false,
    ...overrides,
  };
}

type AnyEl = { type: unknown; props: Record<string, unknown> };

/** The <ul> of job/card <li>s: RailReveal's only child is the rail <div>,
 *  whose children are [rail-line <span>, <ul>] (the "One job each" label
 *  <p> that used to sit above the rail is gone). */
function listItems(el: ReturnType<typeof JobRail>): AnyEl[] {
  const railDiv = (el.props as { children: AnyEl }).children;
  const [, ul] = (railDiv.props as { children: AnyEl[] }).children;
  const items = (ul.props as { children: AnyEl[] | AnyEl }).children;
  return Array.isArray(items) ? items : [items];
}

/** A <li>'s children: [node <div>, drop <span>, stud <span>, card-wrapper <div>]. */
function liParts(li: AnyEl) {
  const [nodeDiv, , , cardWrapper] = (li.props as { children: AnyEl[] }).children;
  return { nodeDiv, cardWrapper };
}

/** The node <div>'s children: [icon/number tile <span>, job fragment]. When
 *  `job` is undefined, `{job && (...)}` evaluates to `undefined` itself
 *  (not `false` — `&&` returns the falsy left operand unchanged), so that's
 *  the "no job" sentinel here, not `false`. */
function jobFragment(nodeDiv: AnyEl): AnyEl | undefined {
  const children = (nodeDiv.props as { children: [AnyEl, AnyEl | undefined] }).children;
  return children[1];
}

/** The icon/number tile <span>'s single child: either an <Icon> element
 *  (when a lead goal exists) or the "01"-style fallback string. */
function tileContent(nodeDiv: AnyEl): AnyEl | string {
  const [tileSpan] = (nodeDiv.props as { children: [AnyEl, AnyEl | undefined] }).children;
  return (tileSpan.props as { children: AnyEl | string }).children;
}

type JobParts = { heading: string; name: string; alsoLines: string[] };

/** Reads the job fragment's three children: heading <span>, supplement name
 *  <span>, and the `also.map(...)` array of "+ Label[: caveat]" <span>s (the
 *  array is empty, not absent, when there's only one goal). Each "+" span's
 *  children are ["+ ", label, caveat-string-or-""], joined here into one
 *  string so tests can assert on the whole line. */
function jobParts(nodeDiv: AnyEl): JobParts | null {
  const fragment = jobFragment(nodeDiv);
  if (fragment === undefined) return null;
  const [headingSpan, nameSpan, alsoArray] = (fragment.props as { children: [AnyEl, AnyEl, AnyEl[]] })
    .children;
  const alsoLines = alsoArray.map((span) => {
    const parts = (span.props as { children: (string | undefined)[] }).children;
    return parts.join("");
  });
  return {
    heading: (headingSpan.props as { children: string }).children,
    name: (nameSpan.props as { children: string }).children,
    alsoLines,
  };
}

test("JobRail renders exactly one <li> per product, each with that product's ProductCard", () => {
  const products = [baseProduct({ slug: "a" }), baseProduct({ slug: "b" }), baseProduct({ slug: "c" })];
  const items = listItems(JobRail({ products }));
  assert.equal(items.length, 3);
  items.forEach((li, i) => {
    const { cardWrapper } = liParts(li);
    const cardEl = (cardWrapper.props as { children: AnyEl }).children;
    assert.equal(cardEl.type, ProductCard);
    assert.equal((cardEl.props as { product: Product }).product.slug, products[i].slug);
  });
});

test("each card's goal is derived from that card's own product, not from array position", () => {
  // Deliberately out of the goals array's own order (energy/magnesium,
  // strength+focus/creatine, calm/l-theanine): l-theanine first, then
  // magnesium, then creatine. Deriving by index (goals[i] or supplements[i])
  // would pair the first card with the wrong goal; this pins the correct,
  // product-derived pairing instead.
  const products = [
    baseProduct({ slug: "p-theanine", category: "L-theanine" }),
    baseProduct({ slug: "p-magnesium", category: "Magnesium" }),
    baseProduct({ slug: "p-creatine", category: "Creatine" }),
  ];
  const items = listItems(JobRail({ products }));

  const expectedHeadings = ["Calm", "Energy", "Strength"];
  for (let i = 0; i < products.length; i++) {
    const { nodeDiv } = liParts(items[i]);
    const job = jobParts(nodeDiv);
    assert.ok(job, `expected a job to render for ${products[i].slug}`);
    assert.equal(job!.heading, expectedHeadings[i]);
  }
});

test("reversing the product order reverses which goal each card shows", () => {
  const forward = [
    baseProduct({ slug: "p-magnesium", category: "Magnesium" }),
    baseProduct({ slug: "p-creatine", category: "Creatine" }),
  ];
  const reversed = [...forward].reverse();

  const forwardHeadings = listItems(JobRail({ products: forward })).map(
    (li) => jobParts(liParts(li).nodeDiv)!.heading,
  );
  const reversedHeadings = listItems(JobRail({ products: reversed })).map(
    (li) => jobParts(liParts(li).nodeDiv)!.heading,
  );

  assert.deepEqual(reversedHeadings, [...forwardHeadings].reverse());
});

test("creatine leads with Strength (no caveat) and names Focus beneath with its caveat attached", () => {
  const products = [baseProduct({ slug: "p-creatine", category: "Creatine" })];
  const items = listItems(JobRail({ products }));
  const { nodeDiv } = liParts(items[0]);

  const strengthGoal = goals.find((g) => g.id === "strength")!;
  const focusGoal = goals.find((g) => g.id === "focus")!;
  assert.equal(strengthGoal.caveat, undefined, "fixture assumption: strength has no caveat");
  assert.ok(focusGoal.caveat, "fixture assumption: focus has a caveat");

  const job = jobParts(nodeDiv);
  assert.ok(job);
  assert.equal(job!.heading, "Strength");
  assert.equal(job!.name, "Creatine");
  assert.deepEqual(job!.alsoLines, [`+ Focus: ${focusGoal.caveat}`]);

  const tile = tileContent(nodeDiv);
  assert.equal((tile as AnyEl).type, Icon);
  assert.equal(((tile as AnyEl).props as { name: string }).name, strengthGoal.icon);
});

test("a supplement with a single goal shows no '+' line", () => {
  const products = [baseProduct({ slug: "p-magnesium", category: "Magnesium" })];
  const items = listItems(JobRail({ products }));
  const { nodeDiv } = liParts(items[0]);

  const job = jobParts(nodeDiv);
  assert.ok(job);
  assert.equal(job!.heading, "Energy");
  assert.equal(job!.name, "Magnesium");
  assert.deepEqual(job!.alsoLines, []);
});

test("renders no goal text for a product whose category has no matching supplement, but still its card", () => {
  const orphan = baseProduct({
    slug: "orphan",
    category: "Nonexistent" as unknown as Product["category"],
  });
  const items = listItems(JobRail({ products: [orphan] }));
  const { nodeDiv, cardWrapper } = liParts(items[0]);

  assert.equal(jobFragment(nodeDiv), undefined);
  assert.equal(jobParts(nodeDiv), null);
  assert.equal(tileContent(nodeDiv), "01");

  const cardEl = (cardWrapper.props as { children: AnyEl }).children;
  assert.equal(cardEl.type, ProductCard);
  assert.equal((cardEl.props as { product: Product }).product.slug, "orphan");
});

test("JobRail renders an empty list for an empty products array", () => {
  const items = listItems(JobRail({ products: [] }));
  assert.deepEqual(items, []);
});
