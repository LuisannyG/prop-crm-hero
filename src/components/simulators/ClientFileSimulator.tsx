
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Star, Calendar, MessageSquare, Phone, Clock } from "lucide-react";

const ClientFileSimulator = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  // Datos simulados del cliente
  const clientData = {
    name: "Ana Martínez",
    email: "ana.martinez@gmail.com",
    phone: "+51 612 345 678",
    createdAt: "15/04/2023",
    status: "En seguimiento",
    source: "Facebook Ads",
    rating: 4,
    notes: "Busca propiedad para inversión, preferiblemente en zonas céntricas de Lima.",
    documents: [
      { name: "DNI", date: "16/04/2023" },
      { name: "Ficha técnica - Depto en San Isidro", date: "20/04/2023" },
      { name: "Aprobación bancaria", date: "25/04/2023" }
    ],
    interactions: [
      { type: "Llamada", date: "15/04/2023", description: "Primer contacto. Interesada en departamentos para inversión." },
      { type: "Email", date: "17/04/2023", description: "Envío de 3 propiedades según sus criterios." },
      { type: "Visita", date: "22/04/2023", description: "Visita al departamento en San Isidro. Interesada pero preocupada por el precio." },
      { type: "Llamada", date: "24/04/2023", description: "Seguimiento post-visita. Solicitó más información sobre financiación." },
      { type: "Email", date: "28/04/2023", description: "Envío de opciones de financiación y nueva propiedad." }
    ],
    nextActions: [
      { date: "05/05/2023", action: "Llamada de seguimiento", priority: "alta" },
      { date: "10/05/2023", action: "Visita a nuevo departamento en Miraflores", priority: "media" }
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="bg-blue-50 flex flex-row justify-between items-center">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ficha de Cliente
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {clientData.status}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < clientData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="info">Información básica</TabsTrigger>
              <TabsTrigger value="docs">Documentos</TabsTrigger>
              <TabsTrigger value="interactions">Interacciones</TabsTrigger>
              <TabsTrigger value="next">Próximas acciones</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" value={clientData.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={clientData.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={clientData.phone} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Origen del contacto</Label>
                    <Input id="source" value={clientData.source} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="created">Fecha de alta</Label>
                    <Input id="created" value={clientData.createdAt} readOnly />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Tipo de propiedad</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger id="property-type">
                        <SelectValue placeholder="Selecciona tipo de propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="departamento">Departamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="duplex">Dúplex</SelectItem>
                        <SelectItem value="local">Local comercial</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Presupuesto</Label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Selecciona rango de presupuesto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-150000">Menos de S/ 150,000</SelectItem>
                        <SelectItem value="150000-300000">S/ 150,000 - S/ 300,000</SelectItem>
                        <SelectItem value="300000-500000">S/ 300,000 - S/ 500,000</SelectItem>
                        <SelectItem value="500000-800000">S/ 500,000 - S/ 800,000</SelectItem>
                        <SelectItem value="800000-1500000">S/ 800,000 - S/ 1,500,000</SelectItem>
                        <SelectItem value="1500000+">Más de S/ 1,500,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zones">Zonas preferidas</Label>
                    <Input id="zones" placeholder="Ej: San Isidro, Miraflores, Surco..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      className="min-h-[80px]"
                      defaultValue={clientData.notes}
                    />
                  </div>

                  <Button className="w-full mt-2">Guardar cambios</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Documentos subidos</h3>
                  <div className="space-y-2">
                    {clientData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.date}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Ver</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Subir documento</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Arrastra o selecciona un archivo</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Soporta: PDF, JPG, PNG, DOCX (Max. 10MB)
                    </p>
                    <Button className="mt-4">Seleccionar archivo</Button>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="doc-name">Nombre del documento</Label>
                    <Input id="doc-name" placeholder="Ej: DNI, Ficha técnica, Contrato..." />
                  </div>

                  <Button className="w-full mt-4">Subir documento</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interactions" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Historial de interacciones</h3>
                  <Button>Registrar nueva interacción</Button>
                </div>

                <div className="space-y-4">
                  {clientData.interactions.map((interaction, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        interaction.type === 'Llamada'
                          ? 'border-l-blue-500 bg-blue-50'
                          : interaction.type === 'Email'
                            ? 'border-l-purple-500 bg-purple-50'
                            : 'border-l-green-500 bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {interaction.type === 'Llamada' ? (
                            <Phone className="h-5 w-5 text-blue-500" />
                          ) : interaction.type === 'Email' ? (
                            <MessageSquare className="h-5 w-5 text-purple-500" />
                          ) : (
                            <Calendar className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <div className="font-medium">{interaction.type}</div>
                            <div className="text-xs text-gray-500">{interaction.date}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </div>
                      <p className="mt-2 text-sm">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="next" className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Próximas acciones</h3>
                  <Button>Programar nueva acción</Button>
                </div>

                <div className="space-y-4">
                  {clientData.nextActions.map((action, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        action.priority === 'alta' 
                          ? 'border-red-200 bg-red-50' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Clock className={`h-5 w-5 ${
                            action.priority === 'alta' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <div>
                            <div className="font-medium">{action.action}</div>
                            <div className="text-xs text-gray-500">Fecha: {action.date}</div>
                          </div>
                        </div>
                        <Badge variant={action.priority === 'alta' ? 'destructive' : 'default'} className="uppercase">
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <h4 className="text-md font-medium text-blue-800 mb-2">Recomendación Proptor:</h4>
                  <p className="text-sm text-blue-700">
                    Esta cliente lleva 6 días sin contacto. Te recomendamos programar una llamada 
                    para darle seguimiento y mantener su interés.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFileSimulator;
