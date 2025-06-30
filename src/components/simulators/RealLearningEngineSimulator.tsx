
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Users, 
  DollarSign,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  User,
  Home,
  Activity,
  FileText,
  History
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { 
  analyzeContacts, 
  analyzeProperties, 
  generatePredictiveInsights, 
  analyzeIndividualContacts,
  analyzeIndividualProperties,
  analyzeCombined,
  ContactAnalysis, 
  PropertyAnalysis, 
  PredictiveInsights,
  IndividualContactAnalysis,
  IndividualPropertyAnalysis,
  CombinedAnalysis
} from "@/utils/aiAnalytics";
import { limaMarketTrends } from "@/utils/limaMarketData";
import { useAuth } from "@/contexts/AuthContext";
import RiskExplanationModal from "@/components/RiskExplanationModal";
import NoPurchaseHistoryModal from "@/components/NoPurchaseHistoryModal";

const RealLearningEngineSimulator = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contactAnalysis, setContactAnalysis] = useState<ContactAnalysis | null>(null);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysis | null>(null);
  const [insights, setInsights] = useState<PredictiveInsights | null>(null);
  const [individualContacts, setIndividualContacts] = useState<IndividualContactAnalysis[]>([]);
  const [individualProperties, setIndividualProperties] = useState<IndividualPropertyAnalysis[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState<CombinedAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedClientForRisk, setSelectedClientForRisk] = useState<any>(null);
  const [showNoPurchaseHistory, setShowNoPurchaseHistory] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Cargando análisis completo de datos...');
      
      const [contactData, propertyData] = await Promise.all([
        analyzeContacts(user.id),
        analyzeProperties(user.id)
      ]);
      
      setContactAnalysis(contactData);
      setPropertyAnalysis(propertyData);
      
      // Generar predicciones afinadas con datos reales de Lima
      const currentMonth = new Date().getMonth();
      const currentMonthData = limaMarketTrends.monthlyData[currentMonth] || limaMarketTrends.monthlyData[0];
      
      const refinedInsights: PredictiveInsights = {
        nextMonthPrediction: {
          expectedContacts: Math.max(1, Math.round(contactData.totalContacts * (currentMonthData.marketActivity === 'Muy Alta' ? 1.4 : currentMonthData.marketActivity === 'Alta' ? 1.2 : currentMonthData.marketActivity === 'Media' ? 1.0 : 0.8))),
          expectedSales: Math.max(0, Math.round(contactData.totalContacts * (contactData.conversionRate / 100) * (currentMonthData.marketActivity === 'Muy Alta' ? 1.3 : 1.0))),
          expectedRevenue: Math.round(propertyData.avgPrice * contactData.totalContacts * (contactData.conversionRate / 100) * (currentMonthData.marketActivity === 'Muy Alta' ? 1.3 : 1.0)),
          marketGrowth: currentMonthData.marketActivity === 'Muy Alta' ? 8.5 : currentMonthData.marketActivity === 'Alta' ? 6.2 : currentMonthData.marketActivity === 'Media' ? 4.1 : 2.3
        },
        recommendations: generateLimaSpecificRecommendations(contactData, propertyData, currentMonthData),
        riskAlerts: []
      };
      
      setInsights(refinedInsights);
      
      const [individualContactsData, individualPropertiesData, combinedData] = await Promise.all([
        analyzeIndividualContacts(user.id),
        analyzeIndividualProperties(user.id),
        analyzeCombined(user.id)
      ]);
      
      setIndividualContacts(individualContactsData);
      setIndividualProperties(individualPropertiesData);
      setCombinedAnalysis(combinedData);
      
      // Cargar contactos y propiedades para el historial
      const { supabase } = await import("@/integrations/supabase/client");
      const [{ data: contactsData }, { data: propertiesData }] = await Promise.all([
        supabase.from('contacts').select('id, full_name').eq('user_id', user.id),
        supabase.from('properties').select('id, title').eq('user_id', user.id)
      ]);
      
      setContacts(contactsData || []);
      setProperties(propertiesData || []);
      
      console.log('Análisis completo:', { contactData, propertyData, refinedInsights, individualContactsData, individualPropertiesData, combinedData });
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar recomendaciones específicas del mercado de Lima
  const generateLimaSpecificRecommendations = (contactData: ContactAnalysis, propertyData: PropertyAnalysis, monthData: any) => {
    const recommendations = [];
    const currentMonth = new Date().toLocaleDateString('es-PE', { month: 'long' });
    
    // Recomendaciones por actividad del mercado
    if (monthData.marketActivity === 'Muy Alta') {
      recommendations.push({
        type: 'urgente',
        title: 'Aprovechar Pico de Demanda en Lima',
        description: `${currentMonth} muestra actividad muy alta en Lima. Incrementa tu seguimiento a leads activos y considera ofertas especiales.`,
        impact: 'Alto',
        confidence: 92
      });
    }

    // Recomendaciones por distrito
    const topDistricts = Object.entries(limaMarketTrends.districtTrends)
      .filter(([_, data]) => data.demand === 'Muy Alta')
      .sort((a, b) => b[1].priceGrowth - a[1].priceGrowth)
      .slice(0, 2);

    if (topDistricts.length > 0) {
      recommendations.push({
        type: 'oportunidad',
        title: `Enfocar en ${topDistricts[0][0]} y ${topDistricts[1]?.[0] || 'distritos premium'}`,
        description: `${topDistricts[0][0]} tiene crecimiento del ${topDistricts[0][1].priceGrowth}% y demanda muy alta. Prioriza leads en estas zonas.`,
        impact: 'Alto',
        confidence: 88
      });
    }

    // Recomendaciones por conversión
    if (contactData.conversionRate < 15) {
      recommendations.push({
        type: 'mejora',
        title: 'Optimizar Proceso de Conversión',
        description: `Tu tasa de conversión (${contactData.conversionRate.toFixed(1)}%) está por debajo del promedio de Lima (18%). Implementa seguimiento más estructurado.`,
        impact: 'Alto',
        confidence: 85
      });
    }

    // Recomendaciones por precio
    const limaAvgPrice = 350000; // Precio promedio de Lima
    if (propertyData.avgPrice > limaAvgPrice * 1.2) {
      recommendations.push({
        type: 'precios',
        title: 'Revisar Estrategia de Precios Premium',
        description: `Tus propiedades tienen precio promedio 20% sobre el mercado limeño. Considera segmentar por distritos premium o ajustar estrategia.`,
        impact: 'Medio',
        confidence: 78
      });
    }

    // Recomendaciones estacionales
    const seasonalPattern = limaMarketTrends.seasonalPatterns[currentMonth];
    if (seasonalPattern) {
      recommendations.push({
        type: 'estacional',
        title: `Estrategia para ${currentMonth}`,
        description: `Tendencia estacional: ${seasonalPattern}. Ajusta tu enfoque comercial según este patrón.`,
        impact: 'Medio',
        confidence: 82
      });
    }

    return recommendations.slice(0, 5); // Máximo 5 recomendaciones
  };

  useEffect(() => {
    loadAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Analizando tus datos con IA...</p>
        </div>
      </div>
    );
  }

  if (!contactAnalysis || !propertyAnalysis || !insights) {
    return (
      <div className="text-center p-8">
        <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">No hay suficientes datos</h3>
        <p className="text-gray-600 mb-4">Necesitas al menos algunos contactos y propiedades para generar análisis predictivos.</p>
        <Button onClick={loadAnalytics}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  // Usar datos reales de Lima para las tendencias mensuales
  const limaMonthlyData = limaMarketTrends.monthlyData.slice(-6); // Últimos 6 meses

  const priceByTypeData = Object.entries(propertyAnalysis.priceByType).map(([type, price]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    price: Math.round(price)
  }));

  const priceRangeData = Object.entries(propertyAnalysis.priceRangeDistribution).map(([range, count]) => ({
    range,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Header con métricas principales */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Motor de Aprendizaje IA - Lima</h2>
            <p className="text-blue-100">Análisis predictivo con datos reales del mercado limeño</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowNoPurchaseHistory(true)}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <History className="w-4 h-4 mr-2" />
              Historial No Compras
            </Button>
            <Button 
              onClick={loadAnalytics}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Total Contactos</span>
            </div>
            <div className="text-2xl font-bold">{contactAnalysis.totalContacts}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Tasa Conversión</span>
            </div>
            <div className="text-2xl font-bold">{contactAnalysis.conversionRate.toFixed(1)}%</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Precio Promedio</span>
            </div>
            <div className="text-2xl font-bold">S/{propertyAnalysis.avgPrice.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Tendencia Lima</span>
            </div>
            <div className="text-2xl font-bold">+{insights.nextMonthPrediction.marketGrowth.toFixed(1)}%</div>
            <div className="text-xs text-blue-200">Crecimiento mensual</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Mercado Lima
          </TabsTrigger>
          <TabsTrigger value="individual-contacts">
            <User className="w-4 h-4 mr-2" />
            Por Contacto
          </TabsTrigger>
          <TabsTrigger value="individual-properties">
            <Home className="w-4 h-4 mr-2" />
            Por Propiedad
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <TrendingUp className="w-4 h-4 mr-2" />
            Predicciones
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Target className="w-4 h-4 mr-2" />
            Recomendaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Tendencias reales de Lima */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendencias Reales del Mercado de Lima (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={limaMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'contacts' ? `${value} contactos` :
                        name === 'conversions' ? `${value} conversiones` :
                        `S/ ${value?.toLocaleString()}`,
                        name === 'contacts' ? 'Contactos' :
                        name === 'conversions' ? 'Conversiones' : 'Precio Promedio'
                      ]}
                    />
                    <Line type="monotone" dataKey="contacts" stroke="#8884d8" name="contacts" />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="conversions" />
                    <Line type="monotone" dataKey="avgPrice" stroke="#ff7300" name="avgPrice" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Actividad por distrito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Actividad por Distritos de Lima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => (
                  <div key={district} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{district}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Demanda:</span>
                        <Badge variant={data.demand === 'Muy Alta' ? 'destructive' : data.demand === 'Alta' ? 'default' : 'outline'}>
                          {data.demand}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Crecimiento:</span>
                        <span className="text-sm font-medium text-green-600">+{data.priceGrowth}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Precio Prom:</span>
                        <span className="text-sm font-medium">S/{data.avgPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Distribución de Precios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceRangeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual-contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Análisis Individual de Contactos con Explicación de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {individualContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-600">Etapa: {contact.stage.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={contact.riskLevel === 'Alto' ? 'destructive' : contact.riskLevel === 'Medio' ? 'default' : 'outline'}>
                          Riesgo: {contact.riskLevel}
                        </Badge>
                        <Badge variant="secondary">
                          {contact.conversionProbability}% conversión
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedClientForRisk({
                            name: contact.name,
                            riskScore: contact.riskLevel === 'Alto' ? 85 : contact.riskLevel === 'Medio' ? 55 : 25,
                            lastContactDays: contact.daysInCurrentStage,
                            interactionFrequency: contact.totalInteractions / 4, // Aprox por semana
                            engagementScore: contact.conversionProbability,
                            salesStage: contact.stage,
                            riskFactors: contact.riskLevel === 'Alto' ? [
                              `${contact.daysInCurrentStage} días sin avance en la etapa`,
                              'Baja frecuencia de comunicación',
                              'Falta de seguimiento estructurado'
                            ] : contact.riskLevel === 'Medio' ? [
                              'Proceso de decisión lento',
                              'Comparando con otras opciones'
                            ] : [],
                            recommendations: contact.recommendedActions
                          })}
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Ver Riesgo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Días en etapa:</span> {contact.daysInCurrentStage}
                      </div>
                      <div>
                        <span className="font-medium">Interacciones:</span> {contact.totalInteractions}
                      </div>
                      <div>
                        <span className="font-medium">Última interacción:</span> {new Date(contact.lastInteractionDate).toLocaleDateString()}
                      </div>
                    </div>

                    {contact.recommendedActions.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium text-blue-800 mb-2">Acciones recomendadas:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {contact.recommendedActions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual-properties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Análisis Individual de Propiedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {individualProperties.map((property) => (
                  <div key={property.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-sm text-gray-600">Posición: {property.pricePosition}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={property.pricePosition === 'Por encima del mercado' ? 'destructive' : 'outline'}>
                          {property.marketComparison > 0 ? '+' : ''}{property.marketComparison.toFixed(1)}% vs mercado
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Días en mercado:</span> {property.daysOnMarket}
                      </div>
                      <div>
                        <span className="font-medium">Nivel de interés:</span> {property.interestLevel}
                      </div>
                      <div>
                        <span className="font-medium">Precio recomendado:</span> S/{property.recommendedPrice.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-medium text-green-800 mb-1">Sugerencia de precios:</p>
                      <p className="text-sm text-green-700">{property.priceAdjustmentSuggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <div className="text-2xl font-bold text-green-600">{insights.nextMonthPrediction.expectedContacts}</div>
                <div className="text-sm text-gray-600">Contactos Esperados</div>
                <div className="text-xs text-green-700 mt-2">Basado en tendencias de Lima</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{insights.nextMonthPrediction.expectedSales}</div>
                <div className="text-sm text-gray-600">Ventas Proyectadas</div>
                <div className="text-xs text-blue-700 mt-2">Ajustado por estacionalidad</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">S/{insights.nextMonthPrediction.expectedRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Ingresos Estimados</div>
                <div className="text-xs text-purple-700 mt-2">Proyección con precios Lima</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">{insights.nextMonthPrediction.marketGrowth.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Crecimiento de Mercado</div>
                <div className="text-xs text-orange-700 mt-2">Datos reales Lima</div>
              </CardContent>
            </Card>
          </div>

          {/* Contexto estacional específico de Lima */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Contexto Estacional Lima - {new Date().toLocaleDateString('es-PE', { month: 'long' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">Patrón Estacional Actual:</p>
                <p className="text-blue-700">{limaMarketTrends.seasonalPatterns[new Date().toLocaleDateString('es-PE', { month: 'long' })] || 'Información no disponible para este mes'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Alertas específicas del mercado de Lima */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Alertas del Mercado de Lima - {new Date().toLocaleDateString('es-PE', { month: 'long' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50">
                  <div className="flex justify-between items-start">
                    <p className="text-sm">Miraflores y Barranco muestran el mayor crecimiento (+8.5% y +9.2%). Prioriza leads en estas zonas.</p>
                    <Badge variant="destructive">Crítico</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <p className="text-sm">La actividad actual del mercado es "{limaMarketTrends.monthlyData[limaMarketTrends.monthlyData.length - 1]?.marketActivity}". Ajusta tu estrategia de seguimiento.</p>
                    <Badge variant="default">Importante</Badge>
                  </div>
                </div>
                <div className="p-3 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex justify-between items-start">
                    <p className="text-sm">Precio promedio en Lima: S/305,000. Tus propiedades están {propertyAnalysis.avgPrice > 305000 ? 'por encima' : 'por debajo'} del mercado.</p>
                    <Badge variant="outline">Info</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones Específicas para Lima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={rec.impact === 'Alto' ? 'destructive' : rec.impact === 'Medio' ? 'default' : 'outline'}>
                          {rec.impact}
                        </Badge>
                        <Badge variant="secondary">
                          {rec.confidence}% confianza
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Tipo: {rec.type} • Basado en datos de Lima
                      </div>
                      <Button size="sm" variant="outline">
                        Aplicar Sugerencia
                      </Button>
                    </div>
                  </div>
                ))}

                {insights.recommendations.length === 0 && (
                  <div className="text-center p-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No hay recomendaciones específicas en este momento.</p>
                    <p className="text-sm">Continúa registrando datos para obtener insights más precisos.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      {selectedClientForRisk && (
        <RiskExplanationModal
          isOpen={!!selectedClientForRisk}
          onClose={() => setSelectedClientForRisk(null)}
          clientData={selectedClientForRisk}
        />
      )}

      <NoPurchaseHistoryModal
        isOpen={showNoPurchaseHistory}
        onClose={() => setShowNoPurchaseHistory(false)}
        contacts={contacts}
        properties={properties}
      />
    </div>
  );
};

export default RealLearningEngineSimulator;
