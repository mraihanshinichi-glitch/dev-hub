# Backup & Restore System - DevHub

## 📋 Overview

Sistem backup dan restore DevHub telah diperbarui untuk memberikan pengalaman yang lebih konsisten dan mudah digunakan.

## 🔄 Perubahan yang Dilakukan

### ✅ **Fitur Baru: Restore Data**
- Tambah fitur restore data dari file backup
- Preview backup sebelum restore
- Konfirmasi dialog dengan warning
- Restore mencakup semua data: projects, notes, features, releases

### ❌ **Fitur yang Dihapus: Export Data**
- Menghapus fitur "Export Data" yang redundant
- Sekarang hanya ada satu sistem: Backup & Restore

## 🚀 Cara Menggunakan

### **Membuat Backup**
1. Buka Settings → Backup & Restore
2. Klik "Buat Backup"
3. File JSON akan otomatis terunduh

### **Restore Data**
1. Buka Settings → Backup & Restore
2. Klik "Pilih File Backup"
3. Pilih file backup (.json)
4. Review preview data
5. Konfirmasi restore (akan mengganti semua data yang ada)

### **Auto Backup**
- Enable/disable auto backup
- Pilih frekuensi: Harian, Mingguan, Bulanan
- Backup otomatis akan berjalan di background

## 📊 Format Backup

```json
{
  "backup_info": {
    "created_at": "2024-12-14T10:30:00Z",
    "type": "manual",
    "version": "1.0.0",
    "user_id": "user-uuid",
    "user_email": "user@example.com"
  },
  "profile": { ... },
  "projects": [
    {
      "id": "project-uuid",
      "name": "Project Name",
      "notes": [...],
      "features": [...],
      "releases": [...]
    }
  ],
  "metadata": {
    "total_projects": 3,
    "backup_size": 12345
  }
}
```

## ⚠️ Penting

- **Restore akan mengganti semua data yang ada**
- Pastikan backup file berasal dari DevHub yang valid
- Backup file harus berformat JSON
- Disarankan untuk backup sebelum melakukan restore

## 🔒 Keamanan

- Backup hanya mencakup data user yang sedang login
- File backup tidak mengandung password atau token
- Data disimpan dalam format JSON yang dapat dibaca
- Tidak ada data sensitif yang tersimpan dalam backup

## 🛠️ Technical Details

- Backup menggunakan Supabase queries dengan relasi lengkap
- Restore menggunakan transaction untuk memastikan konsistensi data
- File validation untuk memastikan format backup yang benar
- Error handling untuk semua operasi backup/restore