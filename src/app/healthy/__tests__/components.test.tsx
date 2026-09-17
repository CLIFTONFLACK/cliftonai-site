import test from "node:test";
import assert from "node:assert/strict";
import { AFFILIATE_DISCLOSURE, BuyButton, FdaDisclaimer } from "../components.tsx";
import { buyHref, type Product } from "../data.ts";

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

test("BuyButton label names the product's retailer", () => {
  const product = baseProduct({ retailer: "Acme Supplements" });
  const [link] = children(renderButton(product)) as [{ props: { children: unknown[] } }];
  const visibleText = link.props.children
    .filter((child): child is string => typeof child === "string")
    .join("");
  assert.equal(visibleText, "Check price at Acme Supplements");
});

test("FdaDisclaimer renders the required DSHEA disclaimer text", () => {
  const el = FdaDisclaimer();
  assert.match(
    el.props.children as string,
    /not intended to diagnose, treat, cure, or prevent any disease/,
  );
});
