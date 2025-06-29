
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, AlertTriangle, TrendingDown, Clock, MessageSquare } from "lucide-react";

interface RiskExplanationDialogProps {
  contactName: string;
  riskLevel: 'Alto' | 'Medio' | 'Bajo';
  riskScore: number;
  daysInStage: number;
  lastContactDays: number;
  interactionFrequency: number;
  stage: string;
}

const RiskExplanationDialog = ({
  contactName,
  riskLevel,
  riskScore,
  daysInStage,
  lastContactDays,
  interactionFrequency,
  stage
}: RiskExplanationDialogProps) => {
  const getRiskFactors = () => {
    const factors = [];
    
    if (lastContactDays > 7) {
      factors.push({
        icon: <Clock className="w-4 h-4 text-orange-500" />,
        factor: `Sin contacto por ${lastContactDays} días`,
        impact: lastContactDays > 14 ? 'Alto' : 'Medio'
      });
    }
    
    if (interactionFrequency < 1) {
      factors.push({
        icon: <MessageSquare className="w-4 h-4 text-red-500" />,
        factor: `Baja frecuencia de comunicación (${interactionFrequency.toFixed(1)}/semana)`,
        impact: 'Alto'
      });
    }
    
    if (daysInStage > 14) {
      factors.push({
        icon: <TrendingDown className="w-4 h-4 text-red-500" />,
        factor: `Estancado en "${stage}" por ${daysInStage} días`,
        impact: daysInStage > 30 ? 'Alto' : 'Medio'
      });
    }
    
    // Factores específicos por etapa
    if (stage === 'Negociación' && daysInStage > 7) {
      factors.push({
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        factor: 'Negociación prolongada puede indicar objeciones no resueltas',
        impact: 'Alto'
      });
    }
    
    if (stage === 'Visita realizada' && daysInStage > 5) {
      factors.push({
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        factor: 'Falta seguimiento post-visita',
        impact: 'Medio'
      });
    }
    
    return factors;
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Alto': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medio': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const factors = getRiskFactors();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <HelpCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Análisis de Riesgo - {contactName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getRiskColor()}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Nivel de Riesgo</span>
              <Badge variant={riskLevel === 'Alto' ? 'destructive' : riskLevel === 'Medio' ? 'default' : 'outline'}>
                {riskLevel}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{riskScore}%</div>
            <div className="text-sm opacity-75">Puntuación de riesgo</div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Factores que influyen en el riesgo:</h4>
            {factors.length > 0 ? (
              <div className="space-y-2">
                {factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                    {factor.icon}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{factor.factor}</p>
                      <Badge 
                        variant={factor.impact === 'Alto' ? 'destructive' : 'outline'} 
                        className="text-xs mt-1"
                      >
                        Impacto {factor.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No se detectaron factores de riesgo significativos</p>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 border-t pt-2">
            <p><strong>Etapa actual:</strong> {stage}</p>
            <p><strong>Días en esta etapa:</strong> {daysInStage}</p>
            <p><strong>Último contacto:</strong> hace {lastContactDays} días</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiskExplanationDialog;
