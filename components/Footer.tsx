"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = "hello@heysajidh.com";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const transformTextRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  useGSAP(
    () => {
      const footer = footerRef.current;
      const text = transformTextRef.current;
      if (!footer || !text) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scrubbed typography animation on scroll near document bottom
        gsap.fromTo(
          text,
          {
            letterSpacing: "0.08em",
            scale: 0.92,
            opacity: 0.7,
          },
          {
            letterSpacing: "-0.04em",
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: footer,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(text, { letterSpacing: "-0.02em", scale: 1, opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative flex min-h-screen flex-col justify-between border-t border-border-divider bg-surface-primary pt-24 pb-12 md:pt-32 md:pb-16"
    >
      {/* ── Main Banner Content ── */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 md:px-6">
        <div className="mb-12 max-w-4xl md:mb-16">
          <p
            className="mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            LET&apos;S TALK
          </p>

          {/* Massive Scrubbed Typography */}
          <h2
            ref={transformTextRef}
            className="mb-8 font-bold leading-[0.95] tracking-tight text-text-primary will-change-transform"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7rem)" }}
          >
            Transform Your Webflow Experience Journey
          </h2>

          <p
            className="mb-10 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl"
          >
            Every Webflow site has room to grow. You get a clear view of what
            works, what holds you back, and how to move toward a setup that feels
            faster, lighter, and easier to manage.
          </p>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-text-primary px-8 py-4 text-sm font-medium text-global transition-colors duration-300 hover:bg-[#D4D4D8]"
            >
              Have something in mind? Let&apos;s Talk
            </a>

            {/* Copy Email Button */}
            <div className="relative inline-flex items-center">
              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="inline-flex items-center gap-2 rounded-full border border-border-divider bg-surface-secondary px-6 py-4 text-sm font-medium text-text-primary transition-colors duration-300 hover:border-text-secondary hover:bg-surface-primary"
              >
                <span>{EMAIL}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-70"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>

              {/* Hover Tooltip */}
              <span
                className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-secondary px-3 py-1 text-xs font-medium text-text-primary shadow-lg transition-all duration-200 ${
                  showTooltip && !copied
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0 pointer-events-none"
                }`}
              >
                Copy to clipboard
              </span>

              {/* Copied Confirmation */}
              <span
                className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-accent-primary px-3 py-1 text-xs font-medium text-white shadow-lg transition-all duration-200 ${
                  copied
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0 pointer-events-none"
                }`}
              >
                Copied!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Bottom Bar ── */}
      <div className="mx-auto w-full max-w-[1440px] border-t border-border-divider/60 px-4 pt-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span>&copy; {new Date().getFullYear()} NESH&reg;. All rights reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6 text-xs text-text-secondary">
            <a
              href="https://x.com/NenadPopadicc"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-text-primary"
            >
              X / Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/nenad-popadic-3a8649197/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-text-primary"
            >
              LinkedIn
            </a>
            <a
              href="https://webflow.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-200 hover:text-text-primary"
            >
              Webflow
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
