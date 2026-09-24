import test from "node:test";
import assert from "node:assert/strict";
import {
  AFFILIATE_DISCLOSURE,
  BuyButton,
  FdaDisclaimer,
  GoalChooser,
  ProductCard,
  SupplementCard,
  supplementHref,
} from "../components.tsx";
import { buyHref, getSupplement, goals, products, type Product, type Supplement } from "../data.ts";

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

/**
 * BuyButton takes no hooks and no context, so calling it as a plain function
 * (rather than rendering it to a DOM) returns the React element tree
 * directly — enough to assert on structure without a rendering dependency.
 */
function renderButton(product: Product, from = "product") {
  return BuyButton({ product, from });
}

function children(el: ReturnType<typeof renderButton>): unknown[] {
  const kids = (el.props as { children: unknown }).children;
  return Array.isArray(kids) ? kids : [kids];
}

test("BuyButton always renders the affiliate disclosure paragraph after the link", () => {
  const product = baseProduct({ affiliateUrl: null });
  const [link, disclosure] = children(renderButton(product)) as [
    { type: string; props: Record<string, unknown> },
    { type: string; props: Record<string, unknown> },
  ];
  assert.equal(link.type, "a");
  assert.equal(disclosure.props["data-affiliate-disclosure"], true);
  assert.equal(disclosure.props.children, AFFILIATE_DISCLOSURE);
});

test("BuyButton still renders the disclosure when the link bypasses the redirect", () => {
  // The case the rule exists for: once a product has a direct affiliate
  // link (redirectAllowed programme), the disclosure must not quietly
  // disappear along with the /healthy/go wrapper.
  const product = baseProduct({
    affiliateUrl: "https://affiliate.example.com/x",
    redirectAllowed: false,
  });
  const [, disclosure] = children(renderButton(product)) as [
    unknown,
    { props: Record<string, unknown> },
  ];
  assert.equal(disclosure.props["data-affiliate-disclosure"], true);
});

test("BuyButton link href matches buyHref for the given product and source", () => {
  const product = baseProduct({ slug: "abc", affiliateUrl: null });
  const [link] = children(renderButton(product, "compare-creatine")) as [
    { props: Record<string, unknown> },
  ];
  assert.equal(link.props.href, buyHref(product, "compare-creatine"));
});

test("BuyButton link opens in a new tab with sponsored/nofollow rel", () => {
  const product = baseProduct();
  const [link] = children(renderButton(product)) as [{ props: Record<string, unknown> }];
  assert.equal(link.props.target, "_blank");
  assert.equal(link.props.rel, "sponsored nofollow noopener");
});

test("BuyButton label stays brand-agnostic, naming no retailer", () => {
  // The button used to interpolate product.retailer ("Check price at Acme
  // Supplements"); that field was removed so no brand name is rendered here.
  const product = baseProduct();
  const [link] = children(renderButton(product)) as [{ props: { children: unknown[] } }];
  const visibleText = link.props.children
    .filter((child): child is string => typeof child === "string")
    .join("");
  assert.equal(visibleText, "Check current price");
});

test("FdaDisclaimer renders the required DSHEA disclaimer text", () => {
  const el = FdaDisclaimer();
  assert.match(
    el.props.children as string,
    /not intended to diagnose, treat, cure, or prevent any disease/,
  );
});

// ---------------------------------------------------------------------------
// ProductCard — the "Read the full review" link's icon must not leak into
// its accessible name (icons.tsx's whole reason for existing: see its file
// comment about ligature words like "arrow_forward" being announced).
// ---------------------------------------------------------------------------

test('ProductCard "Read the full review" link has no text besides the label itself (icon excluded)', () => {
  const product = baseProduct({ pros: ["Good"], cons: ["Bad"] });
  const el = ProductCard({ product });
  const articleKids = (el.props as { children: unknown[] }).children;
  const contentDiv = articleKids[articleKids.length - 1] as { props: { children: unknown[] } };
  const readLink = contentDiv.props.children[contentDiv.props.children.length - 1] as {
    props: { children: unknown[] };
  };
  const visibleText = readLink.props.children
    .filter((child): child is string => typeof child === "string")
    .join("");
  assert.equal(visibleText, "Read the full review");
});

// ---------------------------------------------------------------------------
// supplementHref
// ---------------------------------------------------------------------------

/**
 * `products` (from data.ts) is a plain, un-frozen array, like in the
 * /healthy/go route tests. Pushing/removing fixtures and always restoring in
 * `finally` lets these tests exercise pick counts the real product list
 * doesn't currently have, without forking data.ts.
 */
function withTempProducts<T>(temp: Product[], fn: () => T): T {
  for (const p of temp) products.push(p);
  try {
    return fn();
  } finally {
    for (const p of temp) {
      const i = products.indexOf(p);
      if (i !== -1) products.splice(i, 1);
    }
  }
}

test("supplementHref returns the single product page when exactly one pick exists (real data, magnesium)", () => {
  const magnesiumPicks = products.filter((p) => p.category === "Magnesium");
  assert.equal(magnesiumPicks.length, 1, "fixture assumption: exactly one magnesium product exists");
  assert.equal(
    supplementHref(getSupplement("magnesium")),
    `/healthy/products/${magnesiumPicks[0].slug}`,
  );
});

test("supplementHref returns the single product page when exactly one pick exists (real data, creatine)", () => {
  const creatinePicks = products.filter((p) => p.category === "Creatine");
  assert.equal(creatinePicks.length, 1, "fixture assumption: exactly one creatine product exists");
  assert.equal(
    supplementHref(getSupplement("creatine")),
    `/healthy/products/${creatinePicks[0].slug}`,
  );
});

test("supplementHref returns the single product page when exactly one pick exists (real data, l-theanine)", () => {
  const theaninePicks = products.filter((p) => p.category === "L-theanine");
  assert.equal(theaninePicks.length, 1, "fixture assumption: exactly one l-theanine product exists");
  assert.equal(
    supplementHref(getSupplement("l-theanine")),
    `/healthy/products/${theaninePicks[0].slug}`,
  );
});

test("supplementHref returns only the first pick's page once a category grows to more than one pick", () => {
  // The program keeps one pick per category on purpose, so this pins the
  // fallback behavior if a category ever temporarily grows to two.
  const extraMagnesium = baseProduct({ slug: "fixture-magnesium-2", category: "Magnesium" });
  withTempProducts([extraMagnesium], () => {
    const magnesiumPicks = products.filter((p) => p.category === "Magnesium");
    assert.equal(magnesiumPicks.length, 2, "fixture assumption: two magnesium products now exist");
    assert.equal(
      supplementHref(getSupplement("magnesium")),
      `/healthy/products/${magnesiumPicks[0].slug}`,
    );
  });
});

// ---------------------------------------------------------------------------
// GoalChooser
// ---------------------------------------------------------------------------

function listItems(ul: ReturnType<typeof GoalChooser>): unknown[] {
  const kids = (ul.props as { children: unknown }).children;
  return Array.isArray(kids) ? kids : [kids];
}

test("GoalChooser renders exactly one list item per goal", () => {
  const items = listItems(GoalChooser());
  assert.equal(items.length, goals.length);
});

for (const [i, goal] of goals.entries()) {
  test(`GoalChooser link for goal "${goal.id}" points straight at that supplement's review`, () => {
    const items = listItems(GoalChooser()) as { props: { children: { props: Record<string, unknown> } } }[];
    const anchor = items[i].props.children;
    const s = getSupplement(goal.supplement);
    const review = supplementHref(s);
    // A goal with a `section` lands on that part of the review (focus lands on creatine's caveat).
    const expected = review ? (goal.section ? `${review}#${goal.section}` : review) : `#${s.id}`;
    assert.equal(anchor.props.href, expected);
  });

  test(`GoalChooser tile for goal "${goal.id}" shows its own label and hook text`, () => {
    // items[i].props.children is the <li>'s single child, the Link itself.
    // The Link's own children: [background Image, gradient overlay div, content div].
    // Content div children: [icon chip, eyebrow, label, hook, CTA].
    const items = listItems(GoalChooser()) as { props: { children: { props: { children: unknown[] } } } }[];
    const anchor = items[i].props.children;
    const anchorChildren = anchor.props.children;
    const contentDiv = anchorChildren[2] as { props: { children: { props: { children: unknown } }[] } };
    const [, , labelSpan, hookParagraph] = contentDiv.props.children;
    assert.equal(labelSpan.props.children, goal.label);
    assert.equal(hookParagraph.props.children, goal.hook);
  });
}

/**
 * Concrete hrefs against the real data, rather than re-deriving the
 * implementation's own href formula (the loop above does that, and would
 * pass even if both GoalChooser and the test flipped the same bug the same
 * way). These pin the actual strings a shopper's browser would navigate to.
 */
test('GoalChooser "focus" goal links to the creatine review with a #creatine anchor', () => {
  const items = listItems(GoalChooser()) as { props: { children: { props: Record<string, unknown> } } }[];
  const focusIndex = goals.findIndex((g) => g.id === "focus");
  const anchor = items[focusIndex].props.children;
  assert.equal(anchor.props.href, "/healthy/products/thorne-creatine-stick-packs#creatine");
});

test('GoalChooser "strength" goal links to the same creatine review with no hash', () => {
  const items = listItems(GoalChooser()) as { props: { children: { props: Record<string, unknown> } } }[];
  const strengthIndex = goals.findIndex((g) => g.id === "strength");
  const anchor = items[strengthIndex].props.children;
  assert.equal(anchor.props.href, "/healthy/products/thorne-creatine-stick-packs");
});

test('GoalChooser "energy" goal links to the magnesium review with no hash', () => {
  const items = listItems(GoalChooser()) as { props: { children: { props: Record<string, unknown> } } }[];
  const energyIndex = goals.findIndex((g) => g.id === "energy");
  const anchor = items[energyIndex].props.children;
  assert.equal(anchor.props.href, "/healthy/products/thorne-magnesium-glycinate");
});

test('GoalChooser "calm" goal links to the l-theanine review with no hash', () => {
  const items = listItems(GoalChooser()) as { props: { children: { props: Record<string, unknown> } } }[];
  const calmIndex = goals.findIndex((g) => g.id === "calm");
  const anchor = items[calmIndex].props.children;
  assert.equal(anchor.props.href, "/healthy/products/thorne-theanine");
});

// ---------------------------------------------------------------------------
// SupplementCard
// ---------------------------------------------------------------------------

function articleChildren(el: ReturnType<typeof SupplementCard>): unknown[] {
  const kids = (el.props as { children: unknown }).children;
  return Array.isArray(kids) ? kids : [kids];
}

function baseSupplement(overrides: Partial<Supplement> = {}): Supplement {
  return {
    id: "magnesium",
    name: "Fixture Supplement",
    tagline: "Fixture tagline",
    value: "Fixture value.",
    role: "Fixture role",
    contribution: "Fixture contribution.",
    category: null,
    ...overrides,
  };
}

test("SupplementCard renders the caveat when the supplement has one", () => {
  const el = SupplementCard({ supplement: getSupplement("creatine") });
  const [, dl] = articleChildren(el) as [unknown, { props: { children: unknown[] } }];
  const [, contributionDiv] = dl.props.children as { props: { children: unknown[] } }[];
  const [, , caveatDd] = contributionDiv.props.children as [unknown, unknown, { props: { children: unknown[] } }];
  assert.ok(caveatDd, "expected a caveat <dd> to render");
  const caveatText = caveatDd.props.children
    .map((child) => (typeof child === "string" ? child : (child as { props: { children: string } }).props.children))
    .join("");
  assert.match(caveatText, /Honest caveat:/);
  assert.match(caveatText, /Cognitive benefits are promising/);
});

test("SupplementCard does not render a caveat when the supplement has none", () => {
  const el = SupplementCard({ supplement: getSupplement("magnesium") });
  const [, dl] = articleChildren(el) as [unknown, { props: { children: unknown[] } }];
  const [, contributionDiv] = dl.props.children as { props: { children: unknown[] } }[];
  const caveatDd = (contributionDiv.props.children as unknown[])[2];
  assert.equal(caveatDd, undefined);
});

test("SupplementCard shows the in-progress message when there is no pick", () => {
  // Every real supplement now has a pick, so a fixture with a null category
  // is what exercises the "no pick yet" branch.
  const el = SupplementCard({ supplement: baseSupplement({ category: null }) });
  const [, , footer] = articleChildren(el) as [unknown, unknown, { type: string; props: { children: string } }];
  assert.equal(footer.type, "p");
  assert.match(footer.props.children, /review is in progress/);
});

test("SupplementCard renders a link instead of the in-progress message when a pick exists", () => {
  const el = SupplementCard({ supplement: getSupplement("magnesium") });
  const [, , footer] = articleChildren(el) as [unknown, unknown, { type: string; props: { href: string } }];
  assert.equal(footer.type, "a");
  assert.equal(footer.props.href, supplementHref(getSupplement("magnesium")));
});

test("SupplementCard link names the supplement for a creatine review", () => {
  const el = SupplementCard({ supplement: getSupplement("creatine") });
  const [, , footer] = articleChildren(el) as [unknown, unknown, { props: { children: unknown[] } }];
  assert.equal(footer.props.children.join(""), "Read the creatine review");
});

test("SupplementCard link names the supplement for a non-creatine review", () => {
  const el = SupplementCard({ supplement: getSupplement("magnesium") });
  const [, , footer] = articleChildren(el) as [unknown, unknown, { props: { children: unknown[] } }];
  assert.equal(footer.props.children.join(""), "Read the magnesium review");
});

test("SupplementCard uses the supplement id as the section anchor", () => {
  const supplement = baseSupplement({ id: "l-theanine" });
  const el = SupplementCard({ supplement });
  assert.equal((el.props as { id: string }).id, "l-theanine");
});
