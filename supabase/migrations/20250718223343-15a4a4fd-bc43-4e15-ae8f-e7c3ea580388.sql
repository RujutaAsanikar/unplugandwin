-- Create a table for parent surveys
CREATE TABLE public.parent_surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  child_name TEXT,
  concern_level TEXT,
  knows_apps_used TEXT,
  usage_rating TEXT,
  noticed_changes TEXT,
  behavior_changes TEXT,
  support_challenge TEXT,
  monitoring_likelihood TEXT,
  reward_types TEXT[],
  benefit_types TEXT[],
  challenge_types TEXT[],
  monthly_budget TEXT,
  other_budget TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parent_surveys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to insert
CREATE POLICY "Anyone can insert parent_surveys"
ON public.parent_surveys FOR INSERT TO public
WITH CHECK (true);

-- Create policy to allow all users to select
CREATE POLICY "Anyone can select parent_surveys" 
ON public.parent_surveys FOR SELECT TO public
USING (true);