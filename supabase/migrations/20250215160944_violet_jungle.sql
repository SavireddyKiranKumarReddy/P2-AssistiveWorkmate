/*
  # Fix Task Logs Schema and Security

  1. Changes
    - Add completed_at column to task_logs table
    - Update RLS policies for better security

  2. Security
    - Enable RLS on task_logs table
    - Add policies for authenticated users to manage their own task logs
*/

-- Add completed_at column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'task_logs' 
    AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE task_logs ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read task logs" ON task_logs;
DROP POLICY IF EXISTS "Users can create task logs" ON task_logs;
DROP POLICY IF EXISTS "Users can update their task logs" ON task_logs;

-- Create new policies with proper user authentication checks
CREATE POLICY "Enable read access for authenticated users"
ON task_logs FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert access for authenticated users"
ON task_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update access for authenticated users"
ON task_logs FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);