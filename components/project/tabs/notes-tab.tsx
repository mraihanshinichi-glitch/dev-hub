'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth-store'
import { Project, Note } from '@/lib/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSettings } from '@/lib/hooks/use-settings'
import { toast } from 'sonner'
import { Plus, FileText, Clock, Edit, Trash2, Search } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { NoteEditor } from '../note-editor'

interface NotesTabProps {
  project: Project
}

export function NotesTab({ project }: NotesTabProps) {
  const { user } = useAuthStore()
  const { noteCategories } = useSettings()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteCategory, setNewNoteCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadNotes()
  }, [project.id])

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const loadNotes = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('project_id', project.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading notes:', error)
        toast.error('Gagal memuat notes')
      } else {
        setNotes(data || [])
        // Select first note if none selected
        if (data && data.length > 0 && !selectedNote) {
          setSelectedNote(data[0])
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error)
      toast.error('Terjadi kesalahan saat memuat notes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!user || !newNoteTitle.trim()) return

    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          project_id: project.id,
          user_id: user.id,
          title: newNoteTitle.trim(),
          category: newNoteCategory,
          content: { type: 'doc', content: [{ type: 'paragraph' }] }
        })
        .select()
        .single()

      if (error) {
        toast.error('Gagal membuat note')
        console.error('Error creating note:', error)
      } else {
        setNotes(prev => [data, ...prev])
        setSelectedNote(data)
        setNewNoteTitle('')
        setNewNoteCategory('general')
        setShowCreateDialog(false)
        toast.success('Note berhasil dibuat')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat note')
      console.error('Error creating note:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!noteToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteToDelete.id)

      if (error) {
        toast.error('Gagal menghapus note')
        console.error('Error deleting note:', error)
      } else {
        setNotes(prev => prev.filter(n => n.id !== noteToDelete.id))
        if (selectedNote?.id === noteToDelete.id) {
          const remainingNotes = notes.filter(n => n.id !== noteToDelete.id)
          setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null)
        }
        setShowDeleteDialog(false)
        setNoteToDelete(null)
        toast.success('Note berhasil dihapus')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus note')
      console.error('Error deleting note:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n))
    setSelectedNote(updatedNote)
  }

  if (isLoading) {
    return (
      <Card className="app-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Notes List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-app-text-primary">Notes</h2>
            <p className="text-sm text-app-text-secondary">
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Buat Note
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-app-text-muted" />
          <Input
            placeholder="Cari notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Notes List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <Card className="app-card">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-app-text-muted mx-auto mb-3" />
                <p className="text-app-text-secondary">
                  {notes.length === 0 ? 'Belum ada notes' : 'Tidak ada notes yang cocok'}
                </p>
                {notes.length === 0 && (
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Note Pertama
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => (
              <Card 
                key={note.id} 
                className={`note-item app-card cursor-pointer transition-colors ${
                  selectedNote?.id === note.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-app-text-primary truncate">
                          {note.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {note.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-app-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{formatDateTime(note.updated_at)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setNoteToDelete(note)
                        setShowDeleteDialog(true)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="lg:col-span-2">
        {selectedNote ? (
          <NoteEditor 
            note={selectedNote} 
            onUpdate={handleNoteUpdate}
          />
        ) : (
          <Card className="app-card h-full">
            <CardContent className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-16 w-16 text-app-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-app-text-primary mb-2">
                  Pilih Note untuk Diedit
                </h3>
                <p className="text-app-text-secondary mb-4">
                  Pilih note dari daftar di sebelah kiri atau buat note baru
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Note Baru
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Note Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Note Baru</DialogTitle>
            <DialogDescription>
              Buat note baru untuk project ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-app-text-primary">
                Judul Note
              </Label>
              <Input
                placeholder="Masukkan judul note..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-app-text-primary">
                Kategori
              </Label>
              <Select value={newNoteCategory} onValueChange={setNewNoteCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {noteCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateDialog(false)
                setNewNoteTitle('')
                setNewNoteCategory('general')
              }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleCreateNote}
              disabled={!newNoteTitle.trim() || isCreating}
            >
              {isCreating ? 'Membuat...' : 'Buat Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Note Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Note</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus note "{noteToDelete?.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false)
                setNoteToDelete(null)
              }}
            >
              Batal
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteNote}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}