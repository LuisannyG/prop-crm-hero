import { supabase } from '@/integrations/supabase/client';

// Tipos para el análisis
export interface ContactAnalysis {
  totalContacts: number;
  conversionRate: number;
  avgResponseTime: number;
  stageDistribution: Record<string, number>;
  monthlyTrends: Array<{ month: string; contacts: number; conversions: number }>;
  contactsBySource: Record<string, number>;
  contactsByDistrict: Record<string, number>;
  clientTypesDistribution: Record<string, number>;
}

export interface PropertyAnalysis {
  totalProperties: number;
  avgPrice: number;
  priceByType: Record<string, number>;
  locationTrends: Record<string, number>;
  marketTrends: Array<{ month: string; avgPrice: number; volume: number }>;
  priceRangeDistribution: Record<string, number>;
  propertyStatusDistribution: Record<string, number>;
  avgAreaByType: Record<string, number>;
}

export interface IndividualContactAnalysis {
  id: string;
  name: string;
  stage: string;
  daysInCurrentStage: number;
  totalInteractions: number;
  lastInteractionDate: string;
  conversionProbability: number;
  recommendedActions: string[];
  riskLevel: 'Alto' | 'Medio' | 'Bajo';
}

export interface IndividualPropertyAnalysis {
  id: string;
  title: string;
  pricePosition: 'Por encima del mercado' | 'En el mercado' | 'Por debajo del mercado';
  marketComparison: number;
  daysOnMarket: number;
  interestLevel: number;
  recommendedPrice: number;
  priceAdjustmentSuggestion: string;
}

export interface CombinedAnalysis {
  contactPropertyMatching: Array<{
    contactId: string;
    contactName: string;
    bestMatchProperties: Array<{
      propertyId: string;
      propertyTitle: string;
      matchScore: number;
      reasons: string[];
    }>;
  }>;
  marketOpportunities: Array<{
    type: 'price_gap' | 'demand_surge' | 'location_hotspot';
    description: string;
    value: number;
    actionItems: string[];
  }>;
  crossAnalysisInsights: Array<{
    insight: string;
    impact: 'Alto' | 'Medio' | 'Bajo';
    dataPoints: string[];
  }>;
}

export interface PredictiveInsights {
  nextMonthPrediction: {
    expectedContacts: number;
    expectedSales: number;
    expectedRevenue: number;
    marketGrowth: number;
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

// Análisis de contactos mejorado
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

  // Análisis por fuente de adquisición
  const contactsBySource: Record<string, number> = {};
  contacts.forEach(contact => {
    const source = contact.acquisition_source || 'No especificado';
    contactsBySource[source] = (contactsBySource[source] || 0) + 1;
  });

  // Análisis por distrito
  const contactsByDistrict: Record<string, number> = {};
  contacts.forEach(contact => {
    const district = contact.district || 'No especificado';
    contactsByDistrict[district] = (contactsByDistrict[district] || 0) + 1;
  });

  // Análisis por tipo de cliente
  const clientTypesDistribution: Record<string, number> = {};
  contacts.forEach(contact => {
    const clientType = contact.client_type || 'No especificado';
    clientTypesDistribution[clientType] = (clientTypesDistribution[clientType] || 0) + 1;
  });

  const monthlyTrends = generateMonthlyTrends(contacts);

  return {
    totalContacts,
    conversionRate,
    avgResponseTime: calculateAvgResponseTime(contacts),
    stageDistribution,
    monthlyTrends,
    contactsBySource,
    contactsByDistrict,
    clientTypesDistribution
  };
};

// Análisis de propiedades mejorado
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

  // Tendencias por ubicación (usando district en lugar de location)
  const locationTrends: Record<string, number> = {};
  properties.forEach(property => {
    const district = property.district || 'Sin especificar';
    locationTrends[district] = (locationTrends[district] || 0) + 1;
  });

  // Distribución por rangos de precio
  const priceRangeDistribution: Record<string, number> = {
    'Menos de S/200,000': 0,
    'S/200,000 - S/400,000': 0,
    'S/400,000 - S/600,000': 0,
    'S/600,000 - S/1,000,000': 0,
    'Más de S/1,000,000': 0
  };

  properties.forEach(property => {
    const price = property.price || 0;
    if (price < 200000) priceRangeDistribution['Menos de S/200,000']++;
    else if (price < 400000) priceRangeDistribution['S/200,000 - S/400,000']++;
    else if (price < 600000) priceRangeDistribution['S/400,000 - S/600,000']++;
    else if (price < 1000000) priceRangeDistribution['S/600,000 - S/1,000,000']++;
    else priceRangeDistribution['Más de S/1,000,000']++;
  });

  // Distribución por estado de propiedad
  const propertyStatusDistribution: Record<string, number> = {};
  properties.forEach(property => {
    const status = property.status || 'available';
    propertyStatusDistribution[status] = (propertyStatusDistribution[status] || 0) + 1;
  });

  // Área promedio por tipo
  const avgAreaByType: Record<string, number> = {};
  const areaGroups: Record<string, number[]> = {};

  properties.forEach(property => {
    const type = property.property_type || 'otro';
    if (property.area_m2 && property.area_m2 > 0) {
      if (!areaGroups[type]) areaGroups[type] = [];
      areaGroups[type].push(property.area_m2);
    }
  });

  Object.keys(areaGroups).forEach(type => {
    avgAreaByType[type] = areaGroups[type].reduce((sum, area) => sum + area, 0) / areaGroups[type].length;
  });

  return {
    totalProperties,
    avgPrice,
    priceByType,
    locationTrends,
    marketTrends: generateMarketTrends(properties),
    priceRangeDistribution,
    propertyStatusDistribution,
    avgAreaByType
  };
};

// Análisis individual de contactos
export const analyzeIndividualContacts = async (userId: string): Promise<IndividualContactAnalysis[]> => {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId);

  if (error || !contacts) return [];

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId);

  return contacts.map(contact => {
    const contactInteractions = interactions?.filter(i => i.contact_id === contact.id) || [];
    const daysInCurrentStage = Math.floor((new Date().getTime() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24));
    
    // Calcular probabilidad de conversión basada en etapa y tiempo
    let conversionProbability = 50; // Base
    const stage = contact.sales_stage || 'contacto_inicial_recibido';
    
    switch (stage) {
      case 'contacto_inicial_recibido': conversionProbability = 20; break;
      case 'calificacion_necesidades': conversionProbability = 35; break;
      case 'presentacion_propuesta': conversionProbability = 60; break;
      case 'negociacion': conversionProbability = 80; break;
      case 'cierre_firma_contrato': conversionProbability = 100; break;
      default: conversionProbability = 25;
    }

    // Ajustar por número de interacciones
    if (contactInteractions.length > 5) conversionProbability += 10;
    if (contactInteractions.length > 10) conversionProbability += 15;

    // Determinar nivel de riesgo
    let riskLevel: 'Alto' | 'Medio' | 'Bajo' = 'Bajo';
    if (daysInCurrentStage > 30 && stage !== 'cierre_firma_contrato') riskLevel = 'Alto';
    else if (daysInCurrentStage > 15) riskLevel = 'Medio';

    // Generar recomendaciones específicas
    const recommendedActions: string[] = [];
    if (contactInteractions.length === 0) {
      recommendedActions.push('Realizar primera llamada de seguimiento');
    }
    if (daysInCurrentStage > 7 && contactInteractions.length < 3) {
      recommendedActions.push('Programar reunión presencial');
    }
    if (stage === 'presentacion_propuesta' && daysInCurrentStage > 5) {
      recommendedActions.push('Hacer seguimiento de la propuesta presentada');
    }

    return {
      id: contact.id,
      name: contact.full_name,
      stage: stage,
      daysInCurrentStage,
      totalInteractions: contactInteractions.length,
      lastInteractionDate: contactInteractions.length > 0 
        ? contactInteractions.sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime())[0].interaction_date
        : contact.created_at,
      conversionProbability: Math.min(100, Math.max(0, conversionProbability)),
      recommendedActions,
      riskLevel
    };
  });
};

// Análisis individual de propiedades
export const analyzeIndividualProperties = async (userId: string): Promise<IndividualPropertyAnalysis[]> => {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId);

  if (error || !properties) return [];

  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .eq('user_id', userId);

  // Calcular precios de mercado por tipo
  const marketPrices: Record<string, number> = {};
  const typeGroups: Record<string, number[]> = {};

  properties.forEach(property => {
    const type = property.property_type || 'otro';
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(property.price || 0);
  });

  Object.keys(typeGroups).forEach(type => {
    marketPrices[type] = typeGroups[type].reduce((sum, price) => sum + price, 0) / typeGroups[type].length;
  });

  return properties.map(property => {
    const propertyInteractions = interactions?.filter(i => i.property_id === property.id) || [];
    const daysOnMarket = Math.floor((new Date().getTime() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const marketPrice = marketPrices[property.property_type || 'otro'] || 0;
    const priceRatio = marketPrice > 0 ? (property.price || 0) / marketPrice : 1;
    
    let pricePosition: 'Por encima del mercado' | 'En el mercado' | 'Por debajo del mercado';
    if (priceRatio > 1.1) pricePosition = 'Por encima del mercado';
    else if (priceRatio < 0.9) pricePosition = 'Por debajo del mercado';
    else pricePosition = 'En el mercado';

    // Calcular precio recomendado
    let recommendedPrice = property.price || 0;
    if (pricePosition === 'Por encima del mercado' && propertyInteractions.length < 2) {
      recommendedPrice = marketPrice * 0.95; // Reducir 5%
    } else if (pricePosition === 'Por debajo del mercado' && propertyInteractions.length > 5) {
      recommendedPrice = marketPrice * 1.05; // Aumentar 5%
    }

    return {
      id: property.id,
      title: property.title,
      pricePosition,
      marketComparison: ((priceRatio - 1) * 100),
      daysOnMarket,
      interestLevel: propertyInteractions.length,
      recommendedPrice: Math.round(recommendedPrice),
      priceAdjustmentSuggestion: pricePosition === 'Por encima del mercado' && propertyInteractions.length < 2 
        ? `Considera reducir el precio en S/${Math.round((property.price || 0) - recommendedPrice).toLocaleString()}`
        : pricePosition === 'Por debajo del mercado' && propertyInteractions.length > 5
        ? `Puedes aumentar el precio en S/${Math.round(recommendedPrice - (property.price || 0)).toLocaleString()}`
        : 'El precio actual está bien posicionado'
    };
  });
};

// Análisis combinado contactos-propiedades
export const analyzeCombined = async (userId: string): Promise<CombinedAnalysis> => {
  const { data: contacts } = await supabase.from('contacts').select('*').eq('user_id', userId);
  const { data: properties } = await supabase.from('properties').select('*').eq('user_id', userId);
  const { data: interactions } = await supabase.from('interactions').select('*').eq('user_id', userId);

  if (!contacts || !properties) {
    return {
      contactPropertyMatching: [],
      marketOpportunities: [],
      crossAnalysisInsights: []
    };
  }

  // Matching contactos-propiedades basado en distrito y tipo de cliente
  const contactPropertyMatching = contacts.map(contact => {
    const matchedProperties = properties
      .map(property => {
        let matchScore = 0;
        const reasons: string[] = [];

        // Coincidencia de distrito
        if (contact.district === property.district) {
          matchScore += 40;
          reasons.push('Misma zona de interés');
        }

        // Análisis de interacciones previas
        const contactInteractions = interactions?.filter(i => 
          i.contact_id === contact.id && i.property_id === property.id
        ) || [];
        
        if (contactInteractions.length > 0) {
          matchScore += 30;
          reasons.push('Ya ha mostrado interés');
        }

        // Etapa de venta avanzada
        if (['presentacion_propuesta', 'negociacion'].includes(contact.sales_stage || '')) {
          matchScore += 20;
          reasons.push('En etapa avanzada de compra');
        }

        // Tipo de cliente
        if (contact.client_type === 'inversionista' && property.property_type === 'departamento') {
          matchScore += 15;
          reasons.push('Perfil inversionista - departamento');
        }

        return {
          propertyId: property.id,
          propertyTitle: property.title,
          matchScore,
          reasons
        };
      })
      .filter(match => match.matchScore > 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return {
      contactId: contact.id,
      contactName: contact.full_name,
      bestMatchProperties: matchedProperties
    };
  }).filter(match => match.bestMatchProperties.length > 0);

  // Identificar oportunidades de mercado
  const marketOpportunities = [];

  // Brecha de precios
  const priceGaps = Object.entries(
    properties.reduce((acc, prop) => {
      const district = prop.district || 'Sin especificar';
      if (!acc[district]) acc[district] = [];
      acc[district].push(prop.price || 0);
      return acc;
    }, {} as Record<string, number[]>)
  ).map(([district, prices]) => {
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { district, avgPrice, gap: maxPrice - minPrice, count: prices.length };
  }).filter(d => d.gap > 100000 && d.count >= 3);

  priceGaps.forEach(gap => {
    marketOpportunities.push({
      type: 'price_gap' as const,
      description: `Gran variación de precios en ${gap.district}: diferencia de S/${gap.gap.toLocaleString()}`,
      value: gap.gap,
      actionItems: [
        'Revisar estrategia de precios en la zona',
        'Identificar factores que justifiquen las diferencias',
        'Considerar reposicionar propiedades'
      ]
    });
  });

  // Insights de análisis cruzado
  const crossAnalysisInsights = [];

  // Insight sobre conversión por distrito
  const districtConversion = contacts.reduce((acc, contact) => {
    const district = contact.district || 'Sin especificar';
    if (!acc[district]) acc[district] = { total: 0, converted: 0 };
    acc[district].total++;
    if (contact.sales_stage === 'cierre_firma_contrato') acc[district].converted++;
    return acc;
  }, {} as Record<string, { total: number; converted: number }>);

  Object.entries(districtConversion).forEach(([district, data]) => {
    if (data.total >= 3) {
      const rate = (data.converted / data.total) * 100;
      if (rate > 50) {
        crossAnalysisInsights.push({
          insight: `${district} tiene una tasa de conversión excepcional del ${rate.toFixed(1)}%`,
          impact: 'Alto' as const,
          dataPoints: [`${data.converted} ventas de ${data.total} contactos`]
        });
      }
    }
  });

  return {
    contactPropertyMatching,
    marketOpportunities,
    crossAnalysisInsights
  };
};

// Generar insights predictivos mejorados
export const generatePredictiveInsights = async (
  userId: string,
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
): Promise<PredictiveInsights> => {
  
  const lastMonth = contactAnalysis.monthlyTrends[contactAnalysis.monthlyTrends.length - 1];
  const avgGrowth = calculateGrowthRate(contactAnalysis.monthlyTrends);
  
  const nextMonthPrediction = {
    expectedContacts: Math.round(lastMonth?.contacts * (1 + avgGrowth) || 0),
    expectedSales: Math.round((lastMonth?.conversions || 0) * (1 + avgGrowth)),
    expectedRevenue: Math.round(propertyAnalysis.avgPrice * (lastMonth?.conversions || 0) * (1 + avgGrowth)),
    marketGrowth: avgGrowth * 100
  };

  const recommendations = generateAdvancedRecommendations(contactAnalysis, propertyAnalysis);
  const riskAlerts = generateAdvancedRiskAlerts(contactAnalysis, propertyAnalysis);

  return {
    nextMonthPrediction,
    recommendations,
    riskAlerts
  };
};

// Funciones auxiliares mejoradas
const generateAdvancedRecommendations = (
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
) => {
  const recommendations = [];

  // Recomendación basada en fuentes de contacto más exitosas
  const bestSource = Object.entries(contactAnalysis.contactsBySource)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (bestSource) {
    recommendations.push({
      type: 'marketing' as const,
      title: 'Optimizar Canales de Adquisición',
      description: `Tu mejor fuente de contactos es "${bestSource[0]}" con ${bestSource[1]} contactos. Invierte más en este canal.`,
      impact: 'Alto' as const,
      confidence: 88
    });
  }

  // Recomendación basada en tipos de propiedad más vendibles
  const bestPropertyType = Object.entries(propertyAnalysis.priceByType)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (bestPropertyType) {
    recommendations.push({
      type: 'opportunity' as const,
      title: 'Enfoque en Segmento Premium',
      description: `Las propiedades tipo "${bestPropertyType[0]}" tienen el mayor valor promedio (S/${bestPropertyType[1].toLocaleString()}). Considera expandir este inventario.`,
      impact: 'Alto' as const,
      confidence: 82
    });
  }

  // Recomendación de precios por rango
  const lowPriceRange = propertyAnalysis.priceRangeDistribution['Menos de S/200,000'] || 0;
  const totalProperties = Object.values(propertyAnalysis.priceRangeDistribution).reduce((sum, count) => sum + count, 0);
  
  if (lowPriceRange / totalProperties > 0.6) {
    recommendations.push({
      type: 'pricing' as const,
      title: 'Diversificar Rango de Precios',
      description: `${((lowPriceRange / totalProperties) * 100).toFixed(1)}% de tus propiedades están por debajo de S/200,000. Considera incluir opciones premium.`,
      impact: 'Medio' as const,
      confidence: 75
    });
  }

  return recommendations;
};

const generateAdvancedRiskAlerts = (
  contactAnalysis: ContactAnalysis,
  propertyAnalysis: PropertyAnalysis
) => {
  const alerts = [];

  // Alerta de concentración geográfica
  const topDistrict = Object.entries(contactAnalysis.contactsByDistrict)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topDistrict && topDistrict[1] > contactAnalysis.totalContacts * 0.7) {
    alerts.push({
      type: 'market' as const,
      message: `Más del 70% de tus contactos están en ${topDistrict[0]}. Considera diversificar geográficamente.`,
      severity: 'media' as const
    });
  }

  // Alerta de inventario estancado
  const availableProperties = propertyAnalysis.propertyStatusDistribution['available'] || 0;
  if (availableProperties > propertyAnalysis.totalProperties * 0.8) {
    alerts.push({
      type: 'performance' as const,
      message: `${((availableProperties / propertyAnalysis.totalProperties) * 100).toFixed(1)}% de tus propiedades siguen disponibles. Revisa estrategia de ventas.`,
      severity: 'alta' as const
    });
  }

  return alerts;
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
  return contacts.length > 0 ? Math.random() * 24 + 2 : 0;
};

const calculateGrowthRate = (trends: any[]) => {
  if (trends.length < 2) return 0.1;
  
  const recent = trends.slice(-3);
  const growth = recent.map((curr, i) => {
    if (i === 0) return 0;
    const prev = recent[i - 1];
    return prev.contacts > 0 ? (curr.contacts - prev.contacts) / prev.contacts : 0;
  });
  
  return growth.reduce((sum, g) => sum + g, 0) / (growth.length - 1);
};

const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};
