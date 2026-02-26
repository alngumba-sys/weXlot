# Database Error Fixes - Quick Reference

## Error Summary
You were experiencing these Supabase database errors:
1. ✅ **FIXED**: `column "platform_id" does not exist`
2. ✅ **FIXED**: `Could not embed because more than one relationship was found for 'incidents' and 'staff'`
3. ✅ **FIXED**: `new row violates row-level security policy for table "incidents"`

---

## What Was Fixed

### 1. Missing Column Error (platform_id)
**Problem**: The `contacts` table didn't have a `platform_id` column.

**Solution**: Created `/supabase-migration-fix.sql` which safely adds:
- `platform_id` column to contacts table
- `first_name` and `last_name` columns to contacts table
- `incidents` table with all required columns
- Proper indexes for performance

### 2. Ambiguous Relationship Error
**Problem**: Incidents table has TWO foreign keys to the staff table (`reported_by` and `assigned_to`), so Supabase didn't know which one to use.

**Solution**: Updated all Supabase queries in `/src/app/context/CRMContext.tsx` to use explicit foreign key names:
```typescript
// BEFORE (ambiguous):
'*, reporter:staff(*), assignee:staff(*)'

// AFTER (explicit):
'*, reporter:staff!incidents_reported_by_fkey(*), assignee:staff!incidents_assigned_to_fkey(*)'
```

### 3. Row-Level Security (RLS) Error
**Problem**: RLS policies required authenticated users, but you're running in demo mode without authentication.

**Solution**: Updated migration script to **DISABLE** RLS on all tables for development:
```sql
ALTER TABLE incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
-- ... etc for all tables
```

---

## How to Apply the Fix

### Quick Fix (Recommended)
1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** → **New Query**
3. Copy **ALL** SQL from `/supabase-migration-fix.sql`
4. Paste and click **Run**
5. Refresh your app

### Alternative: RLS-Only Fix
If you only have the RLS error, run `/supabase-rls-fix.sql` instead.

---

## Files Created/Modified

### New Files
- `/supabase-migration-fix.sql` - Main migration script (adds columns, tables, disables RLS)
- `/supabase-rls-fix.sql` - Standalone RLS fix
- `/DATABASE_ERROR_FIXES.md` - This file

### Modified Files
- `/src/app/context/CRMContext.tsx` - Fixed Supabase queries with explicit foreign keys
- `/src/app/components/crm/CRMIncidents.tsx` - Added helpful error messages
- `/SUPABASE_SETUP_INSTRUCTIONS.md` - Updated instructions for all errors

---

## What the Migration Script Does

✅ Creates `platforms` table if missing  
✅ Adds `platform_id` column to `contacts` table  
✅ Adds `first_name` and `last_name` columns to `contacts` table  
✅ Migrates existing `name` data to `first_name`/`last_name`  
✅ Creates `incidents` table with proper structure  
✅ Adds database indexes for performance  
✅ **DISABLES RLS** on all tables (for development)  
✅ Creates trigger for auto-updating `updated_at` field  
✅ Inserts default platform names  
✅ Safe to run multiple times (uses `IF NOT EXISTS` checks)

---

## Testing the Fix

After running the migration script:

1. ✅ Incidents tab loads without errors
2. ✅ Can create new incidents
3. ✅ Can toggle incident status (ongoing/resolved)
4. ✅ Filters work (severity, status, search)
5. ✅ Related contacts and platforms display correctly

---

## Production Considerations

⚠️ **Important**: The migration script DISABLES Row-Level Security for easy development.

For production, you should:
1. Re-enable RLS on all tables
2. Create proper security policies based on your authentication setup
3. Use environment variables for Supabase credentials
4. Consider using Supabase Auth for user management

---

## Need More Help?

- Check `/SUPABASE_SETUP_INSTRUCTIONS.md` for detailed setup guide
- Run verification queries in Supabase SQL Editor
- Check browser console for detailed error messages
- Ensure Supabase connection is configured correctly in your app
