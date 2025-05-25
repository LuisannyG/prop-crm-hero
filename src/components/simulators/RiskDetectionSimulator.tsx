import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Clock, Phone, Eye } from "lucide-react";

const RiskDetectionSimulator = () => {
  // Datos simulados de clientes con riesgo
  const clientsAtRisk = [
    { 
      id: 1, 
      name: "Carlos Mendoza", 
      lastContact: "Hace 8 días", 
      stage: "Seguimiento",
      riskLevel: "Alto",
      riskFactors: ["Tiempo sin contacto", "Baja interacción"],
      location: "San Isidro"
    },
    { 
      id: 2, 
      name: "Ana Torres", 
      lastContact: "Hace 5 días", 
      stage: "Visita Programada",
      riskLevel: "Medio",
      riskFactors: ["Canceló visita anterior"],
      location: "Miraflores"
    },
    { 
      id: 3, 
      name: "Miguel Vargas", 
      lastContact: "Hace 12 días", 
      stage: "Negociación",
      riskLevel: "Alto",
      riskFactors: ["Tiempo sin contacto", "No responde llamadas"],
      location: "Surco"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mensaje de Vista Previa */}
      <div className="bg-black border-2 border-red-500 rounded-lg p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Vista Previa - Disponible en Plan Premium</h3>
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
              ⚠️ PREMIUM
            </div>
          </div>
          <p className="text-gray-200 text-sm mb-4 font-medium">
            Esta es una representación de cómo se verá la Detección de Riesgo de No Compra cuando esté completamente implementado.
          </p>
        </div>
      </div>

      {/* Panel de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Riesgo Alto</p>
                <p className="text-2xl font-bold text-red-700">5</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Riesgo Medio</p>
                <p className="text-2xl font-bold text-yellow-700">8</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Sin Riesgo</p>
                <p className="text-2xl font-bold text-green-700">15</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de clientes en riesgo */}
      <Card>
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Clientes en Riesgo de No Compra
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {clientsAtRisk.map(client => (
              <div key={client.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{client.name}</h4>
                    <Badge variant={client.riskLevel === 'Alto' ? 'destructive' : 'default'}>
                      {client.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Etapa: {client.stage} • {client.location}
                  </p>
                  <p className="text-sm text-gray-500">{client.lastContact}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {client.riskFactors.map((factor, index) => (
                      <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Llamar
                  </Button>
                  <Button size="sm">
                    Contactar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights y recomendaciones */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Insights de IA</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Patrón detectado:</p>
                <p className="text-sm text-gray-600">Los clientes en Lima Norte tienen 40% más probabilidad de no responder después del día 7.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Recomendación:</p>
                <p className="text-sm text-gray-600">Contacta a Carlos Mendoza hoy. Clientes similares responden mejor los viernes.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDetectionSimulator;
