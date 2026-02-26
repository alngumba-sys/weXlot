# Supabase Setup Instructions

## Error Fixed
The error `"Could not find the table 'public.incidents' in the schema cache"` or `"column platform_id does not exist"` or `"new row violates row-level security policy"` occurs because the required database tables, columns, or security settings don't exist in your Supabase project yet.

## 🚨 QUICK FIX FOR RLS ERROR

If you're getting **"new row violates row-level security policy"** error:

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → **New Query**
2. Copy ALL SQL from `/DISABLE_RLS_NOW.sql`
3. Paste and click **Run**
4. Refresh your app

**See `/RLS_ERROR_FIX.md` for detailed instructions.**

---

## 🚨 IMPORTANT: Use the Migration Fix Script First!

If you're getting the `"column platform_id does not exist"` error, it means you have existing tables that need to be updated. Use the migration fix script instead of the full setup script.

### Option A: Migration Fix (If you have existing tables)
**Use this if you're getting column errors or already have some tables**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → **New Query**
2. Open the file `/supabase-migration-fix.sql` in this project
3. Copy **ALL** the SQL code
4. Paste it into the Supabase SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

✅ This will safely add missing columns and tables without breaking existing data!

### Option B: Fresh Setup (If you have NO tables)
**Only use this if you're starting completely fresh**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → **New Query**
2. Open the file `/supabase-setup.sql` in this project
3. Copy **ALL** the SQL code
4. Paste it into the Supabase SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Setup Script
1. Open the file `/supabase-setup.sql` in this project
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Verify Tables Were Created
After running the script, verify your tables exist:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

You should see these tables:
- ✅ activities
- ✅ companies
- ✅ contacts
- ✅ deals
- ✅ incidents ⭐ (NEW - fixes your error)
- ✅ interactions
- ✅ platforms
- ✅ staff

### Step 4: Test the Application
1. Go back to your application
2. Navigate to the Admin Panel > CRM > Incidents tab
3. Try adding a new incident
4. The error should be gone! ✅

## What Was Created

### Tables
The script creates 8 tables for your CRM system:
1. **staff** - Team members who own contacts/deals
2. **platforms** - Your business platforms (PillsUp, MintUp, etc.)
3. **companies** - Customer companies
4. **contacts** - Individual contacts
5. **deals** - Sales pipeline deals
6. **activities** - Tasks and activities
7. **interactions** - Contact interaction history
8. **incidents** - Support incidents (NEW)

### Features
- ✅ Proper foreign key relationships
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Automatic `updated_at` timestamp trigger for incidents
- ✅ Data validation constraints

## Optional: Add Sample Data

If you want to test with sample data, uncomment the sample data section in `supabase-setup.sql` (lines starting with `/*` and ending with `*/`).

## Troubleshooting

### "relation already exists" error
This is fine! It means some tables already exist. The `IF NOT EXISTS` clause prevents errors.

### "permission denied" error
Make sure you're logged in as the project owner in Supabase.

### "new row violates row-level security policy" error
If you see this error, run the `/supabase-rls-fix.sql` script:
1. Open `/supabase-rls-fix.sql` in this project
2. Copy ALL the SQL code
3. Paste into Supabase SQL Editor
4. Click **Run**

This disables Row Level Security for development/demo purposes. The migration script should also fix this automatically.

### Still seeing the error?
1. Refresh your browser
2. Check if the tables exist in **Database** > **Tables** in Supabase
3. Make sure your Supabase connection in the app is configured correctly

## Need Help?
- Check the Supabase Dashboard > **Table Editor** to visually browse your data
- Use the **SQL Editor** to run custom queries
- Enable **Database Webhooks** if you need real-time features