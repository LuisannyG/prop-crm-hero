
-- Add district and photo_url columns to properties table
ALTER TABLE public.properties 
ADD COLUMN district TEXT,
ADD COLUMN photo_url TEXT;
