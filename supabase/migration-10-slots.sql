-- Migration: Increase project slots from 5 to 10
-- Run this in Supabase SQL Editor to update existing constraints

-- Drop the existing check constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slot_number_check;

-- Add new check constraint for 10 slots
ALTER TABLE projects ADD CONSTRAINT projects_slot_number_check 
CHECK (slot_number >= 1 AND slot_number <= 10);

-- Verify the constraint was updated
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
AND conname = 'projects_slot_number_check';
-- Upda
te the trigger function to allow 10 projects
CREATE OR REPLACE FUNCTION check_project_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 project slots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verify the function was updated
SELECT prosrc FROM pg_proc WHERE proname = 'check_project_limit';