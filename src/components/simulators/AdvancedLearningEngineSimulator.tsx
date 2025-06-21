
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  DollarSign, 
  Calendar,
  Crown,
  Zap,
  Star,
  Bot,
  ChartBar,
  Lightbulb
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const AdvancedLearningEngineSimulator = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("analytics");

  // Datos simulados para análisis predictivo
  const predictiveData = [
    { month: "Ene", ventas: 15, prediccion: 18, trend: 85 },
    { month: "Feb", ventas: 22, prediccion: 25, trend: 88 },
    { month: "Mar", ventas: 18, prediccion: 28, trend: 92 },
    { month: "Abr", ventas: 31, prediccion: 32, trend: 96 },
    { month: "May", ventas: 29, prediccion: 35, trend: 98 },
    { month: "Jun", ventas: 35, prediccion: 38, trend: 95 }
  ];

  // Datos de comportamiento de clientes
  const clientBehaviorData = [
    { segment: "Inversionistas", interes: 92, conversion: 45, value: 35 },
    { segment: "Familias", interes: 78, conversion: 62, value: 45 },
    { segment: "Jóvenes", interes: 85, conversion: 38, value: 15 },
    { segment: "Jubilados", interes: 65, conversion: 72, value: 5 }
  ];

  // Recomendaciones de IA
  const aiRecommendations = [
    {
      id: 1,
      type: "precio",
      titulo: "Optimización de Precio - Salamanca",
      descripcion: "Reducir precio en 5% puede aumentar interés en 40%",
      impacto: "Alto",
      confianza: 94
    },
    {
      id: 2,
      type: "marketing",
      titulo: "Segmentación de Audiencia",
      descripcion: "Enfocar marketing en familias jóvenes incrementará ROI 25%",
      impacto: "Medio",
      confianza: 87
    },
    {
      id: 3,
      type: "timing",
      titulo: "Momento Optimal de Contacto",
      descripcion: "Contactar clientes los martes por la tarde mejora respuesta 30%",
      impacto: "Medio",
      confianza: 91
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Anuncio Premium llamativo */}
      <div className="relative overflow-hidden">
        <Card className="border-4 border-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <CardContent className="p-6 text-white relative">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-bl-lg font-bold text-sm animate-pulse">
              🧠 IA PREMIUM
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
                  <h2 className="text-2xl font-bold">¡Motor de Aprendizaje IA Bloqueado!</h2>
                  <Bot className="w-6 h-6 text-purple-400 animate-bounce" />
                </div>
                <p className="text-blue-100 mb-4">
                  El <strong>Motor de Aprendizaje con IA</strong> es una función exclusiva Premium. 
                  ¡Usa inteligencia artificial para predecir tendencias y optimizar tus estrategias automáticamente!
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ChartBar className="w-4 h-4 text-blue-400" />
                    <span>Análisis Predictivo</span>
                  </div>
                  <div className="text-blue-300">•</div>
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Recomendaciones IA</span>
                  </div>
                  <div className="text-blue-300">•</div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-green-400" />
                    <span>Optimización Automática</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200 animate-pulse"
                >
                  🚀 Activar IA por S/60/mes
                </Button>
                <p className="text-xs text-blue-200 mt-2">
                  Incluye todas las funciones Premium
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gray-900/30 z-10 flex items-center justify-center">
          <div className="bg-white/95 p-8 rounded-lg shadow-2xl text-center max-w-md">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-pulse" />
            <h3 className="text-2xl font-bold mb-2">Vista Previa del Motor IA</h3>
            <p className="text-gray-600 mb-4">Esta es solo una pequeña muestra del poder de la inteligencia artificial aplicada a tu negocio inmobiliario</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-2">
              Desbloquear Motor IA Completo
            </Button>
            <p className="text-xs text-gray-500">+40% más ventas garantizado</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="opacity-60">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics IA
              </TabsTrigger>
              <TabsTrigger value="predictions">
                <TrendingUp className="w-4 h-4 mr-2" />
                Predicciones
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="w-4 h-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Target className="w-4 h-4 mr-2" />
                Recomendaciones
              </TabsTrigger>
            </TabsList>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="90d">90 días</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-600">Precisión IA</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">+127%</div>
                  <div className="text-sm text-gray-600">ROI Mejorado</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">38</div>
                  <div className="text-sm text-gray-600">Leads Calificados</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-yellow-600">S/2.4M</div>
                  <div className="text-sm text-gray-600">Ventas Proyectadas</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Análisis de Comportamiento por Segmento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientBehaviorData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="segment" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="interes" fill="#8884d8" name="Interés %" />
                        <Bar dataKey="conversion" fill="#82ca9d" name="Conversión %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Distribución de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientBehaviorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                        >
                          {clientBehaviorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Predicciones de Ventas con IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictiveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="ventas" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Ventas Reales"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="prediccion" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicción IA"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-lg font-bold text-green-600">Próximo Mes</div>
                  <div className="text-2xl font-bold">42 Ventas</div>
                  <div className="text-sm text-gray-600">+24% vs mes anterior</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-lg font-bold text-blue-600">Trimestre</div>
                  <div className="text-2xl font-bold">S/3.2M</div>
                  <div className="text-sm text-gray-600">Ingresos proyectados</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-lg font-bold text-purple-600">Mejor Momento</div>
                  <div className="text-lg font-bold">Mar 15-22</div>
                  <div className="text-sm text-gray-600">Para lanzar campañas</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Insights Automatizados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="font-medium">Patrón Detectado</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Los clientes contactados los martes tienen 34% más probabilidad de responder positivamente.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="font-medium">Oportunidad</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        El segmento "Familias jóvenes" muestra alta intención de compra pero baja conversión. Revisar estrategia.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                        <span className="font-medium">Alerta</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Las propiedades en Miraflores están recibiendo menos visitas. Considerar ajuste de precio.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Métricas de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Efectividad de Contacto</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Calidad de Leads</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Velocidad de Conversión</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Satisfacción del Cliente</span>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recomendaciones Personalizadas de IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{rec.titulo}</h4>
                        <div className="flex gap-2">
                          <Badge variant={rec.impacto === 'Alto' ? 'destructive' : 'default'}>
                            {rec.impacto}
                          </Badge>
                          <Badge variant="outline">
                            {rec.confianza}% confianza
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.descripcion}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Tipo: {rec.type} • Confianza: {rec.confianza}%
                        </div>
                        <Button size="sm" variant="outline">
                          Aplicar Recomendación
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedLearningEngineSimulator;
