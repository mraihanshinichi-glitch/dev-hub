'use client'

import { useState } from 'react'
import { useProjectStore } from '@/lib/store/project-store'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Project } from '@/lib/types/database'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

interface DeleteProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { removeProject } = useProjectStore()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (error) {
        toast.error('Gagal menghapus project')
        console.error(error)
      } else {
        removeProject(project.id)
        toast.success('Project berhasil dihapus!')
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus project')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-red-400">Hapus Project</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-300 mb-4">
            Anda yakin ingin menghapus project <strong>"{project.name}"</strong>?
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-300">
              <strong>Peringatan:</strong> Semua data termasuk notes, fitur, release, 
              dan chat AI akan dihapus secara permanen.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}