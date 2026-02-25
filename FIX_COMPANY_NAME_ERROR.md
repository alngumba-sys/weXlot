# ✅ Fix: Add company_name Column to Contacts Table

## Problem

When trying to add a contact, you get this error:

```
❌ Error: Could not find the 'company_name' column of 'contacts' in the schema cache
```

**Why?** The `company_name` column hasn't been added to the contacts table yet.

---

## 🚀 Quick Fix (30 seconds)

### Run this SQL in Supabase SQL Editor:

```sql
-- Add the company_name column to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS company_name TEXT;
```

**That's it!** ✅

---

## ✅ Verify It Worked

Run this query to check the column was added:

```sql
-- Check if company_name column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts' AND column_name = 'company_name';
```

**Expected output:**
```
column_name   | data_type | is_nullable
--------------|-----------|------------
company_name  | text      | YES
```

---

## 🧪 Test It

1. **Go to CRM → Contacts**
2. **Click "Add Contact"**
3. **Fill in the form:**
   - First Name: `John`
   - Last Name: `Doe`
   - Business name: `Acme Corp` ← This is what goes into `company_name`
   - Phone: `555-1234`
   - Budget: `$10k-$25k`
4. **Click "Save"**
5. **No error!** ✅
6. **Check Supabase Table Editor → contacts → See the business name in `company_name` column** ✅

---

## 📊 What Is company_name?

### **Background:**

The contacts table has TWO ways to store company information:

1. **`company_id`** - Foreign key reference to the `companies` table (for formal companies)
2. **`company_name`** - Simple text field for business name (simpler, faster)

### **Why company_name?**

**Before (using company_id):**
```
User enters "Acme Corp" → Create company record → Get company ID → Save contact with company_id
→ Complex, slow, creates orphan companies
```

**After (using company_name):**
```
User enters "Acme Corp" → Save directly in company_name field
→ Simple, fast, no extra records
```

---

## 📋 Database Schema

### **Contacts Table (Updated):**

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_id UUID REFERENCES companies(id),  ← Old way (optional)
  company_name TEXT,                         ← NEW! Simple text field
  position TEXT,
  location TEXT,
  budget DECIMAL(15, 2),
  timeline TEXT,
  pain_points TEXT,
  decision_authority TEXT,
  notes TEXT,
  owner_id UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

---

## 🔧 Files Updated

All database setup files now include `company_name` from the start:

1. ✅ `/ADD_COMPANY_NAME_COLUMN.sql` (NEW) - Quick fix SQL
2. ✅ `/QUICK_START_DATABASE.md` - Updated schema
3. ✅ `/DATABASE_SETUP.md` - Updated schema
4. ✅ `/FIX_COMPANY_NAME_ERROR.md` (this file)

---

## 📝 How It Works Now

### **Add Contact Form:**

```typescript
// When user fills out the form:
{
  first_name: "John",
  last_name: "Doe",
  company_name: "Acme Corp",  ← Saved directly as text
  phone: "555-1234",
  budget: 15000,
  // ... other fields
}
```

### **Saved to Database:**

```sql
INSERT INTO contacts (first_name, last_name, company_name, phone, budget)
VALUES ('John', 'Doe', 'Acme Corp', '555-1234', 15000);
```

### **Display in Contacts Table:**

| Name | Business name | Phone | Location | Budget | Notes |
|------|---------------|-------|----------|--------|-------|
| John Doe | **Acme Corp** | 555-1234 | New York | $15,000 | Follow up next week |

---

## ⚠️ Important Notes

### **Migration Required**

If you already have a contacts table, you **must run the migration SQL** above. Just creating new tables won't fix existing tables.

### **Safe to Run Multiple Times**

The SQL uses `IF NOT EXISTS`, so it's safe to run multiple times:

```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_name TEXT;
```

**First run:** Adds the column ✅  
**Second run:** Does nothing (column already exists) ✅  
**Third run:** Still safe! ✅

---

## 🆘 Troubleshooting

### Still Getting the Error?

**1. Make sure you ran the migration:**
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_name TEXT;
```

**2. Verify the column exists:**
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'contacts';
```

You should see `company_name` in the list.

**3. Refresh your app:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or close and reopen the browser tab

**4. Check Supabase cache:**
Sometimes Supabase needs a moment to update its schema cache. Wait 10 seconds and try again.

---

## 🎯 Summary

**The Problem:**
- Contact form tries to save `company_name` field
- But `company_name` column doesn't exist in database
- Error: "Could not find the 'company_name' column"

**The Solution:**
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_name TEXT;
```

**The Result:**
- ✅ Contact form works perfectly
- ✅ Business names save correctly
- ✅ Business names display in contacts table
- ✅ No more schema errors

**Time to Fix:** 30 seconds

**Run the SQL above and you're done!** 🎉
