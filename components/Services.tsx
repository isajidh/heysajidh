"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface PricingTier {
  title: string;
  price: string;
  priceDetail?: string;
  commitment?: string;
  subtitle: string;
  deliverables: string[];
  footerTag: string;
  ctaText: string;
  ctaLink: string;
  highlighted?: boolean;
}

const SERVICES_TIERS: PricingTier[] = [
  {
    title: "Ongoing Support",
    price: "$3,000",
    priceDetail: "/ 30 hours",
    commitment: "Minimum 3 month commitment",
    subtitle: "Your dedicated Webflow developer, 30 hours a month. Whatever your site needs, handled.",
    deliverables: [
      "New pages, sections, and features",
      "Campaign-driven updates (modules, content blocks, assets)",
      "Maintenance, bug fixes, and content updates",
      "Technical SEO and performance optimization",
      "Unused hours roll over (up to 3 months)",
    ],
    footerTag: "For brands that need continuous growth and long-term collaboration.",
    ctaText: "Get Started",
    ctaLink: "#",
  },
  {
    title: "Starter Build",
    price: "$5,000",
    priceDetail: "one-time",
    commitment: "Launch within 1 to 2 weeks",
    subtitle: "A clean Webflow site ready to launch in one to two weeks. Perfect for brands needing a solid online presence.",
    deliverables: [
      "Up to 6 pages",
      "CMS setup",
      "Mid-level animations and interactions",
      "Technical SEO setup",
      "Webflow Editor training after launch",
    ],
    footerTag: "For new sites or migrations that need a fast, clean start.",
    ctaText: "Start a Build",
    ctaLink: "#",
    highlighted: true,
  },
  {
    title: "Custom Project",
    price: "Book a Call",
    subtitle: "High-end Webflow development for complex projects. Every scope is different, starting with a conversation.",
    deliverables: [
      "Advanced interaction and animation systems",
      "Scalable CMS architecture with multi-collection setups",
      "Complex layouts, modular components, and dynamic content",
      "Integration ready structure for external tools and API driven features",
      "14 days post-launch support included",
    ],
    footerTag: "For complex projects that go beyond the basics and need a tailored approach.",
    ctaText: "Book a Call",
    ctaLink: "#",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const makeCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Section header entrance
      const subtitleEl = section.querySelector(".services-section-subtitle");
      const headingEl = section.querySelector(".services-section-heading");
      const bodyEl = section.querySelector(".services-section-body");

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

      if (bodyEl) {
        gsap.fromTo(
          bodyEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
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

      // Staggered Pricing Cards Scroll Entrance (1-2-3 sequence)
      const validCards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: validCards[0],
              start: "top 85%",
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
      id="services"
      className="relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-6">
        {/* ── Section Header ── */}
        <div className="mb-16 max-w-3xl md:mb-24">
          <p
            className="services-section-subtitle mb-4 font-medium uppercase tracking-[0.08em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)", opacity: 0 }}
          >
            SERVICES
          </p>
          <h2
            className="services-section-heading mb-6 font-semibold leading-[1.08] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)", opacity: 0 }}
          >
            Solutions That Deliver
          </h2>
          <p
            className="services-section-body max-w-xl leading-[1.6] text-text-secondary"
            style={{ fontSize: "var(--font-size-body-lg)", opacity: 0 }}
          >
            Same quality, same attention to detail. The only difference is the size of the project and what you need right now.
          </p>
        </div>

        {/* ── 3-Column Pricing Grid (collapses on < 1024px) ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {SERVICES_TIERS.map((tier, i) => (
            <div
              key={tier.title}
              ref={makeCardRef(i)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-8 bg-surface-primary transition-all duration-400 ease-out will-change-transform ${
                tier.highlighted
                  ? "border-accent-primary/50 shadow-[0_0_30px_rgba(139,92,246,0.12)]"
                  : "border-border-divider hover:border-accent-primary/40"
              } hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(139,92,246,0.18)]`}
              style={{ opacity: 0, transform: "translateY(60px)" }}
            >
              <div>
                {/* Header Row: Title */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-text-primary">
                    {tier.title}
                  </h3>
                  {tier.highlighted && (
                    <span className="rounded-full bg-accent-primary/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-accent-primary border border-accent-primary/30">
                      Popular
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
                    {tier.price}
                  </span>
                  {tier.priceDetail && (
                    <span className="text-sm font-medium text-text-secondary">
                      {tier.priceDetail}
                    </span>
                  )}
                </div>

                {/* Commitment badge if present */}
                {tier.commitment && (
                  <p className="mb-4 text-xs font-medium text-accent-primary">
                    {tier.commitment}
                  </p>
                )}

                {/* Subtitle */}
                <p className="mb-8 text-sm leading-relaxed text-text-secondary">
                  {tier.subtitle}
                </p>

                {/* Deliverables List */}
                <div className="mb-8 border-t border-border-divider pt-6">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-3 text-sm text-text-secondary">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="mt-1 h-4 w-4 flex-shrink-0 text-accent-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: CTA + Target Audience Tag */}
              <div>
                <a
                  href={tier.ctaLink}
                  className={`mb-6 inline-flex w-full items-center justify-center rounded-full py-3.5 px-6 text-sm font-medium transition-colors duration-300 ${
                    tier.highlighted
                      ? "bg-accent-primary text-white hover:bg-accent-primary/90"
                      : "bg-text-primary text-global hover:bg-[#D4D4D8]"
                  }`}
                >
                  {tier.ctaText}
                </a>
                <p className="border-t border-border-divider/50 pt-4 text-xs leading-relaxed text-text-secondary/70">
                  {tier.footerTag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
