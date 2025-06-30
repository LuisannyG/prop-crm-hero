
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Target,
  Info
} from "lucide-react";
import { getRiskExplanation } from "@/utils/limaMarketData";

interface RiskExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: {
    name: string;
    riskScore: number;
    lastContactDays: number;
    interactionFrequency: number;
    engagementScore: number;
    salesStage: string;
    riskFactors: string[];
    recommendations: string[];
  };
}

const RiskExplanationModal = ({ isOpen, onClose, clientData }: RiskExplanationModalProps) => {
  const riskExplanation = getRiskExplanation(clientData.riskScore, clientData.riskFactors);

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getFactorIcon = (factor: string) => {
    if (factor.includes('contacto') || factor.includes('días')) return <Clock className="w-4 h-4" />;
    if (factor.includes('comunicación') || factor.includes('frecuencia')) return <MessageSquare className="w-4 h-4" />;
    if (factor.includes('etapa') || factor.includes('estancado')) return <TrendingDown className="w-4 h-4" />;
    if (factor.includes('precio') || factor.includes('objeciones')) return <DollarSign className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const calculateRiskComponents = () => {
    const components = [
      {
        name: "Días sin contacto",
        value: Math.min(100, clientData.lastContactDays * 3),
        description: `${clientData.lastContactDays} días desde el último contacto`,
        weight: 30
      },
      {
        name: "Frecuencia de comunicación",
        value: Math.max(0, 100 - (clientData.interactionFrequency * 20)),
        description: `${clientData.interactionFrequency.toFixed(1)} interacciones por semana`,
        weight: 25
      },
      {
        name: "Engagement general",
        value: 100 - clientData.engagementScore,
        description: `${clientData.engagementScore}% de engagement actual`,
        weight: 25
      },
      {
        name: "Progreso en etapa de ventas",
        value: clientData.salesStage === 'Primer contacto' ? 60 : 
               clientData.salesStage === 'Interesado' ? 40 :
               clientData.salesStage === 'Visita agendada' ? 20 : 10,
        description: `Actualmente en: ${clientData.salesStage}`,
        weight: 20
      }
    ];

    return components;
  };

  const riskComponents = calculateRiskComponents();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Análisis Detallado de Riesgo - {clientData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score principal */}
          <Card className={`border-2 ${getRiskColor(clientData.riskScore)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{riskExplanation.title}</h3>
                  <p className="text-sm mt-1">{riskExplanation.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{clientData.riskScore}%</div>
                  <div className="text-sm">Probabilidad de abandono</div>
                </div>
              </div>
              <Progress 
                value={clientData.riskScore} 
                className="h-3"
                indicatorClassName={`${
                  clientData.riskScore >= 80 ? "bg-red-500" :
                  clientData.riskScore >= 60 ? "bg-orange-500" :
                  clientData.riskScore >= 40 ? "bg-yellow-500" :
                  "bg-green-500"
                }`}
              />
            </CardContent>
          </Card>

          {/* Componentes del riesgo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Desglose del Cálculo de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskComponents.map((component, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-medium">{component.name}</h4>
                        <p className="text-sm text-gray-600">{component.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{component.value.toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Peso: {component.weight}%</div>
                      </div>
                    </div>
                    <Progress 
                      value={component.value} 
                      className="h-2"
                      indicatorClassName={`${
                        component.value >= 70 ? "bg-red-500" :
                        component.value >= 40 ? "bg-orange-500" :
                        "bg-green-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Factores de riesgo específicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Factores de Riesgo Identificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientData.riskFactors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No se han identificado factores de riesgo específicos</p>
              ) : (
                <div className="space-y-3">
                  {clientData.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-red-600 mt-0.5">
                        {getFactorIcon(factor)}
                      </div>
                      <div className="flex-1">
                        <p className="text-red-800 font-medium">{factor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recomendaciones específicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones de Acción Inmediata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-blue-600 mt-0.5">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-800">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas contextuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Contexto del Mercado de Lima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">15.2%</div>
                  <div className="text-sm text-gray-600">Tasa promedio de abandono en Lima</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">7-10 días</div>
                  <div className="text-sm text-gray-600">Tiempo promedio sin contacto antes del abandono</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">68%</div>
                  <div className="text-sm text-gray-600">Tasa de recuperación con acción inmediata</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RiskExplanationModal;
