import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nafagpnzcwvpjsjetnrv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZmFncG56Y3d2cGpzamV0bnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTI1NDQsImV4cCI6MjA5NTcyODU0NH0.a7Oj9089VVcwReZ9DuXwmiuw4W_ta3N2PrsYUkWqcEU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Supabase client initialized');

export const PHOTOS_BUCKET = 'sister-photos';
export const VIDEOS_BUCKET = 'sister-videos';

// Upload photo to Supabase
export const uploadPhoto = async (file, caption, story, isVideo = false) => {
  const bucket = isVideo ? VIDEOS_BUCKET : PHOTOS_BUCKET;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = fileName;

  console.log('Uploading to bucket:', bucket, 'file:', fileName);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  console.log('File uploaded, public URL:', publicUrl);

  // Save metadata to database
  const { data: photoData, error: dbError } = await supabase
    .from('sister_photos')
    .insert([
      {
        url: publicUrl,
        storage_path: filePath,
        caption: caption,
        story: story || 'A beautiful memory captured just for you! 💖',
        is_video: isVideo,
        uploaded_at: new Date().toISOString()
      }
    ])
    .select();

  if (dbError) throw dbError;

  console.log('Metadata saved to database', photoData);
  return { photoId: photoData[0].id, url: publicUrl };
};

// Save promise for a photo
export const savePromise = async (photoId, name, promise) => {
  const { data, error } = await supabase
    .from('family_promises')
    .insert([
      {
        photo_id: photoId,
        name: name,
        promise: promise,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
};

// Get all photos with their promises
export const getPhotosWithPromises = async () => {
  try {
    const { data, error } = await supabase
      .from('sister_photos')
      .select(`
        *,
        family_promises (*)
      `)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return data.map(photo => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      story: photo.story,
      isVideo: photo.is_video,
      storage_path: photo.storage_path,
      promise: photo.family_promises && photo.family_promises.length > 0 ? photo.family_promises[0] : null
    }));
  } catch (err) {
    console.error('Get photos error:', err);
    return [];
  }
};

// Get all photos (without promises - for backward compatibility)
export const getPhotos = async () => {
  try {
    const { data, error } = await supabase
      .from('sister_photos')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return data.map(photo => ({
      url: photo.url,
      caption: photo.caption,
      story: photo.story,
      isVideo: photo.is_video,
      id: photo.id,
      storage_path: photo.storage_path
    }));
  } catch (err) {
    console.error('Get photos exception:', err);
    return [];
  }
};

// Delete photo
export const deletePhoto = async (id, storagePath, isVideo) => {
  const bucket = isVideo ? VIDEOS_BUCKET : PHOTOS_BUCKET;
  
  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove([storagePath]);

  if (storageError) console.error('Storage delete error:', storageError);

  const { error: dbError } = await supabase
    .from('sister_photos')
    .delete()
    .eq('id', id);

  if (dbError) console.error('DB delete error:', dbError);
};

// Get messages
export const getMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('family_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Get messages exception:', err);
    return [];
  }
};

// Save message
export const saveMessage = async (name, message, color) => {
  const { data, error } = await supabase
    .from('family_messages')
    .insert([
      {
        name: name,
        message: message,
        color: color,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data[0];
};

export { supabase };