# 🚨 URGENT FIX: Contact Location Error

## The Error You're Getting

```
[CRM] Error adding contact: {
  "code": "PGRST204",
  "message": "Could not find the 'location' column of 'contacts' in the schema cache"
}
```

---

## ✅ Immediate Fix (Copy & Paste - 10 seconds)

**Run this in Supabase SQL Editor:**

```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS location TEXT;
```

**That's it!** The error will be gone. ✅

---

## How to Run It

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select project: `mtfsrlsccbmrekzthvmw`

2. **Open SQL Editor**
   - Click **SQL Editor** (left sidebar)
   - Click **New Query**

3. **Paste the SQL**
   ```sql
   ALTER TABLE contacts ADD COLUMN IF NOT EXISTS location TEXT;
   ```

4. **Click RUN**
   - Should see: "Success. No rows returned"

5. **Done!**
   - Try adding a contact again
   - Error should be gone

---

## Verify It Worked

**Run this to confirm:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
AND column_name = 'location';
```

**Expected result:**
```
column_name
-----------
location
```

If you see this, the fix worked! ✅

---

## Why This Happened

The CRM app expects a `location` field on contacts (for storing city/address), but your database table was missing this column. Adding it fixes the error.

---

## Test It

1. Open CRM → Contacts
2. Click "Add Contact"
3. Fill in all fields including:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Location: `Nairobi, Kenya` ← This field now works!
4. Click Save

**No errors!** 🎉

---

## Summary

**The Fix:**
```sql
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS location TEXT;
```

**Where:** Supabase SQL Editor

**Time:** 10 seconds

**Result:** Can now add contacts with location data!

---

For more details, see `FIX_MISSING_LOCATION_COLUMN.md`
