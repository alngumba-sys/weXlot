import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtfsrlsccbmrekzthvmw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZnNybHNjY2JtcmVrenRodm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODY4NDAsImV4cCI6MjA4MzU2Mjg0MH0.SdYC7G_lxFifJh8VLFpLjOZw5hPm_t0liv4xQJcHHGU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const IMAGE_KEYS = {
  logo: 'wexlot-logo',
  workspaceImage: 'workspace-image',
  scissorUpLogo: 'scissorup-logo',
  smartLenderUpLogo: 'smartlenderup-logo',
  tillsUpLogo: 'tillsup-logo',
  pillsUpLogo: 'pillsup-logo',
  philosophyImage: 'philosophy-image',
} as const;

export type ImageKey = keyof typeof IMAGE_KEYS;

export async function uploadImage(file: File, imageKey: ImageKey): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${IMAGE_KEYS[imageKey]}.${fileExt}`;
    const filePath = `platform-images/${fileName}`;

    // Upload new file with upsert to replace existing
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '0', // Disable caching for immediate updates
        upsert: true, // Replace existing file
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL with cache buster
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    // Add timestamp to bust cache
    const urlWithCacheBuster = `${urlData.publicUrl}?t=${Date.now()}`;
    
    console.log('Upload successful:', urlWithCacheBuster);
    return urlWithCacheBuster;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function getImageUrl(imageKey: ImageKey): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list('platform-images', {
        search: IMAGE_KEYS[imageKey],
      });

    if (error) {
      console.error('Error listing files:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No file found for:', imageKey);
      return null;
    }

    const file = data[0];
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(`platform-images/${file.name}`);

    // Add cache buster to always get fresh image
    // const urlWithCacheBuster = `${urlData.publicUrl}?t=${Date.now()}`;
    const urlWithCacheBuster = urlData.publicUrl;
    console.log('Image URL for', imageKey, ':', urlWithCacheBuster);
    
    return urlWithCacheBuster;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
}

export async function getAllImages(): Promise<Record<ImageKey, string | null>> {
  try {
    // Fetch all files at once instead of making individual requests
    const { data: allFiles, error } = await supabase.storage
      .from('images')
      .list('platform-images');

    if (error) {
      console.error('Error listing all files:', error);
      return Object.keys(IMAGE_KEYS).reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<ImageKey, string | null>);
    }

    // Map files to image keys
    const images: Record<string, string | null> = {};
    const timestamp = Date.now();

    for (const [key, fileName] of Object.entries(IMAGE_KEYS)) {
      const file = allFiles?.find(f => f.name.startsWith(fileName));
      
      if (file) {
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`platform-images/${file.name}`);
        
        images[key] = urlData.publicUrl;
      } else {
        images[key] = null;
      }
    }

    return images as Record<ImageKey, string | null>;
  } catch (error) {
    console.error('Error getting all images:', error);
    return Object.keys(IMAGE_KEYS).reduce((acc, key) => ({ ...acc, [key]: null }), {} as Record<ImageKey, string | null>);
  }
}