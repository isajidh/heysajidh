# heynesh.com — Accurate Design Details (Extracted from Live Site)

> **Source**: https://heynesh.com/ (fetched 2026-07-25)
> **Last Published**: Mon Jul 20 2026 10:10:07 GMT+0000
> **Platform**: Built in Webflow
> **Title**: Creative Webflow Developer — Nenad Popadic | NESH®

---

## 1. Critical Color Correction

> [!IMPORTANT]
> The previous design analysis estimated the accent color as `#8B5CF6` (purple).
> The **actual accent color** extracted from the live CSS is **`#FFFF23` (neon yellow)**.
> This is used for active nav states, work card hover arrows, swiper bullets, and social link hovers.

### Verified Color Palette (from live CSS)

| Token | Hex Value | Source / Usage |
|---|---|---|
| **Accent Primary** | `#FFFF23` | Active nav items, work card arrow hover, swiper active bullet, social hover icon |
| **Nav Item Hover BG** | `#C9C8BA` | Navigation item background on hover (light mode state) |
| **Nav Item Dark Hover** | `rgba(94, 94, 94, 0.50)` | Nav item hover in dark/scrolled state |
| **Work Arrow Dim BG** | `#2F2F2F` | Work card arrow wrap when another card is hovered |
| **Work Arrow Dim Text** | `#8C8C8C` | Work card arrow text when dimmed |
| **Social Link Hover** | `#C9C8BA` | Social icon background on hover |
| **Social Dark Hover** | `#5E5E5E` | Social icon dark variant hover |
| **FAQ Icon Hover** | `#EDECDA` | FAQ toggle icon background on hover |
| **H2 Gradient (dark)** | `linear-gradient(266deg, #3d3d3d 11.86%, #000 92.59%)` | Section headings gradient text |
| **H2 Gradient (white)** | `linear-gradient(89deg, #d5d5d5 7.42%, #fff 95.11%)` | White variant heading gradient |

---

## 2. Header / Navigation

### Logo
- SVG wordmark "NESH" with a separate ® symbol (SVG copyright icon)
- Logo transitions from yellow text on transparent → black text on yellow background as user scrolls

### Top Bar (above nav)
- Contains: Profile image (left), description text (center), stats cards (right)
- Description text: "Working closely with your team to deliver Webflow builds that merge creativity, technical excellence, and long-term value."
- Stats cards: "80+ Projects" and "7+ Years of experience" (with Webflow icon)
- Social links: X (Twitter), LinkedIn

### Navigation Links (exact casing)
1. `Home` → `#hero`
2. `About me` → `#about`
3. `projects` → `#projects` (lowercase 'p')
4. `What you get` → `#overview`
5. `Services` → `#services`
6. `clients` → `#testimonial` (lowercase 'c')
7. `Faq` → `#faq`

Each nav item has:
- An icon (SVG) beside the text
- A background pill that scales in on scroll
- Active state: yellow background (#FFFF23), black text

### Right Side
- Email: `nenad@popadic.co`
- Tooltip: "Copy to clipboard"
- CTA: "Book a Call" button (links to cal.com/nenad-popadic/intro-call)
- Mobile: "Book a Call" button + hamburger menu icon (two rounded rectangles)

### Scroll Behavior (from data attributes)
- Navigation transforms from hero-integrated layout to compact sticky bar via GSAP ScrollTrigger
- Logo FLIP animation from large hero placement to compact nav position
- Stats cards FLIP from hero to nav bar
- Nav items scale in sequentially with staggered scroll triggers
- Backdrop blur: `blur(15px)` on `.nav-webflow-bg`

---

## 3. Hero Section

### Left Column Text
- Subtitle: "The Webflow Expert. That's Nenad."
- Main Heading: "Webflow, Applied Differently."
- Body: "Working closely with your team to deliver Webflow builds that merge creativity, technical excellence, and long-term value."
- Buttons: "Book a Call" | "About Me"

### Right Column
- Profile image: Nenad Popadic portrait (AVIF format, 1670px wide)
- Image blurs and fades on scroll (blur: 0px → 90px, opacity: 1 → 0.3)

### Floating Badges
- "80+ Projects" (with Webflow icon)
- "Years of experience" (with "7+" number SVG)
- Trait tags: "Creative", "Reliable", "Strategist", "Builder", "Efficient"

### Entrance Animations
- Hero heading: character-by-character reveal (`.anim-char` class)
- Profile image, nav links, cards, text blocks: all start `opacity: 0; visibility: hidden`
- Line mask overflow reveal for text animations (`.line-mask`)

---

## 4. About Me Timeline

### Section Header
- Label: "Start small grow big"
- Heading: "About Me (&) My Journey"
- Intro: "Seven years ago I opened Webflow for the first time. What happened after that is easier to show than explain."

### Timeline Nodes

| Year | Display | Heading | Tag | Time Ago | Summary |
|---|---|---|---|---|---|
| 2019 | '19 | Starting out with my brother | @stefan | 7years ago | Brother Stefan showed him Webflow, 3 months of questions |
| 2020 | '20 | First freelance steps | @webflow | 6years ago | First real client, first real panic |
| 2021 | '21 | Beyond what I knew | @fiftyseven | 5years ago | Roswell Biotech project, learned JavaScript mid-project |
| 2022 | '22 | Leveling up | @gsap | 4years ago | GSAP became core to every project |
| 2023 | '23 | From trust to referrals | @clients | 3years ago | Clients recommending without portfolio review |
| 2024 | '24 | A life-changing year | @family | 2years ago | Got married, daughter Djina born |
| 2026 | '26 | The journey continues | @nenad | 2hours ago | AI integration, new tools |

Each node has:
- "Read more" expandable accordion
- Associated image
- Year number, heading, tag badge, time-ago label

---

## 5. Selected Work

### Section Header
- Label: "SELECTED WORK"
- Heading: "Built in Webflow, Made to Perform"
- Body: "Over seven years I've helped businesses across different industries turn their ideas into websites that look and work exactly how they imagined. Here's a look at some of that work."

### Portfolio Grid (9 projects)

| # | Tags | Project Name | Description |
|---|---|---|---|
| 01 | Components, GSAP, SEO | 1910.ai | Pioneering small and large molecule therapeutics discovery by integrating multimodal data |
| 02 | CMS, API, Motion | SemiconBio | Fully realizing the promise of molecular electronics with the SemiconBio platform |
| 03 | CMS, GSAP, SEO | Happy Ring | Accuracy validated to strict standards and all-day comfort exceeding expectations |
| 04 | CMS, GSAP, Localization | PSSLTD | Asset and inspection management purpose-built alongside UK councils for over 35 years |
| 05 | CMS, GSAP, SEO | Lilipad | Libraries that come to children where they are, a quiet place to belong |
| 06 | Webflow, Motion | Omicron | Blockchain studio helping Web 3.0 players turn ideas into decentralized products |
| 07 | Components, CMS, GSAP | Puck | Inbound talent solution with personal automation — podcasts to smarter screening |
| 08 | Performance, CMS, API | Alosant | Leading resident experience platform, elevates living for residents and shoppers |
| 09 | CMS, GSAP, Performance | RAY AI | Full-time human assistant from top 0.03% of applicants, with AI fluency |

### Work Card Hover Behavior (from CSS)
- When ANY card in `.work-track` is hovered, ALL other cards get a dark overlay (`opacity: 1`)
- The hovered card's overlay goes to `opacity: 0` (fully visible)
- Arrow wrap: dims to `#2F2F2F` bg / `#8C8C8C` text on non-hovered cards
- Hovered card arrow: `#FFFF23` bg / black text
- Arrow slides: `.work-card-arrow` slides out (margin-left: 100%), `.work-card-arrow-2` slides in (margin: 0%)

---

## 6. Capabilities ("What You Get?")

### Section Header
- Label: "What You Get?"
- Heading: "Capabilities Overview"
- Body: "Strategy, precision, and development combined — turning your vision into a powerful digital experience that feels effortless."

### Capability Items

| # | Title | Description |
|---|---|---|
| 1 | Webflow Development | Fast, scalable websites with clean structure and a CMS setup that puts you in full control |
| 2 | Custom Integrations | Expanding Webflow's capabilities with APIs, third-party tools, and tailored functionality |
| 3 | SEO-Ready Setup | Optimized site structure, speed, and on-page SEO to help your website rank higher and stay visible |
| 4 | Creative & Interactive Motion | Smooth animations and engaging user experiences powered by GSAP and custom interactions |
| 5 | Performance & Technical Optimization | Making your site faster, cleaner, and built to last with technical SEO and performance best practices |

### Hover Behavior
- `.capa-card-item:hover .capa-card-arrow` rotates 180deg
- Disabled on mobile (rotate: 0deg)

---

## 7. Services / Pricing

### Section Header
- Label: "SERVICES"
- Heading: "Solutions That Deliver"
- Body: "Same quality, same attention to detail. The only difference is the size of the project and what you need right now."

### Tier 1: Ongoing Support
- **Price**: $3,000 / 30 hours
- **Subtitle**: "Your dedicated Webflow developer, 30 hours a month. Whatever your site needs, handled."
- **Commitment**: Minimum 3 month commitment
- **Features**:
  - New pages, sections, and features
  - Campaign-driven updates (modules, content blocks, assets)
  - Maintenance, bug fixes, and content updates
  - Technical SEO and performance optimization
  - Unused hours roll over (up to 3 months)
- **Footer**: "For brands that need continuous growth and long-term collaboration."

### Tier 2: Starter Build
- **Price**: $5,000
- **Subtitle**: "A clean Webflow site ready to launch in one to two weeks. Perfect for brands that need a solid online presence without the complexity."
- **Features**:
  - Up to 6 pages
  - CMS setup
  - Mid-level animations and interactions
  - Technical SEO setup
  - Launch within one to two weeks
  - Webflow Editor training after launch
- **Footer**: "For new sites or migrations that need a fast, clean start"

### Tier 3: Custom Project
- **Price**: Book a Call
- **Subtitle**: "High-end Webflow development for complex projects. Every scope is different, so every project starts with a conversation."
- **Features**:
  - Advanced interaction and animation systems
  - Scalable CMS architecture with multi-collection setups
  - Complex layouts, modular components and dynamic content
  - Integration ready structure for external tools and API driven features
  - 14 days post-launch support included
- **Footer**: "For complex projects that go beyond the basics and need a tailored approach."

---

## 8. Transform / CTA Banner

- Main heading: "Transform Your Webflow Experience Journey"
- Body: "Every Webflow site has room to grow. You get a clear view of what works, what holds you back and how to move toward a setup that feels faster, lighter and easier to manage."
- CTA: "Have something in mind? Let's Talk"

---

## 9. Testimonials

### Section Header
- Label: "TESTIMONIALS"
- Heading: "From People I've Worked with"
- Interaction: "drag click" (Swiper-based carousel)

### Testimonials Data

| Name | Role | Company | Quote Theme |
|---|---|---|---|
| Danette Beal | VP of Marketing | Alosant.com | Fantastic long-term partner, exceeds expectations, resolves challenges quickly |
| Petar Stojakovic | Founder | fiftyseven.co | Thinks through the entire experience — motion, pacing, narrative flow |
| Klemen Vute | PM from Povio | Povio.com | Delivered on time, helpful guidance, smarter solutions |
| Johanna Dahlroos | Co-Founder and Creative Director | Moat Agency | Design-focused, reliable, smooth and engaging web experience |
| Marko Ivanovic | (unspecified) | Legacy Agency | Rare blend of speed, quality, and collaboration, product mindset |
| Chrissy Cowdrey | Product/Web Designer | (independent) | Work ethic, fast turnaround, attention to detail, high professional standard |
| Marko Ilic | Founder | see.design | Years of collaboration, surprises with speed and quality |
| Bart-Jan Leyts | CEO | Autorank.com | Exceptional leadership, full ownership, structured approach |

### Carousel Implementation
- Uses **Swiper** (v11) — `swiper-bundle.min.css` loaded from CDN
- Custom pagination: `.swiper-pagination` with flex display, border `1px solid rgba(255,255,255,0.2)`
- Active bullet: width `2.5vw`, background `#FFFF23`
- Cursor set to `none` on `.swiper-wrapper`
- Overflow set to `visible` on `.swiper`

---

## 10. FAQ Section

### Section Header
- Heading: "Got any questions?"

### Questions (8 total)

1. **Why Webflow instead of custom code?**
2. **Already have a Webflow site that needs work?**
3. **What's the process from start to launch?**
4. **Do you work under NDA?**
5. **Do you handle design, or only development?**
6. **What does ongoing support look like?**
7. **How do you handle revisions and feedback?**
8. **Not sure which plan fits your project?** (answer: reach out at nenad@popadic.co)

### Accordion Behavior (from CSS)
- `.faq-list.w--open .faq-answer-wrap`: `grid-template-rows: 1fr` (CSS Grid transition)
- `.faq-toggle.w--open .faq-icon-v-line`: `transform: rotate(90deg)` (plus → X)
- `.faq-toggle:hover .faq-icon`: background `#EDECDA` (disabled on mobile)

---

## 11. Footer

- CTA section leads into footer
- Social links: X (Twitter), LinkedIn
- Email: nenad@popadic.co
- "Not sure which plan fits your project? No stress. Just reach out at nenad@popadic.co and tell me what you have in mind."

---

## 12. Technical Architecture (from source)

### Libraries Used
- **Lenis** — Smooth scroll (same as our implementation)
- **GSAP** — Animations, ScrollTrigger, FLIP plugin
- **Swiper v11** — Testimonials carousel
- **Custom data attributes** for animation declarations:
  - `data-tl-type` — "scroll" | "trigger"
  - `data-tl-trigger` — CSS selector for trigger element
  - `data-tl-start` / `data-tl-end` — ScrollTrigger start/end positions
  - `data-tl-from` / `data-tl-to` — GSAP from/to objects
  - `data-tl-desktop` — Desktop-only animations
  - `data-flip-*` — GSAP FLIP plugin attributes
  - `data-button-hover` — Button hover animation trigger
  - `data-number-count` — Number counter animation
  - `data-tl-split` — Text split animation ("lines", "chars")

### Performance Patterns
- `will-change: width, height, transform` on logo and buttons
- `transform: translateZ(0)` for GPU layer promotion
- `backface-visibility: hidden` to prevent flicker
- `shape-rendering: geometricPrecision` for SVG sharpness
- Safari-specific blur fixes with `translate3d(0,0,0)` and `perspective(1000px)`
- Image lazy loading with `fetchpriority="high"` for hero image

### SEO
- Structured data (JSON-LD) with `@type: Service`, `AggregateRating`, and `Review` entries
- OG meta tags with image, title, description
- Twitter card: `summary_large_image`
- Scroll restoration disabled: `history.scrollRestoration = 'manual'`

### Number Counter Component
- `.number-wrap` → `.digit-mask` → `.digit-track` structure
- Tabular-nums font variant for consistent digit widths
- Vertical digit strip animation (translateY on `.digit-track`)

### Work Card Hover (Desktop Only)
- Collective dimming: when ANY card is hovered, all OTHER cards get overlay
- Arrow swap animation: primary arrow slides out, secondary slides in
- Only active at `min-width: 992px`

---

## 13. Key Design Patterns

### Navigation Transformation
The navigation undergoes a dramatic FLIP-based transformation as the user scrolls through the hero:
1. **Initial state**: Nav items are spread across the hero as floating pills with icons
2. **Scroll trigger**: Around 30-40% through the hero scroll
3. **Final state**: Compact horizontal nav bar with backdrop blur

### Color Architecture (Revised)
The site uses a **warm accent** (neon yellow #FFFF23) against dark backgrounds, NOT purple. The dark backgrounds remain as previously documented (#0A0A0C base), but the accent system is fundamentally different from what was estimated.

### Image Format
- Hero portrait: AVIF format with responsive srcset (500w, 1670w)
- All work card images likely AVIF/WebP

### Responsive Breakpoints
- Desktop: `min-width: 992px` (work card hover effects)
- Mobile: `width < 767px` (entrance animations auto-visible, swiper pagination adjusts, hover effects disabled)
