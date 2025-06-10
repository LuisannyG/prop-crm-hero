
import AuthHeroSection from '@/components/AuthHeroSection';
import AuthFormSection from '@/components/AuthFormSection';
import BenefitsSection from '@/components/BenefitsSection';
import PricingSection from '@/components/PricingSection';
import FAQsSection from '@/components/FAQsSection';
import Footer from '@/components/Footer';
import { benefits, plans, faqs } from '@/data/proptorData';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleCtaClick = () => {
    // Scroll to auth form
    const authSection = document.getElementById('auth-form');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AuthHeroSection />
      
      {/* Auth Form Section */}
      <AuthFormSection />

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />
      
      {/* Pricing Section */}
      <PricingSection plans={plans} onCtaClick={handleCtaClick} />
      
      {/* FAQ Section */}
      <FAQsSection faqs={faqs} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
