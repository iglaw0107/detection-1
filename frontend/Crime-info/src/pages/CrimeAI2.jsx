import Navbar from "../components/layout/Navbar2";
import HeroSection from "../components/ui/HeroSection";
import FeaturesSection from "../components/ui/FeaturesSection";
import ArchitectureSection from "../components/ui/ArchitectureSection";
import TestimonialsSection from "../components/ui/TestimonialsSection";
import FAQSection from "../components/ui/FAQSection";
import Footer from "../components/ui/Footer";

export default function CrimeAI() {
  return (
    <div className="bg-[#0a0a0f] text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}