'use client'

import { useState, useRef } from 'react'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { useProjectStore } from '@/lib/store/project-store'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Cloud, Download, Upload, Calendar, Settings, CheckCircle, AlertTriangle, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function BackupSettings() {
  const { user } = useAuthStore()
  const { projects, setProjects } = useProjectStore()
  const { 
    autoBackupEnabled, 
    backupFrequency, 
    setAutoBackupEnabled, 
    setBackupFrequency 
  } = useSettingsStore()
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [backupFile, setBackupFile] = useState<File | null>(null)
  const [backupPreview, setBackupPreview] = useState<any>(null)
  const [lastBackup] = useState(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) // 2 days ago
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleCreateBackup = async () => {
    if (!user) return
    
    setIsCreatingBackup(true)
    
    try {
      // Fetch all user data
      const { data: projectsData } = await supabase
        .from('projects')
        .select(`
          *,
          notes(*),
          features(*),
          releases(*)
        `)
        .eq('user_id', user.id)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const backupData = {
        backup_info: {
          created_at: new Date().toISOString(),
          type: 'manual',
          version: '1.0.0',
          user_id: user.id,
          user_email: user.email
        },
        profile: profileData,
        projects: projectsData || [],
        metadata: {
          total_projects: projectsData?.length || 0,
          backup_size: JSON.stringify(projectsData).length
        }
      }

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `devhub-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Backup berhasil dibuat dan diunduh!')
    } catch (error) {
      toast.error('Gagal membuat backup')
      console.error(error)
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/json') {
      toast.error('File harus berformat JSON')
      return
    }

    setBackupFile(file)
    
    // Read and preview backup file
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string)
        if (!content.backup_info || !content.projects) {
          toast.error('Format backup tidak valid')
          return
        }
        setBackupPreview(content)
        setShowRestoreDialog(true)
      } catch (error) {
        toast.error('File backup tidak valid')
      }
    }
    reader.readAsText(file)
  }

  const handleRestore = async () => {
    if (!backupPreview || !user) return

    setIsRestoring(true)

    try {
      // Delete existing data (optional - could be made configurable)
      await supabase
        .from('projects')
        .delete()
        .eq('user_id', user.id)

      // Restore projects and related data
      for (const project of backupPreview.projects) {
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert({
            name: project.name,
            description: project.description,
            status: project.status,
            user_id: user.id
          })
          .select()
          .single()

        if (projectError) throw projectError

        // Restore notes
        if (project.notes?.length > 0) {
          await supabase
            .from('notes')
            .insert(
              project.notes.map((note: any) => ({
                ...note,
                project_id: newProject.id,
                user_id: user.id
              }))
            )
        }

        // Restore features
        if (project.features?.length > 0) {
          await supabase
            .from('features')
            .insert(
              project.features.map((feature: any) => ({
                ...feature,
                project_id: newProject.id,
                user_id: user.id
              }))
            )
        }

        // Restore releases
        if (project.releases?.length > 0) {
          await supabase
            .from('releases')
            .insert(
              project.releases.map((release: any) => ({
                ...release,
                project_id: newProject.id,
                user_id: user.id
              }))
            )
        }
      }

      // Refresh projects in store
      const { data: updatedProjects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)

      setProjects(updatedProjects || [])

      toast.success('Data berhasil di-restore!')
      setShowRestoreDialog(false)
      setBackupFile(null)
      setBackupPreview(null)
    } catch (error) {
      toast.error('Gagal restore data')
      console.error(error)
    } finally {
      setIsRestoring(false)
    }
  }

  const getNextBackupDate = () => {
    const now = new Date()
    switch (backupFrequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      case 'monthly':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  }

  return (
    <Card className="app-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-app-text-primary">
          <Cloud className="h-5 w-5" />
          Backup & Restore
        </CardTitle>
        <CardDescription>
          Kelola backup data dan pengaturan restore
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Backup Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-app-text-primary flex items-center gap-2">
              Backup Otomatis
              {autoBackupEnabled && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktif
                </Badge>
              )}
            </h4>
            <p className="text-sm text-app-text-secondary">
              Backup data secara otomatis sesuai jadwal
            </p>
          </div>
          <Switch 
            checked={autoBackupEnabled} 
            onCheckedChange={(checked: boolean) => {
              setAutoBackupEnabled(checked)
              toast.success(checked ? 'Auto backup diaktifkan' : 'Auto backup dinonaktifkan')
            }}
          />
        </div>

        {/* Backup Frequency */}
        {autoBackupEnabled && (
          <div className="space-y-3">
            <Label className="text-sm text-app-text-secondary">Frekuensi Backup</Label>
            <Select 
              value={backupFrequency} 
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
                setBackupFrequency(value)
                toast.success(`Frekuensi backup diubah ke ${value}`)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Backup Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
          <div>
            <Label className="text-sm text-app-text-secondary">Backup Terakhir</Label>
            <p className="text-sm text-app-text-primary mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {lastBackup.toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          
          {autoBackupEnabled && (
            <div>
              <Label className="text-sm text-app-text-secondary">Backup Berikutnya</Label>
              <p className="text-sm text-app-text-primary mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getNextBackupDate().toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          )}
        </div>

        {/* Manual Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create Backup */}
          <div className="flex flex-col space-y-3">
            <div>
              <h4 className="font-medium text-app-text-primary">Buat Backup</h4>
              <p className="text-sm text-app-text-secondary">
                Unduh semua data Anda ke file backup
              </p>
            </div>
            <Button 
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isCreatingBackup ? 'Membuat Backup...' : 'Buat Backup'}
            </Button>
          </div>

          {/* Restore Backup */}
          <div className="flex flex-col space-y-3">
            <div>
              <h4 className="font-medium text-app-text-primary">Restore Data</h4>
              <p className="text-sm text-app-text-secondary">
                Pulihkan data dari file backup
              </p>
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Pilih File Backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Backup Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Settings className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-1">Informasi Backup & Restore</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Backup mencakup semua project, notes, features, dan releases</li>
                <li>• Data disimpan dalam format JSON yang dapat dibaca</li>
                <li>• Restore akan mengganti semua data yang ada</li>
                <li>• Pastikan backup file berasal dari DevHub yang valid</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Konfirmasi Restore Data
            </DialogTitle>
            <DialogDescription>
              Proses ini akan mengganti semua data yang ada dengan data dari backup.
            </DialogDescription>
          </DialogHeader>

          {backupPreview && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-app-text-primary mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preview Backup
                </h4>
                <div className="text-sm text-app-text-secondary space-y-1">
                  <p>Tanggal: {new Date(backupPreview.backup_info.created_at).toLocaleDateString('id-ID')}</p>
                  <p>Total Project: {backupPreview.metadata?.total_projects || 0}</p>
                  <p>User: {backupPreview.backup_info.user_email}</p>
                </div>
              </div>

              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-200">
                  ⚠️ Peringatan: Semua data project, notes, features, dan releases yang ada akan dihapus dan diganti dengan data dari backup.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRestoreDialog(false)
                setBackupFile(null)
                setBackupPreview(null)
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleRestore}
              disabled={isRestoring}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRestoring ? 'Restoring...' : 'Ya, Restore Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}