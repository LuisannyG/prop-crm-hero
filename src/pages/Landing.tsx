
import { useState, useEffect } from "react";
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
  const { user, loading } = useAuth();

  // Redirigir a dashboard si el usuario ya está logueado
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleCtaClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setShowAuthForm(true);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
