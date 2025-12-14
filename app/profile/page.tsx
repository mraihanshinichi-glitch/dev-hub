'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { useHydrated } from '@/lib/hooks/use-hydrated'
import { createClient } from '@/lib/supabase/client'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, User, Mail, Calendar, Save, Settings, Shield } from 'lucide-react'
import { ChangePasswordDialog } from '@/components/profile/change-password-dialog'
import { SimpleAvatarUpload } from '@/components/profile/simple-avatar-upload'

import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function ProfilePage() {
  const hydrated = useHydrated()
  const { user, profile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const router = useRouter()
  const supabase = createClient()

  if (!hydrated) {
    return <div>Loading...</div>
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengupdate profile')
        console.error(error)
      } else {
        setProfile(data)
        toast.success('Profile berhasil diupdate!')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate profile')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f1a]">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
            <p className="text-slate-600 dark:text-gray-400">Kelola informasi profile Anda</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Info Card */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <User className="h-5 w-5" />
                Informasi Profile
              </CardTitle>
              <CardDescription>
                Update informasi dasar profile Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                  <AvatarFallback className="bg-primary text-app-text-primary text-xl">
                    {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-app-text-primary">{profile?.full_name || 'User'}</h3>
                  <p className="text-sm text-app-text-secondary">{user.email}</p>
                  <SimpleAvatarUpload />
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-800 text-app-text-secondary"
                  />
                  <p className="text-xs text-app-text-muted">
                    Email tidak dapat diubah
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Mail className="h-5 w-5" />
                Informasi Akun
              </CardTitle>
              <CardDescription>
                Detail akun dan statistik
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-app-text-secondary">User ID</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-app-text-primary font-mono bg-gray-800 p-2 rounded flex-1">
                      {user.id}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id)
                        toast.success('User ID disalin ke clipboard')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-app-text-secondary">Bergabung Sejak</Label>
                  <p className="text-sm text-app-text-primary mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-app-text-secondary">Email Verified</Label>
                  <p className="text-sm text-app-text-primary mt-1">
                    {user.email_confirmed_at ? (
                      <span className="text-green-400">✓ Terverifikasi</span>
                    ) : (
                      <span className="text-yellow-400">⚠ Belum terverifikasi</span>
                    )}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-app-text-secondary">Last Sign In</Label>
                  <p className="text-sm text-app-text-primary mt-1">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="app-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-app-text-primary">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Aksi cepat untuk mengelola akun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Buka Pengaturan
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => router.push('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Dashboard
                </Button>
                
                <ChangePasswordDialog />
                
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    const email = 'support@devhub.com'
                    const subject = 'Bantuan DevHub'
                    const body = `Halo, saya membutuhkan bantuan dengan akun saya.\n\nUser ID: ${user.id}\nEmail: ${user.email}`
                    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Hubungi Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}