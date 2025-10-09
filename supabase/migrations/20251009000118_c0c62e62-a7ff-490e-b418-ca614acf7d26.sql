-- Arreglar la función calculate_client_risk_score agregando SET search_path
CREATE OR REPLACE FUNCTION public.calculate_client_risk_score(contact_uuid uuid, user_uuid uuid)
RETURNS TABLE(risk_score integer, risk_factors jsonb, recommendations jsonb, last_contact_days integer, interaction_frequency numeric, engagement_score integer)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $function$
DECLARE
  days_since_contact INTEGER := 0;
  interaction_count INTEGER := 0;
  total_days INTEGER := 1;
  freq_score DECIMAL := 0;
  stage_score INTEGER := 0;
  engagement INTEGER := 0;
  final_risk INTEGER := 0;
  factors JSONB := '[]'::jsonb;
  recs JSONB := '[]'::jsonb;
  current_stage TEXT;
  stage_days INTEGER := 0;
  has_price_objection BOOLEAN := FALSE;
BEGIN
  -- Calcular días desde último contacto
  SELECT COALESCE(EXTRACT(DAY FROM (now() - MAX(interaction_date))), 999)::INTEGER
  INTO days_since_contact
  FROM public.interactions 
  WHERE contact_id = contact_uuid AND user_id = user_uuid;

  -- Calcular frecuencia de interacciones (últimos 30 días)
  SELECT COUNT(*)::INTEGER
  INTO interaction_count
  FROM public.interactions 
  WHERE contact_id = contact_uuid AND user_id = user_uuid
    AND interaction_date >= (now() - interval '30 days');

  -- Calcular días totales de relación
  SELECT GREATEST(1, EXTRACT(DAY FROM (now() - MIN(created_at))))::INTEGER
  INTO total_days
  FROM public.interactions 
  WHERE contact_id = contact_uuid AND user_id = user_uuid;

  -- Frecuencia de interacciones por día
  freq_score := (interaction_count::DECIMAL / LEAST(30, total_days)) * 10;

  -- Obtener etapa actual y días en esa etapa
  SELECT sales_stage INTO current_stage
  FROM public.contacts 
  WHERE id = contact_uuid AND user_id = user_uuid;

  -- Calcular días en etapa actual
  SELECT COALESCE(EXTRACT(DAY FROM (now() - MAX(interaction_date))), 0)::INTEGER
  INTO stage_days
  FROM public.interactions 
  WHERE contact_id = contact_uuid AND user_id = user_uuid
    AND new_stage = current_stage;

  -- Verificar objeciones de precio
  SELECT EXISTS(
    SELECT 1 FROM public.no_purchase_reasons 
    WHERE contact_id = contact_uuid AND user_id = user_uuid
      AND reason_category ILIKE '%precio%'
  ) INTO has_price_objection;

  -- Calcular score de engagement
  engagement := GREATEST(0, 100 - (days_since_contact * 3) - (stage_days * 2) + (freq_score * 10)::INTEGER);

  -- Calcular score de riesgo final
  final_risk := LEAST(100, GREATEST(0, 
    (days_since_contact * 2) + 
    (CASE WHEN freq_score < 0.1 THEN 30 ELSE 0 END) +
    (CASE WHEN stage_days > 14 THEN 25 ELSE 0 END) +
    (CASE WHEN current_stage IN ('Visita realizada', 'Negociación') AND stage_days > 10 THEN 20 ELSE 0 END) +
    (CASE WHEN has_price_objection THEN 15 ELSE 0 END)
  ));

  -- Construir factores de riesgo
  factors := '[]'::jsonb;
  IF days_since_contact > 7 THEN
    factors := factors || jsonb_build_array('Sin contacto por ' || days_since_contact || ' días');
  END IF;
  IF freq_score < 0.1 THEN
    factors := factors || jsonb_build_array('Baja frecuencia de comunicación');
  END IF;
  IF stage_days > 14 THEN
    factors := factors || jsonb_build_array('Estancado en etapa actual por ' || stage_days || ' días');
  END IF;
  IF has_price_objection THEN
    factors := factors || jsonb_build_array('Ha expresado objeciones de precio');
  END IF;

  -- Construir recomendaciones
  recs := '[]'::jsonb;
  IF final_risk >= 80 THEN
    recs := recs || jsonb_build_array('Contacto prioritario en 24h');
    recs := recs || jsonb_build_array('Ofrecer incentivo especial');
    recs := recs || jsonb_build_array('Escalado a agente senior');
  ELSIF final_risk >= 60 THEN
    recs := recs || jsonb_build_array('Programar seguimiento en 48h');
    recs := recs || jsonb_build_array('Enviar nueva información relevante');
  ELSE
    recs := recs || jsonb_build_array('Mantener comunicación regular');
    recs := recs || jsonb_build_array('Enviar contenido de valor');
  END IF;

  RETURN QUERY SELECT 
    final_risk,
    factors,
    recs,
    days_since_contact,
    freq_score,
    engagement;
END;
$function$;