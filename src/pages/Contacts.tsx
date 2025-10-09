import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import ContactHistory from '@/components/ContactHistory';

interface Contact {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  address?: string;
  district?: string;
  notes?: string;
  status: string;
  client_type?: string;
  acquisition_source?: string;
  sales_stage?: string;
  budget?: string;
  created_at: string;
  last_interaction?: {
    type: string;
    date: string;
    subject?: string;
  };
}

const Contacts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    notes: '',
    status: 'prospect',
    client_type: '',
    acquisition_source: '',
    sales_stage: 'contacto_inicial_recibido',
    budget: ''
  });

  const salesStages = [
    { key: 'contacto_inicial_recibido', name: 'Contacto inicial recibido', color: '#ef4444' },
    { key: 'primer_contacto_activo', name: 'Primer contacto activo', color: '#f97316' },
    { key: 'llenado_ficha', name: 'Llenado de ficha', color: '#eab308' },
    { key: 'seguimiento_inicial', name: 'Seguimiento inicial', color: '#84cc16' },
    { key: 'agendamiento_visitas', name: 'Agendamiento de visitas o reuniones', color: '#22c55e' },
    { key: 'presentacion_personalizada', name: 'Presentación personalizada', color: '#06b6d4' },
    { key: 'negociacion', name: 'Negociación', color: '#3b82f6' },
    { key: 'cierre_firma_contrato', name: 'Cierre / Firma de contrato', color: '#8b5cf6' },
    { key: 'postventa_fidelizacion', name: 'Postventa y fidelización', color: '#10b981' }
  ];

  const interactionTypes = [
    { key: 'call', name: 'Llamada', icon: Phone },
    { key: 'email', name: 'Email', icon: Mail },
    { key: 'visit', name: 'Visita', icon: MapPin },
    { key: 'message', name: 'Mensaje', icon: Mail },
    { key: 'meeting', name: 'Reunión', icon: Calendar }
  ];

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.district?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts for user:', user?.id);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      console.log('Contacts fetched:', data);
      
      // Obtener la última interacción para cada contacto
      const contactsWithLastInteraction = await Promise.all(
        (data || []).map(async (contact) => {
          const { data: lastInteraction } = await supabase
            .from('interactions')
            .select('interaction_type, interaction_date, subject')
            .eq('contact_id', contact.id)
            .eq('user_id', user?.id)
            .order('interaction_date', { ascending: false })
            .limit(1)
            .single();

          return {
            ...contact,
            last_interaction: lastInteraction ? {
              type: lastInteraction.interaction_type,
              date: lastInteraction.interaction_date,
              subject: lastInteraction.subject
            } : undefined
          };
        })
      );
      
      setContacts(contactsWithLastInteraction);
      setFilteredContacts(contactsWithLastInteraction);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los contactos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.phone || !formData.address || !formData.district || !formData.status || !formData.client_type || !formData.acquisition_source) {
      toast({
        title: 'Error',
        description: 'Todos los campos son obligatorios excepto las notas',
        variant: 'destructive',
      });
      return;
    }

    try {
      const contactData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        district: formData.district,
        notes: formData.notes,
        status: formData.status,
        client_type: formData.client_type,
        acquisition_source: formData.acquisition_source,
        sales_stage: formData.sales_stage,
        budget: formData.budget || null,
        user_id: user.id
      };

      if (editingContact) {
        console.log('Updating contact:', editingContact.id, 'with data:', contactData);
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', editingContact.id);

        if (error) throw error;
        toast({ title: 'Contacto actualizado exitosamente' });
      } else {
        console.log('Creating new contact with data:', contactData);
        const { error } = await supabase
          .from('contacts')
          .insert([contactData]);

        if (error) throw error;
        toast({ title: 'Contacto agregado exitosamente' });
      }

      resetForm();
      await fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el contacto',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Contacto eliminado' });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el contacto',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      district: '',
      notes: '',
      status: 'prospect',
      client_type: '',
      acquisition_source: '',
      sales_stage: 'contacto_inicial_recibido',
      budget: ''
    });
    setIsAddingContact(false);
    setEditingContact(null);
  };

  const startEdit = (contact: Contact) => {
    console.log('Starting edit for contact:', contact.id, 'Current sales stage:', contact.sales_stage);
    setFormData({
      full_name: contact.full_name,
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
      district: contact.district || '',
      notes: contact.notes || '',
      status: contact.status,
      client_type: contact.client_type || '',
      acquisition_source: contact.acquisition_source || '',
      sales_stage: contact.sales_stage || 'contacto_inicial_recibido',
      budget: contact.budget || ''
    });
    setEditingContact(contact);
    setIsAddingContact(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client': return 'bg-green-500';
      case 'prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSalesStageInfo = (stageKey: string) => {
    return salesStages.find(s => s.key === stageKey);
  };

  const getInteractionTypeInfo = (type: string) => {
    return interactionTypes.find(t => t.key === type);
  };

  const formatLastContactDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
    return `Hace ${Math.floor(diffDays / 365)} año${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
  };

  if (loading) {
    return <div className="p-8">Cargando contactos...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Contactos</h1>
          </div>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingContact(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contacto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Nombre completo *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">Distrito *</Label>
                  <Select value={formData.district} onValueChange={(value) => setFormData({...formData, district: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="Ate">Ate</SelectItem>
                      <SelectItem value="Barranco">Barranco</SelectItem>
                      <SelectItem value="Bellavista">Bellavista</SelectItem>
                      <SelectItem value="Breña">Breña</SelectItem>
                      <SelectItem value="Callao">Callao</SelectItem>
                      <SelectItem value="Cercado de Lima">Cercado de Lima</SelectItem>
                      <SelectItem value="Chorrillos">Chorrillos</SelectItem>
                      <SelectItem value="Comas">Comas</SelectItem>
                      <SelectItem value="El Agustino">El Agustino</SelectItem>
                      <SelectItem value="Independencia">Independencia</SelectItem>
                      <SelectItem value="Jesús María">Jesús María</SelectItem>
                      <SelectItem value="La Molina">La Molina</SelectItem>
                      <SelectItem value="La Perla">La Perla</SelectItem>
                      <SelectItem value="La Punta">La Punta</SelectItem>
                      <SelectItem value="La Victoria">La Victoria</SelectItem>
                      <SelectItem value="Lince">Lince</SelectItem>
                      <SelectItem value="Los Olivos">Los Olivos</SelectItem>
                      <SelectItem value="Magdalena">Magdalena</SelectItem>
                      <SelectItem value="Miraflores">Miraflores</SelectItem>
                      <SelectItem value="Pueblo Libre">Pueblo Libre</SelectItem>
                      <SelectItem value="San Borja">San Borja</SelectItem>
                      <SelectItem value="San Isidro">San Isidro</SelectItem>
                      <SelectItem value="San Juan de Miraflores">San Juan de Miraflores</SelectItem>
                      <SelectItem value="San Luis">San Luis</SelectItem>
                      <SelectItem value="San Martín de Porres">San Martín de Porres</SelectItem>
                      <SelectItem value="San Miguel">San Miguel</SelectItem>
                      <SelectItem value="Santa Anita">Santa Anita</SelectItem>
                      <SelectItem value="Surco">Surco</SelectItem>
                      <SelectItem value="Ventanilla">Ventanilla</SelectItem>
                      <SelectItem value="Villa El Salvador">Villa El Salvador</SelectItem>
                      <SelectItem value="Villa María del Triunfo">Villa María del Triunfo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Estado *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="prospect">Prospecto</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="client_type">Tipo de Cliente *</Label>
                  <Select value={formData.client_type} onValueChange={(value) => setFormData({...formData, client_type: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="familiar">Familiar</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="negocio">Negocio</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                      <SelectItem value="inversionista">Inversionista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="acquisition_source">¿Cómo nos conoció? *</Label>
                  <Select value={formData.acquisition_source} onValueChange={(value) => setFormData({...formData, acquisition_source: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="referido">Referido</SelectItem>
                      <SelectItem value="feria-inmobiliaria">Feria Inmobiliaria</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="llamada-fria">Llamada en frío</SelectItem>
                      <SelectItem value="sitio-web">Sitio Web</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sales_stage">Etapa de Venta *</Label>
                  <Select 
                    value={formData.sales_stage} 
                    onValueChange={(value) => {
                      console.log('Sales stage changed to:', value);
                      setFormData({...formData, sales_stage: value});
                    }} 
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar etapa" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {salesStages.map((stage) => (
                        <SelectItem key={stage.key} value={stage.key}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: stage.color }}
                            ></div>
                            {stage.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Presupuesto</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar presupuesto (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="0-150000">S/ 0 - 150,000</SelectItem>
                      <SelectItem value="150000-300000">S/ 150,000 - 300,000</SelectItem>
                      <SelectItem value="300000-500000">S/ 300,000 - 500,000</SelectItem>
                      <SelectItem value="500000-1000000">S/ 500,000 - 1,000,000</SelectItem>
                      <SelectItem value="1000000+">Más de S/ 1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingContact ? 'Actualizar' : 'Guardar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contactos ({filteredContacts.length})</CardTitle>
              <Input
                placeholder="Buscar por nombre, email, teléfono o distrito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'No se encontraron contactos con ese criterio de búsqueda.' : 'No tienes contactos registrados. ¡Agrega tu primer contacto!'}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Etapa de Venta</TableHead>
                    <TableHead>Último Contacto</TableHead>
                    <TableHead>Fuente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => {
                    const stageInfo = getSalesStageInfo(contact.sales_stage || '');
                    const interactionInfo = contact.last_interaction ? getInteractionTypeInfo(contact.last_interaction.type) : null;
                    
                    return (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.full_name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {contact.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="w-3 h-3 mr-1" />
                                {contact.email}
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                            {contact.address && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-3 h-3 mr-1" />
                                {contact.address}
                                {contact.district && `, ${contact.district}`}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.client_type && (
                            <Badge variant="outline">
                              {contact.client_type === 'familiar' ? 'Familiar' :
                               contact.client_type === 'individual' ? 'Individual' :
                               contact.client_type === 'negocio' ? 'Negocio' :
                               contact.client_type === 'empresa' ? 'Empresa' :
                               contact.client_type === 'inversionista' ? 'Inversionista' : 
                               contact.client_type}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status === 'prospect' ? 'Prospecto' : 'Cliente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {stageInfo ? (
                            <Badge 
                              variant="outline" 
                              className="text-xs border-2 px-2 py-1 whitespace-nowrap"
                              style={{ 
                                borderColor: stageInfo.color, 
                                color: stageInfo.color,
                                backgroundColor: `${stageInfo.color}15`
                              }}
                            >
                              {stageInfo.name}
                            </Badge>
                          ) : contact.sales_stage ? (
                            <Badge variant="outline" className="text-xs">
                              {contact.sales_stage}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin etapa</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.last_interaction ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                {interactionInfo && (
                                  <interactionInfo.icon className="w-3 h-3 text-blue-500" />
                                )}
                                <span className="font-medium">
                                  {interactionInfo?.name || contact.last_interaction.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {formatLastContactDate(contact.last_interaction.date)}
                              </div>
                              {contact.last_interaction.subject && (
                                <div className="text-xs text-gray-600 truncate max-w-32" title={contact.last_interaction.subject}>
                                  {contact.last_interaction.subject}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Sin contacto
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.acquisition_source && (
                            <span className="text-sm text-gray-600">
                              {contact.acquisition_source === 'tiktok' ? 'TikTok' :
                               contact.acquisition_source === 'instagram' ? 'Instagram' :
                               contact.acquisition_source === 'facebook' ? 'Facebook' :
                               contact.acquisition_source === 'referido' ? 'Referido' :
                               contact.acquisition_source === 'feria-inmobiliaria' ? 'Feria Inmobiliaria' :
                               contact.acquisition_source === 'google' ? 'Google' :
                               contact.acquisition_source === 'whatsapp' ? 'WhatsApp' :
                               contact.acquisition_source === 'llamada-fria' ? 'Llamada en frío' :
                               contact.acquisition_source === 'sitio-web' ? 'Sitio Web' :
                               contact.acquisition_source === 'otro' ? 'Otro' :
                               contact.acquisition_source}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ContactHistory contact={contact} />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(contact)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(contact.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;
