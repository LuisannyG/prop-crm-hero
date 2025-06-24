
-- Create storage bucket for property photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create policy to allow authenticated users to upload to property-photos bucket
CREATE POLICY "Authenticated users can upload property photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-photos');

-- Create policy to allow public read access to property photos
CREATE POLICY "Public read access to property photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-photos');

-- Create policy to allow users to update their own property photos
CREATE POLICY "Users can update their own property photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-photos');

-- Create policy to allow users to delete their own property photos
CREATE POLICY "Users can delete their own property photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-photos');
