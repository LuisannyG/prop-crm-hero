
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Calendar, User, Home, AlertCircle, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import EditNoPurchaseReasonModal from "./EditNoPurchaseReasonModal";
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

interface NoPurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  properties: Property[];
}

const NoPurchaseHistoryModal = ({ isOpen, onClose, contacts, properties }: NoPurchaseHistoryModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reasons, setReasons] = useState<NoPurchaseReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReason, setEditingReason] = useState<NoPurchaseReason | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    mainReasons: {} as { [key: string]: number },
    avgPriceFeedback: 0,
    reconsiderationRate: 0
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchReasons();
    }
  }, [isOpen, user]);

  const fetchReasons = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: reasonsData, error } = await supabase
        .from('no_purchase_reasons')
        .select(`
          *,
          contacts(full_name),
          properties(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process the reasons data to handle potential errors in relationships
      const processedReasons: NoPurchaseReason[] = (reasonsData || []).map((reason: any) => ({
        ...reason,
        contacts: reason.contacts && typeof reason.contacts === 'object' && !reason.contacts.error 
          ? reason.contacts 
          : null,
        properties: reason.properties && typeof reason.properties === 'object' && !reason.properties.error 
          ? reason.properties 
          : null,
      }));

      setReasons(processedReasons);
      calculateStats(processedReasons);
    } catch (error) {
      console.error('Error fetching reasons:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los motivos de no compra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reasonsData: NoPurchaseReason[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = reasonsData.filter(r => {
      const date = new Date(r.created_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const mainReasons = reasonsData.reduce((acc, reason) => {
      acc[reason.reason_category] = (acc[reason.reason_category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const pricesWithFeedback = reasonsData.filter(r => r.price_feedback).map(r => r.price_feedback!);
    const avgPrice = pricesWithFeedback.length > 0 
      ? pricesWithFeedback.reduce((a, b) => a + b, 0) / pricesWithFeedback.length 
      : 0;

    const reconsiderationRate = reasonsData.length > 0 
      ? (reasonsData.filter(r => r.will_reconsider).length / reasonsData.length) * 100 
      : 0;

    setStats({
      total: reasonsData.length,
      thisMonth,
      mainReasons,
      avgPriceFeedback: avgPrice,
      reconsiderationRate
    });
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

      fetchReasons();
    } catch (error) {
      console.error('Error deleting reason:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el motivo.",
        variant: "destructive",
      });
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Historial Completo de Motivos de No Compra
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8">Cargando historial...</div>
          ) : (
            <div className="space-y-6">
              {/* Estadísticas generales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Registros</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Este Mes</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.thisMonth}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Precio Promedio Sugerido</p>
                        <p className="text-2xl font-bold text-green-600">
                          S/{stats.avgPriceFeedback.toLocaleString()}
                        </p>
                      </div>
                      <Home className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tasa Reconsideración</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {stats.reconsiderationRate.toFixed(1)}%
                        </p>
                      </div>
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Motivos principales */}
              <Card>
                <CardHeader>
                  <CardTitle>Motivos Principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.mainReasons)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([reason, count]) => (
                        <Badge key={reason} variant="secondary" className="text-sm">
                          {getCategoryLabel(reason)}: {count}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de registros */}
              <Card>
                <CardHeader>
                  <CardTitle>Registros Detallados</CardTitle>
                </CardHeader>
                <CardContent>
                  {reasons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No hay motivos de no compra registrados
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Propiedad</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Precio Sugerido</TableHead>
                          <TableHead>Reconsideraría</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reasons.map((reason) => (
                          <TableRow key={reason.id}>
                            <TableCell>{formatDate(reason.created_at)}</TableCell>
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
          )}
        </DialogContent>
      </Dialog>

      {editingReason && (
        <EditNoPurchaseReasonModal
          reason={editingReason}
          contacts={contacts}
          properties={properties}
          onReasonUpdated={() => {
            fetchReasons();
            setEditingReason(null);
          }}
          onClose={() => setEditingReason(null)}
        />
      )}
    </>
  );
};

export default NoPurchaseHistoryModal;
