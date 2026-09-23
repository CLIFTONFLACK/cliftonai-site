import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

// sitemap.ts pulls in layout.tsx for `siteUrl`, and layout.tsx pulls in
// next/font/google and a global .css import — neither of which can run
// outside Next's own build pipeline. Since the only thing sitemap.ts
// actually needs from layout.tsx is the `siteUrl` string constant, that
// module is replaced with a stub via node:test's module mocking rather than
// loaded for real. This needs --experimental-test-module-mocks (see the
// "test" script in package.json).
const FAKE_SITE_URL = "https://example.test";

let sitemap: () => { url: string }[];

test.before(async () => {
  mock.module(new URL("../layout.tsx", import.meta.url), {
    exports: { siteUrl: FAKE_SITE_URL },
  });
  ({ default: sitemap } = await import("../sitemap.ts"));
});

test("includes every /healthy path now that LAUNCHED is true", () => {
  const urls = sitemap().map((entry) => entry.url);
  const healthyUrls = urls.filter((url) => url.includes("/healthy"));
  assert.deepEqual(healthyUrls, [
    `${FAKE_SITE_URL}/healthy`,
    `${FAKE_SITE_URL}/healthy/method`,
    `${FAKE_SITE_URL}/healthy/why-these-picks`,
    `${FAKE_SITE_URL}/healthy/about`,
    `${FAKE_SITE_URL}/healthy/disclosures`,
    `${FAKE_SITE_URL}/healthy/products/thorne-magnesium-glycinate`,
    `${FAKE_SITE_URL}/healthy/products/thorne-creatine-stick-packs`,
    `${FAKE_SITE_URL}/healthy/products/thorne-theanine`,
  ]);
});

test("still includes the home page and legal pages regardless of LAUNCHED", () => {
  const urls = sitemap().map((entry) => entry.url);
  assert.ok(urls.includes(FAKE_SITE_URL));
  assert.ok(urls.includes(`${FAKE_SITE_URL}/legal/getbrianapp/privacy`));
  assert.ok(urls.includes(`${FAKE_SITE_URL}/legal/getbrianapp/terms`));
});
