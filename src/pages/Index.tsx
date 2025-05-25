
import { useState } from "react";
import Hero from "@/components/Hero";
import FeaturesTabSection from "@/components/FeaturesTabSection";
import BenefitsSection from "@/components/BenefitsSection";
import PricingSection from "@/components/PricingSection";
import FAQsSection from "@/components/FAQsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { benefits, plans, faqs } from "@/data/proptorData";

const Index = () => {
  const [showBetaMessage, setShowBetaMessage] = useState(false);
  
  const handleCtaClick = () => {
    setShowBetaMessage(true);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero onCtaClick={handleCtaClick} />

      {/* Feature Section with Tabs - Espaciado mejorado para prevenir sobreposición */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <FeaturesTabSection />
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />

      {/* Pricing Section */}
      <PricingSection plans={plans} onCtaClick={handleCtaClick} />

      {/* FAQ Section */}
      <FAQsSection faqs={faqs} />

      {/* Contact Form with Beta Message */}
      <ContactSection showBetaMessage={showBetaMessage} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
