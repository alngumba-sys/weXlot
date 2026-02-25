# 📖 WeXlot CRM Database Documentation

## 🎯 Overview

Your WeXlot CRM is fully integrated with Supabase. **Every contact, deal, and activity you add is immediately saved to your Supabase database** with zero local caching.

## 🚀 Getting Started

### First Time Setup (5 minutes)

1. **Set up database tables** → See [`QUICK_START_DATABASE.md`](./QUICK_START_DATABASE.md)
2. **Enable Real-Time Sync** → ⚠️ **CRITICAL** for multi-machine sync!
3. **Verify it works** → See [`VERIFY_DATABASE.md`](./VERIFY_DATABASE.md)
4. **Start using the CRM** → See [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)

### ⚡ Multi-Machine Setup

If you're using the CRM on multiple computers/devices:

**MUST DO:** Enable Realtime in Supabase → See [`FIX_REALTIME_SYNC.md`](./FIX_REALTIME_SYNC.md)

Without this, changes on one machine won't appear on other machines until manual refresh!

---

## 📚 Documentation Files

### ⚡ Quick Start
**[`QUICK_START_DATABASE.md`](./QUICK_START_DATABASE.md)** - 5-minute setup guide
- Copy/paste SQL script
- Create all database tables
- Test with a sample contact
- See it in Supabase instantly

### 🔍 Verification Guide
**[`VERIFY_DATABASE.md`](./VERIFY_DATABASE.md)** - How to confirm data is saving
- Check Supabase Table Editor
- Run verification SQL queries
- Real-time testing instructions
- Troubleshooting common issues

### 📖 Complete Setup Guide
**[`DATABASE_SETUP.md`](./DATABASE_SETUP.md)** - Detailed database setup
- Complete SQL schema
- Row Level Security policies
- Sample data insertion
- Table structure explanation

### 🎛️ Admin Guide
**[`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)** - Full admin panel documentation
- How to access the admin panel
- Using all CRM features
- Managing images
- Database visibility

---

## 🗄️ Database Structure

Your CRM uses **7 Supabase tables**:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **staff** | Team members | name, email, role |
| **companies** | Business entities | name, industry, website |
| **contacts** | Your contacts | first_name, last_name, email, phone, budget_range |
| **platforms** | Your platforms | name (PillsUp, SalesUp, etc.) |
| **deals** | Pipeline deals | title, value, stage, contact_id, platform_id |
| **activities** | Tasks/reminders | type, description, due_date, completed |
| **interactions** | History log | type, notes, date, contact_id |

---

## ✨ Key Features

### ✅ Zero Local Storage
- No localStorage or sessionStorage
- No client-side caching
- All data comes directly from Supabase
- Single source of truth: The database

### ✅ Real-Time Sync
- Every action immediately writes to Supabase
- Automatic refetch after every write
- Live updates across multiple users
- No sync conflicts

### ✅ Full Database Visibility
- View all data in Supabase Table Editor
- Run SQL queries anytime
- Export data easily
- Complete transparency

### ✅ Drag-and-Drop Pipeline
- Move deals between stages
- Updates database instantly
- Changes are permanent
- Visible in Supabase immediately

---

## 🔄 How It Works

```
User Action → Write to Supabase → Refetch from Supabase → Update UI
     ↑                                                         ↓
     └─────────────────────────────────────────────────────────┘
                    (No local storage involved)
```

### Example: Adding a Contact
1. You fill out the contact form
2. Click "Save"
3. Data writes to Supabase `contacts` table
4. CRM refetches ALL contacts from Supabase
5. UI updates with fresh database data
6. You can see the contact in Supabase Table Editor

### Example: Moving a Deal
1. You drag a deal to "Won" stage
2. Database updates: `UPDATE deals SET stage = 'Won'`
3. CRM refetches ALL deals from Supabase
4. Pipeline updates with new stage
5. Check Supabase → stage column shows "Won"

---

## 🔗 Your Supabase Project

- **URL**: https://mtfsrlsccbmrekzthvmw.supabase.co
- **Database**: PostgreSQL
- **Storage Bucket**: `images` (for website images)
- **Tables**: 7 CRM tables + storage tables

---

## 🎯 Quick Access

### View Data in Supabase
1. Go to https://supabase.com/dashboard
2. Select project: `mtfsrlsccbmrekzthvmw`
3. Click **Table Editor**
4. Browse your tables

### Run SQL Queries
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Run queries like:
   ```sql
   SELECT * FROM contacts;
   SELECT * FROM deals;
   SELECT * FROM activities;
   ```

### Access Admin Panel
1. Open your WeXlot website
2. Click the **WeXlot logo**
3. Login: `Admin` / `Wexlot@2026`
4. Navigate to any tab (Dashboard, Pipeline, Contacts, Activities)

---

## 📊 Data Operations

### All operations go directly to Supabase:

| Action | What Happens | Database |
|--------|--------------|----------|
| Add Contact | INSERT into contacts | ✅ Visible immediately |
| Edit Contact | UPDATE contacts SET... | ✅ Visible immediately |
| Add Deal | INSERT into deals | ✅ Visible immediately |
| Move Deal | UPDATE deals SET stage | ✅ Visible immediately |
| Delete Deal | DELETE FROM deals | ✅ Removed immediately |
| Add Activity | INSERT into activities | ✅ Visible immediately |
| Complete Task | UPDATE activities SET completed | ✅ Visible immediately |

---

## 🆘 Need Help?

### Setup Issues
→ See [`QUICK_START_DATABASE.md`](./QUICK_START_DATABASE.md)

### Verification Issues
→ See [`VERIFY_DATABASE.md`](./VERIFY_DATABASE.md)

### Permission Errors
→ Check RLS policies in [`DATABASE_SETUP.md`](./DATABASE_SETUP.md)

### General Questions
→ See [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md)

---

## ✅ Success Checklist

Before using the CRM, make sure:

- [ ] Database tables created in Supabase
- [ ] RLS policies enabled
- [ ] Platforms inserted (PillsUp, SalesUp, etc.)
- [ ] Can access admin panel (click logo)
- [ ] Can log in (Admin / Wexlot@2026)
- [ ] Tested adding a contact → appears in Supabase
- [ ] Tested adding a deal → appears in Supabase
- [ ] Tested adding an activity → appears in Supabase
- [ ] No errors in browser console

---

## 🎉 You're All Set!

Once the database is set up:
1. ✅ Add contacts → See them in `contacts` table
2. ✅ Create deals → See them in `deals` table
3. ✅ Add activities → See them in `activities` table
4. ✅ Move deals → See stage changes in database
5. ✅ Complete tasks → See completed=true in database

**Everything is in Supabase. No hidden data. Complete transparency.**

---

## 📞 Support

- Database setup help: `QUICK_START_DATABASE.md`
- Troubleshooting: `VERIFY_DATABASE.md`
- Complete reference: `DATABASE_SETUP.md`
- Admin features: `ADMIN_GUIDE.md`

Happy CRM-ing! 🚀