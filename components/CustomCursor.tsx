"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Custom cursor events — dispatched by interactive components
 * to communicate hover state changes to the cursor.
 *
 * Usage from any component:
 *   window.dispatchEvent(new CustomEvent("cursor-state", { detail: { state: "view" } }));
 *   window.dispatchEvent(new CustomEvent("cursor-state", { detail: { state: "default" } }));
 */

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(true);
  const mountedRef = useRef(false);

  // Detect touch device — run once on mount, update DOM visibility
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;

    isTouchRef.current = isTouchDevice;

    if (containerRef.current) {
      containerRef.current.style.display = isTouchDevice ? "none" : "block";
    }

    mountedRef.current = true;
  }, []);

  useGSAP(
    () => {
      if (!mountedRef.current) return;
      if (isTouchRef.current) return;
      if (!cursorDotRef.current || !cursorAuraRef.current) return;

      const dot = cursorDotRef.current;
      const aura = cursorAuraRef.current;
      const label = cursorLabelRef.current;

      // GSAP quickTo for 60fps cursor tracking
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

      // ── Cursor state handler — receives custom events from components ──
      const handleCursorState = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;

        if (detail.state === "view") {
          // Expand aura, hide dot, show "View" label
          gsap.to(aura, {
            width: 80,
            height: 80,
            borderColor: "rgba(245, 245, 247, 0.4)",
            backgroundColor: "rgba(10, 10, 12, 0.6)",
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dot, {
            opacity: 0,
            scale: 0,
            duration: 0.2,
            ease: "power2.out",
          });
          if (label) {
            gsap.to(label, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: "power3.out",
              delay: 0.05,
            });
          }
        } else {
          // Restore default cursor
          gsap.to(aura, {
            width: 32,
            height: 32,
            borderColor: "var(--color-text-primary)",
            backgroundColor: "transparent",
            duration: 0.35,
            ease: "power3.out",
          });
          gsap.to(dot, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
          if (label) {
            gsap.to(label, {
              opacity: 0,
              scale: 0.7,
              duration: 0.2,
              ease: "power2.in",
            });
          }
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("cursor-state", handleCursorState);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseenter", handleMouseEnter);
        document.removeEventListener("mouseleave", handleMouseLeave);
        window.removeEventListener("cursor-state", handleCursorState);
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
      {/* Trailing aura ring — 32px default, expands to 80px on "view" */}
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
          willChange: "transform, width, height",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* "View" label — hidden by default, appears on project hover */}
        <span
          ref={cursorLabelRef}
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-text-primary)",
            opacity: 0,
            transform: "scale(0.7)",
            willChange: "transform, opacity",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          View
        </span>
      </div>
    </div>
  );
}
