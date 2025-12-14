'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Project } from '@/lib/types/database'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MoreVertical, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react'
import { EditProjectDialog } from '@/components/dashboard/edit-project-dialog'
import { DeleteProjectDialog } from '@/components/dashboard/delete-project-dialog'

interface ProjectHeaderProps {
  project: Project
  onUpdate: () => void
}

export function ProjectHeader({ project, onUpdate }: ProjectHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const handleProjectDeleted = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <div className="border-b border-gray-800 bg-[#12121e]/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mt-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Slot {project.slot_number}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Dibuat {formatDate(project.created_at)}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                
                {project.description && (
                  <p className="text-gray-400 max-w-2xl">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <EditProjectDialog
        project={project}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <DeleteProjectDialog
        project={project}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleProjectDeleted}
      />
    </>
  )
}