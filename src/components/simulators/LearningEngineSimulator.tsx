
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Users, Target, Eye } from "lucide-react";

const LearningEngineSimulator = () => {
  // Datos simulados de aprendizaje
  const learningMetrics = [
    { category: "Patrones de Comportamiento", accuracy: 87, improvement: "+12%" },
    { category: "Predicción de Conversión", accuracy: 82, improvement: "+8%" },
    { category: "Mejor Horario de Contacto", accuracy: 91, improvement: "+15%" },
    { category: "Canales Más Efectivos", accuracy: 78, improvement: "+5%" }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Tendencia Detectada",
      description: "Los leads de inversionistas responden mejor los martes entre 10-12am",
      confidence: 92
    },
    {
      icon: Users,
      title: "Segmentación Mejorada",
      description: "Clientes jóvenes prefieren comunicación por WhatsApp en un 78%",
      confidence: 85
    },
    {
      icon: Target,
      title: "Predicción de Cierre",
      description: "Ana Silva tiene 89% probabilidad de cerrar en los próximos 5 días",
      confidence: 89
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mensaje de Vista Previa */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <Eye className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">Vista Previa - Disponible en Plan Premium</h3>
        </div>
        <p className="text-purple-700 text-sm mb-4">
          Esta es una representación de cómo se verá el Motor de Aprendizaje cuando esté completamente implementado.
        </p>
      </div>

      {/* Métricas de precisión del aprendizaje */}
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Precisión del Motor de IA
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {learningMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{metric.accuracy}%</span>
                    <span className="text-xs text-green-600">{metric.improvement}</span>
                  </div>
                </div>
                <Progress value={metric.accuracy} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights generados por IA */}
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-800">Insights Generados por IA</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <insight.icon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Confianza:</span>
                    <div className="flex items-center gap-1">
                      <Progress value={insight.confidence} className="h-1 w-16" />
                      <span className="text-xs font-medium">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado del aprendizaje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 text-center">
            <Brain className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-sm text-blue-600">Datos Procesados</p>
            <p className="text-2xl font-bold text-blue-700">1,247</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm text-green-600">Precisión Promedio</p>
            <p className="text-2xl font-bold text-green-700">84.5%</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-sm text-purple-600">Predicciones Activas</p>
            <p className="text-2xl font-bold text-purple-700">23</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningEngineSimulator;
