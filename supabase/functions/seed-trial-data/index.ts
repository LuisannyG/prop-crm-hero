import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Datos base de Perú (Lima)
const limaDistricts = [
  'Miraflores','San Isidro','Surco','San Borja','La Molina','Jesús María','Pueblo Libre','Magdalena','Barranco','Lince'
];
const streets = [
  'Av. Arequipa','Av. Javier Prado','Av. La Molina','Av. Benavides','Av. Brasil','Av. Angamos','Av. Pardo','Av. Primavera','Av. Salaverry','Av. Petit Thouars'
];
const firstNames = ['Diego','María','José','Lucía','Carlos','Ana','Luis','Sofía','Jorge','Camila'];
const lastNames = ['García','Fernández','Rojas','Torres','Ramírez','Flores','Gonzales','Castillo','Díaz','Chávez'];
const propertyTypes = ['casa','departamento','oficina','local','terreno'];
const salesStages = [
  'contacto_inicial_recibido','primer_contacto_activo','llenado_ficha','seguimiento_inicial',
  'agendamiento_visitas','presentacion_personalizada','negociacion','cierre_firma_contrato','postventa_fidelizacion'
];
const reminderTitles = [
  'Llamar para seguimiento','Enviar propuesta comercial','Coordinar visita a propiedad','Revisar documentación','Seguimiento post-visita'
];
const reminderDescriptions = [
  'Cliente mostró interés en la propiedad, hacer seguimiento',
  'Enviar detalles de financiamiento disponible',
  'Coordinar horario para mostrar la propiedad',
  'Revisar y validar documentos del cliente',
  'Contactar después de la visita para conocer impresión'
];

function getPriceRangeByDistrict(district: string): [number, number] {
  switch (district) {
    case 'San Isidro':
    case 'Miraflores':
    case 'La Molina':
      return [800000, 2000000];
    case 'Surco':
    case 'San Borja':
    case 'Jesús María':
      return [500000, 1500000];
    default:
      return [200000, 800000];
  }
}

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateUniquePhone(used: Set<string>): string {
  let phone = '';
  do { phone = `9${Math.floor(Math.random() * 90000000) + 10000000}`; } while (used.has(phone));
  used.add(phone);
  return phone;
}

function generateUniqueName(used: Set<string>): string {
  let full = '';
  do {
    full = `${randomItem(firstNames)} ${randomItem(lastNames)} ${randomItem(lastNames)}`;
  } while (used.has(full));
  used.add(full);
  return full;
}

function generateUniqueEmail(first: string, last: string, used: Set<string>): string {
  let email = '';
  let i = 0;
  do {
    const suffix = i === 0 ? '' : i.toString();
    email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@gmail.com`;
    i++;
  } while (used.has(email));
  used.add(email);
  return email;
}

function randomDate(daysRange = 60): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysRange) - daysRange / 2);
  return d.toISOString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Obtener usuarios de prueba desde trial_experiment (usuario1..usuario6)
    const { data: trialUsers, error: trialErr } = await supabaseAdmin
      .from('trial_experiment')
      .select('user_id, email, trial_group')
      .in('email', [
        'usuario1@gmail.com','usuario2@gmail.com','usuario3@gmail.com',
        'usuario4@gmail.com','usuario5@gmail.com','usuario6@gmail.com'
      ]);

    if (trialErr) throw trialErr;

    const results: any[] = [];

    for (const u of trialUsers || []) {
      if (!u.user_id) {
        results.push({ email: u.email, status: 'skipped', reason: 'user_id missing' });
        continue;
      }

      // Limpiar datos previos del usuario
      await supabaseAdmin.from('reminders').delete().eq('user_id', u.user_id);
      await supabaseAdmin.from('contacts').delete().eq('user_id', u.user_id);
      await supabaseAdmin.from('properties').delete().eq('user_id', u.user_id);

      // Generar 5 contactos únicos por usuario
      const usedPhones = new Set<string>();
      const usedEmails = new Set<string>();
      const usedNames = new Set<string>();
      const contacts = Array.from({ length: 5 }).map(() => {
        const fullName = generateUniqueName(usedNames);
        const [first, ...rest] = fullName.split(' ');
        const last = rest[0] || 'Perez';
        const district = randomItem(limaDistricts);
        const street = randomItem(streets);
        const phone = generateUniquePhone(usedPhones);
        const email = generateUniqueEmail(first, last, usedEmails);
        return {
          user_id: u.user_id,
          full_name: fullName,
          email,
          phone,
          address: `${street} ${Math.floor(Math.random() * 2000) + 100}`,
          district,
          status: ['prospect', 'client'][Math.floor(Math.random() * 2)],
          client_type: ['familiar','individual','negocio','empresa','inversionista'][Math.floor(Math.random() * 5)],
          acquisition_source: ['tiktok','instagram','facebook','referido','feria-inmobiliaria','google','whatsapp','llamada-fria','sitio-web','otro'][Math.floor(Math.random() * 10)],
          sales_stage: randomItem(salesStages),
          notes: 'Contacto generado para prueba - Perú'
        };
      });

      const { data: insertedContacts, error: contactsError } = await supabaseAdmin
        .from('contacts')
        .insert(contacts)
        .select('id');

      if (contactsError) throw contactsError;

      // Generar 5 propiedades por usuario
      const properties = Array.from({ length: 5 }).map(() => {
        const district = randomItem(limaDistricts);
        const street = randomItem(streets);
        const type = randomItem(propertyTypes);
        const bedrooms = (type === 'departamento' || type === 'casa') ? Math.floor(Math.random() * 4) + 1 : null as any;
        const bathrooms = (type === 'departamento' || type === 'casa') ? Math.floor(Math.random() * 3) + 1 : null as any;
        const area = Math.floor(Math.random() * 300) + 50;
        const [minP, maxP] = getPriceRangeByDistrict(district);
        const price = Math.floor(Math.random() * (maxP - minP) + minP);
        const typeLabel = type === 'casa' ? 'Casa' : type === 'departamento' ? 'Departamento' : type === 'oficina' ? 'Oficina' : type === 'local' ? 'Local Comercial' : 'Terreno';
        return {
          user_id: u.user_id,
          title: `${typeLabel} en ${district}`,
          description: `Excelente ${type} ubicado en ${district}, Lima. ${bedrooms ? `${bedrooms} dormitorios, ` : ''}${bathrooms ? `${bathrooms} baños, ` : ''}${area}m² de área construida.`,
          address: `${street} ${Math.floor(Math.random() * 2000) + 100}, ${district}, Lima`,
          price,
          property_type: type,
          bedrooms,
          bathrooms,
          area_m2: area,
          status: ['available','sold','reserved'][Math.floor(Math.random() * 3)] as any,
          district
        };
      });

      const { error: propertiesError } = await supabaseAdmin.from('properties').insert(properties);
      if (propertiesError) throw propertiesError;

      // Generar 5 recordatorios
      const contactIds = (insertedContacts || []).map((c: any) => c.id);
      const reminders = Array.from({ length: 5 }).map(() => ({
        user_id: u.user_id,
        contact_id: randomItem(contactIds),
        title: randomItem(reminderTitles),
        description: randomItem(reminderDescriptions),
        reminder_date: randomDate(),
        priority: ['alta','media','baja'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.7 ? 'completado' : 'pendiente'
      }));

      const { error: remindersError } = await supabaseAdmin.from('reminders').insert(reminders);
      if (remindersError) throw remindersError;

      results.push({ email: u.email, user_id: u.user_id, contacts: contacts.length, properties: properties.length, reminders: reminders.length });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error en seed-trial-data:', error);
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});