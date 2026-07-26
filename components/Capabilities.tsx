"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface CapabilityItem {
  number: string;
  title: string;
  description: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    number: "01",
    title: "Webflow Development",
    description:
      "Fast, scalable websites with clean structure and a CMS setup that puts you in full control.",
  },
  {
    number: "02",
    title: "Custom Integrations",
    description:
      "Expanding Webflow's capabilities with APIs, third-party tools, and tailored functionality.",
  },
  {
    number: "03",
    title: "SEO-Ready Setup",
    description:
      "Optimized site structure, speed, and on-page SEO to help your website rank higher and stay visible.",
  },
  {
    number: "04",
    title: "Creative & Interactive Motion",
    description:
      "Smooth animations and engaging user experiences powered by GSAP and custom interactions.",
  },
  {
    number: "05",
    title: "Performance & Technical Optimization",
    description:
      "Making your site faster, cleaner, and built to last with technical SEO and performance best practices.",
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const makeLineRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      lineRefs.current[i] = el;
    },
    []
  );

  const makeContentRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      contentRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Section header entrance
      const subtitleEl = section.querySelector(".capa-section-subtitle");
      const headingEl = section.querySelector(".capa-section-heading");
      const bodyEl = section.querySelector(".capa-section-body");

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

      // Line drawing (scaleX: 0 -> 1) & Text reveals
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        const content = contentRefs.current[i];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // 1. Line draws across screen using scaleX for 60fps performance
        tl.to(line, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.inOut",
        });

        // 2. Text reveals upward right after/as line draws
        if (content) {
          tl.to(
            content,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.4"
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
        {/* ── Section Header ── */}
        <div className="mb-16 max-w-3xl md:mb-24">
          <p
            className="capa-section-subtitle reveal-up-sm mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            What You Get?
          </p>
          <h2
            className="capa-section-heading reveal-up-md mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)" }}
          >
            Capabilities Overview
          </h2>
          <p
            className="capa-section-body reveal-up-sm max-w-xl leading-[1.6] text-text-secondary"
            style={{ fontSize: "var(--font-size-body-lg)" }}
          >
            Strategy, precision, and development combined — turning your vision
            into a powerful digital experience that feels effortless.
          </p>
        </div>

        {/* ── Capabilities List ── */}
        <div className="flex flex-col">
          {CAPABILITIES.map((cap, i) => (
            <div key={cap.number} className="group relative">
              {/* Razor-thin 1px horizontal divider line */}
              <div
                ref={makeLineRef(i)}
                className="h-[1px] w-full bg-border-divider origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />

              {/* Content Row */}
              <div
                ref={makeContentRef(i)}
                className="reveal-up grid grid-cols-12 items-center gap-4 py-8 md:py-10 will-change-transform"
              >
                {/* Left Column: Number + Title */}
                <div className="col-span-12 flex items-center gap-4 lg:col-span-5">
                  <span className="text-[0.8rem] font-semibold text-text-secondary/50">
                    {cap.number}
                  </span>
                  <h3
                    className="text-xl font-medium tracking-tight text-text-primary transition-colors duration-300 group-hover:text-accent-primary md:text-2xl lg:text-3xl"
                  >
                    {cap.title}
                  </h3>
                </div>

                {/* Right Column: Description */}
                <div className="col-span-12 lg:col-span-7">
                  <p className="max-w-xl text-sm leading-relaxed text-text-secondary transition-transform duration-300 ease-out group-hover:translate-x-2 md:text-base">
                    {cap.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom boundary line for the last item */}
          <div
            ref={makeLineRef(CAPABILITIES.length)}
            className="h-[1px] w-full bg-border-divider origin-left will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
