-- DevHub Database Schema - Safe Version
-- Jalankan script ini di Supabase SQL Editor

-- =============================================
-- BAGIAN 1: CREATE TABLES
-- =============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table (slots)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Project',
  description TEXT DEFAULT '',
  slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slot_number)
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Note',
  category TEXT DEFAULT 'general',
  content JSONB DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'feature',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'done')),
  order_index INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create releases table
CREATE TABLE IF NOT EXISTS releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL,
  target_date DATE,
  category TEXT DEFAULT 'release',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'upcoming', 'released')),
  notes TEXT DEFAULT '',
  released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create release_features junction table
CREATE TABLE IF NOT EXISTS release_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE NOT NULL,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(release_id, feature_id)
);



-- =============================================
-- BAGIAN 2: ENABLE RLS
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_features ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BAGIAN 3: RLS POLICIES
-- =============================================

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notes
DROP POLICY IF EXISTS "Users can manage own notes" ON notes;
CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for features
DROP POLICY IF EXISTS "Users can view own features" ON features;
CREATE POLICY "Users can view own features" ON features
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = features.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own features" ON features;
CREATE POLICY "Users can insert own features" ON features
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = features.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own features" ON features;
CREATE POLICY "Users can update own features" ON features
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = features.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own features" ON features;
CREATE POLICY "Users can delete own features" ON features
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = features.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for releases
DROP POLICY IF EXISTS "Users can view own releases" ON releases;
CREATE POLICY "Users can view own releases" ON releases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = releases.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own releases" ON releases;
CREATE POLICY "Users can insert own releases" ON releases
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = releases.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own releases" ON releases;
CREATE POLICY "Users can update own releases" ON releases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = releases.project_id 
      AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own releases" ON releases;
CREATE POLICY "Users can delete own releases" ON releases
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = releases.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for release_features
DROP POLICY IF EXISTS "Users can view own release_features" ON release_features;
CREATE POLICY "Users can view own release_features" ON release_features
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM releases r
      JOIN projects p ON p.id = r.project_id
      WHERE r.id = release_features.release_id 
      AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own release_features" ON release_features;
CREATE POLICY "Users can insert own release_features" ON release_features
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM releases r
      JOIN projects p ON p.id = r.project_id
      WHERE r.id = release_features.release_id 
      AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own release_features" ON release_features;
CREATE POLICY "Users can delete own release_features" ON release_features
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM releases r
      JOIN projects p ON p.id = r.project_id
      WHERE r.id = release_features.release_id 
      AND p.user_id = auth.uid()
    )
  );



-- =============================================
-- BAGIAN 4: FUNCTIONS AND TRIGGERS
-- =============================================

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_features_updated_at ON features;
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_releases_updated_at ON releases;
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check slot limit
CREATE OR REPLACE FUNCTION check_slot_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM projects WHERE user_id = NEW.user_id) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 project slots allowed per user';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce slot limit
DROP TRIGGER IF EXISTS enforce_slot_limit ON projects;
CREATE TRIGGER enforce_slot_limit
  BEFORE INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION check_slot_limit();