# DevHub - Project Management untuk Developer Solo

DevHub adalah platform manajemen project khusus untuk developer solo dan indie hacker yang ingin merencanakan, membangun, dan meluncurkan aplikasi mereka dengan lebih terorganisir.

## 🚀 Fitur Utama

### 🔐 Autentikasi
- Login dengan email & password
- Sistem profil user dengan Supabase Auth

### 📦 Sistem Slot Project (Maksimal 10)
- Setiap user bisa membuat hingga 10 project slot
- Setiap slot memiliki nama, deskripsi, dan metadata
- Tampilan grid yang clean dan modern
- Edit nama & deskripsi langsung

### 📝 Tab Notes
- Rich text editor menggunakan TipTap
- Support Markdown formatting
- Auto-save setiap 3 detik
- Placeholder yang informatif

### ⚡ Tab Features
- Manajemen fitur dengan 3 status: Planned, In-Progress, Done
- Drag & drop untuk mengubah status
- Due date untuk setiap fitur
- Statistik progress fitur
- Kanban-style layout

### 🚀 Tab Releases
- Timeline release dengan status: Planned, Upcoming, Released
- Target date dan release notes
- Visual timeline dengan indikator status
- Tracking versi dan changelog



## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Rich Text Editor**: TipTap

- **Styling**: Tailwind CSS dengan dark mode only

## 🎨 Design System

### Tema Visual
- **Dark mode only** dengan warna background `#0f0f1a` dan `#12121e`
- **Primary colors**: `#a78bfa` (purple-400) dan `#7c3aed` (purple-600)
- **Accent**: Ungu terang saat hover/active
- **Typography**: Inter font family
- **Clean, modern, premium feel**

### Komponen UI
- Menggunakan shadcn/ui sebagai base
- Custom styling untuk dark theme
- Consistent spacing dan typography
- Smooth animations dan transitions

## 📊 Database Schema

### Tables
- `profiles` - User profiles
- `projects` - Project slots (max 10 per user)
- `notes` - Rich text notes per project
- `features` - Features dengan status dan due date
- `releases` - Release timeline
- `release_features` - Junction table untuk release-feature mapping
- `ai_messages` - Chat history dengan AI

### Row Level Security (RLS)
- Semua data terisolasi per user
- User hanya bisa akses data miliknya sendiri
- Automatic policy enforcement

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm atau yarn
- Supabase account


### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key



# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Installation Steps

1. **Clone repository**
```bash
git clone <repository-url>
cd devhub
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase**
- Buat project baru di Supabase
- Jalankan SQL schema dari `supabase/schema.sql`
- Copy environment variables



5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:3000
```

## 📁 Struktur Project

```
devhub/
├── app/                          # Next.js App Router

│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Main dashboard
│   ├── project/[id]/           # Project detail pages
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── dashboard/              # Dashboard components
│   ├── project/                # Project components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities & configurations
│   ├── supabase/              # Supabase client & server
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   └── utils.ts               # Utility functions
├── supabase/                   # Database schema
│   └── schema.sql             # Complete SQL setup
└── README.md                   # Documentation
```

## 🔧 Key Features Implementation

### 1. Slot System
- Maksimal 10 project per user (enforced via database constraint)
- Slot numbering 1-10 dengan unique constraint
- Empty slot menampilkan "Create New Project" card

### 2. Auto-save Notes
- TipTap editor dengan auto-save setiap 3 detik
- Visual indicator untuk unsaved changes
- JSON content storage di database

### 3. Feature Management
- Kanban-style dengan 3 kolom status
- Drag & drop untuk mengubah status (via arrow buttons)
- Due date tracking dengan overdue indicator
- Order index untuk custom sorting

### 4. AI Context Building
- Otomatis menyertakan project name, description
- Semua notes content dalam format JSON
- Semua features dengan status dan due date
- Semua releases dengan timeline
- Context prompt dalam bahasa Indonesia

### 5. Responsive Design
- Mobile-first approach
- Grid layout yang adaptif
- Touch-friendly interactions
- Optimized untuk semua screen sizes

## 🎯 Usage Examples

### Membuat Project Baru
1. Klik "Create New Project" di slot kosong
2. Pilih slot number (1-10)
3. Isi nama dan deskripsi project
4. Project siap digunakan dengan 4 tab

### Mengelola Releases
1. Buka tab Releases di project
2. Buat release baru dengan versi dan target date
3. Kelola status release: Planned, Upcoming, Released
4. Tambahkan release notes untuk dokumentasi

### Mengelola Features
1. Tambah fitur baru dengan title, description, due date
2. Drag fitur antar status dengan arrow buttons
3. Edit atau hapus fitur sesuai kebutuhan
4. Monitor progress dengan statistik

## 🔒 Security Features

- Row Level Security (RLS) di semua tabel
- User isolation - tidak bisa akses data user lain
- Secure API routes dengan proper error handling
- Environment variables untuk sensitive data
- HTTPS enforcement di production

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy otomatis

### Environment Variables untuk Production
- Pastikan semua environment variables sudah diset
- Gunakan production Supabase URL
- Setup custom domain jika diperlukan

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail lengkap.

## 🆘 Support

Jika ada pertanyaan atau issue:
1. Check existing issues di GitHub
2. Buat issue baru dengan detail lengkap
3. Sertakan screenshot jika ada error UI

---

**DevHub** - Dibuat dengan ❤️ untuk developer Indonesia 🇮🇩