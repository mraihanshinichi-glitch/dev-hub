'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'
import { useProjectStore } from '@/lib/store/project-store'
import { createClient } from '@/lib/supabase/client'
import { ProjectTemplate } from '@/lib/types/templates'
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
import { TemplateSelection } from './template-selection'
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
  const [step, setStep] = useState<'template' | 'form'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { user } = useAuthStore()
  const { addProject, removeProject, replaceProject } = useProjectStore()
  const supabase = createClient()

  const createProjectFromTemplate = async (projectData: any) => {
    if (!selectedTemplate) return projectData

    try {
      // Create notes from template
      if (selectedTemplate.notes.length > 0) {
        const notesData = selectedTemplate.notes.map(note => ({
          project_id: projectData.id,
          user_id: user!.id,
          title: note.title,
          category: note.category,
          content: note.content,
        }))

        const { error: notesError } = await supabase
          .from('notes')
          .insert(notesData)

        if (notesError) {
          console.error('Error creating template notes:', notesError)
        }
      }

      // Create features from template
      if (selectedTemplate.features.length > 0) {
        const featuresData = selectedTemplate.features.map((feature, index) => ({
          project_id: projectData.id,
          title: feature.title,
          description: feature.description,
          category: feature.category,
          status: feature.status,
          order_index: index,
        }))

        const { error: featuresError } = await supabase
          .from('features')
          .insert(featuresData)

        if (featuresError) {
          console.error('Error creating template features:', featuresError)
        }
      }

      // Create releases from template
      if (selectedTemplate.releases && selectedTemplate.releases.length > 0) {
        const releasesData = selectedTemplate.releases.map(release => ({
          project_id: projectData.id,
          version: release.version,
          notes: release.notes,
          category: release.category,
          status: release.status,
        }))

        const { error: releasesError } = await supabase
          .from('releases')
          .insert(releasesData)

        if (releasesError) {
          console.error('Error creating template releases:', releasesError)
        }
      }

      return projectData
    } catch (error) {
      console.error('Error creating template content:', error)
      return projectData
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !selectedSlot) return

    setIsLoading(true)

    const projectName = name.trim() || (selectedTemplate ? selectedTemplate.name : 'Untitled Project')
    const projectDescription = description.trim() || (selectedTemplate ? selectedTemplate.description : '')
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
      toast.success(selectedTemplate ? 'Membuat project dari template...' : 'Membuat project...')

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
        // Create template content if template is selected
        const finalProjectData = await createProjectFromTemplate(data)
        
        // Replace temp project with real data
        replaceProject(tempId, finalProjectData)
        toast.success(selectedTemplate ? 'Project dari template berhasil dibuat!' : 'Project berhasil dibuat!')
        onSuccess()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat project')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate | null) => {
    setSelectedTemplate(template)
    if (template) {
      setName(template.name)
      setDescription(template.description)
    }
    setStep('form')
  }

  const handleClose = () => {
    setStep('template')
    setSelectedTemplate(null)
    setName('')
    setDescription('')
    setSelectedSlot('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        {step === 'template' ? (
          <>
            <DialogHeader>
              <DialogTitle>Buat Project Baru</DialogTitle>
              <DialogDescription>
                Pilih template untuk memulai atau buat project custom
              </DialogDescription>
            </DialogHeader>
            <TemplateSelection
              onSelectTemplate={handleTemplateSelect}
              onBack={handleClose}
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate ? (
                  <span className="flex items-center gap-2">
                    {selectedTemplate.icon} {selectedTemplate.name}
                  </span>
                ) : (
                  'Project Custom'
                )}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate 
                  ? 'Sesuaikan detail project dari template'
                  : 'Buat project baru untuk mulai mengelola fitur dan release Anda'
                }
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

              {selectedTemplate && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm text-blue-200">
                    <strong>Template akan menambahkan:</strong> {selectedTemplate.notes.length} notes, {selectedTemplate.features.length} features
                    {selectedTemplate.releases && `, ${selectedTemplate.releases.length} releases`}
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep('template')}>
                  Kembali
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}