import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";

// See sitemap.test.ts for why layout.tsx is stubbed rather than imported.
const FAKE_SITE_URL = "https://example.test";

let robots: () => { rules: { disallow?: string | string[]; allow?: string | string[] } };

test.before(async () => {
  mock.module(new URL("../layout.tsx", import.meta.url), {
    exports: { siteUrl: FAKE_SITE_URL },
  });
  ({ default: robots } = await import("../robots.ts"));
});

test("disallows crawling the Buy-button redirect path", () => {
  const { rules } = robots();
  const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];
  assert.ok(disallow.includes("/healthy/go/"));
});

test("still allows crawling the site generally", () => {
  const { rules } = robots();
  const allow = Array.isArray(rules.allow) ? rules.allow : [rules.allow];
  assert.ok(allow.includes("/"));
});
