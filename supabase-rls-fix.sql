-- ==============================================
-- RLS POLICY FIX FOR INCIDENTS TABLE
-- ==============================================
-- Run this if you're getting "row-level security policy" errors
-- This temporarily disables RLS for demo purposes
-- ==============================================

-- Option 1: DISABLE RLS (Recommended for development/demo)
-- This allows all operations without authentication
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on other tables if needed
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE interactions DISABLE ROW LEVEL SECURITY;

-- ==============================================
-- Option 2: CREATE PERMISSIVE POLICIES (Alternative)
-- ==============================================
-- If you prefer to keep RLS enabled, uncomment the following:
-- This allows all operations for everyone (authenticated or not)

/*
-- Re-enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON incidents;

-- Create permissive policy that allows all operations
CREATE POLICY "Allow all operations" ON incidents
  FOR ALL 
  USING (true)
  WITH CHECK (true);
*/

-- ==============================================
-- VERIFICATION
-- ==============================================
-- Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('incidents', 'staff', 'contacts', 'deals', 'platforms', 'companies', 'activities', 'interactions')
ORDER BY tablename;

-- Test inserting a record (this should work now)
-- Uncomment to test:
-- INSERT INTO incidents (title, description, severity, status) 
-- VALUES ('Test Incident', 'Testing RLS fix', 'low', 'ongoing');
