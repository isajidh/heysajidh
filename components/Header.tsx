"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About me", href: "#about" },
  { label: "projects", href: "#projects" },
  { label: "What you get", href: "#overview" },
  { label: "Services", href: "#services" },
  { label: "clients", href: "#testimonial" },
  { label: "Faq", href: "#faq" },
];

const EMAIL = "hello@heysajidh.com";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Refs for scroll state — avoids re-renders and stale closures
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);
  const isGlassRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Copy email to clipboard
  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  // Entrance animation — header drops in from above
  useGSAP(
    () => {
      if (!headerRef.current) return;

      gsap.fromTo(
        headerRef.current,
        { y: "-100%" },
        {
          y: "0%",
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    },
    { scope: headerRef }
  );

  // Scroll mechanics — completely ref-based, no React state dependencies
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      // Cancel any pending RAF to prevent stacking
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;

        // --- Glassmorphism toggle at 50px ---
        const shouldBeGlass = currentScrollY > 50;
        if (shouldBeGlass && !isGlassRef.current) {
          isGlassRef.current = true;
          gsap.to(header, {
            backgroundColor: "rgba(10, 10, 12, 0.7)",
            backdropFilter: "blur(20px)",
            borderBottomColor: "rgba(39, 39, 42, 0.5)",
            duration: 0.3,
            ease: "power2.out",
          });
        } else if (!shouldBeGlass && isGlassRef.current) {
          isGlassRef.current = false;
          gsap.to(header, {
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            borderBottomColor: "transparent",
            duration: 0.3,
            ease: "power2.out",
          });
        }

        // --- Smart-hide: hide on rapid scroll down, show on any scroll up ---
        if (scrollDelta > 10 && currentScrollY > 100 && !isHiddenRef.current) {
          isHiddenRef.current = true;
          gsap.to(header, {
            y: "-100%",
            duration: 0.4,
            ease: "power2.inOut",
          });
        } else if (scrollDelta < -5 && isHiddenRef.current) {
          isHiddenRef.current = false;
          gsap.to(header, {
            y: "0%",
            duration: 0.35,
            ease: "power2.out",
          });
        }

        lastScrollYRef.current = currentScrollY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[100]"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
        borderBottom: "1px solid transparent",
        transform: "translateY(-100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 md:px-6">
        {/* ── Left: Logo ── */}
        <a
          href="#hero"
          className="group flex items-center gap-0.5 text-text-primary no-underline"
        >
          <span className="text-lg font-bold tracking-tight md:text-xl">
            NESH
          </span>
          <span className="text-[0.6rem] font-medium leading-none align-super opacity-70">
            ®
          </span>
        </a>

        {/* ── Center: Navigation Links ── */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link group relative text-[0.875rem] font-medium uppercase tracking-[0.04em] text-text-secondary transition-colors hover:text-text-primary"
              style={{ transitionDuration: "0.2s" }}
            >
              {link.label}
              {/* Expanding underline — scaleX for GPU compositing */}
              <span
                className="absolute bottom-[-4px] left-0 h-[1.5px] w-full bg-accent-primary group-hover:scale-x-100"
                style={{
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  transition: "transform 0.3s var(--ease-ui)",
                }}
              />
            </a>
          ))}
        </nav>

        {/* ── Right: Email + CTA ── */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Email with hover tooltip + copy confirmation */}
          <div className="relative hidden items-center gap-2 md:flex">
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="group flex items-center gap-2 text-[0.8rem] text-text-secondary transition-colors duration-200 hover:text-text-primary"
              title="Copy email to clipboard"
            >
              <span className="tracking-wide">{EMAIL}</span>
              {/* Clipboard icon */}
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
                className="opacity-50 transition-opacity duration-200 group-hover:opacity-100"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>

            {/* Hover tooltip — "Copy to clipboard" */}
            <span
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-secondary px-3 py-1 text-[0.7rem] font-medium text-text-primary shadow-lg transition-all duration-200 ${
                showTooltip && !copied
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0 pointer-events-none"
              }`}
            >
              Copy to clipboard
            </span>

            {/* Copied confirmation tooltip */}
            <span
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-accent-primary px-3 py-1 text-[0.7rem] font-medium text-white shadow-lg transition-all duration-200 ${
                copied
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0 pointer-events-none"
              }`}
            >
              Copied!
            </span>
          </div>

          {/* Book a Call button — pill, white bg, dark text */}
          <a
            href="#"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-text-primary px-5 py-2.5 text-[0.85rem] font-medium text-global transition-colors"
            style={{ transitionDuration: "0.3s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#D4D4D8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-text-primary)";
            }}
          >
            <span className="relative z-10">Book a Call</span>
          </a>

          {/* Mobile menu button (hamburger) */}
          <button
            className="flex flex-col items-center justify-center gap-1.5 p-2 lg:hidden"
            aria-label="Open menu"
          >
            <span className="block h-[2px] w-5 bg-text-primary transition-transform" />
            <span className="block h-[2px] w-5 bg-text-primary transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
