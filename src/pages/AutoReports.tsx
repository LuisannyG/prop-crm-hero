
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Download, BarChart3, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DashboardNav from "@/components/DashboardNav";

const AutoReports = () => {
  const [date, setDate] = useState<Date>(new Date());

  const EmptyState = ({ icon: Icon, title, description }: { 
    icon: React.ElementType, 
    title: string, 
    description: string 
  }) => (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
        <h4 className="text-md font-medium text-blue-800 mb-2">Recomendación Proptor:</h4>
        <p className="text-sm text-blue-700">
          Comienza registrando contactos y propiedades para generar reportes automáticos con insights valiosos.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes Automáticos</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de tu negocio inmobiliario</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "MMMM yyyy", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="flex gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="equipo">
          <TabsList>
            <TabsTrigger value="equipo">Rendimiento del Equipo</TabsTrigger>
            <TabsTrigger value="canal">Rendimiento por Canal</TabsTrigger>
            <TabsTrigger value="tiempo">Evolución Temporal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equipo" className="space-y-6 pt-4">
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800 flex justify-between items-center">
                  <span>Métricas de Rendimiento Individual</span>
                  <span className="text-sm font-normal text-blue-600">
                    {format(date, "MMMM yyyy", { locale: es })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <EmptyState 
                  icon={Users}
                  title="Sin datos del equipo"
                  description="Agrega miembros de tu equipo y registra actividades para ver métricas de rendimiento"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="canal" className="space-y-6 pt-4">
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Rendimiento por Canal</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <EmptyState 
                  icon={BarChart3}
                  title="Sin datos de canales"
                  description="Registra el origen de tus leads para analizar qué canales funcionan mejor"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiempo" className="space-y-6 pt-4">
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Evolución Temporal</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <EmptyState 
                  icon={TrendingUp}
                  title="Sin datos históricos"
                  description="Usa Proptor regularmente para generar reportes de evolución temporal"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AutoReports;
