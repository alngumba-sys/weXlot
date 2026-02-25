-- ✅ FIX: Add company_name column to contacts table
-- Run this in Supabase SQL Editor

-- Add the company_name column to store business names as text
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts' AND column_name = 'company_name';

-- Expected output:
-- column_name   | data_type | is_nullable
-- --------------|-----------|------------
-- company_name  | text      | YES

-- ✅ Done! You can now save business names in the contacts form.
