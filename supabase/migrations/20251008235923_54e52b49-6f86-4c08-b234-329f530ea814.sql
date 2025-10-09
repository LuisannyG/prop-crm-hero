-- Arreglar funciones de la base de datos agregando SET search_path para prevenir vulnerabilidades de seguridad

-- Recrear función update_contact_sales_stage con search_path seguro
CREATE OR REPLACE FUNCTION public.update_contact_sales_stage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Si se registró un cambio de etapa en la interacción, actualizar el contacto
  IF NEW.new_stage IS NOT NULL AND NEW.new_stage != '' THEN
    UPDATE public.contacts 
    SET sales_stage = NEW.new_stage,
        updated_at = now()
    WHERE id = NEW.contact_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Recrear función handle_updated_at con search_path seguro
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Recrear función handle_new_user con search_path seguro (ya tiene SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type, company_name, user_role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    COALESCE((new.raw_user_meta_data->>'user_type')::public.user_type, 'independent_agent'),
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'user_role'
  );
  RETURN new;
END;
$function$;