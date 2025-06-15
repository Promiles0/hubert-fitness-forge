
-- Enable RLS on members table if not already enabled
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own member record
CREATE POLICY "Users can view their own member record" 
  ON public.members 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to create their own member record
CREATE POLICY "Users can create their own member record" 
  ON public.members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own member record
CREATE POLICY "Users can update their own member record" 
  ON public.members 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Update the booking policies to work with the member relationship
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

-- Create new booking policies that check through the members table
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.members 
      WHERE members.id = bookings.member_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members 
      WHERE members.id = bookings.member_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.members 
      WHERE members.id = bookings.member_id 
      AND members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own bookings" 
  ON public.bookings 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.members 
      WHERE members.id = bookings.member_id 
      AND members.user_id = auth.uid()
    )
  );
