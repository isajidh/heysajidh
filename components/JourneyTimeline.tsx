"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ============================================
   TIMELINE DATA
   ============================================ */

interface TimelineNode {
  year: number;
  display: string;
  heading: string;
  tag: string;
  timeAgo: string;
  intro: string;
  expanded: string;
  /** Unique hue for the SVG placeholder gradient (0-360) */
  hue: number;
}

const TIMELINE_DATA: TimelineNode[] = [
  {
    year: 2019,
    display: "'19",
    heading: "Starting out with my brother",
    tag: "@stefan",
    timeAgo: "7 years ago",
    intro:
      "My brother Stefan showed me Webflow. I bothered him with questions for three months straight. He probably regrets it.",
    expanded:
      "My brother Stefan, a UX designer, opened Webflow and created something right in front of me. I had no idea what I was doing but I couldn't close the laptop. No master plan, no career goal. Just a guy who found something and couldn't let go. Three months of late nights and annoying my brother with questions later, I knew this was it.",
    hue: 260,
  },
  {
    year: 2020,
    display: "'20",
    heading: "First freelance steps",
    tag: "@webflow",
    timeAgo: "6 years ago",
    intro:
      "First real client. First real panic. Working for yourself and working for someone else are completely different.",
    expanded:
      "Practicing on my own was comfortable. Then someone trusted me with their project and suddenly every pixel mattered in a way it didn't before. That first year of client work taught me more than six months of practice ever did. Not because the projects were complex but because someone was counting on me to get it right.",
    hue: 220,
  },
  {
    year: 2021,
    display: "'21",
    heading: "Beyond what I knew",
    tag: "@fiftyseven",
    timeAgo: "5 years ago",
    intro:
      "A biotech project that made me think this isn't possible in Webflow. Turns out it was.",
    expanded:
      "When FIFTYSEVEN sent me the brief for Roswell Biotech, my first thought was honestly this can't be done in Webflow. The design demanded pixel-perfect execution, the functionality was complex, and I had to teach myself JavaScript mid-project to make it work. Scariest project I ever took on. Also the one that changed how I approach everything after it.",
    hue: 180,
  },
  {
    year: 2022,
    display: "'22",
    heading: "Leveling up",
    tag: "@gsap",
    timeAgo: "4 years ago",
    intro:
      "The year animations and CMS stopped being extras and started shaping how every project feels.",
    expanded:
      "GSAP went from something I used occasionally to something that shaped every project. Animations weren't decoration anymore, they were part of how a site communicates. On the CMS side I kept finding cleaner and smarter ways to structure content, setups that made managing a site effortless for clients. Everything I worked on this year started feeling more intentional.",
    hue: 150,
  },
  {
    year: 2023,
    display: "'23",
    heading: "From trust to referrals",
    tag: "@clients",
    timeAgo: "3 years ago",
    intro:
      "No pitch. No portfolio review. Just clients telling people 'work with Nenad.' That hit different.",
    expanded:
      "Clients I'd worked with came back with new projects. Some recommended me to people I'd never met. No interview, no portfolio walkthrough, just 'work with Nenad, he delivers.' That kind of trust isn't something you can put in a case study. But it's the thing I'm most proud of.",
    hue: 40,
  },
  {
    year: 2024,
    display: "'24",
    heading: "A life-changing year",
    tag: "@family",
    timeAgo: "2 years ago",
    intro:
      "I got married. My daughter Djina was born. Suddenly everything I do has a deeper reason behind it.",
    expanded:
      "Before this year I thought I understood what motivation meant. I had no idea. Nothing makes you sharper at work than knowing exactly who you're coming home to. Djina changed how I see everything, not just life, but how I show up for every single thing I do.",
    hue: 330,
  },
  {
    year: 2026,
    display: "'26",
    heading: "The journey continues",
    tag: "@nenad",
    timeAgo: "Just now",
    intro:
      "Seven years in. Still obsessed. Now figuring out how AI fits into what I do.",
    expanded:
      "The industry doesn't stand still and neither do I. After seven years of working, learning, and evolving, AI has opened up a whole new layer of what's possible. Same obsession, new tools. The best work is still ahead.",
    hue: 280,
  },
];

/* ============================================
   PLACEHOLDER IMAGE COMPONENT
   ============================================ */

function NodeImage({ hue, year }: { hue: number; year: number }) {
  const id = `timeline-grad-${year}`;
  return (
    <svg
      viewBox="0 0 600 400"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Timeline image for ${year}`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 30%, 12%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 40%, 6%)`} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="40%" r="55%">
          <stop
            offset="0%"
            stopColor={`hsl(${hue}, 60%, 50%)`}
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor={`hsl(${hue}, 60%, 50%)`}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#${id}-bg)`} />
      <rect width="600" height="400" fill={`url(#${id}-glow)`} />
      {/* Abstract geometric accent */}
      <circle
        cx="300"
        cy="200"
        r="60"
        fill="none"
        stroke={`hsl(${hue}, 50%, 35%)`}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="300"
        cy="200"
        r="100"
        fill="none"
        stroke={`hsl(${hue}, 50%, 25%)`}
        strokeWidth="0.5"
        opacity="0.3"
      />
      <text
        x="300"
        y="208"
        textAnchor="middle"
        fill={`hsl(${hue}, 40%, 45%)`}
        fontSize="28"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        opacity="0.6"
      >
        {year}
      </text>
    </svg>
  );
}

/* ============================================
   SINGLE TIMELINE NODE
   ============================================ */

interface TimelineNodeProps {
  node: TimelineNode;
  index: number;
  nodeRef: (el: HTMLDivElement | null) => void;
  imageWrapRef: (el: HTMLDivElement | null) => void;
  imageInnerRef: (el: HTMLDivElement | null) => void;
  accordionWrapRef: (el: HTMLDivElement | null) => void;
  accordionInnerRef: (el: HTMLDivElement | null) => void;
  onToggleAccordion: (index: number) => void;
  isLast: boolean;
}

function TimelineNodeCard({
  node,
  index,
  nodeRef,
  imageWrapRef,
  imageInnerRef,
  accordionWrapRef,
  accordionInnerRef,
  onToggleAccordion,
  isLast,
}: TimelineNodeProps) {
  return (
    <div
      ref={nodeRef}
      className="timeline-node relative pb-16 last:pb-0"
      style={{ opacity: 0.25 }}
    >
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className="absolute left-[15px] top-[40px] w-px bg-border-divider md:left-[19px]"
          style={{ height: "calc(100% - 40px)" }}
        />
      )}

      {/* ── Year dot + meta ── */}
      <div className="mb-4 flex items-center gap-4">
        {/* Dot */}
        <div className="relative z-10 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border border-border-divider bg-surface-primary md:h-[38px] md:w-[38px]">
          <span className="text-[0.65rem] font-semibold text-text-secondary md:text-[0.75rem]">
            {node.display}
          </span>
        </div>

        {/* Meta line: heading + tag + time */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border-divider bg-surface-primary/70 px-3 py-1 text-[0.7rem] font-medium text-text-secondary backdrop-blur-sm">
            {node.tag}
          </span>
          <span className="text-[0.7rem] text-text-secondary/60">
            {node.timeAgo}
          </span>
        </div>
      </div>

      {/* ── Content card ── */}
      <div className="ml-[15px] border-l border-border-divider pl-6 md:ml-[19px] md:pl-8">
        {/* Heading */}
        <h3
          className="mb-3 font-semibold leading-[1.2] text-text-primary"
          style={{ fontSize: "var(--font-size-h3)" }}
        >
          {node.heading}
        </h3>

        {/* Intro paragraph */}
        <p className="mb-4 max-w-lg leading-[1.6] text-text-secondary">
          {node.intro}
        </p>

        {/* ── Image parallax reveal ── */}
        <div
          ref={imageWrapRef}
          className="image-wrap mb-4 overflow-hidden rounded-xl"
          style={{ height: 0 }}
        >
          <div
            ref={imageInnerRef}
            className="image-inner aspect-[3/2] w-full max-w-[500px] will-change-transform"
            style={{ transform: "translateY(-30%)" }}
          >
            <NodeImage hue={node.hue} year={node.year} />
          </div>
        </div>

        {/* ── Accordion: "Read more" ── */}
        <div
          ref={accordionWrapRef}
          className="accordion-wrap overflow-hidden"
          style={{ maxHeight: 0 }}
        >
          <div ref={accordionInnerRef} className="accordion-inner pb-4">
            <p className="mb-2 font-bold uppercase tracking-[0.04em] text-text-primary text-[0.75rem]">
              {node.year}
            </p>
            <h4 className="mb-2 text-lg font-semibold text-text-primary">
              {node.heading}
            </h4>
            <p className="max-w-lg leading-[1.7] text-text-secondary">
              {node.expanded}
            </p>
          </div>
        </div>

        {/* Read more trigger */}
        <button
          onClick={() => onToggleAccordion(index)}
          className="accordion-trigger group flex items-center gap-2 text-[0.8rem] font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary"
        >
          <span className="accordion-label">Read more</span>
          {/* Plus icon that rotates to X */}
          <span
            className="accordion-icon relative flex h-5 w-5 items-center justify-center rounded-full border border-border-divider transition-colors duration-200 group-hover:border-text-secondary"
          >
            {/* Horizontal line */}
            <span className="absolute h-px w-2.5 bg-current" />
            {/* Vertical line — rotates away on open */}
            <span className="accordion-v-line absolute h-2.5 w-px bg-current transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  // Callback-ref arrays for timeline nodes and their sub-elements
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which accordions are open (ref-based, no re-renders)
  const openAccordionsRef = useRef<Set<number>>(new Set());

  // Ref factories for the callback-ref pattern
  const makeNodeRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      nodeRefs.current[i] = el;
    },
    []
  );
  const makeImageWrapRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      imageWrapRefs.current[i] = el;
    },
    []
  );
  const makeImageInnerRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      imageInnerRefs.current[i] = el;
    },
    []
  );
  const makeAccordionWrapRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      accordionWrapRefs.current[i] = el;
    },
    []
  );
  const makeAccordionInnerRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      accordionInnerRefs.current[i] = el;
    },
    []
  );

  // Accordion toggle handler — imperative GSAP, no React state
  const handleToggleAccordion = useCallback((index: number) => {
    const wrap = accordionWrapRefs.current[index];
    const inner = accordionInnerRefs.current[index];
    const node = nodeRefs.current[index];
    if (!wrap || !inner || !node) return;

    const isOpen = openAccordionsRef.current.has(index);
    const trigger = node.querySelector(".accordion-trigger");
    const vLine = node.querySelector(".accordion-v-line");
    const label = node.querySelector(".accordion-label");

    if (isOpen) {
      // ── Collapse ──
      openAccordionsRef.current.delete(index);
      gsap.to(wrap, {
        maxHeight: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          // Refresh ScrollTrigger after DOM height change
          ScrollTrigger.refresh();
        },
      });
      if (vLine) gsap.to(vLine, { rotation: 0, duration: 0.3, ease: "power2.out" });
      if (label) label.textContent = "Read more";
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    } else {
      // ── Expand: measure natural height ──
      openAccordionsRef.current.add(index);
      const naturalHeight = inner.scrollHeight;
      gsap.to(wrap, {
        maxHeight: naturalHeight,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });
      if (vLine) gsap.to(vLine, { rotation: 90, duration: 0.3, ease: "power2.out" });
      if (label) label.textContent = "Read less";
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    }
  }, []);

  /* ============================================
     GSAP SETUP — ALL SCROLLTRIGGERS
     ============================================ */
  useGSAP(
    () => {
      const section = sectionRef.current;
      const leftCol = leftColRef.current;
      if (!section || !leftCol) return;

      const mm = gsap.matchMedia();

      // ══════════════════════════════════════
      // DESKTOP (≥ 768px) — Pin + intersection
      // ══════════════════════════════════════
      mm.add("(min-width: 768px)", () => {
        // ── Pin the left column ──
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: leftCol,
          pinSpacing: false,
        });

        // ── Per-node intersection triggers ──
        nodeRefs.current.forEach((node, i) => {
          if (!node) return;

          ScrollTrigger.create({
            trigger: node,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () => activateNode(i),
            onEnterBack: () => activateNode(i),
            onLeave: () => deactivateNode(i),
            onLeaveBack: () => deactivateNode(i),
          });
        });
      });

      // ══════════════════════════════════════
      // MOBILE (< 768px) — Simple opacity reveals
      // ══════════════════════════════════════
      mm.add("(max-width: 767.98px)", () => {
        nodeRefs.current.forEach((node, i) => {
          if (!node) return;

          // Simple fade-in on scroll
          gsap.fromTo(
            node,
            { opacity: 0.15, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: node,
                start: "top 85%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Images start revealed on mobile
          const imageWrap = imageWrapRefs.current[i];
          const imageInner = imageInnerRefs.current[i];
          if (imageWrap) gsap.set(imageWrap, { height: "auto" });
          if (imageInner) gsap.set(imageInner, { y: 0 });
        });
      });

      // ── Section heading entrance animation ──
      const headingEl = leftCol.querySelector(".journey-heading");
      const subtitleEl = leftCol.querySelector(".journey-subtitle");
      const introEl = leftCol.querySelector(".journey-intro");

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
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

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
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (introEl) {
        gsap.fromTo(
          introEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ── Helper: activate a timeline node ──
      function activateNode(i: number) {
        const node = nodeRefs.current[i];
        const imageWrap = imageWrapRefs.current[i];
        const imageInner = imageInnerRefs.current[i];
        if (!node) return;

        // Highlight this node
        gsap.to(node, { opacity: 1, duration: 0.4, ease: "power2.out" });

        // Dim all other nodes
        nodeRefs.current.forEach((otherNode, j) => {
          if (j !== i && otherNode) {
            gsap.to(otherNode, { opacity: 0.25, duration: 0.4, ease: "power2.out" });
          }
        });

        // Image parallax reveal
        if (imageWrap && imageInner) {
          // Measure natural height from the inner content
          const naturalHeight = imageInner.getBoundingClientRect().height;
          gsap.to(imageWrap, {
            height: naturalHeight,
            duration: 0.7,
            ease: "power3.out",
          });
          gsap.to(imageInner, {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        }
      }

      // ── Helper: deactivate a timeline node ──
      function deactivateNode(i: number) {
        const node = nodeRefs.current[i];
        const imageWrap = imageWrapRefs.current[i];
        const imageInner = imageInnerRefs.current[i];
        if (!node) return;

        gsap.to(node, { opacity: 0.25, duration: 0.4, ease: "power2.out" });

        // Collapse image
        if (imageWrap && imageInner) {
          gsap.to(imageWrap, {
            height: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
          gsap.to(imageInner, {
            y: "-30%",
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }

      // Cleanup handled automatically by useGSAP + matchMedia revert
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  /* ============================================
     RENDER
     ============================================ */
  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-6 px-4 md:px-6">
        {/* ── Left Column: Pinned section heading ── */}
        <div
          ref={leftColRef}
          className="col-span-12 mb-12 md:col-span-4 md:mb-0"
        >
          <div className="md:sticky md:top-0 md:pt-24">
            <p
              className="journey-subtitle mb-4 font-medium uppercase tracking-[0.04em] text-text-secondary"
              style={{ fontSize: "var(--font-size-caption)", opacity: 0 }}
            >
              Start small grow big
            </p>
            <h2
              className="journey-heading mb-6 font-semibold leading-[1.1] tracking-[-0.01em] text-text-primary"
              style={{ fontSize: "var(--font-size-h2)", opacity: 0 }}
            >
              About Me
              <br />
              <span className="text-text-secondary">(&)</span> My Journey
            </h2>
            <p
              className="journey-intro max-w-sm leading-[1.6] text-text-secondary"
              style={{ opacity: 0 }}
            >
              Seven years ago I opened Webflow for the first time. What happened
              after that is easier to show than explain.
            </p>
          </div>
        </div>

        {/* ── Right Column: Scrollable timeline ── */}
        <div className="col-span-12 md:col-span-8">
          <div className="md:pt-24">
            {TIMELINE_DATA.map((node, i) => (
              <TimelineNodeCard
                key={node.year}
                node={node}
                index={i}
                nodeRef={makeNodeRef(i)}
                imageWrapRef={makeImageWrapRef(i)}
                imageInnerRef={makeImageInnerRef(i)}
                accordionWrapRef={makeAccordionWrapRef(i)}
                accordionInnerRef={makeAccordionInnerRef(i)}
                onToggleAccordion={handleToggleAccordion}
                isLast={i === TIMELINE_DATA.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
