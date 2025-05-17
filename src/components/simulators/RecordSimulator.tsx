
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

const RecordSimulator = () => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [priceReason, setPriceReason] = useState<string>("");
  const [anotherProperty, setAnotherProperty] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    // Simular envío de formulario
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      // Reiniciar formulario
      setSelectedReason("");
      setSelectedClient("");
      setPriceReason("");
      setAnotherProperty(false);
      setCustomNotes("");
    }, 2000);
  };

  const clients = [
    "Ana Martínez - Ático en Chamberí",
    "Carlos López - Piso en Salamanca",
    "Laura Sánchez - Chalet en La Moraleja",
    "Roberto García - Oficina en Azca",
    "María Rodríguez - Dúplex en Retiro"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Registro de Motivos de No Compra</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente y propiedad</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client, index) => (
                    <SelectItem key={index} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Razón principal de no compra</Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="precio" id="precio" />
                  <Label htmlFor="precio" className="cursor-pointer">Precio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ubicacion" id="ubicacion" />
                  <Label htmlFor="ubicacion" className="cursor-pointer">Ubicación</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tamano" id="tamano" />
                  <Label htmlFor="tamano" className="cursor-pointer">Tamaño/Distribución</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="financiacion" id="financiacion" />
                  <Label htmlFor="financiacion" className="cursor-pointer">Problemas de financiación</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otra" id="otra" />
                  <Label htmlFor="otra" className="cursor-pointer">Otra propiedad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tiempo" id="tiempo" />
                  <Label htmlFor="tiempo" className="cursor-pointer">Cambio de planes/Timing</Label>
                </div>
              </RadioGroup>
            </div>

            {selectedReason === "precio" && (
              <div className="space-y-2">
                <Label>Detalles sobre el precio</Label>
                <RadioGroup value={priceReason} onValueChange={setPriceReason}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alto" id="alto" />
                    <Label htmlFor="alto" className="cursor-pointer">Precio demasiado alto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="negociacion" id="negociacion" />
                    <Label htmlFor="negociacion" className="cursor-pointer">No acuerdo en negociación</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="competencia" id="competencia" />
                    <Label htmlFor="competencia" className="cursor-pointer">Mejor precio en competencia</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {selectedReason === "otra" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anotherProperty"
                  checked={anotherProperty}
                  onCheckedChange={(checked) => 
                    setAnotherProperty(checked === true)
                  }
                />
                <Label htmlFor="anotherProperty" className="cursor-pointer">
                  ¿Compró otra propiedad con nosotros?
                </Label>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Añade información adicional sobre la decisión del cliente..."
                className="min-h-[100px]"
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleSubmit}
              disabled={!selectedClient || !selectedReason || submitted}
            >
              {submitted ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> 
                  Guardar registro
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Estadísticas de Motivos de No Compra</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Motivos más frecuentes</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Precio</span>
                    <span className="text-sm">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Ubicación</span>
                    <span className="text-sm">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Financiación</span>
                    <span className="text-sm">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tamaño/Distribución</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Otra propiedad</span>
                    <span className="text-sm">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Datos importantes</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Total registros de no compra:</span>
                  <span className="font-medium">120</span>
                </li>
                <li className="flex justify-between">
                  <span>Compraron otra propiedad con nosotros:</span>
                  <span className="font-medium">18 (15%)</span>
                </li>
                <li className="flex justify-between">
                  <span>Ratio de conversión posterior:</span>
                  <span className="font-medium">10%</span>
                </li>
                <li className="flex justify-between">
                  <span>Motivo más reciente:</span>
                  <span className="font-medium">Problemas de financiación</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-blue-800 mb-2">Tip de Proptor:</h3>
              <p className="text-sm text-blue-700">
                Los clientes que rechazan por precio suelen reconsiderar su decisión después de 3-4 meses. 
                Programa un recordatorio de seguimiento automático para estos casos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordSimulator;
