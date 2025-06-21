import { supabase } from '@/integrations/supabase/client';

// Distritos de Lima
const limaDistricts = [
  'Miraflores', 'San Isidro', 'Barranco', 'La Molina', 'Surco', 'San Borja',
  'Jesús María', 'Magdalena', 'Pueblo Libre', 'Lince', 'Breña', 'Lima Cercado',
  'Chorrillos', 'Villa El Salvador', 'San Juan de Miraflores', 'Villa María del Triunfo',
  'Los Olivos', 'Comas', 'San Martín de Porres', 'Independencia', 'Rímac',
  'Ate', 'Santa Anita', 'El Agustino', 'Chaclacayo', 'Lurigancho-Chosica',
  'Callao', 'Bellavista', 'La Perla', 'La Punta', 'Ventanilla', 'San Luis',
  'La Victoria'
];

// Nombres peruanos más extensos
const firstNames = [
  // Nombres masculinos
  'Carlos', 'José', 'Luis', 'Jorge', 'Miguel', 'Francisco', 'Manuel', 'Antonio', 'Juan', 'Pedro',
  'Roberto', 'Ricardo', 'Fernando', 'Alberto', 'Raúl', 'Eduardo', 'Alejandro', 'Gabriel', 'Daniel', 'Sergio',
  'Pablo', 'Víctor', 'Óscar', 'Arturo', 'Enrique', 'Marco', 'Diego', 'Andrés', 'Javier', 'Gonzalo',
  'Rafael', 'Emilio', 'Guillermo', 'Augusto', 'Humberto', 'Armando', 'Gerardo', 'César', 'Orlando', 'Alfredo',
  // Nombres femeninos
  'María', 'Ana', 'Carmen', 'Rosa', 'Elena', 'Patricia', 'Lucía', 'Isabel', 'Martha', 'Gloria',
  'Teresa', 'Pilar', 'Adriana', 'Mónica', 'Sandra', 'Beatriz', 'Cecilia', 'Roxana', 'Verónica', 'Gladys',
  'Norma', 'Sonia', 'Esperanza', 'Milagros', 'Yolanda', 'Silvia', 'Doris', 'Nancy', 'Lourdes', 'Vanessa',
  'Karina', 'Paola', 'Giovanna', 'Fiorella', 'Stephanie', 'Jessica', 'Melissa', 'Andrea', 'Claudia', 'Maritza',
  'Liliana', 'Rocío', 'Magaly', 'Elizabeth', 'Katherine', 'Ingrid', 'Vivian', 'Diana', 'Carla', 'Alejandra'
];

const lastNames = [
  'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez',
  'Cruz', 'Flores', 'Vargas', 'Castillo', 'Morales', 'Ortega', 'Delgado', 'Castro',
  'Herrera', 'Ruiz', 'Vega', 'Guerrero', 'Medina', 'Rojas', 'Jiménez', 'Díaz',
  'Torres', 'Aguilar', 'Mendoza', 'Chávez', 'Quispe', 'Mamani', 'Huamán', 'Condori',
  'Apaza', 'Ccahuana', 'Villanueva', 'Espinoza', 'Paredes', 'Ramos', 'Silva',
  'Navarro', 'Moreno', 'Álvarez', 'Romero', 'Gutiérrez', 'Fernández', 'Domínguez',
  'Vásquez', 'Reyes', 'Salazar', 'Contreras', 'Ponce', 'Espejo', 'Córdova', 'Núñez',
  'Tapia', 'Campos', 'Cabrera', 'Acosta', 'Valencia', 'Bermúdez', 'Ochoa', 'Montes',
  'Arévalo', 'Bustamante', 'Cardenas', 'Figueroa', 'Miranda', 'Valverde', 'Velásquez', 'Ayala'
];

// Calles principales de Lima
const streets = [
  'Av. Javier Prado', 'Av. Arequipa', 'Av. Brasil', 'Av. La Marina', 'Av. Universitaria',
  'Av. Tacna', 'Av. Grau', 'Av. Venezuela', 'Av. Colonial', 'Av. Aviación',
  'Jr. de la Unión', 'Jr. Lampa', 'Jr. Camaná', 'Jr. Junín', 'Jr. Huancavelica',
  'Calle Las Begonias', 'Calle Los Eucaliptos', 'Calle Las Camelias', 'Calle Schell',
  'Malecón de la Reserva', 'Malecón Cisneros', 'Av. Petit Thouars', 'Av. Larco',
  'Av. Diagonal', 'Av. El Sol', 'Av. Tomás Marsano', 'Av. Primavera', 'Av. Velasco Astete',
  'Av. Angamos', 'Av. San Luis', 'Av. Salaverry', 'Av. Benavides', 'Av. Comandante Espinar',
  'Calle Porta', 'Calle José González', 'Av. Ricardo Palma', 'Av. República de Panamá',
  'Calle Alcanfores', 'Av. Santa Cruz', 'Calle Berlin', 'Av. Del Ejército'
];

// Tipos de propiedad
const propertyTypes = ['casa', 'departamento', 'oficina', 'local', 'terreno'];

// Etapas de venta disponibles
const salesStages = [
  'contacto_inicial_recibido', 'primer_contacto_activo', 'llenado_ficha', 'seguimiento_inicial',
  'agendamiento_visitas', 'presentacion_personalizada', 'negociacion', 'cierre_firma_contrato',
  'postventa_fidelizacion'
];

// Generar teléfonos únicos
const generateUniquePhone = (usedPhones: Set<string>): string => {
  let phone: string;
  do {
    phone = `9${Math.floor(Math.random() * 90000000) + 10000000}`;
  } while (usedPhones.has(phone));
  usedPhones.add(phone);
  return phone;
};

// Generar emails únicos
const generateUniqueEmail = (firstName: string, lastName: string, usedEmails: Set<string>): string => {
  let email: string;
  let counter = 0;
  do {
    const suffix = counter === 0 ? '' : counter.toString();
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@gmail.com`;
    counter++;
  } while (usedEmails.has(email));
  usedEmails.add(email);
  return email;
};

// Generar nombres únicos
const generateUniqueName = (usedNames: Set<string>): string => {
  let fullName: string;
  do {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    fullName = `${firstName} ${lastName1} ${lastName2}`;
  } while (usedNames.has(fullName));
  usedNames.add(fullName);
  return fullName;
};

// Generar datos de contactos
export const generateContacts = (userId: string) => {
  const contacts = [];
  const usedPhones = new Set<string>();
  const usedEmails = new Set<string>();
  const usedNames = new Set<string>();
  
  for (let i = 0; i < 100; i++) { // Aumentado a 100 contactos
    const fullName = generateUniqueName(usedNames);
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts[0];
    
    const district = limaDistricts[Math.floor(Math.random() * limaDistricts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const phone = generateUniquePhone(usedPhones);
    const email = generateUniqueEmail(firstName, lastName, usedEmails);
    
    contacts.push({
      user_id: userId,
      full_name: fullName,
      email: email,
      phone: phone,
      address: `${street} ${Math.floor(Math.random() * 2000) + 100}`,
      district: district,
      status: ['prospect', 'client'][Math.floor(Math.random() * 2)],
      client_type: ['familiar', 'individual', 'negocio', 'empresa', 'inversionista'][Math.floor(Math.random() * 5)],
      acquisition_source: ['tiktok', 'instagram', 'facebook', 'referido', 'feria-inmobiliaria', 'google', 'whatsapp', 'llamada-fria', 'sitio-web', 'otro'][Math.floor(Math.random() * 10)],
      sales_stage: salesStages[Math.floor(Math.random() * salesStages.length)],
      notes: [
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
      ][Math.floor(Math.random() * 12)]
    });
  }
  
  return contacts;
};

// Generar datos de propiedades
export const generateProperties = (userId: string) => {
  const properties = [];
  
  for (let i = 0; i < 50; i++) {
    const district = limaDistricts[Math.floor(Math.random() * limaDistricts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const bedrooms = propertyType === 'departamento' || propertyType === 'casa' ? Math.floor(Math.random() * 4) + 1 : null;
    const bathrooms = propertyType === 'departamento' || propertyType === 'casa' ? Math.floor(Math.random() * 3) + 1 : null;
    const area = Math.floor(Math.random() * 300) + 50;
    
    let priceRange;
    switch (district) {
      case 'San Isidro':
      case 'Miraflores':
      case 'La Molina':
        priceRange = [800000, 2000000];
        break;
      case 'Surco':
      case 'San Borja':
      case 'Jesús María':
        priceRange = [500000, 1500000];
        break;
      default:
        priceRange = [200000, 800000];
    }
    
    const price = Math.floor(Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]);
    
    properties.push({
      user_id: userId,
      title: `${propertyType === 'casa' ? 'Casa' : 
               propertyType === 'departamento' ? 'Departamento' : 
               propertyType === 'oficina' ? 'Oficina' : 
               propertyType === 'local' ? 'Local Comercial' : 'Terreno'} en ${district}`,
      description: `Excelente ${propertyType} ubicado en ${district}, Lima. ${
        bedrooms ? `${bedrooms} dormitorios, ` : ''
      }${bathrooms ? `${bathrooms} baños, ` : ''}${area}m² de área construida.`,
      address: `${street} ${Math.floor(Math.random() * 2000) + 100}, ${district}, Lima`,
      price: price,
      property_type: propertyType,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area_m2: area,
      status: ['available', 'sold', 'reserved'][Math.floor(Math.random() * 3)]
    });
  }
  
  return properties;
};

// Generar datos de recordatorios
export const generateReminders = (userId: string, contactIds: string[]) => {
  const reminders = [];
  const reminderTitles = [
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
  
  const descriptions = [
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
  
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 60) - 30);
    
    reminders.push({
      user_id: userId,
      contact_id: contactIds[Math.floor(Math.random() * contactIds.length)],
      title: reminderTitles[Math.floor(Math.random() * reminderTitles.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      reminder_date: randomDate.toISOString(),
      priority: ['alta', 'media', 'baja'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.7 ? 'completado' : 'pendiente'
    });
  }
  
  return reminders;
};

// Función principal para sembrar datos
export const seedDatabase = async (userId: string) => {
  try {
    console.log('Iniciando inserción de datos de prueba...');
    
    // Insertar contactos
    const contactsData = generateContacts(userId);
    const { data: insertedContacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(contactsData)
      .select('id');
    
    if (contactsError) throw contactsError;
    console.log('Contactos insertados:', insertedContacts?.length);
    
    // Insertar propiedades
    const propertiesData = generateProperties(userId);
    const { error: propertiesError } = await supabase
      .from('properties')
      .insert(propertiesData);
    
    if (propertiesError) throw propertiesError;
    console.log('Propiedades insertadas:', propertiesData.length);
    
    // Insertar recordatorios
    const contactIds = insertedContacts?.map(c => c.id) || [];
    const remindersData = generateReminders(userId, contactIds);
    const { error: remindersError } = await supabase
      .from('reminders')
      .insert(remindersData);
    
    if (remindersError) throw remindersError;
    console.log('Recordatorios insertados:', remindersData.length);
    
    return {
      success: true,
      message: 'Datos de prueba insertados correctamente',
      stats: {
        contacts: contactsData.length,
        properties: propertiesData.length,
        reminders: remindersData.length
      }
    };
    
  } catch (error) {
    console.error('Error al insertar datos:', error);
    return {
      success: false,
      error: error,
      message: 'Error al insertar datos de prueba'
    };
  }
};
