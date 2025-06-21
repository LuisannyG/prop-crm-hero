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
import { Plus, Edit, Trash2, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

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
  created_at: string;
}

const Contacts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [salesFunnelData, setSalesFunnelData] = useState<{[key: string]: string}>({});
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
    sales_stage: 'contacto_inicial_recibido'
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

  useEffect(() => {
    if (user) {
      fetchContacts();
      fetchSalesFunnelData();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
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

  const fetchSalesFunnelData = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_funnel')
        .select('contact_id, stage')
        .order('stage_date', { ascending: false });

      if (error) throw error;
      
      const funnelMap = (data || []).reduce((acc, item) => {
        acc[item.contact_id] = item.stage;
        return acc;
      }, {} as {[key: string]: string});
      
      setSalesFunnelData(funnelMap);
    } catch (error) {
      console.error('Error fetching sales funnel data:', error);
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
        user_id: user.id
      };

      let contactId = editingContact?.id;

      if (editingContact) {
        const { error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', editingContact.id);

        if (error) throw error;
        toast({ title: 'Contacto actualizado exitosamente' });
      } else {
        const { data, error } = await supabase
          .from('contacts')
          .insert([contactData])
          .select()
          .single();

        if (error) throw error;
        contactId = data.id;
        toast({ title: 'Contacto agregado exitosamente' });
      }

      // Update or insert sales funnel stage
      if (contactId) {
        const { error: funnelError } = await supabase
          .from('sales_funnel')
          .upsert({
            contact_id: contactId,
            user_id: user.id,
            stage: formData.sales_stage,
            stage_date: new Date().toISOString(),
            notes: `Etapa actualizada: ${salesStages.find(s => s.key === formData.sales_stage)?.name}`
          });

        if (funnelError) {
          console.error('Error updating sales funnel:', funnelError);
        }
      }

      resetForm();
      fetchContacts();
      fetchSalesFunnelData();
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
      sales_stage: 'contacto_inicial_recibido'
    });
    setIsAddingContact(false);
    setEditingContact(null);
  };

  const startEdit = (contact: Contact) => {
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
      sales_stage: salesFunnelData[contact.id] || 'contacto_inicial_recibido'
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
                      <SelectItem value="barranco">Barranco</SelectItem>
                      <SelectItem value="breña">Breña</SelectItem>
                      <SelectItem value="callao">Callao</SelectItem>
                      <SelectItem value="chorrillos">Chorrillos</SelectItem>
                      <SelectItem value="comas">Comas</SelectItem>
                      <SelectItem value="independencia">Independencia</SelectItem>
                      <SelectItem value="jesus-maria">Jesús María</SelectItem>
                      <SelectItem value="la-molina">La Molina</SelectItem>
                      <SelectItem value="lima">Lima Cercado</SelectItem>
                      <SelectItem value="lince">Lince</SelectItem>
                      <SelectItem value="los-olivos">Los Olivos</SelectItem>
                      <SelectItem value="magdalena">Magdalena del Mar</SelectItem>
                      <SelectItem value="miraflores">Miraflores</SelectItem>
                      <SelectItem value="pueblo-libre">Pueblo Libre</SelectItem>
                      <SelectItem value="rimac">Rímac</SelectItem>
                      <SelectItem value="san-borja">San Borja</SelectItem>
                      <SelectItem value="san-isidro">San Isidro</SelectItem>
                      <SelectItem value="san-martin-porres">San Martín de Porres</SelectItem>
                      <SelectItem value="san-miguel">San Miguel</SelectItem>
                      <SelectItem value="surco">Surco</SelectItem>
                      <SelectItem value="surquillo">Surquillo</SelectItem>
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
                  <Select value={formData.sales_stage} onValueChange={(value) => setFormData({...formData, sales_stage: value})} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar etapa" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {salesStages.map((stage) => (
                        <SelectItem key={stage.key} value={stage.key}>
                          {stage.name}
                        </SelectItem>
                      ))}
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
            <CardTitle>Contactos ({contacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No tienes contactos registrados. ¡Agrega tu primer contacto!
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
                    <TableHead>Fuente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
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
                        {salesFunnelData[contact.id] && (
                          <Badge variant="outline">
                            {salesStages.find(s => s.key === salesFunnelData[contact.id])?.name || salesFunnelData[contact.id]}
                          </Badge>
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
                  ))}
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
