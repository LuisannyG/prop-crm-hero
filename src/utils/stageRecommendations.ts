
export interface StageRecommendation {
  action: string;
  priority: 'Alta' | 'Media' | 'Baja';
  timeframe: string;
  description?: string;
}

export const getStageSpecificRecommendations = (
  stage: string, 
  riskLevel: 'Alto' | 'Medio' | 'Bajo',
  daysInStage: number,
  lastContactDays: number,
  noPurchaseReasons?: string[]
): StageRecommendation[] => {
  const recommendations: StageRecommendation[] = [];
  const hasNoPurchaseHistory = noPurchaseReasons && noPurchaseReasons.length > 0;
  const hasPriceObjection = noPurchaseReasons?.some(reason => 
    reason.toLowerCase().includes('precio') || reason.toLowerCase().includes('price')
  );
  const hasTimingIssues = noPurchaseReasons?.some(reason => 
    reason.toLowerCase().includes('timing') || reason.toLowerCase().includes('momento')
  );
  const hasLocationConcerns = noPurchaseReasons?.some(reason => 
    reason.toLowerCase().includes('ubicacion') || reason.toLowerCase().includes('location')
  );

  switch (stage) {
    case 'Contacto inicial recibido':
      if (riskLevel === 'Alto') {
        recommendations.push({
          action: 'Contacto inmediato para obtener datos básicos',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El contacto inicial requiere respuesta rápida para no perder el interés'
        });
      }
      recommendations.push({
        action: 'Completar formulario de datos básicos',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Verificar fuente del contacto (landing page/referido)',
        priority: 'Media',
        timeframe: '24 horas'
      });
      break;

    case 'Primer contacto activo':
      if (daysInStage > 3) {
        recommendations.push({
          action: 'Envío urgente de mensaje personalizado',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El primer contacto activo debe realizarse dentro de los primeros 3 días'
        });
      }
      if (hasNoPurchaseHistory) {
        recommendations.push({
          action: 'Abordar objeciones previas en primer mensaje',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Cliente tiene historial de objeciones que deben ser consideradas'
        });
      }
      recommendations.push({
        action: 'Enviar mensaje personalizado con demo',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      break;

    case 'Calificación del prospecto':
      if (daysInStage > 5) {
        recommendations.push({
          action: 'Completar calificación inmediata',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'La calificación debe completarse para avanzar en el proceso'
        });
      }
      if (hasPriceObjection) {
        recommendations.push({
          action: 'Explorar presupuesto y opciones de financiamiento',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Cliente ha tenido objeciones de precio anteriormente'
        });
      }
      recommendations.push({
        action: 'Preguntar sobre cantidad de propiedades gestionadas',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      break;

    case 'Registro y segmentación':
      if (hasLocationConcerns) {
        recommendations.push({
          action: 'Segmentar por preferencias de ubicación específicas',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Cliente ha mostrado sensibilidad a ubicación'
        });
      }
      recommendations.push({
        action: 'Clasificar perfil: independiente vs agencia',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Segmentar por tipo de gestión inmobiliaria',
        priority: 'Media',
        timeframe: '48 horas'
      });
      break;

    case 'Nutrición / Seguimiento inicial':
      if (lastContactDays > 7) {
        recommendations.push({
          action: 'Envío inmediato de contenido útil',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'La nutrición requiere contacto regular para mantener interés'
        });
      }
      if (hasTimingIssues) {
        recommendations.push({
          action: 'Contenido sobre timing óptimo de compra inmobiliaria',
          priority: 'Media',
          timeframe: '3 días',
          description: 'Cliente ha mostrado dudas sobre el momento de compra'
        });
      }
      recommendations.push({
        action: 'Enviar tips de gestión inmobiliaria',
        priority: 'Media',
        timeframe: '3 días'
      });
      break;

    case 'Agendamiento de reunión / demo':
      if (daysInStage > 7) {
        recommendations.push({
          action: 'Insistir en agendamiento de demo',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El agendamiento es crítico para avanzar en el proceso de venta'
        });
      }
      if (hasPriceObjection) {
        recommendations.push({
          action: 'Preparar demo con enfoque en ROI y value proposition',
          priority: 'Alta',
          timeframe: '48 horas',
          description: 'Demostrar valor económico por objeciones previas de precio'
        });
      }
      recommendations.push({
        action: 'Proponer demo semi-funcional',
        priority: 'Alta',
        timeframe: '48 horas'
      });
      break;

    case 'Presentación personalizada':
      if (daysInStage > 5) {
        recommendations.push({
          action: 'Reagendar presentación inmediata',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'La presentación debe realizarse pronto después del agendamiento'
        });
      }
      if (hasNoPurchaseHistory) {
        recommendations.push({
          action: 'Adaptar presentación para abordar objeciones conocidas',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Personalizar demo basado en objeciones históricas'
        });
      }
      recommendations.push({
        action: 'Preparar demo con leads del prospecto',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      break;

    case 'Negociación':
      if (riskLevel === 'Alto') {
        recommendations.push({
          action: 'Ofrecer periodo de prueba gratis inmediato',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'La negociación prolongada requiere incentivos especiales'
        });
      }
      if (hasPriceObjection) {
        recommendations.push({
          action: 'Presentar opciones de pricing flexibles',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Cliente tiene historial de sensibilidad al precio'
        });
      }
      recommendations.push({
        action: 'Proponer plan beta con descuento',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      break;

    case 'Cierre / Firma':
      if (daysInStage > 3) {
        recommendations.push({
          action: 'Facilitar proceso de pago inmediato',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El cierre debe completarse rápidamente para evitar pérdida'
        });
      }
      if (hasNoPurchaseHistory) {
        recommendations.push({
          action: 'Reforzar garantías y política de devolución',
          priority: 'Alta',
          timeframe: '24 horas',
          description: 'Cliente necesita seguridad adicional por historial de dudas'
        });
      }
      recommendations.push({
        action: 'Enviar enlace de pago directo',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      break;

    case 'Postventa y fidelización':
      recommendations.push({
        action: 'Enviar encuesta de satisfacción',
        priority: 'Media',
        timeframe: '1 semana'
      });
      recommendations.push({
        action: 'Solicitar referidos y testimonios',
        priority: 'Media',
        timeframe: '1 mes'
      });
      break;

    default:
      recommendations.push({
        action: 'Contacto de seguimiento general',
        priority: 'Media',
        timeframe: '2-3 días'
      });
      break;
  }

  // Recomendaciones adicionales basadas en riesgo general y motivos de no compra
  if (riskLevel === 'Alto' && lastContactDays > 5) {
    recommendations.unshift({
      action: 'Contacto prioritario por riesgo alto de pérdida',
      priority: 'Alta',
      timeframe: 'Inmediato',
      description: 'Cliente en riesgo alto de pérdida del proceso de venta'
    });
  }

  if (hasNoPurchaseHistory && riskLevel !== 'Alto') {
    recommendations.push({
      action: 'Revisar y abordar objeciones históricas',
      priority: 'Media',
      timeframe: '48 horas',
      description: 'Cliente tiene historial de objeciones que requieren atención'
    });
  }

  return recommendations;
};

export const getStageRiskFactors = (
  stage: string, 
  daysInStage: number, 
  lastContactDays: number,
  noPurchaseReasons?: string[]
): string[] => {
  const factors = [];
  const hasNoPurchaseHistory = noPurchaseReasons && noPurchaseReasons.length > 0;
  
  // Factores basados en motivos de no compra
  if (hasNoPurchaseHistory) {
    factors.push(`Historial de ${noPurchaseReasons!.length} objeción(es) previa(s)`);
    
    const hasPriceObjection = noPurchaseReasons!.some(reason => 
      reason.toLowerCase().includes('precio') || reason.toLowerCase().includes('price')
    );
    if (hasPriceObjection) {
      factors.push('Sensibilidad demostrada al precio');
    }

    const hasTimingIssues = noPurchaseReasons!.some(reason => 
      reason.toLowerCase().includes('timing') || reason.toLowerCase().includes('momento')
    );
    if (hasTimingIssues) {
      factors.push('Dudas sobre timing de compra');
    }
  }
  
  switch (stage) {
    case 'Contacto inicial recibido':
      if (daysInStage > 2) factors.push('Contacto inicial sin respuesta rápida');
      if (lastContactDays > 1) factors.push('Falta de seguimiento inmediato');
      break;
      
    case 'Primer contacto activo':
      if (daysInStage > 3) factors.push('Primer contacto no realizado en tiempo óptimo');
      if (lastContactDays > 2) factors.push('Sin envío de mensaje personalizado');
      break;
      
    case 'Calificación del prospecto':
      if (daysInStage > 5) factors.push('Calificación del prospecto pendiente');
      if (lastContactDays > 3) factors.push('Falta información sobre perfil del cliente');
      break;
      
    case 'Registro y segmentación':
      if (daysInStage > 3) factors.push('Segmentación no completada');
      break;
      
    case 'Nutrición / Seguimiento inicial':
      if (lastContactDays > 7) factors.push('Nutrición interrumpida por mucho tiempo');
      if (daysInStage > 21) factors.push('Proceso de nutrición muy extenso');
      break;
      
    case 'Agendamiento de reunión / demo':
      if (daysInStage > 7) factors.push('Demo no agendada después de nutrición');
      if (lastContactDays > 5) factors.push('Falta insistencia en agendamiento');
      break;
      
    case 'Presentación personalizada':
      if (daysInStage > 5) factors.push('Presentación no realizada oportunamente');
      if (lastContactDays > 3) factors.push('Sin seguimiento post-agendamiento');
      break;
      
    case 'Negociación':
      if (daysInStage > 14) factors.push('Negociación prolongada indica objeciones no resueltas');
      if (lastContactDays > 7) factors.push('Negociación estancada sin comunicación');
      break;
      
    case 'Cierre / Firma':
      if (daysInStage > 3) factors.push('Cierre no completado rápidamente');
      if (lastContactDays > 2) factors.push('Falta facilitar proceso de pago');
      break;
      
    case 'Postventa y fidelización':
      if (lastContactDays > 30) factors.push('Falta de seguimiento post-venta');
      break;
  }
  
  return factors;
};

export const getNoPurchaseRiskAssessment = (noPurchaseReasons: string[]): {
  riskMultiplier: number;
  specificConcerns: string[];
  recoveryStrategy: string;
} => {
  let riskMultiplier = 1.0;
  const specificConcerns: string[] = [];
  let recoveryStrategy = 'Seguimiento estándar';

  if (noPurchaseReasons.length === 0) {
    return { riskMultiplier, specificConcerns, recoveryStrategy };
  }

  // Aumentar riesgo base por tener historial de objeciones
  riskMultiplier += (noPurchaseReasons.length * 0.15);

  const reasonsText = noPurchaseReasons.join(' ').toLowerCase();

  // Análisis de tipos de objeciones
  if (reasonsText.includes('precio') || reasonsText.includes('price')) {
    specificConcerns.push('Sensibilidad al precio');
    riskMultiplier += 0.2;
    recoveryStrategy = 'Enfoque en valor y ROI';
  }

  if (reasonsText.includes('ubicacion') || reasonsText.includes('location')) {
    specificConcerns.push('Preocupaciones de ubicación');
    riskMultiplier += 0.15;
    recoveryStrategy = 'Mostrar opciones alternativas de ubicación';
  }

  if (reasonsText.includes('timing') || reasonsText.includes('momento')) {
    specificConcerns.push('Dudas sobre el momento');
    riskMultiplier += 0.1;
    recoveryStrategy = 'Nutrición prolongada con seguimiento periódico';
  }

  if (reasonsText.includes('financiacion') || reasonsText.includes('financing')) {
    specificConcerns.push('Problemas de financiamiento');
    riskMultiplier += 0.25;
    recoveryStrategy = 'Presentar opciones de financiamiento flexibles';
  }

  if (reasonsText.includes('competencia') || reasonsText.includes('competition')) {
    specificConcerns.push('Considerando competencia');
    riskMultiplier += 0.3;
    recoveryStrategy = 'Diferenciación urgente y propuesta única de valor';
  }

  // Múltiples objeciones aumentan significativamente el riesgo
  if (noPurchaseReasons.length > 2) {
    riskMultiplier += 0.2;
    recoveryStrategy = 'Intervención personalizada urgente';
  }

  return {
    riskMultiplier: Math.min(riskMultiplier, 2.0), // Cap at 2x risk
    specificConcerns,
    recoveryStrategy
  };
};
