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
    title: "Aumenta la tasa de cierre hasta 35%",
    description: "Datos de septiembre 2024 confirman mejores resultados con IA predictiva y seguimiento automático."
  },
  {
    title: "Ahorra 8 horas semanales",
    description: "Automatización inteligente reduce tiempo administrativo y maximiza tiempo de venta directa."
  },
  {
    title: "Predicción de riesgo en tiempo real",
    description: "Motor de IA actualizado detecta señales tempranas de abandono con 92% de precisión."
  }
];

export const plans: Plan[] = [
  {
    name: "Plan Gratuito",
    price: "0",
    features: [
      "Hasta 50 contactos",
      "Registro básico de propiedades",
      "Recordatorios manuales",
      "Dashboard básico",
      "Soporte por email"
    ],
    buttonText: "Comenzar Gratis",
    highlighted: false
  },
  {
    name: "Plan Premium",
    price: "75",
    features: [
      "Contactos ilimitados",
      "IA predictiva actualizada Sep 2024",
      "Detección automática de riesgo",
      "Análisis de mercado Lima en tiempo real",
      "Reportes automáticos personalizados",
      "WhatsApp Business integrado",
      "Soporte prioritario 24/7",
      "Backup automático en la nube"
    ],
    buttonText: "Actualizar a Premium",
    highlighted: true
  }
];

export const faqs: FAQ[] = [
  {
    question: "¿Qué es Proptor?",
    answer: "Proptor es un CRM diseñado específicamente para agentes inmobiliarios y pequeñas inmobiliarias peruanas que facilita la gestión de clientes, seguimiento y cierre de ventas."
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
