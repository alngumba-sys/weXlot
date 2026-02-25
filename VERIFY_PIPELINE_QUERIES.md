# 📊 SQL Queries to Verify Pipeline Deals are Saving

Copy these queries into **Supabase SQL Editor** to verify your pipeline deals are in the database.

---

## Query 1: Count Total Deals

```sql
-- How many deals are in the database?
SELECT COUNT(*) as total_deals FROM deals;
```

**Expected:** Should match the number of deals you see in your Pipeline view.

---

## Query 2: See All Deals (Simple View)

```sql
-- Show all deals with basic info
SELECT 
  title,
  value,
  stage,
  created_at,
  updated_at
FROM deals
ORDER BY created_at DESC;
```

**What to look for:**
- `title` - Deal names you created
- `value` - Dollar amounts
- `stage` - Lead, Qualified, Proposal, Negotiation, Won, Lost
- `updated_at` - Should be recent if you just moved a deal

---

## Query 3: See All Deals with Full Details

```sql
-- Show all deals with contact names, platform names, etc.
SELECT 
  d.title as deal_name,
  d.value as deal_value,
  d.stage,
  c.first_name || ' ' || c.last_name as contact_name,
  co.name as company_name,
  p.name as platform_name,
  s.name as owner_name,
  d.created_at,
  d.updated_at
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN companies co ON d.company_id = co.id
LEFT JOIN platforms p ON d.platform_id = p.id
LEFT JOIN staff s ON d.owner_id = s.id
ORDER BY d.created_at DESC;
```

**What to look for:**
- Contact names linked to deals
- Platform names (PillsUp, SalesUp, HotelierUp, etc.)
- All the details you entered

---

## Query 4: Count Deals by Stage

```sql
-- How many deals in each stage?
SELECT 
  stage,
  COUNT(*) as deal_count,
  SUM(value) as total_value
FROM deals
GROUP BY stage
ORDER BY 
  CASE stage
    WHEN 'Lead' THEN 1
    WHEN 'Qualified' THEN 2
    WHEN 'Proposal' THEN 3
    WHEN 'Negotiation' THEN 4
    WHEN 'Won' THEN 5
    WHEN 'Lost' THEN 6
  END;
```

**What to look for:**
This should match your Pipeline columns:
- Lead: X deals, $Y value
- Qualified: X deals, $Y value
- Won: X deals, $Y value

---

## Query 5: See Recently Added Deals (Last 10)

```sql
-- Show the 10 most recently created deals
SELECT 
  title,
  value,
  stage,
  created_at
FROM deals
ORDER BY created_at DESC
LIMIT 10;
```

**What to look for:**
- The deal you just added should be at the top
- `created_at` should be very recent (last few minutes)

---

## Query 6: See Recently Modified Deals

```sql
-- Show the 10 most recently updated deals
SELECT 
  title,
  value,
  stage,
  updated_at,
  created_at
FROM deals
ORDER BY updated_at DESC
LIMIT 10;
```

**What to look for:**
- If you just moved a deal, it should be at the top
- `updated_at` should be very recent

---

## Query 7: Find a Specific Deal by Name

```sql
-- Replace 'Your Deal Name' with the actual deal title
SELECT 
  d.*,
  c.first_name || ' ' || c.last_name as contact_name,
  p.name as platform_name
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN platforms p ON d.platform_id = p.id
WHERE d.title ILIKE '%Your Deal Name%';
```

**Example:**
```sql
-- Find deals containing "PillsUp"
SELECT title, value, stage FROM deals WHERE title ILIKE '%PillsUp%';
```

---

## Query 8: See Deals by Platform

```sql
-- Show all deals grouped by platform
SELECT 
  p.name as platform,
  COUNT(d.id) as deal_count,
  SUM(d.value) as total_value
FROM platforms p
LEFT JOIN deals d ON d.platform_id = p.id
GROUP BY p.name
ORDER BY total_value DESC NULLS LAST;
```

**What to look for:**
- PillsUp: X deals, $Y value
- SmartLenderUp: X deals, $Y value
- SalesUp: X deals, $Y value

---

## Query 9: Complete Deal Details (Everything!)

```sql
-- Show EVERYTHING about all deals
SELECT 
  d.id,
  d.title,
  d.value,
  d.stage,
  d.probability,
  d.expected_close_date,
  c.first_name || ' ' || c.last_name as contact,
  c.email as contact_email,
  co.name as company,
  p.name as platform,
  s.name as owner,
  d.created_at,
  d.updated_at
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN companies co ON d.company_id = co.id
LEFT JOIN platforms p ON d.platform_id = p.id
LEFT JOIN staff s ON d.owner_id = s.id
ORDER BY d.created_at DESC;
```

---

## Query 10: Check if a Deal Updated in Last 5 Minutes

```sql
-- See deals modified in the last 5 minutes
SELECT 
  title,
  stage,
  updated_at,
  NOW() - updated_at as time_since_update
FROM deals
WHERE updated_at > NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC;
```

**What to look for:**
- If you just moved a deal, it should appear here
- `time_since_update` should be very small (seconds/minutes)

---

## 🧪 Quick Test Workflow

### Test 1: Add a New Deal

**Before:**
```sql
SELECT COUNT(*) FROM deals;
-- Note the count (e.g., 5)
```

**Action:** Add a deal in CRM Pipeline

**After:**
```sql
SELECT COUNT(*) FROM deals;
-- Should be 6 now ✅
```

**Verify Details:**
```sql
SELECT * FROM deals ORDER BY created_at DESC LIMIT 1;
-- Should show your new deal ✅
```

---

### Test 2: Move a Deal

**Before:**
```sql
SELECT title, stage, updated_at FROM deals WHERE title = 'Your Deal Name';
-- Note the current stage and time
```

**Action:** Drag the deal to a different stage in Pipeline

**After:**
```sql
SELECT title, stage, updated_at FROM deals WHERE title = 'Your Deal Name';
-- Stage should be different ✅
-- updated_at should be newer ✅
```

---

### Test 3: Delete a Deal

**Before:**
```sql
SELECT COUNT(*) FROM deals;
-- Note the count
```

**Action:** Delete a deal in CRM

**After:**
```sql
SELECT COUNT(*) FROM deals;
-- Should be 1 less ✅
```

---

## 🎯 One-Query Dashboard View

**This single query shows everything you need:**

```sql
-- Complete Pipeline Dashboard
SELECT 
  '📊 Total Deals' as metric,
  COUNT(*)::text as value
FROM deals
UNION ALL
SELECT 
  '💰 Total Value',
  '$' || SUM(value)::text
FROM deals
UNION ALL
SELECT 
  '🎯 ' || stage,
  COUNT(*)::text || ' deals ($' || COALESCE(SUM(value), 0)::text || ')'
FROM deals
GROUP BY stage
ORDER BY metric;
```

**Example Output:**
```
metric                 | value
-----------------------|------------------
📊 Total Deals         | 12
💰 Total Value         | $285000
🎯 Lead                | 3 deals ($45000)
🎯 Qualified           | 2 deals ($30000)
🎯 Negotiation         | 4 deals ($80000)
🎯 Won                 | 3 deals ($130000)
```

---

## ✅ What Success Looks Like

Run this query:

```sql
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Pipeline deals are saving to database!'
    ELSE '❌ No deals found in database'
  END as status,
  COUNT(*) as total_deals,
  MAX(created_at) as last_deal_added,
  MAX(updated_at) as last_deal_modified
FROM deals;
```

**If you see:**
- `✅ Pipeline deals are saving to database!`
- `total_deals` > 0
- Recent timestamps

**Then everything is working!** 🎉

---

## ❌ What Failure Looks Like

**Scenario 1: Table doesn't exist**
```sql
SELECT COUNT(*) FROM deals;
-- ERROR: relation "deals" does not exist
```
👉 **Solution:** Run the setup SQL from `QUICK_START_DATABASE.md`

**Scenario 2: Table exists but empty**
```sql
SELECT COUNT(*) FROM deals;
-- Result: 0
```
👉 **Solution:** 
- Add a deal in the CRM
- Check browser console for errors
- Verify RLS policies are set

**Scenario 3: Count doesn't match CRM**
```sql
SELECT COUNT(*) FROM deals;  -- Shows 3
```
But CRM shows 5 deals
👉 **Solution:** Refresh the CRM page, check for duplicate data

---

## 🔍 Troubleshooting Query

**Run this to diagnose issues:**

```sql
-- Diagnostic Query
SELECT 
  'deals table exists' as check_type,
  CASE WHEN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'deals'
  ) THEN '✅ Yes' ELSE '❌ No' END as status
UNION ALL
SELECT 
  'deals table has data',
  CASE WHEN (SELECT COUNT(*) FROM deals) > 0 
    THEN '✅ Yes (' || (SELECT COUNT(*) FROM deals)::text || ' deals)' 
    ELSE '❌ No deals found' 
  END
UNION ALL
SELECT 
  'RLS enabled on deals',
  CASE WHEN (
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'deals'
  ) > 0 THEN '✅ Yes' ELSE '❌ No' END
UNION ALL
SELECT 
  'Realtime enabled on deals',
  CASE WHEN EXISTS (
    SELECT FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'deals'
  ) THEN '✅ Yes' ELSE '❌ No' END;
```

**Expected output:**
```
check_type                 | status
---------------------------|-------------------
deals table exists         | ✅ Yes
deals table has data       | ✅ Yes (8 deals)
RLS enabled on deals       | ✅ Yes
Realtime enabled on deals  | ✅ Yes
```

---

## 📋 Copy-Paste Quick Check

**The absolute fastest way to verify:**

```sql
-- Show me my last 5 deals
SELECT 
  title, 
  value, 
  stage, 
  created_at 
FROM deals 
ORDER BY created_at DESC 
LIMIT 5;
```

If this shows your deals, **everything is working!** ✅

---

## Summary

**Start with Query 2** (See All Deals) - if you see your deals there, the pipeline is definitely saving to the database.

**For detailed verification**, use Query 3 (Full Details) to see deals with contact and platform names.

**To test if updates are working**, use Query 6 (Recently Modified) after dragging a deal to a different stage.

That's it! 🎉
