
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, FileText, BarChart3 } from "lucide-react";
import DashboardNav from "@/components/DashboardNav";

const PurchaseReasons = () => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [priceReason, setPriceReason] = useState<string>("");
  const [anotherProperty, setAnotherProperty] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Motivos de No Compra</h1>
          <p className="text-gray-600">Registra y analiza las razones por las que los clientes no compran</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <FileText className="mr-2 h-5 w-5" />
                Registro de Motivos de No Compra
              </CardTitle>
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
                      <SelectItem value="no-clients" disabled>
                        No hay clientes registrados
                      </SelectItem>
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
                  disabled={!selectedReason || submitted}
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
              <CardTitle className="flex items-center text-blue-800">
                <BarChart3 className="mr-2 h-5 w-5" />
                Estadísticas de Motivos de No Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin datos suficientes</h3>
                <p className="text-gray-500 mb-4">
                  Registra algunos motivos de no compra para ver estadísticas detalladas
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-blue-800 mb-2">Tip de Proptor:</h4>
                  <p className="text-sm text-blue-700">
                    Los clientes que rechazan por precio suelen reconsiderar su decisión después de 3-4 meses. 
                    Programa un recordatorio de seguimiento automático para estos casos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PurchaseReasons;
