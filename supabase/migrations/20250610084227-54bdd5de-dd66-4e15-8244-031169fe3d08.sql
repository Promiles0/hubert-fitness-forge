
-- Check existing enum types and create missing ones
DO $$ 
BEGIN
    -- Check if class_type enum exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_type') THEN
        CREATE TYPE class_type AS ENUM ('strength', 'cardio', 'hiit', 'yoga', 'pilates', 'crossfit', 'spinning', 'boxing', 'zumba', 'martial_arts');
    END IF;

    -- Check if membership_plan_type enum exists, if not create it  
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_plan_type') THEN
        CREATE TYPE membership_plan_type AS ENUM ('basic', 'premium', 'vip', 'student', 'senior', 'family', 'corporate', 'day_pass', 'trial');
    END IF;
END $$;

-- Update classes table to use the enum properly
ALTER TABLE classes ALTER COLUMN class_type TYPE class_type USING class_type::text::class_type;

-- Update membership_plans table to use the enum properly  
ALTER TABLE membership_plans ALTER COLUMN plan_type TYPE membership_plan_type USING plan_type::text::membership_plan_type;

-- Add any missing system settings
INSERT INTO system_settings (setting_key, setting_value) VALUES 
    ('business_name', '"FitLife Gym"'),
    ('business_logo', '""'),
    ('business_contact', '"contact@fitlife.com"'),
    ('currency', '"USD"'),
    ('email_enabled', 'true'),
    ('sms_enabled', 'false'),
    ('class_duration_default', '60'),
    ('class_capacity_limit', '50'),
    ('language', '"en"'),
    ('timezone', '"UTC"'),
    ('backup_enabled', 'true')
ON CONFLICT (setting_key) DO NOTHING;

-- Create activity logs table for audit trails
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for activity logs (admins can see all)
CREATE POLICY "Admins can view all activity logs" ON activity_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
