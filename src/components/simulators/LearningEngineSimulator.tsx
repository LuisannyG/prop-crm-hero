
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, AlertCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LearningEngineSimulator = () => {
  // Datos simulados para el aprendizaje de la IA
  const learningData = [
    { mes: "Enero", predicciones: 60, precisión: 75 },
    { mes: "Febrero", predicciones: 65, precisión: 78 },
    { mes: "Marzo", predicciones: 68, precisión: 82 },
    { mes: "Abril", predicciones: 72, precisión: 85 },
    { mes: "Mayo", predicciones: 75, precisión: 88 },
    { mes: "Junio", predicciones: 80, precisión: 90 }
  ];

  // Patrones detectados por la IA
  const patterns = [
    {
      id: 1,
      pattern: "Tiempo de respuesta",
      description: "Clientes que responden en menos de 2 horas a tus mensajes tienen un 72% más de probabilidad de comprar.",
      confidence: 92,
      category: "communication"
    },
    {
      id: 2,
      pattern: "Secuencia de visitas",
      description: "Programar segunda visita dentro de los 5 días posteriores a la primera aumenta un 45% la probabilidad de cierre.",
      confidence: 88,
      category: "visits"
    },
    {
      id: 3,
      pattern: "Criterios cambiantes",
      description: "Clientes que modifican más de 3 veces sus criterios de búsqueda suelen alargar el proceso de compra 4 meses.",
      confidence: 85,
      category: "preferences"
    },
    {
      id: 4,
      pattern: "Objeciones de precio",
      description: "El 65% de los clientes que objetan el precio en primera visita terminan comprando si reciben alternativas en 48 horas.",
      confidence: 80,
      category: "price"
    }
  ];

  // Recomendaciones personalizadas
  const recommendations = [
    {
      client: "Ana Martínez",
      action: "Programar segunda visita en los próximos 3 días",
      reason: "Alta probabilidad de cierre basada en su patrón de comunicación",
      urgency: "alta"
    },
    {
      client: "Carlos López",
      action: "Enviar alternativas de financiación",
      reason: "Su comportamiento indica preocupación por el método de pago",
      urgency: "media"
    },
    {
      client: "Laura Sánchez",
      action: "Ofrecer propiedades en nueva zona",
      reason: "Sus búsquedas recientes indican cambio de preferencias",
      urgency: "baja"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Motor de Aprendizaje
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="text-lg font-medium text-purple-800 flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4" />
                  ¿Cómo funciona?
                </h3>
                <p className="text-sm text-purple-700">
                  Nuestro motor de IA analiza continuamente los datos de tus interacciones con clientes, 
                  identificando patrones de comportamiento y aprendiendo con cada nuevo registro para ofrecerte 
                  predicciones más precisas sobre las probabilidades de compra y recomendaciones personalizadas.
                </p>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={learningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="predicciones" 
                      name="Predicciones (total)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="precisión" 
                      name="Precisión (%)" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-800">Datos analizados</span>
                    <Badge variant="outline" className="bg-white">3,248</Badge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="text-xs text-blue-700 mt-1">85% de tus registros</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-800">Precisión actual</span>
                    <Badge variant="outline" className="bg-white">90%</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                  <div className="text-xs text-green-700 mt-1">+12% vs. mes anterior</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Patrones Detectados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div 
                  key={pattern.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    pattern.category === 'communication' 
                      ? 'border-l-blue-500 bg-blue-50' 
                      : pattern.category === 'visits'
                        ? 'border-l-green-500 bg-green-50'
                        : pattern.category === 'preferences'
                          ? 'border-l-purple-500 bg-purple-50'
                          : 'border-l-orange-500 bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{pattern.pattern}</h3>
                    <Badge 
                      variant="outline" 
                      className={`${
                        pattern.confidence >= 90 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : pattern.confidence >= 85
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {pattern.confidence}% confianza
                    </Badge>
                  </div>
                  <p className="text-sm">{pattern.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  rec.urgency === 'alta' 
                    ? 'border-red-200 bg-red-50' 
                    : rec.urgency === 'media'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{rec.client}</h3>
                    <p className="text-sm font-medium mb-1">{rec.action}</p>
                    <p className="text-xs text-gray-600">{rec.reason}</p>
                  </div>
                  <Badge variant={
                    rec.urgency === 'alta' ? 'destructive' : 
                    rec.urgency === 'media' ? 'default' : 'outline'
                  }>
                    {rec.urgency === 'alta' ? 'Urgente' : 
                     rec.urgency === 'media' ? 'Importante' : 'Sugerido'}
                  </Badge>
                </div>
              </div>
            ))}

            <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">
                A medida que registres más interacciones con clientes, el sistema generará 
                más recomendaciones personalizadas basadas en patrones de comportamiento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningEngineSimulator;
