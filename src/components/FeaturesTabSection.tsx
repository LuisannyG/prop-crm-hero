
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
    <div className="w-full px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Funcionalidades de Proptor</h2>
      
      <Tabs defaultValue="agenda" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8">
          <div className="overflow-x-auto pb-4">
            <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
              {features.map((feature) => (
                <TabsTrigger 
                  key={feature.id} 
                  value={feature.id}
                  className="text-xs sm:text-sm px-2 py-2"
                >
                  <span className="mr-1">{feature.emoji}</span>
                  <span className="hidden sm:inline">{feature.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        
        <div className="mt-8">
          <TabsContent value="agenda" className="mt-6">
            <AgendaSimulator />
          </TabsContent>
          <TabsContent value="panel" className="mt-6">
            <DashboardSimulator />
          </TabsContent>
          <TabsContent value="registro" className="mt-6">
            <RecordSimulator />
          </TabsContent>
          <TabsContent value="reportes" className="mt-6">
            <ReportsSimulator />
          </TabsContent>
          <TabsContent value="ficha" className="mt-6">
            <ClientFileSimulator />
          </TabsContent>
          <TabsContent value="motor" className="mt-6">
            <LearningEngineSimulator />
          </TabsContent>
          <TabsContent value="deteccion" className="mt-6">
            <RiskDetectionSimulator />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FeaturesTabSection;
