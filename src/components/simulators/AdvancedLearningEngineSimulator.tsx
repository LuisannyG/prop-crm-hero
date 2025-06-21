
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Zap, 
  BarChart3,
  PieChart,
  Activity,
  Cpu,
  Database,
  Network,
  Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const AdvancedLearningEngineSimulator = () => {
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);

  const analysisPhases = [
    "Recolectando datos del mercado...",
    "Analizando patrones de comportamiento...",
    "Procesando tendencias inmobiliarias...",
    "Generando predicciones IA...",
    "Optimizando estrategias...",
    "Análisis completado ✓"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setAnalyzing(false);
          return 100;
        }
        const newProgress = prev + 2;
        setCurrentPhase(Math.floor(newProgress / 20));
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Datos para gráficos
  const marketTrendData = [
    { month: 'Ene', precio: 450000, volumen: 120, prediccion: 465000 },
    { month: 'Feb', precio: 462000, volumen: 135, prediccion: 470000 },
    { month: 'Mar', precio: 458000, volumen: 142, prediccion: 475000 },
    { month: 'Abr', precio: 471000, volumen: 156, prediccion: 480000 },
    { month: 'May', precio: 485000, volumen: 171, prediccion: 492000 },
    { month: 'Jun', precio: 478000, volumen: 163, prediccion: 495000 }
  ];

  const propertyTypeData = [
    { type: 'Apartamentos', value: 45, color: '#3B82F6' },
    { type: 'Casas', value: 30, color: '#10B981' },
    { type: 'Locales', value: 15, color: '#F59E0B' },
    { type: 'Oficinas', value: 10, color: '#EF4444' }
  ];

  const zonePerformanceData = [
    { zona: 'San Isidro', actual: 520000, prediccion: 562000, confidence: 94 },
    { zona: 'Miraflores', actual: 480000, prediccion: 518000, confidence: 89 },
    { zona: 'Surco', actual: 380000, prediccion: 437000, confidence: 96 },
    { zona: 'La Molina', actual: 420000, prediccion: 445000, confidence: 82 },
    { zona: 'San Borja', actual: 350000, prediccion: 378000, confidence: 91 }
  ];

  const marketPredictions = [
    { zone: "San Isidro", trend: "+12%", confidence: 94, risk: "Bajo" },
    { zone: "Miraflores", trend: "+8%", confidence: 89, risk: "Medio" },
    { zone: "Surco", trend: "+15%", confidence: 96, risk: "Bajo" },
    { zone: "La Molina", trend: "+6%", confidence: 82, risk: "Alto" }
  ];

  const aiInsights = [
    { type: "Oportunidad", icon: Target, message: "Propiedades en Surco tienen 73% probabilidad de incremento", color: "text-green-500" },
    { type: "Alerta", icon: AlertTriangle, message: "Mercado saturado en Barranco - evitar inversiones", color: "text-orange-500" },
    { type: "Tendencia", icon: TrendingUp, message: "Departamentos de 2 dormitorios aumentarán 18% en Q3", color: "text-blue-500" }
  ];

  const performanceMetrics = [
    { label: "Precisión IA", value: 94, max: 100, color: "bg-green-500" },
    { label: "Velocidad Análisis", value: 87, max: 100, color: "bg-blue-500" },
    { label: "Datos Procesados", value: 76, max: 100, color: "bg-purple-500" },
    { label: "Confiabilidad", value: 92, max: 100, color: "bg-orange-500" }
  ];

  const chartConfig = {
    precio: {
      label: "Precio Actual",
      color: "#3B82F6",
    },
    prediccion: {
      label: "Predicción IA",
      color: "#10B981",
    },
    volumen: {
      label: "Volumen",
      color: "#F59E0B",
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estado del análisis */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Sistema de Análisis Predictivo IA</CardTitle>
                <p className="text-sm text-gray-600">Versión 3.2.1 - Neural Engine Activo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${analyzing ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
              <span className="text-sm font-medium">
                {analyzing ? 'Analizando...' : 'Listo'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso del Análisis</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-blue-600 font-medium">
              {analysisPhases[Math.min(currentPhase, analysisPhases.length - 1)]}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos principales */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tendencias del mercado con líneas */}
        <Card className="border border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-5 h-5" />
              Tendencias del Mercado IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={marketTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `$${(value as number).toLocaleString()}`, 
                    name === 'precio' ? 'Precio Actual' : 'Predicción IA'
                  ]}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="precio" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="prediccion" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribución por tipo de propiedad */}
        <Card className="border border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <PieChart className="w-5 h-5" />
              Distribución del Mercado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart data={propertyTypeData}>
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <ChartTooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                  <ChartLegend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {propertyTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.type}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras - Rendimiento por zona */}
      <Card className="border border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <BarChart3 className="w-5 h-5" />
            Análisis Predictivo por Zonas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <BarChart data={zonePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `$${(value as number).toLocaleString()}`, 
                  name === 'actual' ? 'Precio Actual' : 'Predicción IA'
                ]}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="actual" fill="#3B82F6" name="Precio Actual" />
              <Bar dataKey="prediccion" fill="#10B981" name="Predicción IA" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Predicciones de Mercado */}
        <Card className="border border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              Predicciones de Mercado IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketPredictions.map((pred, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium">{pred.zone}</p>
                    <p className="text-sm text-gray-600">Proyección 6 meses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{pred.trend}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Confianza: {pred.confidence}%</span>
                      <Badge variant={pred.risk === 'Bajo' ? 'default' : pred.risk === 'Medio' ? 'secondary' : 'destructive'} className="text-xs">
                        {pred.risk}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights de IA */}
        <Card className="border border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Zap className="w-5 h-5" />
              Insights Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <p className="font-medium text-sm">{insight.type}</p>
                      <p className="text-sm text-gray-700">{insight.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Rendimiento del Sistema */}
      <Card className="border border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Activity className="w-5 h-5" />
            Rendimiento del Motor Neural
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg border">
                <p className="text-2xl font-bold text-gray-800">{metric.value}%</p>
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Panel de Control Avanzado */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 text-sm">
              <BarChart3 className="w-4 h-4" />
              Análisis de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Propiedades analizadas</span>
                <span className="font-bold">12,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transacciones procesadas</span>
                <span className="font-bold">3,291</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Patrones identificados</span>
                <span className="font-bold">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-200 bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-800 text-sm">
              <Database className="w-4 h-4" />
              Base de Datos IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Modelos entrenados</span>
                <span className="font-bold">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Precisión promedio</span>
                <span className="font-bold">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Última actualización</span>
                <span className="font-bold">2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-pink-200 bg-pink-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-800 text-sm">
              <Network className="w-4 h-4" />
              Red Neural
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Nodos activos</span>
                <span className="font-bold">1,024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Conexiones</span>
                <span className="font-bold">45,892</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estado</span>
                <span className="font-bold text-green-600">Óptimo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualización de datos en tiempo real */}
      <Card className="border-2 border-gradient-to-r from-cyan-500 to-blue-500 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-800">
            <Eye className="w-5 h-5" />
            Monitor de Actividad en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 font-mono text-green-400 text-sm">
            <div className="space-y-1">
              <p>[{new Date().toLocaleTimeString()}] Neural network processing market data...</p>
              <p>[{new Date().toLocaleTimeString()}] Pattern recognition: 94.7% confidence</p>
              <p>[{new Date().toLocaleTimeString()}] Predictive model updated: San Isidro sector</p>
              <p>[{new Date().toLocaleTimeString()}] AI recommendation generated: BUY signal</p>
              <p>[{new Date().toLocaleTimeString()}] Risk assessment completed: LOW risk zone</p>
              <p className="text-yellow-400">[{new Date().toLocaleTimeString()}] System status: OPTIMAL</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedLearningEngineSimulator;
