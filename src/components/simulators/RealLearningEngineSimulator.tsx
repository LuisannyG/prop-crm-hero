
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, TrendingUp, Users, Building, Target, 
  AlertCircle, Zap, Calendar, DollarSign,
  BarChart3, PieChart, Activity, Lightbulb,
  MapPin, Clock, Star, Shield, Eye, CheckCircle,
  TrendingDown, ArrowUp, ArrowDown, Home, Wallet
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  analyzeContacts, 
  analyzeProperties, 
  analyzeIndividualContacts, 
  analyzeIndividualProperties,
  analyzeCombined,
  generatePredictiveInsights,
  ContactAnalysis,
  PropertyAnalysis,
  IndividualContactAnalysis,
  IndividualPropertyAnalysis,
  CombinedAnalysis,
  PredictiveInsights
} from '@/utils/aiAnalytics';
import { limaMarketTrends, getRiskExplanation } from '@/utils/limaMarketData';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sales_stage: string;
  created_at: string;
  district?: string;
  client_type?: string;
  acquisition_source?: string;
}

interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  created_at: string;
  district?: string;
  area_m2?: number;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  reminder_date: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300'];

const RealLearningEngineSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  
  // Advanced analysis states
  const [contactAnalysis, setContactAnalysis] = useState<ContactAnalysis | null>(null);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysis | null>(null);
  const [individualContactAnalysis, setIndividualContactAnalysis] = useState<IndividualContactAnalysis[]>([]);
  const [individualPropertyAnalysis, setIndividualPropertyAnalysis] = useState<IndividualPropertyAnalysis[]>([]);
  const [combinedAnalysis, setCombinedAnalysis] = useState<CombinedAnalysis | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        toast({
          title: "Error",
          description: "Error al cargar los contactos.",
          variant: "destructive",
        });
      } else {
        setContacts(contactsData || []);
      }

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        toast({
          title: "Error",
          description: "Error al cargar las propiedades.",
          variant: "destructive",
        });
      } else {
        setProperties(propertiesData || []);
      }

      // Fetch reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_date', { ascending: true });

      if (remindersError) {
        console.error('Error fetching reminders:', remindersError);
        toast({
          title: "Error",
          description: "Error al cargar los recordatorios.",
          variant: "destructive",
        });
      } else {
        setReminders(remindersData || []);
      }

      await runAdvancedAnalysis();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAdvancedAnalysis = async () => {
    if (!user) return;

    try {
      setAnalysisLoading(true);

      // Run all analysis
      const [
        contactAnalysisResult,
        propertyAnalysisResult,
        individualContactsResult,
        individualPropertiesResult,
        combinedAnalysisResult
      ] = await Promise.all([
        analyzeContacts(user.id),
        analyzeProperties(user.id),
        analyzeIndividualContacts(user.id),
        analyzeIndividualProperties(user.id),
        analyzeCombined(user.id)
      ]);

      setContactAnalysis(contactAnalysisResult);
      setPropertyAnalysis(propertyAnalysisResult);
      setIndividualContactAnalysis(individualContactsResult);
      setIndividualPropertyAnalysis(individualPropertiesResult);
      setCombinedAnalysis(combinedAnalysisResult);

      // Generate predictive insights
      const predictiveResult = await generatePredictiveInsights(
        user.id,
        contactAnalysisResult,
        propertyAnalysisResult
      );
      setPredictiveInsights(predictiveResult);

    } catch (error) {
      console.error('Error running advanced analysis:', error);
      toast({
        title: "Error",
        description: "Error al ejecutar el análisis avanzado.",
        variant: "destructive",
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getRiskFactorsExplanation = (contact: IndividualContactAnalysis) => {
    const factors = [];
    const riskScore = 100 - contact.conversionProbability;
    
    if (contact.daysInCurrentStage > 21) {
      factors.push(`Lleva ${contact.daysInCurrentStage} días en la etapa "${contact.stage.replace(/_/g, ' ')}" sin avanzar, indicando posible desinterés o dudas no resueltas.`);
    } else if (contact.daysInCurrentStage > 14) {
      factors.push(`Ha permanecido ${contact.daysInCurrentStage} días en la etapa actual, más tiempo del promedio esperado.`);
    }
    
    if (contact.totalInteractions < 3) {
      factors.push(`Solo tiene ${contact.totalInteractions} interacciones registradas, lo que sugiere bajo nivel de engagement.`);
    } else if (contact.totalInteractions < 5) {
      factors.push(`Con ${contact.totalInteractions} interacciones, necesita más seguimiento para fortalecer la relación.`);
    }
    
    if (contact.stage === 'contacto_inicial' && contact.daysInCurrentStage > 7) {
      factors.push('Permanece en contacto inicial demasiado tiempo, puede estar comparando opciones o perdiendo interés.');
    }
    
    if (contact.stage === 'visita_realizada' && contact.daysInCurrentStage > 10) {
      factors.push('No ha progresado después de la visita, posiblemente tiene objeciones no expresadas sobre la propiedad.');
    }
    
    if (contact.stage === 'negociacion' && contact.daysInCurrentStage > 14) {
      factors.push('La negociación se ha extendido demasiado, puede haber problemas de financiamiento o expectativas de precio.');
    }
    
    return factors;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Iniciando análisis con IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Motor de Aprendizaje IA
              </h2>
              <p className="text-gray-600">Análisis predictivo basado en datos reales</p>
            </div>
          </div>
        </div>
        <Button 
          onClick={runAdvancedAnalysis} 
          disabled={analysisLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          {analysisLoading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Ejecutar Análisis IA
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          <TabsTrigger value="market" className="rounded-lg">Mercado Lima</TabsTrigger>
          <TabsTrigger value="contacts" className="rounded-lg">Análisis Contactos</TabsTrigger>
          <TabsTrigger value="properties" className="rounded-lg">Análisis Propiedades</TabsTrigger>
          <TabsTrigger value="predictions" className="rounded-lg">Predicciones IA</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Evolución Precios Lima 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={limaMarketTrends.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'avgPrice' ? `S/ ${value.toLocaleString()}` : value,
                      name === 'avgPrice' ? 'Precio Promedio' : 'Contactos'
                    ]} />
                    <Area type="monotone" dataKey="avgPrice" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Actividad por Distrito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={limaMarketTrends.districtActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activity" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-600" />
                  Demanda por Distrito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => ({
                        name: district,
                        value: data.demand === 'Muy Alta' ? 5 : data.demand === 'Alta' ? 4 : data.demand === 'Media' ? 3 : 2,
                        avgPrice: data.avgPrice
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value === 5 ? 'Muy Alta' : value === 4 ? 'Alta' : value === 3 ? 'Media' : 'Baja'}`}
                    >
                      {Object.entries(limaMarketTrends.districtTrends).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-orange-600" />
                  Crecimiento de Precios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => ({
                    district,
                    growth: data.priceGrowth,
                    avgPrice: data.avgPrice / 1000
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'growth' ? `${value}%` : `S/ ${value}K`,
                      name === 'growth' ? 'Crecimiento' : 'Precio Promedio'
                    ]} />
                    <Bar dataKey="growth" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-red-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Tendencias Estacionales Lima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={limaMarketTrends.seasonalPatterns.map((pattern, index) => ({
                    month: new Date(2024, pattern.months[0], 1).toLocaleDateString('es-ES', { month: 'short' }),
                    activity: pattern.activity * 100,
                    description: pattern.description
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Actividad']} />
                    <Line type="monotone" dataKey="activity" stroke="#DC2626" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Análisis Detallado de Riesgo por Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {individualContactAnalysis.slice(0, 12).map((contact) => {
                    const riskScore = 100 - contact.conversionProbability;
                    const riskFactors = getRiskFactorsExplanation(contact);
                    const riskExplanation = getRiskExplanation(riskScore, riskFactors);
                    
                    return (
                      <div key={contact.id} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-blue-900">{contact.name}</h3>
                              <p className="text-gray-600">{contact.stage.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={contact.riskLevel === 'Alto' ? 'destructive' : contact.riskLevel === 'Medio' ? 'default' : 'secondary'} className="text-sm">
                              Riesgo {contact.riskLevel}
                            </Badge>
                            <p className="text-2xl font-bold mt-1 text-blue-700">{contact.conversionProbability}%</p>
                            <p className="text-xs text-gray-500">Probabilidad de conversión</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/60 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Días en Etapa</span>
                            </div>
                            <p className="text-lg font-bold text-blue-900">{contact.daysInCurrentStage}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Activity className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Interacciones</span>
                            </div>
                            <p className="text-lg font-bold text-green-900">{contact.totalInteractions}</p>
                          </div>
                          <div className="bg-white/60 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-700">Score Riesgo</span>
                            </div>
                            <p className="text-lg font-bold text-purple-900">{riskScore.toFixed(0)}%</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Progress value={contact.conversionProbability} className="h-3" />
                        </div>

                        <div className="mb-4">
                          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            {riskExplanation.title}
                          </h4>
                          <p className="text-sm text-gray-700 mb-3">{riskExplanation.description}</p>
                          
                          {riskFactors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                              <h5 className="font-semibold text-red-800 mb-2">Factores de Riesgo Detectados:</h5>
                              <ul className="text-sm text-red-700 space-y-1">
                                {riskFactors.map((factor, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-600" />
                            Acciones Recomendadas:
                          </h4>
                          <ul className="text-sm text-green-700 space-y-2">
                            {contact.recommendedActions.map((action, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-600" />
                  Análisis Detallado por Propiedad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {individualPropertyAnalysis.slice(0, 9).map((property) => (
                    <div key={property.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-green-900 truncate">{property.title}</h3>
                        <Badge variant={property.pricePosition === 'Por encima del mercado' ? 'destructive' : property.pricePosition === 'Por debajo del mercado' ? 'default' : 'secondary'}>
                          {property.pricePosition === 'Por encima del mercado' ? 'Alto' : 
                           property.pricePosition === 'Por debajo del mercado' ? 'Bajo' : 'Mercado'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Posición:</span>
                          <span className="font-medium">{property.marketComparison > 0 ? '+' : ''}{property.marketComparison.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Días en mercado:</span>
                          <span className="font-medium">{property.daysOnMarket}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nivel de interés:</span>
                          <span className="font-medium">{property.interestLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Precio recomendado:</span>
                          <span className="font-medium text-blue-600">S/ {property.recommendedPrice.toLocaleString()}</span>
                        </div>
                        <div className="mt-3">
                          <Progress value={Math.min(100, property.interestLevel * 20)} className="h-2" />
                        </div>
                        <div className="mt-3">
                          <h4 className="font-medium text-xs text-gray-700 mb-1">Recomendación:</h4>
                          <p className="text-xs text-gray-600">{property.priceAdjustmentSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions">
          <div className="space-y-6">
            {predictiveInsights && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Contactos Esperados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{predictiveInsights.nextMonthPrediction.expectedContacts}</div>
                      <p className="text-xs opacity-80">Próximo mes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Ventas Esperadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{predictiveInsights.nextMonthPrediction.expectedSales}</div>
                      <p className="text-xs opacity-80">Próximo mes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Ingresos Esperados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">S/ {predictiveInsights.nextMonthPrediction.expectedRevenue.toLocaleString()}</div>
                      <p className="text-xs opacity-80">Próximo mes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Crecimiento Mercado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(predictiveInsights.nextMonthPrediction.marketGrowth * 100).toFixed(1)}%</div>
                      <p className="text-xs opacity-80">Crecimiento esperado</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Lightbulb className="w-5 h-5" />
                        Recomendaciones IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {predictiveInsights.recommendations.map((rec, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-green-900">{rec.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant={rec.impact === 'Alto' ? 'default' : rec.impact === 'Medio' ? 'secondary' : 'outline'}>
                                  {rec.impact}
                                </Badge>
                                <span className="text-xs text-gray-500">{rec.confidence}%</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-red-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        Alertas de Riesgo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {predictiveInsights.riskAlerts.map((alert, index) => (
                          <Alert key={index} className={`${
                            alert.severity === 'alta' ? 'border-red-200 bg-red-50' :
                            alert.severity === 'media' ? 'border-yellow-200 bg-yellow-50' :
                            'border-blue-200 bg-blue-50'
                          }`}>
                            <AlertCircle className={`h-4 w-4 ${
                              alert.severity === 'alta' ? 'text-red-600' :
                              alert.severity === 'media' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                            <AlertDescription className="text-sm">
                              <div className="flex items-center justify-between">
                                <span>{alert.message}</span>
                                <Badge variant={alert.severity === 'alta' ? 'destructive' : alert.severity === 'media' ? 'default' : 'secondary'}>
                                  {alert.severity}
                                </Badge>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealLearningEngineSimulator;
