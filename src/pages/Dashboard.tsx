
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Building, 
  Calendar, 
  TrendingUp, 
  Phone, 
  FileText, 
  Brain,
  Shield,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "@/components/DashboardNav";
import DashboardSimulator from "@/components/simulators/DashboardSimulator";
import SeedDataButton from "@/components/SeedDataButton";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gestión de Contactos",
      description: "Administra tu base de datos de clientes y prospectos",
      icon: Users,
      color: "bg-blue-500",
      route: "/contacts"
    },
    {
      title: "Gestión de Propiedades",
      description: "Cataloga y gestiona tu portafolio inmobiliario",
      icon: Building,
      color: "bg-green-500",
      route: "/properties"
    },
    {
      title: "Agenda Inteligente",
      description: "Recordatorios automáticos y seguimiento de clientes",
      icon: Calendar,
      color: "bg-purple-500",
      route: "/smart-agenda"
    },
    {
      title: "Reportes Automáticos",
      description: "Análisis y reportes de tu negocio inmobiliario",
      icon: BarChart3,
      color: "bg-orange-500",
      route: "/auto-reports"
    },
    {
      title: "Motor de Aprendizaje",
      description: "IA que aprende de tus datos para mejores recomendaciones",
      icon: Brain,
      color: "bg-indigo-500",
      route: "/learning-engine"
    },
    {
      title: "Detección de Riesgos",
      description: "Identifica y previene riesgos en tus transacciones",
      icon: Shield,
      color: "bg-red-500",
      route: "/risk-detection"
    },
    {
      title: "Registro de Motivos",
      description: "Analiza por qué los clientes no compran",
      icon: FileText,
      color: "bg-yellow-500",
      route: "/purchase-reasons"
    },
    {
      title: "Recordatorios",
      description: "Gestiona recordatorios y tareas pendientes",
      icon: Phone,
      color: "bg-teal-500",
      route: "/reminders"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Inmobiliario</h1>
            <p className="text-gray-600">Gestiona tu negocio inmobiliario de forma inteligente</p>
          </div>
          <SeedDataButton />
        </div>

        {/* Vista general */}
        <div className="mb-8">
          <DashboardSimulator />
        </div>

        {/* Funcionalidades */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.route)}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.route);
                    }}
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
