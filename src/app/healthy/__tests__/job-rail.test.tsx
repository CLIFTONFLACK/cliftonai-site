import test from "node:test";
import assert from "node:assert/strict";
import { JobRail } from "../job-rail.tsx";
import { ProductCard } from "../components.tsx";
import { supplementFor, type Product } from "../data.ts";

/**
 * JobRail is a plain function (no hooks), so calling it directly returns the
 * React element tree without needing a renderer — the same approach
 * components.test.tsx uses for BuyButton/ProductCard. Nested elements such as
 * <Reveal> and <ProductCard> are *not* executed by this: JSX only records
 * `{ type, props }`, so we can inspect what JobRail handed them without
 * needing Reveal's hooks or ProductCard's own rendering to work.
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

/** The <ul> of job/card <li>s: JobRail's children are [<p>, <div>], and that
 *  div's children are [rail-line <span>, <ul>]. */
function listItems(el: ReturnType<typeof JobRail>): AnyEl[] {
  const revealChildren = (el.props as { children: AnyEl[] }).children;
  const [, railDiv] = revealChildren;
  const [, ul] = (railDiv.props as { children: AnyEl[] }).children;
  const items = (ul.props as { children: AnyEl[] | AnyEl }).children;
  return Array.isArray(items) ? items : [items];
}

/** A <li>'s children: [node <div>, drop <span>, stud <span>, card-wrapper <div>]. */
function liParts(li: AnyEl) {
  const [nodeDiv, , , cardWrapper] = (li.props as { children: AnyEl[] }).children;
  return { nodeDiv, cardWrapper };
}

/** The node <div>'s children: [number-tile <span>, job fragment]. When
 *  `job` is undefined, `{job && (...)}` evaluates to `undefined` itself
 *  (not `false` — `&&` returns the falsy left operand unchanged), so that's
 *  the "no job" sentinel here, not `false`. */
function jobFragment(nodeDiv: AnyEl): AnyEl | undefined {
  const children = (nodeDiv.props as { children: [AnyEl, AnyEl | undefined] }).children;
  return children[1];
}

function jobTaglineAndName(nodeDiv: AnyEl): { tagline: string; name: string } | null {
  const fragment = jobFragment(nodeDiv);
  if (fragment === undefined) return null;
  const [taglineSpan, nameSpan] = (fragment.props as { children: AnyEl[] }).children;
  return {
    tagline: (taglineSpan.props as { children: string }).children,
    name: (nameSpan.props as { children: string }).children,
  };
}

test("JobRail renders exactly one <li> per product", () => {
  const products = [baseProduct({ slug: "a" }), baseProduct({ slug: "b" }), baseProduct({ slug: "c" })];
  const items = listItems(JobRail({ products }));
  assert.equal(items.length, 3);
});

test("each card's job is derived from that card's own product, not from array position", () => {
  // Deliberately out of the supplements array's own order (magnesium,
  // creatine, l-theanine): l-theanine first, then magnesium, then creatine.
  // A buggy implementation that indexed into `supplements[i]` by position
  // would pair the first card with magnesium's job and the second with
  // creatine's — this pins the correct, product-derived pairing instead.
  const products = [
    baseProduct({ slug: "p-theanine", category: "L-theanine" }),
    baseProduct({ slug: "p-magnesium", category: "Magnesium" }),
    baseProduct({ slug: "p-creatine", category: "Creatine" }),
  ];
  const items = listItems(JobRail({ products }));

  for (let i = 0; i < products.length; i++) {
    const { nodeDiv, cardWrapper } = liParts(items[i]);
    const expected = supplementFor(products[i]);
    assert.ok(expected, `fixture assumption: product ${products[i].slug} has a matching supplement`);
    const job = jobTaglineAndName(nodeDiv);
    assert.ok(job, `expected a job to render for ${products[i].slug}`);
    assert.equal(job!.tagline, expected!.tagline);
    assert.equal(job!.name, expected!.name);

    // And the li's card is still that same product's card, not shuffled.
    const cardEl = (cardWrapper.props as { children: AnyEl }).children;
    assert.equal(cardEl.type, ProductCard);
    assert.equal((cardEl.props as { product: Product }).product.slug, products[i].slug);
  }
});

test("reversing the product order reverses which job each card shows", () => {
  const forward = [
    baseProduct({ slug: "p-magnesium", category: "Magnesium" }),
    baseProduct({ slug: "p-creatine", category: "Creatine" }),
  ];
  const reversed = [...forward].reverse();

  const forwardTaglines = listItems(JobRail({ products: forward })).map(
    (li) => jobTaglineAndName(liParts(li).nodeDiv)!.tagline,
  );
  const reversedTaglines = listItems(JobRail({ products: reversed })).map(
    (li) => jobTaglineAndName(liParts(li).nodeDiv)!.tagline,
  );

  assert.deepEqual(reversedTaglines, [...forwardTaglines].reverse());
});

test("renders no job text for a product whose category has no matching supplement", () => {
  const orphan = baseProduct({
    slug: "orphan",
    category: "Nonexistent" as unknown as Product["category"],
  });
  const items = listItems(JobRail({ products: [orphan] }));
  const { nodeDiv } = liParts(items[0]);
  assert.equal(jobFragment(nodeDiv), undefined);
  assert.equal(jobTaglineAndName(nodeDiv), null);
});

test("each <li> still renders that product's ProductCard even without a job", () => {
  const orphan = baseProduct({ slug: "orphan", category: "Nonexistent" as unknown as Product["category"] });
  const items = listItems(JobRail({ products: [orphan] }));
  const { cardWrapper } = liParts(items[0]);
  const cardEl = (cardWrapper.props as { children: AnyEl }).children;
  assert.equal(cardEl.type, ProductCard);
  assert.equal((cardEl.props as { product: Product }).product.slug, "orphan");
});

test("JobRail renders an empty list for an empty products array", () => {
  const items = listItems(JobRail({ products: [] }));
  assert.deepEqual(items, []);
});
