
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { CalendarIcon, Plus, Clock, AlertCircle, CheckCircle2, X, ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Reminder {
  id: string;
  created_at: string;
  user_id: string;
  contact_id: string;
  title: string;
  description: string;
  reminder_date: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'completado';
  email_sent: boolean;
}

interface NewReminder {
  contactId: string | undefined;
  title: string;
  description: string;
  reminderDate: Date | null;
  priority: 'alta' | 'media' | 'baja';
}

const Reminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [newReminder, setNewReminder] = useState<NewReminder>({
    contactId: undefined,
    title: '',
    description: '',
    reminderDate: null,
    priority: 'media',
  });

  // Estados para el selector de tiempo AM/PM
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  const fetchReminders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('reminder_date', { ascending: true });

      if (error) {
        console.error("Error fetching reminders:", error);
        toast({
          title: "Error",
          description: "Failed to load reminders.",
          variant: "destructive",
        });
        return;
      }

      const typedReminders: Reminder[] = (data || []).map(reminder => ({
        ...reminder,
        priority: reminder.priority as 'alta' | 'media' | 'baja',
        status: reminder.status as 'pendiente' | 'completado'
      }));

      setReminders(typedReminders);
    } catch (error) {
      console.error("Unexpected error fetching reminders:", error);
      toast({
        title: "Error",
        description: "Failed to load reminders due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching contacts:", error);
          toast({
            title: "Error",
            description: "Failed to load contacts.",
            variant: "destructive",
          });
          return;
        }

        setContacts(data || []);
      } catch (error) {
        console.error("Unexpected error fetching contacts:", error);
        toast({
          title: "Error",
          description: "Failed to load contacts due to an unexpected error.",
          variant: "destructive",
        });
      }
    };

    fetchContacts();
    fetchReminders();
  }, [user, toast]);

  // Función para actualizar la fecha con la hora seleccionada
  const updateReminderDateTime = () => {
    if (!newReminder.reminderDate) return;
    
    const newDate = new Date(newReminder.reminderDate);
    let hour24 = selectedHour;
    
    if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 += 12;
    } else if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0;
    }
    
    newDate.setHours(hour24, selectedMinute);
    setNewReminder({...newReminder, reminderDate: newDate});
  };

  // Efecto para sincronizar los selectores cuando cambia reminderDate
  useEffect(() => {
    if (newReminder.reminderDate) {
      const date = new Date(newReminder.reminderDate);
      const hours24 = date.getHours();
      const minutes = date.getMinutes();
      
      let hours12 = hours24;
      let period: 'AM' | 'PM' = 'AM';
      
      if (hours24 === 0) {
        hours12 = 12;
        period = 'AM';
      } else if (hours24 < 12) {
        hours12 = hours24;
        period = 'AM';
      } else if (hours24 === 12) {
        hours12 = 12;
        period = 'PM';
      } else {
        hours12 = hours24 - 12;
        period = 'PM';
      }
      
      setSelectedHour(hours12);
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, [newReminder.reminderDate]);

  // Actualizar fecha cuando cambian los selectores
  useEffect(() => {
    updateReminderDateTime();
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const handleCreateReminder = async () => {
    if (!user || !newReminder.contactId || !newReminder.title || !newReminder.reminderDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          contact_id: newReminder.contactId,
          title: newReminder.title,
          description: newReminder.description,
          reminder_date: newReminder.reminderDate.toISOString(),
          priority: newReminder.priority,
          status: 'pendiente',
          email_sent: false,
        });

      if (error) {
        console.error("Error creating reminder:", error);
        toast({
          title: "Error",
          description: "Failed to create reminder.",
          variant: "destructive",
        });
        return;
      }

      setNewReminder({
        contactId: undefined,
        title: '',
        description: '',
        reminderDate: null,
        priority: 'media',
      });

      toast({
        title: "Success",
        description: "Reminder created successfully.",
      });

      fetchReminders();
    } catch (error) {
      console.error("Unexpected error creating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to create reminder due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setNewReminder({
      contactId: reminder.contact_id,
      title: reminder.title,
      description: reminder.description,
      reminderDate: new Date(reminder.reminder_date),
      priority: reminder.priority,
    });
  };

  const handleUpdateReminder = async () => {
    if (!editingReminder || !user || !newReminder.contactId || !newReminder.title || !newReminder.reminderDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reminders')
        .update({
          contact_id: newReminder.contactId,
          title: newReminder.title,
          description: newReminder.description,
          reminder_date: newReminder.reminderDate.toISOString(),
          priority: newReminder.priority,
        })
        .eq('id', editingReminder.id);

      if (error) {
        console.error("Error updating reminder:", error);
        toast({
          title: "Error",
          description: "Failed to update reminder.",
          variant: "destructive",
        });
        return;
      }

      setEditingReminder(null);
      setNewReminder({
        contactId: undefined,
        title: '',
        description: '',
        reminderDate: null,
        priority: 'media',
      });

      toast({
        title: "Success",
        description: "Reminder updated successfully.",
      });

      fetchReminders();
    } catch (error) {
      console.error("Unexpected error updating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to update reminder due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingReminder(null);
    setNewReminder({
      contactId: undefined,
      title: '',
      description: '',
      reminderDate: null,
      priority: 'media',
    });
  };

  const handleCompleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ status: 'completado' })
        .eq('id', reminderId);

      if (error) {
        console.error("Error completing reminder:", error);
        toast({
          title: "Error",
          description: "Failed to complete reminder.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Reminder completed successfully.",
      });

      fetchReminders();
    } catch (error) {
      console.error("Unexpected error completing reminder:", error);
      toast({
        title: "Error",
        description: "Failed to complete reminder due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      if (error) {
        console.error("Error deleting reminder:", error);
        toast({
          title: "Error",
          description: "Failed to delete reminder.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Reminder deleted successfully.",
      });

      fetchReminders();
    } catch (error) {
      console.error("Unexpected error deleting reminder:", error);
      toast({
        title: "Error",
        description: "Failed to delete reminder due to an unexpected error.",
        variant: "destructive",
      });
    }
  };

  const formatTimeWithAMPM = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recordatorios</h1>
            <p className="text-gray-600">Gestiona tus recordatorios y seguimientos de clientes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario para crear/editar recordatorio */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingReminder ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingReminder ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact">Cliente</Label>
                  <Select value={newReminder.contactId} onValueChange={(value) => setNewReminder({...newReminder, contactId: value})}>
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
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    placeholder="Ej: Llamar para seguimiento"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                    placeholder="Detalles del recordatorio..."
                  />
                </div>

                <div>
                  <Label>Fecha y Hora</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newReminder.reminderDate ? 
                          `${format(newReminder.reminderDate, "dd/MM/yyyy", { locale: es })} a las ${formatTimeWithAMPM(newReminder.reminderDate)}` 
                          : "Seleccionar fecha y hora"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newReminder.reminderDate}
                        onSelect={(date) => {
                          if (date) {
                            const newDate = new Date(date);
                            newDate.setHours(selectedHour === 12 && selectedPeriod === 'AM' ? 0 : 
                                           selectedHour === 12 && selectedPeriod === 'PM' ? 12 :
                                           selectedPeriod === 'PM' ? selectedHour + 12 : selectedHour, 
                                           selectedMinute);
                            setNewReminder({...newReminder, reminderDate: newDate});
                          }
                        }}
                        initialFocus
                      />
                      <div className="p-4 border-t">
                        <Label className="text-sm font-medium mb-3 block">Seleccionar Hora</Label>
                        <div className="grid grid-cols-4 gap-2 items-center">
                          {/* Selector de Hora */}
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Hora</Label>
                            <Select value={selectedHour.toString()} onValueChange={(value) => setSelectedHour(parseInt(value))}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(12)].map((_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Selector de Minutos */}
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Min</Label>
                            <Select value={selectedMinute.toString()} onValueChange={(value) => setSelectedMinute(parseInt(value))}>
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 15, 30, 45].map((minute) => (
                                  <SelectItem key={minute} value={minute.toString()}>
                                    {minute.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Selector AM/PM */}
                          <div className="col-span-2">
                            <Label className="text-xs text-gray-500 mb-1 block">Período</Label>
                            <div className="flex gap-1">
                              <Toggle
                                pressed={selectedPeriod === 'AM'}
                                onPressedChange={() => setSelectedPeriod('AM')}
                                className="flex-1 h-9 text-xs"
                                variant="outline"
                              >
                                AM
                              </Toggle>
                              <Toggle
                                pressed={selectedPeriod === 'PM'}
                                onPressedChange={() => setSelectedPeriod('PM')}
                                className="flex-1 h-9 text-xs"
                                variant="outline"
                              >
                                PM
                              </Toggle>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Hora seleccionada: {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={newReminder.priority} onValueChange={(value: 'alta' | 'media' | 'baja') => setNewReminder({...newReminder, priority: value})}>
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

                <div className="flex gap-2">
                  {editingReminder ? (
                    <>
                      <Button onClick={handleUpdateReminder} className="flex-1">
                        Actualizar Recordatorio
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline">
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleCreateReminder} className="w-full">
                      Crear Recordatorio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de recordatorios */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Próximos Recordatorios</h2>
              </div>

              {reminders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">No tienes recordatorios programados</p>
                    <p className="text-gray-400 text-sm text-center mt-2">Crea tu primer recordatorio para comenzar</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {reminders.map((reminder) => {
                    const contact = contacts.find(c => c.id === reminder.contact_id);
                    const isOverdue = new Date(reminder.reminder_date) < new Date() && reminder.status === 'pendiente';
                    const priorityColors = {
                      alta: 'border-l-red-500 bg-red-50',
                      media: 'border-l-yellow-500 bg-yellow-50',
                      baja: 'border-l-green-500 bg-green-50'
                    };
                    const reminderDateTime = new Date(reminder.reminder_date);

                    return (
                      <Card key={reminder.id} className={`border-l-4 ${priorityColors[reminder.priority]} ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                                {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                                {reminder.status === 'completado' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">
                                Cliente: <span className="font-medium">{contact?.full_name || 'Cliente no encontrado'}</span>
                              </p>
                              
                              {reminder.description && (
                                <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                              )}
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(reminderDateTime, "dd/MM/yyyy", { locale: es })} a las {formatTimeWithAMPM(reminderDateTime)}
                                </span>
                                <span className={`px-2 py-1 rounded-full ${
                                  reminder.priority === 'alta' ? 'bg-red-100 text-red-700' :
                                  reminder.priority === 'media' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  Prioridad {reminder.priority}
                                </span>
                                {reminder.email_sent && (
                                  <span className="flex items-center gap-1 text-blue-600">
                                    Email enviado
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditReminder(reminder)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {reminder.status === 'pendiente' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteReminder(reminder.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteReminder(reminder.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reminders;
