"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(true); // assume touch until proven otherwise
  const mountedRef = useRef(false);

  // Detect touch device — run once on mount, update DOM visibility
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;

    isTouchRef.current = isTouchDevice;

    // Show/hide the container based on touch detection
    if (containerRef.current) {
      containerRef.current.style.display = isTouchDevice ? "none" : "block";
    }

    mountedRef.current = true;
  }, []);

  useGSAP(
    () => {
      // Wait for mount detection to complete
      if (!mountedRef.current) return;
      if (isTouchRef.current) return;
      if (!cursorDotRef.current || !cursorAuraRef.current) return;

      const dot = cursorDotRef.current;
      const aura = cursorAuraRef.current;

      // GSAP quickTo for 60fps cursor tracking — no React state involved
      const dotX = gsap.quickTo(dot, "x", {
        duration: 0.15,
        ease: "power2.out",
      });
      const dotY = gsap.quickTo(dot, "y", {
        duration: 0.15,
        ease: "power2.out",
      });
      const auraX = gsap.quickTo(aura, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const auraY = gsap.quickTo(aura, "y", {
        duration: 0.45,
        ease: "power3.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        // Show cursor on first movement (no React re-render)
        if (dot.style.opacity === "0") {
          gsap.to(dot, { opacity: 1, duration: 0.2, ease: "power2.out" });
          gsap.to(aura, { opacity: 0.8, duration: 0.3, ease: "power2.out" });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        auraX(e.clientX);
        auraY(e.clientY);
      };

      const handleMouseEnter = () => {
        gsap.to(dot, { opacity: 1, duration: 0.2, ease: "power2.out" });
        gsap.to(aura, { opacity: 0.8, duration: 0.3, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(dot, { opacity: 0, duration: 0.2, ease: "power2.out" });
        gsap.to(aura, { opacity: 0, duration: 0.3, ease: "power2.out" });
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseenter", handleMouseEnter);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} aria-hidden="true" style={{ display: "none" }}>
      {/* Primary dot — 8px */}
      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--color-text-primary)",
          mixBlendMode: "difference",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          willChange: "transform",
        }}
      />
      {/* Trailing aura ring — 32px */}
      <div
        ref={cursorAuraRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9998,
          pointerEvents: "none",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid var(--color-text-primary)",
          backgroundColor: "transparent",
          mixBlendMode: "difference",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          willChange: "transform",
        }}
      />
    </div>
  );
}
