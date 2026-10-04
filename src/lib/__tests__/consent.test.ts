import test from "node:test";
import assert from "node:assert/strict";
import {
  GA_MEASUREMENT_ID,
  clearGaCookies,
  gaInitScript,
  isGaCookieName,
  isTrackedHost,
  parseConsent,
  showsBanner,
} from "../consent.ts";

test("tracks getbrian.xyz and its subdomains, nothing that merely looks like it", () => {
  for (const h of ["getbrian.xyz", "www.getbrian.xyz", "WWW.GetBrian.XYZ", "crm.getbrian.xyz"]) {
    assert.equal(isTrackedHost(h), true, h);
  }
  for (const h of [
    "notgetbrian.xyz",
    "getbrian.xyz.evil.com",
    "getbrian.xyzz",
    "getbrianhealthy.xyz",
    "cliftonai.co",
    "getbrian-git-x.vercel.app",
    "localhost",
    "",
  ]) {
    assert.equal(isTrackedHost(h), false, h);
  }
});

test("the banner shows on tracked hosts and localhost only", () => {
  assert.equal(showsBanner("www.getbrian.xyz"), true);
  assert.equal(showsBanner("localhost"), true);
  assert.equal(showsBanner("127.0.0.1"), true);
  assert.equal(showsBanner("cliftonai.co"), false);
  assert.equal(showsBanner("getbrian-git-x.vercel.app"), false);
});

test("only an exact stored choice counts; anything else means 'not asked'", () => {
  assert.equal(parseConsent("granted"), "granted");
  assert.equal(parseConsent("denied"), "denied");
  for (const v of [null, undefined, "", "true", "GRANTED", "granted ", "1"]) {
    assert.equal(parseConsent(v as string | null | undefined), null, String(v));
  }
});

test("the init script sets consent v2 signals before config and denies the ad signals", () => {
  const s = gaInitScript();
  assert.ok(s.indexOf("'consent','default'") < s.indexOf("'config'"));
  assert.match(s, /analytics_storage:'granted'/);
  for (const sig of ["ad_storage", "ad_user_data", "ad_personalization"]) {
    assert.match(s, new RegExp(`${sig}:'denied'`));
  }
  assert.ok(s.includes(`gtag('config','${GA_MEASUREMENT_ID}')`));
  assert.equal(GA_MEASUREMENT_ID, "G-L8MD5DBW87");
  assert.ok(!s.includes("= true"), "must not leave the disable flag on");
});

test("recognises gtag cookie names and no others", () => {
  for (const n of ["_ga", "_ga_L8MD5DBW87", "_gid", "_gat", "_gat_gtag_G_L8MD5DBW87"]) {
    assert.equal(isGaCookieName(n), true, n);
  }
  for (const n of ["gb_consent", "session", "_gaps", "ga", "x_ga"]) {
    assert.equal(isGaCookieName(n), false, n);
  }
});

test("clearGaCookies expires GA cookies and leaves other cookies alone", () => {
  const writes: string[] = [];
  const doc = {
    get cookie() {
      return "_ga=GA1.1.1; _ga_L8MD5DBW87=GS1; keep_me=1; gb_consent=granted";
    },
    set cookie(v: string) {
      writes.push(v);
    },
  } as unknown as Document;
  clearGaCookies(doc, "www.getbrian.xyz");
  const names = new Set(writes.map((w) => w.split("=")[0]));
  assert.deepEqual([...names].sort(), ["_ga", "_ga_L8MD5DBW87"]);
  assert.ok(writes.every((w) => w.includes("expires=Thu, 01 Jan 1970")));
  assert.ok(writes.some((w) => w.includes("domain=.getbrian.xyz")), "parent domain covered");
});

test("with storage blocked, a choice still holds for the page view and nothing is assumed before it", async () => {
  const { readConsent, writeConsent, resetMemoryChoiceForTests, isExcludedPath } = await import("../consent.ts");
  const events: string[] = [];
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: blocked,
    dispatchEvent: (e: Event) => events.push(e.type),
  };
  try {
    resetMemoryChoiceForTests();
    assert.equal(readConsent(), null, "no choice yet means not asked");
    writeConsent("denied");
    assert.equal(readConsent(), "denied");
    writeConsent("granted");
    assert.equal(readConsent(), "granted");
    assert.equal(events.length, 2);
    assert.equal(isExcludedPath("/tiktok-callback"), true);
    assert.equal(isExcludedPath("/tiktok-callback/x"), true);
    assert.equal(isExcludedPath("/tiktok-callbacks"), false);
    assert.equal(isExcludedPath("/"), false);
  } finally {
    resetMemoryChoiceForTests();
    delete (globalThis as unknown as { window?: unknown }).window;
  }
});
