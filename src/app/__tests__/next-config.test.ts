import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../../../next.config.ts";
import { getProduct, products } from "../healthy/data.ts";

type Redirect = { source: string; destination: string; permanent: boolean };

async function redirects(): Promise<Redirect[]> {
  assert.ok(nextConfig.redirects, "next.config.ts must define redirects()");
  return (await nextConfig.redirects()) as Redirect[];
}

test("retired thorne-magnesium-glycinate redirects permanently to the Pure Encapsulations magnesium page", async () => {
  const rule = (await redirects()).find((r) => r.source === "/healthy/products/thorne-magnesium-glycinate");
  assert.deepEqual(rule, {
    source: "/healthy/products/thorne-magnesium-glycinate",
    destination: "/healthy/products/pure-encapsulations-magnesium-glycinate",
    permanent: true,
  });
});

test("retired thorne-creatine-stick-packs redirects permanently to the Pure Encapsulations creatine page", async () => {
  const rule = (await redirects()).find((r) => r.source === "/healthy/products/thorne-creatine-stick-packs");
  assert.deepEqual(rule, {
    source: "/healthy/products/thorne-creatine-stick-packs",
    destination: "/healthy/products/pure-encapsulations-creatine",
    permanent: true,
  });
});

test("retired thorne-theanine redirects permanently to the Pure Encapsulations L-theanine page", async () => {
  const rule = (await redirects()).find((r) => r.source === "/healthy/products/thorne-theanine");
  assert.deepEqual(rule, {
    source: "/healthy/products/thorne-theanine",
    destination: "/healthy/products/pure-encapsulations-l-theanine",
    permanent: true,
  });
});

test("there are exactly three redirects, one per retired slug", async () => {
  assert.equal((await redirects()).length, 3);
});

test("every redirect destination is a live product page", async () => {
  for (const r of await redirects()) {
    const slug = r.destination.replace("/healthy/products/", "");
    assert.ok(getProduct(slug), `${r.destination} has no product`);
  }
});

test("no redirect source is still a live product slug, so a redirect never hides a real page", async () => {
  const live = new Set(products.map((p) => `/healthy/products/${p.slug}`));
  for (const r of await redirects()) {
    assert.ok(!live.has(r.source), `${r.source} is both a live page and a redirect source`);
  }
});

test("no redirect points at itself", async () => {
  for (const r of await redirects()) {
    assert.notEqual(r.source, r.destination);
  }
});

test("each redirect keeps the old slug's ingredient: the destination is in the same category", async () => {
  const expected: Record<string, string> = {
    "/healthy/products/thorne-magnesium-glycinate": "Magnesium",
    "/healthy/products/thorne-creatine-stick-packs": "Creatine",
    "/healthy/products/thorne-theanine": "L-theanine",
  };
  for (const r of await redirects()) {
    const slug = r.destination.replace("/healthy/products/", "");
    assert.equal(getProduct(slug)?.category, expected[r.source], r.source);
  }
});
