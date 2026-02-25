# How to Verify Data is Saving to Database

This guide shows you how to confirm that contacts, pipeline deals, and activities are being saved to your Supabase database.

## Quick Verification Steps

### Method 1: Supabase Table Editor (Easiest)

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project: `mtfsrlsccbmrekzthvmw`

2. **Navigate to Table Editor**
   - Click **Table Editor** in the left sidebar
   - You'll see all your tables listed

3. **Check Each Table**
   - Click on **contacts** - You should see all contacts you've added
   - Click on **deals** - You should see all pipeline deals
   - Click on **activities** - You should see all tasks/activities
   - Click on **companies** - You should see all companies
   - Click on **platforms** - You should see all platforms (PillsUp, SalesUp, etc.)

### Method 2: SQL Queries (More Detailed)

1. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run Verification Queries**

```sql
-- Check total record counts
SELECT 
  (SELECT COUNT(*) FROM contacts) as total_contacts,
  (SELECT COUNT(*) FROM deals) as total_deals,
  (SELECT COUNT(*) FROM activities) as total_activities,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM platforms) as total_platforms;

-- View latest contacts
SELECT 
  first_name || ' ' || last_name as name,
  email,
  phone,
  budget_range,
  created_at
FROM contacts
ORDER BY created_at DESC
LIMIT 10;

-- View all deals with full details
SELECT 
  d.title,
  d.value,
  d.stage,
  c.first_name || ' ' || c.last_name as contact_name,
  p.name as platform,
  d.created_at
FROM deals d
LEFT JOIN contacts c ON d.contact_id = c.id
LEFT JOIN platforms p ON d.platform_id = p.id
ORDER BY d.created_at DESC;

-- View activities
SELECT 
  type,
  description,
  due_date,
  completed,
  created_at
FROM activities
ORDER BY due_date;
```

### Method 3: Real-Time Test

1. **Open WeXlot CRM Dashboard**
   - Click the WeXlot logo to open admin panel
   - Login with credentials

2. **Add a Test Contact**
   - Go to Contacts tab
   - Click "Add Contact"
   - Fill in details and save

3. **Immediately Check Supabase**
   - Open Supabase Table Editor in another tab
   - Click on `contacts` table
   - Hit refresh (or it auto-updates)
   - **You should see your new contact instantly!**

4. **Add a Test Deal**
   - Go to Pipeline tab
   - Add a new deal
   - Immediately check Supabase `deals` table
   - **You should see your new deal!**

5. **Add a Test Activity**
   - Go to Activities tab
   - Create a new task
   - Check Supabase `activities` table
   - **You should see your new activity!**

## What You Should See

### Contacts Table
| id | first_name | last_name | email | phone | budget_range | created_at |
|----|------------|-----------|-------|-------|--------------|------------|
| uuid | John | Doe | john@example.com | +1234567890 | $10k-$25k | 2026-02-25... |

### Deals Table
| id | title | value | stage | contact_id | platform_id | created_at |
|----|-------|-------|-------|------------|-------------|------------|
| uuid | PillsUp Implementation | 15000 | Negotiation | uuid | uuid | 2026-02-25... |

### Activities Table
| id | type | description | due_date | completed | created_at |
|----|------|-------------|----------|-----------|------------|
| uuid | Call | Follow up call | 2026-02-26... | false | 2026-02-25... |

## Common Issues

### ❌ "Table doesn't exist"
**Solution:** You need to run the database setup first. See `DATABASE_SETUP.md`

### ❌ "No data showing up"
**Possible causes:**
1. Tables not created - Run setup SQL from `DATABASE_SETUP.md`
2. RLS policies not set - Run the RLS policy SQL
3. Console errors - Check browser console for errors
4. Wrong Supabase project - Verify you're on `mtfsrlsccbmrekzthvmw`

### ❌ "Permission denied" errors
**Solution:** 
1. Run the RLS policy setup from `DATABASE_SETUP.md`
2. Make sure policies allow all operations (or adjust as needed)

### ✅ Data appears briefly then disappears
**This is normal!** The CRM refetches from database after every write. If data disappears, check:
1. Browser console for errors
2. Supabase logs in Dashboard > Logs

## Testing the Complete Flow

### Test 1: Add a Contact
```
1. WeXlot CRM → Contacts → Add Contact
2. Fill: "Jane Smith", "jane@test.com", "$25k-$50k"
3. Save
4. Supabase → Table Editor → contacts → You should see Jane Smith
```

### Test 2: Add a Deal to Pipeline
```
1. WeXlot CRM → Pipeline → Add Deal
2. Select contact: Jane Smith
3. Platform: PillsUp
4. Value: $30,000
5. Save
6. Supabase → Table Editor → deals → You should see the deal
```

### Test 3: Drag Deal Between Stages
```
1. WeXlot CRM → Pipeline → Drag deal to "Won"
2. Supabase → Table Editor → deals → Refresh
3. Stage column should show "Won"
```

### Test 4: Add an Activity
```
1. WeXlot CRM → Activities → Add Task
2. Type: "Meeting"
3. Description: "Product demo"
4. Save
5. Supabase → Table Editor → activities → You should see the task
```

## Browser Console Verification

Open browser console (F12) and look for these logs:

```
[CRM 2026-02-25...] 🔄 Fetching all data directly from Supabase database...
[CRM 2026-02-25...] ✓ Successfully fetched from Supabase: {
  staff: 2,
  contacts: 5,
  deals: 3,
  activities: 7,
  ...
}
```

These logs confirm data is being fetched from the database.

## Real-Time Updates

The CRM uses Supabase real-time subscriptions. When you:
- Add a contact → Database updates → CRM refetches → UI updates
- Move a deal → Database updates → CRM refetches → UI updates  
- Complete an activity → Database updates → CRM refetches → UI updates

**Everything goes through the database!** No local storage means you can always verify data in Supabase.

## Success Checklist

- [ ] Tables created in Supabase
- [ ] RLS policies enabled
- [ ] Can add contacts and see them in `contacts` table
- [ ] Can add deals and see them in `deals` table
- [ ] Can add activities and see them in `activities` table
- [ ] Can drag deals between stages and see stage update in database
- [ ] Can complete activities and see completed=true in database
- [ ] Browser console shows successful fetch logs
- [ ] No errors in browser console

## Need Help?

If data still isn't showing up:

1. **Check browser console** for errors (F12)
2. **Check Supabase logs**: Dashboard → Logs
3. **Verify table structure**: Compare with `DATABASE_SETUP.md`
4. **Test with SQL**: Use SQL Editor to manually insert data
5. **Check RLS policies**: Make sure policies allow operations

---

**Remember:** Every single operation (create, update, delete) goes directly to Supabase. There is NO local caching or localStorage. What you see in Supabase is exactly what the CRM shows!
