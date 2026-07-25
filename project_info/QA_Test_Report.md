I did a full code-level audit against every checklist item and found two genuine, verifiable bugs in `Hero.tsx` that would actually cause QA failures — not just theoretical risk. Let me detail them and fix both.

**Bug 1 — GSAP Garbage Collection (would fail your HMR checklist item):**
The floating-badge tweens are created inside `startFloating()`, which is scheduled via `tl.add(startFloating, 1.2)` — meaning those `gsap.to(...repeat:-1...)` calls execute *asynchronously*, during timeline playback, not during the synchronous function body that `useGSAP` records into its `gsap.context()`. GSAP's context only auto-tracks animations created **synchronously** while the context function runs (this is exactly why `@gsap/react` exposes `contextSafe()` for anything created later). So these infinite floating tweens escape cleanup — on HMR or unmount they'd orphan and duplicate exactly as your checklist warns.

**Bug 2 — Mouse Parallax scope (would fail "move mouse across the Hero section"):**
The `mousemove` listener is attached to `rightColRef` (only the image/badge column), not the section. Per the spec, moving the mouse anywhere in the Hero should drive the parallax — but currently, moving the mouse over the left text column produces zero reaction, since the cursor never enters the listener's target element.

Fixing both now:Now fixing the parallax scope to listen on the whole Hero section:Let's verify the full file reads correctly and re-run typecheck/lint.Good. Now let's re-verify with typecheck, lint, and an SSR smoke test.No errors, SSR still renders correctly with the fix (27 chars intact). Let's clean up.layout.tsx clean, only `Hero.tsx` modified. Now let's commit and push the fixes.Now let me go through the remaining checklist items I haven't explicitly walked through, and give you an honest, itemized verdict.Confirmed clean — layout is fully restored. Here's the full QA walkthrough result:

## QA Results (`claude_dev`, now at `8f6ffba`)

I don't have a real browser in this sandbox, so I couldn't literally watch pixels move — I traced through the actual GSAP/DOM logic for every item instead, and where I found something that would genuinely fail, I fixed it and pushed. Here's the honest breakdown:

### Phase 1 — Global Engine & Header
| Item | Verdict |
|---|---|
| Lenis smooth scroll | ✅ `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true` configured |
| Cursor trailing physics | ✅ dot `duration: 0.15` vs aura `duration: 0.45` — genuine trailing delay; both use `mix-blend-mode: difference` |
| Mobile cursor degradation | ✅ hides below 768px / coarse pointer / touch, both in JS and via `@media (pointer: fine)` CSS |
| Header smart-hide | ✅ hides on `scrollDelta > 10` past 100px, shows on `scrollDelta < -5` |
| Header glassmorphism | ✅ `rgba(10,10,12,0.7)` + `blur(20px)` past 50px |

### Phase 2 — Hero
| Item | Verdict |
|---|---|
| Typography cascading | ✅ char split confirmed exact (27 chars), `translateY(110%) rotate(5deg)` → flat, `expo.out`, 0.02s stagger |
| Masked image reveal | ✅ `clip-path: inset(0% 48% 0% 48%)` → full, synced `scale 1.2 → 1` |
| Continuous floating | ✅ now, was **buggy** — fixed (see below) |
| Mouse parallax | ⚠️ was **buggy** — fixed (see below) |
| GSAP garbage collection | ⚠️ was **buggy** — fixed (see below) |

**Two real bugs found and fixed** (commit `8f6ffba`):
1. **GC leak**: floating badge tweens were spawned from inside a timeline callback (`tl.add(startFloating, 1.2)`), which runs *after* `useGSAP`'s synchronous context-recording window closes — so those `repeat:-1` tweens weren't tracked for auto-cleanup and would've orphaned/duplicated on every HMR save, exactly as your checklist predicted.
2. **Parallax scope**: the mousemove listener was only on the right-hemisphere column, so moving the mouse over the left text block (as your checklist instructs) produced zero reaction. Moved it to the full Hero section.

I also widened the float range to true up-and-down motion (it was previously upward-only).

One thing I genuinely can't verify from here: the *feel* of the timing/easing (is 0.15s cursor lag "premium" enough, does the parallax magnitude feel right) — that's a judgment call best made in an actual browser. Everything else above is verified against the real logic, not assumed.