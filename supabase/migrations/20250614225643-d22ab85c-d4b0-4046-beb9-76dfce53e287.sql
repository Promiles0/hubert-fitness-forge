
-- Check if RLS is enabled on trainers table and create appropriate policies
-- First, let's see the current state and then set up proper public access

-- Enable RLS on trainers table (if not already enabled)
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies that might be blocking access
DROP POLICY IF EXISTS "Trainers are viewable by authenticated users only" ON public.trainers;
DROP POLICY IF EXISTS "Trainers are viewable by admins only" ON public.trainers;

-- Create a policy that allows everyone (including anonymous users) to view active trainers
CREATE POLICY "Anyone can view active trainers" 
  ON public.trainers 
  FOR SELECT 
  USING (is_active = true);

-- Create a policy that allows only admins to modify trainers
CREATE POLICY "Admins can manage trainers" 
  ON public.trainers 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
