"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HEADLINE = "Webflow, Applied Differently.";

const BADGES = [
  { label: "80+ Projects", position: "top-4 left-0 md:-left-6" },
  { label: "Creative", position: "bottom-24 -left-2 md:-left-10" },
  { label: "Reliable", position: "top-1/2 -right-2 md:-right-8" },
];

/**
 * Splits headline text into word-safe, per-character overflow-hidden spans
 * so each character can be masked and translated independently while the
 * headline still wraps naturally at word boundaries.
 */
function SplitHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.1em]">
              <span
                className="char inline-block will-change-transform"
                style={{
                  transform: "translateY(110%) rotate(5deg)",
                  opacity: 0,
                }}
              >
                {char}
              </span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const imageClipRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const badgesWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = headlineRef.current?.querySelectorAll(".char");
        const badges = badgesWrapRef.current?.querySelectorAll(".float-badge");

        // ── Master entrance timeline ──
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.3 });

        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0)
          .to(
            chars ?? [],
            { y: "0%", rotate: 0, opacity: 1, duration: 0.9, stagger: 0.02 },
            0.1 // staggered 0.1s from timeline start, in sync with image reveal below
          )
          .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.35)
          .to(buttonsRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.45)
          // Image clip-path reveal — narrow vertical slit expanding outward
          .fromTo(
            imageClipRef.current,
            { clipPath: "inset(0% 48% 0% 48%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 },
            0.2 // 0.1s after the headline cascade begins
          )
          .fromTo(
            imageInnerRef.current,
            { scale: 1.2 },
            { scale: 1, duration: 1.5 },
            0.2
          )
          .to(
            badges ?? [],
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 },
            0.9
          )
          .add(startFloating, 1.2);

        // ── Continuous floating physics for badges ──
        function startFloating() {
          badges?.forEach((badge) => {
            gsap.to(badge, {
              y: gsap.utils.random(-14, -8),
              duration: gsap.utils.random(2, 4),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: gsap.utils.random(0, 1),
            });
          });
        }

        // ── Mousemove parallax on the right hemisphere ──
        const rightCol = rightColRef.current;
        if (rightCol && imageInnerRef.current) {
          const imageX = gsap.quickTo(imageInnerRef.current, "x", {
            duration: 0.6,
            ease: "power3.out",
          });
          const imageY = gsap.quickTo(imageInnerRef.current, "y", {
            duration: 0.6,
            ease: "power3.out",
          });

          const badgeTweens = Array.from(badges ?? []).map((badge) => ({
            x: gsap.quickTo(badge, "xPercent", { duration: 0.8, ease: "power3.out" }),
            y: gsap.quickTo(badge, "yPercent", { duration: 0.8, ease: "power3.out" }),
          }));

          const handleMouseMove = (e: MouseEvent) => {
            const rect = rightCol.getBoundingClientRect();
            const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

            imageX(relX * -14);
            imageY(relY * -14);

            badgeTweens.forEach(({ x, y }) => {
              x(relX * -6);
              y(relY * -6);
            });
          };

          rightCol.addEventListener("mousemove", handleMouseMove);

          return () => {
            rightCol.removeEventListener("mousemove", handleMouseMove);
          };
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const chars = headlineRef.current?.querySelectorAll(".char");
        gsap.set(chars ?? [], { y: "0%", rotate: 0, opacity: 1 });
        gsap.set(
          [subtitleRef.current, bodyRef.current, buttonsRef.current],
          { opacity: 1, y: 0 }
        );
        gsap.set(imageClipRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(imageInnerRef.current, { scale: 1 });
        gsap.set(badgesWrapRef.current?.querySelectorAll(".float-badge") ?? [], {
          opacity: 1,
          scale: 1,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full items-center overflow-hidden px-4 pt-32 pb-16 md:px-6"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-6">
        {/* ── Left Hemisphere: Typographic block (cols 1–7) ── */}
        <div className="relative z-10 col-span-12 flex flex-col items-start justify-center lg:col-span-7">
          <p
            ref={subtitleRef}
            className="mb-4 font-medium uppercase tracking-[0.04em] text-text-secondary will-change-transform"
            style={{ fontSize: "var(--font-size-caption)", opacity: 0, transform: "translateY(20px)" }}
          >
            The Webflow Expert. That&apos;s Nenad.
          </p>

          <h1
            ref={headlineRef}
            className="mb-6 max-w-2xl font-semibold leading-[1.05] tracking-[-0.02em] text-text-primary"
            style={{ fontSize: "var(--font-size-display)" }}
          >
            <SplitHeadline text={HEADLINE} />
          </h1>

          <p
            ref={bodyRef}
            className="mb-8 max-w-2xl font-normal leading-[1.5] text-text-secondary will-change-transform"
            style={{ fontSize: "var(--font-size-body-lg)", opacity: 0, transform: "translateY(20px)" }}
          >
            Working closely with your team to deliver Webflow builds that merge
            creativity, technical excellence, and long-term value.
          </p>

          <div
            ref={buttonsRef}
            className="flex flex-wrap gap-4 will-change-transform"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-text-primary px-8 py-3.5 text-[0.9rem] font-medium text-global transition-colors duration-300 hover:bg-[#D4D4D8]"
            >
              Book a Call
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-border-divider px-8 py-3.5 text-[0.9rem] font-medium text-text-primary transition-colors duration-300 hover:border-text-secondary hover:bg-surface-primary"
            >
              About Me
            </a>
          </div>
        </div>

        {/* ── Right Hemisphere: Portrait + floating badges (cols 8–12) ── */}
        <div
          ref={rightColRef}
          className="relative col-span-12 mt-16 flex items-center justify-center lg:col-span-5 lg:mt-0 lg:justify-end"
        >
          <div className="relative w-full max-w-[400px] aspect-[4/5]">
            {/* Clip-path mask wrapper */}
            <div
              ref={imageClipRef}
              className="relative h-full w-full overflow-hidden rounded-3xl will-change-transform"
              style={{ clipPath: "inset(0% 48% 0% 48%)" }}
            >
              {/* Scaled inner portrait placeholder */}
              <div
                ref={imageInnerRef}
                className="h-full w-full will-change-transform"
                style={{ transform: "scale(1.2)" }}
              >
                <svg
                  viewBox="0 0 800 1000"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  role="img"
                  aria-label="Portrait placeholder"
                >
                  <defs>
                    <linearGradient id="portraitBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E1E24" />
                      <stop offset="100%" stopColor="#0A0A0C" />
                    </linearGradient>
                    <radialGradient id="portraitGlow" cx="50%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="800" height="1000" fill="url(#portraitBg)" />
                  <rect width="800" height="1000" fill="url(#portraitGlow)" />
                  {/* Abstract silhouette */}
                  <circle cx="400" cy="380" r="150" fill="#27272A" />
                  <path
                    d="M180 1000 C180 740 270 620 400 620 C530 620 620 740 620 1000 Z"
                    fill="#27272A"
                  />
                </svg>
              </div>
            </div>

            {/* ── Floating UI badges ── */}
            <div ref={badgesWrapRef} aria-hidden={false}>
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className={`float-badge absolute ${badge.position} inline-flex h-8 items-center whitespace-nowrap rounded-2xl border border-border-divider bg-surface-primary/80 px-4 text-[0.8rem] font-medium tracking-wide text-text-primary backdrop-blur-sm will-change-transform`}
                  style={{ opacity: 0, transform: "scale(0.85)" }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
