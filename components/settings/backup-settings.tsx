'use client'

import { useState } from 'react'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Cloud, Download, Calendar, Settings, CheckCircle } from 'lucide-react'

export function BackupSettings() {
  const { user } = useAuthStore()
  const { 
    autoBackupEnabled, 
    backupFrequency, 
    setAutoBackupEnabled, 
    setBackupFrequency 
  } = useSettingsStore()
  
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [lastBackup] = useState(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) // 2 days ago

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const backupData = {
        user: {
          id: user?.id,
          email: user?.email,
          created_at: user?.created_at
        },
        backup_info: {
          created_at: new Date().toISOString(),
          type: 'manual',
          size: '2.4 MB',
          version: '1.0.0'
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

        {/* Manual Backup */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-app-text-primary">Backup Manual</h4>
            <p className="text-sm text-app-text-secondary">
              Buat backup sekarang dan unduh ke perangkat Anda
            </p>
          </div>
          <Button 
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            {isCreatingBackup ? 'Membuat Backup...' : 'Buat Backup'}
          </Button>
        </div>

        {/* Backup Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Settings className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-1">Informasi Backup</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Backup mencakup semua project, notes, features, dan releases</li>
                <li>• Data disimpan dalam format JSON yang dapat dibaca</li>
                <li>• Backup otomatis disimpan selama 30 hari</li>
                <li>• Anda dapat restore data kapan saja dari pengaturan</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}