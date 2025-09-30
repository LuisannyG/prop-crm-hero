-- Eliminar la columna user_type de profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_type;

-- Insertar 2 propiedades por cada profile que tenga un usuario real en auth.users
INSERT INTO public.properties (user_id, title, description, address, price, property_type, bedrooms, bathrooms, area_m2, status)
SELECT 
  p.id,
  CASE 
    WHEN random() < 0.5 THEN 'Departamento en ' || (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco'])[floor(random() * 5 + 1)]
    ELSE 'Casa en ' || (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco'])[floor(random() * 5 + 1)]
  END,
  'Excelente propiedad con acabados de primera',
  'Av. ' || (ARRAY['Larco', 'Pardo', 'Benavides', 'Primavera', 'Javier Prado'])[floor(random() * 5 + 1)] || ' ' || floor(random() * 2000 + 100)::text,
  floor(random() * 500000 + 200000),
  (ARRAY['departamento', 'casa'])[floor(random() * 2 + 1)],
  floor(random() * 4 + 1),
  floor(random() * 3 + 1),
  floor(random() * 200 + 50),
  (ARRAY['available', 'sold', 'reserved'])[floor(random() * 3 + 1)]
FROM public.profiles p
INNER JOIN auth.users u ON p.id = u.id
CROSS JOIN generate_series(1, 2);

-- Insertar 2 contactos por cada profile que tenga un usuario real en auth.users
INSERT INTO public.contacts (user_id, full_name, email, phone, address, district, status, client_type, acquisition_source, sales_stage, notes)
SELECT 
  p.id,
  (ARRAY['Carlos Mendoza', 'María García', 'Luis Fernández', 'Ana Torres', 'José Ramírez', 'Carmen Silva', 'Pedro Rojas', 'Julia Vargas', 'Miguel Castillo', 'Rosa Flores'])[floor(random() * 10 + 1)],
  'cliente' || floor(random() * 10000)::text || '@gmail.com',
  '9' || floor(random() * 100000000 + 10000000)::text,
  'Calle ' || (ARRAY['Los Pinos', 'Las Flores', 'San Martín', 'Bolognesi', 'Grau'])[floor(random() * 5 + 1)] || ' ' || floor(random() * 500 + 100)::text,
  (ARRAY['Miraflores', 'San Isidro', 'Surco', 'La Molina', 'Barranco', 'San Borja', 'Magdalena', 'Jesús María', 'Pueblo Libre', 'Lince'])[floor(random() * 10 + 1)],
  (ARRAY['prospect', 'client'])[floor(random() * 2 + 1)],
  (ARRAY['familiar', 'individual', 'negocio', 'empresa', 'inversionista'])[floor(random() * 5 + 1)],
  (ARRAY['tiktok', 'instagram', 'facebook', 'referido', 'google', 'whatsapp'])[floor(random() * 6 + 1)],
  (ARRAY['contacto_inicial_recibido', 'primer_contacto_activo', 'llenado_ficha', 'seguimiento_inicial', 'agendamiento_visitas', 'presentacion_personalizada', 'negociacion'])[floor(random() * 7 + 1)],
  'Cliente interesado en propiedades de la zona'
FROM public.profiles p
INNER JOIN auth.users u ON p.id = u.id
CROSS JOIN generate_series(1, 2);

-- Crear tabla temporal con contactos para recordatorios
WITH recent_contacts AS (
  SELECT c.user_id, c.id, ROW_NUMBER() OVER (PARTITION BY c.user_id ORDER BY c.created_at DESC) as rn
  FROM public.contacts c
  INNER JOIN auth.users u ON c.user_id = u.id
)
INSERT INTO public.reminders (user_id, contact_id, title, description, reminder_date, priority, status)
SELECT 
  rc.user_id,
  rc.id,
  (ARRAY['Llamar para seguimiento', 'Enviar propuesta comercial', 'Coordinar visita a propiedad', 'Revisar documentación', 'Seguimiento post-visita'])[floor(random() * 5 + 1)],
  (ARRAY['Cliente mostró interés en la propiedad, hacer seguimiento', 'Enviar detalles de financiamiento disponible', 'Coordinar horario para mostrar la propiedad'])[floor(random() * 3 + 1)],
  now() + (floor(random() * 30)::text || ' days')::interval,
  (ARRAY['alta', 'media', 'baja'])[floor(random() * 3 + 1)],
  (ARRAY['pendiente', 'completado'])[floor(random() * 2 + 1)]
FROM recent_contacts rc
WHERE rc.rn <= 2;