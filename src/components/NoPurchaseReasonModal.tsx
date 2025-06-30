
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
import { CalendarIcon, Plus } from "lucide-react";
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
  price?: number;
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
  const [willReconsider, setWillReconsider] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>();
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

  // Auto-fill price when property is selected
  useEffect(() => {
    if (propertyId && propertyId !== "none") {
      const selectedProperty = properties.find(p => p.id === propertyId);
      if (selectedProperty && selectedProperty.price) {
        setPriceFeedback(selectedProperty.price.toString());
      }
    }
  }, [propertyId, properties]);

  const resetForm = () => {
    setContactId("");
    setPropertyId("");
    setReasonCategory("");
    setReasonDetails("");
    setPriceFeedback("");
    setWillReconsider(false);
    setFollowUpDate(undefined);
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !contactId || !reasonCategory) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('no_purchase_reasons')
        .insert({
          user_id: user.id,
          contact_id: contactId,
          property_id: propertyId === "none" ? null : propertyId || null,
          reason_category: reasonCategory,
          reason_details: reasonDetails,
          price_feedback: priceFeedback ? parseFloat(priceFeedback) : null,
          will_reconsider: willReconsider,
          follow_up_date: followUpDate ? format(followUpDate, 'yyyy-MM-dd') : null,
          notes: notes
        });

      if (error) {
        console.error('Error creating no purchase reason:', error);
        toast({
          title: "Error",
          description: "No se pudo crear el motivo de no compra.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Motivo de no compra registrado exitosamente.",
      });

      resetForm();
      setOpen(false);
      onReasonAdded();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al crear el motivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Motivo
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
                  <SelectItem value="none">Ninguna</SelectItem>
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

          <div>
            <Label htmlFor="price">Precio Sugerido (S/)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Se llenará automáticamente al seleccionar propiedad"
              value={priceFeedback}
              onChange={(e) => setPriceFeedback(e.target.value)}
            />
            {propertyId && propertyId !== "none" && (
              <p className="text-sm text-gray-500 mt-1">
                Precio de la propiedad seleccionada llenado automáticamente
              </p>
            )}
          </div>

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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Motivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoPurchaseReasonModal;
