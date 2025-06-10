
import FeatureCard from "@/components/FeatureCard";

interface FeaturesSectionProps {
  features: Array<{
    title: string;
    description: string;
    icon: any;
  }>;
}

const FeaturesSection = ({ features }: FeaturesSectionProps) => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Funcionalidades Principales</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Proptor incluye todas las herramientas que necesitas para gestionar tu negocio inmobiliario de manera eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
