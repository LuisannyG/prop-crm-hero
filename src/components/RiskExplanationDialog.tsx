
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, AlertTriangle, Clock, MessageSquare, TrendingDown } from "lucide-react";

interface RiskExplanationDialogProps {
  contactName: string;
  riskScore: number;
  stage: string;
  daysInStage: number;
  lastContactDays: number;
  interactionFrequency: number;
  riskFactors: string[];
}

export const RiskExplanationDialog = ({ 
  contactName, 
  riskScore, 
  stage, 
  daysInStage, 
  lastContactDays,
  interactionFrequency,
  riskFactors 
}: RiskExplanationDialogProps) => {
  const [open, setOpen] = useState(false);

  const getRiskLevel = () => {
    if (riskScore >= 80) return { level: "Crítico", color: "destructive", icon: AlertTriangle };
    if (riskScore >= 60) return { level: "Alto", color: "destructive", icon: AlertTriangle };
    if (riskScore >= 40) return { level: "Medio", color: "default", icon: TrendingDown };
    return { level: "Bajo", color: "outline", icon: TrendingDown };
  };

  const risk = getRiskLevel();
  const RiskIcon = risk.icon;

  const getStageExpectedDays = (stage: string) => {
    const stageExpectations = {
      'contacto_inicial_recibido': 2,
      'primer_contacto_activo': 3,
      'llenado_ficha': 5,
      'seguimiento_inicial': 7,
      'agendamiento_visitas': 10,
      'presentacion_personalizada': 14,
      'negociacion': 21,
      'cierre_firma_contrato': 30,
      'postventa_fidelizacion': 60
    };
    return stageExpectations[stage as keyof typeof stageExpectations] || 7;
  };

  const expectedDays = getStageExpectedDays(stage);
  const isStagnant = daysInStage > expectedDays;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiskIcon className="h-5 w-5" />
            Análisis de Riesgo: {contactName}
          </DialogTitle>
          <DialogDescription>
            Explicación detallada del nivel de riesgo calculado
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nivel de Riesgo:</span>
            <Badge variant={risk.color as any}>
              {risk.level} ({riskScore}%)
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Etapa actual: <strong>{stage.replace(/_/g, ' ')}</strong></span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span>Días en esta etapa: <strong>{daysInStage}</strong> 
                {isStagnant && <span className="text-red-600"> (esperado: {expectedDays})</span>}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <TrendingDown className="h-4 w-4 text-gray-500" />
              <span>Último contacto: <strong>{lastContactDays} días</strong></span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span>Frecuencia de contacto: <strong>{interactionFrequency.toFixed(1)}/mes</strong></span>
            </div>
          </div>

          {riskFactors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Factores de Riesgo:</h4>
              <ul className="space-y-1">
                {riskFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-1">¿Cómo se calcula?</h4>
            <p className="text-xs text-blue-700">
              El riesgo se basa en: tiempo sin contacto, días estancado en la etapa actual, 
              frecuencia de interacciones y factores específicos del comportamiento del cliente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
