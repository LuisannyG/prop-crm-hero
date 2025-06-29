
export const getStageSpecificRecommendations = (
  stage: string, 
  riskScore: number, 
  daysInStage: number,
  lastContactDays: number
): string[] => {
  const recommendations: string[] = [];
  
  switch (stage) {
    case 'contacto_inicial_recibido':
      if (riskScore >= 70) {
        recommendations.push('Contactar en las próximas 2 horas - cliente reciente');
        recommendations.push('Enviar mensaje de bienvenida personalizado');
      } else {
        recommendations.push('Realizar primera llamada dentro de 24h');
        recommendations.push('Enviar información básica de la empresa');
      }
      break;

    case 'primer_contacto_activo':
      if (riskScore >= 70) {
        recommendations.push('Agendar cita presencial urgente');
        recommendations.push('Ofrecer incentivo por respuesta rápida');
      } else {
        recommendations.push('Programar segunda llamada de seguimiento');
        recommendations.push('Enviar catálogo de propiedades relevantes');
      }
      break;

    case 'llenado_ficha':
      if (daysInStage > 7) {
        recommendations.push('Simplificar proceso de llenado de ficha');
        recommendations.push('Ofrecer completar ficha por teléfono');
      }
      recommendations.push('Recordar importancia de la ficha para mejores recomendaciones');
      break;

    case 'seguimiento_inicial':
      if (riskScore >= 60) {
        recommendations.push('Intensificar seguimiento - llamadas diarias');
        recommendations.push('Proporcionar testimonios de clientes satisfechos');
      } else {
        recommendations.push('Mantener contacto cada 2-3 días');
        recommendations.push('Compartir novedades del mercado');
      }
      break;

    case 'agendamiento_visitas':
      if (riskScore >= 70) {
        recommendations.push('Ofrecer múltiples horarios flexibles');
        recommendations.push('Considerar visita virtual como alternativa');
        recommendations.push('Asignar agente senior para la visita');
      } else {
        recommendations.push('Confirmar visita 24h antes');
        recommendations.push('Preparar información específica de la propiedad');
      }
      break;

    case 'presentacion_personalizada':
      if (riskScore >= 60) {
        recommendations.push('Focalizarse en beneficios específicos del cliente');
        recommendations.push('Ofrecer condiciones especiales de financiamiento');
        recommendations.push('Incluir comparativas con otras opciones');
      } else {
        recommendations.push('Preparar presentación detallada');
        recommendations.push('Incluir proyecciones de valorización');
      }
      break;

    case 'negociacion':
      if (riskScore >= 80) {
        recommendations.push('Escalar a gerente de ventas');
        recommendations.push('Ofrecer descuento por cierre inmediato');
        recommendations.push('Flexibilizar condiciones de pago');
      } else if (riskScore >= 60) {
        recommendations.push('Acelerar proceso de aprobación');
        recommendations.push('Ofrecer beneficios adicionales');
      } else {
        recommendations.push('Mantener negociación activa');
        recommendations.push('Documentar todos los acuerdos');
      }
      break;

    case 'cierre_firma_contrato':
      if (riskScore >= 70) {
        recommendations.push('Contacto diario hasta firma');
        recommendations.push('Asistir con trámites pendientes');
        recommendations.push('Ofrecer firma en ubicación conveniente');
      } else {
        recommendations.push('Confirmar fecha de firma');
        recommendations.push('Preparar documentación completa');
      }
      break;

    case 'postventa_fidelizacion':
      recommendations.push('Programar seguimiento post-entrega');
      recommendations.push('Solicitar referidos y testimonios');
      recommendations.push('Mantener contacto para futuras oportunidades');
      break;

    default:
      recommendations.push('Establecer contacto regular');
      recommendations.push('Definir siguiente paso en el proceso');
  }

  // Recomendaciones adicionales basadas en días sin contacto
  if (lastContactDays > 14) {
    recommendations.unshift('URGENTE: Reestablecer contacto - más de 2 semanas sin comunicación');
  } else if (lastContactDays > 7) {
    recommendations.unshift('Prioritario: Contactar esta semana');
  }

  return recommendations;
};

export const getStageDisplayName = (stage: string): string => {
  const stageNames = {
    'contacto_inicial_recibido': 'Contacto inicial recibido',
    'primer_contacto_activo': 'Primer contacto activo',
    'llenado_ficha': 'Llenado de ficha',
    'seguimiento_inicial': 'Seguimiento inicial',
    'agendamiento_visitas': 'Agendamiento de visitas',
    'presentacion_personalizada': 'Presentación personalizada',
    'negociacion': 'Negociación',
    'cierre_firma_contrato': 'Cierre / Firma de contrato',
    'postventa_fidelizacion': 'Postventa y fidelización'
  };
  
  return stageNames[stage as keyof typeof stageNames] || stage.replace(/_/g, ' ');
};
