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
