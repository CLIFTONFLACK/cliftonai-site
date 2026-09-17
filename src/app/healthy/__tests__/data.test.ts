import test from "node:test";
import assert from "node:assert/strict";
import {
  buyHref,
  costPerServing,
  getProduct,
  outboundUrl,
  products,
  usesRedirect,
  type Product,
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
