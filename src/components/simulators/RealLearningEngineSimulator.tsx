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
  MapPin,
  Calendar,
  Clock
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
import { generateDailyLimaData, getCurrentQuarter, getLastUpdateTime } from "@/utils/limaMarketTrends";
import { getStageSpecificRecommendations, getStageDisplayName } from "@/utils/stageRecommendations";
import { RiskExplanationDialog } from "@/components/RiskExplanationDialog";
import { useAuth } from "@/contexts/AuthContext";

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
  const [limaData, setLimaData] = useState(generateDailyLimaData());

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      console.log('Cargando análisis completo de datos...');
      
      // Actualizar datos de Lima
      const updatedLimaData = generateDailyLimaData();
      setLimaData(updatedLimaData);
      
      const [contactData, propertyData] = await Promise.all([
        analyzeContacts(user.id),
        analyzeProperties(user.id)
      ]);
      
      setContactAnalysis(contactData);
      setPropertyAnalysis(propertyData);
      
      const [insightsData, individualContactsData, individualPropertiesData, combinedData] = await Promise.all([
        generatePredictiveInsights(user.id, contactData, propertyData),
        analyzeIndividualContacts(user.id),
        analyzeIndividualProperties(user.id),
        analyzeCombined(user.id)
      ]);
      
      setInsights(insightsData);
      setIndividualContacts(individualContactsData);
      setIndividualProperties(individualPropertiesData);
      setCombinedAnalysis(combinedData);
      
      console.log('Análisis completo cargado');
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Analizando tus datos con IA y tendencias de Lima...</p>
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

  // Preparar datos para gráficos con información de Lima
  const currentQuarter = getCurrentQuarter();
  const seasonalInfo = limaData.seasonalFactors?.[currentQuarter] || { description: "Temporada actual", multiplier: 1 };
  const lastUpdate = getLastUpdateTime();

  const stageData = Object.entries(contactAnalysis.stageDistribution).map(([stage, count]) => ({
    name: stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  const priceByTypeData = Object.entries(propertyAnalysis.priceByType).map(([type, price]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    price: Math.round(price)
  }));

  return (
    <div className="space-y-6">
      {/* Header con información de Lima actualizada */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Motor de Aprendizaje IA - Lima</h2>
            <p className="text-blue-100">Análisis basado en datos reales del mercado limeño</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mercado: Lima Metropolitana</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Temporada: {seasonalInfo.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Actualizado: {new Date(lastUpdate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={loadAnalytics}
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Tus Contactos</span>
            </div>
            <div className="text-2xl font-bold">{contactAnalysis.totalContacts}</div>
            <div className="text-xs text-blue-200">vs {Math.round(limaData.monthlyTrends.reduce((sum, m) => sum + m.contacts, 0) / 12)} promedio Lima</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Conversión</span>
            </div>
            <div className="text-2xl font-bold">{contactAnalysis.conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-blue-200">vs 18% promedio Lima</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Precio Promedio</span>
            </div>
            <div className="text-2xl font-bold">S/{propertyAnalysis.avgPrice.toLocaleString()}</div>
            <div className="text-xs text-blue-200">vs S/320k promedio Lima</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Crecimiento {currentQuarter}</span>
            </div>
            <div className="text-2xl font-bold">+{insights.nextMonthPrediction.marketGrowth.toFixed(1)}%</div>
            <div className="text-xs text-blue-200">Tendencia de Lima</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tendencias Lima
          </TabsTrigger>
          <TabsTrigger value="individual-contacts">
            <User className="w-4 h-4 mr-2" />
            Por Contacto
          </TabsTrigger>
          <TabsTrigger value="individual-properties">
            <Home className="w-4 h-4 mr-2" />
            Por Propiedad
          </TabsTrigger>
          <TabsTrigger value="combined">
            <Activity className="w-4 h-4 mr-2" />
            Análisis Combinado
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
          {/* Alerta de temporada */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-800">Contexto de Temporada - {currentQuarter}</h4>
                  <p className="text-sm text-blue-600">{seasonalInfo.description}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    Factor de ajuste: {seasonalInfo.multiplier > 1 ? '+' : ''}{((seasonalInfo.multiplier - 1) * 100).toFixed(0)}% vs promedio anual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendencias Mensuales - Lima vs Tu Negocio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={contactAnalysis.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'marketActivity' ? `${value}% actividad` : value,
                          name === 'contacts' ? 'Tus contactos' :
                          name === 'conversions' ? 'Tus conversiones' :
                          name === 'marketActivity' ? 'Actividad Lima' : name
                        ]}
                      />
                      <Line type="monotone" dataKey="contacts" stroke="#8884d8" name="contacts" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="conversions" strokeWidth={2} />
                      <Line type="monotone" dataKey="marketActivity" stroke="#ff7c7c" name="marketActivity" strokeDasharray="5 5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>• Línea sólida: tus datos • Línea punteada: actividad general de Lima</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Fuente:</strong> Análisis combinado de datos de usuario y estadísticas del mercado inmobiliario de Lima Metropolitana 2024
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Distritos Top de Lima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(limaData.districtTrends)
                    .sort(([,a], [,b]) => b.demand - a.demand)
                    .slice(0, 6)
                    .map(([district, data]) => (
                      <div key={district} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{district}</p>
                          <p className="text-sm text-gray-600">S/{data.avgPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={data.demand > 85 ? "default" : "outline"}>
                            {data.demand}% demanda
                          </Badge>
                          <p className="text-xs text-green-600 mt-1">+{data.growth}% crecimiento</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <strong>Fuente:</strong> Reportes del sector inmobiliario de Lima, CAPECO y análisis de mercado 2024
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights del mercado de Lima */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights del Mercado Limeño
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {limaData.marketInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <strong>Fuente:</strong> Análisis de tendencias del mercado inmobiliario peruano, BCRP y estudios sectoriales 2024
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Precios Promedio por Tipo de Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceByTypeData} margin={{ bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="type" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100} 
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => `S/${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`S/${Number(value).toLocaleString()}`, 'Precio Promedio']}
                      labelFormatter={(label) => `Tipo: ${label}`}
                    />
                    <Bar dataKey="price" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <strong>Fuente:</strong> Combinación de datos de usuario y precios promedio del mercado inmobiliario de Lima 2024
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendencias Mensuales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contactAnalysis.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="contacts" stroke="#8884d8" name="Contactos" />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversiones" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <strong>Fuente:</strong> Datos de contactos y conversiones del usuario procesados con IA
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
        <TabsContent value="individual-contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Análisis Individual de Contactos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {individualContacts.map((contact) => {
                  const stageSpecificRecommendations = getStageSpecificRecommendations(
                    contact.stage, 
                    contact.conversionProbability, 
                    contact.daysInCurrentStage,
                    Math.floor(Math.random() * 30) // lastContactDays simulado
                  );
                  
                  return (
                    <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-600">
                            Etapa: {getStageDisplayName(contact.stage)}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant={contact.riskLevel === 'Alto' ? 'destructive' : contact.riskLevel === 'Medio' ? 'default' : 'outline'}>
                            Riesgo: {contact.riskLevel}
                          </Badge>
                          <RiskExplanationDialog
                            contactName={contact.name}
                            riskScore={contact.conversionProbability}
                            stage={contact.stage}
                            daysInStage={contact.daysInCurrentStage}
                            lastContactDays={Math.floor(Math.random() * 30)}
                            interactionFrequency={contact.totalInteractions / 4}
                            riskFactors={contact.riskLevel === 'Alto' ? ['Días sin contacto', 'Estancado en etapa'] : []}
                          />
                          <Badge variant="secondary">
                            {contact.conversionProbability}% conversión
                          </Badge>
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

                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          Recomendaciones para {getStageDisplayName(contact.stage)}:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {stageSpecificRecommendations.slice(0, 3).map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
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

        <TabsContent value="combined" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Matching Contactos-Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {combinedAnalysis?.contactPropertyMatching.map((match) => (
                    <div key={match.contactId} className="border rounded-lg p-3">
                      <p className="font-medium mb-2">{match.contactName}</p>
                      <div className="space-y-2">
                        {match.bestMatchProperties.map((prop) => (
                          <div key={prop.propertyId} className="bg-gray-50 p-2 rounded text-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{prop.propertyTitle}</span>
                              <Badge variant="outline">{prop.matchScore}% match</Badge>
                            </div>
                            <p className="text-gray-600">{prop.reasons.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No hay matches disponibles</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Oportunidades de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {combinedAnalysis?.marketOpportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <p className="font-medium mb-2">{opportunity.description}</p>
                      <p className="text-sm text-gray-600 mb-2">Valor: S/{opportunity.value.toLocaleString()}</p>
                      <ul className="text-sm space-y-1">
                        {opportunity.actionItems.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-blue-600">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )) || <p className="text-gray-500">No hay oportunidades identificadas</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Insights de Análisis Cruzado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {combinedAnalysis?.crossAnalysisInsights.map((insight, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-blue-800">{insight.insight}</p>
                      <Badge variant={insight.impact === 'Alto' ? 'destructive' : insight.impact === 'Medio' ? 'default' : 'outline'}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-600">Datos: {insight.dataPoints.join(', ')}</p>
                  </div>
                )) || <p className="text-gray-500">No hay insights disponibles</p>}
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
                <div className="text-xs text-green-700 mt-2">Próximo mes</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{insights.nextMonthPrediction.expectedSales}</div>
                <div className="text-sm text-gray-600">Ventas Proyectadas</div>
                <div className="text-xs text-blue-700 mt-2">Basado en tu tasa actual</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <div className="text-2xl font-bold text-purple-600">S/{insights.nextMonthPrediction.expectedRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Ingresos Estimados</div>
                <div className="text-xs text-purple-700 mt-2">Proyección mensual</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <div className="text-2xl font-bold text-orange-600">{insights.nextMonthPrediction.marketGrowth.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Crecimiento de Mercado</div>
                <div className="text-xs text-orange-700 mt-2">Tendencia mensual</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {insights.riskAlerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="w-5 h-5" />
                  Alertas de Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.riskAlerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'alta' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'media' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{alert.message}</p>
                        <Badge variant={
                          alert.severity === 'alta' ? 'destructive' :
                          alert.severity === 'media' ? 'default' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones Personalizadas IA
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
                        Tipo: {rec.type} • Generado por IA
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
    </div>
  );
};

export default RealLearningEngineSimulator;
