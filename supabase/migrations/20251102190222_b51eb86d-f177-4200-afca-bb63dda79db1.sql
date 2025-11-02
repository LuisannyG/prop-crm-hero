-- Crear tabla para registrar uso del Motor IA
CREATE TABLE IF NOT EXISTS public.motor_ia_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  trial_group TEXT,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.motor_ia_usage ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can insert their own motor IA usage"
  ON public.motor_ia_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own motor IA usage"
  ON public.motor_ia_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Índice para mejorar performance
CREATE INDEX idx_motor_ia_usage_user_id ON public.motor_ia_usage(user_id);
CREATE INDEX idx_motor_ia_usage_opened_at ON public.motor_ia_usage(opened_at);