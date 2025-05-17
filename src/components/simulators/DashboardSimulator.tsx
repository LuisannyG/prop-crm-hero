import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Home, Building, User } from "lucide-react";

const DashboardSimulator = () => {
  // Datos simulados para el embudo de ventas
  const funnelData = [
    { name: "Nuevos Contactos", value: 120, fill: "#818CF8" },
    { name: "En Seguimiento", value: 80, fill: "#60A5FA" },
    { name: "Visita Programada", value: 40, fill: "#34D399" },
    { name: "Negociación", value: 20, fill: "#FBBF24" },
    { name: "Cierre", value: 10, fill: "#F87171" }
  ];

  // Datos simulados para tipos de clientes
  const clientTypeData = [
    { name: "Inversionista", value: 35 },
    { name: "Familia", value: 45 },
    { name: "Joven", value: 15 },
    { name: "Jubilado", value: 5 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Datos simulados para la intención de compra
  const intentionData = [
    { name: "Alta", value: 40, color: "#22C55E" },
    { name: "Media", value: 35, color: "#F59E0B" },
    { name: "Baja", value: 25, color: "#EF4444" }
  ];

  // Lista de clientes
  const clients = [
    { id: 1, name: "Ana Martínez", type: "Familia", intention: "Alta", stage: "Visita Programada", lastContact: "Hoy" },
    { id: 2, name: "Carlos López", type: "Inversionista", intention: "Media", stage: "Seguimiento", lastContact: "Hace 3 días" },
    { id: 3, name: "Laura Sánchez", type: "Joven", intention: "Baja", stage: "Nuevo Contacto", lastContact: "Hace 5 días" },
    { id: 4, name: "Roberto García", type: "Inversionista", intention: "Alta", stage: "Negociación", lastContact: "Hace 1 día" },
    { id: 5, name: "María Rodríguez", type: "Familia", intention: "Media", stage: "Visita Programada", lastContact: "Hace 2 días" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Embudo de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {funnelData.map((stage) => (
                <div key={stage.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{stage.name}</span>
                    <span className="font-medium">{stage.value}</span>
                  </div>
                  <Progress value={stage.value/1.2} className="h-3" indicatorClassName={`bg-[${stage.fill}]`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Tipos de Cliente</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {clientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {clientTypeData.map((type, index) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Intención de Compra</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                alta: { label: "Alta" },
                media: { label: "Media" },
                baja: { label: "Baja" }
              }}
              className="h-60"
            >
              <BarChart data={intentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={(props) => <ChartTooltipContent {...props} />} />
                <Bar dataKey="value" fill="#8884d8">
                  {intentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Listado de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="todos">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">
                <Users className="h-4 w-4 mr-1" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="familia">
                <Home className="h-4 w-4 mr-1" />
                Familia
              </TabsTrigger>
              <TabsTrigger value="inversionista">
                <Building className="h-4 w-4 mr-1" />
                Inversionista
              </TabsTrigger>
              <TabsTrigger value="joven">
                <User className="h-4 w-4 mr-1" />
                Joven
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Cliente</th>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-left">Intención</th>
                      <th className="px-4 py-2 text-left">Etapa</th>
                      <th className="px-4 py-2 text-left">Último Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{client.name}</td>
                        <td className="px-4 py-3">{client.type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            client.intention === 'Alta' 
                              ? 'bg-green-100 text-green-800' 
                              : client.intention === 'Media' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {client.intention}
                          </span>
                        </td>
                        <td className="px-4 py-3">{client.stage}</td>
                        <td className="px-4 py-3 text-gray-500">{client.lastContact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="familia">
              <div className="p-4 text-center text-gray-500">
                Mostrando clientes del tipo "Familia"
                <div className="mt-2 text-sm">
                  (Contenido filtrado por tipo: Familia)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inversionista">
              <div className="p-4 text-center text-gray-500">
                Mostrando clientes del tipo "Inversionista"
                <div className="mt-2 text-sm">
                  (Contenido filtrado por tipo: Inversionista)
                </div>
              </div>
            </TabsContent>

            <TabsContent value="joven">
              <div className="p-4 text-center text-gray-500">
                Mostrando clientes del tipo "Joven"
                <div className="mt-2 text-sm">
                  (Contenido filtrado por tipo: Joven)
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSimulator;
