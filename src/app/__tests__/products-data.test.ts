import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../products-data.ts";

const self = products.filter((p) => p.category === "self");
const clients = products.filter((p) => p.category === "client");

/** WCAG 2.x relative luminance of a #rrggbb colour. */
function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("contrast helper gives 21 for black on white and 1 for identical colours", () => {
  assert.equal(Math.round(contrast("#000000", "#ffffff")), 21);
  assert.equal(contrast("#123456", "#123456"), 1);
});

test("there are self and client products", () => {
  assert.ok(self.length > 0);
  assert.ok(clients.length > 0);
});

test("every self product has accent, tint, ink and shortName as hex colours", () => {
  const incomplete = self
    .filter(
      (p) =>
        !p.shortName ||
        !/^#[0-9a-f]{6}$/i.test(p.accent ?? "") ||
        !/^#[0-9a-f]{6}$/i.test(p.tint ?? "") ||
        !/^#[0-9a-f]{6}$/i.test(p.ink ?? ""),
    )
    .map((p) => p.name);

  assert.deepEqual(incomplete, []);
});

test("ink reaches 4.5:1 contrast on tint for every self product", () => {
  const failing = self
    .filter((p) => contrast(p.ink!, p.tint!) < 4.5)
    .map((p) => p.name);

  assert.deepEqual(failing, []);
});

test("no product carries a featured field any more", () => {
  const stray = products
    .filter((p) => "featured" in p)
    .map((p) => p.name);

  assert.deepEqual(stray, []);
});

test("client products carry no tint or ink", () => {
  const stray = clients.filter((p) => p.tint || p.ink).map((p) => p.name);

  assert.deepEqual(stray, []);
});

test("product names and hrefs are unique", () => {
  assert.equal(new Set(products.map((p) => p.name)).size, products.length);
  assert.equal(new Set(products.map((p) => p.href)).size, products.length);
});

test("every href is absolute https or a root-relative path", () => {
  const bad = products
    .filter((p) => !/^(https:\/\/|\/[^/])/.test(p.href))
    .map((p) => p.name);

  assert.deepEqual(bad, []);
});
