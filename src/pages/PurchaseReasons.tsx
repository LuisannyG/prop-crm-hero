
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, BarChart3, Edit, Trash2, Plus } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import NoPurchaseReasonModal from "@/components/NoPurchaseReasonModal";
import EditNoPurchaseReasonModal from "@/components/EditNoPurchaseReasonModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  property_id: string | null;
  reason_category: string;
  reason_details: string | null;
  price_feedback: number | null;
  will_reconsider: boolean;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  contacts: { full_name: string } | null;
  properties: { title: string } | null;
}

const PurchaseReasons = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reasons, setReasons] = useState<NoPurchaseReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReason, setEditingReason] = useState<NoPurchaseReason | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching data for user:', user.id);

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('id, full_name')
        .eq('user_id', user.id);

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      }

      // Fetch properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('user_id', user.id);

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
      }

      // Fetch no purchase reasons with related data using explicit foreign key names
      const { data: reasonsData, error: reasonsError } = await supabase
        .from('no_purchase_reasons')
        .select(`
          *,
          contacts!fk_no_purchase_reasons_contact(full_name),
          properties!fk_no_purchase_reasons_property(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reasonsError) {
        console.error('Error fetching reasons:', reasonsError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los motivos de no compra: " + reasonsError.message,
          variant: "destructive",
        });
      } else {
        console.log('Raw reasons data:', reasonsData);

        // Process the reasons data to handle potential errors in relationships
        const processedReasons: NoPurchaseReason[] = (reasonsData || []).map((reason: any) => {
          console.log('Processing reason:', reason);
          return {
            ...reason,
            contacts: reason.contacts && typeof reason.contacts === 'object' && !Array.isArray(reason.contacts)
              ? reason.contacts 
              : null,
            properties: reason.properties && typeof reason.properties === 'object' && !Array.isArray(reason.properties)
              ? reason.properties 
              : null,
          };
        });

        console.log('Processed reasons:', processedReasons);
        setReasons(processedReasons);
      }

      setContacts(contactsData || []);
      setProperties(propertiesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('no_purchase_reasons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Motivo de no compra eliminado.",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting reason:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el motivo.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'precio': 'Precio',
      'ubicacion': 'Ubicación',
      'tamano': 'Tamaño',
      'financiacion': 'Financiación',
      'otra_propiedad': 'Otra propiedad',
      'timing': 'Timing',
      'competencia': 'Competencia'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Motivos de No Compra</h1>
            <p className="text-gray-600">Gestiona y analiza las razones por las que los clientes no compran</p>
          </div>
          <NoPurchaseReasonModal 
            contacts={contacts}
            properties={properties}
            onReasonAdded={fetchData}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <FileText className="mr-2 h-5 w-5" />
                Motivos Registrados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8">Cargando...</div>
              ) : reasons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hay motivos de no compra registrados
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Propiedad</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Precio Sugerido</TableHead>
                      <TableHead>Reconsideraría</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reasons.map((reason) => (
                      <TableRow key={reason.id}>
                        <TableCell className="font-medium">
                          {reason.contacts?.full_name || 'Cliente eliminado'}
                        </TableCell>
                        <TableCell>
                          {reason.properties?.title || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getCategoryLabel(reason.reason_category)}</div>
                            {reason.reason_details && (
                              <div className="text-sm text-gray-500">{reason.reason_details}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {reason.price_feedback ? `S/ ${reason.price_feedback.toLocaleString()}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            reason.will_reconsider 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reason.will_reconsider ? 'Sí' : 'No'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(reason.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingReason(reason)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar motivo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El motivo de no compra será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(reason.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {editingReason && (
          <EditNoPurchaseReasonModal
            reason={editingReason}
            contacts={contacts}
            properties={properties}
            onReasonUpdated={() => {
              fetchData();
              setEditingReason(null);
            }}
            onClose={() => setEditingReason(null)}
          />
        )}
      </main>
    </div>
  );
};

export default PurchaseReasons;
