
import { Card, CardContent } from "@/components/ui/card";

interface BenefitCardProps {
  title: string;
  description: string;
}

const BenefitCard = ({ title, description }: BenefitCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow text-center overflow-hidden">
      <CardContent className="p-6">
        <div className="bg-blue-500 h-2 w-12 rounded-full mx-auto mb-6"></div>
        <h3 className="font-bold text-xl text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
