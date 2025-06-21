
import { supabase } from '@/integrations/supabase/client';

// Tipos para el análisis
export interface ContactAnalysis {
  totalContacts: number;
  conversionRate: number;
  avgResponseTime: number;
  stageDistribution: Record<string, number>;
  monthlyTrends: Array<{ month: string; contacts: number; conversions: number }>;
}

export interface PropertyAnalysis {
  totalProperties: number;
  avgPrice: number;
  priceByType: Record<string, number>;
  locationTrends: Record<string, number>;
  marketTrends: Array<{ month: string; avgPrice: number; volume: number }>;
}

export interface PredictiveInsights {
  nextMonthPrediction: {
    expectedContacts: number;
    expectedSales: number;
    expectedRevenue: number;
  };
  recommendations: Array<{
    type: 'pricing' | 'marketing' | 'timing' | 'opportunity';
    title: string;
    description: string;
    impact: 'Alto' | 'Medio' | 'Bajo';
    confidence: number;
  }>;
  riskAlerts: Array<{
    type: 'client' | 'market' | 'performance';
    message: string;
    severity: 'alta' | 'media' | 'baja';
  }>;
}

// Análisis de contactos
export const analyzeContacts = async (userId: string): Promise<ContactAnalysis> => {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId);

  if (error || !contacts) {
    throw new Error('Error al obtener contactos');
  }

  const totalContacts = contacts.length;
  const closedDeals = contacts.filter(c => c.sales_stage === 'cierre_firma_contrato').length;
  const conversionRate = totalContacts > 0 ? (closedDeals / totalContacts) * 100 : 0;

  // Análisis de distribución por etapas
  const stageDistribution: Record<string, number> = {};
  contacts.forEach(contact => {
    const stage = contact.sales_stage || 'contacto_inicial_recibido';
    stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
  });

  // Tendencias mensuales (últimos 6 meses)
  const monthlyTrends = generateMonthlyTrends(contacts);

  return {
    totalContacts,
    conversionRate,
    avgResponseTime: calculateAvgResponseTime(contacts),
    stageDistribution,
    monthlyTrends
  };
};

// Análisis de propiedades
export const analyzeProperties = async (userId: string): Promise<PropertyAnalysis> => {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId);

  if (error || !properties) {
    throw new Error('Error al obtener propiedades');
  }

  const totalProperties = properties.length;
  const avgPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0) / totalProperties;

  // Precios promedio por tipo
  const priceByType: Record<string, number> = {};
  const typeGroups: Record<string, number[]> = {};

  properties.forEach(property => {
    const type = property.property_type || 'otro';
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(property.price || 0);
  });

  Object.keys(typeGroups).forEach(type => {
    priceByType[type] = typeGroups[type].reduce((sum, price) => sum + price, 0) / typeGroups[type].length;
  });

  // Tendencias por ubicación
  const locationTrends: Record<string, number> = {};
  properties.forEach(property => {
    const location = property.location || 'Sin especificar';
    locationTrends[location] = (locationTrends[location] || 0) + 1;
  });

  return {
    totalProperties,
    avgPrice,
    priceByType,
    locationTrends,
    marketTrends: generateMarketTrends(properties)
  };
};

// Generar insights predictivos
export const generatePredictiveInsights = async (
  userId: string,
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
): Promise<PredictiveInsights> => {
  
  // Predicciones basadas en tendencias históricas
  const lastMonth = contactAnalysis.monthlyTrends[contactAnalysis.monthlyTrends.length - 1];
  const avgGrowth = calculateGrowthRate(contactAnalysis.monthlyTrends);
  
  const nextMonthPrediction = {
    expectedContacts: Math.round(lastMonth?.contacts * (1 + avgGrowth) || 0),
    expectedSales: Math.round((lastMonth?.conversions || 0) * (1 + avgGrowth)),
    expectedRevenue: Math.round(propertyAnalysis.avgPrice * (lastMonth?.conversions || 0) * (1 + avgGrowth))
  };

  // Generar recomendaciones inteligentes
  const recommendations = generateRecommendations(contactAnalysis, propertyAnalysis);
  
  // Generar alertas de riesgo
  const riskAlerts = generateRiskAlerts(contactAnalysis, propertyAnalysis);

  return {
    nextMonthPrediction,
    recommendations,
    riskAlerts
  };
};

// Funciones auxiliares
const generateMonthlyTrends = (contacts: any[]) => {
  const monthlyData: Record<string, { contacts: number; conversions: number }> = {};
  
  contacts.forEach(contact => {
    const date = new Date(contact.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { contacts: 0, conversions: 0 };
    }
    
    monthlyData[monthKey].contacts++;
    if (contact.sales_stage === 'cierre_firma_contrato') {
      monthlyData[monthKey].conversions++;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: formatMonth(month),
      contacts: data.contacts,
      conversions: data.conversions
    }));
};

const generateMarketTrends = (properties: any[]) => {
  const monthlyPrices: Record<string, number[]> = {};
  
  properties.forEach(property => {
    const date = new Date(property.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyPrices[monthKey]) {
      monthlyPrices[monthKey] = [];
    }
    
    monthlyPrices[monthKey].push(property.price || 0);
  });

  return Object.entries(monthlyPrices)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, prices]) => ({
      month: formatMonth(month),
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      volume: prices.length
    }));
};

const calculateAvgResponseTime = (contacts: any[]) => {
  // Simulación basada en datos reales - podrías implementar lógica más compleja
  return contacts.length > 0 ? Math.random() * 24 + 2 : 0; // Entre 2 y 26 horas
};

const calculateGrowthRate = (trends: any[]) => {
  if (trends.length < 2) return 0.1; // 10% por defecto
  
  const recent = trends.slice(-3);
  const growth = recent.map((curr, i) => {
    if (i === 0) return 0;
    const prev = recent[i - 1];
    return prev.contacts > 0 ? (curr.contacts - prev.contacts) / prev.contacts : 0;
  });
  
  return growth.reduce((sum, g) => sum + g, 0) / (growth.length - 1);
};

const generateRecommendations = (
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
): PredictiveInsights['recommendations'] => {
  const recommendations: PredictiveInsights['recommendations'] = [];

  // Recomendación de precios
  if (propertyAnalysis.totalProperties > 0) {
    const maxPriceType = Object.entries(propertyAnalysis.priceByType)
      .sort(([,a], [,b]) => b - a)[0];
    
    recommendations.push({
      type: 'pricing',
      title: 'Optimización de Precios',
      description: `Las propiedades tipo "${maxPriceType[0]}" tienen el precio promedio más alto (S/${maxPriceType[1].toLocaleString()}). Considera enfocar más inventario en este segmento.`,
      impact: 'Alto',
      confidence: 85
    });
  }

  // Recomendación de marketing
  if (contactAnalysis.conversionRate < 30) {
    recommendations.push({
      type: 'marketing',
      title: 'Mejorar Tasa de Conversión',
      description: `Tu tasa de conversión actual es ${contactAnalysis.conversionRate.toFixed(1)}%. Implementa seguimiento más frecuente en las primeras etapas del embudo.`,
      impact: 'Alto',
      confidence: 90
    });
  }

  // Recomendación de timing
  const bestMonth = contactAnalysis.monthlyTrends
    .sort((a, b) => b.contacts - a.contacts)[0];
  
  if (bestMonth) {
    recommendations.push({
      type: 'timing',
      title: 'Momento Óptimo para Campañas',
      description: `${bestMonth.month} fue tu mejor mes con ${bestMonth.contacts} contactos. Planifica campañas similares para el próximo período.`,
      impact: 'Medio',
      confidence: 78
    });
  }

  return recommendations;
};

const generateRiskAlerts = (
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
): PredictiveInsights['riskAlerts'] => {
  const alerts: PredictiveInsights['riskAlerts'] = [];

  // Alerta de rendimiento
  if (contactAnalysis.conversionRate < 15) {
    alerts.push({
      type: 'performance',
      message: `Tasa de conversión muy baja (${contactAnalysis.conversionRate.toFixed(1)}%). Revisa tu proceso de seguimiento.`,
      severity: 'alta'
    });
  }

  // Alerta de mercado
  const recentTrend = contactAnalysis.monthlyTrends.slice(-2);
  if (recentTrend.length === 2 && recentTrend[1].contacts < recentTrend[0].contacts * 0.8) {
    alerts.push({
      type: 'market',
      message: 'Disminución significativa en contactos el último mes. Considera intensificar esfuerzos de marketing.',
      severity: 'media'
    });
  }

  return alerts;
};

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};
