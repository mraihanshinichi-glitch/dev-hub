-- Migration: Add title and user_id to notes table
-- Run this in Supabase SQL Editor if you already have existing notes table

-- Add new columns to notes table
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Untitled Note',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing notes to have user_id from their project
UPDATE notes 
SET user_id = projects.user_id 
FROM projects 
WHERE notes.project_id = projects.id 
AND notes.user_id IS NULL;

-- Make user_id NOT NULL after populating existing data
ALTER TABLE notes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE notes ALTER COLUMN title SET NOT NULL;

-- Update existing notes to have default title if empty
UPDATE notes 
SET title = 'Untitled Note' 
WHERE title IS NULL OR title = '';

-- Add RLS policy for notes if not exists
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);