
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Phone, 
  Mail, 
  Home,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';

const DashboardModules = () => {
  const modules = [
    {
      title: 'Gestión de Clientes',
      description: 'Administra tu base de datos de clientes potenciales y actuales',
      icon: Users,
      color: 'bg-blue-500',
      features: ['Lista de contactos', 'Historial de interacciones', 'Segmentación']
    },
    {
      title: 'Agenda y Citas',
      description: 'Programa y gestiona tus visitas y reuniones',
      icon: Calendar,
      color: 'bg-green-500',
      features: ['Calendario interactivo', 'Recordatorios automáticos', 'Sincronización']
    },
    {
      title: 'Propiedades',
      description: 'Gestiona tu inventario de propiedades',
      icon: Home,
      color: 'bg-purple-500',
      features: ['Catálogo de propiedades', 'Fotos y detalles', 'Estados de venta']
    },
    {
      title: 'Seguimiento',
      description: 'Monitorea el progreso de tus ventas',
      icon: TrendingUp,
      color: 'bg-orange-500',
      features: ['Pipeline de ventas', 'Etapas del proceso', 'Conversiones']
    },
    {
      title: 'Comunicación',
      description: 'Centraliza todas tus comunicaciones',
      icon: Mail,
      color: 'bg-red-500',
      features: ['Templates de email', 'WhatsApp integrado', 'Llamadas registradas']
    },
    {
      title: 'Reportes',
      description: 'Analiza tu rendimiento y obtén insights',
      icon: BarChart3,
      color: 'bg-indigo-500',
      features: ['Métricas de ventas', 'ROI por canal', 'Reportes personalizados']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module, index) => {
        const IconComponent = module.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${module.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <ul className="space-y-2 mb-4">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline">
                Explorar módulo
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardModules;
