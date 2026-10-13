/**
 * Desktop + mobile screenshots of getbrian.xyz and the portfolio, into
 * public/portfolio/<slug>/{desktop,mobile}-{hero,full}.png plus manifest.json.
 *
 *   node scripts/gen-portfolio-shots.mjs                # everything
 *   node scripts/gen-portfolio-shots.mjs crm merlows    # slugs containing these
 *   node scripts/gen-portfolio-shots.mjs --selftest     # prove the validator can fail
 *
 * Drives the installed Chrome over the DevTools protocol using Node's built-in
 * WebSocket and fetch, so there is no Playwright/Puppeteer dependency (npm
 * install cannot complete on the Drive volume this repo lives on). Set
 * CHROME_PATH if Chrome is somewhere unusual.
 *
 * Distinct from gen-screenshots.mjs, which owns the 16:9 card thumbnails in
 * public/screenshots/. This script never writes there.
 *
 * Targets come from products-data.ts and healthy/data.ts so the list cannot
 * drift. SLA Pharma / Vance work is excluded by name below.
 */

import sharp from "sharp";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "public", "portfolio");
const SITE = "https://www.getbrian.xyz";

/** SLA Pharma / Vance projects: not part of the portfolio shots. */
const EXCLUDE = ["Vance Health Hub", "Ai Simulator"];

const DEVICES = {
  desktop: { width: 1440, height: 900, dsf: 2, mobile: false },
  mobile: {
    width: 390,
    height: 844,
    dsf: 2,
    mobile: true,
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  },
};

/** Chrome's texture limit is 16384 device px; stay under it and record any truncation. */
const MAX_FULL_DEVICE_PX = 16000;
/** Largest full-page raster (device px) headless Chrome handled in testing. */
const MAX_FULL_AREA = 14_000_000;

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean).find((p) => existsSync(p));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------ targets

function slugOf(url) {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, "").replace(/\.(xyz|com|co\.uk|app)$/, "");
  const p = u.pathname.replace(/\/$/, "").split("/").filter(Boolean).join("-");
  return p ? `${host.split(".")[0]}-${p}`.replace("getbrian-healthy-products-", "healthy-") : host.split(".")[0];
}

function readTargets() {
  const targets = [{ name: "getbrian.xyz home", url: `${SITE}/` }];

  const src = readFileSync(path.join(root, "src/app/products-data.ts"), "utf8").replace(/\r\n/g, "\n");
  const body = src.slice(src.indexOf("export const products"), src.indexOf("export const productCategories"));
  for (const chunk of body.split(/\n  \{\n/).slice(1)) {
    const grab = (k) => chunk.match(new RegExp(`(?:^|\\n)\\s*${k}:\\s*"([^"]+)"`))?.[1];
    const name = grab("name");
    const href = grab("href");
    if (!name || !href || EXCLUDE.includes(name)) continue;
    targets.push({ name, url: new URL(href, SITE).href });
  }

  const hsrc = readFileSync(path.join(root, "src/app/healthy/data.ts"), "utf8").replace(/\r\n/g, "\n");
  const hbody = hsrc.slice(hsrc.indexOf("export const products"), hsrc.indexOf("export function getProduct"));
  for (const m of hbody.matchAll(/\n    slug: "([a-z0-9-]+)"/g)) {
    targets.push({ name: `Healthy: ${m[1]}`, url: `${SITE}/healthy/products/${m[1]}` });
  }

  // 1 home + 11 products (13 minus 2 excluded) + 3 healthy product pages.
  if (targets.length !== 15) {
    throw new Error(`Expected 15 targets, parsed ${targets.length}: source shape probably changed.`);
  }
  for (const t of targets) t.slug = slugOf(t.url);
  return targets;
}

// ------------------------------------------------------------ CDP

let launches = 0; // unique profile dir per Chrome, so a still-closing one is never reused

async function launch(work) {
  if (!CHROME) throw new Error("Chrome not found. Set CHROME_PATH.");
  const port = 9333 + Math.floor(Math.random() * 500);
  const proc = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${path.join(work, "profile-" + ++launches)}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  try {
  let wsUrl;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  if (!wsUrl) throw new Error("Chrome DevTools endpoint never came up");

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = () => rej(new Error("websocket failed"));
  });

  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? rej(new Error(`${msg.error.message}`)) : res(msg.result);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((res, rej) => {
      const i = ++id;
      const t = setTimeout(() => {
        pending.delete(i);
        rej(new Error(`${method} timed out after 40s`));
      }, 40_000);
      pending.set(i, { res: (v) => (clearTimeout(t), res(v)), rej: (e) => (clearTimeout(t), rej(e)) });
      ws.send(JSON.stringify({ id: i, method, params, sessionId }));
    });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);
  const onEvent = (fn) => {
    const l = (m) => m.sessionId === sessionId && fn(m);
    listeners.push(l);
    return () => listeners.splice(listeners.indexOf(l), 1);
  };
  await page("Page.enable");
  await page("Page.bringToFront");
  await page("Emulation.setFocusEmulationEnabled", { enabled: true });
  await page("Network.enable");

  const evaluate = async (expression) => {
    const r = await page("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  const close = () => {
    try { ws.close(); } catch {}
    proc.kill();
  };
  return { page, onEvent, evaluate, close };
  } catch (e) {
    // A launch that fails after spawn must not leave Chrome running and its profile locked.
    proc.kill();
    throw e;
  }
}

// ------------------------------------------------------------ capture

const DECLINE_COOKIES = `(() => {
  const re = /^(reject( all)?|decline|necessary only|only necessary|no thanks)$/i;
  const b = [...document.querySelectorAll('button, [role="button"]')]
    .find((el) => re.test((el.textContent || '').trim()));
  if (b) { b.click(); return true; }
  return false;
})()`;

async function shoot(cdp, target, deviceName, heroMult = 1, fullMult = 1) {
  const d = { ...DEVICES[deviceName], dsf: DEVICES[deviceName].dsf * heroMult };
  const fullCap = DEVICES[deviceName].dsf * fullMult;
  const { page, onEvent, evaluate } = cdp;

  await page("Emulation.setDeviceMetricsOverride", {
    width: d.width, height: d.height, deviceScaleFactor: d.dsf, mobile: d.mobile,
  });
  await page("Emulation.setUserAgentOverride", {
    userAgent: d.ua ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  });
  await page("Emulation.setTouchEmulationEnabled", { enabled: d.mobile });

  let status = null;
  const off = onEvent((m) => {
    if (m.method === "Network.responseReceived" && m.params.type === "Document" && status === null) {
      status = m.params.response.status;
    }
  });
  const loaded = new Promise((res) => {
    const stop = onEvent((m) => { if (m.method === "Page.loadEventFired") { stop(); res(); } });
  });
  await page("Page.navigate", { url: target.url });
  await Promise.race([loaded, sleep(45_000)]);
  off();

  // Settle: fonts, then a slow scroll to trigger lazy images and reveal-on-scroll.
  await evaluate("document.fonts.ready.then(() => true)");
  await sleep(1500);
  await evaluate(DECLINE_COOKIES);
  await evaluate(`(async () => {
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += ${Math.round(d.height * 0.7)}) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
    return true;
  })()`);

  // Heavy pages (looping video, endless animations) can leave headless Chrome unable
  // to produce a stable frame, so freeze motion before any capture.
  await evaluate(`(() => {
    document.querySelectorAll('video').forEach((v) => { try { v.pause(); } catch {} });
    document.getAnimations().forEach((a) => { try { a.finish(); } catch { try { a.cancel(); } catch {} } });
    const st = document.createElement('style');
    st.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
    document.head.appendChild(st);
    return true;
  })()`);
  // Smooth scrolling can still be mid-flight when the loop above ends: force the top.
  await evaluate("window.scrollTo({ top: 0, behavior: 'instant' }); document.documentElement.scrollTop = 0; true");
  await sleep(700);

  const probe = await evaluate(`({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    title: document.title,
    text: (document.body?.innerText || '').slice(0, 400),
    textLen: (document.body?.innerText || '').length,
  })`);

  const dir = path.join(OUT, target.slug);
  mkdirSync(dir, { recursive: true });

  const heroPath = path.join(dir, `${deviceName}-hero.png`);
  const hero = await page("Page.captureScreenshot", { format: "png" });
  writeFileSync(heroPath, Buffer.from(hero.data, "base64"));

  const fullPath = path.join(dir, `${deviceName}-full.png`);
  if (process.env.DEBUG_SHOTS) console.log("probe", target.slug, deviceName, JSON.stringify(probe).slice(0, 200));
  const maxCssH = Math.floor(MAX_FULL_DEVICE_PX / DEVICES[deviceName].dsf);
  const fullH = Math.min(probe.scrollHeight, maxCssH);
  // Headless Chrome hangs rasterising ~35M px in one go (2x desktop, 6000px tall),
  // so full-page shots drop their scale until the area is safe. Hero stays at full scale.
  const fullDsf = Math.floor(Math.min(fullCap, Math.sqrt(MAX_FULL_AREA / (d.width * fullH))) * 100) / 100;
  // Grow the emulated viewport to the page height instead of captureBeyondViewport,
  // which hangs headless Chrome on tall pages.
  await page("Emulation.setDeviceMetricsOverride", {
    width: d.width, height: fullH, deviceScaleFactor: fullDsf, mobile: d.mobile,
  });
  await sleep(800);
  const full = await page("Page.captureScreenshot", { format: "png" });
  await page("Emulation.setDeviceMetricsOverride", {
    width: d.width, height: d.height, deviceScaleFactor: d.dsf, mobile: d.mobile,
  });
  writeFileSync(fullPath, Buffer.from(full.data, "base64"));

  return { d, device: deviceName, status, probe, heroPath, fullPath, truncated: probe.scrollHeight > maxCssH, expectFullH: fullH, fullDsf };
}

// ------------------------------------------------------------ validation

/** Returns a list of problems; empty means the shot passed. Must be able to fail (see --selftest). */
async function validate(r) {
  const d = r.d;
  const problems = [];
  if (r.status !== 200) problems.push(`HTTP ${r.status}`);
  if (/\b404\b|application error|this page could not be found|deployment (not found|has been)/i.test(r.probe.text)) {
    problems.push("error text on page");
  }
  if (r.probe.textLen < 40) problems.push("almost no text rendered");
  if (r.probe.innerWidth !== d.width) problems.push(`viewport ${r.probe.innerWidth} != ${d.width} (emulation not applied)`);
  if (r.device === "mobile" && r.probe.scrollWidth > d.width) {
    problems.push(`horizontal overflow: scrollWidth ${r.probe.scrollWidth} > ${d.width}`);
  }
  const hm = await sharp(r.heroPath).metadata();
  if (hm.width !== d.width * d.dsf || hm.height !== d.height * d.dsf) {
    problems.push(`hero ${hm.width}x${hm.height}, expected ${d.width * d.dsf}x${d.height * d.dsf}`);
  }
  const fm = await sharp(r.fullPath).metadata();
  const ew = Math.round(d.width * r.fullDsf);
  const eh = Math.round(r.expectFullH * r.fullDsf);
  if (Math.abs(fm.width - ew) > 1 || Math.abs(fm.height - eh) > 1) {
    problems.push(`full ${fm.width}x${fm.height}, expected ${ew}x${eh}`);
  }
  const { channels } = await sharp(r.heroPath).stats();
  const sd = Math.max(...channels.slice(0, 3).map((c) => c.stdev));
  if (sd < 4) problems.push(`hero looks blank (stdev ${sd.toFixed(1)})`);
  return problems;
}

// ------------------------------------------------------------ main

const args = process.argv.slice(2);
const selftest = args.includes("--selftest");
const filter = args.filter((a) => !a.startsWith("--")).map((a) => a.toLowerCase());

const work = mkdtempSync(path.join(tmpdir(), "brian-portfolio-"));
let cdp;
try {
  cdp = await launch(work);

  if (selftest) {
    // A page that does not exist must be rejected, or the validator is decoration.
    const bad = { name: "selftest", url: `${SITE}/definitely-not-a-page-xyz`, slug: "_selftest" };
    const r = await shoot(cdp, bad, "mobile");
    const problems = await validate(r);
    rmSync(path.join(OUT, "_selftest"), { recursive: true, force: true });
    if (!problems.length) {
      console.error("SELFTEST FAILED: validator passed a 404 page");
      process.exitCode = 1;
    } else {
      console.log("selftest ok: validator rejected the bad page ->", problems.join("; "));
    }
  } else {
    let targets = readTargets();
    if (filter.length) targets = targets.filter((t) => filter.some((f) => t.slug.includes(f) || t.name.toLowerCase().includes(f)));
    if (!targets.length) throw new Error("no targets matched");

    const manifestPath = path.join(OUT, "manifest.json");
    mkdirSync(OUT, { recursive: true });
    const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
    const failures = [];

    for (const t of targets) {
      for (const dev of Object.keys(DEVICES)) {
        let entry;
        // Heavy pages sometimes hang the rasteriser at full scale. Retry in a fresh
        // Chrome at lower scale; the manifest records which scale each shot got.
        // A failed validation (flaky load, 5xx) gets one retry at the same scale too.
        let retriedValidation = false;
        // [hero scale, full-page scale]: the hang is usually the tall full-page raster, so
        // shrink that first and only shrink the hero as a last resort.
        for (const [heroMult, mult] of [[1, 1], [1, 0.5], [1, 0.25], [0.5, 0.25]]) {
          try {
            cdp?.close();
            cdp = await launch(work);
            const r = await shoot(cdp, t, dev, heroMult, mult);
            const problems = await validate(r);
            if (problems.length && !retriedValidation) {
              retriedValidation = true;
              entry = { name: t.name, url: t.url, device: dev, problems };
              continue;
            }
            // A downscaled shot is a degraded result, not a pass.
            if (heroMult !== 1 || mult !== 1) problems.push(`downscaled (hero x${heroMult}, full page x${mult}) after the page hung at full scale`);
            entry = {
              name: t.name, url: t.url, device: dev, status: r.status,
              fullHeightCssPx: r.probe.scrollHeight, truncated: r.truncated, fullScale: r.fullDsf,
              scale: r.d.dsf, shotAt: new Date().toISOString(), problems,
            };
            break;
          } catch (e) {
            entry = { name: t.name, url: t.url, device: dev, problems: [`capture error at scale hero x${heroMult} full x${mult}: ${e.message}`] };
          }
        }
        manifest[`${t.slug}/${dev}`] = entry;
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2)); // survive an interrupted run
        console.log(`${entry.problems.length ? "FAIL" : "ok  "} ${t.slug.padEnd(28)} ${dev.padEnd(8)} ${entry.problems.join("; ")}`);
        if (entry.problems.length) failures.push(`${t.slug}/${dev}`);
      }
    }
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n${failures.length ? failures.length + " problem shot(s): " + failures.join(", ") : "all shots passed"}`);
    if (failures.length) process.exitCode = 1;
  }
} finally {
  cdp?.close();
  await sleep(500);
  try { rmSync(work, { recursive: true, force: true }); } catch {}
}
