import Hero from "@/components/Hero";
import JourneyTimeline from "@/components/JourneyTimeline";
import SelectedWork from "@/components/SelectedWork";

export default function Home() {
  return (
    <main
      className="relative"
      style={{ backgroundColor: "var(--color-global)" }}
    >
      {/* ── Hero (Phase 2) ── */}
      <Hero />

      {/* ── About Me & Journey Timeline (Phase 3) ── */}
      <JourneyTimeline />

      {/* ── Selected Work (Phase 4) ── */}
      <SelectedWork />

      {/* ── Spacer for scroll testing ── */}
      <section className="flex min-h-[50vh] items-center justify-center px-4 md:px-6">
        <div className="mx-auto w-full max-w-[1440px] text-center">
          <p className="text-text-secondary text-sm uppercase tracking-[0.08em]">
            More sections coming soon
          </p>
        </div>
      </section>
    </main>
  );
}
