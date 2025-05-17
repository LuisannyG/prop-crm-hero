
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
  onCtaClick: () => void;
}

const PricingCard = ({ name, price, features, buttonText, highlighted, onCtaClick }: PricingCardProps) => {
  return (
    <Card className={`overflow-hidden relative ${highlighted ? 'border-blue-500 shadow-lg' : ''}`}>
      {highlighted && (
        <div className="absolute top-0 left-0 w-full bg-blue-500 text-white py-1 text-center text-sm font-medium">
          Recomendado
        </div>
      )}
      
      <CardContent className={`p-8 ${highlighted ? 'pt-12' : ''}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`${highlighted ? 'bg-blue-100' : 'bg-gray-100'} p-2 rounded-full`}>
            <BadgeDollarSign className={`h-6 w-6 ${highlighted ? 'text-blue-700' : 'text-gray-500'}`} />
          </div>
          <h3 className="font-bold text-2xl">{name}</h3>
        </div>
        
        <div className="my-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-slate-500">/mes</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className={`h-5 w-5 ${highlighted ? 'text-blue-500' : 'text-green-500'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full ${highlighted ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
          onClick={onCtaClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
