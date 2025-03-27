/*
  # Configure authentication and task settings

  1. Changes
    - Creates auth_settings table with unique provider constraint
    - Creates task_settings table with unique task_type constraint
    - Adds RLS policies for both tables
    - Sets up automatic timestamp updates
*/

-- Create auth settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth_settings (
  id SERIAL PRIMARY KEY,
  provider TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings if they don't exist
INSERT INTO auth_settings (provider, is_enabled)
VALUES 
  ('email', true),
  ('github', true),
  ('google', true)
ON CONFLICT (provider) DO NOTHING;

-- Create policy to allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read auth settings"
  ON auth_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create task_settings table for automation configuration
CREATE TABLE IF NOT EXISTS task_settings (
  id SERIAL PRIMARY KEY,
  task_type TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE task_settings ENABLE ROW LEVEL SECURITY;

-- Insert default task settings
INSERT INTO task_settings (task_type, is_enabled)
VALUES 
  ('checkDiskSpace', true),
  ('listRunningApps', true),
  ('cleanTempFiles', true),
  ('checkWindowsUpdates', true),
  ('systemInfo', true),
  ('startupPrograms', true),
  ('networkStatus', true),
  ('powerSettings', true)
ON CONFLICT (task_type) DO NOTHING;

-- Create policy to allow authenticated users to read task settings
CREATE POLICY "Allow authenticated users to read task settings"
  ON task_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DO $$ 
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS update_auth_settings_updated_at ON auth_settings;
  DROP TRIGGER IF EXISTS update_task_settings_updated_at ON task_settings;
  
  -- Create new triggers
  CREATE TRIGGER update_auth_settings_updated_at
    BEFORE UPDATE ON auth_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

  CREATE TRIGGER update_task_settings_updated_at
    BEFORE UPDATE ON task_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
END $$;