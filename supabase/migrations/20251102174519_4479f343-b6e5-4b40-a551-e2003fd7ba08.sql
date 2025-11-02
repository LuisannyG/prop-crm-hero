-- Drop existing table
DROP TABLE IF EXISTS public.trial_experiment CASCADE;

-- Recreate table with proper structure
CREATE TABLE public.trial_experiment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  trial_group TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_experiment ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read trial users"
  ON public.trial_experiment
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert trial users"
  ON public.trial_experiment
  FOR INSERT
  WITH CHECK (true);