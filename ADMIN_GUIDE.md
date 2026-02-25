# WeXlot Admin Panel Guide

## ⚠️ IMPORTANT: First Time Setup

### 1. Supabase Storage Setup (For Images)

Before you can upload images, you must create a storage bucket in Supabase:

1. Go to https://mtfsrlsccbmrekzthvmw.supabase.co (your Supabase Dashboard)
2. Click on **Storage** in the left sidebar
3. Click the **"New bucket"** button
4. Name the bucket: `images`
5. Check the **"Public bucket"** option ✓
6. Click **"Create bucket"**
7. Done! You can now upload images

### 2. Database Setup (For CRM)

Before you can use the CRM features (contacts, deals, activities), you must set up the database tables:

**Quick Setup:** See `QUICK_START_DATABASE.md` for a 5-minute setup guide.

**Detailed Setup:** See `DATABASE_SETUP.md` for complete instructions.

**Verification:** See `VERIFY_DATABASE.md` to confirm data is saving properly.

---

## Accessing the Admin Panel

The admin panel is accessed by clicking the **WeXlot logo** anywhere on the page. Just one click opens the admin panel instantly.

### Steps:
1. Navigate to the website
2. Click the WeXlot logo (in the top-left corner)
3. The admin panel will open automatically

## Admin Credentials

**Username:** `Admin`  
**Password:** `Wexlot@2026`

---

## CRM Features

Once logged in, you have access to a full CRM system with real-time Supabase integration:

### 📊 Dashboard
- View total contacts, active deals, and upcoming activities
- See revenue metrics and conversion rates
- Quick overview of your sales pipeline

### 🎯 Pipeline
- Visual kanban board with drag-and-drop functionality
- Stages: Lead, Qualified, Proposal, Negotiation, Won, Lost
- Deals grouped by Platform, then by Contact
- Shows total value and per-platform totals
- Move deals between stages with a simple drag

### 👥 Contacts
- Table view with columns: Name, Business, Phone, Location, Pain Point/Notes
- Budget amounts shown below each contact name
- Add new contacts with detailed information
- Click any contact to edit details

### 📅 Activities
- Manage tasks, calls, meetings, and emails
- Set due dates and track completion status
- Link activities to specific contacts and deals
- Mark activities as complete with one click

### ⚙️ Settings
- Manage team members (staff)
- Configure platforms (PillsUp, SalesUp, etc.)
- System configuration options

### 🖼️ Website Images
- Upload and manage all website images
- Real-time preview and updates
- Supabase storage integration

---

## Managing Images

Once logged in, navigate to the **Website Images** tab to manage images.

### Available Images:
1. **WeXlot Logo** - Main company logo (67x67px recommended)
2. **Workspace Dashboard Image** - Center workspace illustration
3. **ScissorUp Platform Logo** - Barbershop & Salons platform (199x79px)
4. **SmartLenderUp Platform Logo** - Loans platform (161x79px)
5. **TillsUp Platform Logo** - POS platform (128x79px)
6. **PillsUp Platform Logo** - Pharmacy platform (161x79px)
7. **HotelierUp Platform Logo** - Hospitality platform (161x79px)
8. **SalesUp Platform Logo** - Sales platform (161x79px)
9. **Philosophy Section Image** - Philosophy section background (320px wide)

### Upload Instructions:
1. Click on the upload area for the image you want to replace
2. Select your image file (PNG, JPG, or SVG recommended)
3. Click "Save Changes" button
4. Wait for the upload confirmation
5. Changes appear immediately

### Image Guidelines:
- Keep file sizes under 2MB for optimal performance
- Use PNG for logos with transparency
- Use JPG for photographs
- Maintain recommended dimensions for best results
- Images are stored permanently in Supabase Storage

---

## CRM Data Management

### Adding Contacts
1. Go to **Contacts** tab
2. Click **"Add Contact"** button
3. Fill in contact details (name, email, phone, budget, etc.)
4. Click **Save**
5. Contact is immediately saved to Supabase database

### Creating Deals
1. Go to **Pipeline** tab
2. Click **"Add Deal"** button
3. Select a contact
4. Choose a platform (PillsUp, SalesUp, etc.)
5. Enter deal value and details
6. Click **Save**
7. Deal appears in the pipeline

### Managing Activities
1. Go to **Activities** tab
2. Click **"Add Activity"** button
3. Choose type (Call, Meeting, Email, Task)
4. Set description and due date
5. Link to a contact or deal (optional)
6. Click **Save**
7. Activity is saved to database

### Drag-and-Drop Pipeline
- Simply drag any deal card to a different stage
- Drop it in the new stage column
- Database updates automatically
- Changes are permanent and visible in Supabase

---

## Database Visibility

**Important:** All CRM data (contacts, deals, activities) is stored directly in Supabase with **zero local caching**.

### Viewing Your Data in Supabase:
1. Go to Supabase Dashboard → **Table Editor**
2. View tables:
   - `contacts` - All your contacts
   - `deals` - All pipeline deals
   - `activities` - All tasks and activities
   - `companies` - Company records
   - `platforms` - Your platforms (PillsUp, SalesUp, etc.)
   - `staff` - Team members

### Real-Time Sync:
- Every action immediately writes to Supabase
- No local storage means no sync issues
- What you see in Supabase is exactly what's in the CRM
- Multiple users can work simultaneously

---

## Supabase Integration

### Images Storage:
- **Supabase Project**: https://mtfsrlsccbmrekzthvmw.supabase.co
- **Storage Bucket**: `images`
- **Storage Path**: `platform-images/`
- **Image Loading**: Automatic fallback to placeholder if image not found

### CRM Database:
- **Tables**: 7 tables (staff, companies, contacts, platforms, deals, activities, interactions)
- **Real-Time**: Live subscriptions for instant updates
- **No Caching**: All data fetched directly from database
- **Architecture**: Every write operation triggers immediate refetch

---

## Security

- The admin panel requires authentication (username and password)
- Access is available by clicking the WeXlot logo
- All uploads and data operations are processed through Supabase's secure API
- Row Level Security (RLS) enabled on all database tables

---

## Troubleshooting

### Image Issues:
- **Upload fails**: Check file size (must be under 2MB)
- **Image not appearing**: Verify storage bucket is created and public
- **Upload button disabled**: Select an image file first

### CRM Issues:
- **Can't add contacts**: Database tables not set up - see `QUICK_START_DATABASE.md`
- **"Permission denied" errors**: RLS policies not configured - see `DATABASE_SETUP.md`
- **Data not showing**: Check browser console (F12) for errors
- **Deals not moving**: Check console for drag-and-drop errors

### Admin Panel:
- **Can't access admin panel**: Click the WeXlot logo
- **Login fails**: Username is `Admin`, password is `Wexlot@2026`
- **Panel won't open**: Check browser console for JavaScript errors

### Database Verification:
- Open Supabase → Table Editor
- Check if tables exist (contacts, deals, activities)
- Run test queries in SQL Editor
- See `VERIFY_DATABASE.md` for detailed testing steps

---

## Quick Links

- **Supabase Dashboard**: https://mtfsrlsccbmrekzthvmw.supabase.co
- **Database Setup Guide**: `QUICK_START_DATABASE.md`
- **Verification Guide**: `VERIFY_DATABASE.md`
- **Detailed Setup**: `DATABASE_SETUP.md`

---

## Technical Architecture

### Frontend → Database Flow:
1. User action (add contact, move deal, etc.)
2. Write to Supabase database
3. Immediate refetch of ALL data from Supabase
4. UI updates with fresh database data
5. Real-time subscriptions keep data in sync

### No Local Storage:
- Zero localStorage usage
- Zero sessionStorage usage
- No client-side caching
- All state comes from React + Supabase
- Single source of truth: The database

This architecture ensures perfect data consistency and allows you to verify everything in Supabase Table Editor!