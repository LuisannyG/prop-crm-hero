
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Home, Calendar } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Clientes Activos',
      value: '24',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Propiedades',
      value: '8',
      change: '+3',
      icon: Home,
      color: 'text-green-600'
    },
    {
      title: 'Citas Esta Semana',
      value: '12',
      change: '+2',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Conversión',
      value: '18%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
