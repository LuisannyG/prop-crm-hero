
// Tipos de propiedad
export const propertyTypes = ['casa', 'departamento', 'oficina', 'local', 'terreno'];

// Etapas de venta disponibles
export const salesStages = [
  'contacto_inicial_recibido', 'primer_contacto_activo', 'llenado_ficha', 'seguimiento_inicial',
  'agendamiento_visitas', 'presentacion_personalizada', 'negociacion', 'cierre_firma_contrato',
  'postventa_fidelizacion'
];

// Notas predefinidas para contactos
export const contactNotes = [
  'Interesado en propiedades en zona residencial',
  'Cliente potencial con buen presupuesto',
  'Busca departamento para inversión',
  'Interesado en casas familiares',
  'Cliente referido por conocido',
  'Busca oficina para negocio',
  'Interesado en terrenos para construcción',
  'Cliente serio con capacidad de compra',
  'Necesita crédito hipotecario',
  'Busca propiedad para alquiler',
  'Interesado en zona comercial',
  'Cliente con urgencia de mudanza'
];

// Títulos de recordatorios
export const reminderTitles = [
  'Llamar para seguimiento',
  'Enviar propuesta comercial',
  'Coordinar visita a propiedad',
  'Revisar documentación',
  'Seguimiento post-visita',
  'Negociar precio final',
  'Programar firma de contrato',
  'Entregar llaves',
  'Verificar referencias crediticias',
  'Coordinar tasación',
  'Realizar inspección técnica',
  'Contactar para renovación',
  'Enviar cotización actualizada',
  'Confirmar disponibilidad financiera'
];

// Descripciones de recordatorios
export const reminderDescriptions = [
  'Cliente mostró interés en la propiedad, hacer seguimiento',
  'Enviar detalles de financiamiento disponible',
  'Coordinar horario para mostrar la propiedad',
  'Revisar y validar documentos del cliente',
  'Contactar después de la visita para conocer impresión',
  'Discutir términos finales de la negociación',
  'Preparar contrato y coordinar firma',
  'Hacer entrega formal de la propiedad',
  'Validar solvencia económica del cliente',
  'Programar tasación profesional',
  'Revisar estado técnico de la propiedad',
  'Cliente con contrato próximo a vencer',
  'Actualizar precios según mercado actual',
  'Confirmar capacidad de pago del cliente'
];

// Configuración de cantidad de datos a generar
export const SEED_CONFIG = {
  CONTACTS_COUNT: 150,
  PROPERTIES_COUNT: 75,
  REMINDERS_COUNT: 100
};
