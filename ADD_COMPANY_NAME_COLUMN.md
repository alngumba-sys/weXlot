# 🔧 Add company_name Column to Contacts Table

## Problem

The "Business Name" field in contacts is not saving or displaying because the database is missing the `company_name` column.

---

## ✅ Quick Fix (10 seconds)

Run this SQL in **Supabase SQL Editor**:

```sql
-- Add company_name column to contacts table
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS company_name TEXT;
```

✅ **Done!** You can now enter and see business names for contacts.

---

## What This Does

Adds a simple text field to store the business/company name directly on the contact record.

**Examples:**
- "Acme Corp"
- "Drill Ltd"
- "Tech Innovations Kenya"

---

## Why This Approach?

Instead of requiring users to create a full Company record (with industry, size, website, etc.), this allows quick entry of just the company name as text.

**Benefits:**
- ✅ Faster data entry
- ✅ No need to manage separate Companies table
- ✅ Perfect for simple contact management

**The existing `company_id` field** is still available if you want to link to the full Companies table later.

---

## Verify It Worked

```sql
-- Check if the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
AND column_name = 'company_name';
```

**Expected output:**
```
column_name   | data_type
--------------|----------
company_name  | text
```

---

## Test It

1. Open CRM → Contacts → Add Contact
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Company: `Acme Corp` ← This field now works!
3. Click Save
4. **Business Name column shows "Acme Corp"** ✅

---

## Display Priority

The table will show business names in this order:
1. `company_name` (text field) - **Primary**
2. `company.name` (from joined Companies table) - Fallback
3. "No Company" - If both are empty

This means:
- New contacts use the simple text field
- Old contacts with linked Companies still work
- Best of both worlds! 🎉

---

## Already Have Contacts?

This migration is **safe to run**. Existing contacts will have `company_name = NULL` until you edit them and add a company name.

---

## Summary

**The Fix:**
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company_name TEXT;
```

**Where:** Supabase SQL Editor

**Time:** 10 seconds

**Result:** Business names now save and display correctly! ✅
