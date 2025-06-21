
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

  // Calcular estadísticas del embudo de ventas basado en datos reales
  const funnelData = [
    { name: "Total Contactos", value: contacts.length, fill: "#818CF8" },
    { name: "Activos", value: contacts.filter(c => c.status === 'active').length, fill: "#60A5FA" },
    { name: "Propiedades", value: properties.length, fill: "#34D399" },
    { name: "Disponibles", value: properties.filter(p => p.status === 'available').length, fill: "#FBBF24" },
    { name: "Recordatorios", value: reminders.length, fill: "#F87171" }
  ];

  // Tipos de propiedades
  const propertyTypes = properties.reduce((acc, prop) => {
    const type = prop.property_type || 'Sin especificar';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyTypeData = Object.entries(propertyTypes).map(([name, value]) => ({
    name,
    value
  }));

  // Estados de recordatorios
  const remindersByPriority = reminders.reduce((acc, reminder) => {
    const priority = reminder.priority || 'media';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = [
    { name: "Alta", value: remindersByPriority.alta || 0, color: "#EF4444" },
    { name: "Media", value: remindersByPriority.media || 0, color: "#F59E0B" },
    { name: "Baja", value: remindersByPriority.baja || 0, color: "#22C55E" }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Contactos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{properties.length}</div>
            <div className="text-sm text-gray-600">Propiedades</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{reminders.length}</div>
            <div className="text-sm text-gray-600">Recordatorios</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">
              {reminders.filter(r => r.priority === 'alta').length}
            </div>
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
            <div className="space-y-4">
              {funnelData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <Progress 
                    value={item.value > 0 ? Math.min((item.value / Math.max(...funnelData.map(d => d.value))) * 100, 100) : 0} 
                    className="h-3" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Tipos de Propiedades</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {propertyTypeData.length > 0 ? (
              <>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {propertyTypeData.map((type, index) => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{type.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay propiedades registradas</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Prioridad de Recordatorios</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {priorityData.some(p => p.value > 0) ? (
              <ChartContainer
                config={{
                  alta: { label: "Alta" },
                  media: { label: "Media" },
                  baja: { label: "Baja" }
                }}
                className="h-60"
              >
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay recordatorios pendientes</p>
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
                Contactos ({contacts.length})
              </TabsTrigger>
              <TabsTrigger value="propiedades">
                <Building className="h-4 w-4 mr-1" />
                Propiedades ({properties.length})
              </TabsTrigger>
              <TabsTrigger value="recordatorios">
                <Calendar className="h-4 w-4 mr-1" />
                Recordatorios ({reminders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contactos">
              {contacts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Teléfono</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                        <th className="px-4 py-2 text-left">Creado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.slice(0, 5).map((contact) => (
                        <tr key={contact.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{contact.full_name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {contact.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {contact.phone || 'No registrado'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                              {contact.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contacts.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">Ver todos los contactos</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay contactos registrados</p>
                  <p className="text-sm">Comienza agregando tu primer contacto</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="propiedades">
              {properties.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Título</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Precio</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                        <th className="px-4 py-2 text-left">Creado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.slice(0, 5).map((property) => (
                        <tr key={property.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{property.title}</td>
                          <td className="px-4 py-3">{property.property_type || 'No especificado'}</td>
                          <td className="px-4 py-3">
                            {property.price ? `S/ ${property.price.toLocaleString()}` : 'Sin precio'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                              {property.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(property.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {properties.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">Ver todas las propiedades</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay propiedades registradas</p>
                  <p className="text-sm">Comienza agregando tu primera propiedad</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recordatorios">
              {reminders.length > 0 ? (
                <div className="space-y-3">
                  {reminders.slice(0, 5).map((reminder) => (
                    <div key={reminder.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{reminder.title}</h4>
                          {reminder.description && (
                            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {new Date(reminder.reminder_date).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge 
                            variant={reminder.priority === 'alta' ? 'destructive' : 
                                   reminder.priority === 'media' ? 'default' : 'secondary'}
                          >
                            {reminder.priority}
                          </Badge>
                          <Badge variant="outline">
                            {reminder.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reminders.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">Ver todos los recordatorios</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay recordatorios pendientes</p>
                  <p className="text-sm">Programa tu primer recordatorio</p>
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
