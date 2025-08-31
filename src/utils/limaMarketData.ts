
// Datos proyectados del mercado inmobiliario de Lima para septiembre 2025
export const limaMarketTrends = {
  monthlyData: [
    { month: 'Ene 2025', contacts: 215, conversions: 52, avgPrice: 350000, marketActivity: 'Muy Alta' },
    { month: 'Feb 2025', contacts: 228, conversions: 58, avgPrice: 360000, marketActivity: 'Muy Alta' },
    { month: 'Mar 2025', contacts: 245, conversions: 65, avgPrice: 375000, marketActivity: 'Excepcional' },
    { month: 'Abr 2025', contacts: 232, conversions: 55, avgPrice: 365000, marketActivity: 'Muy Alta' },
    { month: 'May 2025', contacts: 198, conversions: 42, avgPrice: 340000, marketActivity: 'Alta' },
    { month: 'Jun 2025', contacts: 267, conversions: 71, avgPrice: 385000, marketActivity: 'Excepcional' },
    { month: 'Jul 2025', contacts: 278, conversions: 75, avgPrice: 395000, marketActivity: 'Excepcional' },
    { month: 'Ago 2025', contacts: 189, conversions: 38, avgPrice: 355000, marketActivity: 'Media' },
    { month: 'Sep 2025', contacts: 289, conversions: 82, avgPrice: 410000, marketActivity: 'Excepcional' },
    { month: 'Oct 2025', contacts: 265, conversions: 68, avgPrice: 400000, marketActivity: 'Muy Alta' },
    { month: 'Nov 2025', contacts: 295, conversions: 85, avgPrice: 420000, marketActivity: 'Excepcional' },
    { month: 'Dic 2025', contacts: 245, conversions: 58, avgPrice: 390000, marketActivity: 'Alta' }
  ],
  
  districtTrends: {
    'Miraflores': { demand: 'Excepcional', priceGrowth: 12.8, avgPrice: 620000 },
    'San Isidro': { demand: 'Excepcional', priceGrowth: 11.5, avgPrice: 705000 },
    'Surco': { demand: 'Muy Alta', priceGrowth: 10.2, avgPrice: 510000 },
    'La Molina': { demand: 'Muy Alta', priceGrowth: 9.1, avgPrice: 565000 },
    'Barranco': { demand: 'Excepcional', priceGrowth: 13.5, avgPrice: 550000 },
    'San Borja': { demand: 'Muy Alta', priceGrowth: 8.8, avgPrice: 480000 },
    'Jesús María': { demand: 'Alta', priceGrowth: 7.2, avgPrice: 385000 },
    'Pueblo Libre': { demand: 'Alta', priceGrowth: 6.5, avgPrice: 345000 }
  },

  seasonalPatterns: [
    { 
      months: [0], 
      activity: 0.9, 
      description: 'Inicio de año, demanda moderada' 
    },
    { 
      months: [1], 
      activity: 1.1, 
      description: 'Incremento por bonos de gratificación' 
    },
    { 
      months: [2], 
      activity: 1.3, 
      description: 'Pico de actividad pre-escolar' 
    },
    { 
      months: [3], 
      activity: 0.8, 
      description: 'Descenso post-Semana Santa' 
    },
    { 
      months: [4], 
      activity: 0.9, 
      description: 'Mes del trabajo, actividad estable' 
    },
    { 
      months: [5], 
      activity: 1.2, 
      description: 'Pico por bonos de medio año' 
    },
    { 
      months: [6], 
      activity: 0.7, 
      description: 'Vacaciones, menor actividad' 
    },
    { 
      months: [7], 
      activity: 0.8, 
      description: 'Regreso de vacaciones, repunte' 
    },
    { 
      months: [8], 
      activity: 1.0, 
      description: 'Actividad escolar, estabilidad' 
    },
    { 
      months: [9], 
      activity: 1.1, 
      description: 'Preparación fin de año' 
    },
    { 
      months: [10], 
      activity: 1.4, 
      description: 'Pico pre-navideño, bonos' 
    },
    { 
      months: [11], 
      activity: 0.8, 
      description: 'Descenso por fiestas' 
    }
  ],

  marketTrends: {
    priceGrowth: 0.068,
    demandGrowth: 0.12,
    averageTimeToSell: 45
  },

  districtActivity: [
    { district: 'Miraflores', activity: 1.5 },
    { district: 'San Isidro', activity: 1.4 },
    { district: 'Barranco', activity: 1.3 },
    { district: 'Surco', activity: 1.2 },
    { district: 'La Molina', activity: 1.1 }
  ]
};

export const getLimaMarketData = () => {
  return limaMarketTrends;
};

export const getRiskExplanation = (riskScore: number, factors: string[]) => {
  const explanations = {
    highRisk: {
      title: "Riesgo Crítico (80%+)",
      description: "El cliente tiene alta probabilidad de abandonar el proceso de compra",
      commonFactors: [
        "Más de 14 días sin contacto",
        "Baja frecuencia de comunicación",
        "Estancamiento prolongado en una etapa",
        "Objeciones de precio no resueltas",
        "Falta de seguimiento post-visita"
      ]
    },
    mediumRisk: {
      title: "Riesgo Moderado (40-79%)",
      description: "El cliente muestra señales de desinterés que requieren atención",
      commonFactors: [
        "7-14 días sin contacto",
        "Respuestas menos frecuentes",
        "Dudas sobre financiamiento",
        "Comparando con otras opciones",
        "Proceso de decisión lento"
      ]
    },
    lowRisk: {
      title: "Riesgo Bajo (<40%)",
      description: "El cliente mantiene buen engagement y probabilidad de conversión",
      commonFactors: [
        "Comunicación regular y fluida",
        "Progreso constante en el embudo",
        "Interés activo en visitas",
        "Consultas específicas sobre financiamiento",
        "Referencias positivas del agente"
      ]
    }
  };

  if (riskScore >= 80) return explanations.highRisk;
  if (riskScore >= 40) return explanations.mediumRisk;
  return explanations.lowRisk;
};
