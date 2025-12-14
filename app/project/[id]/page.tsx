'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'
import { useProjectStore } from '@/lib/store/project-store'
import { createClient } from '@/lib/supabase/client'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { ProjectHeader } from '@/components/project/project-header'
import { ProjectTabs } from '@/components/project/project-tabs'
import { Project } from '@/lib/types/database'
import { toast } from 'sonner'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { user, isLoading: authLoading } = useAuthStore()
  const { currentProject, setCurrentProject } = useProjectStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && params.id) {
      loadProject()
    }
  }, [user, authLoading, params.id, router])

  const loadProject = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Project tidak ditemukan')
          router.push('/dashboard')
        } else {
          toast.error('Gagal memuat project')
          console.error(error)
        }
      } else {
        setCurrentProject(data)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat project')
      console.error(error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <DashboardHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user || !currentProject) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <DashboardHeader />
      <ProjectHeader project={currentProject} onUpdate={loadProject} />
      <main className="container mx-auto px-4 py-6">
        <ProjectTabs project={currentProject} />
      </main>
    </div>
  )
}