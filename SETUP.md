# Setup DevHub - Panduan Lengkap

## 1. Prerequisites

Pastikan Anda sudah menginstall:
- Node.js 18+ 
- npm atau yarn
- Git

## 2. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd devhub

# Install dependencies
npm install

# Atau menggunakan yarn
yarn install
```

## 3. Setup Supabase

### 3.1 Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Isi nama project: "devhub"
4. Pilih region terdekat
5. Buat password database yang kuat
6. Tunggu project selesai dibuat

### 3.2 Setup Database Schema

**Opsi 1: Gunakan Schema Safe (Recommended)**
1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh isi file `supabase/schema-safe.sql`
3. Paste di SQL Editor dan jalankan (klik "Run")
4. Tunggu sampai selesai (mungkin butuh beberapa detik)

**Opsi 2: Jika Opsi 1 Gagal**
Jalankan schema dalam bagian-bagian terpisah:

1. **Bagian 1 - Tables:**
```sql
-- Copy dan jalankan semua CREATE TABLE statements dari schema-safe.sql
```

2. **Bagian 2 - RLS:**
```sql
-- Copy dan jalankan semua ALTER TABLE ENABLE ROW LEVEL SECURITY
```

3. **Bagian 3 - Policies:**
```sql
-- Copy dan jalankan semua CREATE POLICY statements
```

4. **Bagian 4 - Functions:**
```sql
-- Copy dan jalankan semua functions dan triggers
```

**Verifikasi Setup:**
- Buka Supabase Dashboard → Table Editor
- Pastikan tabel berikut ada: profiles, projects, notes, features, releases, release_features, ai_messages
- Buka Authentication → Policies, pastikan ada policies untuk semua tabel

### 3.3 Setup Google OAuth (Opsional)
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Tambahkan authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID dan Client Secret
7. Di Supabase Dashboard → Authentication → Providers
8. Enable Google provider dan masukkan credentials

### 3.4 Get Supabase Keys
1. Buka Supabase Dashboard → Settings → API
2. Copy "Project URL" dan "anon public" key

## 4. Environment Variables

Buat file `.env.local` di root project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key



# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string
```

### Generate NEXTAUTH_SECRET
```bash
# Menggunakan openssl
openssl rand -base64 32

# Atau menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 5. Run Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:3000`

## 6. Testing

### 7.1 Test Authentication
1. Buka halaman register
2. Daftar dengan email baru
3. Cek email untuk verifikasi (jika diperlukan)
4. Login dengan akun yang dibuat

### 7.2 Test Project Creation
1. Setelah login, buat project baru
2. Isi nama dan deskripsi
3. Pastikan project muncul di dashboard

### 6.3 Test All Tabs
1. Buka project yang dibuat
2. Test tab Notes - tulis beberapa notes
3. Test tab Features - tambah beberapa fitur
4. Test tab Releases - buat release baru

## 7. Production Deployment

### 7.1 Vercel (Recommended)
1. Push code ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Set environment variables di Vercel dashboard
5. Deploy

### 7.2 Environment Variables untuk Production
- Ganti `NEXTAUTH_URL` dengan domain production
- Pastikan semua keys sudah benar
- Test semua fitur setelah deploy

## 8. Troubleshooting

### Database Issues

**Error: "permission denied to set parameter"**
- Gunakan `supabase/schema-safe.sql` instead of `supabase/schema.sql`
- Baris pertama di schema original memerlukan superuser permission

**Error: "relation does not exist"**
```sql
-- Pastikan semua tabel sudah dibuat dengan benar
-- Jalankan query ini untuk cek tabel yang ada:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Error: "RLS policy violation"**
```bash
# 1. Pastikan user sudah login
# 2. Check di Supabase Dashboard → Authentication → Users
# 3. Pastikan policies sudah dibuat dengan benar
# 4. Test dengan query manual di SQL Editor:

SELECT * FROM profiles WHERE id = auth.uid();
```

**Error: "Function auth.uid() does not exist"**
- Pastikan menggunakan Supabase, bukan PostgreSQL biasa
- auth.uid() adalah function khusus Supabase



### Build Issues
```bash
# Jika ada TypeScript errors
npm run build

# Jika ada missing dependencies
npm install --save-dev @types/node
```

## 9. Optional Enhancements

### 9.1 Custom Domain
- Setup custom domain di Vercel
- Update NEXTAUTH_URL
- Update Google OAuth redirect URIs

### 9.2 Analytics
- Tambahkan Google Analytics
- Setup Vercel Analytics
- Monitor usage dan performance

### 9.3 Monitoring
- Setup Sentry untuk error tracking
- Monitor Supabase usage
- Setup alerts untuk downtime

## 10. Support

Jika mengalami masalah:
1. Cek dokumentasi Supabase
2. Buka GitHub issues
3. Cek console browser untuk error messages
4. Pastikan semua environment variables sudah benar

---

Selamat! DevHub sudah siap digunakan 🚀
## 6. Avatar Upload (Tanpa Storage Setup)

DevHub menggunakan sistem avatar sederhana yang **tidak memerlukan setup storage** yang rumit.

### 6.1 Fitur Avatar yang Tersedia

✅ **URL Gambar**: Gunakan link gambar dari internet (Imgur, Cloudinary, dll)
✅ **Upload File**: Upload langsung, disimpan sebagai base64 di database (max 2MB)
✅ **Gravatar**: Avatar otomatis berdasarkan email
✅ **Generator Inisial**: Avatar dengan huruf pertama nama
✅ **Avatar Random**: Avatar acak yang unik

### 6.2 Cara Menggunakan

1. Login ke aplikasi
2. Masuk ke halaman Profile
3. Klik "Ubah Avatar"
4. Pilih metode yang diinginkan:
   - **URL**: Paste link gambar
   - **File**: Upload dari komputer
   - **Generator**: Gunakan Gravatar/Inisial/Random

### 6.3 Keuntungan Solusi Ini

- ✅ Tidak perlu setup storage yang rumit
- ✅ Tidak perlu permission owner di Supabase
- ✅ Langsung bisa digunakan setelah setup database
- ✅ Banyak pilihan avatar (URL, file, generator)
- ✅ Mudah di-deploy tanpa konfigurasi tambahan

### 6.4 Detail Lengkap

Lihat panduan lengkap di `supabase/SIMPLE_AVATAR_SETUP.md` untuk:
- Tips penggunaan setiap metode
- Troubleshooting
- Best practices
- Keamanan dan performance