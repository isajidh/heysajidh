/**
 * Deep-dive hero animation metrics.
 */
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const URL = process.argv[2] ?? "http://localhost:3000";
const OUT = path.join(process.cwd(), "scripts", "qa-output");
fs.mkdirSync(OUT, { recursive: true });

function matrixRotate(transform) {
  const m = transform?.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const [a, b] = m[1].split(",").map((n) => parseFloat(n.trim()));
  return Math.atan2(b, a) * (180 / Math.PI);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shim-usage"],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  await page.goto(URL, { waitUntil: "networkidle0" });

  const findings = [];

  // Capture frames during entrance
  await page.reload({ waitUntil: "networkidle0" });
  const samples = [];
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const snap = await page.evaluate(() => {
      const char0 = document.querySelector("#hero .char");
      const clipEl = document.querySelector("#hero .rounded-3xl");
      const inner = clipEl?.querySelector(".will-change-transform");
      const h1 = document.querySelector("#hero h1");
      const cs0 = char0 ? getComputedStyle(char0) : null;
      const clipCs = clipEl ? getComputedStyle(clipEl) : null;
      const innerCs = inner ? getComputedStyle(inner) : null;
      const h1Rect = h1?.getBoundingClientRect();
      return {
        char0: cs0 ? { transform: cs0.transform, opacity: parseFloat(cs0.opacity) } : null,
        clipPath: clipCs?.clipPath,
        innerTransform: innerCs?.transform,
        h1: h1Rect ? { x: h1Rect.x, y: h1Rect.y, w: h1Rect.width, h: h1Rect.height } : null,
      };
    });
    samples.push({ ms: i * 50, ...snap });
  }

  // Rotation curve for first character
  const rotations = samples
    .filter((s) => s.char0)
    .map((s) => ({ ms: s.ms, rotate: matrixRotate(s.char0.transform), opacity: s.char0.opacity }));

  const initialRotate = rotations[0]?.rotate ?? 0;
  const midRotate = rotations.find((r) => r.opacity > 0.3 && r.opacity < 0.9)?.rotate;
  const finalRotate = rotations[rotations.length - 1]?.rotate ?? 0;

  console.log("\n── Typography rotation (char 0) ──");
  console.log(`Initial: ${initialRotate.toFixed(2)}° (expect ~5°)`);
  console.log(`Mid-animation: ${midRotate?.toFixed(2) ?? "n/a"}°`);
  console.log(`Final: ${finalRotate.toFixed(2)}° (expect ~0°)`);

  if (Math.abs(initialRotate - 5) > 1) {
    findings.push({ sev: "High", msg: `Initial rotation ${initialRotate.toFixed(2)}° ≠ 5°` });
  }
  if (Math.abs(finalRotate) > 0.5) {
    findings.push({ sev: "Medium", msg: `Final rotation ${finalRotate.toFixed(2)}° not flat` });
  }

  // Headline layout stability
  const h1Samples = samples.map((s) => s.h1).filter(Boolean);
  const xRange = Math.max(...h1Samples.map((h) => h.x)) - Math.min(...h1Samples.map((h) => h.x));
  const yRange = Math.max(...h1Samples.map((h) => h.y)) - Math.min(...h1Samples.map((h) => h.y));
  const wRange = Math.max(...h1Samples.map((h) => h.w)) - Math.min(...h1Samples.map((h) => h.w));

  console.log("\n── Headline layout stability ──");
  console.log(`Position drift: Δx=${xRange.toFixed(3)}px Δy=${yRange.toFixed(3)}px Δw=${wRange.toFixed(3)}px`);
  if (xRange > 0.5 || yRange > 0.5 || wRange > 0.5) {
    findings.push({ sev: "High", msg: `Headline layout shift during animation (Δx=${xRange.toFixed(2)} Δy=${yRange.toFixed(2)} Δw=${wRange.toFixed(2)})` });
  }

  // Clip-path symmetry timeline
  console.log("\n── Portrait mask timeline ──");
  const clipTimeline = samples.map((s) => {
    const m = s.clipPath?.match(/inset\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/\s+/).map((p) => parseFloat(p));
    const left = parts.length === 4 ? parts[3] : parts[1];
    const right = parts.length === 4 ? parts[1] : parts[1];
    const scale = parseFloat(s.innerTransform?.match(/matrix\(([^,]+)/)?.[1] ?? "1");
    return { ms: s.ms, left, right, asym: Math.abs(left - right), scale };
  }).filter(Boolean);

  clipTimeline.slice(0, 5).forEach((c) => console.log(`  ${c.ms}ms: L=${c.left}% R=${c.right}% scale=${c.scale.toFixed(3)} asym=${c.asym.toFixed(2)}%`));
  console.log("  ...");
  clipTimeline.slice(-3).forEach((c) => console.log(`  ${c.ms}ms: L=${c.left}% R=${c.right}% scale=${c.scale.toFixed(3)} asym=${c.asym.toFixed(2)}%`));

  const maxAsym = Math.max(...clipTimeline.map((c) => c.asym));
  if (maxAsym > 0.5) {
    findings.push({ sev: "Low", msg: `Minor clip asymmetry during reveal (max ${maxAsym.toFixed(2)}%)` });
  }

  // Screenshots at key moments
  await page.reload({ waitUntil: "networkidle0" });
  await page.screenshot({ path: path.join(OUT, "01-initial.png") });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT, "02-mid-entrance.png") });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUT, "03-post-entrance.png") });

  // Parallax responsiveness sweep
  await new Promise((r) => setTimeout(r, 2000));
  const box = await page.evaluate(() => {
    const cols = document.querySelectorAll("#hero .col-span-12");
    const target = cols[1] ?? document.querySelector("#hero [class*='col-span-5']");
    const r = target.getBoundingClientRect();
    return { cx: r.x + r.w / 2, cy: r.y + r.h / 2, w: r.w, h: r.h };
  });

  const parallaxSamples = [];
  for (const offset of [-120, -60, 0, 60, 120]) {
    await page.mouse.move(box.cx + offset, box.cy);
    await new Promise((r) => setTimeout(r, 650));
    const t = await page.evaluate(() => getComputedStyle(document.querySelector("#hero .rounded-3xl .will-change-transform")).transform);
    const m = t.match(/matrix\(([^)]+)\)/);
    const parts = m ? m[1].split(",").map(Number) : [1, 0, 0, 1, 0, 0];
    parallaxSamples.push({ offset, tx: parts[4], ty: parts[5] });
  }

  console.log("\n── Parallax response curve ──");
  parallaxSamples.forEach((p) => console.log(`  mouse Δx=${p.offset}: translate(${p.tx.toFixed(1)}, ${p.ty.toFixed(1)})`));

  const maxParallax = Math.max(...parallaxSamples.map((p) => Math.abs(p.tx)));
  if (maxParallax > 16) {
    findings.push({ sev: "Medium", msg: `Parallax exceeds design cap (~14px): max ${maxParallax.toFixed(1)}px` });
  }
  if (maxParallax < 3) {
    findings.push({ sev: "High", msg: `Parallax too weak: max ${maxParallax.toFixed(1)}px` });
  }

  // Long-run float stability (jitter)
  const floatSamples = [];
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 50));
    const ys = await page.evaluate(() =>
      [...document.querySelectorAll("#hero .float-badge")].map((b) => b.getBoundingClientRect().y)
    );
    floatSamples.push(ys);
  }
  const badgeJitter = floatSamples[0].map((_, bi) => {
    const ys = floatSamples.map((s) => s[bi]);
    return Math.max(...ys) - Math.min(...ys);
  });
  console.log("\n── Badge float amplitude (3s) ──");
  badgeJitter.forEach((j, i) => console.log(`  Badge ${i + 1}: ${j.toFixed(1)}px vertical travel`));

  // CLS via Performance API
  const cls = await page.evaluate(() => {
    return new Promise((resolve) => {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 3000);
    });
  });

  console.log(`\n── Cumulative Layout Shift (3s post-load): ${cls.toFixed(4)} ──`);
  if (cls > 0.01) {
    findings.push({ sev: "High", msg: `CLS ${cls.toFixed(4)} exceeds 0.01 threshold` });
  } else if (cls > 0.001) {
    findings.push({ sev: "Low", msg: `Minor CLS detected: ${cls.toFixed(4)}` });
  }

  await browser.close();

  console.log("\n── Deep QA findings ──");
  if (findings.length === 0) {
    console.log("No additional issues beyond primary QA script.");
  } else {
    findings.forEach((f, i) => console.log(`${i + 1}. [${f.sev}] ${f.msg}`));
  }
  console.log(`\nScreenshots saved to ${OUT}`);
}

main().catch(console.error);
