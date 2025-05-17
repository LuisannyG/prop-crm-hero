
import BenefitCard from "@/components/BenefitCard";

interface BenefitsSectionProps {
  benefits: Array<{
    title: string;
    description: string;
  }>;
}

const BenefitsSection = ({ benefits }: BenefitsSectionProps) => {
  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Beneficios de usar Proptor</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
