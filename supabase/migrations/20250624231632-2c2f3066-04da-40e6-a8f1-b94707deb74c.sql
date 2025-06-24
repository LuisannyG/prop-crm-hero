
-- Tabla para almacenar métricas de riesgo calculadas para cada cliente
CREATE TABLE public.client_risk_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  last_contact_days INTEGER NOT NULL DEFAULT 0,
  interaction_frequency DECIMAL(5,2) DEFAULT 0,
  stage_progression_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  price_sensitivity_score INTEGER DEFAULT 0,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para registrar alertas de riesgo automáticas
CREATE TABLE public.risk_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('high_risk', 'stage_stagnation', 'low_engagement', 'price_objection')),
  alert_message TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabla para registrar acciones de recuperación aplicadas
CREATE TABLE public.recovery_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('priority_call', 'discount_offer', 'alternative_proposal', 'escalation', 'follow_up_email')),
  action_description TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  outcome TEXT CHECK (outcome IN ('successful', 'failed', 'pending')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las nuevas tablas
ALTER TABLE public.client_risk_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_actions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para client_risk_metrics
CREATE POLICY "Users can manage their own risk metrics" ON public.client_risk_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para risk_alerts
CREATE POLICY "Users can manage their own risk alerts" ON public.risk_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para recovery_actions
CREATE POLICY "Users can manage their own recovery actions" ON public.recovery_actions
  FOR ALL USING (auth.uid() = user_id);

-- Triggers para actualizar updated_at
CREATE TRIGGER handle_client_risk_metrics_updated_at
  BEFORE UPDATE ON public.client_risk_metrics
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Función para calcular métricas de riesgo automáticamente
CREATE OR REPLACE FUNCTION public.calculate_client_risk_score(contact_uuid UUID, user_uuid UUID)
RETURNS TABLE(
  risk_score INTEGER,
  risk_factors JSONB,
  recommendations JSONB,
  last_contact_days INTEGER,
  interaction_frequency DECIMAL,
  engagement_score INTEGER
) 
LANGUAGE plpgsql
AS $$
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
$$;
