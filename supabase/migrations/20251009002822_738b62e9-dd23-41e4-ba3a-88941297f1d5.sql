-- Agregar columna property_id a la tabla reminders para permitir recordatorios de propiedades
ALTER TABLE public.reminders 
ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE;

-- Modificar la columna contact_id para que sea nullable
ALTER TABLE public.reminders 
ALTER COLUMN contact_id DROP NOT NULL;