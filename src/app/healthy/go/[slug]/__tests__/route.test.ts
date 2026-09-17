import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { GET } from "../route.ts";
import { products, type Product } from "../../../data.ts";

/** Builds the RouteContext the real Next.js runtime would pass in. */
function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) } as unknown as Parameters<typeof GET>[1];
}

function request(url: string) {
  return new Request(url);
}

/**
 * `products` (from data.ts) is a plain, un-frozen array. Pushing a fixture
 * onto it and always removing it in `finally` lets these tests exercise
 * affiliateUrl/redirectAllowed combinations the real product list doesn't
 * currently contain (every real product still has affiliateUrl: null),
 * without needing to fork data.ts or mock the whole module.
 */
async function withTempProduct<T>(product: Product, fn: () => Promise<T>): Promise<T> {
  products.push(product);
  try {
    return await fn();
  } finally {
    const i = products.indexOf(product);
    if (i !== -1) products.splice(i, 1);
  }
}

// ---------------------------------------------------------------------------
// Unknown slug
// ---------------------------------------------------------------------------

test("returns 404 for a slug that matches no product", async () => {
  const res = await GET(request("https://x.test/healthy/go/does-not-exist"), ctx("does-not-exist"));
  assert.equal(res.status, 404);
});

test("returns 404 for an empty slug", async () => {
  const res = await GET(request("https://x.test/healthy/go/"), ctx(""));
  assert.equal(res.status, 404);
});

test("404 response sets no-store and noindex headers", async () => {
  const res = await GET(request("https://x.test/healthy/go/does-not-exist"), ctx("does-not-exist"));
  assert.equal(res.headers.get("Cache-Control"), "no-store");
  assert.equal(res.headers.get("X-Robots-Tag"), "noindex");
});

// ---------------------------------------------------------------------------
// Known product, no affiliate link yet (real current data state)
// ---------------------------------------------------------------------------

test("redirects to the brand URL for a real product with no affiliate link", async () => {
  const product = products[0];
  assert.equal(product.affiliateUrl, null, "fixture assumption: product has no affiliate link");
  const res = await GET(
    request(`https://x.test/healthy/go/${product.slug}`),
    ctx(product.slug),
  );
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("Location"), product.brandUrl);
});

test("302 response sets no-store, noindex/nofollow and a strict referrer policy", async () => {
  const product = products[0];
  const res = await GET(request(`https://x.test/healthy/go/${product.slug}`), ctx(product.slug));
  assert.equal(res.headers.get("Cache-Control"), "no-store");
  assert.equal(res.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.equal(res.headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
});

// ---------------------------------------------------------------------------
// Approved affiliate link: redirectAllowed false vs true
// ---------------------------------------------------------------------------

test("returns 404 when the affiliate link is live and the programme forbids redirects", async () => {
  const product: Product = {
    ...products[0],
    slug: "test-fixture-forbidden-redirect",
    affiliateUrl: "https://affiliate.example.com/forbidden",
    redirectAllowed: false,
  };
  await withTempProduct(product, async () => {
    const res = await GET(
      request(`https://x.test/healthy/go/${product.slug}`),
      ctx(product.slug),
    );
    assert.equal(res.status, 404);
  });
});

test("redirects to the affiliate URL when the programme allows redirects", async () => {
  const product: Product = {
    ...products[0],
    slug: "test-fixture-allowed-redirect",
    affiliateUrl: "https://affiliate.example.com/allowed",
    redirectAllowed: true,
  };
  await withTempProduct(product, async () => {
    const res = await GET(
      request(`https://x.test/healthy/go/${product.slug}`),
      ctx(product.slug),
    );
    assert.equal(res.status, 302);
    assert.equal(res.headers.get("Location"), "https://affiliate.example.com/allowed");
  });
});

// ---------------------------------------------------------------------------
// Open-redirect attempts via the query string
// ---------------------------------------------------------------------------

test("ignores an attacker-supplied redirect target in the query string", async () => {
  const product = products[0];
  const res = await GET(
    request(`https://x.test/healthy/go/${product.slug}?redirect=https://evil.example.com`),
    ctx(product.slug),
  );
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("Location"), product.brandUrl);
});

test("ignores an attacker-supplied 'from' value shaped like a URL", async () => {
  const product = products[0];
  const res = await GET(
    request(`https://x.test/healthy/go/${product.slug}?from=https://evil.example.com`),
    ctx(product.slug),
  );
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("Location"), product.brandUrl);
});

test("the slug itself cannot be used to reach an unintended product via path tricks", async () => {
  // A slug with a path-traversal-shaped value simply doesn't match any
  // product, so it 404s rather than resolving to something unexpected.
  const res = await GET(
    request("https://x.test/healthy/go/../other-product"),
    ctx("../other-product"),
  );
  assert.equal(res.status, 404);
});

// ---------------------------------------------------------------------------
// `from` query param sanitisation / logging allow-list
// ---------------------------------------------------------------------------

test("logs an allow-listed 'from' value as-is", async (t) => {
  const info = t.mock.method(console, "info", () => {});
  const product = products[0];
  await GET(request(`https://x.test/healthy/go/${product.slug}?from=product`), ctx(product.slug));
  assert.equal(info.mock.callCount(), 1);
  const logged = JSON.parse(info.mock.calls[0].arguments[0] as string);
  assert.equal(logged.from, "product");
  assert.equal(logged.slug, product.slug);
});

test("logs 'unknown' for a 'from' value that is not in the allow-list", async (t) => {
  const info = t.mock.method(console, "info", () => {});
  const product = products[0];
  await GET(
    request(`https://x.test/healthy/go/${product.slug}?from=<script>alert(1)</script>`),
    ctx(product.slug),
  );
  const logged = JSON.parse(info.mock.calls[0].arguments[0] as string);
  assert.equal(logged.from, "unknown");
});

test("logs 'unknown' when 'from' is missing entirely", async (t) => {
  const info = t.mock.method(console, "info", () => {});
  const product = products[0];
  await GET(request(`https://x.test/healthy/go/${product.slug}`), ctx(product.slug));
  const logged = JSON.parse(info.mock.calls[0].arguments[0] as string);
  assert.equal(logged.from, "unknown");
});

test("does not log anything for a 404 (unknown slug)", async (t) => {
  const info = t.mock.method(console, "info", () => {});
  await GET(request("https://x.test/healthy/go/does-not-exist"), ctx("does-not-exist"));
  assert.equal(info.mock.callCount(), 0);
});
