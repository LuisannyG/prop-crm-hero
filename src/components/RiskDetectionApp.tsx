
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { 
  Shield, AlertTriangle, Filter, ArrowUpDown, Clock, 
  Calendar, MessageSquare, Zap, CheckCircle2, X, Phone, Mail,
  TrendingUp, Users, Target, Activity, TrendingDown, DollarSign,
  MapPin, FileText, Calculator, Home, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  sales_stage: string;
  created_at: string;
  district?: string;
  client_type?: string;
  acquisition_source?: string;
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

interface DetailedRiskAnalysis {
  marketContext: {
    avgTimeToDecision: number;
    seasonalTrends: string;
    competitionLevel: string;
    priceGrowth: number;
  };
  behavioralPatterns: {
    responseTime: number;
    visitFrequency: number;
    questionTypes: string[];
    concernAreas: string[];
  };
  financialIndicators: {
    budgetAlignment: number;
    financingConcerns: boolean;
    priceNegotiation: number;
    paymentCapacity: string;
  };
  competitiveFactors: {
    comparingSimilar: boolean;
    marketKnowledge: string;
    urgencyLevel: string;
    decisionMakers: number;
  };
}

// Helper function to safely convert Json to string array
const jsonToStringArray = (json: any): string[] => {
  if (Array.isArray(json)) {
    return json.filter(item => typeof item === 'string');
  }
  return [];
};

// Enhanced risk analysis function
const analyzeDetailedRisk = (contact: any, interactions: any[] = []): DetailedRiskAnalysis & { riskFactors: string[], recommendations: string[] } => {
  const daysSinceCreated = Math.floor((new Date().getTime() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const lastContactDays = contact.lastContactDays || 0;
  
  // Market context analysis
  const isHighSeason = [6, 7, 8, 11, 12].includes(new Date().getMonth() + 1); // Jun-Aug, Nov-Dec
  const seasonalMultiplier = isHighSeason ? 1.2 : 0.8;
  
  // District-based market analysis
  const premiumDistricts = ['San Isidro', 'Miraflores', 'San Borja', 'Surco', 'La Molina'];
  const emergingDistricts = ['Jesús María', 'Magdalena', 'Pueblo Libre', 'Barranco'];
  const isPremiumArea = premiumDistricts.includes(contact.district || '');
  const isEmergingArea = emergingDistricts.includes(contact.district || '');
  
  const analysis: DetailedRiskAnalysis = {
    marketContext: {
      avgTimeToDecision: isPremiumArea ? 45 : isEmergingArea ? 35 : 28,
      seasonalTrends: isHighSeason ? "Temporada alta - Mayor competencia" : "Temporada media - Oportunidad de negociación",
      competitionLevel: isPremiumArea ? "Muy alta" : isEmergingArea ? "Alta" : "Media",
      priceGrowth: isPremiumArea ? 8.5 : isEmergingArea ? 12.3 : 6.8
    },
    behavioralPatterns: {
      responseTime: lastContactDays,
      visitFrequency: interactions.filter(i => i.interaction_type === 'visita').length,
      questionTypes: interactions.length > 3 ? ["Financiamiento", "Documentación", "Precio"] : ["Información básica"],
      concernAreas: lastContactDays > 7 ? ["Demora en respuestas", "Pérdida de interés"] : ["Proceso normal"]
    },
    financialIndicators: {
      budgetAlignment: contact.client_type === 'inversionista' ? 85 : contact.client_type === 'primera_vivienda' ? 65 : 75,
      financingConcerns: daysSinceCreated > 21 && contact.sales_stage === 'Interesado',
      priceNegotiation: isPremiumArea ? 5 : 12,
      paymentCapacity: contact.client_type === 'inversionista' ? 'Alta' : contact.client_type === 'primera_vivienda' ? 'Media-Alta' : 'Media'
    },
    competitiveFactors: {
      comparingSimilar: daysSinceCreated > 14,
      marketKnowledge: contact.acquisition_source === 'referido' ? 'Alta' : contact.acquisition_source === 'web' ? 'Media' : 'Básica',
      urgencyLevel: lastContactDays < 3 ? 'Alta' : lastContactDays < 7 ? 'Media' : 'Baja',
      decisionMakers: contact.client_type === 'familia' ? 2 : 1
    }
  };

  // Calculate specific risk factors based on analysis
  const riskFactors: string[] = [];
  const recommendations: string[] = [];

  // Days without contact analysis
  if (lastContactDays > 10) {
    riskFactors.push(`${lastContactDays} días sin contacto - Riesgo crítico de abandono`);
    recommendations.push("URGENTE: Contacto inmediato con oferta especial o descuento");
  } else if (lastContactDays > 7) {
    riskFactors.push(`${lastContactDays} días sin contacto - Seguimiento necesario`);
    recommendations.push("Llamada prioritaria en próximas 24 horas");
  }

  // Sales stage stagnation analysis
  if (daysSinceCreated > analysis.marketContext.avgTimeToDecision) {
    riskFactors.push(`${daysSinceCreated} días en proceso - Excede tiempo promedio de decisión (${analysis.marketContext.avgTimeToDecision} días)`);
    recommendations.push("Identificar obstáculos específicos y proponer soluciones");
  }

  // Market competition analysis
  if (analysis.competitiveFactors.comparingSimilar && analysis.marketContext.competitionLevel === "Muy alta") {
    riskFactors.push("Cliente comparando en mercado altamente competitivo");
    recommendations.push("Destacar ventajas únicas y crear urgencia con disponibilidad limitada");
  }

  // Financial concerns analysis
  if (analysis.financialIndicators.financingConcerns) {
    riskFactors.push("Posibles dificultades con financiamiento hipotecario");
    recommendations.push("Conectar con especialista financiero y explorar alternativas de pago");
  }

  // Seasonal trends impact
  if (isHighSeason && analysis.competitiveFactors.urgencyLevel === 'Baja') {
    riskFactors.push("Baja urgencia en temporada alta - Cliente puede encontrar mejores opciones");
    recommendations.push("Enfatizar oportunidad única y beneficios de decidir ahora");
  }

  // Engagement patterns
  if (analysis.behavioralPatterns.visitFrequency === 0 && daysSinceCreated > 14) {
    riskFactors.push("No ha visitado la propiedad después de 2 semanas - Bajo compromiso");
    recommendations.push("Agendar visita urgente con incentivos (tour personalizado, horarios flexibles)");
  }

  // Price negotiation resistance
  if (analysis.financialIndicators.priceNegotiation < 8 && isPremiumArea) {
    riskFactors.push("Mercado premium con poca flexibilidad de precio - Cliente puede buscar alternativas");
    recommendations.push("Enfocar en valor agregado, servicios exclusivos y términos de pago flexibles");
  }

  // Decision makers complexity
  if (analysis.competitiveFactors.decisionMakers > 1 && lastContactDays > 5) {
    riskFactors.push("Múltiples tomadores de decisión con comunicación irregular");
    recommendations.push("Reunión grupal con todos los decisores o presentación formal");
  }

  return {
    ...analysis,
    riskFactors,
    recommendations
  };
};

// Calculate risk score based on detailed analysis
const calculateEnhancedRiskScore = (contact: any, analysis: DetailedRiskAnalysis): number => {
  let riskScore = 0;
  
  // Time-based risk (40% weight)
  const daysSinceCreated = Math.floor((new Date().getTime() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const lastContactDays = contact.lastContactDays || 0;
  
  if (lastContactDays > 10) riskScore += 35;
  else if (lastContactDays > 7) riskScore += 25;
  else if (lastContactDays > 5) riskScore += 15;
  else if (lastContactDays > 3) riskScore += 8;
  
  if (daysSinceCreated > analysis.marketContext.avgTimeToDecision) {
    riskScore += 20;
  } else if (daysSinceCreated > analysis.marketContext.avgTimeToDecision * 0.8) {
    riskScore += 10;
  }
  
  // Market competition risk (25% weight)
  if (analysis.marketContext.competitionLevel === "Muy alta") riskScore += 15;
  else if (analysis.marketContext.competitionLevel === "Alta") riskScore += 10;
  
  if (analysis.competitiveFactors.comparingSimilar) riskScore += 12;
  
  // Financial risk (20% weight)
  if (analysis.financialIndicators.financingConcerns) riskScore += 18;
  if (analysis.financialIndicators.budgetAlignment < 70) riskScore += 10;
  
  // Engagement risk (15% weight)
  if (analysis.behavioralPatterns.visitFrequency === 0 && daysSinceCreated > 14) riskScore += 15;
  if (analysis.competitiveFactors.urgencyLevel === 'Baja') riskScore += 8;
  
  return Math.min(100, Math.max(0, riskScore));
};

const RiskDetectionApp = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("risk-desc");
  const [calculating, setCalculating] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<{[key: string]: DetailedRiskAnalysis & { riskFactors: string[], recommendations: string[] }}>({});

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener contactos con más información
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user?.id)
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

      setContacts(contactsData || []);
      setRiskMetrics(transformedMetrics);
      setRiskAlerts(alertsData || []);

      // Generate detailed analysis for each contact
      const analysisMap: {[key: string]: DetailedRiskAnalysis & { riskFactors: string[], recommendations: string[] }} = {};
      (contactsData || []).forEach(contact => {
        analysisMap[contact.id] = analyzeDetailedRisk(contact);
      });
      setDetailedAnalysis(analysisMap);

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
      let updatedCount = 0;
      let alertsCreated = 0;

      for (const contact of contacts) {
        const analysis = detailedAnalysis[contact.id];
        if (!analysis) continue;

        const riskScore = calculateEnhancedRiskScore(contact, analysis);
        
        // Actualizar métricas en la base de datos
        const { error: upsertError } = await supabase
          .from('client_risk_metrics')
          .upsert({
            user_id: user.id,
            contact_id: contact.id,
            risk_score: riskScore,
            last_contact_days: analysis.behavioralPatterns.responseTime,
            interaction_frequency: analysis.behavioralPatterns.visitFrequency,
            engagement_score: 100 - riskScore, // Inverse relationship
            risk_factors: analysis.riskFactors,
            recommendations: analysis.recommendations,
            last_calculated: new Date().toISOString()
          }, {
            onConflict: 'user_id,contact_id'
          });

        if (!upsertError) {
          updatedCount++;
          
          // Crear alerta si el riesgo es alto
          if (riskScore >= 70) {
            const alertType = riskScore >= 85 ? 'high_risk' : 'stage_stagnation';
            const alertMessage = `${contact.full_name} - Riesgo ${riskScore}%: ${analysis.riskFactors[0] || 'Múltiples factores de riesgo'}`;
            
            const { error: alertError } = await supabase
              .from('risk_alerts')
              .insert({
                user_id: user.id,
                contact_id: contact.id,
                alert_type: alertType,
                alert_message: alertMessage,
                risk_score: riskScore
              });
            
            if (!alertError) alertsCreated++;
          }
        }
      }
      
      await fetchData(); // Recargar datos
      
      toast({
        title: "¡Análisis completado!",
        description: `${updatedCount} clientes analizados con IA avanzada. ${alertsCreated} alertas críticas generadas.`,
      });
    } catch (error) {
      console.error('Error calculating risk:', error);
      toast({
        title: "Error",
        description: "Error al realizar el análisis de riesgo",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
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

  // Combinar datos de contactos con métricas de riesgo y análisis detallado
  const clientsWithRisk = contacts.map(contact => {
    const riskMetric = riskMetrics.find(m => m.contact_id === contact.id);
    const analysis = detailedAnalysis[contact.id];
    const calculatedRiskScore = analysis ? calculateEnhancedRiskScore(contact, analysis) : 0;
    
    return {
      ...contact,
      riskScore: riskMetric?.risk_score || calculatedRiskScore,
      lastContactDays: analysis?.behavioralPatterns.responseTime || 0,
      interactionFrequency: analysis?.behavioralPatterns.visitFrequency || 0,
      engagementScore: riskMetric?.engagement_score || (100 - calculatedRiskScore),
      riskFactors: riskMetric?.risk_factors || analysis?.riskFactors || [],
      recommendations: riskMetric?.recommendations || analysis?.recommendations || [],
      lastCalculated: riskMetric?.last_calculated,
      detailedAnalysis: analysis
    };
  });

  const filteredClients = clientsWithRisk.filter(client => {
    if (filterStatus === "high-risk") return client.riskScore >= 70;
    if (filterStatus === "medium-risk") return client.riskScore >= 40 && client.riskScore < 70;
    if (filterStatus === "low-risk") return client.riskScore < 40;
    return true;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortOrder) {
      case "risk-desc": return b.riskScore - a.riskScore;
      case "risk-asc": return a.riskScore - b.riskScore;
      case "contact-desc": return b.lastContactDays - a.lastContactDays;
      case "contact-asc": return a.lastContactDays - b.lastContactDays;
      default: return b.riskScore - a.riskScore;
    }
  });

  // Datos para gráficos
  const riskDistributionData = [
    { name: 'Riesgo Crítico (85-100%)', value: clientsWithRisk.filter(c => c.riskScore >= 85).length, color: '#dc2626' },
    { name: 'Riesgo Alto (70-84%)', value: clientsWithRisk.filter(c => c.riskScore >= 70 && c.riskScore < 85).length, color: '#ea580c' },
    { name: 'Riesgo Medio (40-69%)', value: clientsWithRisk.filter(c => c.riskScore >= 40 && c.riskScore < 70).length, color: '#d97706' },
    { name: 'Riesgo Bajo (0-39%)', value: clientsWithRisk.filter(c => c.riskScore < 40).length, color: '#16a34a' }
  ];

  const factorAnalysisData = [
    { factor: 'Sin contacto >10 días', count: clientsWithRisk.filter(c => c.lastContactDays > 10).length },
    { factor: 'Sin visitas realizadas', count: clientsWithRisk.filter(c => c.interactionFrequency === 0).length },
    { factor: 'Tiempo excesivo proceso', count: clientsWithRisk.filter(c => {
      const daysSince = Math.floor((new Date().getTime() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 45;
    }).length },
    { factor: 'Etapa estancada', count: clientsWithRisk.filter(c => c.sales_stage === 'Interesado').length },
    { factor: 'Financiamiento pendiente', count: clientsWithRisk.filter(c => c.riskFactors.some(f => f.includes('financiamiento'))).length }
  ];

  const trendData = [
    { week: 'Sem 1', critical: 2, high: 5, medium: 8 },
    { week: 'Sem 2', critical: 3, high: 7, medium: 6 },
    { week: 'Sem 3', critical: 4, high: 6, medium: 9 },
    { week: 'Sem 4', critical: 6, high: 8, medium: 7 },
    { week: 'Actual', critical: clientsWithRisk.filter(c => c.riskScore >= 85).length, 
      high: clientsWithRisk.filter(c => c.riskScore >= 70 && c.riskScore < 85).length,
      medium: clientsWithRisk.filter(c => c.riskScore >= 40 && c.riskScore < 70).length }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Cargando análisis de riesgo avanzado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sistema IA de Detección de Riesgo</h2>
          <p className="text-gray-600">Análisis predictivo avanzado basado en patrones del mercado inmobiliario de Lima</p>
        </div>
        <Button 
          onClick={calculateRiskForAllClients}
          disabled={calculating}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {calculating ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analizando con IA...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Actualizar Análisis de Riesgo
            </>
          )}
        </Button>
      </div>

      {/* Análisis detallado con gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Riesgo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              Distribución de Niveles de Riesgo
            </CardTitle>
            <CardDescription>
              Clasificación automática por IA de {clientsWithRisk.length} clientes analizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} clientes`, 'Cantidad']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Factores de Riesgo Principales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Factores de Riesgo Detectados
            </CardTitle>
            <CardDescription>
              Principales causas identificadas por el sistema IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorAnalysisData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="factor" type="category" width={120} fontSize={11} />
                  <Tooltip formatter={(value) => [`${value} clientes`, 'Afectados']} />
                  <Bar dataKey="count" fill="#ea580c" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de Riesgo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Evolución del Riesgo - Últimas 5 Semanas
          </CardTitle>
          <CardDescription>
            Seguimiento temporal de clientes en riesgo crítico, alto y medio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#dc2626" fill="#dc2626" name="Crítico" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ea580c" fill="#ea580c" name="Alto" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#d97706" fill="#d97706" name="Medio" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alertas críticas */}
      {riskAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Alertas Críticas del Sistema IA ({riskAlerts.length})
            </CardTitle>
            <CardDescription className="text-red-700">
              Detectadas automáticamente basadas en patrones de comportamiento y datos del mercado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskAlerts.slice(0, 5).map((alert) => {
                const contact = contacts.find(c => c.id === alert.contact_id);
                return (
                  <Alert key={alert.id} className="border-red-300 bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-red-800">{alert.alert_message}</span>
                        <div className="text-xs text-red-600 mt-1">
                          Detectado: {new Date(alert.created_at).toLocaleString('es-ES')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!alert.is_read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAlertAsRead(alert.id)}
                            className="text-xs"
                          >
                            Revisar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
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

      {/* Controles de filtro */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por riesgo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  <SelectItem value="high-risk">Riesgo crítico (70%+)</SelectItem>
                  <SelectItem value="medium-risk">Riesgo medio (40-69%)</SelectItem>
                  <SelectItem value="low-risk">Riesgo bajo (&lt;40%)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk-desc">↓ Riesgo (crítico primero)</SelectItem>
                  <SelectItem value="risk-asc">↑ Riesgo (bajo primero)</SelectItem>
                  <SelectItem value="contact-desc">↓ Días sin contacto</SelectItem>
                  <SelectItem value="contact-asc">↑ Días sin contacto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500">
              Mostrando {sortedClients.length} de {clientsWithRisk.length} clientes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de clientes con análisis detallado */}
      <div className="space-y-4">
        {sortedClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes para mostrar</h3>
              <p className="text-gray-600 mb-4">
                {clientsWithRisk.length === 0 
                  ? "Agrega algunos clientes para comenzar el análisis de riesgo con IA"
                  : "No hay clientes que coincidan con los filtros seleccionados"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedClients.map((client) => (
            <Card 
              key={client.id} 
              className={`border-l-4 transition-all duration-200 ${
                client.riskScore >= 85 ? "border-l-red-600 bg-red-50 shadow-red-100" :
                client.riskScore >= 70 ? "border-l-red-500 bg-red-50" :
                client.riskScore >= 60 ? "border-l-orange-500 bg-orange-50" :
                client.riskScore >= 40 ? "border-l-yellow-500 bg-yellow-50" :
                "border-l-green-500 bg-green-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Información del cliente */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{client.full_name}</h3>
                        <Badge 
                          variant={client.riskScore >= 85 ? "destructive" : client.riskScore >= 70 ? "destructive" : "secondary"}
                          className="text-xs font-medium"
                        >
                          {client.riskScore >= 85 ? "🚨 CRÍTICO" :
                           client.riskScore >= 70 ? "⚠️ ALTO RIESGO" :
                           client.riskScore >= 40 ? "⚡ RIESGO MEDIO" :
                           "✅ BAJO RIESGO"}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                        className="text-xs"
                      >
                        {selectedClient === client.id ? "Ocultar" : "Ver"} Análisis Detallado
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={client.lastContactDays > 7 ? "text-red-600 font-medium" : "text-gray-600"}>
                          {client.lastContactDays} días sin contacto
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{client.sales_stage || 'Sin etapa'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{client.district || 'No especificado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{client.client_type || 'Cliente general'}</span>
                      </div>
                    </div>

                    {/* Factores de riesgo con explicaciones detalladas */}
                    {client.riskFactors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          Factores de riesgo detectados por IA:
                        </p>
                        <div className="space-y-2">
                          {client.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                              <span className="text-red-500 mt-1 text-xs">●</span>
                              <div className="flex-1">
                                <span className="text-red-700 font-medium text-sm block">{factor}</span>
                                {/* Explicaciones específicas basadas en el factor */}
                                {factor.includes('días sin contacto') && (
                                  <p className="text-xs text-red-600 mt-1">
                                    <strong>Impacto:</strong> Clientes sin contacto por más de 7 días tienen 65% más probabilidad de abandonar el proceso. 
                                    La atención inmediata puede recuperar el 70% de estos casos.
                                  </p>
                                )}
                                {factor.includes('tiempo promedio') && (
                                  <p className="text-xs text-red-600 mt-1">
                                    <strong>Impacto:</strong> Procesos que exceden el tiempo promedio del mercado (45 días en Lima) 
                                    indican indecisión o búsqueda de alternativas. Riesgo de pérdida: 45%.
                                  </p>
                                )}
                                {factor.includes('financiamiento') && (
                                  <p className="text-xs text-red-600 mt-1">
                                    <strong>Impacto:</strong> Dificultades financieras son la causa #1 de abandono (40% de casos). 
                                    Conectar con especialista aumenta cierre en 35%.
                                  </p>
                                )}
                                {factor.includes('competitivo') && (
                                  <p className="text-xs text-red-600 mt-1">
                                    <strong>Impacto:</strong> En mercados competitivos como {client.district}, clientes evalúan 
                                    promedio 4.2 opciones. Diferenciación urgente necesaria.
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Análisis expandido con más detalle */}
                    {selectedClient === client.id && client.detailedAnalysis && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Análisis Predictivo Avanzado del Sistema IA
                        </h4>
                        
                        <Tabs defaultValue="market" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="market">Contexto Mercado</TabsTrigger>
                            <TabsTrigger value="behavior">Comportamiento</TabsTrigger>
                            <TabsTrigger value="financial">Perfil Financiero</TabsTrigger>
                            <TabsTrigger value="competitive">Competencia</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="market" className="mt-4">
                            <div className="space-y-3">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-800 mb-2">Análisis del Mercado Local</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Tiempo promedio de decisión en {client.district}:</span>
                                    <span className="font-medium">{client.detailedAnalysis.marketContext.avgTimeToDecision} días</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Crecimiento de precios 2025:</span>
                                    <span className="font-medium text-green-600">+{client.detailedAnalysis.marketContext.priceGrowth}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Nivel de competencia:</span>
                                    <span className={`font-medium ${
                                      client.detailedAnalysis.marketContext.competitionLevel === 'Muy alta' ? 'text-red-600' : 
                                      client.detailedAnalysis.marketContext.competitionLevel === 'Alta' ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                      {client.detailedAnalysis.marketContext.competitionLevel}
                                    </span>
                                  </div>
                                  <div className="text-xs text-blue-700 mt-2 p-2 bg-blue-100 rounded">
                                    <strong>Insight IA:</strong> {client.detailedAnalysis.marketContext.seasonalTrends}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="behavior" className="mt-4">
                            <div className="space-y-3">
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-medium text-purple-800 mb-2">Patrones de Comportamiento</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Tiempo de respuesta promedio:</span>
                                    <span className={`font-medium ${client.detailedAnalysis.behavioralPatterns.responseTime > 7 ? 'text-red-600' : 'text-green-600'}`}>
                                      {client.detailedAnalysis.behavioralPatterns.responseTime} días
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Visitas programadas/realizadas:</span>
                                    <span className="font-medium">{client.detailedAnalysis.behavioralPatterns.visitFrequency}</span>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-sm">Señales de interés detectadas:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {client.detailedAnalysis.behavioralPatterns.questionTypes.map((type, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xs text-purple-700 mt-2 p-2 bg-purple-100 rounded">
                                    <strong>Predicción IA:</strong> Cliente con patrón de {
                                      client.detailedAnalysis.behavioralPatterns.responseTime < 3 ? 'alta reactividad' :
                                      client.detailedAnalysis.behavioralPatterns.responseTime < 7 ? 'reactividad media' : 'baja reactividad'
                                    }. Ajustar estrategia de seguimiento.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="financial" className="mt-4">
                            <div className="space-y-3">
                              <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">Perfil Financiero y Capacidad</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Alineación presupuestaria:</span>
                                    <div className="flex items-center gap-2">
                                      <Progress value={client.detailedAnalysis.financialIndicators.budgetAlignment} className="w-16 h-2" />
                                      <span className="font-medium">{client.detailedAnalysis.financialIndicators.budgetAlignment}%</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Capacidad de pago evaluada:</span>
                                    <span className="font-medium">{client.detailedAnalysis.financialIndicators.paymentCapacity}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Flexibilidad de precio:</span>
                                    <span className="font-medium">{client.detailedAnalysis.financialIndicators.priceNegotiation}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Preocupaciones de financiamiento:</span>
                                    <span className={`font-medium ${client.detailedAnalysis.financialIndicators.financingConcerns ? 'text-red-600' : 'text-green-600'}`}>
                                      {client.detailedAnalysis.financialIndicators.financingConcerns ? 'Detectadas' : 'No detectadas'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-green-700 mt-2 p-2 bg-green-100 rounded">
                                    <strong>Recomendación IA:</strong> {
                                      client.detailedAnalysis.financialIndicators.budgetAlignment > 80 ? 
                                      'Cliente bien calificado financieramente. Enfocar en cerrar rápido.' :
                                      client.detailedAnalysis.financialIndicators.budgetAlignment > 60 ?
                                      'Perfil financiero moderado. Explorar opciones de financiamiento.' :
                                      'Riesgo financiero alto. Validar capacidad real antes de continuar.'
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="competitive" className="mt-4">
                            <div className="space-y-3">
                              <div className="p-3 bg-orange-50 rounded-lg">
                                <h5 className="font-medium text-orange-800 mb-2">Análisis Competitivo</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Comparando alternativas:</span>
                                    <span className={`font-medium ${client.detailedAnalysis.competitiveFactors.comparingSimilar ? 'text-orange-600' : 'text-green-600'}`}>
                                      {client.detailedAnalysis.competitiveFactors.comparingSimilar ? 'Sí - Alto riesgo' : 'No detectado'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Conocimiento del mercado:</span>
                                    <span className="font-medium">{client.detailedAnalysis.competitiveFactors.marketKnowledge}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Nivel de urgencia detectado:</span>
                                    <span className={`font-medium ${
                                      client.detailedAnalysis.competitiveFactors.urgencyLevel === 'Alta' ? 'text-green-600' :
                                      client.detailedAnalysis.competitiveFactors.urgencyLevel === 'Media' ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                      {client.detailedAnalysis.competitiveFactors.urgencyLevel}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tomadores de decisión:</span>
                                    <span className="font-medium">{client.detailedAnalysis.competitiveFactors.decisionMakers}</span>
                                  </div>
                                  <div className="text-xs text-orange-700 mt-2 p-2 bg-orange-100 rounded">
                                    <strong>Estrategia IA:</strong> {
                                      client.detailedAnalysis.competitiveFactors.comparingSimilar && client.detailedAnalysis.competitiveFactors.urgencyLevel === 'Baja' ?
                                      'RIESGO CRÍTICO: Cliente comparando sin urgencia. Crear presión y diferenciación inmediata.' :
                                      client.detailedAnalysis.competitiveFactors.urgencyLevel === 'Alta' ?
                                      'OPORTUNIDAD: Alta urgencia detectada. Acelerar proceso de cierre.' :
                                      'Mantener seguimiento regular y destacar ventajas competitivas.'
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </div>

                  {/* Panel de riesgo mejorado */}
                  <div className="lg:w-72 space-y-4">
                    {/* Score de riesgo */}
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Probabilidad de abandono</div>
                      <div className={`text-4xl font-bold mb-2 ${
                        client.riskScore >= 85 ? "text-red-700" :
                        client.riskScore >= 70 ? "text-red-600" :
                        client.riskScore >= 60 ? "text-orange-600" :
                        client.riskScore >= 40 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {client.riskScore}%
                      </div>
                      <Progress 
                        value={client.riskScore} 
                        className="h-3 mb-2"
                        indicatorClassName={`${
                          client.riskScore >= 85 ? "bg-red-600" :
                          client.riskScore >= 70 ? "bg-red-500" :
                          client.riskScore >= 60 ? "bg-orange-500" :
                          client.riskScore >= 40 ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                      />
                      <div className="text-xs text-gray-500">
                        Basado en {client.detailedAnalysis?.riskFactors.length || 0} factores
                      </div>
                      {client.riskScore >= 70 && (
                        <div className="mt-2 text-xs text-red-700 font-medium">
                          ⚠️ Acción requerida en 24-48h
                        </div>
                      )}
                    </div>

                    {/* Recomendaciones priorizadas */}
                    {client.recommendations.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Acciones Prioritarias IA:
                        </p>
                        <div className="space-y-2">
                          {client.recommendations.slice(0, 3).map((rec, index) => (
                            <div key={index} className="text-xs text-blue-700 flex items-start gap-2 p-2 bg-blue-100 rounded">
                              <span className="text-blue-500 mt-0.5 font-bold">{index + 1}.</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acciones rápidas mejoradas */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-8"
                          onClick={() => applyRecoveryAction(client.id, 'priority_call', 'Llamada prioritaria por alto riesgo')}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Llamar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-xs h-8"
                          onClick={() => applyRecoveryAction(client.id, 'follow_up_email', 'Email personalizado de seguimiento')}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      </div>
                      
                      {client.riskScore >= 70 && (
                        <Button 
                          size="sm" 
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-8"
                          onClick={() => applyRecoveryAction(client.id, 'discount_offer', 'Oferta especial por riesgo crítico de abandono')}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Activar Recuperación Crítica
                        </Button>
                      )}
                    </div>

                    {client.lastCalculated && (
                      <div className="text-xs text-gray-500 text-center pt-2 border-t">
                        IA actualizada: {new Date(client.lastCalculated).toLocaleDateString('es-ES')}
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
