
import FAQSection from "@/components/FAQSection";

interface FAQsSectionProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const FAQsSection = ({ faqs }: FAQsSectionProps) => {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <FAQSection faqs={faqs} />
      </div>
    </section>
  );
};

export default FAQsSection;
