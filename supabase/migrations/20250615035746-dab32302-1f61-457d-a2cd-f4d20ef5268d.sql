
-- Create RLS policies for the bookings table to allow users to manage their own bookings

-- Policy to allow users to view their own bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = member_id);

-- Policy to allow users to create their own bookings
CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = member_id);

-- Policy to allow users to update their own bookings
CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = member_id);

-- Policy to allow users to delete their own bookings
CREATE POLICY "Users can delete their own bookings" 
  ON public.bookings 
  FOR DELETE 
  USING (auth.uid() = member_id);
