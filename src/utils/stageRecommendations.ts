
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
  lastContactDays: number
): StageRecommendation[] => {
  const recommendations: StageRecommendation[] = [];

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
      recommendations.push({
        action: 'Enviar mensaje personalizado con demo',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Compartir resumen de beneficios del CRM',
        priority: 'Media',
        timeframe: '48 horas'
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
      recommendations.push({
        action: 'Preguntar sobre cantidad de propiedades gestionadas',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Consultar herramientas actuales de gestión',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Evaluar disposición a pagar por solución CRM',
        priority: 'Media',
        timeframe: '48 horas'
      });
      break;

    case 'Registro y segmentación':
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
      recommendations.push({
        action: 'Crear etiquetas en base de datos',
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
      recommendations.push({
        action: 'Enviar tips de gestión inmobiliaria',
        priority: 'Media',
        timeframe: '3 días'
      });
      recommendations.push({
        action: 'Compartir casos de éxito de otros agentes',
        priority: 'Media',
        timeframe: '1 semana'
      });
      recommendations.push({
        action: 'Recordatorio vía WhatsApp',
        priority: 'Media',
        timeframe: 'Semanal'
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
      recommendations.push({
        action: 'Proponer demo semi-funcional',
        priority: 'Alta',
        timeframe: '48 horas'
      });
      recommendations.push({
        action: 'Ofrecer acompañamiento en Google Sheet',
        priority: 'Media',
        timeframe: '3 días'
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
      recommendations.push({
        action: 'Preparar demo con leads del prospecto',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Mostrar flujo completo del CRM',
        priority: 'Alta',
        timeframe: 'En la reunión'
      });
      recommendations.push({
        action: 'Explicar beneficios concretos para su negocio',
        priority: 'Media',
        timeframe: 'En la reunión'
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
      recommendations.push({
        action: 'Proponer plan beta con descuento',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Flexibilizar precio de entrada',
        priority: 'Media',
        timeframe: '48 horas'
      });
      recommendations.push({
        action: 'Resolver dudas técnicas pendientes',
        priority: 'Media',
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
      recommendations.push({
        action: 'Enviar enlace de pago directo',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Confirmar registro en lista premium',
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
        action: 'Notificar actualizaciones de funcionalidades',
        priority: 'Baja',
        timeframe: 'Mensual'
      });
      recommendations.push({
        action: 'Invitar a comunidad de usuarios exclusivos',
        priority: 'Media',
        timeframe: '2 semanas'
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

  // Recomendaciones adicionales basadas en riesgo general
  if (riskLevel === 'Alto' && lastContactDays > 5) {
    recommendations.unshift({
      action: 'Contacto prioritario por riesgo alto de pérdida',
      priority: 'Alta',
      timeframe: 'Inmediato',
      description: 'Cliente en riesgo alto de pérdida del proceso de venta'
    });
  }

  return recommendations;
};

export const getStageRiskFactors = (stage: string, daysInStage: number, lastContactDays: number): string[] => {
  const factors = [];
  
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
