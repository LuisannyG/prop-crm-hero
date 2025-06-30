
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingDown, AlertTriangle } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import NoPurchaseReasonModal from "@/components/NoPurchaseReasonModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Contact {
  id: string;
  full_name: string;
}

interface Property {
  id: string;
  title: string;
}

interface NoPurchaseReason {
  id: string;
  contact_id: string;
  property_id?: string;
  reason_category: string;
  reason_details?: string;
  created_at: string;
  contacts?: Contact;
  properties?: Property;
}

const PurchaseReasons = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [noPurchaseReasons, setNoPurchaseReasons] = useState<NoPurchaseReason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      console.log("Fetching data for user:", user.id);
      
      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('id, full_name')
        .eq('user_id', user.id)
        .order('full_name');

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
        throw contactsError;
      }

      console.log("Contacts fetched:", contactsData?.length);

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title')  
        .eq('user_id', user.id)
        .order('title');

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        throw propertiesError;
      }

      console.log("Properties fetched:", propertiesData?.length);

      // Fetch no purchase reasons with contact and property info
      const { data: reasonsData, error: reasonsError } = await supabase
        .from('no_purchase_reasons')
        .select(`
          id,
          contact_id,
          property_id,
          reason_category,
          reason_details,
          created_at,
          contacts!no_purchase_reasons_contact_id_fkey(id, full_name),
          properties!no_purchase_reasons_property_id_fkey(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reasonsError) {
        console.error('Error fetching no purchase reasons:', reasonsError);
        throw reasonsError;
      }

      console.log("No purchase reasons fetched:", reasonsData?.length);
      console.log("Raw reasons data:", reasonsData);

      setContacts(contactsData || []);
      setProperties(propertiesData || []);
      setNoPurchaseReasons(reasonsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalReasons = noPurchaseReasons.length;
  const uniqueClients = new Set(noPurchaseReasons.map(reason => reason.contact_id)).size;
  const reasonStats = noPurchaseReasons.reduce((acc, reason) => {
    acc[reason.reason_category] = (acc[reason.reason_category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReason = Object.entries(reasonStats).sort(([,a], [,b]) => b - a)[0];

  const reasonLabels: Record<string, string> = {
    precio: "Precio muy alto",
    ubicacion: "Ubicación no deseada", 
    tamano: "Tamaño inadecuado",
    financiacion: "Problemas de financiación",
    otra_propiedad: "Encontró otra propiedad",
    timing: "No es el momento adecuado",
    competencia: "Eligió la competencia"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Motivos de No Compra</h1>
              <p className="text-gray-600">Registra y analiza las razones por las que los clientes no compran</p>
            </div>
            <NoPurchaseReasonModal 
              contacts={contacts}
              properties={properties}
              onReasonAdded={fetchData}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Motivos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReasons}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueClients}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Principal Motivo</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {topReason ? reasonLabels[topReason[0]] || topReason[0] : 'N/A'}
                  </p>
                  {topReason && (
                    <p className="text-sm text-gray-500">{topReason[1]} casos</p>
                  )}
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa de Rechazo</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contacts.length > 0 ? Math.round((uniqueClients / contacts.length) * 100) : 0}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent No Purchase Reasons */}
          <Card className="shadow-md">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-red-800">
                <TrendingDown className="mr-2 h-5 w-5" />
                Motivos Recientes de No Compra ({totalReasons})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Cargando motivos...</p>
                </div>
              ) : noPurchaseReasons.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingDown className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin motivos registrados</h3>
                  <p className="text-gray-500 mb-4">
                    No hay motivos de no compra registrados aún
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {noPurchaseReasons.map((reason) => {
                    console.log("Rendering reason:", reason);
                    const contactName = reason.contacts?.full_name || 'Cliente no encontrado';
                    const propertyTitle = reason.properties?.title;
                    
                    return (
                      <div key={reason.id} className="border-l-4 border-red-300 pl-4 py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {contactName}
                            </h4>
                            <Badge variant="outline" className="mt-1">
                              {reasonLabels[reason.reason_category] || reason.reason_category}
                            </Badge>
                            {propertyTitle && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Propiedad:</strong> {propertyTitle}
                              </p>
                            )}
                            {reason.reason_details && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Detalles:</strong> {reason.reason_details}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {format(new Date(reason.created_at), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics by Reason */}
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <BarChart3 className="mr-2 h-5 w-5" />
                Estadísticas por Motivo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {totalReasons === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos suficientes</h3>
                  <p className="text-gray-500 mb-4">
                    Registra algunos motivos de no compra para ver estadísticas detalladas
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-blue-800 mb-2">Tip de Proptor:</h4>
                    <p className="text-sm text-blue-700">
                      Los clientes que rechazan por precio suelen reconsiderar su decisión después de 3-4 meses. 
                      Programa un recordatorio de seguimiento automático para estos casos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(reasonStats)
                    .sort(([,a], [,b]) => b - a)
                    .map(([reason, count]) => {
                      const percentage = Math.round((count / totalReasons) * 100);
                      return (
                        <div key={reason} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {reasonLabels[reason] || reason}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{count} casos</span>
                              <Badge variant="secondary">{percentage}%</Badge>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PurchaseReasons;
