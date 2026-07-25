/**
 * Hero animation QA — typography, mask reveal, parallax, performance.
 * Run: node scripts/qa-hero-animations.mjs [url]
 */
import puppeteer from "puppeteer";

const URL = process.argv[2] ?? "http://localhost:3000";
const issues = [];

function report(category, severity, title, details, repro = "") {
  issues.push({ category, severity, title, details, repro });
}

function parseTransformMatrix(matrix) {
  if (!matrix || matrix === "none") return { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
  const m = matrix.match(/matrix\(([^)]+)\)/);
  if (!m) return null;
  const v = m[1].split(",").map((n) => parseFloat(n.trim()));
  const [a, b, c, d, tx, ty] = v;
  const rotate = Math.atan2(b, a) * (180 / Math.PI);
  const scaleX = Math.sqrt(a * a + b * b);
  const scaleY = Math.sqrt(c * c + d * d);
  return { x: tx, y: ty, rotate, scaleX, scaleY };
}

function parseClipPathInset(clipPath) {
  const m = clipPath?.match(/inset\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(/\s+/).map((p) => parseFloat(p));
  if (parts.length === 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
  return null;
}

async function sampleFrames(page, durationMs, sampleInterval = 16) {
  const frames = [];
  const start = Date.now();
  while (Date.now() - start < durationMs) {
    const t = Date.now() - start;
    const data = await page.evaluate(() => {
      const chars = [...document.querySelectorAll("#hero .char")];
      const clip = document.querySelector("#hero [style*='clip-path'], #hero .will-change-transform");
      const clipEl = document.querySelector("#hero .rounded-3xl");
      const inner = clipEl?.querySelector(".will-change-transform");
      const badges = [...document.querySelectorAll("#hero .float-badge")];
      const headline = document.querySelector("#hero h1");

      const getStyle = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          transform: cs.transform,
          opacity: parseFloat(cs.opacity),
          clipPath: cs.clipPath,
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
        };
      };

      return {
        chars: chars.map((c) => getStyle(c)),
        clip: getStyle(clipEl),
        inner: getStyle(inner),
        badges: badges.map((b) => getStyle(b)),
        headlineRect: headline?.getBoundingClientRect(),
      };
    });
    frames.push({ t, ...data });
    await new Promise((r) => setTimeout(r, sampleInterval));
  }
  return frames;
}

async function measureFPS(page, durationMs = 3000) {
  return page.evaluate(async (duration) => {
    return new Promise((resolve) => {
      const frameTimes = [];
      let last = performance.now();
      let count = 0;
      let rafId;

      function tick(now) {
        frameTimes.push(now - last);
        last = now;
        count++;
        if (now - (frameTimes[0] ? frameTimes[0] : now) < duration || count < 10) {
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
          const deltas = frameTimes.slice(1);
          const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
          const fps = 1000 / avgDelta;
          const dropped = deltas.filter((d) => d > 20).length;
          const maxDelta = Math.max(...deltas);
          resolve({ fps, dropped, maxDelta, samples: deltas.length });
        }
      }
      rafId = requestAnimationFrame(tick);
    });
  }, durationMs);
}

async function main() {
  console.log(`\n🔍 Hero Animation QA — ${URL}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);

  // ── Load & initial state ──
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });

  const initialState = await page.evaluate(() => {
    const chars = [...document.querySelectorAll("#hero .char")];
    return {
      charCount: chars.length,
      initialChars: chars.slice(0, 3).map((c) => {
        const cs = getComputedStyle(c);
        const m = cs.transform;
        return { transform: m, opacity: cs.opacity, inline: c.getAttribute("style") };
      }),
      clipPath: getComputedStyle(document.querySelector("#hero .rounded-3xl")).clipPath,
      innerScale: getComputedStyle(document.querySelector("#hero .rounded-3xl .will-change-transform")).transform,
    };
  });

  console.log("Initial state:", JSON.stringify(initialState, null, 2));

  // ── 1. Typography Animation ──
  if (initialState.charCount !== 27) {
    report("Typography", "Medium", "Unexpected character count", `Expected 27 chars, found ${initialState.charCount}`, "Load homepage, inspect .char elements");
  }

  const firstCharInline = initialState.initialChars[0]?.inline ?? "";
  if (!firstCharInline.includes("rotate(5deg)") && !firstCharInline.includes("110%")) {
    report("Typography", "High", "Missing initial 5° rotation / translateY", `First char inline style: ${firstCharInline}`, "Hard refresh page before animation starts");
  }

  // Sample during entrance (delay 0.3s + animation ~1.5s)
  await page.reload({ waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 100)); // catch early frames
  const entranceFrames = await sampleFrames(page, 2200, 16);

  // Check stagger consistency
  const charRevealTimes = [];
  for (let i = 0; i < (entranceFrames[0]?.chars?.length ?? 0); i++) {
    for (const frame of entranceFrames) {
      const op = frame.chars[i]?.opacity ?? 0;
      if (op > 0.5 && !charRevealTimes[i]) {
        charRevealTimes[i] = frame.t;
        break;
      }
    }
  }
  const validReveals = charRevealTimes.filter((t) => t != null);
  if (validReveals.length >= 2) {
    const staggerDeltas = [];
    for (let i = 1; i < validReveals.length; i++) {
      if (charRevealTimes[i] != null && charRevealTimes[i - 1] != null) {
        staggerDeltas.push(charRevealTimes[i] - charRevealTimes[i - 1]);
      }
    }
    const avgStagger = staggerDeltas.reduce((a, b) => a + b, 0) / staggerDeltas.length;
    const staggerVariance = staggerDeltas.map((d) => Math.abs(d - avgStagger));
    const maxVariance = Math.max(...staggerVariance, 0);
    console.log(`Stagger: avg=${avgStagger.toFixed(1)}ms, max variance=${maxVariance.toFixed(1)}ms (expected ~20ms)`);
    if (maxVariance > 25) {
      report("Typography", "Medium", "Inconsistent stagger timing", `Avg stagger ${avgStagger.toFixed(1)}ms, max deviation ${maxVariance.toFixed(1)}ms`, "Reload page, watch headline character cascade");
    }
  }

  // Layout shift / jitter on headline
  const headlineRects = entranceFrames.map((f) => f.headlineRect).filter(Boolean);
  if (headlineRects.length > 0) {
    const xJitter = Math.max(...headlineRects.map((r) => r.x)) - Math.min(...headlineRects.map((r) => r.x));
    const yJitter = Math.max(...headlineRects.map((r) => r.y)) - Math.min(...headlineRects.map((r) => r.y));
    const wJitter = Math.max(...headlineRects.map((r) => r.width)) - Math.min(...headlineRects.map((r) => r.width));
    console.log(`Headline jitter: x=${xJitter.toFixed(2)}px, y=${yJitter.toFixed(2)}px, w=${wJitter.toFixed(2)}px`);
    if (xJitter > 1 || yJitter > 1 || wJitter > 1) {
      report("Typography", "High", "Layout shift during headline animation", `x:${xJitter.toFixed(2)} y:${yJitter.toFixed(2)} w:${wJitter.toFixed(2)}`, "Watch h1 bounding box during entrance");
    }
  }

  // Final char alignment
  await new Promise((r) => setTimeout(r, 2500));
  const finalChars = await page.evaluate(() => {
    return [...document.querySelectorAll("#hero .char")].map((c) => {
      const cs = getComputedStyle(c);
      const m = cs.transform;
      const parent = c.parentElement;
      const parentRect = parent?.getBoundingClientRect();
      const rect = c.getBoundingClientRect();
      return {
        opacity: parseFloat(cs.opacity),
        transform: m,
        rotate: m.includes("matrix") ? null : m,
        yOffset: rect.y - (parentRect?.y ?? 0),
      };
    });
  });

  const notFinal = finalChars.filter((c) => c.opacity < 0.99);
  if (notFinal.length > 0) {
    report("Typography", "High", "Characters not fully visible after animation", `${notFinal.length} chars still faded`, "Wait 3s after load");
  }

  // ── 2. Portrait Mask Reveal ──
  const clipFrames = entranceFrames.map((f) => ({
    t: f.t,
    inset: parseClipPathInset(f.clip?.clipPath),
    inner: parseTransformMatrix(f.inner?.transform),
  })).filter((f) => f.inset);

  if (clipFrames.length > 0) {
    const first = clipFrames[0].inset;
    const isCentralSlit = Math.abs(first.left - first.right) < 2 && first.left > 40 && first.left < 55;
    console.log(`Initial clip inset: L=${first.left}% R=${first.right}% (central slit: ${isCentralSlit})`);
    if (!isCentralSlit) {
      report("Portrait Mask", "High", "Initial mask is not a central vertical slit", `inset left=${first.left}% right=${first.right}%`, "Reload, inspect clip-path on portrait wrapper");
    }

    // Symmetry during expansion
    const asymmetry = clipFrames.map((f) => Math.abs(f.inset.left - f.inset.right));
    const maxAsym = Math.max(...asymmetry);
    console.log(`Max clip asymmetry (|left-right|): ${maxAsym.toFixed(2)}%`);
    if (maxAsym > 1.5) {
      report("Portrait Mask", "Medium", "Mask expansion not symmetric", `Max |left-right| = ${maxAsym.toFixed(2)}%`, "Watch portrait reveal mid-animation");
    }

    const lastClip = clipFrames[clipFrames.length - 1].inset;
    if (lastClip.left > 1 || lastClip.right > 1) {
      report("Portrait Mask", "Medium", "Mask not fully open at end of sampled window", `Final inset L=${lastClip.left}% R=${lastClip.right}%`, "Wait for 1.5s reveal to complete");
    }
  }

  await new Promise((r) => setTimeout(r, 1500));
  const finalClip = await page.evaluate(() => getComputedStyle(document.querySelector("#hero .rounded-3xl")).clipPath);
  const finalInner = await page.evaluate(() => getComputedStyle(document.querySelector("#hero .rounded-3xl .will-change-transform")).transform);
  const finalInnerParsed = parseTransformMatrix(finalInner);
  console.log(`Final clip: ${finalClip}, inner scale: ${finalInnerParsed?.scaleX?.toFixed(3)}`);
  if (!finalClip.includes("0%") || finalClip.includes("48%")) {
    report("Portrait Mask", "High", "Portrait not fully revealed", `clip-path: ${finalClip}`, "Wait 3s after page load");
  }
  if (finalInnerParsed && Math.abs(finalInnerParsed.scaleX - 1) > 0.05) {
    report("Portrait Mask", "Medium", "Portrait scale not at natural size", `scaleX=${finalInnerParsed.scaleX.toFixed(3)}`, "Wait for scale 1.2→1 tween to finish");
  }

  // ── 3. Parallax & Physics ──
  await new Promise((r) => setTimeout(r, 1500)); // let floating start

  const badgeMotion = await page.evaluate(async () => {
    const badges = [...document.querySelectorAll("#hero .float-badge")];
    const samples = [];
    for (let i = 0; i < 30; i++) {
      samples.push(badges.map((b) => b.getBoundingClientRect().y));
      await new Promise((r) => requestAnimationFrame(r));
    }
    return badges.map((_, bi) => {
      const ys = samples.map((s) => s[bi]);
      return { range: Math.max(...ys) - Math.min(...ys), moving: Math.max(...ys) - Math.min(...ys) > 0.5 };
    });
  });

  const floatingBadges = badgeMotion.filter((b) => b.moving).length;
  console.log(`Floating badges in motion: ${floatingBadges}/3`);
  if (floatingBadges < 3) {
    report("Parallax", "Medium", "Floating badges not continuously animating", `${floatingBadges}/3 badges showed vertical motion`, "Wait 2s after entrance, observe badges");
  }

  // Mouse parallax test
  const rightColBox = await page.evaluate(() => {
    const el = document.querySelector("#hero .lg\\:col-span-5, #hero [class*='col-span-5']");
    const target = document.querySelector("#hero .lg\\:col-span-5") ?? document.querySelectorAll("#hero .col-span-12")[1];
    const rect = target?.getBoundingClientRect();
    return rect ? { x: rect.x, y: rect.y, w: rect.width, h: rect.height } : null;
  });

  if (rightColBox) {
    const cx = rightColBox.x + rightColBox.w / 2;
    const cy = rightColBox.y + rightColBox.h / 2;
    const beforeParallax = await page.evaluate(() => {
      const inner = document.querySelector("#hero .rounded-3xl .will-change-transform");
      return getComputedStyle(inner).transform;
    });

    await page.mouse.move(cx + 80, cy - 40);
    await new Promise((r) => setTimeout(r, 700));
    const afterParallax = await page.evaluate(() => {
      const inner = document.querySelector("#hero .rounded-3xl .will-change-transform");
      return getComputedStyle(inner).transform;
    });

    const before = parseTransformMatrix(beforeParallax);
    const after = parseTransformMatrix(afterParallax);
    const parallaxDelta = Math.sqrt((after.x - before.x) ** 2 + (after.y - before.y) ** 2);
    console.log(`Parallax movement: ${parallaxDelta.toFixed(2)}px`);
    if (parallaxDelta < 2) {
      report("Parallax", "High", "Portrait does not respond to mouse movement", `Delta ${parallaxDelta.toFixed(2)}px`, "Move mouse over right hemisphere after load");
    } else if (parallaxDelta > 25) {
      report("Parallax", "Medium", "Excessive parallax movement", `Delta ${parallaxDelta.toFixed(2)}px (expected ~14px max)`, "Move mouse to edge of portrait area");
    }

    // Rapid mouse jitter test
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(cx + (i % 2 ? 100 : -100), cy + (i % 3 ? 50 : -50));
      await new Promise((r) => setTimeout(r, 30));
    }
    await new Promise((r) => setTimeout(r, 800));
  }

  // ── 4. Performance ──
  const fpsIdle = await measureFPS(page, 2000);
  console.log(`FPS (idle/floating): ${fpsIdle.fps.toFixed(1)}, dropped frames (>20ms): ${fpsIdle.dropped}, max delta: ${fpsIdle.maxDelta.toFixed(1)}ms`);
  if (fpsIdle.fps < 55) {
    report("Performance", "High", "FPS below 60 during idle animations", `${fpsIdle.fps.toFixed(1)} FPS, ${fpsIdle.dropped} dropped frames`, "Load page, wait 3s, observe badge float");
  } else if (fpsIdle.dropped > 5) {
    report("Performance", "Medium", "Occasional frame drops during idle", `${fpsIdle.dropped} frames >20ms in 2s`, "Same as above");
  }

  // Reload stress test
  for (let i = 0; i < 3; i++) {
    await page.reload({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 500));
  }
  const fpsAfterReloads = await measureFPS(page, 2000);
  console.log(`FPS after 3 reloads: ${fpsAfterReloads.fps.toFixed(1)}`);
  if (fpsAfterReloads.fps < 50) {
    report("Performance", "Medium", "Performance degrades after repeated reloads", `${fpsAfterReloads.fps.toFixed(1)} FPS`, "Hard refresh 3×, then interact");
  }

  await browser.close();

  // ── Report ──
  console.log("\n═══════════════════════════════════════");
  console.log("QA REPORT");
  console.log("═══════════════════════════════════════\n");

  const order = { High: 0, Medium: 1, Low: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);

  if (issues.length === 0) {
    console.log("✅ PASS — No defects detected.\n");
    console.log("All animation checks passed within tolerance thresholds.");
  } else {
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.severity}] ${issue.category}: ${issue.title}`);
      console.log(`   Details: ${issue.details}`);
      if (issue.repro) console.log(`   Repro: ${issue.repro}`);
      console.log("");
    });
  }

  console.log(`Total issues: ${issues.length}`);
  process.exit(issues.some((i) => i.severity === "High") ? 1 : 0);
}

main().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(2);
});
