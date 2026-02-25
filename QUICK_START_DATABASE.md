# 🚀 Quick Start: See Your CRM Data in Supabase

**Goal:** Set up your database so when you add contacts, deals, and activities in WeXlot CRM, you can see them instantly in your Supabase database.

## ⏱️ 5-Minute Setup

### Step 1: Open Supabase SQL Editor (1 min)

1. Go to **https://supabase.com/dashboard**
2. Click on your project: **mtfsrlsccbmrekzthvmw**
3. Click **SQL Editor** (left sidebar)
4. Click **+ New Query**

### Step 2: Create Tables (2 min)

**Copy this entire SQL block and paste it into the SQL Editor, then click RUN:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  company_id UUID REFERENCES companies(id),
  main_need TEXT,
  budget_range TEXT,
  decision_authority TEXT,
  notes TEXT,
  owner_id UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Platforms
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Deals
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  stage TEXT NOT NULL,
  probability INTEGER DEFAULT 50,
  expected_close_date DATE,
  contact_id UUID REFERENCES contacts(id),
  company_id UUID REFERENCES companies(id),
  platform_id UUID REFERENCES platforms(id),
  owner_id UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Activities (Tasks/Reminders)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  owner_id UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Interactions (History log)
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all operations for staff" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for companies" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for platforms" ON platforms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for deals" ON deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for interactions" ON interactions FOR ALL USING (true) WITH CHECK (true);

-- Insert default platforms
INSERT INTO platforms (name) VALUES 
  ('PillsUp'),
  ('SmartLenderUp'),
  ('HotelierUp'),
  ('SalesUp'),
  ('WeXlot')
ON CONFLICT (name) DO NOTHING;
```

✅ **You should see:** "Success. No rows returned"

### Step 3: Verify Tables (1 min)

1. Click **Table Editor** (left sidebar)
2. You should see 7 tables:
   - ✅ staff
   - ✅ companies
   - ✅ contacts
   - ✅ platforms (should have 5 rows: PillsUp, SmartLenderUp, etc.)
   - ✅ deals
   - ✅ activities
   - ✅ interactions

### Step 4: Enable Real-Time Sync (1 min) ⚡ IMPORTANT

**This step is critical for syncing data across multiple machines!**

1. Click **Database** → **Replication** (left sidebar)
2. Find "supabase_realtime publication"
3. **Enable these tables:**
   - ☑️ staff
   - ☑️ contacts
   - ☑️ companies
   - ☑️ deals
   - ☑️ activities
   - ☑️ interactions
   - ☑️ platforms
4. Click **Save**

**OR run this SQL in SQL Editor (handles duplicates):**

```sql
-- Enable realtime for all CRM tables (safe to run multiple times)
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE staff; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE contacts; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE companies; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE deals; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE activities; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE interactions; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE platforms; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
```

**Verify it worked:**

```sql
-- Should return all 7 tables
SELECT tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
```

✅ **Why?** Without this, changes on one machine won't appear on other machines until manual refresh!

### Step 5: Test It! (1 min)

1. **Open your WeXlot app**
2. **Click the WeXlot logo** to open admin
3. **Login:** Username: `Admin`, Password: `Wexlot@2026`
4. **Go to Contacts** → Click **Add Contact**
5. Fill in:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Budget: `$10k-$25k`
6. Click **Save**

### Step 6: See It in Database! (30 sec)

1. **Go back to Supabase**
2. **Click Table Editor** → **contacts**
3. **You should see your test contact!** 🎉

---

## ✅ That's It! You're Done!

Now every time you:
- ✅ **Add a contact** → See it in `contacts` table
- ✅ **Create a deal** → See it in `deals` table  
- ✅ **Add an activity** → See it in `activities` table
- ✅ **Drag a deal** between stages → See stage update in `deals` table
- ✅ **Complete a task** → See `completed = true` in `activities` table

---

## 📊 Quick View Queries

Want to see all your data at once? Use these queries in SQL Editor:

```sql
-- Count all records
SELECT 
  (SELECT COUNT(*) FROM contacts) as contacts,
  (SELECT COUNT(*) FROM deals) as deals,
  (SELECT COUNT(*) FROM activities) as activities;

-- See latest 10 contacts
SELECT first_name, last_name, email, budget_range, created_at 
FROM contacts 
ORDER BY created_at DESC 
LIMIT 10;

-- See all deals with details
SELECT 
  d.title,
  d.value,
  d.stage,
  c.first_name || ' ' || c.last_name as contact,
  p.name as platform
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN platforms p ON d.platform_id = p.id;
```

---

## 🆘 Troubleshooting

### "Table 'contacts' does not exist"
→ You need to run Step 2 SQL again

### "Permission denied for table contacts"  
→ Run the RLS policies part of Step 2 SQL again

### "No data appears in Supabase"
→ Check browser console (F12) for errors

### Data saves but doesn't show in CRM
→ Refresh the page, check console for errors

---

## 🎯 What Makes This Special

**Your CRM has ZERO local storage!** Everything goes directly to Supabase:

1. You add a contact → **Writes to Supabase**
2. CRM immediately → **Refetches from Supabase**
3. UI updates → **Shows data from Supabase**

**Result:** What you see in Supabase Table Editor is EXACTLY what's in your CRM. No sync issues, no cache, no local storage!

---

## 📚 More Details

- **Full Setup Guide:** See `DATABASE_SETUP.md`
- **Verification Guide:** See `VERIFY_DATABASE.md`
- **Admin Guide:** See `ADMIN_GUIDE.md`

---

**🎉 Congratulations!** Your CRM is now fully connected to Supabase with complete database visibility!