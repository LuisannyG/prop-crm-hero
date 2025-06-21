
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import BenefitsSection from "@/components/BenefitsSection";
import PricingSection from "@/components/PricingSection";
import FAQsSection from "@/components/FAQsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import { benefits, plans, faqs } from "@/data/proptorData";

const Landing = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCtaClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthForm(true);
    }
  };

  if (showAuthForm) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero onCtaClick={handleCtaClick} />

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />

      {/* Pricing Section */}
      <PricingSection plans={plans} onCtaClick={handleCtaClick} />

      {/* FAQ Section */}
      <FAQsSection faqs={faqs} />

      {/* Contact Form with Beta Message */}
      <ContactSection showBetaMessage={false} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
