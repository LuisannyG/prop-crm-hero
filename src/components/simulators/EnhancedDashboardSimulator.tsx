
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, FunnelChart, Funnel, LabelList } from "recharts";
import { Users, Home, Building, User, AlertCircle, Calendar, Phone, Mail, TrendingUp, AlertTriangle, Target, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  client_type: string;
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

interface SalesFunnelData {
  id: string;
  contact_id: string;
  stage: string;
  stage_date: string;
  notes: string;
}

interface NoPurchaseReason {
  id: string;
  contact_id: string;
  reason_category: string;
  reason_details: string;
  created_at: string;
}

interface PerformanceMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  channel: string;
  team_member_id: string;
}

interface UserProfile {
  user_type: 'independent_agent' | 'small_company';
}

const EnhancedDashboardSimulator = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [salesFunnel, setSalesFunnel] = useState<SalesFunnelData[]>([]);
  const [noPurchaseReasons, setNoPurchaseReasons] = useState<NoPurchaseReason[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        console.log('Obteniendo datos para usuario:', user.id);
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profileData);

        // Fetch contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (contactsError) {
          console.error('Error fetching contacts:', contactsError);
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
        } else {
          setReminders(remindersData || []);
        }

        // Fetch sales funnel data
        const { data: salesFunnelData, error: salesFunnelError } = await supabase
          .from('sales_funnel')
          .select('*')
          .eq('user_id', user.id)
          .order('stage_date', { ascending: false });

        if (salesFunnelError) {
          console.error('Error fetching sales funnel:', salesFunnelError);
        } else {
          setSalesFunnel(salesFunnelData || []);
        }

        // Fetch no purchase reasons
        const { data: noPurchaseData, error: noPurchaseError } = await supabase
          .from('no_purchase_reasons')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (noPurchaseError) {
          console.error('Error fetching no purchase reasons:', noPurchaseError);
        } else {
          setNoPurchaseReasons(noPurchaseData || []);
        }

        // Fetch performance metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('performance_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('metric_date', { ascending: false });

        if (metricsError) {
          console.error('Error fetching performance metrics:', metricsError);
        } else {
          setPerformanceMetrics(metricsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  // Calculate statistics
  const totalContacts = contacts.length;
  const totalProperties = properties.length;
  const totalReminders = reminders.length;
  const highPriorityReminders = reminders.filter(r => r.priority === 'alta' && r.status === 'pendiente').length;

  // Prepare sales funnel data
  const funnelStages = ['prospecto', 'calificado', 'propuesta', 'negociacion', 'cerrado_ganado'];
  const funnelData = funnelStages.map(stage => {
    const count = salesFunnel.filter(item => item.stage === stage).length;
    return { name: stage.charAt(0).toUpperCase() + stage.slice(1), value: count, fill: stage === 'cerrado_ganado' ? '#10B981' : '#3B82F6' };
  });

  // Client type analysis
  const clientTypeData = contacts.reduce((acc, contact) => {
    const type = contact.client_type || 'Sin especificar';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clientTypeChartData = Object.entries(clientTypeData).map(([name, value]) => ({
    name: name === 'buyer' ? 'Comprador' : 
          name === 'seller' ? 'Vendedor' : 
          name === 'investor' ? 'Inversionista' : name,
    value
  }));

  // No purchase reasons analysis
  const reasonsData = noPurchaseReasons.reduce((acc, reason) => {
    const category = reason.reason_category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reasonsChartData = Object.entries(reasonsData).map(([name, value]) => ({
    name: name === 'precio' ? 'Precio' :
          name === 'ubicacion' ? 'Ubicación' :
          name === 'tamano' ? 'Tamaño' :
          name === 'financiacion' ? 'Financiación' :
          name === 'otra_propiedad' ? 'Otra Propiedad' :
          name === 'timing' ? 'Timing' :
          name === 'competencia' ? 'Competencia' : name,
    value
  }));

  // Performance metrics by channel (for independent agents) or team member (for companies)
  const performanceData = performanceMetrics.reduce((acc, metric) => {
    const key = userProfile?.user_type === 'independent_agent' ? metric.channel || 'Sin canal' : metric.team_member_id || 'Sin asignar';
    if (!acc[key]) acc[key] = 0;
    acc[key] += metric.metric_value;
    return acc;
  }, {} as Record<string, number>);

  const performanceChartData = Object.entries(performanceData).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Sort reminders by priority (alta first) and overdue status
  const sortedReminders = [...reminders].sort((a, b) => {
    // First sort by status (pendiente first)
    if (a.status !== b.status) {
      return a.status === 'pendiente' ? -1 : 1;
    }
    // Then by priority (alta first)
    const priorityOrder = { 'alta': 0, 'media': 1, 'baja': 2 };
    if (a.priority !== b.priority) {
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
    }
    // Finally by date (overdue first)
    const aOverdue = new Date(a.reminder_date) < new Date();
    const bOverdue = new Date(b.reminder_date) < new Date();
    return bOverdue ? 1 : -1;
  });

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{totalContacts}</div>
            <div className="text-sm text-gray-600">Contactos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{totalProperties}</div>
            <div className="text-sm text-gray-600">Propiedades</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{totalReminders}</div>
            <div className="text-sm text-gray-600">Recordatorios</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{highPriorityReminders}</div>
            <div className="text-sm text-gray-600">Alta Prioridad</div>
          </CardContent>
        </Card>
      </div>

      {/* Recordatorios Inteligentes Priorizados */}
      <Card className="shadow-md">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-800 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Recordatorios Inteligentes (Priorizados)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {sortedReminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay recordatorios pendientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedReminders.slice(0, 5).map(reminder => {
                const isOverdue = new Date(reminder.reminder_date) < new Date() && reminder.status === 'pendiente';
                const isHighPriority = reminder.priority === 'alta';
                
                return (
                  <div 
                    key={reminder.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      reminder.status === 'completado'
                        ? 'bg-gray-100 border-gray-200' 
                        : isHighPriority || isOverdue
                          ? 'bg-red-50 border-red-300 shadow-md' 
                          : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${
                        reminder.status === 'completado'
                          ? 'text-gray-400' 
                          : isHighPriority || isOverdue
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {isHighPriority || isOverdue ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className={`font-medium ${reminder.status === 'completado' ? 'line-through text-gray-400' : ''}`}>
                          {reminder.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(reminder.reminder_date).toLocaleDateString()} - {reminder.description}
                        </div>
                        {isOverdue && reminder.status === 'pendiente' && (
                          <div className="text-xs text-red-600 font-medium">¡Vencido!</div>
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      isHighPriority ? 'destructive' : 
                      reminder.priority === 'media' ? 'default' : 'outline'
                    } className={isHighPriority ? 'animate-pulse' : ''}>
                      {reminder.priority === 'alta' ? 'ALTA' : 
                       reminder.priority === 'media' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Embudo de Ventas */}
        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Embudo de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {funnelData.length === 0 || funnelData.every(d => d.value === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos del embudo de ventas</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel de Control - Tipos de Cliente */}
        <Card className="shadow-md">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Tipos de Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {clientTypeChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de tipos de cliente</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientTypeChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {clientTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Motivos de No Compra */}
        <Card className="shadow-md">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Motivos de No Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {reasonsChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de motivos de no compra</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reasonsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Métricas de Rendimiento */}
        <Card className="shadow-md">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-800 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              {userProfile?.user_type === 'independent_agent' ? 'Rendimiento por Canal' : 'Rendimiento del Equipo'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {performanceChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay métricas de rendimiento</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboardSimulator;
