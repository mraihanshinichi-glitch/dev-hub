'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { useSettingsStore } from '@/lib/store/settings-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'

import { createClient } from '@/lib/supabase/client'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { TwoFactorSetup } from '@/components/settings/two-factor-setup'
import { BackupSettings } from '@/components/settings/backup-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Settings, Trash2, Download, Shield, Bell, Palette, Database, Clock, Keyboard, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const hydrated = useHydrated()
  const {
    emailNotifications,
    pushNotifications,
    releaseReminders,
    featureDeadlineReminders,
    autoSaveEnabled,
    autoSaveInterval,
    compactMode,
    showKeyboardShortcuts,
    sessionTimeout,
    theme,
    setEmailNotifications,
    setPushNotifications,
    setReleaseReminders,
    setFeatureDeadlineReminders,
    setAutoSaveEnabled,
    setAutoSaveInterval,
    setCompactMode,
    setShowKeyboardShortcuts,
    setSessionTimeout,
    setTheme,
  } = useSettingsStore()
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  if (!hydrated) {
    return <div>Loading...</div>
  }

  const handleExportData = async () => {
    setIsExporting(true)
    
    try {
      // Get all user data with simpler queries
      const [projectsResult, featuresResult, releasesResult] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user?.id),
        supabase.from('features').select('*, projects!inner(*)').eq('projects.user_id', user?.id),
        supabase.from('releases').select('*, projects!inner(*)').eq('projects.user_id', user?.id)
      ])

      // Get notes separately to avoid complex joins
      const notesResult = await supabase
        .from('notes')
        .select('*')
        .in('project_id', (projectsResult.data || []).map(p => p.id))

      const exportData = {
        user: {
          id: user?.id,
          email: user?.email,
          created_at: user?.created_at
        },
        projects: projectsResult.data || [],
        notes: notesResult.data || [],
        features: featuresResult.data || [],
        releases: releasesResult.data || [],
        exported_at: new Date().toISOString()
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `devhub-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Data berhasil diekspor!')
    } catch (error) {
      toast.error('Gagal mengekspor data')
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
      return
    }

    if (!confirm('Semua data project, notes, dan fitur akan dihapus permanen. Lanjutkan?')) {
      return
    }

    setIsDeleting(true)

    try {
      // First delete all user data (cascading delete will handle related data)
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('user_id', user?.id)

      if (deleteError) {
        toast.error('Gagal menghapus data project')
        console.error(deleteError)
        return
      }

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id)

      if (profileError) {
        toast.error('Gagal menghapus profile')
        console.error(profileError)
        return
      }

      // Finally sign out (user record in auth.users will remain but be inaccessible)
      logout()
      toast.success('Data akun berhasil dihapus')
      router.push('/')
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus akun')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleGlobalLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      
      if (error) {
        toast.error('Gagal logout dari semua perangkat')
        console.error(error)
      } else {
        logout()
        toast.success('Berhasil logout dari semua perangkat')
        router.push('/')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat logout')
      console.error(error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  if (!hydrated) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f1a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f1a]">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
            <p className="text-slate-600 dark:text-gray-400">Kelola preferensi dan pengaturan akun</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Bell className="h-5 w-5" />
                Notifikasi
              </CardTitle>
              <CardDescription>
                Kelola preferensi notifikasi dan pengingat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Email Notifications</h4>
                  <p className="text-sm text-app-text-secondary">Terima notifikasi melalui email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={(checked: boolean) => {
                    setEmailNotifications(checked)
                    toast.success(checked ? 'Email notifications diaktifkan' : 'Email notifications dinonaktifkan')
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Push Notifications</h4>
                  <p className="text-sm text-app-text-secondary">Notifikasi push di browser</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={(checked: boolean) => {
                    setPushNotifications(checked)
                    toast.success(checked ? 'Push notifications diaktifkan' : 'Push notifications dinonaktifkan')
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Release Reminders</h4>
                  <p className="text-sm text-app-text-secondary">Pengingat untuk release yang akan datang</p>
                </div>
                <Switch 
                  checked={releaseReminders} 
                  onCheckedChange={(checked: boolean) => {
                    setReleaseReminders(checked)
                    toast.success(checked ? 'Release reminders diaktifkan' : 'Release reminders dinonaktifkan')
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Feature Deadline Reminders</h4>
                  <p className="text-sm text-app-text-secondary">Pengingat untuk deadline fitur</p>
                </div>
                <Switch 
                  checked={featureDeadlineReminders} 
                  onCheckedChange={(checked: boolean) => {
                    setFeatureDeadlineReminders(checked)
                    toast.success(checked ? 'Feature deadline reminders diaktifkan' : 'Feature deadline reminders dinonaktifkan')
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Settings className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Preferensi aplikasi dan tampilan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-app-text-primary">Tema Aplikasi</h4>
                    <p className="text-sm text-app-text-secondary">Pilih tema yang sesuai dengan preferensi Anda</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Label htmlFor="theme" className="text-sm text-app-text-secondary">
                    Tema:
                  </Label>
                  <Select 
                    value={theme} 
                    onValueChange={(value: 'dark' | 'light' | 'system') => {
                      setTheme(value)
                      toast.success(`Tema diubah ke ${value === 'system' ? 'sistem' : value === 'dark' ? 'gelap' : 'terang'}`)
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Terang
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Gelap
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Sistem
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Compact Mode</h4>
                  <p className="text-sm text-app-text-secondary">Tampilan yang lebih padat dan efisien</p>
                </div>
                <Switch 
                  checked={compactMode} 
                  onCheckedChange={(checked: boolean) => {
                    setCompactMode(checked)
                    toast.success(checked ? 'Compact mode diaktifkan' : 'Compact mode dinonaktifkan')
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Keyboard Shortcuts</h4>
                  <p className="text-sm text-app-text-secondary">Tampilkan hint keyboard shortcuts</p>
                </div>
                <Switch 
                  checked={showKeyboardShortcuts} 
                  onCheckedChange={(checked: boolean) => {
                    setShowKeyboardShortcuts(checked)
                    toast.success(checked ? 'Keyboard shortcuts ditampilkan' : 'Keyboard shortcuts disembunyikan')
                  }}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-app-text-primary">Auto-save</h4>
                    <p className="text-sm text-app-text-secondary">Simpan otomatis notes dan perubahan</p>
                  </div>
                  <Switch 
                    checked={autoSaveEnabled} 
                    onCheckedChange={(checked: boolean) => {
                      setAutoSaveEnabled(checked)
                      toast.success(checked ? 'Auto-save diaktifkan' : 'Auto-save dinonaktifkan')
                    }}
                  />
                </div>
                
                {autoSaveEnabled && (
                  <div className="ml-4 flex items-center gap-3">
                    <Label htmlFor="autoSaveInterval" className="text-sm text-app-text-secondary">
                      Interval:
                    </Label>
                    <Select 
                      value={autoSaveInterval.toString()} 
                      onValueChange={(value) => {
                        setAutoSaveInterval(parseInt(value))
                        toast.success(`Auto-save interval diubah ke ${value} detik`)
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 detik</SelectItem>
                        <SelectItem value="5">5 detik</SelectItem>
                        <SelectItem value="10">10 detik</SelectItem>
                        <SelectItem value="30">30 detik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Shield className="h-5 w-5" />
                Privasi & Keamanan
              </CardTitle>
              <CardDescription>
                Pengaturan keamanan dan privasi data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TwoFactorSetup />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Session Timeout</h4>
                  <p className="text-sm text-app-text-secondary">Logout otomatis setelah tidak aktif</p>
                </div>
                <Select 
                  value={sessionTimeout.toString()} 
                  onValueChange={(value) => {
                    setSessionTimeout(parseInt(value))
                    toast.success(`Session timeout diubah ke ${value} menit`)
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 menit</SelectItem>
                    <SelectItem value="30">30 menit</SelectItem>
                    <SelectItem value="60">1 jam</SelectItem>
                    <SelectItem value="120">2 jam</SelectItem>
                    <SelectItem value="480">8 jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Global Logout</h4>
                  <p className="text-sm text-app-text-secondary">Logout dari semua perangkat sekaligus</p>
                </div>
                <Button 
                  onClick={handleGlobalLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Logout Semua'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Data Encryption</h4>
                  <p className="text-sm text-app-text-secondary">Enkripsi data dengan RLS Supabase</p>
                </div>
                <Badge variant="secondary">
                  <Shield className="h-3 w-3 mr-1" />
                  Aktif
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Data Management */}
          <BackupSettings />

          {/* Data Export */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Database className="h-5 w-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download data project untuk keperluan migrasi atau backup manual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-app-text-primary">Ekspor Semua Data</h4>
                  <p className="text-sm text-app-text-secondary">Download semua data project dalam format JSON</p>
                </div>
                <Button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Mengekspor...' : 'Ekspor'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Tindakan yang tidak dapat dibatalkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-400">Hapus Akun</h4>
                  <p className="text-sm text-app-text-secondary">
                    Hapus akun dan semua data secara permanen. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <Button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}