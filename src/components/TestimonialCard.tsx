
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  position: string;
  content: string;
  avatar: string;
}

const TestimonialCard = ({ name, position, content, avatar }: TestimonialCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-6">
          <p className="text-slate-600 italic">"{content}"</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-sm text-slate-500">{position}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
