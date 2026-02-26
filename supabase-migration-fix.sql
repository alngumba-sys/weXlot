-- ==============================================
-- CRM SYSTEM - MIGRATION FIX SCRIPT
-- ==============================================
-- This script fixes the "platform_id does not exist" error
-- Run this in your Supabase SQL Editor
-- ==============================================

-- First, ensure the platforms table exists
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add platform_id column to contacts table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'platform_id'
  ) THEN
    ALTER TABLE contacts ADD COLUMN platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add first_name and last_name columns to contacts if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE contacts ADD COLUMN first_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE contacts ADD COLUMN last_name TEXT;
  END IF;
END $$;

-- Migrate existing 'name' data to first_name if name column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'name'
  ) THEN
    -- Split existing name into first_name and last_name
    UPDATE contacts 
    SET 
      first_name = SPLIT_PART(name, ' ', 1),
      last_name = CASE 
        WHEN name LIKE '% %' THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
        ELSE ''
      END
    WHERE first_name IS NULL AND name IS NOT NULL;
  END IF;
END $$;

-- Create incidents table if it doesn't exist
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL CHECK (status IN ('ongoing', 'resolved')),
  reported_by UUID REFERENCES staff(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES staff(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_contacts_platform_id ON contacts(platform_id);
CREATE INDEX IF NOT EXISTS idx_incidents_platform_id ON incidents(platform_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);

-- ==============================================
-- RLS CONFIGURATION (For Development/Demo)
-- ==============================================
-- DISABLE RLS for easy development/testing
-- Re-enable and add proper policies for production
ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_incidents_updated_at ON incidents;
CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default platforms if they don't exist
INSERT INTO platforms (name) VALUES
  ('PillsUp'),
  ('SmartLenderUp'),
  ('HotelierUp'),
  ('MintUp'),
  ('SalesUp'),
  ('WeXlot'),
  ('TillsUp')
ON CONFLICT (name) DO NOTHING;

-- ==============================================
-- VERIFICATION
-- ==============================================
-- Check if incidents table exists
SELECT 'incidents table created' AS status, COUNT(*) AS count FROM incidents;

-- Check if platform_id column exists in contacts
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' AND column_name IN ('platform_id', 'first_name', 'last_name');

-- List all platforms
SELECT * FROM platforms ORDER BY name;