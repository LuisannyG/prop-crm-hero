
import { Calendar, ChartBar, FileText, FileUser, Brain, BadgeInfo } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface Plan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

export interface Testimonial {
  name: string;
  position: string;
  content: string;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const features: Feature[] = [
  {
    title: "Agenda Inteligente",
    icon: Calendar,
    description: "Recordatorios automáticos para dar seguimiento a tus leads. Notificaciones según prioridad, tiempo sin contacto y etapa del proceso."
  },
  {
    title: "Panel de Control",
    icon: ChartBar,
    description: "Segmentación de clientes por tipo. Clasificación por nivel de intención de compra. Visualización por etapa del embudo."
  },
  {
    title: "Registro de Motivos de No Compra",
    icon: FileText,
    description: "Formulario interno con opciones seleccionables y campo de texto libre. Documenta razones de pérdida."
  },
  {
    title: "Reportes Automáticos",
    icon: ChartBar,
    description: "Para pequeñas inmobiliarias: desempeño del equipo. Para agentes independientes: rendimiento por canal."
  },
  {
    title: "Ficha de Cliente Integrada",
    icon: FileUser,
    description: "Datos básicos: nombre, contacto, tipo de propiedad buscada. Subida de archivos: DNI, ficha técnica, imágenes."
  },
  {
    title: "Motor de Aprendizaje",
    icon: Brain,
    description: "La app analiza datos históricos para detectar patrones de comportamiento. Aprende con cada registro y mejora sus predicciones."
  },
  {
    title: "Detección de Riesgo de No Compra",
    icon: BadgeInfo,
    description: "Considera interacción previa, tiempo sin respuesta y etapa actual en el proceso de venta."
  }
];

export const benefits: Benefit[] = [
  {
    title: "Aumenta la tasa de cierre",
    description: "Mejora tus resultados con seguimiento constante y organizado."
  },
  {
    title: "Menos olvidos, más oportunidades",
    description: "Nunca pierdas una oportunidad de venta por falta de seguimiento."
  },
  {
    title: "Todo tu proceso organizado",
    description: "Centraliza toda tu información de ventas en un solo lugar."
  }
];

export const plans: Plan[] = [
  {
    name: "Plan Gratuito",
    price: "0€",
    features: ["Ficha de cliente", "Panel básico", "Agenda básica"],
    buttonText: "Empieza ahora",
    highlighted: false
  },
  {
    name: "Plan Premium",
    price: "29€",
    features: ["Todo lo del plan gratuito", "Reportes automáticos", "Motor de aprendizaje", "Detección de riesgo"],
    buttonText: "Ver precios",
    highlighted: true
  }
];

export const testimonials: Testimonial[] = [
  {
    name: "María Rodríguez",
    position: "Agente Independiente",
    content: "Desde que uso Proptor he aumentado mis ventas en un 30%. La agenda inteligente me permite dar seguimiento a más clientes sin olvidar ninguno.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Carlos Méndez",
    position: "Director de Inmobiliaria",
    content: "Proptor ha transformado cómo gestionamos nuestros leads. El panel de control nos da visibilidad total sobre nuestro pipeline.",
    avatar: "/placeholder.svg"
  },
  {
    name: "Laura Sánchez",
    position: "Agente Senior",
    content: "Los reportes automáticos me permiten identificar qué canales me traen los mejores clientes. Una herramienta imprescindible.",
    avatar: "/placeholder.svg"
  }
];

export const faqs: FAQ[] = [
  {
    question: "¿Qué es Proptor?",
    answer: "Proptor es un CRM diseñado específicamente para agentes inmobiliarios y pequeñas inmobiliarias que facilita la gestión de clientes, seguimiento y cierre de ventas."
  },
  {
    question: "¿Necesito conocimientos técnicos para usar Proptor?",
    answer: "No, Proptor está diseñado para ser intuitivo y fácil de usar. No requiere conocimientos técnicos especiales."
  },
  {
    question: "¿Puedo probar Proptor antes de pagar?",
    answer: "Sí, ofrecemos un plan gratuito con funcionalidades básicas para que puedas probar la plataforma sin compromiso."
  },
  {
    question: "¿Cómo puedo solicitar una demo?",
    answer: "Puedes solicitar una demo personalizada a través de nuestro formulario de contacto o haciendo clic en 'Solicita una demo'."
  },
  {
    question: "¿Puedo migrar mis datos desde otro CRM?",
    answer: "Sí, ofrecemos asistencia para migrar tus datos desde otros sistemas al contratar el plan premium."
  }
];
