-- Crear tabla para registrar intentos de suscripción
CREATE TABLE IF NOT EXISTS public.purchase_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  trial_group text,
  amount numeric NOT NULL DEFAULT 60,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.purchase_log ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios registros
CREATE POLICY "Users can view their own purchase logs"
ON public.purchase_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propios registros
CREATE POLICY "Users can insert their own purchase logs"
ON public.purchase_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Índice para mejorar consultas por usuario
CREATE INDEX idx_purchase_log_user_id ON public.purchase_log(user_id);