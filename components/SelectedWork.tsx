"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ============================================
   PROJECT DATA
   ============================================ */

interface Project {
  number: string;
  title: string;
  description: string;
  tags: string[];
  /** Unique hue for SVG placeholder (0-360) */
  hue: number;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "1910.ai",
    description:
      "Pioneering small and large molecule therapeutics discovery by integrating multimodal data.",
    tags: ["Components", "GSAP", "SEO"],
    hue: 260,
  },
  {
    number: "02",
    title: "SemiconBio",
    description:
      "Fully realizing the promise of molecular electronics with the SemiconBio platform.",
    tags: ["CMS", "API", "Motion"],
    hue: 200,
  },
  {
    number: "03",
    title: "Happy Ring",
    description:
      "Accuracy validated to strict standards and all-day comfort exceeding expectations.",
    tags: ["CMS", "GSAP", "SEO"],
    hue: 40,
  },
  {
    number: "04",
    title: "PSSLTD",
    description:
      "Asset and inspection management purpose-built alongside UK councils for over 35 years.",
    tags: ["CMS", "GSAP", "Localization"],
    hue: 150,
  },
  {
    number: "05",
    title: "Lilipad",
    description:
      "Libraries that come to children where they are, a quiet place to belong when stability is rare.",
    tags: ["CMS", "GSAP", "SEO"],
    hue: 120,
  },
  {
    number: "06",
    title: "Omicron",
    description:
      "Blockchain studio helping Web 3.0 players turn ideas into decentralized products.",
    tags: ["Webflow", "Motion"],
    hue: 280,
  },
  {
    number: "07",
    title: "Puck",
    description:
      "Inbound talent solution with personal automation — from podcasts to smarter screening.",
    tags: ["Components", "CMS", "GSAP"],
    hue: 320,
  },
  {
    number: "08",
    title: "Alosant",
    description:
      "The leading resident experience platform, elevates living by keeping residents informed.",
    tags: ["Performance", "CMS", "API"],
    hue: 20,
  },
  {
    number: "09",
    title: "RAY AI",
    description:
      "A full-time human assistant from the top 0.03% of applicants, with AI fluency to give you your time back.",
    tags: ["CMS", "GSAP", "Performance"],
    hue: 240,
  },
];

/* ============================================
   PLACEHOLDER IMAGE — 4:5 aspect SVG
   ============================================ */

function ProjectImage({ hue, title }: { hue: number; title: string }) {
  const id = `work-grad-${title.replace(/[\s.]/g, "")}`;
  return (
    <svg
      viewBox="0 0 800 1000"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${title} project preview`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 25%, 14%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 35%, 6%)`} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="40%" r="60%">
          <stop
            offset="0%"
            stopColor={`hsl(${hue}, 55%, 45%)`}
            stopOpacity="0.2"
          />
          <stop
            offset="100%"
            stopColor={`hsl(${hue}, 55%, 45%)`}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill={`url(#${id}-bg)`} />
      <rect width="800" height="1000" fill={`url(#${id}-glow)`} />
      {/* Decorative circles */}
      <circle
        cx="400"
        cy="450"
        r="120"
        fill="none"
        stroke={`hsl(${hue}, 40%, 30%)`}
        strokeWidth="0.8"
        opacity="0.4"
      />
      <circle
        cx="400"
        cy="450"
        r="200"
        fill="none"
        stroke={`hsl(${hue}, 40%, 20%)`}
        strokeWidth="0.5"
        opacity="0.2"
      />
      {/* Title text */}
      <text
        x="400"
        y="460"
        textAnchor="middle"
        fill={`hsl(${hue}, 30%, 40%)`}
        fontSize="36"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
        opacity="0.4"
      >
        {title}
      </text>
    </svg>
  );
}

/* ============================================
   PROJECT CARD COMPONENT
   ============================================ */

interface ProjectCardProps {
  project: Project;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
  imageRef: (el: HTMLDivElement | null) => void;
}

function ProjectCard({ project, index, cardRef, imageRef }: ProjectCardProps) {
  // Stagger: odd cards left (cols 1-6), even cards right (cols 6-12)
  const isOdd = index % 2 === 0; // 0-indexed, so index 0 = card 01 = "odd"
  const gridClass = isOdd
    ? "md:col-start-1 md:col-span-6 lg:col-span-5"
    : "md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-6";

  // Cursor state dispatch
  const handleMouseEnter = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("cursor-state", { detail: { state: "view" } })
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("cursor-state", { detail: { state: "default" } })
    );
  }, []);

  return (
    <div
      ref={cardRef}
      className={`work-card reveal-up-lg col-span-12 ${gridClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="#"
        className="group block no-underline"
        aria-label={`View ${project.title} project`}
      >
        {/* ── Image container — 4:5 aspect, overflow hidden ── */}
        <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl">
          {/*
            Parallax layer — GSAP scrub owns this element's `transform`
            exclusively (writes a new inline value every scroll frame).
            No CSS `transition` here: a competing CSS transition would
            re-chase every scrubbed frame, fighting `scrub: true`'s
            1:1 scroll-tied responsiveness and lagging behind the scroll.
          */}
          <div
            ref={imageRef}
            className="work-image absolute inset-0 h-[120%] w-full will-change-transform"
            style={{ transform: "translateY(0)" }}
          >
            {/*
              Hover-scale layer — deliberately separate from the parallax
              layer above. GSAP's scrub tween writes inline `transform` on
              the parent every frame; putting a hover-scale `transform` on
              that same element would be silently overridden by the
              inline style (inline style always beats a class rule), so
              the scale target lives one level down instead.
            */}
            <div className="work-image-scale h-full w-full will-change-transform">
              <ProjectImage hue={project.hue} title={project.title} />
            </div>
          </div>

          {/* 10% dark overlay — fades on hover (GSAP-driven, see parent) */}
          <div className="work-overlay pointer-events-none absolute inset-0 bg-black/10" />
        </div>

        {/* ── Card metadata ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Number + tags row */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[0.75rem] font-semibold text-text-secondary/50">
                {project.number}
              </span>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="work-tag inline-flex items-center rounded-full border border-border-divider px-3 py-0.5 text-[0.7rem] font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Project title */}
            <h3
              className="mb-1.5 font-semibold leading-[1.1] text-text-primary"
              style={{ fontSize: "var(--font-size-h3)" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="max-w-md text-[0.85rem] leading-[1.5] text-text-secondary">
              {project.description}
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-divider transition-all duration-300 group-hover:border-text-secondary group-hover:bg-text-primary group-hover:text-global">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-secondary transition-colors duration-300 group-hover:text-global"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ============================================
   MAIN SELECTED WORK COMPONENT
   ============================================ */

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const makeCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  const makeImageRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      imageRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    (_context, contextSafe) => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Section heading entrance ──
      const headingEl = section.querySelector(".work-section-heading");
      const subtitleEl = section.querySelector(".work-section-subtitle");
      const bodyEl = section.querySelector(".work-section-body");

      if (subtitleEl) {
        gsap.fromTo(
          subtitleEl,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (headingEl) {
        gsap.fromTo(
          headingEl,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (bodyEl) {
        gsap.fromTo(
          bodyEl,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 76%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const safe = contextSafe ?? ((fn: () => void) => fn);

      // Native listener cleanups collected here and run in the returned
      // teardown — addEventListener itself isn't a GSAP object useGSAP
      // can track, so it needs manual removal like any React effect.
      const hoverCleanups: Array<() => void> = [];

      // ── Per-card: scroll entrance + image parallax + hover choreography ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        // Card entrance — fade in + translate up
        gsap.to(card, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        // Inverse image parallax — scrubbed, on the dedicated parallax layer
        const image = imageRefs.current[i];
        if (image) {
          gsap.fromTo(
            image,
            { y: "-10%" },
            {
              y: "0%",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // ── Hover choreography — unified GSAP timeline ──
        // Scale, overlay fade, and tag shift all fire on the same
        // timeline so they're genuinely simultaneous (not three CSS
        // transitions with independently drifting durations).
        const scaleTarget = card.querySelector<HTMLElement>(".work-image-scale");
        const overlay = card.querySelector<HTMLElement>(".work-overlay");
        const tags = card.querySelectorAll<HTMLElement>(".work-tag");

        const handleEnter = safe(() => {
          gsap.to(scaleTarget, { scale: 1.05, duration: 0.5, ease: "power3.out" });
          gsap.to(overlay, { opacity: 0, duration: 0.5, ease: "power2.out" });
          gsap.to(tags, { x: 4, duration: 0.3, ease: "power2.out" });
        });

        const handleLeave = safe(() => {
          gsap.to(scaleTarget, { scale: 1, duration: 0.5, ease: "power3.out" });
          gsap.to(overlay, { opacity: 1, duration: 0.5, ease: "power2.out" });
          gsap.to(tags, { x: 0, duration: 0.3, ease: "power2.out" });
        });

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
        hoverCleanups.push(() => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("mouseleave", handleLeave);
        });
      });

      return () => hoverCleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
        {/* ── Section header ── */}
        <div className="mb-16 max-w-3xl md:mb-24">
          <p
            className="work-section-subtitle reveal-up-sm mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            Selected Work
          </p>
          <h2
            className="work-section-heading reveal-up-md mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)" }}
          >
            Built in Webflow,
            <br />
            Made to Perform
          </h2>
          <p
            className="work-section-body reveal-up-sm max-w-xl leading-[1.6] text-text-secondary"
            style={{ fontSize: "var(--font-size-body-lg)" }}
          >
            Over seven years I&apos;ve helped businesses across different
            industries turn their ideas into websites that look and work exactly
            how they imagined. Here&apos;s a look at some of that work.
          </p>
        </div>

        {/* ── Staggered grid ── */}
        <div className="grid grid-cols-12 gap-y-16 md:gap-y-24 lg:gap-y-32">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={i}
              cardRef={makeCardRef(i)}
              imageRef={makeImageRef(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
