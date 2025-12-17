-- Migration: Add category columns to notes, features, and releases
-- Run this in Supabase SQL Editor

-- Add category column to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Add category column to features table  
ALTER TABLE features ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'feature';

-- Add category column to releases table
ALTER TABLE releases ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'release';

-- Update existing records with default categories if they don't have one
UPDATE notes SET category = 'general' WHERE category IS NULL OR category = '';
UPDATE features SET category = 'feature' WHERE category IS NULL OR category = '';
UPDATE releases SET category = 'release' WHERE category IS NULL OR category = '';

-- Verify the changes
SELECT 'notes' as table_name, COUNT(*) as total_records, COUNT(DISTINCT category) as unique_categories
FROM notes
UNION ALL
SELECT 'features' as table_name, COUNT(*) as total_records, COUNT(DISTINCT category) as unique_categories  
FROM features
UNION ALL
SELECT 'releases' as table_name, COUNT(*) as total_records, COUNT(DISTINCT category) as unique_categories
FROM releases;