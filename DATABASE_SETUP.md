# WeXlot CRM Database Setup Guide

This guide will help you set up all required database tables in Supabase so you can see contacts, pipeline deals, and activities in your database.

## Prerequisites

1. You already have a Supabase project connected
2. Your Supabase URL: `https://mtfsrlsccbmrekzthvmw.supabase.co`

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (`mtfsrlsccbmrekzthvmw`)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Database Schema

Copy and paste the following SQL script into the SQL Editor and click **RUN**:

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
  location TEXT,
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
```

### Step 3: Enable Row Level Security (RLS)

After creating the tables, you need to enable RLS and set up policies. Run this SQL:

```sql
-- Enable Row Level Security on all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust based on your security needs)
-- Staff policies
CREATE POLICY "Enable all operations for staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- Companies policies
CREATE POLICY "Enable all operations for companies" ON companies FOR ALL USING (true) WITH CHECK (true);

-- Contacts policies
CREATE POLICY "Enable all operations for contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);

-- Platforms policies
CREATE POLICY "Enable all operations for platforms" ON platforms FOR ALL USING (true) WITH CHECK (true);

-- Deals policies
CREATE POLICY "Enable all operations for deals" ON deals FOR ALL USING (true) WITH CHECK (true);

-- Activities policies
CREATE POLICY "Enable all operations for activities" ON activities FOR ALL USING (true) WITH CHECK (true);

-- Interactions policies
CREATE POLICY "Enable all operations for interactions" ON interactions FOR ALL USING (true) WITH CHECK (true);
```

### Step 4: Add Sample Data (Optional)

If you want to test with some sample data, run this:

```sql
-- Insert sample platforms
INSERT INTO platforms (name) VALUES 
  ('PillsUp'),
  ('SmartLenderUp'),
  ('HotelierUp'),
  ('SalesUp'),
  ('WeXlot')
ON CONFLICT (name) DO NOTHING;

-- Insert sample staff
INSERT INTO staff (name, email, role) VALUES 
  ('Admin User', 'admin@wexlot.com', 'admin'),
  ('Sales Rep', 'sales@wexlot.com', 'staff')
ON CONFLICT (email) DO NOTHING;
```

### Step 5: Verify Tables

1. Go to **Table Editor** in the left sidebar
2. You should see all 7 tables:
   - `staff`
   - `companies`
   - `contacts`
   - `platforms`
   - `deals`
   - `activities`
   - `interactions`

## How to View Your Data

### Via Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Click on any table name to view its contents
3. When you add contacts, deals, or activities through the WeXlot CRM interface, they will appear here immediately

### Via SQL Editor

You can run queries to see your data:

```sql
-- View all contacts
SELECT * FROM contacts;

-- View all deals with related data
SELECT 
  d.*,
  c.first_name || ' ' || c.last_name as contact_name,
  p.name as platform_name
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN platforms p ON d.platform_id = p.id;

-- View all activities
SELECT * FROM activities ORDER BY due_date;
```

## Troubleshooting

### Tables Not Creating?
- Make sure you're logged into the correct Supabase project
- Check for any error messages in the SQL Editor

### Can't See Data After Adding?
- Check the Table Editor
- Make sure RLS policies are set correctly
- Check browser console for any errors

### Permission Errors?
- Make sure you ran the RLS policies script
- The policies above allow all operations - adjust based on your security needs

## Next Steps

After setup is complete:

1. ✅ All tables are created and ready
2. ✅ Add contacts through the CRM interface
3. ✅ Create deals in the pipeline
4. ✅ Add activities and tasks
5. ✅ View everything in Supabase Table Editor in real-time

All data operations go directly to the database - no local storage - ensuring you can always see your data in Supabase!