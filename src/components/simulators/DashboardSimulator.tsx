
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Users, Home, Building, User, AlertCircle, Calendar, Phone, Mail } from "lucide-react";
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

const DashboardSimulator = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch contacts
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch reminders
        const { data: remindersData } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .order('reminder_date', { ascending: true });

        setContacts(contactsData || []);
        setProperties(propertiesData || []);
        setReminders(remindersData || []);
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
  const highPriorityReminders = reminders.filter(r => r.priority === 'alta').length;

  // Property types data for chart
  const propertyTypesData = properties.reduce((acc, property) => {
    const type = property.property_type || 'Sin especificar';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyChartData = Object.entries(propertyTypesData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Reminder priorities data
  const reminderPriorityData = reminders.reduce((acc, reminder) => {
    const priority = reminder.priority || 'media';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(reminderPriorityData).map(([priority, count]) => ({
    name: priority,
    value: count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{highPriorityReminders}</div>
            <div className="text-sm text-gray-600">Prioridad Alta</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Resumen General</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {totalContacts > 0 || totalProperties > 0 || totalReminders > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Actividad Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {totalContacts + totalProperties + totalReminders}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Contactos</span>
                    <span>{totalContacts}</span>
                  </div>
                  <Progress value={(totalContacts / Math.max(totalContacts + totalProperties + totalReminders, 1)) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Propiedades</span>
                    <span>{totalProperties}</span>
                  </div>
                  <Progress value={(totalProperties / Math.max(totalContacts + totalProperties + totalReminders, 1)) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Recordatorios</span>
                    <span>{totalReminders}</span>
                  </div>
                  <Progress value={(totalReminders / Math.max(totalContacts + totalProperties + totalReminders, 1)) * 100} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">¡Comienza tu CRM!</p>
                <p className="text-sm mt-1">Agrega tus primeros contactos y propiedades para ver estadísticas aquí</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Tipos de Propiedades</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {propertyChartData.length > 0 ? (
              <ChartContainer config={{}} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {propertyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay propiedades registradas</p>
                <p className="text-sm mt-1">Comienza agregando tu primera propiedad</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Prioridad de Recordatorios</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {priorityChartData.length > 0 ? (
              <ChartContainer config={{}} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay recordatorios pendientes</p>
                <p className="text-sm mt-1">Programa tu primer recordatorio</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Datos Recientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="contactos">
            <TabsList className="mb-4">
              <TabsTrigger value="contactos">
                <Users className="h-4 w-4 mr-1" />
                Contactos ({totalContacts})
              </TabsTrigger>
              <TabsTrigger value="propiedades">
                <Building className="h-4 w-4 mr-1" />
                Propiedades ({totalProperties})
              </TabsTrigger>
              <TabsTrigger value="recordatorios">
                <Calendar className="h-4 w-4 mr-1" />
                Recordatorios ({totalReminders})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contactos">
              {contacts.length > 0 ? (
                <div className="space-y-3">
                  {contacts.slice(0, 5).map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.full_name}</p>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                      </div>
                      <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                        {contact.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay contactos registrados</p>
                  <p className="text-sm">Comienza agregando tu primer contacto</p>
                  <Button variant="outline" className="mt-4">
                    Agregar Contacto
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="propiedades">
              {properties.length > 0 ? (
                <div className="space-y-3">
                  {properties.slice(0, 5).map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.property_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${property.price?.toLocaleString()}</p>
                        <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay propiedades registradas</p>
                  <p className="text-sm">Comienza agregando tu primera propiedad</p>
                  <Button variant="outline" className="mt-4">
                    Agregar Propiedad
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recordatorios">
              {reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.slice(0, 5).map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(reminder.reminder_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge 
                          variant={
                            reminder.priority === 'alta' ? 'destructive' :
                            reminder.priority === 'media' ? 'default' : 'secondary'
                          }
                        >
                          {reminder.priority}
                        </Badge>
                        <Badge variant={reminder.status === 'completado' ? 'default' : 'outline'}>
                          {reminder.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay recordatorios pendientes</p>
                  <p className="text-sm">Programa tu primer recordatorio</p>
                  <Button variant="outline" className="mt-4">
                    Crear Recordatorio
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSimulator;
