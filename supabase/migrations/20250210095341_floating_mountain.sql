/*
  # Create task logs table with safe policy creation

  1. New Tables
    - `task_logs`
      - `id` (uuid, primary key)
      - `task_type` (text)
      - `params` (jsonb)
      - `status` (text)
      - `result` (text)
      - `error` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `task_logs` table
    - Add policies for authenticated users to read, create, and update logs
*/

-- Create the task_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS task_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL,
  params jsonb NOT NULL,
  status text NOT NULL,
  result text,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;

-- Safely create policies using DO block
DO $$ 
BEGIN
  -- Create read policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_logs' 
    AND policyname = 'Users can read task logs'
  ) THEN
    CREATE POLICY "Users can read task logs"
      ON task_logs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Create insert policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_logs' 
    AND policyname = 'Users can create task logs'
  ) THEN
    CREATE POLICY "Users can create task logs"
      ON task_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Create update policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'task_logs' 
    AND policyname = 'Users can update their task logs'
  ) THEN
    CREATE POLICY "Users can update their task logs"
      ON task_logs
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;