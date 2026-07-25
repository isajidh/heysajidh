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
      className={`work-card col-span-12 ${gridClass}`}
      style={{ opacity: 0, transform: "translateY(60px)" }}
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
          {/* Parallax image — 120% height for scroll movement */}
          <div
            ref={imageRef}
            className="work-image absolute inset-0 h-[120%] w-full will-change-transform transition-transform duration-500 ease-out group-hover:scale-105"
            style={{ transform: "translateY(0)" }}
          >
            <ProjectImage hue={project.hue} title={project.title} />
          </div>

          {/* 10% dark overlay — fades on hover */}
          <div className="work-overlay pointer-events-none absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
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
                  className="work-tag inline-flex items-center rounded-full border border-border-divider px-3 py-0.5 text-[0.7rem] font-medium text-text-secondary transition-transform duration-300 group-hover:translate-x-1"
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
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Section heading entrance ──
      const headingEl = section.querySelector(".work-section-heading");
      const subtitleEl = section.querySelector(".work-section-subtitle");
      const bodyEl = section.querySelector(".work-section-body");

      if (subtitleEl) {
        gsap.fromTo(
          subtitleEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
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
          { opacity: 0, y: 40 },
          {
            opacity: 1,
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
          { opacity: 0, y: 20 },
          {
            opacity: 1,
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

      // ── Per-card: scroll entrance + image parallax ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        // Card entrance — fade in + translate up
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        // Inverse image parallax — scrubbed
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
      });
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
            className="work-section-subtitle mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)", opacity: 0 }}
          >
            Selected Work
          </p>
          <h2
            className="work-section-heading mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)", opacity: 0 }}
          >
            Built in Webflow,
            <br />
            Made to Perform
          </h2>
          <p
            className="work-section-body max-w-xl leading-[1.6] text-text-secondary"
            style={{ fontSize: "var(--font-size-body-lg)", opacity: 0 }}
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
