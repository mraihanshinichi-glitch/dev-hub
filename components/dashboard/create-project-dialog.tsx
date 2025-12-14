'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableSlots: number[]
  onSuccess: () => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  availableSlots,
  onSuccess,
}: CreateProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuthStore()
  const { addProject, removeProject, replaceProject } = useProjectStore()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !selectedSlot) return

    setIsLoading(true)

    const projectName = name.trim() || 'Untitled Project'
    const projectDescription = description.trim()
    const slotNumber = parseInt(selectedSlot)

    // Optimistic update - create temporary project object
    const tempId = `temp-${Date.now()}`
    const tempProject = {
      id: tempId,
      user_id: user.id,
      name: projectName,
      description: projectDescription,
      slot_number: slotNumber,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      // Add optimistic project to store immediately
      addProject(tempProject)
      
      // Close dialog for better UX
      handleClose()
      toast.success('Membuat project...')

      // Add timeout to prevent hanging
      const insertPromise = supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectName,
          description: projectDescription,
          slot_number: slotNumber,
        })
        .select()
        .single()

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )

      const { data, error } = await Promise.race([insertPromise, timeoutPromise]) as any

      if (error) {
        // Remove optimistic project and show error
        removeProject(tempId)
        toast.error('Gagal membuat project')
        console.error(error)
      } else {
        // Replace temp project with real data
        replaceProject(tempId, data)
        toast.success('Project berhasil dibuat!')
        onSuccess()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat project')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setSelectedSlot('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Project Baru</DialogTitle>
          <DialogDescription>
            Buat project baru untuk mulai mengelola fitur dan release Anda.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slot">Pilih Slot</Label>
            <Select value={selectedSlot} onValueChange={setSelectedSlot} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih slot yang tersedia" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot.toString()}>
                    Slot {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading || !selectedSlot}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Membuat...
                </>
              ) : (
                'Buat Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}