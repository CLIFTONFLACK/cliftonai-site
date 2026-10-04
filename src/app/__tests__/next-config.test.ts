import test from "node:test";
import assert from "node:assert/strict";
import nextConfig, { HEALTHY_HOST } from "../../../next.config.ts";
import { getProduct } from "../healthy/data.ts";

type Redirect = { source: string; destination: string; permanent: boolean };

async function redirects(): Promise<Redirect[]> {
  assert.ok(nextConfig.redirects, "next.config.ts must define redirects()");
  return (await nextConfig.redirects()) as Redirect[];
}

const THORNE: Record<string, { to: string; category: string }> = {
  "/healthy/products/thorne-magnesium-glycinate": { to: "pure-encapsulations-magnesium-glycinate", category: "Magnesium" },
  "/healthy/products/thorne-creatine-stick-packs": { to: "pure-encapsulations-creatine", category: "Creatine" },
  "/healthy/products/thorne-theanine": { to: "pure-encapsulations-l-theanine", category: "L-theanine" },
};

test("the new host is the canonical www host of the standalone site", () => {
  assert.equal(HEALTHY_HOST, "https://www.getbrianhealthy.xyz");
});

test("every redirect is permanent and leaves this host", async () => {
  for (const r of await redirects()) {
    assert.equal(r.permanent, true, r.source);
    assert.ok(r.destination.startsWith(HEALTHY_HOST), `${r.source} -> ${r.destination}`);
    assert.ok(r.source.startsWith("/healthy"), r.source);
  }
});

test("retired Thorne slugs go straight to the new site's Pure Encapsulations page in one hop", async () => {
  const rules = await redirects();
  for (const [source, { to }] of Object.entries(THORNE)) {
    const rule = rules.find((r) => r.source === source);
    assert.deepEqual(rule, { source, destination: `${HEALTHY_HOST}/products/${to}`, permanent: true });
  }
});

test("each Thorne redirect keeps the old slug's ingredient and lands on a live product", () => {
  for (const [source, { to, category }] of Object.entries(THORNE)) {
    assert.equal(getProduct(to)?.category, category, source);
  }
});

test("the Thorne rules come before the catch-all, or they would never fire", async () => {
  const sources = (await redirects()).map((r) => r.source);
  const catchAll = sources.indexOf("/healthy/:path*");
  assert.ok(catchAll > 0);
  for (const source of Object.keys(THORNE)) {
    assert.ok(sources.indexOf(source) < catchAll, source);
  }
});

test("static files keep the /healthy/ prefix on the new host, and come before the page catch-all", async () => {
  const rules = await redirects();
  const sources = rules.map((r) => r.source);
  const catchAll = sources.indexOf("/healthy/:path*");
  const assets = rules.filter((r) => r.destination.startsWith(`${HEALTHY_HOST}/healthy/`));
  assert.equal(assets.length, 3);
  for (const rule of assets) {
    assert.ok(sources.indexOf(rule.source) < catchAll, rule.source);
  }
});

test("the page catch-all drops the /healthy prefix and keeps the rest of the path", async () => {
  const rules = await redirects();
  assert.deepEqual(rules.find((r) => r.source === "/healthy"), {
    source: "/healthy",
    destination: HEALTHY_HOST,
    permanent: true,
  });
  assert.deepEqual(rules.find((r) => r.source === "/healthy/:path*"), {
    source: "/healthy/:path*",
    destination: `${HEALTHY_HOST}/:path*`,
    permanent: true,
  });
});
