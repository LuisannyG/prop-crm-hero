
import { Button } from "@/components/ui/button";

interface HeroProps {
  onCtaClick: () => void;
}

const Hero = ({ onCtaClick }: HeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-between items-center mb-8">
          <img 
            src="/lovable-uploads/94f300e7-f28f-4112-b26a-35b332c36ccf.png" 
            alt="Proptor Logo" 
            className="h-12"
          />
          <Button 
            onClick={onCtaClick}
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900"
          >
            Iniciar Sesión
          </Button>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Revoluciona tu consultoría jurídica con
          <span className="text-blue-400"> Proptor</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Inteligencia artificial especializada para abogados profesionales
        </p>
        
        <Button 
          onClick={onCtaClick}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
        >
          Comienza Gratis
        </Button>
      </div>
    </section>
  );
};

export default Hero;
