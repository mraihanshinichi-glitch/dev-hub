'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Project, Release } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReleaseCard } from '@/components/project/release-card'
import { CreateReleaseDialog } from '@/components/project/create-release-dialog'
import { useSettings } from '@/lib/hooks/use-settings'
import { toast } from 'sonner'
import { Plus, Rocket, Calendar, Package, CheckCircle, Filter } from 'lucide-react'

interface ReleasesTabProps {
  project: Project
}

export function ReleasesTab({ project }: ReleasesTabProps) {
  const { releaseCategories } = useSettings()
  const [releases, setReleases] = useState<Release[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    loadReleases()
  }, [project.id])

  const loadReleases = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Gagal memuat release')
        console.error(error)
      } else {
        setReleases(data || [])
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat release')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReleaseCreated = (newRelease: Release) => {
    setReleases(prev => [newRelease, ...prev])
  }

  const handleReleaseUpdated = (updatedRelease: Release) => {
    setReleases(prev => 
      prev.map(r => r.id === updatedRelease.id ? updatedRelease : r)
    )
  }

  const handleReleaseDeleted = (releaseId: string) => {
    setReleases(prev => prev.filter(r => r.id !== releaseId))
  }

  const getFilteredReleases = () => {
    return selectedCategory === 'all' 
      ? releases 
      : releases.filter(r => r.category === selectedCategory)
  }

  const getReleasesByStatus = (status: string) => {
    const filtered = getFilteredReleases()
    return filtered.filter(r => r.status === status)
  }

  const getStatusStats = () => {
    const filteredReleases = getFilteredReleases()
    const planned = filteredReleases.filter(r => r.status === 'planned').length
    const upcoming = filteredReleases.filter(r => r.status === 'upcoming').length
    const released = filteredReleases.filter(r => r.status === 'released').length
    
    return { planned, upcoming, released, total: filteredReleases.length }
  }

  const stats = getStatusStats()

  if (isLoading) {
    return (
      <Card className="app-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-app-text-primary">Releases</h2>
            <p className="text-sm text-app-text-secondary">
              Timeline release dan update project
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-app-text-secondary" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {releaseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Release
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-app-text-secondary" />
              <span className="text-sm text-app-text-secondary">Total</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full" />
              <span className="text-sm text-app-text-secondary">Direncanakan</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.planned}
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-app-text-secondary">Akan Datang</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.upcoming}
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-app-text-secondary">Dirilis</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.released}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State for Filtered Category */}
      {getFilteredReleases().length === 0 && releases.length > 0 && (
        <Card className="bg-gray-900/30 border-gray-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-app-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              Tidak ada release dengan kategori "{selectedCategory}"
            </h3>
            <p className="text-app-text-secondary mb-6 max-w-md mx-auto">
              Coba pilih kategori lain atau tambah release baru dengan kategori ini.
            </p>
            <Button onClick={() => setSelectedCategory('all')} variant="outline">
              Tampilkan Semua Kategori
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Releases Timeline */}
      {getFilteredReleases().length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-app-text-primary">Timeline Release</h3>
          
          <div className="space-y-4">
            {getFilteredReleases().map((release, index) => (
              <ReleaseCard
                key={release.id}
                release={release}
                isLast={index === getFilteredReleases().length - 1}
                onUpdate={handleReleaseUpdated}
                onDelete={handleReleaseDeleted}
              />
            ))}
          </div>
        </div>
      ) : releases.length === 0 ? (
        /* Empty State */
        <Card className="bg-gray-900/30 border-gray-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-app-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              Belum ada release
            </h3>
            <p className="text-app-text-secondary mb-6 max-w-md mx-auto">
              Mulai dengan membuat release pertama untuk project ini. 
              Anda bisa merencanakan versi dan target tanggal rilis.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Release Pertama
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Progress Indicator */}
      {getFilteredReleases().length > 0 && (
        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Progress Release</span>
              <span className="text-sm text-app-text-secondary">
                {stats.released}/{stats.total} dirilis
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: stats.total > 0 ? `${(stats.released / stats.total) * 100}%` : '0%' 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-app-text-muted mt-1">
              <span>{stats.planned} direncanakan</span>
              <span>{stats.upcoming} akan datang</span>
              <span>{stats.released} dirilis</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Rocket className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-300 mb-1">Tips Mengelola Release</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Hover pada release card untuk melihat tombol quick action (← →)</li>
                <li>• Klik release card lalu gunakan keyboard: ← → atau 1-3 untuk ubah status</li>
                <li>• Klik dropdown menu untuk akses langsung ke semua status</li>
                <li>• Status "Dirilis" otomatis mencatat tanggal release</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateReleaseDialog
        project={project}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleReleaseCreated}
      />
    </div>
  )
}