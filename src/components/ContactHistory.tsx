
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { History, Plus, Calendar, MapPin, Target, CheckCircle } from 'lucide-react';

interface Contact {
  id: string;
  full_name: string;
  sales_stage?: string;
}

interface Interaction {
  id: string;
  interaction_type: string;
  subject?: string;
  notes?: string;
  interaction_date: string;
  previous_stage?: string;
  new_stage?: string;
  meeting_location?: string;
  outcome?: string;
  next_steps?: string;
  created_at: string;
}

interface ContactHistoryProps {
  contact: Contact;
}

const ContactHistory = ({ contact }: ContactHistoryProps) => {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [formData, setFormData] = useState({
    interaction_type: '',
    subject: '',
    notes: '',
    interaction_date: new Date().toISOString().split('T')[0],
    previous_stage: contact.sales_stage || '',
    new_stage: '',
    meeting_location: '',
    outcome: '',
    next_steps: ''
  });

  const salesStages = [
    { key: 'contacto_inicial_recibido', name: 'Contacto inicial recibido' },
    { key: 'primer_contacto_activo', name: 'Primer contacto activo' },
    { key: 'llenado_ficha', name: 'Llenado de ficha' },
    { key: 'seguimiento_inicial', name: 'Seguimiento inicial' },
    { key: 'agendamiento_visitas', name: 'Agendamiento de visitas o reuniones' },
    { key: 'presentacion_personalizada', name: 'Presentación personalizada' },
    { key: 'negociacion', name: 'Negociación' },
    { key: 'cierre_firma_contrato', name: 'Cierre / Firma de contrato' },
    { key: 'postventa_fidelizacion', name: 'Postventa y fidelización' }
  ];

  const interactionTypes = [
    { key: 'call', name: 'Llamada' },
    { key: 'email', name: 'Email' },
    { key: 'visit', name: 'Visita' },
    { key: 'message', name: 'Mensaje' },
    { key: 'meeting', name: 'Reunión' }
  ];

  const fetchInteractions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('contact_id', contact.id)
        .eq('user_id', user.id)
        .order('interaction_date', { ascending: false });

      if (error) throw error;
      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las interacciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.interaction_type || !formData.subject) {
      toast({
        title: 'Error',
        description: 'Tipo de interacción y asunto son obligatorios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const interactionData = {
        user_id: user.id,
        contact_id: contact.id,
        interaction_type: formData.interaction_type,
        subject: formData.subject,
        notes: formData.notes,
        interaction_date: new Date(formData.interaction_date).toISOString(),
        previous_stage: formData.previous_stage || null,
        new_stage: formData.new_stage || null,
        meeting_location: formData.meeting_location || null,
        outcome: formData.outcome || null,
        next_steps: formData.next_steps || null
      };

      const { error } = await supabase
        .from('interactions')
        .insert([interactionData]);

      if (error) throw error;

      toast({ title: 'Interacción registrada exitosamente' });
      resetForm();
      fetchInteractions();
    } catch (error) {
      console.error('Error saving interaction:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la interacción',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      interaction_type: '',
      subject: '',
      notes: '',
      interaction_date: new Date().toISOString().split('T')[0],
      previous_stage: contact.sales_stage || '',
      new_stage: '',
      meeting_location: '',
      outcome: '',
      next_steps: ''
    });
    setIsAddingInteraction(false);
  };

  const getInteractionTypeLabel = (type: string) => {
    const found = interactionTypes.find(t => t.key === type);
    return found ? found.name : type;
  };

  const getSalesStageLabel = (stage: string) => {
    const found = salesStages.find(s => s.key === stage);
    return found ? found.name : stage;
  };

  useEffect(() => {
    fetchInteractions();
  }, [contact.id, user]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <History className="w-3 h-3 mr-1" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de {contact.full_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Interacciones ({interactions.length})</h3>
            <Button onClick={() => setIsAddingInteraction(!isAddingInteraction)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Interacción
            </Button>
          </div>

          {isAddingInteraction && (
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interaction_type">Tipo de Interacción *</Label>
                      <Select value={formData.interaction_type} onValueChange={(value) => setFormData({...formData, interaction_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {interactionTypes.map((type) => (
                            <SelectItem key={type.key} value={type.key}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="interaction_date">Fecha *</Label>
                      <Input
                        id="interaction_date"
                        type="date"
                        value={formData.interaction_date}
                        onChange={(e) => setFormData({...formData, interaction_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Ej: Reunión para mostrar propiedades"
                      required
                    />
                  </div>

                  {formData.interaction_type === 'meeting' && (
                    <div>
                      <Label htmlFor="meeting_location">Ubicación de la reunión</Label>
                      <Input
                        id="meeting_location"
                        value={formData.meeting_location}
                        onChange={(e) => setFormData({...formData, meeting_location: e.target.value})}
                        placeholder="Ej: Oficina, casa del cliente, propiedad"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="previous_stage">Etapa anterior</Label>
                      <Select value={formData.previous_stage} onValueChange={(value) => setFormData({...formData, previous_stage: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Etapa anterior" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesStages.map((stage) => (
                            <SelectItem key={stage.key} value={stage.key}>
                              {stage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new_stage">Nueva etapa</Label>
                      <Select value={formData.new_stage} onValueChange={(value) => setFormData({...formData, new_stage: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Nueva etapa (si cambió)" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesStages.map((stage) => (
                            <SelectItem key={stage.key} value={stage.key}>
                              {stage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="outcome">Resultado</Label>
                    <Input
                      id="outcome"
                      value={formData.outcome}
                      onChange={(e) => setFormData({...formData, outcome: e.target.value})}
                      placeholder="Ej: Cliente interesado, necesita tiempo para decidir"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas detalladas</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      placeholder="Detalles de la interacción..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="next_steps">Próximos pasos</Label>
                    <Textarea
                      id="next_steps"
                      value={formData.next_steps}
                      onChange={(e) => setFormData({...formData, next_steps: e.target.value})}
                      rows={2}
                      placeholder="Qué acciones seguir..."
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">Guardar Interacción</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {loading ? (
              <p className="text-center py-4">Cargando historial...</p>
            ) : interactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay interacciones registradas para este contacto.
              </p>
            ) : (
              interactions.map((interaction) => (
                <Card key={interaction.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getInteractionTypeLabel(interaction.interaction_type)}
                        </Badge>
                        <span className="font-medium">{interaction.subject}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(interaction.interaction_date).toLocaleDateString()}
                      </div>
                    </div>

                    {interaction.meeting_location && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {interaction.meeting_location}
                      </div>
                    )}

                    {(interaction.previous_stage || interaction.new_stage) && (
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-3 h-3 text-blue-500" />
                        <span className="text-sm">
                          {interaction.previous_stage && (
                            <span className="text-red-600">
                              De: {getSalesStageLabel(interaction.previous_stage)}
                            </span>
                          )}
                          {interaction.previous_stage && interaction.new_stage && (
                            <span className="mx-2">→</span>
                          )}
                          {interaction.new_stage && (
                            <span className="text-green-600">
                              A: {getSalesStageLabel(interaction.new_stage)}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {interaction.outcome && (
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                        <span className="text-sm"><strong>Resultado:</strong> {interaction.outcome}</span>
                      </div>
                    )}

                    {interaction.notes && (
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Notas:</strong> {interaction.notes}
                      </div>
                    )}

                    {interaction.next_steps && (
                      <div className="text-sm text-blue-700">
                        <strong>Próximos pasos:</strong> {interaction.next_steps}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      Registrado: {new Date(interaction.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactHistory;
