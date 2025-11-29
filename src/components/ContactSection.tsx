
import { Card, CardContent } from "@/components/ui/card";

interface ContactSectionProps {
  showBetaMessage: boolean;
}

const ContactSection = ({ showBetaMessage }: ContactSectionProps) => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="border-blue-500">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-700">Esta página está en prueba</h2>
            <p className="text-lg text-gray-600 mb-6">
              Estamos trabajando duro para lanzar pronto Proptor, tu gestor inmobiliario inteligente.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
