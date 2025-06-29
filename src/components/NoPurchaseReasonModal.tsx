
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
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

interface NoPurchaseReasonModalProps {
  contacts: Contact[];
  properties: Property[];
  onReasonAdded: () => void;
}

const NoPurchaseReasonModal = ({ contacts, properties, onReasonAdded }: NoPurchaseReasonModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
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

  const reasonCategories = [
    { value: "precio", label: "Precio muy alto" },
    { value: "ubicacion", label: "Ubicación no deseada" },
    { value: "tamano", label: "Tamaño inadecuado" },
    { value: "financiacion", label: "Problemas de financiación" },
    { value: "otra_propiedad", label: "Encontró otra propiedad" },
    { value: "timing", label: "No es el momento adecuado" },
    { value: "competencia", label: "Eligió la competencia" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !contactId || !reasonCategory) return;

    setLoading(true);
    try {
      // 1. Registrar el motivo de no compra
      const { error: reasonError } = await supabase
        .from('no_purchase_reasons')
        .insert({
          user_id: user.id,
          contact_id: contactId,
          property_id: propertyId || null,
          reason_category: reasonCategory,
          reason_details: reasonDetails,
          price_feedback: priceFeedback ? parseFloat(priceFeedback) : null,
          will_reconsider: willReconsider,
          follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : null,
          notes: notes
        });

      if (reasonError) throw reasonError;

      // 2. Actualizar el estado del contacto a "lost" (perdido)
      const newStatus = willReconsider ? 'inactive' : 'lost';
      const newSalesStage = willReconsider ? 'seguimiento_futuro' : 'no_compra_registrada';
      
      const { error: contactError } = await supabase
        .from('contacts')
        .update({ 
          status: newStatus,
          sales_stage: newSalesStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (contactError) throw contactError;

      // 3. Resolver alertas de riesgo activas para este contacto
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

      // 4. Cancelar recordatorios pendientes para este contacto (excepto si va a reconsiderar)
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

      // 5. Si va a reconsiderar, crear un recordatorio de seguimiento
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

      // 6. Registrar la interacción
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
          interaction_date: new Date().toISOString()
        });

      if (interactionError) console.warn('Error registrando interacción:', interactionError);

      toast({
        title: "Motivo registrado exitosamente",
        description: `El contacto ha sido marcado como ${willReconsider ? 'inactivo con seguimiento futuro' : 'perdido'}. ${willReconsider && followUpDate ? 'Se creó un recordatorio de seguimiento.' : ''}`,
      });

      // Reset form
      setContactId("");
      setPropertyId("");
      setReasonCategory("");
      setReasonDetails("");
      setPriceFeedback("");
      setAnotherProperty(false);
      setWillReconsider(false);
      setFollowUpDate(undefined);
      setNotes("");
      setOpen(false);
      onReasonAdded();
    } catch (error) {
      console.error('Error registrando motivo de no compra:', error);
      toast({
        title: "Error",
        description: "Error al registrar el motivo de no compra.",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Motivo de No Compra</DialogTitle>
        </DialogHeader>
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
              <strong>Nota:</strong> Al registrar este motivo, el contacto será marcado como 
              {willReconsider ? ' "inactivo" y se programará seguimiento' : ' "perdido"'}.
              Las alertas activas serán resueltas automáticamente.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Registrar y Actualizar Estado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoPurchaseReasonModal;
