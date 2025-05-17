
import { Button } from "@/components/ui/button";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero = ({ onCtaClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-center bg-cover opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100 mb-4 leading-tight">
          Proptor
        </h1>
        <p className="text-2xl md:text-3xl text-white mb-6">
          Tu CRM inmobiliario inteligente
        </p>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Organiza, da seguimiento y convierte más con menos esfuerzo.
          <span className="block text-blue-200 mt-4 font-semibold">Ahorra hasta 5 horas semanales en seguimiento de clientes.</span>
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-md"
            onClick={onCtaClick}
          >
            Empieza gratis
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md"
            onClick={onCtaClick}
          >
            Solicita una demo
          </Button>
        </div>
        
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-4">¿Qué hace diferente a Proptor?</h3>
          <p className="text-blue-100">
            Proptor es el único CRM que analiza el comportamiento de tus leads para avisarte 
            cuándo y cómo debes darles seguimiento, ayudándote a aumentar tus cierres.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
