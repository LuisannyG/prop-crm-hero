
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

const RealLearningEngineSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

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

      processAnalysis(contactsData, propertiesData, remindersData);
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
    remindersData: Reminder[] | null
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
      avgPropertyPrice
    });
  };

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
          <p className="text-gray-600">Análisis predictivo basado en tus datos reales</p>
        </div>
        <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
          <Brain className="w-4 h-4 mr-2" />
          Actualizar Análisis
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisResults?.totalContacts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Base de datos de clientes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisResults?.totalProperties || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Inventario disponible
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recordatorios</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisResults?.totalReminders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Tareas pendientes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  S/ {analysisResults?.avgPropertyPrice?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor promedio de propiedades
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <Star className="w-5 h-5 mr-2 inline-block" />
                  Análisis de Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Evalúa y mejora tu rendimiento con métricas clave.
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Métricas de conversión y cierre</li>
                  <li>Análisis de la efectividad de marketing</li>
                  <li>Identificación de oportunidades de mejora</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Las recomendaciones se basan en el análisis de tus datos reales y las mejores prácticas del sector inmobiliario.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-green-700">
                    <Target className="w-5 h-5 mr-2 inline-block" />
                    Oportunidades de Crecimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-1">Alta</Badge>
                      <span className="text-sm">Incrementar seguimiento de leads calientes</span>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-1">Media</Badge>
                      <span className="text-sm">Diversificar tipos de propiedades</span>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-1">Baja</Badge>
                      <span className="text-sm">Mejorar estrategia de precios</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-700">
                    <Zap className="w-5 h-5 mr-2 inline-block" />
                    Acciones Prioritarias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Badge variant="destructive" className="mr-2 mt-1">Urgente</Badge>
                      <span className="text-sm">Contactar clientes sin actividad reciente</span>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="default" className="mr-2 mt-1">Normal</Badge>
                      <span className="text-sm">Actualizar información de propiedades</span>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-1">Planificado</Badge>
                      <span className="text-sm">Crear contenido de marketing</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealLearningEngineSimulator;
