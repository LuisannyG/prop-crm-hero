
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { Users, Home, Building, User, AlertCircle, Calendar, Phone, Mail, TrendingUp, AlertTriangle, Target, DollarSign, MapPin, Clock, BarChart3, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  client_type: string;
  acquisition_source: string;
  sales_stage: string;
  created_at: string;
  updated_at: string;
}

interface Property {
  id: string;
  title: string;
  property_type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  district: string;
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

// Move COLORS array to the top before it's used
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#4ECDC4', '#95E1D3'];

const EnhancedDashboardSimulator = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
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

        // Fetch contacts with ALL fields including updated_at
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('id, full_name, email, phone, status, client_type, acquisition_source, sales_stage, created_at, updated_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (contactsError) {
          console.error('Error fetching contacts:', contactsError);
        } else {
          console.log('Fetched contacts:', contactsData);
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

  // Calculate totals from the state arrays
  const totalContacts = contacts.length;
  const totalProperties = properties.length;
  const totalReminders = reminders.length;
  const highPriorityReminders = reminders.filter(reminder => reminder.priority === 'alta' && reminder.status === 'pendiente').length;

  // Updated sales funnel stages with specific colors - now using sales_stage from contacts
  const funnelStages = [
    { key: 'contacto_inicial_recibido', name: 'Contacto inicial recibido', color: '#FF6B6B' },
    { key: 'primer_contacto_activo', name: 'Primer contacto activo', color: '#4ECDC4' },
    { key: 'llenado_ficha', name: 'Llenado de ficha', color: '#95E1D3' },
    { key: 'seguimiento_inicial', name: 'Seguimiento inicial', color: '#FECA57' },
    { key: 'agendamiento_visitas', name: 'Agendamiento de visitas o reuniones', color: '#FF9FF3' },
    { key: 'presentacion_personalizada', name: 'Presentación personalizada', color: '#54A0FF' },
    { key: 'negociacion', name: 'Negociación', color: '#5F27CD' },
    { key: 'cierre_firma_contrato', name: 'Cierre / Firma de contrato', color: '#10B981' },
    { key: 'postventa_fidelizacion', name: 'Postventa y fidelización', color: '#00D2D3' }
  ];

  const funnelData = funnelStages.map(stage => {
    const count = contacts.filter(contact => contact.sales_stage === stage.key).length;
    return { 
      name: stage.name, 
      value: count, 
      fill: stage.color 
    };
  });

  // Client type analysis
  const clientTypeData = contacts.reduce((acc, contact) => {
    const type = contact.client_type || 'Sin especificar';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const clientTypeChartData = Object.entries(clientTypeData).map(([name, value], index) => ({
    name: name === 'familiar' ? 'Familiar' : 
          name === 'individual' ? 'Individual' : 
          name === 'negocio' ? 'Negocio' : 
          name === 'empresa' ? 'Empresa' :
          name === 'inversionista' ? 'Inversionista' : name,
    value,
    fill: COLORS[index % COLORS.length]
  }));


  // Performance metrics by specific channels
  const channelMapping = {
    'tiktok': 'TikTok',
    'instagram': 'Instagram', 
    'facebook': 'Facebook',
    'google': 'Google',
    'whatsapp': 'WhatsApp',
    'referido': 'Referido',
    'feria-inmobiliaria': 'Feria Inmobiliaria',
    'llamada-fria': 'Llamada en frío',
    'sitio-web': 'Sitio Web',
    'otro': 'Otro'
  };

  const performanceData = contacts.reduce((acc, contact) => {
    const channel = contact.acquisition_source || 'Sin canal';
    const displayName = channelMapping[channel as keyof typeof channelMapping] || channel;
    acc[displayName] = (acc[displayName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const performanceChartData = Object.entries(performanceData).map(([name, value], index) => ({
    name,
    value,
    fill: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#F97316', '#84CC16', '#FF6B6B', '#4ECDC4'][index % 9]
  }));

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

  // NEW CHARTS DATA PROCESSING

  // 1. Contacts trend by month (last 6 months)
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        fullDate: date
      });
    }
    return months;
  };

  const monthsData = getLast6Months();
  const contactsTrendData = monthsData.map(({ month, fullDate }) => {
    const monthStart = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    const monthEnd = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0, 23, 59, 59);
    
    const count = contacts.filter(contact => {
      const contactDate = new Date(contact.created_at);
      return contactDate >= monthStart && contactDate <= monthEnd;
    }).length;

    return { month, contactos: count };
  });

  // 2. Property status data
  const propertyStatusData = properties.reduce((acc, property) => {
    const status = property.status || 'sin_estado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyStatusChartData = Object.entries(propertyStatusData).map(([status, count], index) => ({
    name: status === 'available' ? 'Disponible' :
          status === 'sold' ? 'Vendida' :
          status === 'reserved' ? 'Reservada' :
          status === 'rented' ? 'Alquilada' : 'Sin Estado',
    value: count,
    fill: ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'][index % 5]
  }));

  // 3. Reminder status for radial chart
  const reminderStatusData = reminders.reduce((acc, reminder) => {
    const status = reminder.status || 'sin_estado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reminderRadialData = Object.entries(reminderStatusData).map(([status, count], index) => ({
    name: status === 'pendiente' ? 'Pendientes' :
          status === 'completado' ? 'Completados' : 'Sin Estado',
    value: count,
    fill: status === 'pendiente' ? '#EF4444' : '#10B981'
  }));

  // 4. Properties by district
  const districtData = properties.reduce((acc, property) => {
    const district = property.district || 'Sin distrito';
    acc[district] = (acc[district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const districtChartData = Object.entries(districtData).map(([name, value], index) => ({
    name,
    value,
    fill: COLORS[index % COLORS.length]
  }));

  // 5. Properties by type
  const propertyTypeData = properties.reduce((acc, property) => {
    const type = property.property_type || 'Sin tipo';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyTypeChartData = Object.entries(propertyTypeData).map(([name, value], index) => ({
    name: name === 'apartment' ? 'Departamento' :
          name === 'house' ? 'Casa' :
          name === 'commercial' ? 'Comercial' :
          name === 'land' ? 'Terreno' : name,
    value,
    fill: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  }));

  // 6. Activity by month (contacts + properties created)
  const activityData = monthsData.map(({ month, fullDate }) => {
    const monthStart = new Date(fullDate.getFullYear(), fullDate.getMonth(), 1);
    const monthEnd = new Date(fullDate.getFullYear(), fullDate.getMonth() + 1, 0, 23, 59, 59);
    
    const contactsCount = contacts.filter(contact => {
      const contactDate = new Date(contact.created_at);
      return contactDate >= monthStart && contactDate <= monthEnd;
    }).length;

    const propertiesCount = properties.filter(property => {
      const propertyDate = new Date(property.created_at);
      return propertyDate >= monthStart && propertyDate <= monthEnd;
    }).length;

    return { 
      month, 
      contactos: contactsCount, 
      propiedades: propertiesCount,
      total: contactsCount + propertiesCount
    };
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
        {/* Embudo de Ventas - Expandible */}
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
              <Accordion type="multiple" className="w-full">
                {funnelStages.map((stage, index) => {
                  const stageContacts = contacts.filter(contact => contact.sales_stage === stage.key);
                  const count = stageContacts.length;
                  
                  return (
                    <AccordionItem key={stage.key} value={stage.key}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: stage.color }}
                            ></div>
                            <span className="text-gray-700 font-medium text-left">{stage.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-bold">
                              {count}
                            </Badge>
                            <span className="text-gray-500 text-xs">
                              ({totalContacts > 0 ? Math.round((count / totalContacts) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {stageContacts.length === 0 ? (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No hay contactos en esta etapa
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {stageContacts.map(contact => (
                              <div key={contact.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                <div>
                                  <div className="font-medium text-sm">{contact.full_name}</div>
                                  <div className="text-xs text-gray-600 flex items-center gap-4">
                                    {contact.email && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {contact.email}
                                      </span>
                                    )}
                                    {contact.phone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {contact.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(contact.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
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
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Rendimiento por Canal */}
        <Card className="shadow-md">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-800 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Rendimiento por Canal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {performanceChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de rendimiento por canal</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* NEW CHARTS ROW 1 - Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tendencia de Contactos */}
        <Card className="shadow-md">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-800 flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Tendencia de Contactos (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={contactsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="contactos" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Propiedades */}
        <Card className="shadow-md">
          <CardHeader className="bg-emerald-50">
            <CardTitle className="text-emerald-800 flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Estado de Propiedades
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {propertyStatusChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de estado de propiedades</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyStatusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {propertyStatusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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

      {/* NEW CHARTS ROW 2 - Status & Districts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estado de Recordatorios - Radial */}
        <Card className="shadow-md">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-800 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Estado Recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {reminderRadialData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay recordatorios</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="80%" data={reminderRadialData}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Propiedades por Distrito */}
        <Card className="shadow-md">
          <CardHeader className="bg-cyan-50">
            <CardTitle className="text-cyan-800 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Por Distrito
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {districtChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos por distrito</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={districtChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {districtChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Propiedades por Tipo */}
        <Card className="shadow-md">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-800 flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Tipos de Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {propertyTypeChartData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de tipos</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypeChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {propertyTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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

      {/* NEW CHARTS ROW 3 - Activity Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Actividad General por Mes */}
        <Card className="shadow-md">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-slate-800 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Actividad General - Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="contactos" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="propiedades" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboardSimulator;
