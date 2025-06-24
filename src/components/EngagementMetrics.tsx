
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  MessageSquare, 
  Calendar,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface EngagementData {
  contactId: string;
  contactName: string;
  engagementScore: number;
  interactionFrequency: number;
  lastContactDays: number;
  responseRate: number;
  stageProgression: string;
  riskTrend: 'up' | 'down' | 'stable';
}

interface EngagementMetricsProps {
  data: EngagementData[];
  className?: string;
}

const EngagementMetrics = ({ data, className = "" }: EngagementMetricsProps) => {
  const averageEngagement = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.engagementScore, 0) / data.length)
    : 0;

  const highEngagement = data.filter(item => item.engagementScore >= 70).length;
  const lowEngagement = data.filter(item => item.engagementScore < 40).length;

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 60) return { level: 'Bueno', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 40) return { level: 'Regular', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { level: 'Bajo', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={className}>
      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{averageEngagement}%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <Progress value={averageEngagement} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alto Engagement</p>
                <p className="text-2xl font-bold text-green-600">{highEngagement}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {data.length > 0 ? Math.round((highEngagement / data.length) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bajo Engagement</p>
                <p className="text-2xl font-bold text-red-600">{lowEngagement}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista detallada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Análisis de Engagement por Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No hay datos de engagement disponibles</p>
              <p className="text-sm text-gray-500 mt-1">
                Ejecuta el análisis de riesgo para generar métricas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => {
                const engagement = getEngagementLevel(item.engagementScore);
                
                return (
                  <div 
                    key={item.contactId}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{item.contactName}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${engagement.textColor} border-current`}
                        >
                          {engagement.level}
                        </Badge>
                        {getTrendIcon(item.riskTrend)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {item.engagementScore}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageSquare className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Frecuencia</span>
                        </div>
                        <div className="text-sm font-medium">
                          {item.interactionFrequency.toFixed(1)}/semana
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Último contacto</span>
                        </div>
                        <div className="text-sm font-medium">
                          {item.lastContactDays} días
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Respuesta</span>
                        </div>
                        <div className="text-sm font-medium">
                          {item.responseRate}%
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">Etapa</span>
                        </div>
                        <div className="text-sm font-medium truncate">
                          {item.stageProgression || 'Sin etapa'}
                        </div>
                      </div>
                    </div>

                    <Progress 
                      value={item.engagementScore} 
                      className="h-2"
                      indicatorClassName={engagement.color}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementMetrics;
