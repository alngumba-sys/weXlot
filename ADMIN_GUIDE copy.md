# WeXlot Admin Panel Guide

## ⚠️ IMPORTANT: First Time Setup

Before you can upload images, you must create a storage bucket in Supabase:

### Supabase Storage Setup:
1. Go to https://mtfsrlsccbmrekzthvmw.supabase.co (your Supabase Dashboard)
2. Click on **Storage** in the left sidebar
3. Click the **"New bucket"** button
4. Name the bucket: `images`
5. Check the **"Public bucket"** option ✓
6. Click **"Create bucket"**
7. Done! You can now upload images

## Accessing the Admin Panel

The admin panel is accessed by clicking the **WeXlot logo** in the top-left corner **5 times** in quick succession (within 2 seconds).

### Steps:
1. Navigate to the website
2. Click the WeXlot logo 5 times rapidly
3. The admin panel will open automatically

## Admin Credentials

**Password:** `Wexlot@1234`

## Managing Images

Once logged in, you can upload images for the following elements:

### Available Images:
1. **WeXlot Logo** - Main company logo (67x67px recommended)
2. **Workspace Dashboard Image** - Center workspace illustration
3. **ScissorUp Platform Logo** - Barbershop & Salons platform (199x79px)
4. **SmartLenderUp Platform Logo** - Loans platform (161x79px)
5. **TillsUp Platform Logo** - POS platform (128x79px)
6. **PillsUp Platform Logo** - Pharmacy platform (161x79px)
7. **Philosophy Section Image** - Philosophy section background (320px wide)

### Upload Instructions:
1. Click on the upload area for the image you want to replace
2. Select your image file (PNG, JPG, or SVG recommended)
3. Wait for the upload confirmation
4. Refresh the page to see your changes

### Image Guidelines:
- Keep file sizes under 2MB for optimal performance
- Use PNG for logos with transparency
- Use JPG for photographs
- Maintain recommended dimensions for best results
- Images are stored permanently in Supabase Storage

## Supabase Storage

Images are stored in the `images/platform-images/` bucket in Supabase. Each image is named according to its purpose and will overwrite the previous version when updated.

## Security

- The admin panel requires password authentication
- Access is only available through the secret logo click mechanism
- All uploads are processed through Supabase's secure API

## Troubleshooting

- **Upload fails**: Check file size (must be under 2MB)
- **Image not appearing**: Refresh the page after upload
- **Can't access admin panel**: Make sure you click the logo 5 times within 2 seconds

## Technical Details

- **Supabase Project**: https://mtfsrlsccbmrekzthvmw.supabase.co
- **Storage Bucket**: `images`
- **Storage Path**: `platform-images/`
- **Image Loading**: Automatic fallback to placeholder if Supabase image not found