
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Filter, ArrowUpDown, Clock, Calendar, MessageSquare, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RiskDetectionSimulator = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("risk-desc");

  // Datos simulados de clientes en riesgo con ubicaciones peruanas
  const riskClients = [
    {
      id: 1,
      name: "Carlos López",
      property: "Departamento en San Isidro",
      riskScore: 85,
      lastContact: 12,
      stage: "Visita realizada",
      reasons: ["Sin respuesta", "Visita sin seguimiento", "Presupuesto ajustado"],
      status: "active"
    },
    {
      id: 2,
      name: "María Rodríguez",
      property: "Casa en La Molina",
      riskScore: 72,
      lastContact: 8,
      stage: "Negociación",
      reasons: ["Duda sobre financiación", "Comparando con competencia"],
      status: "active"
    },
    {
      id: 3,
      name: "Juan Pérez",
      property: "Casa en Surco",
      riskScore: 65,
      lastContact: 5,
      stage: "Visita programada",
      reasons: ["Canceló anterior visita", "Búsqueda prolongada"],
      status: "active"
    },
    {
      id: 4,
      name: "Laura González",
      property: "Dúplex en Miraflores",
      riskScore: 45,
      lastContact: 3,
      stage: "Interesado",
      reasons: ["Primera propiedad vista"],
      status: "active"
    },
    {
      id: 5,
      name: "Miguel Torres",
      property: "Local en Centro de Lima",
      riskScore: 92,
      lastContact: 15,
      stage: "Documentación enviada",
      reasons: ["Sin respuesta", "Presupuesto muy ajustado", "Múltiples objeciones"],
      status: "recovered"
    }
  ];

  // Filtrar clientes según el estado seleccionado
  const filteredClients = riskClients.filter(client => 
    filterStatus === "all" || client.status === filterStatus
  );

  // Ordenar clientes según el criterio seleccionado
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortOrder) {
      case "risk-desc":
        return b.riskScore - a.riskScore;
      case "risk-asc":
        return a.riskScore - b.riskScore;
      case "contact-desc":
        return b.lastContact - a.lastContact;
      case "contact-asc":
        return a.lastContact - b.lastContact;
      default:
        return b.riskScore - a.riskScore;
    }
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Detección de Riesgo de No Compra
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="text-amber-800 font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                ¿Cómo funciona el detector de riesgo?
              </h3>
              <p className="text-sm text-amber-700">
                El sistema analiza múltiples factores como tiempo sin contacto, etapa en el proceso de venta, 
                interacción previa y patrones de comportamiento para calcular la probabilidad de que un cliente 
                abandone el proceso de compra, permitiéndote identificar y priorizar los casos más urgentes.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b">
              <div className="flex gap-2">
                <div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      <SelectItem value="active">En riesgo activo</SelectItem>
                      <SelectItem value="recovered">Recuperados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="risk-desc">↓ Riesgo (mayor primero)</SelectItem>
                      <SelectItem value="risk-asc">↑ Riesgo (menor primero)</SelectItem>
                      <SelectItem value="contact-desc">↓ Días sin contacto</SelectItem>
                      <SelectItem value="contact-asc">↑ Días sin contacto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                Mostrando {filteredClients.length} clientes en riesgo
              </div>
            </div>

            <div className="space-y-4">
              {sortedClients.map((client) => (
                <Card key={client.id} className={`border-l-4 ${
                  client.status === "recovered" 
                    ? "border-l-green-500" 
                    : client.riskScore >= 80 
                      ? "border-l-red-500" 
                      : client.riskScore >= 60 
                        ? "border-l-orange-500" 
                        : "border-l-yellow-500"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">{client.name}</h3>
                          {client.status === "recovered" && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Recuperado
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{client.property}</div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {client.lastContact} días sin contacto
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {client.stage}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {client.reasons.map((reason, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center min-w-[150px] max-w-[150px]">
                        <div className="text-center mb-2 w-full">
                          <div className="text-sm text-gray-500">Riesgo de pérdida</div>
                          <div className={`text-2xl font-bold ${
                            client.riskScore >= 80 ? "text-red-600" : 
                            client.riskScore >= 60 ? "text-orange-600" : 
                            "text-yellow-600"
                          }`}>
                            {client.riskScore}%
                          </div>
                        </div>
                        <Progress 
                          value={client.riskScore} 
                          className="h-2 w-full mb-3" 
                          indicatorClassName={`${
                            client.riskScore >= 80 ? "bg-red-500" : 
                            client.riskScore >= 60 ? "bg-orange-500" : 
                            "bg-yellow-500"
                          }`}
                        />
                        <Button size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contactar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Estrategias de Recuperación</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="high">
            <TabsList className="mb-4">
              <TabsTrigger value="high" className="bg-red-100 data-[state=active]:bg-red-200 text-red-800">
                Riesgo Alto
              </TabsTrigger>
              <TabsTrigger value="medium" className="bg-orange-100 data-[state=active]:bg-orange-200 text-orange-800">
                Riesgo Medio
              </TabsTrigger>
              <TabsTrigger value="low" className="bg-yellow-100 data-[state=active]:bg-yellow-200 text-yellow-800">
                Riesgo Bajo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="high">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Acciones recomendadas para riesgo alto (80-100%)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-red-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Contacto prioritario</p>
                      <p className="text-sm text-gray-600">
                        Llama al cliente en las próximas 24 horas. Ofrece una ventaja exclusiva 
                        (descuento, condiciones especiales) para reactivar su interés.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-red-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Escalado interno</p>
                      <p className="text-sm text-gray-600">
                        Asigna el caso a un agente senior o al responsable de ventas para un 
                        seguimiento especializado.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-red-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Propuesta alternativa</p>
                      <p className="text-sm text-gray-600">
                        Prepara una propuesta con al menos 2 alternativas que aborden las posibles 
                        objeciones del cliente.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="medium">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Acciones recomendadas para riesgo medio (60-79%)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-orange-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Seguimiento programado</p>
                      <p className="text-sm text-gray-600">
                        Envía un email personalizado en 48h con nueva información relevante sobre 
                        la propiedad o el proceso.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-orange-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Agenda nueva visita</p>
                      <p className="text-sm text-gray-600">
                        Si ya visitó la propiedad, propón una segunda visita con nuevos enfoques o 
                        detalles que puedan haber pasado desapercibidos.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="low">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Acciones recomendadas para riesgo bajo (0-59%)</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-yellow-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Mantenimiento de relación</p>
                      <p className="text-sm text-gray-600">
                        Envía contenido de valor cada 7-10 días (nuevas propiedades, guías, noticias del sector).
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 min-h-4 rounded-full bg-yellow-500 mt-1.5"></div>
                    <div>
                      <p className="font-medium">Seguimiento periódico</p>
                      <p className="text-sm text-gray-600">
                        Programa contactos quincenales para mantener el interés sin resultar invasivo.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-md font-medium text-blue-800 mb-2">Estadísticas de recuperación:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>- 65% de los clientes de alto riesgo pueden recuperarse con acción inmediata</li>
              <li>- 40% de las pérdidas ocurren por falta de seguimiento adecuado</li>
              <li>- La probabilidad de cierre aumenta un 35% tras recuperar un cliente en riesgo</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDetectionSimulator;
