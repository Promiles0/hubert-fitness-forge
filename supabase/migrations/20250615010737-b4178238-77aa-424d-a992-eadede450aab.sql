
-- Enable RLS on class_schedules table (if not already enabled)
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to view class schedules
CREATE POLICY "Anyone can view class schedules" 
  ON public.class_schedules 
  FOR SELECT 
  USING (true);

-- Also ensure the classes table is accessible for the join query
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to view classes
CREATE POLICY "Anyone can view classes" 
  ON public.classes 
  FOR SELECT 
  USING (true);

-- Create policies for admins to manage schedules and classes
CREATE POLICY "Admins can manage class schedules" 
  ON public.class_schedules 
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

CREATE POLICY "Admins can manage classes" 
  ON public.classes 
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
