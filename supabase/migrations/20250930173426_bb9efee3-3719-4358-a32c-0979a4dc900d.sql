-- Agregar 100 propiedades para Luisanny Gabriela Perdomo Contreras
WITH luisanny_user AS (
  SELECT id FROM public.profiles WHERE full_name = 'Luisanny Gabriela Perdomo Contreras' LIMIT 1
)
INSERT INTO public.properties (user_id, title, description, address, price, property_type, bedrooms, bathrooms, area_m2, status)
SELECT 
  lu.id,
  CASE 
    WHEN random() < 0.33 THEN 'Departamento en ' || (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'San Borja', 'Magdalena', 'Jesús María', 'Pueblo Libre', 'Lince'])[floor(random() * 10 + 1)]
    WHEN random() < 0.66 THEN 'Casa en ' || (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'San Borja', 'Magdalena', 'Jesús María', 'Pueblo Libre', 'Lince'])[floor(random() * 10 + 1)]
    ELSE 'Oficina en ' || (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'San Borja', 'Magdalena', 'Jesús María', 'Pueblo Libre', 'Lince'])[floor(random() * 10 + 1)]
  END,
  'Excelente propiedad con acabados de primera, lista para mudarse',
  'Av. ' || (ARRAY['Larco', 'Pardo', 'Benavides', 'Primavera', 'Javier Prado', 'Arequipa', 'La Marina', 'Salaverry', 'Angamos', 'Petit Thouars'])[floor(random() * 10 + 1)] || ' ' || floor(random() * 2000 + 100)::text,
  floor(random() * 800000 + 150000),
  (ARRAY['departamento', 'casa', 'oficina', 'local', 'terreno'])[floor(random() * 5 + 1)],
  floor(random() * 5 + 1),
  floor(random() * 4 + 1),
  floor(random() * 250 + 40),
  (ARRAY['available', 'sold', 'reserved'])[floor(random() * 3 + 1)]
FROM luisanny_user lu
CROSS JOIN generate_series(1, 100);

-- Agregar 100 contactos para Luisanny Gabriela Perdomo Contreras
WITH luisanny_user AS (
  SELECT id FROM public.profiles WHERE full_name = 'Luisanny Gabriela Perdomo Contreras' LIMIT 1
)
INSERT INTO public.contacts (user_id, full_name, email, phone, address, district, status, client_type, acquisition_source, sales_stage, notes)
SELECT 
  lu.id,
  (ARRAY[
    'Carlos Mendoza Ruiz', 'María García López', 'Luis Fernández Torres', 'Ana Torres Silva', 'José Ramírez Castillo',
    'Carmen Silva Rojas', 'Pedro Rojas Vargas', 'Julia Vargas Flores', 'Miguel Castillo Pérez', 'Rosa Flores Díaz',
    'Alberto Sánchez Cruz', 'Laura Martínez Vega', 'Ricardo González Mora', 'Patricia Díaz Ramos', 'Fernando López Castro',
    'Gabriela Herrera Núñez', 'Diego Romero Gutiérrez', 'Sofía Castro Mendoza', 'Andrés Vega Paredes', 'Valentina Núñez Salazar',
    'Roberto Gutiérrez Morales', 'Carolina Morales Jiménez', 'Javier Paredes Ortiz', 'Natalia Jiménez Campos', 'Emilio Ortiz Rivera',
    'Isabel Campos Soto', 'Martín Rivera Aguilar', 'Lucía Soto Medina', 'Pablo Aguilar Ríos', 'Elena Medina Herrera'
  ])[floor(random() * 30 + 1)] || ' ' || floor(random() * 1000)::text,
  'contacto' || floor(random() * 100000)::text || '@' || (ARRAY['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'])[floor(random() * 4 + 1)],
  '9' || floor(random() * 100000000 + 10000000)::text,
  'Calle ' || (ARRAY['Los Pinos', 'Las Flores', 'San Martín', 'Bolognesi', 'Grau', 'Libertad', 'Comercio', 'Unión', 'Progreso', 'Independencia'])[floor(random() * 10 + 1)] || ' ' || floor(random() * 800 + 100)::text,
  (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'San Borja', 'Magdalena', 'Jesús María', 'Pueblo Libre', 'Lince', 'San Miguel', 'Callao', 'Chorrillos', 'Villa El Salvador'])[floor(random() * 14 + 1)],
  (ARRAY['prospect', 'client'])[floor(random() * 2 + 1)],
  (ARRAY['familiar', 'individual', 'negocio', 'empresa', 'inversionista'])[floor(random() * 5 + 1)],
  (ARRAY['tiktok', 'instagram', 'facebook', 'referido', 'feria-inmobiliaria', 'google', 'whatsapp', 'llamada-fria', 'sitio-web'])[floor(random() * 9 + 1)],
  (ARRAY['contacto_inicial_recibido', 'primer_contacto_activo', 'llenado_ficha', 'seguimiento_inicial', 'agendamiento_visitas', 'presentacion_personalizada', 'negociacion', 'cierre_firma_contrato'])[floor(random() * 8 + 1)],
  (ARRAY[
    'Cliente interesado en propiedades de la zona',
    'Busca invertir en bienes raíces',
    'Contacto referido, muy interesado',
    'Primera vivienda, necesita asesoría',
    'Cliente corporativo con alto presupuesto',
    'Busca propiedad para alquiler',
    'Interesado en zona residencial exclusiva'
  ])[floor(random() * 7 + 1)]
FROM luisanny_user lu
CROSS JOIN generate_series(1, 100);

-- Agregar 100 recordatorios vinculados a los contactos de Luisanny
WITH luisanny_contacts AS (
  SELECT c.id as contact_id, c.user_id
  FROM public.contacts c
  INNER JOIN public.profiles p ON c.user_id = p.id
  WHERE p.full_name = 'Luisanny Gabriela Perdomo Contreras'
  ORDER BY c.created_at DESC
  LIMIT 100
)
INSERT INTO public.reminders (user_id, contact_id, title, description, reminder_date, priority, status)
SELECT 
  lc.user_id,
  lc.contact_id,
  (ARRAY[
    'Llamar para seguimiento',
    'Enviar propuesta comercial',
    'Coordinar visita a propiedad',
    'Revisar documentación',
    'Seguimiento post-visita',
    'Negociar precio final',
    'Programar firma de contrato',
    'Verificar referencias crediticias',
    'Coordinar tasación',
    'Enviar cotización actualizada',
    'Confirmar disponibilidad financiera',
    'Programar segunda visita',
    'Enviar información adicional',
    'Revisar avance del crédito'
  ])[floor(random() * 14 + 1)],
  (ARRAY[
    'Cliente mostró interés en la propiedad, hacer seguimiento inmediato',
    'Enviar detalles de financiamiento disponible y opciones de crédito',
    'Coordinar horario para mostrar la propiedad en persona',
    'Revisar y validar documentos del cliente para el proceso',
    'Contactar después de la visita para conocer su impresión',
    'Discutir términos finales de la negociación y cerrar',
    'Cliente solicitó información adicional sobre la zona'
  ])[floor(random() * 7 + 1)],
  now() + (floor(random() * 45)::text || ' days')::interval,
  (ARRAY['alta', 'media', 'baja'])[floor(random() * 3 + 1)],
  (ARRAY['pendiente', 'completado'])[floor(random() * 2 + 1)]
FROM luisanny_contacts lc;