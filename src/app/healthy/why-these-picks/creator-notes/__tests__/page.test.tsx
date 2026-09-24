import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import Link from "next/link";
import Image from "next/image";
import { references } from "../../references.ts";

// creator-notes/page.tsx imports `healthyOpenGraph` from ../../../layout,
// which pulls in next/font/google and a global .css import that can't run
// outside Next's own build pipeline — same problem the why-these-picks and
// sitemap tests solve the same way, via node:test's module mocking (needs
// --experimental-test-module-mocks, already on in the "test" script).
const FAKE_OPEN_GRAPH = { siteName: "Fake", type: "website" as const };

let CreatorNotesPage: () => unknown;
let metadata: { title: string; robots?: { index: boolean; follow: boolean } };

test.before(async () => {
  mock.module(new URL("../../../layout.tsx", import.meta.url), {
    exports: { healthyOpenGraph: FAKE_OPEN_GRAPH },
  });
  ({ default: CreatorNotesPage, metadata } = await import("../page.tsx"));
});

/**
 * Same tree walker as why-these-picks/__tests__/page.test.tsx: recurses into
 * every host element's children, expanding local (hook-free) components by
 * calling them as functions, while leaving `Link`/`Image` un-invoked since
 * they rely on Next internals this test never needs.
 */
function collectText(node: unknown, out: string[]): void {
  if (node === null || node === undefined || typeof node === "boolean") return;
  if (typeof node === "string") {
    out.push(node);
    return;
  }
  if (typeof node === "number") {
    out.push(String(node));
    return;
  }
  if (Array.isArray(node)) {
    for (const child of node) collectText(child, out);
    return;
  }
  if (typeof node === "object" && "type" in node) {
    const el = node as { type: unknown; props?: { children?: unknown } };
    if (typeof el.type === "function" && el.type !== Link && el.type !== Image) {
      const rendered = (el.type as (props: unknown) => unknown)(el.props);
      collectText(rendered, out);
      return;
    }
    if (el.props && "children" in el.props) {
      collectText(el.props.children, out);
    }
  }
}

function pageText(): string {
  const out: string[] = [];
  collectText(CreatorNotesPage(), out);
  return out.join(" ");
}

test("sanity: real reference data actually contains 'say' and 'dontSay' copy (proves the checks below aren't vacuous)", () => {
  assert.ok(references.length > 0, "fixture assumption: at least one reference exists");
  for (const r of references) {
    assert.ok(r.say.length > 0, `fixture assumption: ${r.slug} has 'say' entries`);
    assert.ok(r.dontSay.length > 0, `fixture assumption: ${r.slug} has 'dontSay' entries`);
  }
});

test("creator-notes page renders every reference's 'say' line", () => {
  const text = pageText();
  for (const r of references) {
    for (const line of r.say) {
      assert.ok(text.includes(line), `missing 'say' line for ${r.slug}: ${line}`);
    }
  }
});

test("creator-notes page renders every reference's 'dontSay' line", () => {
  const text = pageText();
  for (const r of references) {
    for (const line of r.dontSay) {
      assert.ok(text.includes(line), `missing 'dontSay' line for ${r.slug}: ${line}`);
    }
  }
});

test("creator-notes page renders the FDA disclaimer", () => {
  assert.match(
    pageText(),
    /not intended to diagnose, treat, cure, or prevent any disease/,
  );
});

test("creator-notes page metadata sets robots to noindex, nofollow", () => {
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});

test("creator-notes page metadata title is 'Creator notes'", () => {
  assert.equal(metadata.title, "Creator notes");
});
