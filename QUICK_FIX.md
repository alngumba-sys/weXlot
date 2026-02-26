# 🔧 Quick Fix Guide - RLS Error

## You're seeing this error:
```
❌ "new row violates row-level security policy for table incidents"
```

---

## ⚡ 3-Step Fix (Takes 1 minute)

### 1️⃣ Open Supabase
Go to: https://supabase.com/dashboard
- Click your project
- Click **SQL Editor** (left sidebar)
- Click **New Query**

### 2️⃣ Paste This SQL
```sql
ALTER TABLE IF EXISTS incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interactions DISABLE ROW LEVEL SECURITY;
```

### 3️⃣ Click RUN
Click the **RUN** button, then refresh your app.

---

## ✅ Done!
Your app should now work. Try creating an incident to test.

---

## What Happened?
Row-Level Security (RLS) blocks database changes when you're not authenticated. Since this is a demo app without login, we disabled RLS to allow all operations.

**For production**: Re-enable RLS and add proper authentication.

---

## Alternative Method
Or use the pre-made SQL file:
1. Open `/DISABLE_RLS_NOW.sql`
2. Copy all contents
3. Paste in Supabase SQL Editor
4. Run

---

## Need More Help?
- **Full guide**: See `/RLS_ERROR_FIX.md`
- **All errors**: See `/DATABASE_ERROR_FIXES.md`
- **Setup from scratch**: See `/SUPABASE_SETUP_INSTRUCTIONS.md`
