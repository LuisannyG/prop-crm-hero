
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon, Calendar, ChartBar, FileText, FileUser, Brain, BadgeInfo, Users } from "lucide-react";

// Importamos los componentes de simulación de funcionalidades
import AgendaSimulator from "@/components/simulators/AgendaSimulator";
import DashboardSimulator from "@/components/simulators/DashboardSimulator";
import RecordSimulator from "@/components/simulators/RecordSimulator";
import ReportsSimulator from "@/components/simulators/ReportsSimulator";
import ClientFileSimulator from "@/components/simulators/ClientFileSimulator";
import LearningEngineSimulator from "@/components/simulators/LearningEngineSimulator";
import RiskDetectionSimulator from "@/components/simulators/RiskDetectionSimulator";

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
        "Aprende con cada registro y mejora la precisión de sus predicciones.",
        "Esta es una representación de cómo se verá el Motor de Aprendizaje cuando esté completamente implementado."
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

  // Dividir las pestañas en dos filas
  const firstRowFeatures = features.slice(0, 4);
  const secondRowFeatures = features.slice(4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades de Proptor</h2>
      
      <Tabs defaultValue="agenda" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8 space-y-4">
          {/* Primera fila de pestañas */}
          <TabsList className="grid grid-cols-4 gap-2 h-auto bg-transparent p-0">
            {firstRowFeatures.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto"
              >
                <span className="text-lg">{feature.emoji}</span>
                <span className="text-center leading-tight">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* Segunda fila de pestañas */}
          <TabsList className="grid grid-cols-3 gap-2 max-w-3xl mx-auto h-auto bg-transparent p-0">
            {secondRowFeatures.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto"
              >
                <span className="text-lg">{feature.emoji}</span>
                <span className="text-center leading-tight">{feature.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="mt-8">
          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-6">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{feature.emoji}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {feature.description.map((desc, index) => (
                        <p key={index} className="mb-1">
                          {(feature.id === "motor" || feature.id === "deteccion") && index === 0 ? (
                            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold mr-2 animate-pulse">
                              Vista Previa - Disponible en Plan Premium
                            </span>
                          ) : null}
                          • {desc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {feature.id === "agenda" && <AgendaSimulator />}
              {feature.id === "panel" && <DashboardSimulator />}
              {feature.id === "registro" && <RecordSimulator />}
              {feature.id === "reportes" && <ReportsSimulator />}
              {feature.id === "ficha" && <ClientFileSimulator />}
              {feature.id === "motor" && <LearningEngineSimulator />}
              {feature.id === "deteccion" && <RiskDetectionSimulator />}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default FeaturesTabSection;
