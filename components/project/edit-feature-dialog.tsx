'use client'

import { useState, useEffect } from 'react'
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
import { Feature } from '@/lib/types/database'
import { useSettings } from '@/lib/hooks/use-settings'
import { toast } from 'sonner'

interface EditFeatureDialogProps {
  feature: Feature
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (feature: Feature) => void
}

export function EditFeatureDialog({
  feature,
  open,
  onOpenChange,
  onSuccess,
}: EditFeatureDialogProps) {
  const { featureCategories } = useSettings()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('feature')
  const [status, setStatus] = useState('planned')
  const [dueDate, setDueDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (open && feature) {
      setTitle(feature.title)
      setDescription(feature.description)
      setCategory(feature.category || 'feature')
      setStatus(feature.status)
      setDueDate(feature.due_date || '')
    }
  }, [open, feature])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Judul fitur harus diisi')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('features')
        .update({
          title: title.trim(),
          description: description.trim(),
          category,
          status,
          due_date: dueDate || null,
        })
        .eq('id', feature.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengupdate fitur')
        console.error(error)
      } else {
        onSuccess(data)
        toast.success('Fitur berhasil diupdate!')
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate fitur')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Fitur</DialogTitle>
          <DialogDescription>
            Update informasi fitur
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
            <Label htmlFor="description">Deskripsi</Label>
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

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {featureCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
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