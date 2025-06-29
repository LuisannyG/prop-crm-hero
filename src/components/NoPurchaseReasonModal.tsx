import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, AlertCircle, Edit, Trash2, History } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  price_feedback?: number;
  will_reconsider: boolean;
  follow_up_date?: string;
  notes?: string;
  created_at: string;
  contact?: Contact;
  property?: Property;
}

interface NoPurchaseReasonModalProps {
  contacts: Contact[];
  properties: Property[];
  onReasonAdded: () => void;
}

const NoPurchaseReasonModal = ({ contacts, properties, onReasonAdded }: NoPurchaseReasonModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [editingReason, setEditingReason] = useState<NoPurchaseReason | null>(null);
  
  // Form state
  const [contactId, setContactId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [reasonCategory, setReasonCategory] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");
  const [priceFeedback, setPriceFeedback] = useState("");
  const [anotherProperty, setAnotherProperty] = useState(false);
  const [willReconsider, setWillReconsider] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Existing reasons
  const [existingReasons, setExistingReasons] = useState<NoPurchaseReason[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(false);

  const reasonCategories = [
    { value: "precio", label: "Precio muy alto" },
    { value: "ubicacion", label: "Ubicación no deseada" },
    { value: "tamano", label: "Tamaño inadecuado" },
    { value: "financiacion", label: "Problemas de financiación" },
    { value: "otra_propiedad", label: "Encontró otra propiedad" },
    { value: "timing", label: "No es el momento adecuado" },
    { value: "competencia", label: "Eligió la competencia" }
  ];

  useEffect(() => {
    if (open) {
      fetchExistingReasons();
    }
  }, [open]);

  const fetchExistingReasons = async () => {
    if (!user) return;
    
    setLoadingReasons(true);
    try {
      const { data, error } = await supabase
        .from('no_purchase_reasons')
        .select(`
          *,
          contacts!no_purchase_reasons_contact_id_fkey(id, full_name),
          properties!no_purchase_reasons_property_id_fkey(id, title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingReasons(data || []);
    } catch (error) {
      console.error('Error fetching existing reasons:', error);
    } finally {
      setLoadingReasons(false);
    }
  };

  const resetForm = () => {
    setContactId("");
    setPropertyId("");
    setReasonCategory("");
    setReasonDetails("");
    setPriceFeedback("");
    setAnotherProperty(false);
    setWillReconsider(false);
    setFollowUpDate(undefined);
    setNotes("");
    setEditingReason(null);
  };

  const loadReasonForEdit = (reason: NoPurchaseReason) => {
    setEditingReason(reason);
    setContactId(reason.contact_id);
    setPropertyId(reason.property_id || "");
    setReasonCategory(reason.reason_category);
    setReasonDetails(reason.reason_details || "");
    setPriceFeedback(reason.price_feedback?.toString() || "");
    setWillReconsider(reason.will_reconsider);
    setFollowUpDate(reason.follow_up_date ? new Date(reason.follow_up_date) : undefined);
    setNotes(reason.notes || "");
    setActiveTab("new");
  };

  const deleteReason = async (reasonId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('no_purchase_reasons')
        .delete()
        .eq('id', reasonId);

      if (error) throw error;

      toast({
        title: "Motivo eliminado",
        description: "El motivo de no compra ha sido eliminado exitosamente",
      });

      fetchExistingReasons();
    } catch (error) {
      console.error('Error deleting reason:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el motivo de no compra",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !contactId || !reasonCategory) return;

    setLoading(true);
    try {
      const reasonData = {
        user_id: user.id,
        contact_id: contactId,
        property_id: propertyId || null,
        reason_category: reasonCategory,
        reason_details: reasonDetails,
        price_feedback: priceFeedback ? parseFloat(priceFeedback) : null,
        will_reconsider: willReconsider,
        follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : null,
        notes: notes
      };

      if (editingReason) {
        // Update existing reason
        const { error: reasonError } = await supabase
          .from('no_purchase_reasons')
          .update(reasonData)
          .eq('id', editingReason.id);

        if (reasonError) throw reasonError;

        toast({
          title: "Motivo actualizado",
          description: "El motivo de no compra ha sido actualizado exitosamente",
        });
      } else {
        // Create new reason
        const { error: reasonError } = await supabase
          .from('no_purchase_reasons')
          .insert(reasonData);

        if (reasonError) throw reasonError;

        // Update contact status and stage to "No Compra"
        const newStatus = willReconsider ? 'inactive' : 'lost';
        const newSalesStage = 'no_compra';
        
        const { error: contactError } = await supabase
          .from('contacts')
          .update({ 
            status: newStatus,
            sales_stage: newSalesStage,
            updated_at: new Date().toISOString()
          })
          .eq('id', contactId);

        if (contactError) throw contactError;

        // Resolve risk alerts
        const { error: alertError } = await supabase
          .from('risk_alerts')
          .update({ 
            is_resolved: true,
            resolved_at: new Date().toISOString(),
            notes: `Motivo de no compra registrado: ${reasonCategory}`
          })
          .eq('contact_id', contactId)
          .eq('is_resolved', false);

        if (alertError) console.warn('Error resolviendo alertas:', alertError);

        // Cancel pending reminders if not reconsidering
        if (!willReconsider) {
          const { error: reminderError } = await supabase
            .from('reminders')
            .update({ 
              status: 'cancelado',
              updated_at: new Date().toISOString()
            })
            .eq('contact_id', contactId)
            .eq('status', 'pendiente');

          if (reminderError) console.warn('Error cancelando recordatorios:', reminderError);
        }

        // Create follow-up reminder if reconsidering
        if (willReconsider && followUpDate) {
          const { error: newReminderError } = await supabase
            .from('reminders')
            .insert({
              user_id: user.id,
              contact_id: contactId,
              title: `Seguimiento por reconsideración - ${reasonCategory}`,
              description: `Cliente mostró interés en reconsiderar. Motivo inicial: ${reasonCategory}. ${notes ? `Notas: ${notes}` : ''}`,
              reminder_date: followUpDate.toISOString(),
              priority: 'media',
              status: 'pendiente'
            });

          if (newReminderError) console.warn('Error creando recordatorio:', newReminderError);
        }

        // Register interaction
        const { error: interactionError } = await supabase
          .from('interactions')
          .insert({
            user_id: user.id,
            contact_id: contactId,
            property_id: propertyId || null,
            interaction_type: 'no_compra',
            subject: `Motivo de no compra: ${reasonCategory}`,
            notes: `${reasonDetails} ${notes ? `\nNotas adicionales: ${notes}` : ''}`,
            outcome: willReconsider ? 'reconsiderara' : 'perdido',
            interaction_date: new Date().toISOString(),
            new_stage: 'no_compra'
          });

        if (interactionError) console.warn('Error registrando interacción:', interactionError);

        toast({
          title: "Motivo registrado exitosamente",
          description: `El contacto ha sido movido a la etapa "No Compra". ${willReconsider && followUpDate ? 'Se creó un recordatorio de seguimiento.' : ''}`,
        });
      }

      resetForm();
      fetchExistingReasons();
      onReasonAdded();
      
      if (!editingReason) {
        setActiveTab("history");
      }
    } catch (error) {
      console.error('Error registrando/actualizando motivo de no compra:', error);
      toast({
        title: "Error",
        description: "Error al procesar el motivo de no compra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <AlertCircle className="w-4 h-4 mr-2" />
          Registrar Motivo de No Compra
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestión de Motivos de No Compra</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">
              {editingReason ? "Editar Motivo" : "Nuevo Motivo"}
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-2" />
              Historial ({existingReasons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Cliente *</Label>
                  <Select value={contactId} onValueChange={setContactId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="property">Propiedad (Opcional)</Label>
                  <Select value={propertyId} onValueChange={setPropertyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Motivo Principal *</Label>
                <Select value={reasonCategory} onValueChange={setReasonCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="details">Detalles del Motivo</Label>
                <Textarea
                  id="details"
                  placeholder="Describe más detalles sobre el motivo..."
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                />
              </div>

              {reasonCategory === "precio" && (
                <div>
                  <Label htmlFor="price">Precio que consideraría (S/)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Ej: 250000"
                    value={priceFeedback}
                    onChange={(e) => setPriceFeedback(e.target.value)}
                  />
                </div>
              )}

              {reasonCategory === "otra_propiedad" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anotherProperty"
                    checked={anotherProperty}
                    onCheckedChange={(checked) => setAnotherProperty(!!checked)}
                  />
                  <Label htmlFor="anotherProperty">¿Compró otra propiedad con nosotros?</Label>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reconsider"
                  checked={willReconsider}
                  onCheckedChange={(checked) => setWillReconsider(!!checked)}
                />
                <Label htmlFor="reconsider">¿Reconsideraría en el futuro?</Label>
              </div>

              {willReconsider && (
                <div>
                  <Label>Fecha de seguimiento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {followUpDate ? format(followUpDate, "PPP") : <span>Seleccionar fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={followUpDate}
                        onSelect={setFollowUpDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Cualquier información adicional relevante..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> {editingReason ? 
                    'Al actualizar este motivo, se mantendrá el estado actual del contacto.' :
                    `Al registrar este motivo, el contacto será movido a la etapa "No Compra" y marcado como ${willReconsider ? '"inactivo" con seguimiento futuro' : '"perdido"'}.`
                  }
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setActiveTab("history");
                }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : (editingReason ? "Actualizar Motivo" : "Registrar y Actualizar Estado")}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {loadingReasons ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Cargando historial...</p>
                </div>
              ) : existingReasons.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin motivos registrados</h3>
                  <p className="text-gray-500 mb-4">
                    No hay motivos de no compra registrados aún.
                  </p>
                  <Button onClick={() => setActiveTab("new")}>
                    Registrar primer motivo
                  </Button>
                </div>
              ) : (
                existingReasons.map((reason) => (
                  <Card key={reason.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {reason.contact?.full_name || 'Cliente no encontrado'}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {reasonCategories.find(cat => cat.value === reason.reason_category)?.label || reason.reason_category}
                            </Badge>
                            {reason.will_reconsider && (
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                Reconsiderará
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadReasonForEdit(reason)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteReason(reason.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {reason.property?.title && (
                          <p className="text-sm text-gray-600">
                            <strong>Propiedad:</strong> {reason.property.title}
                          </p>
                        )}
                        {reason.reason_details && (
                          <p className="text-sm text-gray-600">
                            <strong>Detalles:</strong> {reason.reason_details}
                          </p>
                        )}
                        {reason.price_feedback && (
                          <p className="text-sm text-gray-600">
                            <strong>Precio que consideraría:</strong> S/ {reason.price_feedback.toLocaleString()}
                          </p>
                        )}
                        {reason.follow_up_date && (
                          <p className="text-sm text-gray-600">
                            <strong>Fecha de seguimiento:</strong> {format(new Date(reason.follow_up_date), "dd/MM/yyyy")}
                          </p>
                        )}
                        {reason.notes && (
                          <p className="text-sm text-gray-600">
                            <strong>Notas:</strong> {reason.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Registrado: {format(new Date(reason.created_at), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NoPurchaseReasonModal;
