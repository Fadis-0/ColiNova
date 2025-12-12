-- Policies for avatars storage bucket

-- Allow users to upload their own avatar
CREATE POLICY "user_avatar_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow users to view their own avatar
CREATE POLICY "user_avatar_view"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow users to update their own avatar
CREATE POLICY "user_avatar_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

-- Allow users to delete their own avatar
CREATE POLICY "user_avatar_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());
