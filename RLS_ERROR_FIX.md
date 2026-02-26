# 🚨 IMMEDIATE FIX: Row-Level Security Error

## Error You're Seeing
```
{
  "code": "42501",
  "message": "new row violates row-level security policy for table \"incidents\""
}
```

---

## ⚡ QUICK FIX (30 seconds)

### Step 1: Open Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL
Copy **ALL** of this SQL and paste into the query editor:

```sql
-- DISABLE RLS ON ALL TABLES
ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;
```

### Step 3: Click Run
Click the **RUN** button in Supabase

### Step 4: Refresh Your App
Go back to your app and refresh the page. The error should be gone! ✅

---

## Alternative: Use the SQL File

Instead of copying the SQL above, you can also:
1. Open `/DISABLE_RLS_NOW.sql` in your project
2. Copy **ALL** the SQL
3. Paste into Supabase SQL Editor
4. Click **Run**

---

## What This Does

**Row-Level Security (RLS)** is a PostgreSQL feature that restricts database access based on user authentication. When RLS is enabled, you need to be authenticated to modify data.

Since your app is in **demo/development mode** and doesn't have authentication configured, the RLS policies are blocking all database operations.

**Disabling RLS** allows your app to create, read, update, and delete data without authentication.

⚠️ **Note**: For production apps, you should re-enable RLS and configure proper security policies.

---

## Verification

After running the SQL, you can verify RLS is disabled by running this query in Supabase:

```sql
SELECT 
  tablename,
  rowsecurity as "RLS Enabled (should be FALSE)"
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

All tables should show `FALSE` for RLS Enabled.

---

## Still Not Working?

If you're still seeing errors after disabling RLS:

1. **Check if tables exist**: Run the full migration script `/supabase-migration-fix.sql`
2. **Check browser console**: Look for detailed error messages
3. **Verify Supabase connection**: Make sure your Supabase project URL and anon key are correct in your app
4. **Clear cache**: Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Files in This Project

- `/DISABLE_RLS_NOW.sql` - Quick RLS disabler (this fix)
- `/supabase-migration-fix.sql` - Full migration (creates tables, adds columns, disables RLS)
- `/DATABASE_ERROR_FIXES.md` - Complete error reference
- `/SUPABASE_SETUP_INSTRUCTIONS.md` - Full setup guide

---

## ✅ Success Checklist

After running the fix, you should be able to:
- [ ] Create new incidents without RLS errors
- [ ] See the incidents list load properly
- [ ] Toggle incident status (ongoing/resolved)
- [ ] Use all filters and search
- [ ] Assign incidents to contacts, platforms, and staff

---

**Need Help?** Check the browser console for detailed error messages and refer to `/DATABASE_ERROR_FIXES.md` for more troubleshooting steps.
