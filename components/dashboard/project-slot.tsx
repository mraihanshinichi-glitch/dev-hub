'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/lib/types/database'
import { formatDate } from '@/lib/utils'
import { MoreVertical, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react'
import { EditProjectDialog } from './edit-project-dialog'
import { DeleteProjectDialog } from './delete-project-dialog'

interface ProjectSlotProps {
  project: Project
  onRefresh: () => void
}

export function ProjectSlot({ project, onRefresh }: ProjectSlotProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const handleOpenProject = () => {
    // Don't allow opening temporary projects
    if (project.id.startsWith('temp-')) {
      return
    }
    router.push(`/project/${project.id}`)
  }

  const isTemporary = project.id.startsWith('temp-')

  return (
    <>
      <Card className={`project-slot bg-white dark:bg-gray-900/50 border-slate-200 dark:border-gray-800 hover:border-primary/50 transition-colors group ${
        isTemporary ? 'opacity-75' : 'cursor-pointer'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  Slot {project.slot_number}
                </Badge>
                {isTemporary && (
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                    Membuat...
                  </Badge>
                )}
              </div>
              <CardTitle 
                className={`text-lg text-slate-900 dark:text-white truncate transition-colors ${
                  !isTemporary ? 'group-hover:text-primary cursor-pointer' : ''
                }`}
                onClick={handleOpenProject}
              >
                {project.name}
              </CardTitle>
            </div>
            {!isTemporary && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleOpenProject}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buka Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-400 focus:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-3 min-h-[3rem]">
            {project.description || 'Belum ada deskripsi'}
          </CardDescription>
          
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.created_at)}</span>
            </div>
            {!isTemporary && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-primary hover:text-primary-hover"
                onClick={handleOpenProject}
              >
                Buka
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EditProjectDialog
        project={project}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onRefresh}
      />

      <DeleteProjectDialog
        project={project}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={onRefresh}
      />
    </>
  )
}