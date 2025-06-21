
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_date: string;
  priority: string;
  status: string;
}

const SmartAgenda = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .order('reminder_date', { ascending: true });

        if (error) {
          console.error('Error fetching reminders:', error);
        } else {
          setReminders(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [user]);

  const handleCompleteTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
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
              <CardTitle className="flex items-center text-blue-800">
                <Bell className="mr-2 h-5 w-5" />
                Recordatorios Inteligentes
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
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Bell className="w-4 h-4 mr-2" />
                    Crear Recordatorio
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map(reminder => (
                    <div 
                      key={reminder.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        completedTasks.includes(reminder.id) 
                          ? 'bg-gray-100 border-gray-200' 
                          : reminder.priority === 'alta' 
                            ? 'bg-red-50 border-red-200' 
                            : reminder.priority === 'media' 
                              ? 'bg-yellow-50 border-yellow-200' 
                              : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          completedTasks.includes(reminder.id) 
                            ? 'text-gray-400' 
                            : reminder.priority === 'alta' 
                              ? 'text-red-500' 
                              : reminder.priority === 'media' 
                                ? 'text-yellow-500' 
                                : 'text-green-500'
                        }`}>
                          {reminder.priority === 'alta' ? (
                            <AlertTriangle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div className={completedTasks.includes(reminder.id) ? 'line-through text-gray-400' : ''}>
                          <div className="font-medium">{reminder.title}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(reminder.reminder_date).toLocaleDateString()} - {reminder.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          reminder.priority === 'alta' ? 'destructive' : 
                          reminder.priority === 'media' ? 'default' : 'outline'
                        }>
                          {reminder.priority}
                        </Badge>
                        <Button 
                          size="sm"
                          variant={completedTasks.includes(reminder.id) ? "outline" : "default"}
                          onClick={() => handleCompleteTask(reminder.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {completedTasks.includes(reminder.id) ? 'Deshacer' : 'Completar'}
                        </Button>
                      </div>
                    </div>
                  ))}
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
