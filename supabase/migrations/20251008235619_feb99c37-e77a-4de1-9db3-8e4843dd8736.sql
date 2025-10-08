-- Crear el tipo enum para user_type si no existe
DO $$ BEGIN
  CREATE TYPE public.user_type AS ENUM ('independent_agent', 'small_company');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Agregar columnas faltantes a la tabla profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_type public.user_type DEFAULT 'independent_agent',
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS user_role TEXT;