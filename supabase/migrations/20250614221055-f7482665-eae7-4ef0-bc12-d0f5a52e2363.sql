
-- Update the existing trainers to add required specialties field
UPDATE public.trainers 
SET specialties = ARRAY['strength', 'cardio']::trainer_specialty[]
WHERE first_name = 'Hubert' AND last_name = 'Singiza';

UPDATE public.trainers 
SET specialties = ARRAY['hiit', 'crossfit']::trainer_specialty[]
WHERE first_name = 'Iradukunda' AND last_name = 'serge';

-- Also ensure they have email addresses (required field)
UPDATE public.trainers 
SET email = 'hubert@fitness.com'
WHERE first_name = 'Hubert' AND last_name = 'Singiza' AND email IS NULL;

UPDATE public.trainers 
SET email = 'iradukunda@fitness.com'
WHERE first_name = 'Iradukunda' AND last_name = 'serge' AND email IS NULL;
