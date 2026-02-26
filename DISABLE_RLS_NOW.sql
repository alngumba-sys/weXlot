-- ==============================================
-- IMMEDIATE FIX: DISABLE RLS ON ALL TABLES
-- ==============================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Then click RUN
-- ==============================================

-- Disable Row Level Security on all tables
ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow all for authenticated users" ON incidents;
DROP POLICY IF EXISTS "Allow all operations" ON incidents;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as "RLS Enabled (should be FALSE)"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('incidents', 'staff', 'contacts', 'deals', 'platforms', 'companies', 'activities', 'interactions')
ORDER BY tablename;
