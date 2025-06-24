
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  MessageSquare,
  Phone,
  Mail,
  Zap
} from 'lucide-react';

interface RiskAlert {
  id: string;
  contact_id: string;
  alert_type: 'high_risk' | 'stage_stagnation' | 'low_engagement' | 'price_objection';
  alert_message: string;
  risk_score: number;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
  contacts?: {
    id: string;
    full_name: string;
  };
}

interface RiskAlertPanelProps {
  alerts: RiskAlert[];
  onMarkAsRead: (alertId: string) => Promise<void>;
  onResolveAlert: (alertId: string) => Promise<void>;
  onApplyAction: (contactId: string, actionType: string, description: string) => Promise<void>;
}

const RiskAlertPanel = ({ 
  alerts, 
  onMarkAsRead, 
  onResolveAlert, 
  onApplyAction 
}: RiskAlertPanelProps) => {
  const [processingAlerts, setProcessingAlerts] = useState<Set<string>>(new Set());

  const handleMarkAsRead = async (alertId: string) => {
    setProcessingAlerts(prev => new Set([...prev, alertId]));
    try {
      await onMarkAsRead(alertId);
    } finally {
      setProcessingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setProcessingAlerts(prev => new Set([...prev, alertId]));
    try {
      await onResolveAlert(alertId);
    } finally {
      setProcessingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const handleQuickAction = async (contactId: string, actionType: string, description: string) => {
    await onApplyAction(contactId, actionType, description);
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'high_risk':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'stage_stagnation':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'low_engagement':
        return <TrendingDown className="w-5 h-5 text-yellow-500" />;
      case 'price_objection':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'high_risk':
        return 'border-red-200 bg-red-50';
      case 'stage_stagnation':
        return 'border-orange-200 bg-orange-50';
      case 'low_engagement':
        return 'border-yellow-200 bg-yellow-50';
      case 'price_objection':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityLevel = (riskScore: number) => {
    if (riskScore >= 80) return { level: 'CRÍTICO', color: 'destructive' };
    if (riskScore >= 60) return { level: 'ALTO', color: 'destructive' };
    if (riskScore >= 40) return { level: 'MEDIO', color: 'secondary' };
    return { level: 'BAJO', color: 'outline' };
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Todo bajo control!
          </h3>
          <p className="text-gray-600">
            No hay alertas de riesgo activas en este momento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          Alertas de Riesgo Automáticas ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => {
          const priority = getPriorityLevel(alert.risk_score);
          const isProcessing = processingAlerts.has(alert.id);
          
          return (
            <div key={alert.id}>
              <Alert className={`${getAlertColor(alert.alert_type)} transition-all duration-200`}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.alert_type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {alert.contacts?.full_name || 'Cliente'}
                      </span>
                      <Badge variant={priority.color as any} className="text-xs">
                        {priority.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.risk_score}% riesgo
                      </Badge>
                      {!alert.is_read && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Nueva
                        </Badge>
                      )}
                    </div>
                    
                    <AlertDescription className="text-sm text-gray-700 mb-3">
                      {alert.alert_message}
                    </AlertDescription>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.created_at).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Acciones rápidas */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleQuickAction(
                          alert.contact_id,
                          'priority_call',
                          'Llamada prioritaria programada por alerta de riesgo'
                        )}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Llamar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleQuickAction(
                          alert.contact_id,
                          'follow_up_email',
                          'Email de seguimiento enviado por alerta de riesgo'
                        )}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>

                      {alert.risk_score >= 70 && (
                        <Button
                          size="sm"
                          className="text-xs h-7 bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleQuickAction(
                            alert.contact_id,
                            'discount_offer',
                            'Oferta especial aplicada por riesgo crítico'
                          )}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Oferta
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Acciones de la alerta */}
                  <div className="flex flex-col gap-2">
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 text-blue-600 hover:text-blue-700"
                        onClick={() => handleMarkAsRead(alert.id)}
                        disabled={isProcessing}
                      >
                        Marcar leída
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      className="text-xs h-7 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleResolveAlert(alert.id)}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Resolver
                    </Button>
                  </div>
                </div>
              </Alert>
              
              {index < alerts.length - 1 && <Separator className="my-4" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RiskAlertPanel;
