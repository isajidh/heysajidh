import Hero from "@/components/Hero";
import JourneyTimeline from "@/components/JourneyTimeline";
import SelectedWork from "@/components/SelectedWork";
import Capabilities from "@/components/Capabilities";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

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

      {/* ── Capabilities Overview (Phase 5) ── */}
      <Capabilities />

      {/* ── Services & Pricing (Phase 5) ── */}
      <Services />

      {/* ── Testimonials (Phase 6) ── */}
      <Testimonials />

      {/* ── FAQ (Phase 6) ── */}
      <Faq />

      {/* ── Footer (Phase 6) ── */}
      <Footer />
    </main>
  );
}
