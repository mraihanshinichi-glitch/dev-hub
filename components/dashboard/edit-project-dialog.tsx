'use client'

import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Project } from '@/lib/types/database'
import { toast } from 'sonner'

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { updateProject } = useProjectStore()
  const supabase = createClient()

  useEffect(() => {
    if (open && project) {
      setName(project.name)
      setDescription(project.description)
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          name: name.trim() || 'Untitled Project',
          description: description.trim(),
        })
        .eq('id', project.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengupdate project')
        console.error(error)
      } else {
        updateProject(project.id, data)
        toast.success('Project berhasil diupdate!')
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate project')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update nama dan deskripsi project Anda.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Project</Label>
            <Input
              id="name"
              placeholder="Masukkan nama project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsikan project Anda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {description.length}/500 karakter
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}