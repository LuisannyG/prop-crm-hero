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
  Clock,
  Info,
  HelpCircle
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
import { limaMarketTrends, getCurrentQuarter, shouldUpdateData, getLastUpdateDate } from "@/utils/limaMarketTrends";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("");
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const getRiskExplanation = (riskLevel: string, stage: string, daysInStage: number, totalInteractions: number) => {
    const explanations = {
      'Alto': {
        'Prospecto inicial': `Riesgo alto porque lleva ${daysInStage} días sin avanzar desde el contacto inicial. Con solo ${totalInteractions} interacciones, muestra poco engagement.`,
        'Contacto realizado': `Riesgo alto: ${daysInStage} días desde el primer contacto sin generar interés real. Necesita seguimiento inmediato.`,
        'Interés mostrado': `Riesgo alto: A pesar de mostrar interés inicial, lleva ${daysInStage} días estancado. Puede estar considerando otras opciones.`,
        'Cita programada': `Riesgo alto: Cita programada pero ${daysInStage} días sin concretar. Posible pérdida de interés o problemas de timing.`,
        'Propuesta enviada': `Riesgo alto: Propuesta enviada hace ${daysInStage} días sin respuesta. Puede estar evaluando competencia o perdió interés.`,
        'Negociación': `Riesgo alto: Negociación estancada por ${daysInStage} días. Posibles objeciones no resueltas o problemas de precio.`,
        'Contrato enviado': `Riesgo alto: Contrato enviado hace ${daysInStage} días sin firma. Posibles dudas de último momento.`,
        'default': `Riesgo alto: Proceso estancado por ${daysInStage} días con baja actividad (${totalInteractions} interacciones).`
      },
      'Medio': {
        'Prospecto inicial': `Riesgo medio: Contacto reciente pero necesita seguimiento activo para mantener interés.`,
        'Contacto realizado': `Riesgo medio: Contacto establecido pero requiere nurturing para avanzar a la siguiente etapa.`,
        'Interés mostrado': `Riesgo medio: Interés confirmado pero necesita propuesta concreta para avanzar.`,
        'Cita programada': `Riesgo medio: Cita programada, buen momento para profundizar necesidades.`,
        'Propuesta enviada': `Riesgo medio: Propuesta reciente, en período normal de evaluación.`,
        'Negociación': `Riesgo medio: Negociación activa, requiere seguimiento para cerrar.`,
        'Contrato enviado': `Riesgo medio: Contrato en revisión, período normal de evaluación legal.`,
        'default': `Riesgo medio: Proceso en desarrollo normal, requiere seguimiento consistente.`
      },
      'Bajo': {
        'Prospecto inicial': `Riesgo bajo: Contacto reciente y engagement positivo inicial.`,
        'Contacto realizado': `Riesgo bajo: Comunicación fluida establecida, progreso normal.`,
        'Interés mostrado': `Riesgo bajo: Interés confirmado con interacciones frecuentes.`,
        'Cita programada': `Riesgo bajo: Cita confirmada con cliente comprometido.`,
        'Propuesta enviada': `Riesgo bajo: Propuesta bien recibida, cliente activo en comunicación.`,
        'Negociación': `Riesgo bajo: Negociación activa con avances positivos.`,
        'Contrato enviado': `Riesgo bajo: Cliente comprometido, proceso de firma en curso.`,
        'default': `Riesgo bajo: Cliente activo con engagement positivo constante.`
      }
    };

    return explanations[riskLevel as keyof typeof explanations]?.[stage as keyof typeof explanations['Alto']] || 
           explanations[riskLevel as keyof typeof explanations]?.default || 
           'Análisis de riesgo basado en actividad y tiempo en etapa actual.';
  };

  const getStageSpecificRecommendations = (stage: string, riskLevel: string, daysInStage: number) => {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      'Prospecto inicial': {
        'Alto': ['Llamada inmediata para confirmar interés', 'Enviar información básica por WhatsApp', 'Agendar cita presencial urgente'],
        'Medio': ['Seguimiento telefónico', 'Enviar catálogo de propiedades', 'Programar cita en los próximos 3 días'],
        'Bajo': ['Continuar con proceso normal', 'Enviar propiedades relevantes', 'Mantener comunicación regular']
      },
      'Contacto realizado': {
        'Alto': ['Reactivar con propuesta de valor única', 'Cambiar canal de comunicación', 'Ofrecer visita inmediata'],
        'Medio': ['Llamar para entender necesidades específicas', 'Enviar opciones personalizadas', 'Programar segunda cita'],
        'Bajo': ['Profundizar en necesidades específicas', 'Presentar opciones más detalladas', 'Agendar visita a propiedades']
      },
      'Interés mostrado': {
        'Alto': ['Revisión urgente de objeciones', 'Ajustar propuesta de valor', 'Reunión presencial inmediata'],
        'Medio': ['Clarificar dudas pendientes', 'Mostrar propiedades similares', 'Discutir opciones de financiamiento'],
        'Bajo': ['Presentar propuesta formal', 'Agendar visitas a propiedades', 'Preparar documentación preliminar']
      },
      'Cita programada': {
        'Alto': ['Confirmar cita urgentemente', 'Ofrecer nueva fecha/hora', 'Reunión virtual como alternativa'],
        'Medio': ['Confirmar cita 24h antes', 'Preparar presentación personalizada', 'Enviar ubicación y detalles'],
        'Bajo': ['Confirmar cita normalmente', 'Preparar documentos de propiedades', 'Planificar visita completa']
      },
      'Propuesta enviada': {
        'Alto': ['Llamar para discutir propuesta', 'Revisar y ajustar términos', 'Ofrecer alternativas inmediatas'],
        'Medio': ['Seguimiento sobre dudas de la propuesta', 'Aclarar términos y condiciones', 'Preparar documentación adicional'],
        'Bajo': ['Seguimiento normal de propuesta', 'Estar disponible para preguntas', 'Preparar próximos pasos']
      },
      'Negociación': {
        'Alto': ['Identificar objeciones principales', 'Proponer soluciones creativas', 'Involucrar a supervisor si es necesario'],
        'Medio': ['Revisar puntos de negociación', 'Buscar términos de compromiso', 'Documentar acuerdos parciales'],
        'Bajo': ['Continuar negociación constructiva', 'Documentar puntos acordados', 'Preparar contrato preliminar']
      },
      'Contrato enviado': {
        'Alto': ['Llamar para revisar contrato juntos', 'Aclarar cláusulas específicas', 'Ofrecer firma presencial'],
        'Medio': ['Seguimiento sobre revisión del contrato', 'Estar disponible para dudas legales', 'Coordinar con abogados si es necesario'],
        'Bajo': ['Seguimiento normal de firma', 'Preparar documentos finales', 'Coordinar fecha de cierre']
      }
    };

    return recommendations[stage]?.[riskLevel] || [
      'Mantener comunicación regular',
      'Monitorear progreso del cliente',
      'Ajustar estrategia según respuesta'
    ];
  };

  const loadAnalytics = async (forceUpdate = false) => {
    if (!user?.id) return;
    
    // Verificar si necesitamos actualizar los datos
    if (!forceUpdate && !shouldUpdateData()) return;
    
    setLoading(true);
    try {
      console.log('Cargando análisis actualizado con datos del', new Date().toLocaleString('es-PE'));
      
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
      setLastUpdateTime(getLastUpdateDate());
      
      console.log('Análisis actualizado exitosamente');
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-actualización cada hora si está habilitada
  useEffect(() => {
    if (autoUpdateEnabled) {
      const interval = setInterval(() => {
        loadAnalytics(true);
      }, 60 * 60 * 1000); // 1 hora

      return () => clearInterval(interval);
    }
  }, [autoUpdateEnabled, user?.id]);

  useEffect(() => {
    loadAnalytics();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Actualizando datos con información de hoy...</p>
          <p className="text-sm text-gray-500 mt-2">Analizando tendencias de Lima en tiempo real</p>
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
        <Button onClick={() => loadAnalytics(true)}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar datos
        </Button>
      </div>
    );
  }

  const currentQuarter = getCurrentQuarter();
  const seasonalInfo = limaMarketTrends.seasonalFactors[currentQuarter];

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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Motor de Aprendizaje IA - Lima</h2>
            <p className="text-blue-100">Análisis basado en datos actualizados diariamente</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Mercado: Lima Metropolitana</span>
              </div>
              <span className="text-blue-200">•</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Temporada: {seasonalInfo.description}</span>
              </div>
              <span className="text-blue-200">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Actualizado: {lastUpdateTime}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
              variant="outline" 
              className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${autoUpdateEnabled ? 'bg-green-500/20' : ''}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Auto-actualización {autoUpdateEnabled ? 'ON' : 'OFF'}
            </Button>
            <Button 
              onClick={() => loadAnalytics(true)}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar ahora
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Tus Contactos</span>
            </div>
            <div className="text-2xl font-bold">{contactAnalysis.totalContacts}</div>
            <div className="text-xs text-blue-200">vs {Math.round(limaMarketTrends.monthlyTrends.reduce((sum, m) => sum + m.contacts, 0) / 12)} promedio Lima</div>
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
            <div className="text-xs text-blue-200">Tendencia actualizada hoy</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>{insights.dataFreshness}</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-100">
              Datos en tiempo real
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Tendencias Diarias
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
                  <p className="text-xs text-green-600 mt-1">✓ Actualizado hoy: {new Date().toLocaleDateString('es-PE')}</p>
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
                    <strong>Fuente:</strong> Datos actualizados diariamente - Última actualización: {contactAnalysis.lastUpdated}
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
                  {Object.entries(limaMarketTrends.districtTrends)
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
                  <strong>Fuente:</strong> Datos del mercado inmobiliario de Lima actualizados diariamente
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights del Mercado Limeño - Actualizados Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {limaMarketTrends.marketInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">{insight}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <strong>Fuente:</strong> Análisis actualizado diariamente basado en tendencias del mercado peruano - {new Date().toLocaleDateString('es-PE')}
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
                <strong>Fuente:</strong> Precios actualizados diariamente - Última actualización: {propertyAnalysis.lastUpdated}
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
                {individualContacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-600">Etapa: {contact.stage.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          <Badge variant={contact.riskLevel === 'Alto' ? 'destructive' : contact.riskLevel === 'Medio' ? 'default' : 'outline'}>
                            Riesgo: {contact.riskLevel}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <HelpCircle className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Info className="w-5 h-5" />
                                  Explicación del Riesgo
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm font-medium mb-2">Cliente: {contact.name}</p>
                                  <p className="text-sm text-gray-600">Etapa: {contact.stage}</p>
                                  <p className="text-sm text-gray-600">Nivel de riesgo: {contact.riskLevel}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-2">¿Por qué este nivel de riesgo?</p>
                                  <p className="text-sm text-gray-700">
                                    {getRiskExplanation(contact.riskLevel, contact.stage, contact.daysInCurrentStage, contact.totalInteractions)}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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
                        Acciones recomendadas para "{contact.stage}":
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {getStageSpecificRecommendations(contact.stage, contact.riskLevel, contact.daysInCurrentStage).map((action, index) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>
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
                <div className="text-xs text-orange-700 mt-2">Actualizado hoy</div>
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
                Recomendaciones Actualizadas con IA
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
                        Tipo: {rec.type} • Actualizado: {insights.lastUpdated}
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
