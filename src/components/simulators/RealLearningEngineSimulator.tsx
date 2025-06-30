
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
  TrendingDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area,
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg">Dashboard</TabsTrigger>
          <TabsTrigger value="market" className="rounded-lg">Mercado Lima</TabsTrigger>
          <TabsTrigger value="contacts" className="rounded-lg">Análisis Contactos</TabsTrigger>
          <TabsTrigger value="properties" className="rounded-lg">Análisis Propiedades</TabsTrigger>
          <TabsTrigger value="predictions" className="rounded-lg">Predicciones IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{contacts.length}</div>
                <p className="text-xs text-gray-600">
                  {contactAnalysis?.conversionRate?.toFixed(1)}% tasa de conversión
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">{properties.length}</div>
                <p className="text-xs text-gray-600">
                  S/ {propertyAnalysis?.avgPrice?.toLocaleString() || 0} precio promedio
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recordatorios</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{reminders.length}</div>
                <p className="text-xs text-gray-600">
                  {reminders.filter(r => r.priority === 'alta').length} alta prioridad
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicción IA</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">
                  {predictiveInsights?.nextMonthPrediction?.expectedSales || 0}
                </div>
                <p className="text-xs text-gray-600">
                  Ventas esperadas próximo mes
                </p>
              </CardContent>
            </Card>
          </div>

          {contactAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Tendencias Mensuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={contactAnalysis.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="contacts" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Distribución por Etapas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={Object.entries(contactAnalysis.stageDistribution).map(([key, value]) => ({
                          name: key.replace(/_/g, ' '),
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(contactAnalysis.stageDistribution).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="market">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Tendencias Mercado Lima 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={limaMarketTrends.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="contacts" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="conversions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Precios por Distrito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(limaMarketTrends.districtTrends).map(([district, data]) => ({
                    district,
                    avgPrice: data.avgPrice / 1000,
                    demand: data.demand === 'Muy Alta' ? 4 : data.demand === 'Alta' ? 3 : 2
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgPrice" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Análisis Estacional Lima
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {limaMarketTrends.seasonalPatterns.map((pattern, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-purple-700">
                          {new Date(2024, pattern.months[0], 1).toLocaleDateString('es-ES', { month: 'long' })}
                        </span>
                        <Badge variant={pattern.activity > 1.2 ? "default" : pattern.activity > 1 ? "secondary" : "outline"}>
                          {(pattern.activity * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{pattern.description}</p>
                    </div>
                  ))}
                </div>
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
                  Análisis Detallado por Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {individualContactAnalysis.slice(0, 9).map((contact) => (
                    <div key={contact.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-900">{contact.name}</h3>
                        <Badge variant={contact.riskLevel === 'Alto' ? 'destructive' : contact.riskLevel === 'Medio' ? 'default' : 'secondary'}>
                          {contact.riskLevel}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Etapa:</span>
                          <span className="font-medium">{contact.stage.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Días en etapa:</span>
                          <span className="font-medium">{contact.daysInCurrentStage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interacciones:</span>
                          <span className="font-medium">{contact.totalInteractions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Probabilidad:</span>
                          <span className="font-medium text-green-600">{contact.conversionProbability}%</span>
                        </div>
                        <div className="mt-3">
                          <Progress value={contact.conversionProbability} className="h-2" />
                        </div>
                        <div className="mt-3">
                          <h4 className="font-medium text-xs text-gray-700 mb-1">Recomendaciones:</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {contact.recommendedActions.slice(0, 2).map((action, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
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
