# 🔧 Fix Contact Deletion - Add CASCADE DELETE

## Problem

When deleting a contact with associated deals, you get this error:

```
❌ Error: update or delete on table "contacts" violates foreign key constraint 
"deals_contact_id_fkey" on table "deals"
```

**Why?** The database prevents deleting contacts that have deals, activities, or interactions.

---

## ✅ Quick Fix (30 seconds)

Run this SQL in **Supabase SQL Editor**:

```sql
-- Fix deals foreign key to cascade delete
ALTER TABLE deals 
DROP CONSTRAINT IF EXISTS deals_contact_id_fkey;

ALTER TABLE deals 
ADD CONSTRAINT deals_contact_id_fkey 
FOREIGN KEY (contact_id) 
REFERENCES contacts(id) 
ON DELETE CASCADE;

-- Fix activities foreign key to cascade delete
ALTER TABLE activities 
DROP CONSTRAINT IF EXISTS activities_contact_id_fkey;

ALTER TABLE activities 
ADD CONSTRAINT activities_contact_id_fkey 
FOREIGN KEY (contact_id) 
REFERENCES contacts(id) 
ON DELETE CASCADE;

-- Fix interactions foreign key to cascade delete (if it exists)
ALTER TABLE interactions 
DROP CONSTRAINT IF EXISTS interactions_contact_id_fkey;

ALTER TABLE interactions 
ADD CONSTRAINT interactions_contact_id_fkey 
FOREIGN KEY (contact_id) 
REFERENCES contacts(id) 
ON DELETE CASCADE;
```

✅ **Done!** You can now delete contacts, and all their deals/activities/interactions will be automatically deleted too.

---

## What This Does

**Before:**
- Contact has 3 deals → Can't delete contact ❌
- Contact has 2 activities → Can't delete contact ❌
- Must manually delete all deals first, then activities, then contact 😫

**After:**
- Contact has 3 deals → Delete contact → Deals automatically deleted ✅
- Contact has 2 activities → Delete contact → Activities automatically deleted ✅
- One click deletes everything! 🎉

---

## CASCADE DELETE Behavior

When you delete a contact, **CASCADE** automatically deletes:

1. **All deals** associated with that contact
2. **All activities** associated with that contact  
3. **All interactions** associated with that contact

**Example:**
```
Contact: "John Doe"
  ├─ Deal: "Website Redesign" ($5,000)
  ├─ Deal: "Mobile App" ($10,000)
  ├─ Activity: "Follow-up call"
  └─ Interaction: "Email sent"

Delete "John Doe" → All 4 items deleted automatically ✅
```

---

## Safety

**Q: Is this safe?**  
✅ Yes! When you delete a contact, you want their deals/activities gone too.

**Q: What if I delete by accident?**  
⚠️ There's a confirmation dialog, but **deletion is permanent**. Consider adding soft delete later (a "deleted" flag instead of actual deletion).

**Q: What about other contacts in the same deals?**  
✅ Each deal belongs to ONE contact. If that contact is deleted, the deal should be deleted too.

---

## Verify It Worked

```sql
-- Check the foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'contacts';
```

**Expected output:**
```
constraint_name              | table_name   | column_name | foreign_table_name | foreign_column_name | delete_rule
-----------------------------|--------------|-------------|--------------------|--------------------|-------------
deals_contact_id_fkey        | deals        | contact_id  | contacts           | id                 | CASCADE
activities_contact_id_fkey   | activities   | contact_id  | contacts           | id                 | CASCADE
interactions_contact_id_fkey | interactions | contact_id  | contacts           | id                 | CASCADE
```

✅ All should show `delete_rule = CASCADE`

---

## Test It

1. Create a test contact
2. Create a deal for that contact
3. Go to Contacts → Delete the contact
4. **Both contact AND deal are deleted** ✅
5. Check Supabase Table Editor → both gone from database ✅

---

## Other Tables to Check

If you have other tables referencing `contacts`, you may need to add CASCADE there too:

```sql
-- Find all foreign keys pointing to contacts
SELECT
  tc.table_name,
  kcu.column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = 'contacts';
```

---

## Summary

**The Fix:**
```sql
ALTER TABLE deals DROP CONSTRAINT IF EXISTS deals_contact_id_fkey;
ALTER TABLE deals ADD CONSTRAINT deals_contact_id_fkey 
FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_contact_id_fkey;
ALTER TABLE activities ADD CONSTRAINT activities_contact_id_fkey 
FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;
```

**Where:** Supabase SQL Editor

**Time:** 30 seconds

**Result:** Deleting a contact now cascades to all related records! ✅
