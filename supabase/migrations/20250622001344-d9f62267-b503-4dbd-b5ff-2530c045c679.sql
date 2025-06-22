
-- Actualizar la tabla de interacciones para incluir más campos necesarios
ALTER TABLE public.interactions 
ADD COLUMN IF NOT EXISTS previous_stage TEXT,
ADD COLUMN IF NOT EXISTS new_stage TEXT,
ADD COLUMN IF NOT EXISTS meeting_location TEXT,
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS next_steps TEXT;

-- Crear índice para mejorar las consultas por contacto
CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON public.interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON public.interactions(user_id);

-- Agregar políticas RLS si no existen
DO $$ 
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'interactions' 
        AND policyname = 'Users can manage their own interactions'
    ) THEN
        CREATE POLICY "Users can manage their own interactions" ON public.interactions
        FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Función para actualizar automáticamente la etapa de venta del contacto cuando se registra un cambio
CREATE OR REPLACE FUNCTION public.update_contact_sales_stage()
RETURNS TRIGGER AS $$
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
$$ language 'plpgsql';

-- Crear trigger para actualizar la etapa del contacto automáticamente
DROP TRIGGER IF EXISTS trigger_update_contact_sales_stage ON public.interactions;
CREATE TRIGGER trigger_update_contact_sales_stage
  AFTER INSERT ON public.interactions
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_contact_sales_stage();
