"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Why Webflow instead of custom code?",
    answer:
      "Webflow gives you the best of both worlds: a platform your team can manage after launch, with the flexibility to build things that feel fully custom. I extend it with custom code and GSAP integrations so the result looks and performs like a fully coded site without needing a developer for every small change.",
  },
  {
    question: "Already have a Webflow site that needs work?",
    answer:
      "That's a big part of what I do. Whether your site needs structural cleanup, better performance, new sections, or a CMS overhaul, I can step in and improve what's already there. I'll audit your setup, identify what's holding it back, and build a clear plan to get it where it should be.",
  },
  {
    question: "What's the process from start to launch?",
    answer:
      "It starts with a conversation about your goals, timeline, and scope. Once aligned, I build in transparent stages and share live progress previews so feedback stays effortless. The goal is always a smooth handoff with a site you actually know how to control.",
  },
  {
    question: "Do you work under NDA?",
    answer:
      "Yes. I've worked on projects requiring strict confidentiality from pre-launch biotech products to internal Web3 infrastructure. I treat every client's intellectual property with discretion and am happy to sign an NDA before we start.",
  },
  {
    question: "Do you handle design, or only development?",
    answer:
      "Development is my core strength, but I have a strong eye for design and regularly collaborate with agency creative leads to refine layouts, spacing, and micro-interactions. If you have a design team, I'll execute their Figma files to pixel perfection.",
  },
  {
    question: "What does ongoing support look like?",
    answer:
      "You get a dedicated block of development hours each month (e.g. 30 hours) for new sections, layout improvements, performance fixes, or campaign updates. Hours roll over for up to three months so nothing goes to waste.",
  },
  {
    question: "How do you handle revisions and feedback?",
    answer:
      "Revisions are built directly into the process. I share progress at key milestones so feedback happens naturally while adjustments are easy, avoiding last-minute surprises before launch.",
  },
  {
    question: "Not sure which plan fits your project?",
    answer:
      "No stress at all. Reach out at hello@heysajidh.com or book a call, and we can discuss your goals to find the right scope together.",
  },
];

export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const openSetRef = useRef<Set<number>>(new Set());

  const makeWrapRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      wrapRefs.current[i] = el;
    },
    []
  );

  const makeInnerRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      innerRefs.current[i] = el;
    },
    []
  );

  const makeIconRef = useCallback(
    (i: number) => (el: HTMLSpanElement | null) => {
      iconRefs.current[i] = el;
    },
    []
  );

  const toggleFaq = (index: number) => {
    const wrap = wrapRefs.current[index];
    const inner = innerRefs.current[index];
    const icon = iconRefs.current[index];
    if (!wrap || !inner) return;

    const isOpen = openSetRef.current.has(index);

    if (isOpen) {
      openSetRef.current.delete(index);
      gsap.to(wrap, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
      if (icon) {
        gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });
      }
    } else {
      openSetRef.current.add(index);
      const naturalHeight = inner.scrollHeight;
      gsap.to(wrap, {
        height: naturalHeight,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => ScrollTrigger.refresh(),
      });
      if (icon) {
        gsap.to(icon, { rotation: 45, duration: 0.3, ease: "power2.out" });
      }
    }
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const subtitleEl = section.querySelector(".faq-subtitle");
      const headingEl = section.querySelector(".faq-heading");

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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
        {/* ── Section Header ── */}
        <div className="mb-12 max-w-3xl md:mb-16">
          <p
            className="faq-subtitle mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)", opacity: 0 }}
          >
            FAQ
          </p>
          <h2
            className="faq-heading mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)", opacity: 0 }}
          >
            Got any questions?
          </h2>
        </div>

        {/* ── Accordion List ── */}
        <div className="flex flex-col border-t border-border-divider">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-b border-border-divider">
              {/* Question Header Button */}
              <button
                onClick={() => toggleFaq(i)}
                className="group flex w-full items-center justify-between py-6 text-left transition-colors duration-200 hover:text-accent-primary focus-visible:outline-none"
              >
                <span className="text-lg font-medium text-text-primary transition-colors group-hover:text-accent-primary md:text-xl lg:text-2xl">
                  {item.question}
                </span>

                {/* Right Plus (+) icon that rotates 45deg to (x) */}
                <span
                  ref={makeIconRef(i)}
                  className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border-divider text-text-secondary transition-colors duration-200 group-hover:border-accent-primary group-hover:text-accent-primary"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>

              {/* Answer Content Wrap */}
              <div
                ref={makeWrapRef(i)}
                className="overflow-hidden"
                style={{ height: 0 }}
              >
                <div ref={makeInnerRef(i)} className="pb-6">
                  <p className="max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">
                    {item.answer}
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
