
-- Crear un enum para los tipos de usuario
CREATE TYPE public.user_type AS ENUM ('independent_agent', 'small_company');

-- Agregar la columna user_type a la tabla profiles
ALTER TABLE public.profiles 
ADD COLUMN user_type public.user_type;

-- Actualizar la función handle_new_user para incluir el tipo de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    COALESCE((new.raw_user_meta_data->>'user_type')::public.user_type, 'independent_agent')
  );
  RETURN new;
END;
$$;
