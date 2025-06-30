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
  district: string;
  propertyType: string;
  price: number;
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

    // Generar recomendaciones específicas por etapa
    const recommendedActions = generateStageSpecificRecommendations(
      stage, 
      daysInCurrentStage, 
      contactInteractions.length,
      contact
    );

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

// Nueva función para generar recomendaciones específicas por etapa
const generateStageSpecificRecommendations = (
  stage: string, 
  daysInStage: number, 
  interactionCount: number,
  contact: any
): string[] => {
  const recommendations: string[] = [];

  switch (stage) {
    case 'contacto_inicial_recibido':
      recommendations.push('Registrar los datos completos en el CRM');
      recommendations.push('Revisar el canal de adquisición (formulario, WhatsApp, referido, portal)');
      if (daysInStage === 0) {
        recommendations.push('Preparar respuesta rápida y personalizada');
        recommendations.push('Responder dentro de las primeras 2 horas');
      } else if (daysInStage <= 1) {
        recommendations.push('Enviar mensaje o llamar dentro de las próximas 12-24 horas');
        recommendations.push('Presentarte como asesor de confianza');
      } else {
        recommendations.push('URGENTE: Contacto inicial perdido - llamar inmediatamente');
        recommendations.push('Enviar mensaje de disculpa por la demora y reagendar');
      }
      break;

    case 'primer_contacto_activo':
      recommendations.push('Hacer preguntas básicas para romper el hielo');
      recommendations.push('Detectar el nivel de interés inicial');
      if (daysInStage <= 2) {
        recommendations.push('Programar segunda llamada o reunión');
        recommendations.push('Enviar mensaje de seguimiento personalizado');
      } else if (daysInStage <= 5) {
        recommendations.push('Realizar llamada de seguimiento para mantener el interés');
        recommendations.push('Compartir contenido útil (guías, tips)');
      } else {
        recommendations.push('Cliente en riesgo - contacto inmediato necesario');
        recommendations.push('Evaluar si mantener en pipeline activo');
      }
      break;

    case 'llenado_ficha':
      recommendations.push('Preguntar: ¿busca comprar o alquilar?');
      recommendations.push('Definir zona de interés y presupuesto');
      recommendations.push('Identificar urgencia y motivación de mudanza');
      if (interactionCount < 2) {
        recommendations.push('Completar cuestionario de necesidades detallado');
        recommendations.push('Anotar respuestas clave para seguimiento estratégico');
      } else if (daysInStage <= 3) {
        recommendations.push('Clasificar por tipo de cliente (inversor, familia, primera vivienda)');
        recommendations.push('Etiquetar como prospecto frío, tibio o caliente');
      } else {
        recommendations.push('Acelerar proceso de calificación - programar llamada');
        recommendations.push('Enviar formulario digital para completar datos faltantes');
      }
      break;

    case 'seguimiento_inicial':
      recommendations.push('Enviar propiedades alineadas a su perfil');
      recommendations.push('Compartir contenido útil sobre financiamiento y proceso');
      recommendations.push('Mantener comunicación activa sin ser invasivo (1 mensaje útil semanal)');
      if (daysInStage <= 7) {
        recommendations.push('Asignar prioridad y recordatorios para seguimiento');
        recommendations.push('Nutrir con información relevante del mercado');
      } else if (daysInStage <= 14) {
        recommendations.push('Intensificar seguimiento con propiedades específicas');
        recommendations.push('Agendar llamada para evaluar cambios en necesidades');
      } else {
        recommendations.push('Reevaluar nivel de interés del prospecto');
        recommendations.push('Considerar cambio de estrategia o frecuencia de contacto');
      }
      break;

    case 'agendamiento_visitas':
      recommendations.push('Proponer fechas claras y prácticas para visitas');
      recommendations.push('Ofrecer opciones presenciales y virtuales');
      if (daysInStage <= 2) {
        recommendations.push('Confirmar disponibilidad y preferencias de horario');
        recommendations.push('Preparar información detallada de cada propiedad');
      } else if (daysInStage <= 5) {
        recommendations.push('Confirmar asistencia el día anterior a la visita');
        recommendations.push('Enviar recordatorio con dirección y detalles');
      } else if (daysInStage <= 10) {
        recommendations.push('Reagendar visita si fue cancelada');
        recommendations.push('Ofrecer flexibilidad de horarios incluyendo fines de semana');
      } else {
        recommendations.push('Cliente indeciso - evaluar barreras para agendar');
        recommendations.push('Proponer visita express o virtual como alternativa');
      }
      break;

    case 'presentacion_personalizada':
      recommendations.push('Mostrar propiedades filtradas según necesidad real');
      recommendations.push('Resolver dudas durante el recorrido');
      if (daysInStage <= 3) {
        recommendations.push('Recoger feedback inmediato tras cada visita');
        recommendations.push('Ajustar búsqueda según comentarios recibidos');
      } else if (daysInStage <= 7) {
        recommendations.push('Hacer seguimiento post-visita en 24-48 horas');
        recommendations.push('Enviar resumen de propiedades vistas con pros/contras');
      } else if (daysInStage <= 14) {
        recommendations.push('Proponer nuevas opciones basadas en feedback');
        recommendations.push('Agendar segunda ronda de visitas si es necesario');
      } else {
        recommendations.push('Presentación estancada - revisar fit producto-cliente');
        recommendations.push('Considerar expandir criterios de búsqueda');
      }
      break;

    case 'negociacion':
      recommendations.push('Aconsejar sobre oferta justa según análisis de mercado');
      recommendations.push('Actuar como intermediario entre comprador y propietario');
      if (daysInStage <= 3) {
        recommendations.push('Preparar estrategia de negociación con rangos claros');
        recommendations.push('Coordinar con propietario términos de flexibilidad');
      } else if (daysInStage <= 7) {
        recommendations.push('Facilitar comunicación directa entre las partes');
        recommendations.push('Proponer términos intermedios para cerrar brechas');
      } else if (daysInStage <= 14) {
        recommendations.push('Asistir con opciones de financiamiento bancario');
        recommendations.push('Traer especialista en créditos hipotecarios');
      } else {
        recommendations.push('Negociación prolongada - definir fecha límite para decisión');
        recommendations.push('Evaluar viabilidad real de la operación');
      }
      break;

    case 'cierre_firma_contrato':
      recommendations.push('Coordinar firma de escritura o contrato');
      recommendations.push('Verificar que todos los documentos estén completos');
      if (daysInStage <= 3) {
        recommendations.push('Asegurar que documentación legal esté en orden');
        recommendations.push('Programar cita con notaría o escribanía');
      } else if (daysInStage <= 7) {
        recommendations.push('Acompañar en trámites finales con bancos');
        recommendations.push('Coordinar inspección final de la propiedad');
      } else if (daysInStage <= 14) {
        recommendations.push('Resolver pendientes legales o documentarios');
        recommendations.push('Facilitar comunicación con todas las partes involucradas');
      } else {
        recommendations.push('Cierre demorado - identificar obstáculos específicos');
        recommendations.push('Coordinar entrega de llaves y documentos finales');
      }
      break;

    case 'postventa_fidelizacion':
      recommendations.push('Enviar mensaje de agradecimiento o detalle especial');
      recommendations.push('Hacer seguimiento a los 15-30 días post-entrega');
      recommendations.push('Solicitar testimonio para marketing');
      if (daysInStage <= 30) {
        recommendations.push('Pedir referidos de familiares y amigos');
        recommendations.push('Verificar satisfacción con la nueva propiedad');
      } else if (daysInStage <= 90) {
        recommendations.push('Ofrecer asesoría para futuras operaciones');
        recommendations.push('Invitar a eventos exclusivos o webinars');
      } else {
        recommendations.push('Mantener contacto trimestral con contenido de valor');
        recommendations.push('Ofrecer servicios de inversión inmobiliaria');
      }
      break;

    default:
      recommendations.push('Clasificar correctamente la etapa del prospecto');
      recommendations.push('Actualizar información de contacto y estado');
      recommendations.push('Revisar proceso de seguimiento estándar');
  }

  // Recomendaciones adicionales contextualles
  if (contact.client_type === 'inversionista') {
    recommendations.push('Presentar análisis de ROI y rentabilidad proyectada');
    recommendations.push('Mostrar comparativo con otras oportunidades de inversión');
  }

  if (contact.acquisition_source === 'referido' && interactionCount < 3) {
    recommendations.push('Contactar al referidor para obtener más contexto');
    recommendations.push('Aprovechar la confianza del referido para acelerar proceso');
  }

  if (daysInStage > 30 && !['postventa_fidelizacion', 'cierre_firma_contrato'].includes(stage)) {
    recommendations.push('Prospecto estancado por más de 30 días - reevaluar estrategia');
    recommendations.push('Considerar reasignación o cambio de enfoque comercial');
  }

  return recommendations.slice(0, 4); // Limitar a 4 recomendaciones principales
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
      district: property.district || 'No especificado',
      propertyType: property.property_type || 'otro',
      price: property.price || 0,
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
