import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main
      className="relative min-h-[300vh]"
      style={{ backgroundColor: "var(--color-global)" }}
    >
      {/* ── Section 1: Hero (Phase 2) ── */}
      <Hero />

      {/* ── Section 2: Scroll test zone ── */}
      <section className="flex min-h-screen flex-col items-start justify-center px-4 md:px-6">
        <div className="mx-auto w-full max-w-[1440px]">
          <p
            className="mb-4 font-medium uppercase tracking-[0.04em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            Scroll Zone
          </p>
          <h2
            className="mb-6 font-medium leading-[1.1] tracking-[-0.01em] text-text-primary"
            style={{ fontSize: "var(--font-size-h2)" }}
          >
            Test the glassmorphism
            <br />
            header transition here.
          </h2>
          <p
            className="max-w-xl leading-[1.6] text-text-secondary"
            style={{ fontSize: "var(--font-size-body)" }}
          >
            Scroll past the hero to see the header&apos;s backdrop-blur kick
            in. Scroll down rapidly to trigger the smart-hide mechanic, then
            scroll up to bring it back.
          </p>

          {/* Divider test */}
          <div className="my-12 h-px w-full bg-border-divider" />

          {/* Tag / badge tests */}
          <div className="flex flex-wrap gap-3">
            {["GSAP", "Lenis", "Next.js", "Tailwind v4", "React 19"].map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex h-8 items-center rounded-2xl border border-border-divider bg-transparent px-4 text-[0.8rem] font-medium tracking-wide text-text-secondary"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Section 3: Final scroll zone ── */}
      <section className="flex min-h-screen flex-col items-start justify-center px-4 md:px-6">
        <div className="mx-auto w-full max-w-[1440px]">
          <p
            className="mb-4 font-medium uppercase tracking-[0.04em] text-text-secondary"
            style={{ fontSize: "var(--font-size-caption)" }}
          >
            Cursor Test
          </p>
          <h3
            className="mb-6 font-medium leading-[1.2] text-text-primary"
            style={{ fontSize: "var(--font-size-h3)" }}
          >
            Move your cursor across this section
            <br />
            to verify the physics-based trailing aura.
          </h3>
          <p className="max-w-lg text-text-secondary leading-[1.6]">
            The primary 8px dot should track tightly while the 32px aura ring
            follows with elastic delay. Both elements use{" "}
            <span className="text-accent-primary font-medium">
              mix-blend-mode: difference
            </span>{" "}
            for universal visibility.
          </p>

          {/* Interactive elements to test hover states */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Surface Primary", bg: "bg-surface-primary" },
              { title: "Surface Secondary", bg: "bg-surface-secondary" },
              { title: "Accent Glow", bg: "bg-surface-primary" },
            ].map((card) => (
              <div
                key={card.title}
                className={`${card.bg} group rounded-2xl border border-border-divider p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)]`}
              >
                <h4 className="mb-2 text-lg font-medium text-text-primary">
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Hover to test card elevation and accent glow effects.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
