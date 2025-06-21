
-- Crear tabla para el embudo de ventas
CREATE TABLE public.sales_funnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('prospecto', 'calificado', 'propuesta', 'negociacion', 'cerrado_ganado', 'cerrado_perdido')),
  stage_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para motivos de no compra
CREATE TABLE public.no_purchase_reasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  property_id UUID,
  reason_category TEXT NOT NULL CHECK (reason_category IN ('precio', 'ubicacion', 'tamano', 'financiacion', 'otra_propiedad', 'timing', 'competencia')),
  reason_details TEXT,
  price_feedback NUMERIC,
  will_reconsider BOOLEAN DEFAULT false,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para métricas de rendimiento
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('calls_made', 'appointments_set', 'properties_shown', 'proposals_sent', 'sales_closed', 'revenue_generated')),
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  channel TEXT, -- Para agentes individuales
  team_member_id UUID, -- Para empresas
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.sales_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.no_purchase_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para sales_funnel
CREATE POLICY "Users can view their own sales funnel data" 
  ON public.sales_funnel FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales funnel data" 
  ON public.sales_funnel FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales funnel data" 
  ON public.sales_funnel FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales funnel data" 
  ON public.sales_funnel FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para no_purchase_reasons
CREATE POLICY "Users can view their own no purchase reasons" 
  ON public.no_purchase_reasons FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own no purchase reasons" 
  ON public.no_purchase_reasons FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own no purchase reasons" 
  ON public.no_purchase_reasons FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own no purchase reasons" 
  ON public.no_purchase_reasons FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para performance_metrics
CREATE POLICY "Users can view their own performance metrics" 
  ON public.performance_metrics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own performance metrics" 
  ON public.performance_metrics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance metrics" 
  ON public.performance_metrics FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own performance metrics" 
  ON public.performance_metrics FOR DELETE 
  USING (auth.uid() = user_id);

-- Índices para mejorar rendimiento
CREATE INDEX idx_sales_funnel_user_contact ON public.sales_funnel(user_id, contact_id);
CREATE INDEX idx_sales_funnel_stage ON public.sales_funnel(stage);
CREATE INDEX idx_no_purchase_reasons_user ON public.no_purchase_reasons(user_id);
CREATE INDEX idx_performance_metrics_user_date ON public.performance_metrics(user_id, metric_date);
