'use client'

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Project, Feature } from '@/lib/types/database'
import { toast } from 'sonner'

interface CreateFeatureDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (feature: Feature) => void
}

export function CreateFeatureDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: CreateFeatureDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('planned')
  const [dueDate, setDueDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Judul fitur harus diisi')
      return
    }

    setIsLoading(true)

    try {
      // Get the highest order_index
      const { data: existingFeatures } = await supabase
        .from('features')
        .select('order_index')
        .eq('project_id', project.id)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingFeatures && existingFeatures.length > 0 
        ? existingFeatures[0].order_index + 1 
        : 0

      const { data, error } = await supabase
        .from('features')
        .insert({
          project_id: project.id,
          title: title.trim(),
          description: description.trim(),
          status,
          due_date: dueDate || null,
          order_index: nextOrderIndex,
        })
        .select()
        .single()

      if (error) {
        toast.error('Gagal membuat fitur')
        console.error(error)
      } else {
        onSuccess(data)
        toast.success('Fitur berhasil dibuat!')
        handleClose()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat fitur')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setStatus('planned')
    setDueDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Fitur Baru</DialogTitle>
          <DialogDescription>
            Buat fitur baru untuk project {project.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Fitur *</Label>
            <Input
              id="title"
              placeholder="Contoh: User Authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Deskripsikan fitur ini secara detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500">
              {description.length}/1000 karakter
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Direncanakan</SelectItem>
                  <SelectItem value="in-progress">Sedang Dikerjakan</SelectItem>
                  <SelectItem value="done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Opsional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Membuat...' : 'Buat Fitur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}