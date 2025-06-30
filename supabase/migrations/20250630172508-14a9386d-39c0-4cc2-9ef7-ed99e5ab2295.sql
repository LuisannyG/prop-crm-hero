
-- Agregar foreign keys faltantes para establecer las relaciones correctas
ALTER TABLE public.no_purchase_reasons 
ADD CONSTRAINT fk_no_purchase_reasons_contact 
FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE;

ALTER TABLE public.no_purchase_reasons 
ADD CONSTRAINT fk_no_purchase_reasons_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;

-- Habilitar RLS en la tabla no_purchase_reasons si no está habilitado
ALTER TABLE public.no_purchase_reasons ENABLE ROW LEVEL SECURITY;
