export interface StageRecommendation {
  priority: 'alta' | 'media' | 'baja';
  action: string;
  reason: string;
  timeframe: string;
}

export interface StageRiskFactor {
  factor: string;
  weight: number;
}

export const SALES_STAGES = [
  {
    id: 'prospecto',
    name: 'Prospecto',
    description: 'Cliente potencial que ha mostrado interés inicial',
    order: 1,
    color: '#1E3A8A',
    bgColor: '#EFF2F7'
  },
  {
    id: 'contacto_inicial',
    name: 'Contacto Inicial',
    description: 'Primer acercamiento y recolección de información básica',
    order: 2,
    color: '#3B82F6',
    bgColor: '#DBEAFE'
  },
  {
    id: 'necesidades_descubiertas',
    name: 'Necesidades Descubiertas',
    description: 'Comprensión detallada de las necesidades del cliente',
    order: 3,
    color: '#0EA5E9',
    bgColor: '#CFFAFE'
  },
  {
    id: 'presentacion_propuesta',
    name: 'Presentación de Propuesta',
    description: 'Presentación formal de la propuesta de valor',
    order: 4,
    color: '#10B981',
    bgColor: '#D1FAE5'
  },
  {
    id: 'gestion_objeciones',
    name: 'Gestión de Objeciones',
    description: 'Manejo de inquietudes y objeciones del cliente',
    order: 5,
    color: '#84CC16',
    bgColor: '#ECFCCB'
  },
  {
    id: 'negociacion',
    name: 'Negociación',
    description: 'Ajuste de términos y condiciones para cerrar el acuerdo',
    order: 6,
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  {
    id: 'cierre',
    name: 'Cierre',
    description: 'Acuerdo final y firma del contrato',
    order: 7,
    color: '#6D28D9',
    bgColor: '#EDE9FE'
  },
  {
    id: 'seguimiento_postventa',
    name: 'Seguimiento Postventa',
    description: 'Asegurar la satisfacción del cliente después de la venta',
    order: 8,
    color: '#9CA3AF',
    bgColor: '#F3F4F6'
  },
  {
    id: 'cliente',
    name: 'Cliente',
    description: 'Cliente recurrente',
    order: 9,
    color: '#059669',
    bgColor: '#D1FAE5'
  },
   {
    id: 'no_compra',
    name: 'No Compra',
    description: 'Cliente que decidió no comprar por motivos específicos',
    order: 11,
    color: '#6B7280',
    bgColor: '#F3F4F6'
  }
];

export const getStageRiskFactors = (salesStage: string): StageRiskFactor[] => {
  switch (salesStage) {
    case 'prospecto':
      return [
        { factor: 'Falta de información de contacto', weight: 0.6 },
        { factor: 'Interacción inicial no concluyente', weight: 0.4 },
      ];
    case 'contacto_inicial':
      return [
        { factor: 'Dificultad para establecer comunicación', weight: 0.5 },
        { factor: 'Información de necesidades incompleta', weight: 0.5 },
      ];
    case 'necesidades_descubiertas':
      return [
        { factor: 'Necesidades no alineadas con la oferta', weight: 0.7 },
        { factor: 'Falta de urgencia en las necesidades', weight: 0.3 },
      ];
    case 'presentacion_propuesta':
      return [
        { factor: 'Propuesta no adaptada a las necesidades', weight: 0.6 },
        { factor: 'Falta de claridad en el valor ofrecido', weight: 0.4 },
      ];
    case 'gestion_objeciones':
      return [
        { factor: 'Objeciones no resueltas satisfactoriamente', weight: 0.8 },
        { factor: 'Aparición de nuevas objeciones', weight: 0.2 },
      ];
    case 'negociacion':
      return [
        { factor: 'Desacuerdo en términos clave (precio, plazos)', weight: 0.7 },
        { factor: 'Falta de flexibilidad en la negociación', weight: 0.3 },
      ];
    case 'cierre':
      return [
        { factor: 'Retraso en la firma del contrato', weight: 0.6 },
        { factor: 'Dudas de último momento', weight: 0.4 },
      ];
    case 'seguimiento_postventa':
      return [
        { factor: 'Falta de comunicación proactiva', weight: 0.5 },
        { factor: 'Problemas no resueltos post-venta', weight: 0.5 },
      ];
    default:
      return [];
  }
};

export const getNoPurchaseRiskAssessment = (noPurchaseReasons: string[]) => {
  let riskMultiplier = 1;
  const specificConcerns: string[] = [];
  let recoveryStrategy = 'Sin estrategia de recuperación definida';

  if (noPurchaseReasons.length > 0) {
    if (noPurchaseReasons.some(reason => reason.toLowerCase().includes('precio'))) {
      riskMultiplier *= 1.2;
      specificConcerns.push('Sensibilidad al precio');
      recoveryStrategy = 'Ofrecer alternativas de menor costo o planes de financiamiento';
    }
    if (noPurchaseReasons.some(reason => reason.toLowerCase().includes('ubicación'))) {
      riskMultiplier *= 1.1;
      specificConcerns.push('Problemas de ubicación');
      recoveryStrategy = 'Presentar propiedades con mejor ubicación o destacar ventajas de la ubicación actual';
    }
    if (noPurchaseReasons.some(reason => reason.toLowerCase().includes('tamaño'))) {
      riskMultiplier *= 1.15;
      specificConcerns.push('Inconformidad con el tamaño');
      recoveryStrategy = 'Mostrar opciones con diferentes distribuciones o tamaños';
    }
    if (noPurchaseReasons.some(reason => reason.toLowerCase().includes('financiación'))) {
      riskMultiplier *= 1.25;
      specificConcerns.push('Dificultades de financiación');
      recoveryStrategy = 'Asesorar sobre opciones de crédito o planes de pago';
    }
  }

  return {
    riskMultiplier,
    specificConcerns,
    recoveryStrategy
  };
};

export const getStageSpecificRecommendations = (
  salesStage: string,
  riskLevel: string,
  weeksSinceLastContact: number,
  daysSinceLastContact: number,
  noPurchaseReasons?: string[]
): StageRecommendation[] => {
  const hasNoPurchaseHistory = noPurchaseReasons && noPurchaseReasons.length > 0;
  
  switch (salesStage) {
    case 'prospecto':
      return [
        {
          priority: 'alta',
          action: 'Establecer contacto inicial dentro de 24 horas',
          reason: 'Maximizar el interés inicial',
          timeframe: 'Inmediato'
        },
        {
          priority: 'media',
          action: 'Recopilar información clave sobre sus necesidades',
          reason: 'Personalizar el seguimiento',
          timeframe: '3 días'
        },
        {
          priority: 'baja',
          action: 'Enviar material informativo relevante',
          reason: 'Mantener el interés y proporcionar valor',
          timeframe: '7 días'
        }
      ];
    case 'contacto_inicial':
      return [
        {
          priority: 'alta',
          action: 'Confirmar y ampliar la información de contacto',
          reason: 'Asegurar la comunicación efectiva',
          timeframe: '2 días'
        },
        {
          priority: 'media',
          action: 'Investigar sus necesidades y motivaciones',
          reason: 'Preparar una propuesta personalizada',
          timeframe: '5 días'
        },
        {
          priority: 'baja',
          action: 'Ofrecer una consulta gratuita',
          reason: 'Aumentar el compromiso',
          timeframe: '10 días'
        }
      ];
    case 'necesidades_descubiertas':
      return [
        {
          priority: 'alta',
          action: 'Validar y priorizar sus necesidades clave',
          reason: 'Asegurar la alineación con la oferta',
          timeframe: '3 días'
        },
        {
          priority: 'media',
          action: 'Desarrollar una propuesta de valor adaptada',
          reason: 'Mostrar cómo se satisfacen sus necesidades',
          timeframe: '7 días'
        },
        {
          priority: 'baja',
          action: 'Presentar casos de éxito similares',
          reason: 'Generar confianza y credibilidad',
          timeframe: '14 días'
        }
      ];
    case 'presentacion_propuesta':
      return [
        {
          priority: 'alta',
          action: 'Programar una reunión de seguimiento para discutir la propuesta',
          reason: 'Resolver dudas y objeciones',
          timeframe: '3 días'
        },
        {
          priority: 'media',
          action: 'Ajustar la propuesta según el feedback inicial',
          reason: 'Maximizar la aceptación',
          timeframe: '7 días'
        },
        {
          priority: 'baja',
          action: 'Enviar información adicional relevante',
          reason: 'Reforzar el valor de la propuesta',
          timeframe: '14 días'
        }
      ];
    case 'gestion_objeciones':
      return [
        {
          priority: 'alta',
          action: 'Identificar y abordar las objeciones clave',
          reason: 'Superar las barreras para el cierre',
          timeframe: '3 días'
        },
        {
          priority: 'media',
          action: 'Ofrecer soluciones creativas y alternativas',
          reason: 'Mostrar flexibilidad y compromiso',
          timeframe: '7 días'
        },
        {
          priority: 'baja',
          action: 'Proporcionar testimonios y garantías',
          reason: 'Generar confianza y reducir el riesgo percibido',
          timeframe: '14 días'
        }
      ];
    case 'negociacion':
      return [
        {
          priority: 'alta',
          action: 'Definir los límites de la negociación',
          reason: 'Asegurar un acuerdo beneficioso',
          timeframe: '2 días'
        },
        {
          priority: 'media',
          action: 'Buscar puntos en común y concesiones mutuas',
          reason: 'Facilitar el acuerdo',
          timeframe: '5 días'
        },
        {
          priority: 'baja',
          action: 'Documentar los términos acordados',
          reason: 'Evitar malentendidos',
          timeframe: '7 días'
        }
      ];
    case 'cierre':
      return [
        {
          priority: 'alta',
          action: 'Confirmar todos los detalles del acuerdo',
          reason: 'Evitar sorpresas de último momento',
          timeframe: '1 día'
        },
        {
          priority: 'media',
          action: 'Facilitar la firma del contrato',
          reason: 'Acelerar el proceso',
          timeframe: '3 días'
        },
        {
          priority: 'baja',
          action: 'Celebrar el acuerdo y agradecer la confianza',
          reason: 'Fortalecer la relación',
          timeframe: '5 días'
        }
      ];
    case 'seguimiento_postventa':
      return [
        {
          priority: 'alta',
          action: 'Realizar una llamada de seguimiento inicial',
          reason: 'Asegurar la satisfacción',
          timeframe: '3 días'
        },
        {
          priority: 'media',
          action: 'Solicitar feedback y testimonios',
          reason: 'Mejorar la oferta y generar referencias',
          timeframe: '14 días'
        },
        {
          priority: 'baja',
          action: 'Ofrecer soporte continuo y recursos adicionales',
          reason: 'Fidelizar al cliente',
          timeframe: 'Mensual'
        }
      ];
    
    case 'no_compra':
      if (hasNoPurchaseHistory) {
        const priceRelated = noPurchaseReasons?.some(reason => reason.toLowerCase().includes('precio'));
        const timingRelated = noPurchaseReasons?.some(reason => reason.toLowerCase().includes('timing') || reason.toLowerCase().includes('momento'));
        
        if (priceRelated) {
          return [
            {
              priority: 'media',
              action: 'Revisar si hay nuevas ofertas o descuentos disponibles',
              reason: 'Cliente rechazó por precio anteriormente',
              timeframe: '3-6 meses'
            },
            {
              priority: 'baja',
              action: 'Enviar información sobre propiedades en rango de precio mencionado',
              reason: 'Conoces su presupuesto objetivo',
              timeframe: 'Mensual'
            }
          ];
        }
        
        if (timingRelated) {
          return [
            {
              priority: 'media',
              action: 'Programar seguimiento trimestral para evaluar cambio de situación',
              reason: 'Timing puede cambiar con el tiempo',
              timeframe: '3 meses'
            },
            {
              priority: 'baja',
              action: 'Mantener en base de datos para ofertas especiales',
              reason: 'Puede reconsiderar en futuro',
              timeframe: 'Según disponibilidad'
            }
          ];
        }
      }
      
      return [
        {
          priority: 'baja',
          action: 'Mantener en base de nurturing con contenido de valor',
          reason: 'Cliente ya expresó desinterés, mantener relación a largo plazo',
          timeframe: 'Mensual'
        },
        {
          priority: 'baja',
          action: 'Incluir en campañas de nuevos proyectos o ofertas especiales',
          reason: 'Circunstancias pueden cambiar',
          timeframe: 'Según disponibilidad'
        }
      ];

    default:
      return [];
  }
};
