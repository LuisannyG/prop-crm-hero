
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
    case 'Prospecto inicial':
    case 'Lead generado':
      if (riskLevel === 'Alto') {
        recommendations.push({
          action: 'Contacto telefónico inmediato',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El prospecto inicial requiere contacto rápido para no perder interés'
        });
      }
      recommendations.push({
        action: 'Enviar información relevante por WhatsApp/Email',
        priority: 'Media',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Programar cita para conocer necesidades',
        priority: 'Media',
        timeframe: '2-3 días'
      });
      break;

    case 'Contacto realizado':
    case 'Primer contacto':
      if (daysInStage > 5) {
        recommendations.push({
          action: 'Seguimiento para agendar visita',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'Mucho tiempo sin avanzar desde el primer contacto'
        });
      }
      recommendations.push({
        action: 'Presentar portafolio de propiedades',
        priority: 'Media',
        timeframe: '1-2 días'
      });
      recommendations.push({
        action: 'Agendar visita a propiedad de interés',
        priority: 'Alta',
        timeframe: '48 horas'
      });
      break;

    case 'Cita agendada':
      if (lastContactDays > 1) {
        recommendations.push({
          action: 'Confirmar asistencia a la cita',
          priority: 'Alta',
          timeframe: 'Hoy'
        });
      }
      recommendations.push({
        action: 'Enviar recordatorio 1 día antes',
        priority: 'Media',
        timeframe: 'Día anterior'
      });
      recommendations.push({
        action: 'Preparar documentación de la propiedad',
        priority: 'Media',
        timeframe: 'Antes de la cita'
      });
      break;

    case 'Visita realizada':
      if (daysInStage > 3) {
        recommendations.push({
          action: 'Contacto inmediato para feedback',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'El seguimiento post-visita es crítico'
        });
      }
      recommendations.push({
        action: 'Llamada para conocer impresiones',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      if (riskLevel !== 'Alto') {
        recommendations.push({
          action: 'Enviar propiedades similares',
          priority: 'Media',
          timeframe: '2-3 días'
        });
      }
      break;

    case 'Interesado':
    case 'Interés confirmado':
      recommendations.push({
        action: 'Presentar opciones de financiamiento',
        priority: 'Alta',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Agendar segunda visita con familia',
        priority: 'Media',
        timeframe: '2-3 días'
      });
      if (daysInStage > 7) {
        recommendations.push({
          action: 'Crear urgencia con oferta limitada',
          priority: 'Alta',
          timeframe: 'Hoy'
        });
      }
      break;

    case 'Negociación':
      if (riskLevel === 'Alto') {
        recommendations.push({
          action: 'Reunión presencial para cerrar objeciones',
          priority: 'Alta',
          timeframe: 'Hoy',
          description: 'Negociación prolongada requiere intervención directa'
        });
      }
      recommendations.push({
        action: 'Flexibilizar condiciones de pago',
        priority: 'Media',
        timeframe: '24 horas'
      });
      recommendations.push({
        action: 'Involucrar al propietario en negociación',
        priority: 'Media',
        timeframe: '48 horas'
      });
      break;

    case 'Propuesta enviada':
      if (daysInStage > 5) {
        recommendations.push({
          action: 'Llamada para revisar propuesta juntos',
          priority: 'Alta',
          timeframe: 'Hoy'
        });
      }
      recommendations.push({
        action: 'Seguimiento cada 2 días',
        priority: 'Media',
        timeframe: 'Continuo'
      });
      break;

    case 'Seguimiento':
      if (lastContactDays > 7) {
        recommendations.push({
          action: 'Reactivar con nueva oportunidad',
          priority: 'Alta',
          timeframe: 'Esta semana'
        });
      }
      recommendations.push({
        action: 'Mantener comunicación mensual',
        priority: 'Baja',
        timeframe: 'Mensual'
      });
      break;

    case 'Cliente perdido':
      recommendations.push({
        action: 'Encuesta de motivos de no compra',
        priority: 'Media',
        timeframe: '1 semana'
      });
      recommendations.push({
        action: 'Mantener en base para futuras oportunidades',
        priority: 'Baja',
        timeframe: 'Trimestral'
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
      action: 'Contacto prioritario por riesgo alto',
      priority: 'Alta',
      timeframe: 'Inmediato',
      description: 'Cliente en riesgo alto de pérdida'
    });
  }

  return recommendations;
};
