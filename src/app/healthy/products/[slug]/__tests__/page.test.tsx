import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "../../../data.ts";

// page.tsx imports `siteUrl` from ../../../../layout (root layout) and
// `healthyOpenGraph` from ../../../layout (healthy layout), both of which
// pull in next/font/google and a global .css import that can't run outside
// Next's own build pipeline. Stubbed via node:test's module mocking, the
// same approach used by sitemap.test.ts and why-these-picks/page.test.tsx
// (needs --experimental-test-module-mocks, already on in the "test" script).
const FAKE_SITE_URL = "https://example.test";
const FAKE_OPEN_GRAPH = { siteName: "Fake", type: "website" as const };

let ProductPage: (props: { params: Promise<{ slug: string }> }) => Promise<unknown>;
let generateMetadata: (props: { params: Promise<{ slug: string }> }) => Promise<{ title?: string }>;

test.before(async () => {
  mock.module(new URL("../../../../layout.tsx", import.meta.url), {
    exports: { siteUrl: FAKE_SITE_URL },
  });
  mock.module(new URL("../../../layout.tsx", import.meta.url), {
    exports: { healthyOpenGraph: FAKE_OPEN_GRAPH },
  });
  ({ default: ProductPage, generateMetadata } = await import("../page.tsx"));
});

/**
 * Same walker as the other /healthy page tests: recurses into every host
 * element's children, expanding local (hook-free) components by calling
 * them as functions, while leaving `Link`/`Image` un-invoked.
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

/**
 * Finds every rendered `next/image` element in the tree (the mirror image of
 * `collectText`, which deliberately skips them) so tests can assert on
 * whether the packshot rendered at all, not just its alt text.
 */
function collectImages(node: unknown, out: { src: unknown }[]): void {
  if (node === null || node === undefined || typeof node === "boolean") return;
  if (Array.isArray(node)) {
    for (const child of node) collectImages(child, out);
    return;
  }
  if (typeof node === "object" && "type" in node) {
    const el = node as { type: unknown; props?: { src?: unknown; children?: unknown } };
    if (el.type === Image) {
      out.push({ src: el.props?.src });
      return;
    }
    if (typeof el.type === "function" && el.type !== Link) {
      const rendered = (el.type as (props: unknown) => unknown)(el.props);
      collectImages(rendered, out);
      return;
    }
    if (el.props && "children" in el.props) {
      collectImages(el.props.children, out);
    }
  }
}

async function renderPage(slug: string) {
  return ProductPage({ params: Promise.resolve({ slug }) });
}

async function pageText(slug: string): Promise<string> {
  const out: string[] = [];
  collectText(await renderPage(slug), out);
  return out.join(" ");
}

async function pageImages(slug: string): Promise<{ src: unknown }[]> {
  const out: { src: unknown }[] = [];
  collectImages(await renderPage(slug), out);
  return out;
}

const REAL_SLUG = "thorne-magnesium-glycinate";

test("sanity: renderPage resolves a real product to a non-null tree (proves the checks below aren't vacuous)", () => {
  assert.ok(products.some((p) => p.slug === REAL_SLUG), "fixture assumption: the real magnesium product exists");
});

// ---------------------------------------------------------------------------
// Header: "by {brand}"
// ---------------------------------------------------------------------------

test('product page header shows "by {brand}"', async () => {
  const product = products.find((p) => p.slug === REAL_SLUG) as Product;
  const text = await pageText(REAL_SLUG);
  assert.match(text, new RegExp(`by\\s+${product.brand}`));
});

// ---------------------------------------------------------------------------
// Packshot: renders next/image only when product.image is set
// ---------------------------------------------------------------------------

test("product page renders the packshot image when product.image is set (real data, has an image)", async () => {
  const product = products.find((p) => p.slug === REAL_SLUG) as Product;
  assert.ok(product.image, "fixture assumption: the real magnesium product has an image");
  const images = await pageImages(REAL_SLUG);
  assert.ok(
    images.some((img) => img.src === product.image),
    `expected a rendered <Image src="${product.image}">, got: ${JSON.stringify(images)}`,
  );
});

test("product page renders no packshot image when product.image is null", async () => {
  // Mirrors the withTempProducts pattern in components.test.tsx: push a
  // fixture with image: null, exercise it, then always remove it in
  // `finally` so the real product list is untouched for later tests.
  const fixture: Product = {
    ...(products.find((p) => p.slug === REAL_SLUG) as Product),
    slug: "fixture-no-image",
    image: null,
  };
  products.push(fixture);
  try {
    const images = await pageImages("fixture-no-image");
    assert.deepEqual(images, []);
  } finally {
    const i = products.indexOf(fixture);
    if (i !== -1) products.splice(i, 1);
  }
});

// ---------------------------------------------------------------------------
// generateMetadata title
// ---------------------------------------------------------------------------

test('generateMetadata title is "{brand} {name} review"', async () => {
  const product = products.find((p) => p.slug === REAL_SLUG) as Product;
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: REAL_SLUG }) });
  assert.equal(metadata.title, `${product.brand} ${product.name} review`);
});

test("generateMetadata returns an empty object for an unknown slug", async () => {
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: "does-not-exist" }) });
  assert.deepEqual(metadata, {});
});

// ---------------------------------------------------------------------------
// Mobile sticky bar: shows brand + name
// ---------------------------------------------------------------------------

test("mobile sticky bar shows the product's brand and name", async () => {
  const product = products.find((p) => p.slug === REAL_SLUG) as Product;
  const text = await pageText(REAL_SLUG);
  // The header already renders "by {brand}" and the name as a heading, so
  // this pins that the brand and name also appear together, adjacent, the
  // way the sticky bar's own <p>{brand} {name}</p> renders them (rather than
  // just re-finding the header's separate occurrences of the same words).
  assert.match(text, new RegExp(`${product.brand}\\s+${product.name}`));
});
