
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

const FeatureCard = ({ title, description, icon: Icon, index }: FeatureCardProps) => {
  const emojis = ["📅", "📊", "📝", "📈", "📂", "🧠", "🚨"];
  
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden border-t-4 border-t-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-700" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">{emojis[index % emojis.length]} {index + 1}. {title}</h3>
        </div>
        <p className="text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
