// Drives the real pages with a real mouse in a browser where rAF actually runs,
// then measures transforms. Verifies the two new modules plus aura-card.
const { chromium } = require("/Users/michaelrobinson/clawd/projects/agentic-tournaments/frontend/node_modules/playwright-core");

const BASE = process.env.BASE || "http://localhost:4321";

const readTransforms = (sel) =>
  `[...document.querySelectorAll(${JSON.stringify(sel)})].map(e => getComputedStyle(e).transform)`;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const results = {};

  // sanity: does rAF run here?
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  results.rafRuns = await page.evaluate(
    () => new Promise((res) => {
      let done = false;
      requestAnimationFrame(() => { done = true; res(true); });
      setTimeout(() => !done && res(false), 1000);
    }),
  );

  // ---- polaroid-parallax ----
  await page.goto(`${BASE}/docs/polaroid-parallax`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const printSel = 'section [aria-hidden="true"] > div';
  const ppRest = await page.evaluate(readTransforms(printSel));
  const secBox = await page.locator("section.relative.isolate").first().boundingBox();
  await page.mouse.move(secBox.x + secBox.width * 0.15, secBox.y + secBox.height * 0.2, { steps: 12 });
  await page.waitForTimeout(900);
  const ppMoved = await page.evaluate(readTransforms(printSel));
  await page.mouse.move(secBox.x + secBox.width * 0.9, secBox.y + secBox.height * 0.8, { steps: 12 });
  await page.waitForTimeout(900);
  const ppMoved2 = await page.evaluate(readTransforms(printSel));
  results.polaroid = {
    count: ppRest.length,
    restSample: ppRest[0],
    leftSample: ppMoved[0],
    rightSample: ppMoved2[0],
    changedFromRest: ppRest.filter((t, i) => t !== ppMoved[i]).length,
    differentBetweenCorners: ppMoved.filter((t, i) => t !== ppMoved2[i]).length,
  };

  // ---- magnetic-elements ----
  await page.goto(`${BASE}/docs/magnetic-elements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const btn = page.locator("[data-magnetic]").first();
  const bb = await btn.boundingBox();
  const magRest = await btn.evaluate((e) => getComputedStyle(e).transform);
  // approach from 60px to the right of centre — inside the 140px radius
  await page.mouse.move(bb.x + bb.width / 2 + 60, bb.y + bb.height / 2, { steps: 15 });
  await page.waitForTimeout(700);
  const magPulled = await btn.evaluate((e) => getComputedStyle(e).transform);
  await page.mouse.move(bb.x + bb.width / 2 + 900, bb.y + bb.height / 2 + 600, { steps: 15 });
  await page.waitForTimeout(900);
  const magReleased = await btn.evaluate((e) => getComputedStyle(e).transform);
  results.magnetic = { rest: magRest, pulled: magPulled, released: magReleased };

  // ---- aura-card (already published — confirm its glow/tilt really work) ----
  await page.goto(`${BASE}/docs/aura-card`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const card = page.locator(".group.relative.flex.flex-col").first();
  const cb = await card.boundingBox();
  const auraRest = await card.evaluate((e) => ({
    t: e.style.transform,
    glow: e.querySelector("span[aria-hidden]")?.style.opacity,
  }));
  await page.mouse.move(cb.x + cb.width * 0.25, cb.y + cb.height * 0.3, { steps: 12 });
  await page.waitForTimeout(800);
  const auraHover = await card.evaluate((e) => ({
    t: e.style.transform,
    glow: e.querySelector("span[aria-hidden]")?.style.opacity,
  }));
  results.auraCard = { rest: auraRest, hover: auraHover };


  // ---- reveal: scroll it into view, expect opacity/filter to settle ----
  await page.goto(`${BASE}/docs/reveal`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const revealTarget = page.locator("section[aria-label='Reveal demo'] p").first();
  await revealTarget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  results.reveal = await revealTarget.evaluate((e) => {
    const s = getComputedStyle(e.parentElement);
    return { opacity: s.opacity, filter: s.filter, transform: s.transform };
  });

  // ---- tally-tiles: poll from load, since the count is over in ~1.4s ----
  // Sampling once is useless here: by the time a single check runs the count has
  // finished, which looks identical to a count that never ran.
  await page.goto(`${BASE}/docs/tally-tiles`, { waitUntil: "domcontentloaded" });
  const tally = await page.evaluate(async () => {
    const seen = [];
    const start = performance.now();
    while (performance.now() - start < 2500) {
      const el = document.querySelector("dd span");
      if (el) seen.push(el.textContent);
      await new Promise((r) => setTimeout(r, 60));
    }
    return seen;
  });
  results.tallyTiles = {
    // The first sample is the statically rendered final value (deliberate: a
    // crawler or a JS-less reader must see the real figure).
    staticValue: tally[0],
    intermediateValues: [...new Set(tally.slice(1, -1))].length,
    landedOn: tally.at(-1),
  };

  // ---- drift-marquee: the CSS track must actually advance ----
  await page.goto(`${BASE}/docs/drift-marquee`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const track = page.locator(".aui-drift-track").first();
  const t1 = await track.evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(1200);
  const t2 = await track.evaluate((e) => getComputedStyle(e).transform);
  results.driftMarquee = { first: t1, later: t2, advanced: t1 !== t2 };

  // ---- beam-border: the ring must rotate ----
  await page.goto(`${BASE}/docs/beam-border`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const beam = page.locator("[class^='beam-']").first();
  const r1 = await beam.evaluate((e) => getComputedStyle(e, "::before").rotate);
  await page.waitForTimeout(1200);
  const r2 = await beam.evaluate((e) => getComputedStyle(e, "::before").rotate);
  results.beamBorder = { first: r1, later: r2, rotating: r1 !== r2 };

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
