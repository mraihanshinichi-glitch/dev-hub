'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Project, Feature } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FeatureCard } from '@/components/project/feature-card'
import { CreateFeatureDialog } from '@/components/project/create-feature-dialog'
import { useSettings } from '@/lib/hooks/use-settings'
import { toast } from 'sonner'
import { Plus, Zap, ListTodo, Clock, CheckCircle, Filter } from 'lucide-react'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

interface FeaturesTabProps {
  project: Project
}

export function FeaturesTab({ project }: FeaturesTabProps) {
  const { featureCategories } = useSettings()
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    loadFeatures()
  }, [project.id])

  const loadFeatures = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('project_id', project.id)
        .order('order_index')

      if (error) {
        toast.error('Gagal memuat fitur')
        console.error(error)
      } else {
        setFeatures(data || [])
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat fitur')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureCreated = (newFeature: Feature) => {
    setFeatures(prev => [...prev, newFeature])
  }

  const handleFeatureUpdated = (updatedFeature: Feature) => {
    setFeatures(prev => 
      prev.map(f => f.id === updatedFeature.id ? updatedFeature : f)
    )
  }

  const handleFeatureDeleted = (featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId))
  }

  const getFeaturesByStatus = (status: string) => {
    const filtered = selectedCategory === 'all' 
      ? features 
      : features.filter(f => f.category === selectedCategory)
    return filtered.filter(f => f.status === status)
  }

  const getFilteredFeatures = () => {
    return selectedCategory === 'all' 
      ? features 
      : features.filter(f => f.category === selectedCategory)
  }

  const getStatusStats = () => {
    const filteredFeatures = getFilteredFeatures()
    const planned = filteredFeatures.filter(f => f.status === 'planned').length
    const inProgress = filteredFeatures.filter(f => f.status === 'in-progress').length
    const done = filteredFeatures.filter(f => f.status === 'done').length
    
    return { planned, inProgress, done, total: filteredFeatures.length }
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
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-app-text-primary">Features</h2>
            <p className="text-sm text-app-text-secondary">
              Kelola fitur dengan status dan due date
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
                {featureCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fitur
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-app-text-secondary" />
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
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-app-text-secondary">Dikerjakan</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card className="app-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-app-text-secondary">Selesai</span>
            </div>
            <div className="text-2xl font-bold text-app-text-primary mt-1">
              {stats.done}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features by Status */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Planned */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <h3 className="font-semibold text-app-text-primary">Direncanakan</h3>
            <Badge variant="secondary" className="text-xs">
              {getFeaturesByStatus('planned').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {getFeaturesByStatus('planned').map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onUpdate={handleFeatureUpdated}
                onDelete={handleFeatureDeleted}
              />
            ))}
            
            {getFeaturesByStatus('planned').length === 0 && (
              <Card className="bg-gray-900/30 border-gray-800 border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-app-text-muted">Belum ada fitur yang direncanakan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* In Progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-app-text-primary">Sedang Dikerjakan</h3>
            <Badge variant="secondary" className="text-xs">
              {getFeaturesByStatus('in-progress').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {getFeaturesByStatus('in-progress').map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onUpdate={handleFeatureUpdated}
                onDelete={handleFeatureDeleted}
              />
            ))}
            
            {getFeaturesByStatus('in-progress').length === 0 && (
              <Card className="bg-gray-900/30 border-gray-800 border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-app-text-muted">Belum ada fitur yang dikerjakan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Done */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h3 className="font-semibold text-app-text-primary">Selesai</h3>
            <Badge variant="secondary" className="text-xs">
              {getFeaturesByStatus('done').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {getFeaturesByStatus('done').map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onUpdate={handleFeatureUpdated}
                onDelete={handleFeatureDeleted}
              />
            ))}
            
            {getFeaturesByStatus('done').length === 0 && (
              <Card className="bg-gray-900/30 border-gray-800 border-dashed">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-app-text-muted">Belum ada fitur yang selesai</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {getFilteredFeatures().length === 0 && features.length > 0 && (
        <Card className="bg-gray-900/30 border-gray-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-app-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              Tidak ada fitur dengan kategori "{selectedCategory}"
            </h3>
            <p className="text-app-text-secondary mb-6 max-w-md mx-auto">
              Coba pilih kategori lain atau tambah fitur baru dengan kategori ini.
            </p>
            <Button onClick={() => setSelectedCategory('all')} variant="outline">
              Tampilkan Semua Kategori
            </Button>
          </CardContent>
        </Card>
      )}

      {features.length === 0 && (
        <Card className="bg-gray-900/30 border-gray-800 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-app-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-app-text-primary mb-2">
              Belum ada fitur
            </h3>
            <p className="text-app-text-secondary mb-6 max-w-md mx-auto">
              Mulai dengan menambahkan fitur pertama untuk project ini. 
              Anda bisa mengatur status dan due date untuk setiap fitur.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Fitur Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateFeatureDialog
        project={project}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleFeatureCreated}
      />
    </div>
  )
}