import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { products } from "../products-data.ts";

// next/image needs Next's runtime; a plain <img> stands in for it. It keeps
// src and alt, which is all these tests read.
let WorkSection: () => React.ReactElement;
let ClientsSection: () => React.ReactElement;
let PricingSection: () => React.ReactElement;

test.before(async () => {
  mock.module("next/image", {
    defaultExport: (props: { src: string; alt: string }) =>
      createElement("img", { src: props.src, alt: props.alt }),
  });
  ({ WorkSection, ClientsSection } = await import("../products-section.tsx"));
  ({ PricingSection } = await import("../pricing-section.tsx"));
});

const html = (el: React.ReactElement) => renderToStaticMarkup(el);

/** Every <a ...> opening tag with its href and the markup up to its </a>. */
function anchors(markup: string) {
  const found: { href: string; inner: string }[] = [];
  const re = /<a\b[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markup))) found.push({ href: m[1], inner: m[2] });
  return found;
}

const self = products.filter((p) => p.category === "self");
const clients = products.filter((p) => p.category === "client");

test("WorkSection links every self product by its href", () => {
  const hrefs = anchors(html(createElement(WorkSection))).map((a) => a.href);

  assert.deepEqual(hrefs, self.map((p) => p.href));
});

test("WorkSection lists no client product", () => {
  const markup = html(createElement(WorkSection));

  assert.equal(markup.includes("Merlows News"), false);
  assert.equal(markup.includes("HYDRGEL"), false);
});

test("WorkSection tiles contain no nested anchors", () => {
  const tiles = anchors(html(createElement(WorkSection)));

  assert.equal(tiles.filter((a) => a.inner.includes("<a ")).length, 0);
});

test("WorkSection puts the first self product in the wide lead cell", () => {
  const markup = html(createElement(WorkSection));
  const leadCell = markup.indexOf("lg:col-span-8");
  const firstHref = markup.indexOf(`href="${self[0].href}"`);
  const secondHref = markup.indexOf(`href="${self[1].href}"`);

  assert.ok(leadCell !== -1);
  assert.ok(leadCell < firstHref && firstHref < secondHref);
  assert.equal(markup.split("lg:col-span-8").length - 1, 1);
});

test("WorkSection uses each product's tint as the tile ground and ink for the tagline", () => {
  const markup = html(createElement(WorkSection));

  assert.ok(markup.includes(`background-color:${self[0].tint}`));
  assert.ok(markup.includes(`color:${self[0].ink}`));
});

test("WorkSection shows the short name as the heading", () => {
  const markup = html(createElement(WorkSection));

  assert.ok(markup.includes(">Healthy</h3>"));
});

test("ClientsSection links every client product exactly once, in data order", () => {
  const hrefs = anchors(html(createElement(ClientsSection))).map((a) => a.href);

  assert.deepEqual(hrefs, clients.map((p) => p.href));
});

test("ClientsSection renders every client as an image card with name and tagline", () => {
  const all = anchors(html(createElement(ClientsSection)));

  assert.equal(all.filter((a) => !a.inner.includes("<img")).length, 0);
  assert.equal(all.length, clients.length);
  all.forEach((a, i) => {
    assert.ok(a.inner.includes(clients[i].name), clients[i].name);
    assert.ok(a.inner.includes(clients[i].tagline), clients[i].name);
  });
});

// Driven by the data, not a fixed count: today no client is in development, so
// this holds the section to showing no badge at all, and it will hold it to
// one badge per in-development client the day one is marked so again.
test("ClientsSection shows an In development badge on the in-development clients' cards and nowhere else", () => {
  const markup = html(createElement(ClientsSection));
  const all = anchors(markup);
  const badged = all.filter((a) => a.inner.includes("In development"));
  const inDevelopment = clients.filter((p) => p.status === "in-development");

  assert.equal(markup.split("In development").length - 1, inDevelopment.length);
  assert.deepEqual(
    badged.map((a) => a.href),
    inDevelopment.map((p) => p.href),
  );
});

test("ClientsSection renders one list item per client", () => {
  const markup = html(createElement(ClientsSection));

  assert.equal((markup.match(/<li\b/g) ?? []).length, clients.length);
});

test("ClientsSection list starts as a snap row with 82 percent wide cards", () => {
  const markup = html(createElement(ClientsSection));

  assert.ok(/<ul[^>]*id="client-list"[^>]*class="[^"]*snap-x[^"]*overflow-x-auto/.test(markup));
  assert.equal(
    (markup.match(/<li class="w-\[82%\] shrink-0 snap-start/g) ?? []).length,
    clients.length,
  );
});

test("ClientsSection button starts collapsed, names the client count and controls the list", () => {
  const markup = html(createElement(ClientsSection));
  const button = markup.match(/<button\b[^>]*>[^<]*<\/button>/)![0];
  const controls = button.match(/aria-controls="([^"]+)"/)![1];

  assert.ok(button.includes('aria-expanded="false"'));
  assert.ok(button.includes(`>View all ${clients.length}<`));
  assert.ok(markup.includes(`id="${controls}"`));
});

test("PricingSection shows the 900 a month ledger on first render", () => {
  const markup = html(createElement(PricingSection));

  assert.ok(markup.includes("£64,800"));
  assert.ok(markup.includes("£16,200"));
  assert.ok(markup.includes("£46,100"));
  assert.ok(markup.includes("£2,500"));
});

test("PricingSection has a single range input with id monthly-spend and 200..3000 step 50", () => {
  const markup = html(createElement(PricingSection));
  const inputs = markup.match(/<input\b[^>]*>/g) ?? [];

  assert.equal(inputs.length, 1);
  assert.ok(inputs[0].includes('id="monthly-spend"'));
  assert.ok(inputs[0].includes('type="range"'));
  assert.ok(inputs[0].includes('min="200"'));
  assert.ok(inputs[0].includes('max="3000"'));
  assert.ok(inputs[0].includes('step="50"'));
  assert.ok(inputs[0].includes('value="900"'));
});

test("PricingSection label points at the slider", () => {
  const markup = html(createElement(PricingSection));

  assert.ok(markup.includes('for="monthly-spend"'));
});

test("PricingSection slider fill starts at 25 percent for 900", () => {
  const markup = html(createElement(PricingSection));

  assert.ok(markup.includes("--fill:25%"));
});

test("PricingSection shows nothing owed in years 4 to 6", () => {
  const markup = html(createElement(PricingSection));

  assert.ok(/Brian&#x27;s fee, years 4 to 6<\/dt><dd[^>]*>£0</.test(markup));
});
