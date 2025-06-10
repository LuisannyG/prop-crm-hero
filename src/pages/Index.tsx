
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/c4d29766-05b3-4827-aa8f-04a07ab56aa9.png" 
            alt="Proptor Logo" 
            className="w-96 md:w-[600px] lg:w-[700px] mx-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Tu CRM inmobiliario inteligente
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Organiza, da seguimiento y convierte más clientes con menos esfuerzo.
          <span className="block text-blue-200 mt-4 font-semibold">
            Ahorra hasta 5 horas semanales en seguimiento de clientes.
          </span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-md"
            onClick={handleGetStarted}
          >
            Empieza gratis
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md"
            onClick={handleGetStarted}
          >
            Solicita una demo
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto mb-8">
          <h3 className="text-white text-xl font-bold mb-4">¿Qué hace diferente a Proptor?</h3>
          <p className="text-blue-100">
            Proptor es el único CRM que analiza el comportamiento de tus clientes potenciales para avisarte 
            cuándo y cómo debes darles seguimiento, ayudándote a aumentar tus cierres. Ideal para el mercado peruano.
          </p>
        </div>

        <div className="text-center">
          <p className="text-yellow-400 font-medium">⚠️ Esta aplicación está actualmente en desarrollo</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
