
-- First, let's see what enum values are currently allowed
-- Then update the class_type enum to include the fitness class types your app uses

-- Add the missing enum values to class_type
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'strength';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'cardio';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'hiit';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'yoga';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'pilates';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'crossfit';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'spinning';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'boxing';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'zumba';
ALTER TYPE class_type ADD VALUE IF NOT EXISTS 'martial_arts';
