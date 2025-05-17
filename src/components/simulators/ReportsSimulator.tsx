
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ReportsSimulator = () => {
  const [date, setDate] = useState<Date>(new Date());

  // Datos simulados para rendimiento del equipo
  const teamPerformanceData = [
    { name: "Ana", clientes: 24, visitas: 18, cierres: 6 },
    { name: "Carlos", clientes: 30, visitas: 21, cierres: 5 },
    { name: "Laura", clientes: 18, visitas: 15, cierres: 4 },
    { name: "Miguel", clientes: 21, visitas: 13, cierres: 3 },
    { name: "Sofía", clientes: 28, visitas: 22, cierres: 8 }
  ];

  // Datos simulados para rendimiento por canal
  const channelData = [
    { name: "Facebook", valor: 35 },
    { name: "Instagram", valor: 25 },
    { name: "Portales", valor: 20 },
    { name: "Referidos", valor: 15 },
    { name: "Otros", valor: 5 }
  ];

  // Datos de rendimiento por tiempo
  const timeData = [
    { mes: "Enero", clientes: 12, visitas: 8, cierres: 3 },
    { mes: "Febrero", clientes: 19, visitas: 15, cierres: 4 },
    { mes: "Marzo", clientes: 15, visitas: 11, cierres: 2 },
    { mes: "Abril", clientes: 25, visitas: 18, cierres: 6 },
    { mes: "Mayo", clientes: 32, visitas: 22, cierres: 7 },
    { mes: "Junio", clientes: 28, visitas: 20, cierres: 5 }
  ];

  // Colores para el gráfico de pastel
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-xl font-semibold">Reportes Automáticos</h3>
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
              <div className="h-72">
                <ChartContainer
                  config={{
                    clientes: { label: "Clientes" },
                    visitas: { label: "Visitas" },
                    cierres: { label: "Cierres" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamPerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                      <Legend />
                      <Bar name="Clientes" dataKey="clientes" fill="#8884d8" />
                      <Bar name="Visitas" dataKey="visitas" fill="#82ca9d" />
                      <Bar name="Cierres" dataKey="cierres" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800 text-sm">Top Agente en Clientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <div className="text-4xl font-bold text-blue-700">Carlos</div>
                <div className="text-sm text-gray-500">30 clientes nuevos</div>
                <div className="mt-2 text-sm text-green-600">+12% vs. mes anterior</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800 text-sm">Top Agente en Visitas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <div className="text-4xl font-bold text-blue-700">Sofía</div>
                <div className="text-sm text-gray-500">22 visitas realizadas</div>
                <div className="mt-2 text-sm text-green-600">+8% vs. mes anterior</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800 text-sm">Top Agente en Cierres</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <div className="text-4xl font-bold text-blue-700">Sofía</div>
                <div className="text-sm text-gray-500">8 operaciones cerradas</div>
                <div className="mt-2 text-sm text-green-600">+5% vs. mes anterior</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="canal" className="space-y-6 pt-4">
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Rendimiento por Canal</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-72">
                  <ChartContainer
                    config={{
                      valor: { label: "Valor" }
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="valor"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Principales insights</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                        <span>Las redes sociales (Facebook e Instagram) generan el 60% de los leads.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                        <span>Los leads de referidos tienen una tasa de conversión 3 veces mayor.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                        <span>Los portales inmobiliarios tienen el coste de adquisición más bajo.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-blue-800 mb-2">Recomendación Proptor:</h4>
                    <p className="text-sm text-blue-700">
                      Aumenta tu inversión en Facebook, ya que te proporciona el mejor equilibrio entre
                      volumen de leads y calidad de los mismos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiempo" className="space-y-6 pt-4">
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">Evolución Temporal</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72">
                <ChartContainer
                  config={{
                    clientes: { label: "Clientes" },
                    visitas: { label: "Visitas" },
                    cierres: { label: "Cierres" }
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                      <Legend />
                      <Line type="monotone" dataKey="clientes" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="visitas" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="cierres" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600">Clientes</div>
                  <div className="text-2xl font-bold text-purple-800">+17%</div>
                  <div className="text-xs text-purple-600">vs trimestre anterior</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Visitas</div>
                  <div className="text-2xl font-bold text-green-800">+12%</div>
                  <div className="text-xs text-green-600">vs trimestre anterior</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600">Cierres</div>
                  <div className="text-2xl font-bold text-yellow-800">+25%</div>
                  <div className="text-xs text-yellow-600">vs trimestre anterior</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsSimulator;
