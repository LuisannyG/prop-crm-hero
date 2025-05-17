
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";

interface ContactSectionProps {
  showBetaMessage: boolean;
}

const ContactSection = ({ showBetaMessage }: ContactSectionProps) => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">¡Únete a Proptor!</h2>
        
        {showBetaMessage && (
          <Card className="mb-8 border-blue-500">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-4 text-blue-700">Proptor está actualmente en fase Beta</h3>
              <p className="text-center mb-4">Estamos trabajando duro para lanzar pronto. Regístrate en nuestra lista de espera para ser de los primeros en probar Proptor.</p>
            </CardContent>
          </Card>
        )}
        
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactSection;
