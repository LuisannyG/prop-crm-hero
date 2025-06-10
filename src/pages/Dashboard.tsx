
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import FeaturesTabSection from '@/components/FeaturesTabSection';
import BenefitsSection from '@/components/BenefitsSection';
import PricingSection from '@/components/PricingSection';
import FAQsSection from '@/components/FAQsSection';
import Footer from '@/components/Footer';
import { benefits, plans, faqs } from '@/data/proptorData';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with user info and logout */}
      <header className="bg-slate-900 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/c4d29766-05b3-4827-aa8f-04a07ab56aa9.png" 
              alt="Proptor Logo" 
              className="h-10"
            />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¡Bienvenido a Proptor!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Tu CRM inmobiliario inteligente está listo para ayudarte a organizar, dar seguimiento 
            y convertir más clientes con menos esfuerzo.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4">¿Listo para empezar?</h3>
            <p className="text-blue-100">
              Explora las funcionalidades de Proptor y descubre cómo puede transformar 
              tu negocio inmobiliario.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Section with Tabs */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <FeaturesTabSection />
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection benefits={benefits} />

      {/* Pricing Section */}
      <PricingSection plans={plans} onCtaClick={() => {}} />

      {/* FAQ Section */}
      <FAQsSection faqs={faqs} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
