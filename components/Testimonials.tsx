"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, useGSAP);

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  tagline: string;
  hue: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Danette Beal",
    role: "VP of Marketing",
    company: "Alosant.com",
    tagline: "Trusted long-term collaborator.",
    quote:
      "Nenad has been a fantastic partner to work with and continues to be an essential part of our team. He communicates clearly and promptly, and his work consistently exceeds expectations. He resolves technical challenges quickly and efficiently, always demonstrating skill, reliability, and a strong commitment to quality.",
    hue: 260,
  },
  {
    name: "Petar Stojakovic",
    role: "Founder",
    company: "fiftyseven.co",
    tagline: "Thinks through the entire experience.",
    quote:
      "Nenad doesn't just code Webflow—he thinks through the experience. Motion, pacing, narrative flow: all aligned with technical excellence. The result is sites that feel cohesive, intentional, complete. A true partner in execution. No gaps, no compromises.",
    hue: 220,
  },
  {
    name: "Klemen Vute",
    role: "PM",
    company: "Povio.com",
    tagline: "Reliable, skilled, and easy to work with.",
    quote:
      "Nenad was great to work with! He delivered our websites on time, gave our design team helpful guidance, and suggested smarter solutions that really improved the final results. Super reliable and easy to collaborate with — highly recommend!",
    hue: 180,
  },
  {
    name: "Johanna Dahlroos",
    role: "Co-Founder & Creative Director",
    company: "Moat Agency",
    tagline: "The details that set him apart.",
    quote:
      "I've worked with Nenad for many years, and he still surprises me with the speed and quality of his work. His attention to the small details makes all the difference. He's reliable, fun to collaborate with, and consistently delivers beyond expectations.",
    hue: 140,
  },
  {
    name: "Marko Ivanovic",
    role: "Design Lead",
    company: "Legacy Agency",
    tagline: "Design-focused, reliable development.",
    quote:
      "We've hired Nenad for several projects, and working with him has always been effortless thanks to his deep understanding of design. He's dedicated to perfecting each delivery for our clients.",
    hue: 40,
  },
  {
    name: "Chrissy Cowdrey",
    role: "Product/Web Designer",
    company: "Independent",
    tagline: "A developer with a true product mindset.",
    quote:
      "Nenad is a rare blend of speed, quality, and collaboration. He actively contributes ideas that improve how designs translate into development, and he approaches every build with a product mindset.",
    hue: 320,
  },
  {
    name: "Marko Ilic",
    role: "Founder",
    company: "see.design",
    tagline: "A proven expert you trust.",
    quote:
      "I've been working with Nenad for years and have always been impressed by his work ethic, fast turnaround, and attention to detail. Nenad clearly knows his craft.",
    hue: 280,
  },
  {
    name: "Bart-Jan Leyts",
    role: "CEO",
    company: "Autorank.com",
    tagline: "Exceptional leadership & ownership.",
    quote:
      "We loved working with Nenad on the Autorank website. He showed exceptional leadership throughout the project, taking full ownership of the website infrastructure and guiding key technical decisions.",
    hue: 200,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggableRef = useRef<Draggable | null>(null);

  const makeCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  const handleMouseEnter = () => {
    window.dispatchEvent(
      new CustomEvent("cursor-state", { detail: { state: "drag" } })
    );
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(
      new CustomEvent("cursor-state", { detail: { state: "default" } })
    );
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const container = containerRef.current;
      if (!section || !track || !container) return;

      const subtitleEl = section.querySelector(".testi-subtitle");
      const headingEl = section.querySelector(".testi-heading");

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

      // ── Drag & throw carousel — GSAP Draggable + InertiaPlugin ──
      const [instance] = Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: container,
        edgeResistance: 0.65,
        cursor: "grab",
        activeCursor: "grabbing",
        onPress: function () {
          gsap.to(cardRefs.current.filter(Boolean), {
            scale: 0.95,
            duration: 0.3,
            ease: "power2.out",
          });
        },
        onRelease: function () {
          gsap.to(cardRefs.current.filter(Boolean), {
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.4)",
          });
        },
        onDragStart: function () {
          // Prevent text selection on the testimonial quotes while
          // actively dragging the track.
          track.classList.add("is-dragging");
        },
        onDragEnd: function () {
          track.classList.remove("is-dragging");
        },
      });
      draggableRef.current = instance;

      // Bounds depend on the track's natural width vs the container —
      // both can change on resize/orientation change.
      const handleResize = () => draggableRef.current?.applyBounds(container);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="testimonial"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
        {/* ── Section Header ── */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <p
            className="testi-subtitle reveal-up-sm mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            TESTIMONIALS
          </p>
          <h2
            className="testi-heading reveal-up-md mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)" }}
          >
            From People I&apos;ve Worked with
          </h2>
        </div>
      </div>

      {/* ── Horizontal Drag & Throw Carousel Container ── */}
      <div
        ref={containerRef}
        className="w-full cursor-grab active:cursor-grabbing overflow-hidden touch-pan-y"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className="flex gap-6 px-4 md:px-6 will-change-transform"
          style={{ width: "max-content" }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              ref={makeCardRef(i)}
              className="flex w-[340px] md:w-[420px] flex-col justify-between rounded-2xl border border-border-divider bg-surface-primary p-6 md:p-8 transition-colors duration-300 hover:border-accent-primary/40 will-change-transform flex-shrink-0"
            >
              <div>
                {/* Top Quote Tagline */}
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent-primary">
                  {t.tagline}
                </p>

                {/* Quote Content */}
                <p className="mb-8 text-sm leading-relaxed text-text-secondary md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info + Avatar/Logo Space (150x150 equivalent scale slot) */}
              <div className="flex items-center gap-4 border-t border-border-divider/60 pt-6">
                {/* Avatar SVG Placeholder */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border-divider bg-surface-secondary">
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <rect
                      width="100"
                      height="100"
                      fill={`hsl(${t.hue}, 30%, 18%)`}
                    />
                    <circle
                      cx="50"
                      cy="40"
                      r="20"
                      fill={`hsl(${t.hue}, 40%, 40%)`}
                    />
                    <path
                      d="M20 90 C20 70 35 60 50 60 C65 60 80 70 80 90 Z"
                      fill={`hsl(${t.hue}, 40%, 40%)`}
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-primary md:text-base">
                    {t.name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {t.role} &bull;{" "}
                    <span className="text-text-primary/80">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
