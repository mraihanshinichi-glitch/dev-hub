-- Simple Migration: Increase project slots from 5 to 10
-- Run each command separately in Supabase SQL Editor

-- 1. Update table constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slot_number_check;
ALTER TABLE projects ADD CONSTRAINT projects_slot_number_check CHECK (slot_number >= 1 AND slot_number <= 10);

-- 2. Update trigger function
CREATE OR REPLACE FUNCTION check_project_limit() RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 project slots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;