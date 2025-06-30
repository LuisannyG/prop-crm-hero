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
  MapPin, Clock, Star, Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getLimaMarketData } from '@/utils/limaMarketData';
import RiskExplanationModal from '@/components/RiskExplanationModal';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sales_stage: string;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  created_at: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  reminder_date: string;
}

interface NoPurchaseReason {
  id: string;
  contact_id: string;
  property_id: string | null;
  reason_category: string;
  reason_details: string | null;
  price_feedback: number | null;
  will_reconsider: boolean;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
}

const RealLearningEngineSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [noPurchaseReasons, setNoPurchaseReasons] = useState<NoPurchaseReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showRiskExplanation, setShowRiskExplanation] = useState(false);

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

      // Fetch no purchase reasons
      const { data: noPurchaseReasonsData, error: noPurchaseReasonsError } = await supabase
        .from('no_purchase_reasons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (noPurchaseReasonsError) {
        console.error('Error fetching no purchase reasons:', noPurchaseReasonsError);
      } else {
        setNoPurchaseReasons(noPurchaseReasonsData || []);
      }

      processAnalysis(contactsData, propertiesData, remindersData, noPurchaseReasonsData);
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

  const processAnalysis = (
    contactsData: Contact[] | null,
    propertiesData: Property[] | null,
    remindersData: Reminder[] | null,
    noPurchaseReasonsData: NoPurchaseReason[] | null
  ) => {
    const totalContacts = contactsData?.length || 0;
    const totalProperties = propertiesData?.length || 0;
    const totalReminders = remindersData?.length || 0;
    const highPriorityReminders = remindersData?.filter(r => r.priority === 'alta').length || 0;
    const avgPropertyPrice = propertiesData?.reduce((acc, property) => acc + (property.price || 0), 0) / totalProperties || 0;

    setAnalysisResults({
      totalContacts,
      totalProperties,
      totalReminders,
      highPriorityReminders,
      avgPropertyPrice,
      noPurchaseReasonsCount: noPurchaseReasonsData?.length || 0
    });
  };

  // Enhanced predictions with more detailed forecasting
  const generateEnhancedPredictions = () => {
    const limaData = getLimaMarketData();
    const currentMonth = new Date().getMonth();
    const currentSeason = limaData.seasonalPatterns.find(s => s.months.includes(currentMonth));
    
    return {
      // Revenue predictions
      revenue: {
        nextMonth: Math.round((analysisResults?.avgPropertyPrice || 1) * (analysisResults?.totalProperties || 1) * 0.15 * (currentSeason?.activity || 1)),
        nextQuarter: Math.round((analysisResults?.avgPropertyPrice || 1) * (analysisResults?.totalProperties || 1) * 0.4 * (currentSeason?.activity || 1)),
        yearEnd: Math.round((analysisResults?.avgPropertyPrice || 1) * (analysisResults?.totalProperties || 1) * 1.2 * (currentSeason?.activity || 1))
      },
      
      // Sales predictions
      sales: {
        nextMonth: Math.max(1, Math.round((analysisResults?.totalContacts || 1) * 0.18 * (currentSeason?.activity || 1))),
        nextQuarter: Math.max(2, Math.round((analysisResults?.totalContacts || 1) * 0.45 * (currentSeason?.activity || 1))),
        yearEnd: Math.max(4, Math.round((analysisResults?.totalContacts || 1) * 1.3 * (currentSeason?.activity || 1)))
      },
      
      // Market predictions
      market: {
        priceGrowth: `${(limaData.marketTrends.priceGrowth * 100).toFixed(1)}%`,
        demandIncrease: `${(limaData.marketTrends.demandGrowth * 100).toFixed(1)}%`,
        bestDistricts: limaData.districtActivity.slice(0, 3).map(d => d.district),
        seasonalFactor: currentSeason?.description || 'Actividad normal'
      },

      // Lead generation predictions
      leads: {
        expectedLeads: Math.round((analysisResults?.totalContacts || 1) * 1.8),
        qualifiedLeads: Math.round((analysisResults?.totalContacts || 1) * 1.2),
        conversionRate: `${Math.min(25, 12 + (limaData.marketTrends.demandGrowth * 10)).toFixed(1)}%`
      },

      // Property performance predictions
      properties: {
        avgTimeToSell: Math.round(45 * (1 - (currentSeason?.activity || 0) * 0.3)),
        priceAppreciation: `${(limaData.marketTrends.priceGrowth * 100 * 1.2).toFixed(1)}%`,
        inventoryTurnover: Math.round(6 * (currentSeason?.activity || 1))
      }
    };
  };

  const predictions = generateEnhancedPredictions();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-gray-600">Analizando datos con IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Motor de Aprendizaje IA</h2>
          <p className="text-gray-600">Análisis predictivo basado en datos reales de Lima</p>
        </div>
        <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
          <Brain className="w-4 h-4 mr-2" />
          Actualizar Análisis
        </Button>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predicciones IA</TabsTrigger>
          <TabsTrigger value="insights">Insights Avanzados</TabsTrigger>
          <TabsTrigger value="individual">Análisis Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Revenue Predictions */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Predicciones de Ingresos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Próximo mes:</span>
                  <span className="font-semibold text-green-700">S/ {predictions.revenue.nextMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Próximo trimestre:</span>
                  <span className="font-semibold text-green-700">S/ {predictions.revenue.nextQuarter.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fin de año:</span>
                  <span className="font-semibold text-green-700">S/ {predictions.revenue.yearEnd.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sales Predictions */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Predicciones de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ventas próximo mes:</span>
                  <span className="font-semibold text-blue-700">{predictions.sales.nextMonth} propiedades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ventas trimestre:</span>
                  <span className="font-semibold text-blue-700">{predictions.sales.nextQuarter} propiedades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meta anual:</span>
                  <span className="font-semibold text-blue-700">{predictions.sales.yearEnd} propiedades</span>
                </div>
              </CardContent>
            </Card>

            {/* Market Predictions */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tendencias del Mercado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crecimiento precios:</span>
                  <span className="font-semibold text-purple-700">{predictions.market.priceGrowth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Aumento demanda:</span>
                  <span className="font-semibold text-purple-700">{predictions.market.demandIncrease}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Mejores distritos: </span>
                  <span className="font-semibold text-purple-700">{predictions.market.bestDistricts.join(', ')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Lead Generation Predictions */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Generación de Leads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nuevos leads:</span>
                  <span className="font-semibold text-orange-700">{predictions.leads.expectedLeads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Leads calificados:</span>
                  <span className="font-semibold text-orange-700">{predictions.leads.qualifiedLeads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasa conversión:</span>
                  <span className="font-semibold text-orange-700">{predictions.leads.conversionRate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Property Performance */}
            <Card className="border-teal-200 bg-teal-50">
              <CardHeader>
                <CardTitle className="text-teal-800 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Desempeño Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo venta:</span>
                  <span className="font-semibold text-teal-700">{predictions.properties.avgTimeToSell} días</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Apreciación:</span>
                  <span className="font-semibold text-teal-700">{predictions.properties.priceAppreciation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rotación inventario:</span>
                  <span className="font-semibold text-teal-700">{predictions.properties.inventoryTurnover} meses</span>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Factor */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Factor Estacional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-700 mb-2">
                    {predictions.market.seasonalFactor}
                  </div>
                  <p className="text-sm text-gray-600">
                    El mercado de Lima muestra patrones estacionales que afectan la demanda y precios
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Lightbulb className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Identifica patrones en tus clientes para mejorar la segmentación y personalización.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Tasa de conversión por segmento de cliente</li>
                  <li>Análisis de la etapa del embudo de ventas</li>
                  <li>Comportamiento de compra y preferencias</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <MapPin className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Propiedades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Optimiza tu portafolio de propiedades con análisis detallados.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Tiempo promedio de venta por tipo de propiedad</li>
                  <li>Retorno de inversión (ROI) por propiedad</li>
                  <li>Análisis de precios y tendencias del mercado</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Clock className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Gestiona tu tiempo de manera eficiente con análisis predictivos.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Tiempo promedio para cerrar una venta</li>
                  <li>Mejores momentos para contactar a los clientes</li>
                  <li>Optimización de la programación de tareas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Star className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Riesgo de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Identifica clientes en riesgo de abandonar el proceso de compra.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Puntuación de riesgo individual por cliente</li>
                  <li>Factores de riesgo clave</li>
                  <li>Recomendaciones personalizadas para mitigar el riesgo</li>
                </ul>
                <Button variant="link" onClick={() => setShowRiskExplanation(true)}>
                  ¿Cómo funciona el análisis de riesgo?
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Shield className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Descubre oportunidades ocultas en tu base de datos.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Clientes con alta probabilidad de compra</li>
                  <li>Propiedades con mayor potencial de venta</li>
                  <li>Estrategias de marketing personalizadas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <RiskExplanationModal
        isOpen={showRiskExplanation}
        onClose={() => setShowRiskExplanation(false)}
      />
    </div>
  );
};

export default RealLearningEngineSimulator;
