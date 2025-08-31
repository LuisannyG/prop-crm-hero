
import { Button } from "@/components/ui/button";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero = ({ onCtaClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        
        <div className="mb-8">
          <img 
            src="/lovable-uploads/e554c651-b04c-46c2-bb83-871da034773d.png" 
            alt="Proptor Logo" 
            className="w-96 md:w-[600px] lg:w-[700px] mx-auto"
          />
        </div>
        <p className="text-2xl md:text-3xl text-white mb-6">
          Tu CRM inmobiliario inteligente para Perú
        </p>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          La plataforma de IA inmobiliaria más avanzada de Latinoamérica, ahora en su versión 2025.
          <span className="block text-blue-200 mt-4 font-semibold">Aumenta tu tasa de cierre hasta 55% y automatiza completamente tu gestión.</span>
        </p>
        
        <div className="flex justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-md"
            onClick={onCtaClick}
          >
            Iniciar Sesión
          </Button>
        </div>
        
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-4">Revolución IA Septiembre 2025</h3>
          <p className="text-blue-100">
            Motor de IA Gen-2 con capacidad de procesamiento cuántico. Predice tendencias de mercado con meses de anticipación 
            y automatiza el 90% de las tareas de seguimiento. La nueva era de los CRM inmobiliarios ya está aquí.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
