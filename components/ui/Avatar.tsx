import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../utils/supabase';
import { Button } from './Button';
import { Camera } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export const Avatar = () => {
  const { user, updateUserAvatar } = useApp();
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setLoadingImage(true);
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(t('errorNoImageSelected'));
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data, error: urlError } = supabase.storage.from('avatars').getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }
      
      const newAvatarUrl = data.publicUrl;

      let { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user!.id);
      
      if (updateError) {
        throw updateError;
      }

      setLoadingImage(true);
      setAvatarUrl(newAvatarUrl);
      updateUserAvatar(newAvatarUrl);
      addNotification(t('avatarUpdated'), 'success');
    } catch (error) {
      addNotification((error as Error).message, 'error');
    } finally {
      setUploading(false);
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
