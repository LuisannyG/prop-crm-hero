
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users } from "lucide-react";

interface FAQProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

const FAQSection = ({ faqs }: FAQProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6">
        <Users className="h-6 w-6 text-blue-500 mr-2" />
        <h3 className="text-xl font-semibold text-blue-800">Preguntas frecuentes</h3>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-blue-100">
            <AccordionTrigger className="text-left font-medium text-lg text-slate-800 hover:text-blue-700">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
