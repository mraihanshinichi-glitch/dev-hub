# AI Assistant Setup Guide

DevHub sekarang dilengkapi dengan AI Assistant yang menggunakan OpenRouter dan model Google Gemma 2 27B (gratis).

## Fitur AI Assistant

- **Context-Aware**: AI memahami project Anda (nama, deskripsi, notes, features, releases)
- **Ide Fitur**: Memberikan saran fitur baru berdasarkan project yang ada
- **Development Guidance**: Saran workflow, best practices, dan metodologi
- **Project Planning**: Bantuan organisasi dan planning project
- **Bahasa Indonesia**: Merespons dalam Bahasa Indonesia

## Setup OpenRouter API Key

### 1. Daftar di OpenRouter
- Kunjungi [OpenRouter.ai](https://openrouter.ai)
- Daftar akun gratis
- Dapatkan API key dari dashboard

### 2. Konfigurasi Environment
Tambahkan ke file `.env.local`:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Restart Aplikasi
```bash
npm run dev
```

### 4. Test Koneksi
- Buka Settings → AI Assistant
- Klik "Test Koneksi" untuk memverifikasi

## Cara Menggunakan

### 1. Tab AI Assistant
- Buka project apa saja
- Klik tab "AI Assistant"
- Mulai chat dengan AI

### 2. Floating AI Button
- Tombol AI melayang di kanan bawah halaman project
- Klik untuk membuka dialog AI
- Dapat dinonaktifkan di Settings

### 3. Contoh Pertanyaan
- "Apa fitur yang bisa ditambahkan untuk project ini?"
- "Bagaimana cara mengorganisir development workflow?"
- "Saran untuk meningkatkan project ini?"
- "Ide untuk release selanjutnya?"

## Model AI

- **Provider**: OpenRouter
- **Model**: Google Gemma 2 27B IT (gratis)
- **Rate Limit**: Sesuai kebijakan OpenRouter untuk akun gratis
- **Cost**: Gratis untuk penggunaan wajar

## Pengaturan

Di Settings → AI Assistant:
- ✅ Aktifkan/nonaktifkan AI Assistant
- ✅ Tampilkan/sembunyikan floating button
- ✅ Test koneksi API
- ✅ Panduan setup API key

## Troubleshooting

### Error "API key not configured"
- Pastikan `OPENROUTER_API_KEY` ada di `.env.local`
- Restart aplikasi setelah menambah API key
- Periksa API key valid di dashboard OpenRouter

### Error "Failed to get AI response"
- Periksa koneksi internet
- Cek rate limit OpenRouter
- Verifikasi API key masih aktif

### AI tidak merespons dengan baik
- AI membutuhkan context project yang cukup
- Tambahkan notes, features, atau releases untuk context yang lebih baik
- Gunakan pertanyaan yang spesifik

## Keamanan

- API key disimpan di server environment variables
- Tidak ada data sensitif yang dikirim ke OpenRouter
- Hanya informasi project (nama, deskripsi, notes, features, releases) yang dibagikan
- Tidak ada data user personal yang dikirim

## Batasan

- Memerlukan koneksi internet
- Tergantung pada ketersediaan OpenRouter
- Rate limit sesuai kebijakan OpenRouter
- Model gratis memiliki batasan tertentu