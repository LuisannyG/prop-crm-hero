import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    // Actualizar usuarios del Grupo A (1 día)
    const { error: errorGrupoA } = await supabaseAdmin
      .from('trial_experiment')
      .update({ plan_trial: '1d' })
      .in('email', ['usuario1@gmail.com', 'usuario2@gmail.com', 'usuario3@gmail.com']);

    if (errorGrupoA) {
      console.error('Error actualizando Grupo A:', errorGrupoA);
    }

    // Actualizar usuarios del Grupo B (3 días)
    const { error: errorGrupoB } = await supabaseAdmin
      .from('trial_experiment')
      .update({ plan_trial: '3d' })
      .in('email', ['usuario4@gmail.com', 'usuario5@gmail.com', 'usuario6@gmail.com']);

    if (errorGrupoB) {
      console.error('Error actualizando Grupo B:', errorGrupoB);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuarios actualizados correctamente'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error en update-trial-users:', error);
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
