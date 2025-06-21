
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle, Plus } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_date: string;
  priority: string;
  status: string;
  contact_id: string;
}

interface Contact {
  id: string;
  full_name: string;
}

const SmartAgenda = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch reminders
        const { data: remindersData, error: remindersError } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .order('reminder_date', { ascending: true });

        if (remindersError) {
          console.error('Error fetching reminders:', remindersError);
        } else {
          setReminders(remindersData || []);
        }

        // Fetch contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('id, full_name')
          .eq('user_id', user.id);

        if (contactsError) {
          console.error('Error fetching contacts:', contactsError);
        } else {
          setContacts(contactsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleCompleteTask = async (reminderId: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ status: 'completado' })
        .eq('id', reminderId);

      if (error) {
        console.error('Error completing reminder:', error);
        toast({
          title: "Error",
          description: "No se pudo completar el recordatorio.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === reminderId 
            ? { ...reminder, status: 'completado' }
            : reminder
        )
      );

      toast({
        title: "Éxito",
        description: "Recordatorio completado exitosamente.",
      });
    } catch (error) {
      console.error('Unexpected error completing reminder:', error);
      toast({
        title: "Error",
        description: "Error inesperado al completar el recordatorio.",
        variant: "destructive",
      });
    }
  };

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.full_name || 'Cliente no encontrado';
  };

  const getDaysWithoutContact = (reminderDate: string) => {
    const days = Math.floor((Date.now() - new Date(reminderDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Cargando agenda...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agenda Inteligente</h1>
          <p className="text-gray-600">Gestiona tus recordatorios y tareas de seguimiento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Calendario
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center justify-between text-blue-800">
                <div className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Recordatorios Inteligentes
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/reminders')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Crear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {reminders.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recordatorios</h3>
                  <p className="text-gray-500 mb-4">
                    Crea tu primer recordatorio para comenzar a organizar tu agenda
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate('/reminders')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Crear Recordatorio
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map(reminder => {
                    const isOverdue = new Date(reminder.reminder_date) < new Date() && reminder.status === 'pendiente';
                    const daysWithoutContact = getDaysWithoutContact(reminder.reminder_date);
                    
                    return (
                      <div 
                        key={reminder.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          reminder.status === 'completado'
                            ? 'bg-gray-100 border-gray-200' 
                            : isOverdue
                              ? 'bg-red-50 border-red-200'
                              : reminder.priority === 'alta' 
                                ? 'bg-red-50 border-red-200' 
                                : reminder.priority === 'media' 
                                  ? 'bg-yellow-50 border-yellow-200' 
                                  : 'bg-green-50 border-green-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            reminder.status === 'completado'
                              ? 'text-gray-400' 
                              : reminder.priority === 'alta' || isOverdue
                                ? 'text-red-500' 
                                : reminder.priority === 'media' 
                                  ? 'text-yellow-500' 
                                  : 'text-green-500'
                          }`}>
                            {reminder.priority === 'alta' || isOverdue ? (
                              <AlertTriangle className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>
                          <div className={reminder.status === 'completado' ? 'line-through text-gray-400' : ''}>
                            <div className="font-medium">{reminder.title}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(reminder.reminder_date).toLocaleDateString()} - {reminder.description}
                            </div>
                            <div className="text-sm text-gray-600">
                              Cliente: {getContactName(reminder.contact_id)}
                            </div>
                            {daysWithoutContact > 0 && reminder.status === 'pendiente' && (
                              <div className="text-xs text-gray-500">
                                {daysWithoutContact} días sin contacto
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            reminder.priority === 'alta' ? 'destructive' : 
                            reminder.priority === 'media' ? 'default' : 'outline'
                          }>
                            {reminder.priority}
                          </Badge>
                          {reminder.status === 'pendiente' && (
                            <Button 
                              size="sm"
                              onClick={() => handleCompleteTask(reminder.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completar
                            </Button>
                          )}
                          {reminder.status === 'completado' && (
                            <Badge variant="default" className="bg-green-100 text-green-700">
                              Completado
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SmartAgenda;
