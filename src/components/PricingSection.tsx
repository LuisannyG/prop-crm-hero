
import PricingCard from "@/components/PricingCard";

interface PricingSectionProps {
  plans: Array<{
    name: string;
    price: string;
    features: string[];
    buttonText: string;
    highlighted: boolean;
  }>;
  onCtaClick: (planName: string) => void;
}

const PricingSection = ({ plans, onCtaClick }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Planes y Precios</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Todos nuestros planes incluyen actualizaciones gratuitas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              buttonText={plan.buttonText}
              highlighted={plan.highlighted}
              onCtaClick={() => onCtaClick(plan.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
