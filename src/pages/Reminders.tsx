
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
import { Plus, Edit, Trash2, Bell, Mail, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminder_date: string;
  priority: string;
  status: string;
  email_sent: boolean;
  contact_id?: string;
  created_at: string;
  contacts?: {
    full_name: string;
    email?: string;
  };
}

interface Contact {
  id: string;
  full_name: string;
  email?: string;
}

const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reminder_date: '',
    priority: 'media',
    contact_id: '',
    status: 'pendiente'
  });

  useEffect(() => {
    if (user) {
      fetchReminders();
      fetchContacts();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          contacts (
            full_name,
            email
          )
        `)
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los recordatorios',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const reminderData = {
        ...formData,
        contact_id: formData.contact_id || null,
        user_id: user.id
      };

      if (editingReminder) {
        const { error } = await supabase
          .from('reminders')
          .update(reminderData)
          .eq('id', editingReminder.id);

        if (error) throw error;
        toast({ title: 'Recordatorio actualizado exitosamente' });
      } else {
        const { error } = await supabase
          .from('reminders')
          .insert([reminderData]);

        if (error) throw error;
        toast({ title: 'Recordatorio creado exitosamente' });
      }

      resetForm();
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el recordatorio',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Recordatorio eliminado' });
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el recordatorio',
        variant: 'destructive',
      });
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ status: 'completado' })
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Recordatorio marcado como completado' });
      fetchReminders();
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el recordatorio',
        variant: 'destructive',
      });
    }
  };

  const sendReminderEmail = async (reminder: Reminder) => {
    if (!reminder.contacts?.email) {
      toast({
        title: 'Error',
        description: 'El contacto no tiene email registrado',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-reminder-email', {
        body: {
          to: reminder.contacts.email,
          contactName: reminder.contacts.full_name,
          reminderTitle: reminder.title,
          reminderDescription: reminder.description,
          reminderDate: reminder.reminder_date
        }
      });

      if (error) throw error;

      await supabase
        .from('reminders')
        .update({ email_sent: true })
        .eq('id', reminder.id);

      toast({ title: 'Email enviado exitosamente' });
      fetchReminders();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el email. Configura el servicio de email primero.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      reminder_date: '',
      priority: 'media',
      contact_id: '',
      status: 'pendiente'
    });
    setIsAddingReminder(false);
    setEditingReminder(null);
  };

  const startEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      reminder_date: reminder.reminder_date.split('T')[0],
      priority: reminder.priority,
      contact_id: reminder.contact_id || '',
      status: reminder.status
    });
    setEditingReminder(reminder);
    setIsAddingReminder(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado': return 'bg-green-500';
      case 'pendiente': return 'bg-blue-500';
      case 'cancelado': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return <div className="p-8">Cargando recordatorios...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recordatorios</h1>
          <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingReminder(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Recordatorio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reminder_date">Fecha y Hora *</Label>
                  <Input
                    id="reminder_date"
                    type="datetime-local"
                    value={formData.reminder_date}
                    onChange={(e) => setFormData({...formData, reminder_date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contact_id">Contacto (opcional)</Label>
                  <Select value={formData.contact_id} onValueChange={(value) => setFormData({...formData, contact_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar contacto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin contacto</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingReminder ? 'Actualizar' : 'Crear'}
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
            <CardTitle>Recordatorios ({reminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No tienes recordatorios creados. ¡Crea tu primer recordatorio!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recordatorio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder) => (
                    <TableRow key={reminder.id} className={isOverdue(reminder.reminder_date) && reminder.status === 'pendiente' ? 'bg-red-50' : ''}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center">
                            {isOverdue(reminder.reminder_date) && reminder.status === 'pendiente' && (
                              <Clock className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            {reminder.title}
                          </div>
                          {reminder.description && (
                            <div className="text-sm text-gray-500 mt-1">{reminder.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={isOverdue(reminder.reminder_date) && reminder.status === 'pendiente' ? 'text-red-600 font-medium' : ''}>
                          {new Date(reminder.reminder_date).toLocaleString('es-PE')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reminder.contacts?.full_name || 'Sin contacto'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(reminder.status)}>
                            {reminder.status === 'pendiente' ? 'Pendiente' :
                             reminder.status === 'completado' ? 'Completado' : 'Cancelado'}
                          </Badge>
                          {reminder.email_sent && (
                            <Mail className="w-4 h-4 text-green-500" title="Email enviado" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {reminder.status === 'pendiente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsCompleted(reminder.id)}
                              title="Marcar como completado"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                          {reminder.contacts?.email && !reminder.email_sent && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendReminderEmail(reminder)}
                              title="Enviar email"
                            >
                              <Mail className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(reminder)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(reminder.id)}
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

export default Reminders;
