
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const AgendaSimulator = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Datos simulados de recordatorios y tareas
  const tasks = [
    { 
      id: 1, 
      title: "Llamar a Juan Pérez", 
      time: "10:00", 
      priority: "alta", 
      status: "pendiente",
      days: 3,
      stage: "Primer contacto"
    },
    { 
      id: 2, 
      title: "Visita con María González", 
      time: "12:30", 
      priority: "media", 
      status: "confirmada",
      days: 0,
      stage: "Visita"
    },
    { 
      id: 3, 
      title: "Seguimiento a Luis Martínez", 
      time: "15:45", 
      priority: "baja", 
      status: "pendiente",
      days: 7,
      stage: "Negociación"
    },
    { 
      id: 4, 
      title: "Enviar documentación a Ana Silva", 
      time: "17:00", 
      priority: "alta", 
      status: "pendiente",
      days: 5,
      stage: "Cierre"
    }
  ];

  // Estado de las tareas completadas
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const handleCompleteTask = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
      <Card className="lg:col-span-3 shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-800">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calendario
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="w-full flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full max-w-md scale-125"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-800">
            <Bell className="mr-2 h-5 w-5" />
            Recordatorios Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-lg border gap-3 ${
                  completedTasks.includes(task.id) 
                    ? 'bg-gray-100 border-gray-200' 
                    : task.priority === 'alta' 
                      ? 'bg-red-50 border-red-200' 
                      : task.priority === 'media' 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 ${
                    completedTasks.includes(task.id) 
                      ? 'text-gray-400' 
                      : task.priority === 'alta' 
                        ? 'text-red-500' 
                        : task.priority === 'media' 
                          ? 'text-yellow-500' 
                          : 'text-green-500'
                  }`}>
                    {task.priority === 'alta' ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div className={`flex-1 ${completedTasks.includes(task.id) ? 'line-through text-gray-400' : ''}`}>
                    <div className="font-medium text-sm lg:text-base">{task.title}</div>
                    <div className="text-sm text-gray-600">{task.time} - {task.stage}</div>
                    <div className="text-xs text-gray-500">
                      {task.days > 0 ? `${task.days} días sin contacto` : 'Hoy'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={
                    task.priority === 'alta' ? 'destructive' : 
                    task.priority === 'media' ? 'default' : 'outline'
                  } className="text-xs">
                    {task.priority}
                  </Badge>
                  <Button 
                    size="sm"
                    variant={completedTasks.includes(task.id) ? "outline" : "default"}
                    onClick={() => handleCompleteTask(task.id)}
                    className="text-xs px-2 py-1"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {completedTasks.includes(task.id) ? 'Deshacer' : 'Completar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaSimulator;
