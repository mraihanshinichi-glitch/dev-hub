# Panduan Deploy DevHub ke Vercel

## Prerequisites

Pastikan Anda sudah memiliki:
- ✅ Akun GitHub dengan repository DevHub
- ✅ Akun Vercel (gratis di vercel.com)
- ✅ Project Supabase yang sudah setup
- ✅ Database schema sudah dijalankan

## Step 1: Persiapan Repository

### 1.1 Push ke GitHub
```bash
# Jika belum ada git repository
git init
git add .
git commit -m "Initial commit - DevHub ready for deployment"

# Buat repository di GitHub, lalu:
git remote add origin https://github.com/username/devhub.git
git branch -M main
git push -u origin main
```

### 1.2 Verifikasi File Penting
Pastikan file-file ini ada di repository:
- ✅ `package.json` - Dependencies
- ✅ `next.config.js` - Next.js config
- ✅ `.env.local.example` - Template environment variables
- ✅ `middleware.ts` - Route protection
- ✅ `vercel.json` - Vercel configuration (akan dibuat)

## Step 2: Konfigurasi Vercel

### 2.1 Buat File Vercel Config
File `vercel.json` sudah dibuat otomatis dengan konfigurasi optimal.

### 2.2 Environment Variables
Siapkan environment variables berikut dari Supabase Dashboard:

**WAJIB - Dari Supabase Dashboard → Settings → API:**
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL (contoh: https://abc123.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (secret) (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)

**Optional:**
- `NEXT_PUBLIC_APP_URL` - URL aplikasi Anda (https://your-app.vercel.app)

## Step 3: Deploy ke Vercel

### 3.1 Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Import Project**
   - Klik "New Project"
   - Pilih repository DevHub dari GitHub
   - Klik "Import"

3. **Configure Project**
   - Project Name: `devhub` (atau sesuai keinginan)
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**
   - Klik "Environment Variables"
   - Tambahkan 3 variables WAJIB:
     * `NEXT_PUBLIC_SUPABASE_URL` = https://your-project.supabase.co
     * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * `SUPABASE_SERVICE_ROLE_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - Pastikan tidak ada spasi di awal/akhir values

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai (2-5 menit)
   - Jika ada error, cek environment variables

### 3.2 Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (pilih account Anda)
# - Link to existing project? N
# - Project name: devhub
# - Directory: ./
# - Override settings? N

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy production
vercel --prod
```

## Step 4: Konfigurasi Supabase untuk Production

### 4.1 Update Supabase Settings

**Authentication → URL Configuration:**
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: 
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-app.vercel.app/dashboard`

**Authentication → Providers:**
- Pastikan Email provider enabled

### 4.2 Database RLS Policies
Pastikan semua RLS policies sudah aktif:
```sql
-- Cek RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Jika ada yang false, aktifkan:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
```

## Step 5: Testing Production

### 5.1 Functional Testing
- ✅ Landing page loading
- ✅ User registration
- ✅ User login
- ✅ Dashboard access
- ✅ Project creation
- ✅ Notes editing
- ✅ Features management
- ✅ Releases management
- ✅ Profile management
- ✅ Avatar upload
- ✅ Settings functionality

### 5.2 Performance Testing
- ✅ Page load speed < 3s
- ✅ Database queries optimized
- ✅ Images loading properly
- ✅ Mobile responsiveness

## Step 6: Domain & SSL (Optional)

### 6.1 Custom Domain
1. Buka Vercel Dashboard → Project → Settings → Domains
2. Add domain: `yourdomain.com`
3. Configure DNS records sesuai instruksi Vercel
4. Update Supabase Site URL ke domain baru

### 6.2 SSL Certificate
- SSL otomatis di-handle oleh Vercel
- Certificate renewal otomatis

## Troubleshooting

### Build Errors
```bash
# Jika build gagal, cek locally:
npm run build

# Common issues:
# - TypeScript errors
# - Missing environment variables
# - Import path issues
```

### Runtime Errors
```bash
# Check Vercel logs:
vercel logs

# Common issues:
# - Supabase connection
# - Environment variables
# - API routes
```

### Database Connection Issues
- Pastikan Supabase URL dan keys benar
- Cek RLS policies aktif
- Verifikasi database schema complete

### Authentication Issues
- Update Supabase redirect URLs
- Cek Site URL configuration
- Pastikan middleware.ts working

## Monitoring & Maintenance

### 5.1 Vercel Analytics
- Enable di Vercel Dashboard → Analytics
- Monitor performance dan usage

### 5.2 Error Tracking
- Vercel otomatis track errors
- Setup Sentry untuk detailed tracking (optional)

### 5.3 Database Monitoring
- Monitor Supabase Dashboard → Reports
- Track API usage dan performance

## Automatic Deployments

Setelah setup awal, setiap push ke branch `main` akan otomatis trigger deployment baru:

```bash
# Development workflow:
git add .
git commit -m "Feature: new functionality"
git push origin main

# Vercel akan otomatis:
# 1. Detect changes
# 2. Run build
# 3. Deploy to production
# 4. Update live URL
```

## Security Checklist

- ✅ Environment variables aman (tidak di commit)
- ✅ Supabase RLS policies aktif
- ✅ API routes protected
- ✅ Middleware authentication working
- ✅ HTTPS enabled (otomatis di Vercel)
- ✅ Database credentials secure

## Performance Optimization

- ✅ Next.js Image optimization enabled
- ✅ Static assets cached
- ✅ Database queries optimized
- ✅ Bundle size minimized
- ✅ CDN distribution (Vercel Edge Network)

Selamat! DevHub Anda sekarang live di production 🚀