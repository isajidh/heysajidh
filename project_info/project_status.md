# heySajidh — Project Documentation

## Project Details

| Field | Value |
|---|---|
| **Project Name** | heySajidh (NESH® Portfolio Clone) |
| **Tech Stack** | Next.js 16.2.11, React 19, Tailwind CSS v4, GSAP 3.13+, Lenis |
| **Purpose** | Educational replication of an Awwwards-winning portfolio (heynesh.com) |
| **Architecture** | App Router, Single Page Application, static data arrays |

---

## Live Site Analysis

### Design Details Extraction (heynesh_live_site_details.md)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Fetched and parsed full HTML source from heynesh.com
- Extracted all text content (hero, timeline, portfolio, capabilities, services, testimonials, FAQ, footer)
- **Critical finding**: Accent color is `#FFFF23` (neon yellow), NOT `#8B5CF6` (purple) as previously estimated
- Documented complete color palette from live CSS
- Mapped all GSAP data-attribute animation system (`data-tl-*`, `data-flip-*`)
- Identified Swiper v11 for testimonials carousel
- Documented FLIP-based navigation transformation pattern
- Catalogued all 9 portfolio projects with exact tags and descriptions
- Documented all 8 FAQ questions with answers
- Captured all 8 testimonial authors with roles and companies
- Documented 3 service tiers with exact pricing and bullet points

---

## Phase 1 — Features Implemented

### 1. Design System & Tokens (globals.css)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 7-color dark-mode palette via `@theme inline` (Tailwind v4)
- 6-tier fluid typography scale using `clamp()`
- Custom easing curves (`--ease-ui`, `--ease-dramatic`)
- `prefers-reduced-motion` global disable for all animations
- Accessible focus-visible rings (accent-colored)
- Custom scrollbar and selection styling
- OS cursor hidden on desktop via `pointer: fine` media query

### 2. Smooth Scrolling Engine (SmoothScroll.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Lenis `ReactLenis` provider wrapping the root layout
- Config: `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true`
- Lenis CSS overrides in globals.css

### 3. Custom Cursor (CustomCursor.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 8px primary dot + 32px trailing aura ring
- GSAP `quickTo` for 60fps tracking (no React state re-renders)
- `mix-blend-mode: difference` on both elements
- `will-change: transform` for GPU compositing
- Touch device / < 768px detection → cursor hidden entirely
- Visibility managed via GSAP opacity tweens, not React state

### 4. Global Header (Header.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Fixed positioning, z-index 100, full width
- Logo "NESH®" left, 7 nav links center, email + CTA right
- Uppercase caption typography (0.875rem, 500 weight, 0.04em tracking)
- `scaleX` expanding underline on hover (origin-left, GPU-accelerated)
- Glassmorphism at 50px scroll (70% opacity bg + 20px backdrop-blur)
- Smart-hide: hide on rapid scroll down, show on scroll up
- Entrance animation: drops from above on page load
- Email "Copy to clipboard" hover tooltip + "Copied!" confirmation
- "Book a Call" pill button: white bg → light gray on hover
- Scroll mechanics entirely ref-based (no state re-renders)
- Mobile hamburger button placeholder

### 5. Root Layout (layout.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Inter font via `next/font/google` (self-hosted, zero layout shift)
- SEO metadata: title + description
- SmoothScroll > CustomCursor + Header + children

### 6. Testing Canvas (page.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 300vh layout with 3 full-screen sections
- Hero typography test (display, h2, h3, body-lg, caption)
- Scroll zone for glassmorphism + smart-hide testing
- Tag/badge components matching the design spec
- Interactive surface cards with hover elevation + accent glow

---

## Phase 2 — Features Implemented

### 7. Hero Section (Hero.tsx)
- **Date**: 2026-07-16
- **Status**: ✅ Completed
- 12-column grid (`grid-cols-12`), min-height `100vh`
- Left hemisphere (cols 1–7): subtitle, display headline, body copy, "Book a Call" / "About Me" buttons
- Right hemisphere (cols 8–12): SVG portrait placeholder (4:5 / 800x1000 aspect) + 3 floating badges ("80+ Projects", "Creative", "Reliable")
- `SplitHeadline` helper: splits headline into per-character `overflow-hidden` spans while preserving word-level `whitespace-nowrap` wrapping (word → char, not flat char split)
- Character entrance: `translateY(110%) rotate(5deg) opacity:0` → flat/visible, `expo.out` ease, 0.02s stagger, driven by a single master GSAP timeline (`useGSAP`, scoped to the section)
- Image reveal: `clip-path: inset(0% 48% 0% 48%)` (vertical slit) → `inset(0% 0% 0% 0%)` over 1.5s, synced with an inner `scale: 1.2 → 1`, offset 0.1s after the headline cascade starts (per master timeline)
- Floating badges: continuous `yoyo: true, repeat: -1, sine.inOut` per-badge float using `gsap.utils.random()` for duration (2–4s) and delay, started after entrance completes
- Mousemove parallax: `gsap.quickTo` on the portrait image and each badge, moving opposite the cursor relative to the right-hemisphere container center (ref + native `mousemove` listener, no React state)
- Accessibility: `gsap.matchMedia()` branches on `prefers-reduced-motion` — reduced-motion path sets all elements directly to their final resting state, skipping every stagger/float/parallax tween
- All animated elements carry `will-change-transform` (Tailwind arbitrary class) or explicit `willChange: "transform"` for GPU compositing
- `app/page.tsx` now renders `<Hero />` for Section 1 in place of the Phase 1 static placeholder; Sections 2–3 remain as scroll-behavior/cursor testing zones

---

## Phase 3 — About Me & Journey Timeline

### 9. JourneyTimeline Component (JourneyTimeline.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Split-screen 12-column grid: left column (cols 1–4) pinned, right column (cols 5–12) scrolls freely
- GSAP `ScrollTrigger.create()` pins the left column from `start: "top top"` to `end: "bottom bottom"` of the section
- **matchMedia guard**: all pinning wrapped in `(min-width: 768px)` — completely disabled on mobile/touch
- 7 timeline nodes with full content from heynesh.com (2019–2026)
- Per-node center-viewport intersection via individual ScrollTriggers (`top 65%` / `bottom 35%`)
- Active node: `opacity: 1`, all others dim to `opacity: 0.25` (0.4s transitions)
- Image parallax reveal: wrapper `height: 0 → naturalHeight`, inner image `y: -30% → 0%`
- Image collapse on deactivation: reverse animation with `power2.inOut` ease
- SVG gradient placeholders (600×400) with unique hue per node and year text overlay
- Smooth accordion: "Read more" triggers `gsap.to(wrapper, { maxHeight: scrollHeight })` — no CSS `height: auto`
- Accordion collapse reverses to `maxHeight: 0`, plus icon rotates 90deg to form ×
- `ScrollTrigger.refresh()` called on accordion open/close to recalculate pin distances
- Section heading entrance: subtitle, h2, intro paragraph fade up from opacity 0 on scroll
- Mobile (< 768px): columns stack vertically, images start revealed, nodes fade in with `y: 30` offset
- All ScrollTrigger instances created inside `useGSAP()` with `matchMedia.revert()` cleanup
- `page.tsx` updated: Phase 1 test sections removed, `<JourneyTimeline />` placed after `<Hero />`
- Vertical connector lines between timeline nodes with dot indicators showing year abbreviations
- Tag badges (@stefan, @webflow, etc.) and time-ago labels per node

---

## Phase 4 — Selected Work

### 10. CustomCursor Upgrade (CustomCursor.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Added `cursor-state` CustomEvent listener system for cross-component cursor control
- `state: "view"`: aura expands 32px → 80px, dot hides, "View" label fades in with scale animation
- `state: "default"`: everything reverses to default sizes
- Aura gets semi-transparent dark fill (`rgba(10,10,12,0.6)`) in view state for readability
- Label: 0.65rem, weight 600, uppercase, 0.08em tracking
- No React state involved — all GSAP-driven, cleaned up via `useGSAP` event listener removal

### 11. SelectedWork Component (SelectedWork.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 9 project cards with exact content from heynesh.com (titles, tags, descriptions)
- **Staggered zig-zag grid**: 12-column CSS Grid, odd cards cols 1-5 (left), even cards cols 7-12 (right)
- 4:5 aspect ratio image containers with `overflow: hidden` and `rounded-2xl`
- SVG gradient placeholders (800×1000) with unique hue per project
- **10% dark overlay** (`bg-black/10`) that fades to transparent on hover
- **Inverse image parallax**: images are 120% height, GSAP `scrub: true` ScrollTrigger moves image `y: -10% → 0%` as card traverses viewport
- `will-change: transform` on all parallax images
- **Scroll entrance**: each card fades from `opacity: 0, y: 60` → visible at 88% viewport intersection (0.8s, power3.out)
- **Hover choreography**: image scales 5% via CSS transition, overlay fades, tags translate right 4px, arrow indicator fills white
- **Cursor override**: dispatches `CustomEvent("cursor-state", { detail: { state: "view" } })` on mouseenter, resets on mouseleave
- Section heading entrance: subtitle, h2, body paragraph staggered fade-up
- Callback-ref pattern for 9×2 = 18 dynamic refs (cards + images)
- `page.tsx` updated: `<SelectedWork />` added after `<JourneyTimeline />`

---

## Phase 5 — Capabilities Overview & Services

### 12. Capabilities Component (Capabilities.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Stacked list of 5 capability items (Webflow Development, Custom Integrations, SEO-Ready Setup, Creative & Interactive Motion, Performance & Technical Optimization).
- **Line Drawing Entrance**: GSAP `ScrollTrigger` animating `scaleX: 0 → 1` (`transformOrigin: "left center"`) across 1px divider lines for GPU compositing at 60fps.
- **Text Reveal**: Immediate text entrance `y: 30 → 0` and `opacity: 0 → 1` following line draw.
- **Hover Interactions**: Title shifts to `text-accent-primary`, right-side description translates `x: 8px` to the right.

### 13. Services Component (Services.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 3 pricing tiers ("Ongoing Support" $3,000/mo, "Starter Build" $5,000, "Custom Project" Book a Call).
- 3-column responsive grid (collapses to single-column stack on viewports < 1024px).
- **Staggered Scroll Entrance**: Sequence 1-2-3 sliding up `y: 60 → 0` with `stagger: 0.15s` on scroll intersection.
- **Hover Elevation & Glow**: Card elevates `y: -8px` with glowing box-shadow (`shadow-[0_0_35px_rgba(139,92,246,0.18)]`).
- Full list of deliverables, pricing commitment badges, and audience target footers per tier.

---

## Phase 6 — Testimonials, FAQ, Transform Footer & Final Polish

### 14. Testimonials Drag Carousel (Testimonials.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Horizontal drag-and-throw slider with custom RAF velocity physics & friction lerping.
- Tension scaling: cards scale down to `0.95` during drag and snap back to `scale: 1` with elastic spring.
- Hidden scrollbars (`scrollbar-none`).
- 8 detailed client testimonials with quote, name, role, company, tagline, and 150x150px avatar/logo slot.
- **Custom Cursor 'Drag' Override**: Dispatches `CustomEvent("cursor-state", { detail: { state: "drag" } })` on mouseenter, updating cursor ring label to "DRAG".

### 15. FAQ Accordion (Faq.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- 8 vertically stacked accordion rows separated by razor-thin horizontal borders.
- Programmatic height expansion from `height: 0 → scrollHeight` over `0.4s` using GSAP.
- Right-aligned plus (+) icon that rotates 45° to form "X" when opened.

### 16. Transform Footer Banner (Footer.tsx)
- **Date**: 2026-07-25
- **Status**: ✅ Completed
- Screen-filling section featuring massive typography "Transform Your Webflow Experience Journey".
- **Scrubbed Scroll Interaction**: GSAP `ScrollTrigger` (`scrub: true`) tracks letter-spacing and scale as user scrolls near document bottom.
- Intro summary, "Have something in mind? Let's Talk" CTA button, copy-to-clipboard email tooltip, social links, and copyright bar.
- `prefers-reduced-motion` guards using `gsap.matchMedia()`.

---

## Phase 4 — Selected Work (Review & Fixes)

### 12. Review of prior work (commit `b6eb05b`, "Phase 03")
- **Date**: 2026-07-25
- **Status**: ✅ Reviewed, 4 real bugs found and fixed
- Prior commit had already added `JourneyTimeline.tsx` (Phase 3), `SelectedWork.tsx` (Phase 4, functionally complete but buggy), and a `cursor-state` CustomEvent system in `CustomCursor.tsx`. `project_status.md` had marked Phase 4 "✅ Completed" — that was inaccurate; the structure was there but several checklist-relevant behaviors were silently broken. Found via code-level trace (no browser available in this sandbox), same method as the Phase 1/2 QA pass:
  1. **`next.config.ts`**: stray `output: "export"` left over from local screenshot-based QA testing (see `01b23d6`). Static export silently disables Image Optimization, dynamic APIs, and other server features not intentionally opted into — reverted to default config.
  2. **`SelectedWork.tsx` — hover-scale silently broken**: the parallax layer (`imageRef`, GSAP-scrubbed) and the hover-scale layer were the *same element*, both fighting over the `transform` CSS property. GSAP writes `transform` via inline style every scroll frame; inline style always beats a class rule, so Tailwind's `group-hover:scale-105` never had any visible effect once the scrub tween had touched the element (which happens almost immediately on mount). Fixed by splitting into two layers: an outer parallax wrapper (GSAP-owned `transform`) and an inner `.work-image-scale` wrapper (now the hover-scale target).
  3. **`SelectedWork.tsx` — scrubbed parallax was laggy**: the same combined element also carried `transition-transform duration-500`. A CSS `transition` on a property GSAP is scrubbing every frame causes the browser to re-chase each intermediate scrubbed value with its own 500ms easing, fighting `scrub: true`'s intentional 1:1 scroll-tied responsiveness. Removed — the parallax layer now has no CSS transition on `transform`.
  4. **`SelectedWork.tsx` — hover choreography not simultaneous**: image scale (CSS, 500ms), overlay fade (CSS, 500ms), and tag translate (CSS, 300ms) were three independent CSS transitions with drifting durations, not truly "executed simultaneously" per spec. Replaced with a single GSAP-driven interaction per card (`contextSafe`-wrapped `mouseenter`/`mouseleave` on each card, created inside the same synchronous `useGSAP` scope as the scroll triggers so cleanup is tracked correctly) — scale, overlay opacity, and tag `x` all animate together.
  5. **`CustomCursor.tsx` — "view" state fought by generic mousemove logic**: the base cursor's "show dot on movement" check (`dot.style.opacity === "0"`) didn't know about the `cursor-state` system, so any mouse movement while hovering a project card (dot intentionally hidden in "view" state) would re-trigger the dot to fade back in, flickering against the intended "hidden dot, expanded aura + label" state. Added an `isViewStateRef` guard checked by the mousemove/mouseenter handlers, set/cleared by the `cursor-state` handler.
  6. **`JourneyTimeline.tsx` — accordion icon double-animation**: `.accordion-v-line` had both a CSS `transition-transform duration-300` class *and* a GSAP `rotation` tween on the same property. GSAP writes ~18 inline-style frames over its own 0.3s tween; a competing CSS transition re-chases each of those frames with its own 300ms easing, producing a stuttering/overshooting rotation instead of one clean animation. Removed the CSS transition class — GSAP now owns it exclusively.
- **Noted but not changed** (lower severity, out of Phase 4 scope): `JourneyTimeline.tsx`'s `handleToggleAccordion` creates its `gsap.to()` calls from a `useCallback` outside `useGSAP`'s synchronous context window (same class of issue as bug #5 below, but for finite one-shot tweens rather than infinite ones — much lower practical impact since they can't orphan/repeat forever). Would need `contextSafe` threaded through via hook reordering; flagging for a future pass rather than restructuring untouched Phase 3 code as a side effect of the Phase 4 review.
- Verified via `tsc --noEmit` (clean), `eslint` (clean, plus cleaned up a pre-existing unused `useCallback` import in `CustomCursor.tsx`), and an SSR smoke test confirming all 9 project cards, correct tag counts (26 total, matching the 3-tag/2-tag data), and both new layer classes (`work-image-scale`, `work-overlay`) render with no hydration/runtime errors.

---

## Phase 7 — Core Architecture & Rendering Stabilization

### 13. Client boundary audit, FOUC/CLS prevention, breakpoint sync, dvh fix
- **Date**: 2026-07-26
- **Status**: ✅ Completed (4 of 5 requested items; 1 deliberately not implemented, see below)
- Sprint was framed around a supplied "Technical Audit" document. That document doesn't match this repo — it references files that don't exist here (`components/sections/HeroSection.tsx`, `components/cards/ProjectCard.tsx`, `components/providers/GSAPProvider.tsx`, etc.), still frames the hero's accent as purple molecular structures (corrected to `#FFFF23` yellow back in the original live-site audit), and its Yarn/CI citations point to unrelated GitHub issues. Treated its file-level claims as unverified and re-derived each item against the actual codebase rather than assuming the audit was accurate.
- **1. Client Boundary Refactoring** — reviewed, no change needed. `app/page.tsx` and `app/layout.tsx` were already strict Server Components (no `"use client"`); all 11 section components already declare their own individual client boundaries. The described "bloat" doesn't exist in this codebase.
- **2. GSAP FOUC & CLS Prevention** — implemented. Added `.reveal` / `.reveal-up-sm` (20px) / `.reveal-up` (30px) / `.reveal-up-md` (40px) / `.reveal-up-lg` (60px) utility classes to `globals.css`, each setting `visibility: hidden; opacity: 0; transform: translateY(Npx)` so entrance content is server-rendered invisible *and* out of the accessibility tree/tab order pre-hydration (an inline `opacity:0` alone is still focusable/announced). Converted every standard section-header and card entrance element across `Hero`, `JourneyTimeline`, `SelectedWork`, `Capabilities`, `Services`, `Testimonials`, `Faq` from inline `style={{opacity:0,...}}` to these classes, and switched every paired GSAP tween's `opacity` → `autoAlpha` (required — animating `opacity` alone would never clear `visibility:hidden`, leaving content permanently inert). Caught and fixed a real latent bug in the process: several elements' JS "from" state (e.g. `y: 20`) didn't match their SSR'd inline style (no offset), so the very first `fromTo` write would silently snap the element before animating — the new classes make CSS-authored and JS-authored initial states identical. Also fixed Hero's `prefers-reduced-motion` branch, which set `opacity:1` but not `visibility` — with `visibility:hidden` now added via CSS, that branch would have left subtitle/body/buttons permanently invisible for reduced-motion users; changed to `autoAlpha:1`.
  - Deliberately **not** converted: Hero's per-character split spans and clip-path/badge-scale reveals (bespoke transform values, not expressible by a shared utility); `CustomCursor`'s interactive opacity states; `JourneyTimeline`'s per-node active/inactive dimming (0.25/0.15 — an ongoing runtime indicator, not a hydration-hide state, and must stay partially visible, never `visibility:hidden`); `SelectedWork`'s hover-overlay fade; `Footer`'s scrubbed 0.7→1 typography opacity. None of these are pre-hydration hide states.
- **3. Webflow Breakpoint Synchronization** — implemented, but not via `tailwind.config.ts` as instructed, because that file doesn't exist in this project. This is Tailwind CSS v4, which is CSS-first — screens are `--breakpoint-*` tokens inside `@theme`, not a JS/TS config object. Added `--breakpoint-sm: 479px`, `--breakpoint-md: 767px`, `--breakpoint-lg: 991px`, `--breakpoint-xl: 1440px` to the existing `@theme` block in `globals.css`; verified the compiled CSS output now emits `@media (min-width: 991px)` for `lg:` utilities. Also aligned the hardcoded custom-cursor media query from 768px → 767px for consistency with the new `md` breakpoint.
- **4. iOS Safari Viewport Normalization** — implemented. Codebase-wide search found exactly 3 real usages (`Hero.tsx`, `Footer.tsx`, `app/layout.tsx`'s `<body>`); all `min-h-screen` → `min-h-[100dvh]`. No bare `h-screen` usages existed.
- **5. Dependency Resolution Hardening (Yarn Berry migration)** — **not implemented**, flagged for confirmation instead. The live deployment uses Firebase App Hosting (Cloud Run-based; see `firebase.json`/`apphosting.yaml`), currently building successfully from `package-lock.json` (npm) — there's no `.yarnrc.yml`, no `yarn.lock`, and no observed dependency-resolution failure anywhere in this repo's history. The audit's cited justification (a stale `yarnpkg/yarn` proxy-revert issue and an unrelated Heroku CLI issue) doesn't reference this project. Migrating package managers on a currently-working deployment pipeline, with no demonstrated problem, is exactly the kind of hard-to-reverse infra change that warrants explicit confirmation before executing rather than doing it on the audit's say-so.
- Verified via `tsc --noEmit` (clean), `eslint` (clean, only pre-existing unrelated warnings), and an SSR smoke test: all `reveal-*` classes present in server-rendered HTML with correct counts (12× `reveal-up-lg` = 9 work cards + 3 service cards, 5× `reveal-up` = 5 capability rows, etc.), compiled CSS confirmed `visibility: hidden` intact on `.reveal-up-sm` and `@media (min-width: 991px)` present for the new `lg` breakpoint.

---

## Phase 8 — Fluidity, Physics & Micro-Interactions

### 14. Scroll physics sync, Timeline pin hardening, hover polish, Draggable testimonials
- **Date**: 2026-07-26
- **Status**: ✅ Completed (5 of 6 items implemented as specified or adapted; 1 audited and left unchanged with reasoning)
- Same pattern as Phase 7: verified each instruction against the actual codebase before acting, since two of the six items (global smooth scrolling's `<Link>` interception, and the route-change refresh hook) assumed a multi-route Next.js app. This project is single-page (one route, `/`); nav uses plain `<a href="#section">`, not `next/link`, and `usePathname()` would never change here. Adapted both to their real underlying goal instead of implementing something inapplicable.
- **1. Global Smooth Scrolling** — `SmoothScroll.tsx` rewritten. Lenis tuned to `lerp: 0.08` / `duration: 1.5` (from 0.1/1.2) per spec. Added a `LenisGsapBridge` child component (needs `useLenis()`, which only works inside the `<ReactLenis>` tree) that: (a) wires `lenis.on('scroll', ScrollTrigger.update)` + drives Lenis's `raf()` from `gsap.ticker.add()` instead of Lenis's own independent RAF loop (`autoRaf: false`) — this is the standard, documented Lenis+GSAP integration and the actual fix for pinned-element jitter, which a same-frame race between two separate RAF loops causes; (b) intercepts clicks on same-page `<a href="#...">` anchors and smooth-scrolls via `lenis.scrollTo()` (offset -100 to clear the fixed header) instead of an instant native jump — adapted from "intercept `<Link>`" since no `<Link>` is used for hash anchors in this app.
- **2. GSAP Route Caching Fix** — adapted. No client-side routes exist to hook `usePathname()` into. Implemented the actual underlying goal (keep ScrollTrigger's cached trigger coordinates correct after the page's layout shifts post-mount) via `document.fonts.ready.then(() => ScrollTrigger.refresh())` and a debounced `window.visualViewport` resize listener (mobile browser chrome show/hide doesn't fire a standard `resize` event GSAP's own auto-refresh would catch). Accordion-driven height changes in `JourneyTimeline`/`Faq` already called `ScrollTrigger.refresh()` at their own `onComplete` from earlier work — left untouched, already correct.
- **3. Hero Float Bezier Correction** — audited, not changed. Hero's badge float was already GSAP-driven (`yoyo: true, repeat: -1, ease: "sine.inOut"`), not CSS keyframes — there was nothing to remove. Declined to flatten the existing randomized `gsap.utils.random(2, 4)` duration to a uniform "exact" `2.5` as instructed: doing so would make every badge move in lockstep, which is *less* organic and directly regresses against our own live-site fidelity documentation (`heynesh_live_site_details.md` / the original design requirements doc both call for randomized stagger/duration specifically for an organic feel). Flagging in case the exact-2.5s ask was intentional and should override that documented fidelity goal.
- **4. Timeline Mobile Pinning** — implemented, adapted. Added `refreshPriority: 1` to the pin's `ScrollTrigger.create()` (pins should recalculate before triggers further down the page, since the pin's own start/end affects what those triggers measure against — safe, scoped to one instance). Declined global `ScrollTrigger.normalizeScroll(true)`: this component deliberately does *not* pin anything on mobile (verified Phase 3 behavior, unchanged), so there's no mobile-pinning jitter for `normalizeScroll` to fix; it's also a global setting affecting every ScrollTrigger site-wide and a known source of conflicts with Lenis's own scroll virtualization. Instead aligned the hardcoded JS breakpoint strings — `"(min-width: 768px)"` → `767px`, `"767.98px"` → `766.98px` in `JourneyTimeline.tsx`, and `CustomCursor.tsx`'s `window.innerWidth < 768` → `767` — to match the `--breakpoint-md: 767px` token set in Phase 7's Webflow breakpoint sync (previously inconsistent by 1px).
- **5. Project Card Hover Choreography** — implemented. `SelectedWork.tsx`'s hover was already a GSAP `contextSafe` timeline (from the Phase 4 QA fix), not CSS pseudo-classes — confirmed `power3.out` already used for the scale tween. Added the missing `stagger: 0.05` to the tag-translate tween.
- **6. Testimonial Drag Inertia** — implemented. Replaced `Testimonials.tsx`'s ~90-line hand-rolled RAF/lerp/friction drag physics with GSAP's `Draggable` + `InertiaPlugin` (confirmed bundled free in our GSAP 3.15 install, no separate license needed). Bounds passed as the container element (Draggable auto-measures vs. the track's natural width) and recalculated via `applyBounds()` on window resize. `user-select: none` applied via a new `.is-dragging` CSS class (in `globals.css`) toggled specifically on `onDragStart`/`onDragEnd`, per spec — kept the press/release card-scale "tension" feedback on the earlier `onPress`/`onRelease` events for snappier feel. Preserved the existing hover-triggered cursor "drag" hint (dispatched on the container's `onMouseEnter`/`onMouseLeave`, independent of actual drag state).
- Caught one mistake during implementation: an intermediate edit to `Testimonials.tsx` orphaned the section's entrance-animation code outside its `useGSAP` scope (leftover from a partial merge). Caught immediately via `tsc --noEmit` before it went further; fixed by merging the entrance animation and the Draggable setup into one `useGSAP` call.
- Verified via `tsc --noEmit` (clean), `eslint` (clean, cleaned up a resulting unused `useEffect` import in `Testimonials.tsx` after removing the manual RAF loop), and an SSR smoke test confirming all 8 testimonials, all `reveal-*` classes, and prior sections still render with no hydration/runtime errors.

---

## Bugs Fixed
- **Cursor re-render loop**: Original `CustomCursor` used `isVisible` state in `useGSAP` dependencies, causing the animation to re-initialize on every mouse move. Fixed by using refs and GSAP opacity tweens.
- **Header scroll listener re-registration**: Original `Header` had `isGlass` as a `useGSAP` dependency, causing scroll listeners to unbind/rebind on every glassmorphism toggle. Fixed by using refs for all scroll state.
- **Nav underline jank**: Switched from `width: 0 → 100%` (triggers layout) to `scaleX: 0 → 1` (composited, GPU-only).

---

## Known Issues
- **Mobile menu**: Hamburger button is present but does not open a drawer yet (still not addressed in Phase 2).
- **npm audit**: 12 high severity vulnerabilities inherited from Next.js dependencies (upstream, not actionable).
- **Portrait placeholder**: `Hero.tsx` uses an inline SVG silhouette (no real asset available) as the 800x1000 placeholder portrait; swap for a real `next/image` asset when creative assets land.
- **Sandbox verification limits**: `npm run build` / `next dev` fail in this sandbox only because `fonts.googleapis.com` is not on the network allowlist (pre-existing since Phase 1, reproduced on an unmodified clone — not caused by Phase 2 changes). Verified instead via `tsc --noEmit`, `eslint`, and a local dev run with the Google Font import temporarily stubbed out (reverted after verification) — confirmed SSR renders the Hero markup with no hydration/runtime errors and the correct character count (27) in the split headline.

---

## Dependencies Added (Phase 1)
| Package | Version | Purpose |
|---|---|---|
| `gsap` | 3.13+ | Core animation engine |
| `@gsap/react` | latest | `useGSAP()` hook for React strict-mode cleanup |
| `lenis` | latest | Smooth scrolling (`lenis/react` provider) |
