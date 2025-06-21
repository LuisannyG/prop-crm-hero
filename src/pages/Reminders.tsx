import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/components/DashboardNav';
import { CalendarIcon, Plus, Clock, AlertCircle, CheckCircle2, X, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<NewReminder>({
    contactId: undefined,
    title: '',
    description: '',
    reminderDate: null,
    priority: 'media',
  });

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

    const fetchReminders = async () => {
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

        setReminders(data || []);
      } catch (error) {
        console.error("Unexpected error fetching reminders:", error);
        toast({
          title: "Error",
          description: "Failed to load reminders due to an unexpected error.",
          variant: "destructive",
        });
      }
    };

    fetchContacts();
    fetchReminders();
  }, [user, toast]);

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

      // Refresh reminders
      const fetchReminders = async () => {
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
  
          setReminders(data || []);
        } catch (error) {
          console.error("Unexpected error fetching reminders:", error);
          toast({
            title: "Error",
            description: "Failed to load reminders due to an unexpected error.",
            variant: "destructive",
          });
        }
      };
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

      // Refresh reminders
      const fetchReminders = async () => {
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
  
          setReminders(data || []);
        } catch (error) {
          console.error("Unexpected error fetching reminders:", error);
          toast({
            title: "Error",
            description: "Failed to load reminders due to an unexpected error.",
            variant: "destructive",
          });
        }
      };
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

      // Refresh reminders
      const fetchReminders = async () => {
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
  
          setReminders(data || []);
        } catch (error) {
          console.error("Unexpected error fetching reminders:", error);
          toast({
            title: "Error",
            description: "Failed to load reminders due to an unexpected error.",
            variant: "destructive",
          });
        }
      };
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

  const handleSendTestEmail = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const { data, error } = await supabase.functions.invoke('send-reminder-email', {
        body: {
          user_id: user.id,
          reminder: {
            title: 'Test Reminder',
            description: 'This is a test reminder email.',
            reminder_date: new Date().toISOString(),
            priority: 'media',
          },
          contact: {
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
          },
        },
      });
  
      if (error) {
        console.error("Error sending test email:", error);
        toast({
          title: "Error",
          description: `Failed to send test email: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
  
      console.log("Test email sent successfully:", data);
      toast({
        title: "Success",
        description: "Test email sent successfully. Check your inbox.",
      });
  
    } catch (error) {
      console.error("Unexpected error sending test email:", error);
      toast({
        title: "Error",
        description: `Failed to send test email due to an unexpected error: ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recordatorios</h1>
          <p className="text-gray-600">Gestiona tus recordatorios y seguimientos de clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario para crear recordatorio */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Nuevo Recordatorio
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
                        {newReminder.reminderDate ? format(newReminder.reminderDate, "PPP 'a las' HH:mm", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newReminder.reminderDate}
                        onSelect={(date) => setNewReminder({...newReminder, reminderDate: date})}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Input
                          type="time"
                          value={newReminder.reminderDate ? format(newReminder.reminderDate, 'HH:mm') : ''}
                          onChange={(e) => {
                            if (newReminder.reminderDate && e.target.value) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(newReminder.reminderDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              setNewReminder({...newReminder, reminderDate: newDate});
                            }
                          }}
                        />
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

                <Button onClick={handleCreateReminder} className="w-full">
                  Crear Recordatorio
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de recordatorios */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Próximos Recordatorios</h2>
                <Button 
                  onClick={handleSendTestEmail}
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email de Prueba
                </Button>
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
                                  {format(new Date(reminder.reminder_date), "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
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
                                    <Mail className="w-3 h-3" />
                                    Email enviado
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 ml-4">
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
