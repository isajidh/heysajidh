"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Wires Lenis's scroll updates into GSAP's own ticker instead of letting
 * both run independent RAF loops — that race is the actual cause of
 * pinned-element jitter with Lenis+ScrollTrigger, not a mobile-touch-
 * momentum problem `ScrollTrigger.normalizeScroll()` would fix (and
 * normalizeScroll is a global setting that could itself fight Lenis's
 * own scroll virtualization). Also owns same-page hash-anchor smooth
 * scrolling and ScrollTrigger refresh timing.
 *
 * This is a single-page app (one route, "/") — there are no client-side
 * route changes for a usePathname()-driven refresh to hook into, and no
 * next/link hash anchors (nav uses plain <a href="#section">). The
 * underlying goal — keep ScrollTrigger's cached trigger coordinates
 * correct — is instead served by refreshing after the events that
 * actually shift this page's layout post-mount: web fonts swapping in,
 * and mobile browser chrome (address bar) show/hide. Accordion-driven
 * height changes already call ScrollTrigger.refresh() at their own
 * onComplete in JourneyTimeline/Faq.
 */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const syncLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(syncLenis);
    gsap.ticker.lagSmoothing(0);

    // Same-page hash anchors — smooth-scroll via Lenis instead of an
    // instant native jump. -100 offset clears the fixed header.
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -100 });
    };
    document.addEventListener("click", handleAnchorClick);

    // Neither of these fires a standard window "resize" event, so
    // ScrollTrigger's own auto-refresh-on-resize never catches them.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleViewportResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.visualViewport?.addEventListener("resize", handleViewportResize);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(syncLenis);
      document.removeEventListener("click", handleAnchorClick);
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      clearTimeout(resizeTimeout);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        autoRaf: false,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
