import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../utils/supabase';
import { Button } from './Button';
import { Camera } from 'lucide-react';

export const Avatar = () => {
  const { user, updateUserAvatar } = useApp();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setLoadingImage(true);
      console.log('Uploading avatar...');
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to Supabase storage...');
      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      console.log('File uploaded successfully.');

      console.log('Getting public URL...');
      const { data, error: urlError } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        throw urlError;
      }
      console.log('Public URL:', data.publicUrl);
      
      const newAvatarUrl = data.publicUrl;

      console.log('Updating profile with new avatar URL...');
      let { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user!.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
      console.log('Profile updated successfully.');

      setAvatarUrl(newAvatarUrl);
      updateUserAvatar(newAvatarUrl);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
      console.log('Upload process finished.');
    }
  };

  return (
    <div className="relative">
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-4xl">
        {uploading || loadingImage ? (
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-white"></div>
        ) : avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={user?.name} 
            className="w-full h-full object-cover rounded-full" 
            onLoad={() => setLoadingImage(false)}
            onError={() => setLoadingImage(false)}
          />
        ) : (
          user?.name.charAt(0)
        )}
      </div>
      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
      >
        <Camera className="h-5 w-5 text-white" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};
