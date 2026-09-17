import test from "node:test";
import assert from "node:assert/strict";
import {
  buyHref,
  costPerServing,
  getProduct,
  getSupplement,
  goals,
  outboundUrl,
  products,
  supplementFor,
  supplements,
  TAGLINE,
  usesRedirect,
  type Product,
  type Supplement,
} from "../data.ts";

/** A minimal, valid product used as a base for one-field-changed fixtures. */
function baseProduct(overrides: Partial<Product> = {}): Product {
  return {
    slug: "fixture-product",
    name: "Fixture Product",
    brand: "Fixture Brand",
    category: "Creatine",
    format: "Powder",
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
    retailer: "Fixture Retailer",
    lastReviewed: null,
    verified: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// getProduct
// ---------------------------------------------------------------------------

test("getProduct returns the matching product for a known slug", () => {
  const product = getProduct("california-gold-creatine");
  assert.equal(product?.slug, "california-gold-creatine");
});

test("getProduct returns undefined for an unknown slug", () => {
  assert.equal(getProduct("does-not-exist"), undefined);
});

test("getProduct returns undefined for an empty string slug", () => {
  assert.equal(getProduct(""), undefined);
});

test("getProduct is case sensitive (does not loosely match)", () => {
  assert.equal(getProduct("CALIFORNIA-GOLD-CREATINE"), undefined);
});

// ---------------------------------------------------------------------------
// costPerServing
// ---------------------------------------------------------------------------

test("costPerServing divides price by servings when both are known", () => {
  const product = baseProduct({ priceUsd: 24.99, servingsPerContainer: 30 });
  assert.equal(costPerServing(product), 24.99 / 30);
});

test("costPerServing returns null when priceUsd is null", () => {
  const product = baseProduct({ priceUsd: null, servingsPerContainer: 30 });
  assert.equal(costPerServing(product), null);
});

test("costPerServing returns null when servingsPerContainer is null", () => {
  const product = baseProduct({ priceUsd: 10, servingsPerContainer: null });
  assert.equal(costPerServing(product), null);
});

test("costPerServing returns null when servingsPerContainer is zero", () => {
  // Zero servings would otherwise divide by zero (Infinity); the function
  // must treat it the same as "unknown", per its `!p.servingsPerContainer`
  // guard.
  const product = baseProduct({ priceUsd: 10, servingsPerContainer: 0 });
  assert.equal(costPerServing(product), null);
});

test("costPerServing handles a single serving (boundary of one)", () => {
  const product = baseProduct({ priceUsd: 5, servingsPerContainer: 1 });
  assert.equal(costPerServing(product), 5);
});

test("costPerServing treats a zero price as known, not unverified", () => {
  const product = baseProduct({ priceUsd: 0, servingsPerContainer: 10 });
  assert.equal(costPerServing(product), 0);
});

// ---------------------------------------------------------------------------
// outboundUrl
// ---------------------------------------------------------------------------

test("outboundUrl returns the affiliate URL when one is set", () => {
  const product = baseProduct({
    brandUrl: "https://brand.example.com",
    affiliateUrl: "https://affiliate.example.com",
  });
  assert.equal(outboundUrl(product), "https://affiliate.example.com");
});

test("outboundUrl falls back to the brand URL when there is no affiliate URL", () => {
  const product = baseProduct({ brandUrl: "https://brand.example.com", affiliateUrl: null });
  assert.equal(outboundUrl(product), "https://brand.example.com");
});

// ---------------------------------------------------------------------------
// usesRedirect
// ---------------------------------------------------------------------------

test("usesRedirect is true when there is no affiliate link yet", () => {
  const product = baseProduct({ affiliateUrl: null, redirectAllowed: false });
  assert.equal(usesRedirect(product), true);
});

test("usesRedirect is true when the affiliate programme allows redirects", () => {
  const product = baseProduct({
    affiliateUrl: "https://affiliate.example.com",
    redirectAllowed: true,
  });
  assert.equal(usesRedirect(product), true);
});

test("usesRedirect is false when the affiliate programme forbids redirects", () => {
  const product = baseProduct({
    affiliateUrl: "https://affiliate.example.com",
    redirectAllowed: false,
  });
  assert.equal(usesRedirect(product), false);
});

// ---------------------------------------------------------------------------
// buyHref
// ---------------------------------------------------------------------------

test("buyHref points at the /healthy/go redirect while there is no affiliate link", () => {
  const product = baseProduct({ slug: "no-affiliate-yet", affiliateUrl: null });
  assert.equal(buyHref(product, "product"), "/healthy/go/no-affiliate-yet?from=product");
});

test("buyHref points at the /healthy/go redirect when the programme allows it", () => {
  const product = baseProduct({
    slug: "allowed-redirect",
    affiliateUrl: "https://affiliate.example.com",
    redirectAllowed: true,
  });
  assert.equal(buyHref(product, "compare-creatine"), "/healthy/go/allowed-redirect?from=compare-creatine");
});

test("buyHref links directly to the affiliate URL when the programme forbids the redirect", () => {
  const product = baseProduct({
    affiliateUrl: "https://affiliate.example.com/aff123",
    redirectAllowed: false,
  });
  assert.equal(buyHref(product, "product"), "https://affiliate.example.com/aff123");
});

// ---------------------------------------------------------------------------
// products data invariants
// ---------------------------------------------------------------------------

const DISEASE_CLAIM_WORDS = ["treat", "cure", "prevent", "reverse", "diagnose"];

function findDiseaseClaimWord(text: string): string | undefined {
  const lower = text.toLowerCase();
  return DISEASE_CLAIM_WORDS.find((word) => lower.includes(word));
}

test("every product slug is unique", () => {
  const slugs = products.map((p) => p.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  assert.deepEqual(duplicates, []);
});

test("at least one product is defined", () => {
  assert.ok(products.length > 0);
});

for (const product of products) {
  test(`product "${product.slug}" has an https brandUrl`, () => {
    assert.match(product.brandUrl, /^https:\/\//);
  });

  test(`product "${product.slug}" summary has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(product.summary), undefined);
  });

  test(`product "${product.slug}" verdict has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(product.verdict), undefined);
  });

  for (const ev of product.evidence) {
    test(`product "${product.slug}" evidence claim "${ev.claim}" has no disease-claim words`, () => {
      assert.equal(findDiseaseClaimWord(ev.claim), undefined);
    });

    test(`product "${product.slug}" evidence summary for "${ev.claim}" has no disease-claim words`, () => {
      assert.equal(findDiseaseClaimWord(ev.summary), undefined);
    });
  }
}

// ---------------------------------------------------------------------------
// getSupplement
// ---------------------------------------------------------------------------

test("getSupplement returns the matching supplement for a known id", () => {
  assert.equal(getSupplement("creatine").id, "creatine");
});

test("getSupplement throws for an unknown id", () => {
  assert.throws(
    () => getSupplement("vitamin-d" as Supplement["id"]),
    /Unknown supplement: vitamin-d/,
  );
});

test("getSupplement throws for an empty string id", () => {
  assert.throws(() => getSupplement("" as Supplement["id"]), /Unknown supplement: /);
});

test("getSupplement is case sensitive (does not loosely match)", () => {
  assert.throws(() => getSupplement("CREATINE" as Supplement["id"]));
});

// ---------------------------------------------------------------------------
// goals <-> supplements invariants
// ---------------------------------------------------------------------------

test("every goal id is unique", () => {
  const ids = goals.map((g) => g.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(duplicates, []);
});

test("every supplement id is unique", () => {
  const ids = supplements.map((s) => s.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(duplicates, []);
});

for (const goal of goals) {
  test(`goal "${goal.id}" supplement ("${goal.supplement}") resolves via getSupplement`, () => {
    const s = getSupplement(goal.supplement);
    assert.equal(s.id, goal.supplement);
  });
}

test("every supplement is used by at least one goal", () => {
  const usedIds = new Set(goals.map((g) => g.supplement));
  const unused = supplements.filter((s) => !usedIds.has(s.id)).map((s) => s.id);
  assert.deepEqual(unused, []);
});

// ---------------------------------------------------------------------------
// supplements <-> products (category) invariants
// ---------------------------------------------------------------------------

const categorizedSupplements = supplements.filter((s) => s.category !== null);

test("at least one supplement has a non-null category (sanity check for the loop below)", () => {
  assert.ok(categorizedSupplements.length > 0);
});

for (const supplement of categorizedSupplements) {
  test(`supplement "${supplement.id}" has at least one product in category "${supplement.category}"`, () => {
    const matches = products.filter((p) => p.category === supplement.category);
    assert.ok(matches.length > 0);
  });
}

test("supplementFor returns the creatine supplement for a creatine product", () => {
  const product = products.find((p) => p.category === "Creatine");
  assert.ok(product, "fixture assumption: a creatine product exists");
  assert.equal(supplementFor(product as Product), getSupplement("creatine"));
});

test("supplementFor returns the magnesium supplement for a magnesium product", () => {
  const product = products.find((p) => p.category === "Magnesium");
  assert.ok(product, "fixture assumption: a magnesium product exists");
  assert.equal(supplementFor(product as Product), getSupplement("magnesium"));
});

test("supplementFor returns undefined when no supplement matches the product's category", () => {
  // Every real category currently has a matching supplement, so this removes
  // the magnesium supplement temporarily (mirroring the withTempProduct
  // pattern used in the /healthy/go route tests) to exercise the "no match"
  // branch without inventing a category value outside the Product type.
  const magnesiumSupplement = getSupplement("magnesium");
  const idx = supplements.indexOf(magnesiumSupplement);
  supplements.splice(idx, 1);
  try {
    const product = products.find((p) => p.category === "Magnesium");
    assert.ok(product, "fixture assumption: a magnesium product exists");
    assert.equal(supplementFor(product as Product), undefined);
  } finally {
    supplements.splice(idx, 0, magnesiumSupplement);
  }
});

// ---------------------------------------------------------------------------
// Compliance guards on the goal-chooser / supplement copy
// ---------------------------------------------------------------------------

const BANNED_MARKETING_WORDS = [
  "leverage",
  "synergy",
  "revolutioni", // catches both "revolutionise" and "revolutionize"
  "cutting-edge",
  "game-changing",
  "unlock",
  "seamless",
  "disrupt",
  "solutioning",
];

const BRITISH_SPELLINGS = ["ageing", "signalling"];

function findBannedWord(text: string): string | undefined {
  const lower = text.toLowerCase();
  return BANNED_MARKETING_WORDS.find((word) => lower.includes(word));
}

function findBritishSpelling(text: string): string | undefined {
  const lower = text.toLowerCase();
  return BRITISH_SPELLINGS.find((word) => lower.includes(word));
}

test("TAGLINE has no disease-claim words", () => {
  assert.equal(findDiseaseClaimWord(TAGLINE), undefined);
});

test("TAGLINE has no banned marketing words", () => {
  assert.equal(findBannedWord(TAGLINE), undefined);
});

test("TAGLINE uses US spelling", () => {
  assert.equal(findBritishSpelling(TAGLINE), undefined);
});

for (const supplement of supplements) {
  test(`supplement "${supplement.id}" role has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(supplement.role), undefined);
  });

  test(`supplement "${supplement.id}" role has no banned marketing words`, () => {
    assert.equal(findBannedWord(supplement.role), undefined);
  });

  test(`supplement "${supplement.id}" role uses US spelling`, () => {
    assert.equal(findBritishSpelling(supplement.role), undefined);
  });

  test(`supplement "${supplement.id}" contribution has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(supplement.contribution), undefined);
  });

  test(`supplement "${supplement.id}" contribution has no banned marketing words`, () => {
    assert.equal(findBannedWord(supplement.contribution), undefined);
  });

  test(`supplement "${supplement.id}" contribution uses US spelling`, () => {
    assert.equal(findBritishSpelling(supplement.contribution), undefined);
  });
}

const supplementsWithCaveat = supplements.filter((s) => s.caveat);

test("at least one supplement has a caveat (sanity check for the loop below)", () => {
  assert.ok(supplementsWithCaveat.length > 0);
});

for (const supplement of supplementsWithCaveat) {
  test(`supplement "${supplement.id}" caveat has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(supplement.caveat as string), undefined);
  });

  test(`supplement "${supplement.id}" caveat has no banned marketing words`, () => {
    assert.equal(findBannedWord(supplement.caveat as string), undefined);
  });

  test(`supplement "${supplement.id}" caveat uses US spelling`, () => {
    assert.equal(findBritishSpelling(supplement.caveat as string), undefined);
  });
}

for (const goal of goals) {
  test(`goal "${goal.id}" label has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(goal.label), undefined);
  });

  test(`goal "${goal.id}" label has no banned marketing words`, () => {
    assert.equal(findBannedWord(goal.label), undefined);
  });

  test(`goal "${goal.id}" label uses US spelling`, () => {
    assert.equal(findBritishSpelling(goal.label), undefined);
  });

  test(`goal "${goal.id}" hook has no disease-claim words`, () => {
    assert.equal(findDiseaseClaimWord(goal.hook), undefined);
  });

  test(`goal "${goal.id}" hook has no banned marketing words`, () => {
    assert.equal(findBannedWord(goal.hook), undefined);
  });

  test(`goal "${goal.id}" hook uses US spelling`, () => {
    assert.equal(findBritishSpelling(goal.hook), undefined);
  });
}

const focusOrCognitiveSupplements = supplements.filter(
  (s) => s.role.toLowerCase().includes("focus") || s.role.toLowerCase().includes("cognitive"),
);

test("at least one supplement's role mentions focus or cognitive (sanity check for the loop below)", () => {
  assert.ok(focusOrCognitiveSupplements.length > 0);
});

for (const supplement of focusOrCognitiveSupplements) {
  test(`supplement "${supplement.id}" has a non-empty caveat because its role mentions focus/cognitive`, () => {
    assert.ok(supplement.caveat && supplement.caveat.trim().length > 0);
  });
}
