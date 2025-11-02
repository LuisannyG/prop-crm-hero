-- Crear tabla trial_experiment para usuarios de prueba
CREATE TABLE public.trial_experiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  plan_trial TEXT NOT NULL CHECK (plan_trial IN ('3d', '7d')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.trial_experiment ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a usuarios autenticados
CREATE POLICY "Anyone can read trial users"
ON public.trial_experiment
FOR SELECT
TO authenticated
USING (true);

-- Política para permitir inserción (si es necesario para registro)
CREATE POLICY "Anyone can insert trial users"
ON public.trial_experiment
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Índice en email para búsquedas rápidas
CREATE INDEX idx_trial_experiment_email ON public.trial_experiment(email);