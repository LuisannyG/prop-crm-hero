
-- Agregar nuevas columnas a la tabla contacts
ALTER TABLE public.contacts 
ADD COLUMN client_type TEXT,
ADD COLUMN acquisition_source TEXT;

-- Actualizar los valores permitidos para el campo status
ALTER TABLE public.contacts 
DROP CONSTRAINT IF EXISTS contacts_status_check;

ALTER TABLE public.contacts 
ADD CONSTRAINT contacts_status_check 
CHECK (status IN ('prospect', 'client'));
