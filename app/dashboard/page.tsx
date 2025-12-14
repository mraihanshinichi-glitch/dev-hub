'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { useProjectStore } from '@/lib/store/project-store'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectSlot } from '@/components/dashboard/project-slot'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Plus, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { Project } from '@/lib/types/database'
import { LoadingPage } from '@/components/ui/loading-spinner'

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuthStore()
  const { projects, setProjects, setLoading } = useProjectStore()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Fallback redirect if middleware didn't catch it
    if (!authLoading && !user) {
      console.log('No user detected, redirecting to login...')
      router.replace('/auth/login')
      return
    }

    if (user && projects.length === 0) {
      loadProjects()
    }
  }, [user, authLoading, router])

  const loadProjects = async (force = false) => {
    if (!user) return
    
    // Don't reload if we already have projects unless forced
    if (!force && projects.length > 0) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('slot_number')

      if (error) {
        toast.error('Gagal memuat project')
        console.error(error)
      } else {
        setProjects(data || [])
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat project')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Function to refresh projects (for cases where we really need fresh data)
  const refreshProjects = () => loadProjects(true)

  const getAvailableSlots = () => {
    const usedSlots = projects.map(p => p.slot_number)
    const availableSlots = []
    
    for (let i = 1; i <= 5; i++) {
      if (!usedSlots.includes(i)) {
        availableSlots.push(i)
      }
    }
    
    return availableSlots
  }

  const handleCreateProject = (slotNumber: number) => {
    setShowCreateDialog(true)
  }

  // Show loading only if we're still determining auth state
  if (authLoading) {
    return <LoadingPage message="Memuat dashboard..." />
  }

  // If no user, redirect will happen via middleware or useEffect
  if (!user) {
    return <LoadingPage message="Mengalihkan ke login..." />
  }

  const availableSlots = getAvailableSlots()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f0f1a]">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Selamat datang kembali! 👋
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Kelola hingga 5 project sekaligus dengan sistem slot yang terorganisir
          </p>
        </div>

        {/* Project Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Existing Projects */}
          {projects.map((project) => (
            <ProjectSlot
              key={project.id}
              project={project}
              onRefresh={refreshProjects}
            />
          ))}

          {/* Empty Slots */}
          {availableSlots.map((slotNumber) => (
            <Card
              key={`empty-${slotNumber}`}
              className="bg-slate-100/50 dark:bg-gray-900/30 border-slate-300 dark:border-gray-800 border-dashed hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => handleCreateProject(slotNumber)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-48 text-center">
                <div className="w-12 h-12 bg-slate-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-6 w-6 text-slate-600 dark:text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-700 dark:text-gray-300 mb-2">Slot {slotNumber}</h3>
                <p className="text-sm text-slate-400 dark:text-gray-500 mb-4">Buat project baru</p>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code2 className="h-12 w-12 text-slate-600 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Belum ada project
            </h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Mulai perjalanan development Anda dengan membuat project pertama. 
              Anda bisa mengelola hingga 5 project sekaligus.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Buat Project Pertama
            </Button>
          </div>
        )}

        {/* Stats */}
        {projects.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="app-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Total Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {projects.length}/5
                </div>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                  Slot tersedia: {5 - projects.length}
                </p>
              </CardContent>
            </Card>

            <Card className="app-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Project Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {projects.length}
                </div>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                  Sedang dikerjakan
                </p>
              </CardContent>
            </Card>

            <Card className="app-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-gray-400">
                  Project Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {projects[projects.length - 1]?.name || 'Belum ada'}
                </div>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
                  Dibuat terakhir
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        availableSlots={availableSlots}
        onSuccess={() => {
          // No need to reload projects since we already added it to store
          // Just close the dialog and update available slots
        }}
      />
    </div>
  )
}