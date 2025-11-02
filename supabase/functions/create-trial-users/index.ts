import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Crear cliente de Supabase con service role key para operaciones admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Lista de usuarios de prueba a crear
    const trialUsers = [
      { email: "usuario1@gmail.com", password: "123456", plan_trial: "1d", name: "Usuario1" },
      { email: "usuario2@gmail.com", password: "123456", plan_trial: "1d", name: "Usuario2" },
      { email: "usuario3@gmail.com", password: "123456", plan_trial: "1d", name: "Usuario3" },
      { email: "usuario4@gmail.com", password: "123456", plan_trial: "3d", name: "Usuario4" },
      { email: "usuario5@gmail.com", password: "123456", plan_trial: "3d", name: "Usuario5" },
      { email: "usuario6@gmail.com", password: "123456", plan_trial: "3d", name: "Usuario6" },
    ];

    const results = [];
    const errors = [];

    // Crear cada usuario
    for (const user of trialUsers) {
      try {
        // Verificar si el usuario ya existe
        const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUser?.users.some(u => u.email === user.email);

        if (userExists) {
          results.push({
            email: user.email,
            status: 'already_exists',
            message: 'Usuario ya existe en Auth'
          });
          continue;
        }

        // Crear usuario en Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirmar email para usuarios de prueba
          user_metadata: {
            name: user.name,
            plan_trial: user.plan_trial,
            is_trial_user: true
          }
        });

        if (authError) {
          errors.push({
            email: user.email,
            error: authError.message
          });
          continue;
        }

        results.push({
          email: user.email,
          status: 'created',
          user_id: authData.user?.id,
          plan_trial: user.plan_trial
        });

      } catch (err) {
        errors.push({
          email: user.email,
          error: err.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Proceso completado. ${results.length} usuarios procesados`,
        results,
        errors: errors.length > 0 ? errors : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error en create-trial-users:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
