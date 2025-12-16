# Migration Steps: 5 to 10 Project Slots

## Option 1: Run Complete Migration

Copy and paste this entire block into Supabase SQL Editor:

```sql
-- Drop existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slot_number_check;

-- Add new constraint for 10 slots
ALTER TABLE projects ADD CONSTRAINT projects_slot_number_check 
CHECK (slot_number >= 1 AND slot_number <= 10);

-- Update trigger function
CREATE OR REPLACE FUNCTION check_project_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 project slots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Option 2: Run Step by Step

If the above fails, run each command separately:

### Step 1: Remove old constraint
```sql
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slot_number_check;
```

### Step 2: Add new constraint
```sql
ALTER TABLE projects ADD CONSTRAINT projects_slot_number_check CHECK (slot_number >= 1 AND slot_number <= 10);
```

### Step 3: Update function
```sql
CREATE OR REPLACE FUNCTION check_project_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 project slots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Verification

After running the migration, verify it worked:

```sql
-- Check constraint
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
AND conname = 'projects_slot_number_check';

-- Check function
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'check_project_limit';
```

## Test

Try creating a project in slot 6-10 to verify the new limit works:

```sql
-- This should work now (assuming you have less than 10 projects)
INSERT INTO projects (user_id, name, slot_number) 
VALUES (auth.uid(), 'Test Project Slot 6', 6);

-- Clean up test
DELETE FROM projects WHERE name = 'Test Project Slot 6';
```