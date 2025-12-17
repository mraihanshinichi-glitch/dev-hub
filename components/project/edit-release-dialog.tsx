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
import { Release } from '@/lib/types/database'
import { useSettings } from '@/lib/hooks/use-settings'
import { toast } from 'sonner'

interface EditReleaseDialogProps {
  release: Release
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (release: Release) => void
}

export function EditReleaseDialog({
  release,
  open,
  onOpenChange,
  onSuccess,
}: EditReleaseDialogProps) {
  const { releaseCategories } = useSettings()
  const [version, setVersion] = useState('')
  const [notes, setNotes] = useState('')
  const [category, setCategory] = useState('major')
  const [status, setStatus] = useState('planned')
  const [targetDate, setTargetDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (open && release) {
      setVersion(release.version)
      setNotes(release.notes)
      setCategory(release.category || 'major')
      setStatus(release.status)
      setTargetDate(release.target_date || '')
    }
  }, [open, release])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!version.trim()) {
      toast.error('Versi release harus diisi')
      return
    }

    setIsLoading(true)

    try {
      const updateData: any = {
        version: version.trim(),
        notes: notes.trim(),
        category,
        status,
        target_date: targetDate || null,
      }

      // If status changed to released and wasn't released before, set released_at
      if (status === 'released' && release.status !== 'released') {
        updateData.released_at = new Date().toISOString()
      }
      // If status changed from released to something else, clear released_at
      else if (status !== 'released' && release.status === 'released') {
        updateData.released_at = null
      }

      const { data, error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', release.id)
        .select()
        .single()

      if (error) {
        toast.error('Gagal mengupdate release')
        console.error(error)
      } else {
        onSuccess(data)
        toast.success('Release berhasil diupdate!')
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupdate release')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Release</DialogTitle>
          <DialogDescription>
            Update informasi release
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="version">Versi Release *</Label>
            <Input
              id="version"
              placeholder="Contoh: 1.0.0, v2.1, Beta 1"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Release</Label>
            <Textarea
              id="notes"
              placeholder="Deskripsi fitur baru, bug fixes, atau perubahan lainnya..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500">
              {notes.length}/1000 karakter
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {releaseCategories.map((cat) => (
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
                  <SelectItem value="upcoming">Akan Datang</SelectItem>
                  <SelectItem value="released">Dirilis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
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