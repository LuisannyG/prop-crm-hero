import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getStageSpecificRecommendations, getStageRiskFactors, getNoPurchaseRiskAssessment } from '@/utils/stageRecommendations';
import { 
  Shield, AlertTriangle, Filter, ArrowUpDown, Clock, 
  Calendar, MessageSquare, Zap, CheckCircle2, X, Phone, Mail,
  TrendingUp, Users, Target, Activity, AlertCircle, Ban, XCircle
} from 'lucide-react';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sales_stage: string;
  status: string;
  created_at: string;
}

interface RiskMetric {
  id: string;
  contact_id: string;
  risk_score: number;
  last_contact_days: number;
  interaction_frequency: number;
  engagement_score: number;
  risk_factors: string[];
  recommendations: string[];
  last_calculated: string;
}

interface RiskAlert {
  id: string;
  contact_id: string;
  alert_type: string;
  alert_message: string;
  risk_score: number;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
}

interface NoPurchaseReason {
  id: string;
  contact_id: string;
  reason_category: string;
  reason_details: string;
  created_at: string;
}

// Helper function to safely convert Json to string array
const jsonToStringArray = (json: any): string[] => {
  if (Array.isArray(json)) {
    return json.filter(item => typeof item === 'string');
  }
  return [];
};

const RiskDetectionApp = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [noPurchaseReasons, setNoPurchaseReasons] = useState<NoPurchaseReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("risk-desc");
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener contactos (excluir contactos perdidos a menos que se especifique)
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user?.id)
        .neq('status', 'lost') // Excluir contactos marcados como perdidos
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Obtener métricas de riesgo existentes
      const { data: metricsData, error: metricsError } = await supabase
        .from('client_risk_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('risk_score', { ascending: false });

      if (metricsError) throw metricsError;

      // Transform metrics data to ensure proper types
      const transformedMetrics = (metricsData || []).map(item => ({
        ...item,
        risk_factors: jsonToStringArray(item.risk_factors),
        recommendations: jsonToStringArray(item.recommendations)
      }));

      // Obtener alertas de riesgo
      const { data: alertsData, error: alertsError } = await supabase
        .from('risk_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      // Obtener motivos de no compra
      const { data: noPurchaseData, error: noPurchaseError } = await supabase
        .from('no_purchase_reasons')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (noPurchaseError) throw noPurchaseError;

      setContacts(contactsData || []);
      setRiskMetrics(transformedMetrics);
      setRiskAlerts(alertsData || []);
      setNoPurchaseReasons(noPurchaseData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos de riesgo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskForAllClients = async () => {
    if (!user) return;
    
    setCalculating(true);
    try {
      for (const contact of contacts) {
        await calculateRiskForClient(contact.id);
      }
      
      await fetchData(); // Recargar datos después del cálculo
      
      toast({
        title: "¡Análisis completado!",
        description: "Se han actualizado las métricas de riesgo para todos los clientes",
      });
    } catch (error) {
      console.error('Error calculating risk:', error);
      toast({
        title: "Error",
        description: "Error al calcular el riesgo de los clientes",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
    }
  };

  const calculateRiskForClient = async (contactId: string) => {
    if (!user) return;

    try {
      const { data: riskData, error: riskError } = await supabase
        .rpc('calculate_client_risk_score', {
          contact_uuid: contactId,
          user_uuid: user.id
        });

      if (riskError) throw riskError;

      if (riskData && riskData.length > 0) {
        const risk = riskData[0];
        
        const contactNoPurchaseReasons = noPurchaseReasons
          .filter(reason => reason.contact_id === contactId)
          .map(reason => `${reason.reason_category}: ${reason.reason_details || ''}`);

        const noPurchaseAssessment = getNoPurchaseRiskAssessment(contactNoPurchaseReasons);
        
        const adjustedRiskScore = Math.min(100, Math.round(risk.risk_score * noPurchaseAssessment.riskMultiplier));
        
        const enhancedRiskFactors = [
          ...jsonToStringArray(risk.risk_factors),
          ...noPurchaseAssessment.specificConcerns
        ];

        const contact = contacts.find(c => c.id === contactId);
        const stageRecommendations = getStageSpecificRecommendations(
          contact?.sales_stage || '',
          adjustedRiskScore >= 70 ? 'Alto' : adjustedRiskScore >= 40 ? 'Medio' : 'Bajo',
          Math.round(risk.last_contact_days / 7),
          risk.last_contact_days,
          contactNoPurchaseReasons
        );

        const enhancedRecommendations = [
          ...stageRecommendations.map(rec => rec.action),
          noPurchaseAssessment.recoveryStrategy
        ];
        
        const { error: upsertError } = await supabase
          .from('client_risk_metrics')
          .upsert({
            user_id: user.id,
            contact_id: contactId,
            risk_score: adjustedRiskScore,
            last_contact_days: risk.last_contact_days,
            interaction_frequency: risk.interaction_frequency,
            engagement_score: risk.engagement_score,
            risk_factors: enhancedRiskFactors,
            recommendations: enhancedRecommendations,
            last_calculated: new Date().toISOString()
          }, {
            onConflict: 'user_id,contact_id'
          });

        if (upsertError) throw upsertError;

        if (adjustedRiskScore >= 70) {
          await createRiskAlert(contactId, adjustedRiskScore, noPurchaseAssessment.specificConcerns);
        }
      }
    } catch (error) {
      console.error('Error calculating risk for client:', error);
    }
  };

  const createRiskAlert = async (contactId: string, riskScore: number, specificConcerns?: string[]) => {
    if (!user) return;

    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const concernsText = specificConcerns && specificConcerns.length > 0 
      ? ` (${specificConcerns.join(', ')})`
      : '';

    const alertType = riskScore >= 80 ? 'high_risk' : 'stage_stagnation';
    const alertMessage = riskScore >= 80 
      ? `${contact.full_name} tiene riesgo crítico (${riskScore}%) de abandonar${concernsText}`
      : `${contact.full_name} muestra señales de desinterés (${riskScore}%)${concernsText}`;

    try {
      const { error } = await supabase
        .from('risk_alerts')
        .insert({
          user_id: user.id,
          contact_id: contactId,
          alert_type: alertType,
          alert_message: alertMessage,
          risk_score: riskScore
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating risk alert:', error);
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('risk_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      
      setRiskAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('risk_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      
      setRiskAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const applyRecoveryAction = async (contactId: string, actionType: string, description: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recovery_actions')
        .insert({
          user_id: user.id,
          contact_id: contactId,
          action_type: actionType,
          action_description: description,
          outcome: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Acción aplicada",
        description: "Se ha registrado la acción de recuperación",
      });
    } catch (error) {
      console.error('Error applying recovery action:', error);
    }
  };

  // Combinar datos de contactos con métricas de riesgo y motivos de no compra
  const clientsWithRisk = contacts.map(contact => {
    const riskMetric = riskMetrics.find(m => m.contact_id === contact.id);
    const contactNoPurchaseHistory = noPurchaseReasons.filter(reason => reason.contact_id === contact.id);
    
    return {
      ...contact,
      riskScore: riskMetric?.risk_score || 0,
      lastContactDays: riskMetric?.last_contact_days || 0,
      interactionFrequency: riskMetric?.interaction_frequency || 0,
      engagementScore: riskMetric?.engagement_score || 0,
      riskFactors: riskMetric?.risk_factors || [],
      recommendations: riskMetric?.recommendations || [],
      lastCalculated: riskMetric?.last_calculated,
      noPurchaseHistory: contactNoPurchaseHistory
    };
  });

  // Filtrar clientes
  const filteredClients = clientsWithRisk.filter(client => {
    if (filterStatus === "high-risk") return client.riskScore >= 70;
    if (filterStatus === "medium-risk") return client.riskScore >= 40 && client.riskScore < 70;
    if (filterStatus === "low-risk") return client.riskScore < 40;
    if (filterStatus === "with-objections") return client.noPurchaseHistory.length > 0;
    if (filterStatus === "inactive") return client.status === 'inactive';
    if (filterStatus === "active") return client.status === 'active' || client.status === 'prospect' || client.status === 'client';
    return true;
  });

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortOrder) {
      case "risk-desc": return b.riskScore - a.riskScore;
      case "risk-asc": return a.riskScore - b.riskScore;
      case "contact-desc": return b.lastContactDays - a.lastContactDays;
      case "contact-asc": return a.lastContactDays - b.lastContactDays;
      case "objections-desc": return b.noPurchaseHistory.length - a.noPurchaseHistory.length;
      default: return b.riskScore - a.riskScore;
    }
  });

  const highRiskCount = clientsWithRisk.filter(c => c.riskScore >= 70).length;
  const mediumRiskCount = clientsWithRisk.filter(c => c.riskScore >= 40 && c.riskScore < 70).length;
  const withObjectionsCount = clientsWithRisk.filter(c => c.noPurchaseHistory.length > 0).length;
  const inactiveCount = clientsWithRisk.filter(c => c.status === 'inactive').length;
  const totalClients = clientsWithRisk.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando análisis de riesgo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header con botón de análisis */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Panel de Control de Riesgo</h2>
          <p className="text-gray-600">Sistema de IA para identificar y prevenir la pérdida de clientes</p>
        </div>
        <Button 
          onClick={calculateRiskForAllClients}
          disabled={calculating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {calculating ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analizar Riesgos
            </>
          )}
        </Button>
      </div>

      {/* Métricas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activos</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Riesgo Alto</p>
                <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Riesgo Medio</p>
                <p className="text-2xl font-bold text-orange-600">{mediumRiskCount}</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Con Objeciones</p>
                <p className="text-2xl font-bold text-purple-600">{withObjectionsCount}</p>
              </div>
              <Ban className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-2xl font-bold text-indigo-600">{riskAlerts.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de riesgo */}
      {riskAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Automáticas de Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAlerts.slice(0, 5).map((alert) => {
                const contact = contacts.find(c => c.id === alert.contact_id);
                return (
                  <Alert key={alert.id} className="border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <span>{alert.alert_message}</span>
                      <div className="flex gap-2">
                        {!alert.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAlertAsRead(alert.id)}
                          >
                            Marcar leída
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Resolver
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y ordenamiento */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="high-risk">Riesgo alto (70%+)</SelectItem>
                  <SelectItem value="medium-risk">Riesgo medio (40-69%)</SelectItem>
                  <SelectItem value="low-risk">Riesgo bajo (&lt;40%)</SelectItem>
                  <SelectItem value="with-objections">Con objeciones históricas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[200px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk-desc">↓ Riesgo (mayor primero)</SelectItem>
                  <SelectItem value="risk-asc">↑ Riesgo (menor primero)</SelectItem>
                  <SelectItem value="contact-desc">↓ Días sin contacto</SelectItem>
                  <SelectItem value="contact-asc">↑ Días sin contacto</SelectItem>
                  <SelectItem value="objections-desc">↓ Más objeciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500">
              Mostrando {sortedClients.length} de {totalClients} clientes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes con riesgo */}
      <div className="space-y-4">
        {sortedClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes para mostrar</h3>
              <p className="text-gray-600 mb-4">
                {totalClients === 0 
                  ? "Agrega algunos clientes para comenzar el análisis de riesgo"
                  : "No hay clientes que coincidan con los filtros seleccionados"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedClients.map((client) => (
            <Card 
              key={client.id} 
              className={`border-l-4 ${
                client.status === 'inactive' ? "border-l-gray-500 bg-gray-50" :
                client.riskScore >= 80 ? "border-l-red-500 bg-red-50" :
                client.riskScore >= 60 ? "border-l-orange-500 bg-orange-50" :
                client.riskScore >= 40 ? "border-l-yellow-500 bg-yellow-50" :
                "border-l-green-500 bg-green-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información del cliente */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{client.full_name}</h3>
                      <div className="flex gap-2">
                        {client.status === 'inactive' ? (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            INACTIVO
                          </Badge>
                        ) : (
                          <Badge 
                            variant={client.riskScore >= 70 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {client.riskScore >= 80 ? "CRÍTICO" :
                             client.riskScore >= 60 ? "ALTO RIESGO" :
                             client.riskScore >= 40 ? "RIESGO MEDIO" :
                             "BAJO RIESGO"}
                          </Badge>
                        )}
                        {client.noPurchaseHistory.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            {client.noPurchaseHistory.length} objeción(es)
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {client.lastContactDays} días sin contacto
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 w-4" />
                        {client.sales_stage || 'Sin etapa'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {client.engagementScore}% engagement
                      </div>
                    </div>

                    {/* Historial de objeciones */}
                    {client.noPurchaseHistory.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-purple-700 mb-2">Historial de objeciones:</p>
                        <div className="flex flex-wrap gap-2">
                          {client.noPurchaseHistory.map((reason, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                              {reason.reason_category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Factores de riesgo */}
                    {client.riskFactors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Factores de riesgo:</p>
                        <div className="flex flex-wrap gap-2">
                          {client.riskFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recomendaciones */}
                    {client.recommendations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recomendaciones:</p>
                        <ul className="space-y-1">
                          {client.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Panel de riesgo y acciones */}
                  <div className="lg:w-64 space-y-4">
                    {/* Score de riesgo */}
                    {client.status !== 'inactive' && (
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Probabilidad de abandono</div>
                        <div className={`text-3xl font-bold mb-2 ${
                          client.riskScore >= 80 ? "text-red-600" :
                          client.riskScore >= 60 ? "text-orange-600" :
                          client.riskScore >= 40 ? "text-yellow-600" :
                          "text-green-600"
                        }`}>
                          {client.riskScore}%
                        </div>
                        <Progress 
                          value={client.riskScore} 
                          className="h-2"
                          indicatorClassName={`${
                            client.riskScore >= 80 ? "bg-red-500" :
                            client.riskScore >= 60 ? "bg-orange-500" :
                            client.riskScore >= 40 ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                        />
                      </div>
                    )}

                    {/* Acciones rápidas solo para clientes activos */}
                    {client.status !== 'inactive' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => applyRecoveryAction(client.id, 'priority_call', 'Llamada prioritaria programada')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Llamar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => applyRecoveryAction(client.id, 'follow_up_email', 'Email de seguimiento enviado')}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                        </div>
                        
                        {client.riskScore >= 70 && (
                          <Button 
                            size="sm" 
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
                            onClick={() => applyRecoveryAction(client.id, 'discount_offer', 'Oferta especial aplicada')}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Acción Urgente
                          </Button>
                        )}
                      </div>
                    )}

                    {client.status === 'inactive' && (
                      <div className="text-center p-4 bg-gray-100 rounded-lg">
                        <XCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                        <p className="text-sm text-gray-600">Cliente en seguimiento futuro</p>
                      </div>
                    )}

                    {client.lastCalculated && (
                      <div className="text-xs text-gray-500 text-center">
                        Actualizado: {new Date(client.lastCalculated).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RiskDetectionApp;
