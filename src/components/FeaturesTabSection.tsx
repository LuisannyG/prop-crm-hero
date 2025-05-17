
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon, Calendar, ChartBar, FileText, FileUser, Brain, BadgeInfo, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  id: string;
  title: string;
  description: string[];
  icon: LucideIcon;
  emoji: string;
}

const FeaturesTabSection = () => {
  const [activeTab, setActiveTab] = useState("agenda");

  const features: Feature[] = [
    {
      id: "agenda",
      title: "Agenda Inteligente",
      description: [
        "Recordatorios automáticos para dar seguimiento a tus leads.",
        "Notificaciones según prioridad, tiempo sin contacto y etapa del proceso."
      ],
      icon: Calendar,
      emoji: "📅"
    },
    {
      id: "panel",
      title: "Panel de Control",
      description: [
        "Segmentación de clientes por tipo (inversionista, familia, joven, etc.).",
        "Clasificación por nivel de intención de compra (alto, medio, bajo).",
        "Visualización por etapa del embudo (nuevo contacto, seguimiento, visita, cierre)."
      ],
      icon: ChartBar,
      emoji: "📊"
    },
    {
      id: "registro",
      title: "Registro de Motivos de No Compra",
      description: [
        "Formulario interno con opciones seleccionables y campo de texto libre.",
        "Al final del ciclo de seguimiento permite documentar razones de pérdida."
      ],
      icon: FileText,
      emoji: "📝"
    },
    {
      id: "reportes",
      title: "Reportes Automáticos",
      description: [
        "Para pequeñas inmobiliarias: desempeño del equipo.",
        "Para agentes independientes: rendimiento por canal (redes sociales, portales, referidos)."
      ],
      icon: ChartBar,
      emoji: "📈"
    },
    {
      id: "ficha",
      title: "Ficha de Cliente Integrada",
      description: [
        "Datos básicos: nombre, contacto, tipo de propiedad buscada.",
        "Subida de archivos: foto del DNI, ficha técnica, imágenes de visitas."
      ],
      icon: FileUser,
      emoji: "📂"
    },
    {
      id: "motor",
      title: "Motor de Aprendizaje",
      description: [
        "La app analiza datos históricos para detectar patrones de comportamiento.",
        "Aprende con cada registro y mejora la precisión de sus predicciones."
      ],
      icon: Brain,
      emoji: "🧠"
    },
    {
      id: "deteccion",
      title: "Detección de Riesgo de No Compra",
      description: [
        "Considera interacción previa, tiempo sin respuesta y etapa actual en el proceso de venta."
      ],
      icon: BadgeInfo,
      emoji: "🚨"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades de Proptor</h2>
      
      <Tabs defaultValue="agenda" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-8 flex flex-wrap justify-center gap-2">
          {features.map((feature) => (
            <TabsTrigger 
              key={feature.id} 
              value={feature.id}
              className={`px-4 py-2 ${activeTab === feature.id ? "bg-blue-500 text-white" : ""}`}
            >
              <span className="mr-2">{feature.emoji}</span>
              {feature.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="mt-6">
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
                      {feature.emoji} {feature.title}
                    </h3>
                    <ul className="space-y-4">
                      {feature.description.map((desc, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-blue-100 p-1 rounded-full mt-1">
                            <feature.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-slate-700 text-lg">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full md:w-1/2 bg-slate-100 rounded-lg p-6 flex items-center justify-center h-64">
                    <feature.icon className="w-24 h-24 text-blue-300" />
                    <span className="text-5xl ml-4">{feature.emoji}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeaturesTabSection;
