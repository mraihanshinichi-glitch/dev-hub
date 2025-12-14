# Storage Setup untuk Avatar Upload

Untuk mengaktifkan fitur upload avatar, Anda perlu setup storage bucket di Supabase.

## Opsi 1: Setup via Supabase Dashboard (Recommended)

1. Buka Supabase Dashboard → Storage
2. Klik "Create Bucket"
3. Nama bucket: `avatars`
4. Set sebagai Public bucket: ✅ Yes
5. Klik "Create bucket"

### Setup Policies via Dashboard:
1. Masuk ke bucket `avatars`
2. Klik "Policies" tab
3. Tambahkan policies berikut:

**Policy 1: Public Read**
- Policy name: `Avatar images are publicly accessible`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `bucket_id = 'avatars'`

**Policy 2: User Upload**
- Policy name: `Users can upload their own avatar`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`

**Policy 3: User Update**
- Policy name: `Users can update their own avatar`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`

**Policy 4: User Delete**
- Policy name: `Users can delete their own avatar`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`

## Opsi 2: Setup via SQL (Advanced)

Jika Anda ingin menggunakan SQL, jalankan file `storage-setup.sql` setelah menjalankan `schema.sql`:

```bash
# Jalankan schema utama dulu
psql -h your-host -U postgres -d postgres -f supabase/schema.sql

# Kemudian jalankan storage setup
psql -h your-host -U postgres -d postgres -f supabase/storage-setup.sql
```

## Opsi 3: Manual Setup via Supabase CLI

```bash
# Create bucket
supabase storage create avatars --public

# Create policies
supabase storage policy create "Avatar images are publicly accessible" avatars \
  --operation SELECT --target public \
  --using "bucket_id = 'avatars'"

supabase storage policy create "Users can upload their own avatar" avatars \
  --operation INSERT --target authenticated \
  --check "bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text"

supabase storage policy create "Users can update their own avatar" avatars \
  --operation UPDATE --target authenticated \
  --using "bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text"

supabase storage policy create "Users can delete their own avatar" avatars \
  --operation DELETE --target authenticated \
  --using "bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text"
```

## Verifikasi Setup

Setelah setup selesai, pastikan:
1. Bucket `avatars` sudah dibuat dan public
2. 4 policies sudah aktif
3. Test upload avatar dari aplikasi

## Troubleshooting

**Error: "Failed to upload"**
- Pastikan bucket `avatars` sudah dibuat
- Pastikan bucket di-set sebagai public
- Cek policies sudah benar

**Error: "Access denied"**
- Pastikan user sudah login
- Cek policy untuk authenticated users
- Pastikan folder structure benar (user_id/filename.ext)

**Error: "File not found"**
- Pastikan public access policy aktif
- Cek URL yang di-generate benar